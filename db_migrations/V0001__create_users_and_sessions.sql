
CREATE TABLE IF NOT EXISTS t_p8308112_letter_messenger_app.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_color VARCHAR(7) DEFAULT '#9b5de5',
  status VARCHAR(50) DEFAULT 'Доступен',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p8308112_letter_messenger_app.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p8308112_letter_messenger_app.users(id),
  token VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p8308112_letter_messenger_app.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON t_p8308112_letter_messenger_app.sessions(user_id);
