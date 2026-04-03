"""
Авторизация Letter: регистрация, вход, выход, проверка сессии.
Все запросы идут на один URL, действие определяется полем action в теле.
action=register — создать аккаунт
action=login    — войти
action=logout   — выйти
action=me / GET — получить текущего пользователя
"""

import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p8308112_letter_messenger_app')
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    salt = 'letter_salt_2024'
    return hashlib.sha256(f'{salt}{password}'.encode()).hexdigest()


def make_token() -> str:
    return secrets.token_hex(48)


def ok(data: dict, status: int = 200) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    headers = event.get('headers') or {}
    token = headers.get('X-Session-Token', '')

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    qs = event.get('queryStringParameters') or {}
    action = body.get('action') or qs.get('action') or ('me' if method == 'GET' else '')

    # action=me — проверить сессию
    if action == 'me' or method == 'GET':
        if not token:
            return ok({'error': 'Не авторизован'}, 401)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT u.id, u.name, u.username, u.email, u.bio, u.status, u.avatar_color "
            f"FROM {SCHEMA}.sessions s "
            f"JOIN {SCHEMA}.users u ON u.id = s.user_id "
            f"WHERE s.token = %s AND s.expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return ok({'error': 'Сессия истекла'}, 401)
        return ok({'user': {
            'id': row[0], 'name': row[1], 'username': row[2],
            'email': row[3], 'bio': row[4], 'status': row[5], 'avatarColor': row[6],
        }})

    # action=register
    if action == 'register':
        name = (body.get('name') or '').strip()
        username = (body.get('username') or '').strip().lower()
        email = (body.get('email') or '').strip().lower()
        password = body.get('password', '')

        if not name or not username or not email or not password:
            return ok({'error': 'Заполните все поля'}, 400)
        if len(password) < 6:
            return ok({'error': 'Пароль минимум 6 символов'}, 400)
        if len(username) < 3:
            return ok({'error': 'Имя пользователя минимум 3 символа'}, 400)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s OR username = %s", (email, username))
        if cur.fetchone():
            conn.close()
            return ok({'error': 'Email или имя пользователя уже занято'}, 409)

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, username, email, password_hash) "
            f"VALUES (%s, %s, %s, %s) RETURNING id",
            (name, username, email, pw_hash)
        )
        user_id = cur.fetchone()[0]
        new_token = make_token()
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, new_token))
        conn.commit()
        conn.close()

        return ok({
            'token': new_token,
            'user': {'id': user_id, 'name': name, 'username': username, 'email': email,
                     'bio': '', 'status': 'Доступен', 'avatarColor': '#9b5de5'},
        })

    # action=login
    if action == 'login':
        login = (body.get('login') or '').strip().lower()
        password = body.get('password', '')

        if not login or not password:
            return ok({'error': 'Введите логин и пароль'}, 400)

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, username, email, bio, status, avatar_color "
            f"FROM {SCHEMA}.users WHERE (email = %s OR username = %s) AND password_hash = %s",
            (login, login, pw_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return ok({'error': 'Неверный логин или пароль'}, 401)

        user_id = row[0]
        new_token = make_token()
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user_id, new_token))
        cur.execute(f"UPDATE {SCHEMA}.users SET last_seen_at = NOW() WHERE id = %s", (user_id,))
        conn.commit()
        conn.close()

        return ok({
            'token': new_token,
            'user': {'id': row[0], 'name': row[1], 'username': row[2], 'email': row[3],
                     'bio': row[4], 'status': row[5], 'avatarColor': row[6]},
        })

    # action=logout
    if action == 'logout':
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return ok({'ok': True})

    return ok({'error': 'Неизвестное действие'}, 400)
