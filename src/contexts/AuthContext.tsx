import React, { createContext, useContext } from 'react';
import { useAuth, User, InviteCode } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (name: string, username: string, email: string, password: string, invite_code: string) => Promise<boolean>;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setError: (e: string | null) => void;
  checkInvite: (code: string) => Promise<{ valid: boolean; invitedBy?: string; error?: string }>;
  getMyInvites: () => Promise<InviteCode[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};