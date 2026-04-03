import { useState, useEffect, useCallback } from 'react';

const AUTH_URL = 'https://functions.poehali.dev/ad8cfa0c-7400-41c6-b7e7-23246a4843f6';
const TOKEN_KEY = 'letter_token';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  status: string;
  avatarColor: string;
}

export interface InviteCode {
  code: string;
  used: boolean;
  usedAt: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  const setError = (error: string | null) => setState(s => ({ ...s, error }));

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ user: null, loading: false, error: null });
      return;
    }
    fetch(AUTH_URL, { headers: { 'X-Session-Token': token } })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setState({ user: data.user, loading: false, error: null });
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setState({ user: null, loading: false, error: null });
        }
      })
      .catch(() => setState({ user: null, loading: false, error: null }));
  }, []);

  const checkInvite = useCallback(async (invite_code: string): Promise<{ valid: boolean; invitedBy?: string; error?: string }> => {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check_invite', invite_code }),
    });
    return res.json();
  }, []);

  const register = useCallback(async (
    name: string, username: string, email: string, password: string, invite_code: string
  ) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', name, username, email, password, invite_code }),
    });
    const data = await res.json();
    if (data.error) {
      setState(s => ({ ...s, loading: false, error: data.error }));
      return false;
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    setState({ user: data.user, loading: false, error: null });
    return true;
  }, []);

  const login = useCallback(async (login: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', login, password }),
    });
    const data = await res.json();
    if (data.error) {
      setState(s => ({ ...s, loading: false, error: data.error }));
      return false;
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    setState({ user: data.user, loading: false, error: null });
    return true;
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
        body: JSON.stringify({ action: 'logout' }),
      });
    }
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, loading: false, error: null });
  }, []);

  const getMyInvites = useCallback(async (): Promise<InviteCode[]> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return [];
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Session-Token': token },
      body: JSON.stringify({ action: 'my_invite' }),
    });
    const data = await res.json();
    return data.codes || [];
  }, []);

  return { ...state, register, login, logout, setError, checkInvite, getMyInvites };
}
