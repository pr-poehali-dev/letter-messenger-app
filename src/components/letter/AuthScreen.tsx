import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onRegister: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  onLogin: (login: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onRegister, onLogin, loading, error, clearError }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', username: '', email: '', login: '', password: '', confirm: '' });

  const set = (k: string, v: string) => { clearError(); setForm(f => ({ ...f, [k]: v })); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (form.password !== form.confirm) { return; }
      await onRegister(form.name, form.username, form.email, form.password);
    } else {
      await onLogin(form.login, form.password);
    }
  };

  const inputCls = "w-full bg-white/[0.07] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors text-white";

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: 'linear-gradient(-45deg, #0a0a1a, #120820, #0d1530, #130825)', backgroundSize: '400% 400%', animation: 'gradient-shift 12s ease infinite' }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, #9b5de5, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #f15bb5, transparent 70%)', animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #4cc9f0, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center font-caveat font-bold text-3xl text-white mb-3 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)', boxShadow: '0 0 40px rgba(155,93,229,0.4)' }}
          >
            L
          </div>
          <h1 className="font-caveat font-bold text-4xl gradient-text">Letter</h1>
          <p className="text-white/40 text-sm mt-1">мессенджер нового поколения</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-6 animate-scale-in"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(30px)',
          }}
        >
          {/* Tabs */}
          <div className="flex bg-white/[0.05] rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); clearError(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={mode === m ? {
                  background: 'linear-gradient(135deg, #9b5de5, #f15bb5)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(155,93,229,0.3)',
                } : { color: 'rgba(255,255,255,0.4)' }}
              >
                {m === 'login' ? 'Вход' : 'Регистрация'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <div className="relative">
                  <Icon name="User" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    className={`${inputCls} pl-11`}
                    placeholder="Имя и фамилия"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                  <input
                    className={`${inputCls} pl-9`}
                    placeholder="имя_пользователя"
                    value={form.username}
                    onChange={e => set('username', e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Icon name="Mail" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    className={`${inputCls} pl-11`}
                    placeholder="Email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="relative">
                <Icon name="Mail" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  className={`${inputCls} pl-11`}
                  placeholder="Email или имя пользователя"
                  value={form.login}
                  onChange={e => set('login', e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                className={`${inputCls} pl-11`}
                placeholder="Пароль"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  className={`${inputCls} pl-11`}
                  placeholder="Повторите пароль"
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  required
                />
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-xs text-red-400 mt-1 ml-1">Пароли не совпадают</p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm text-red-300 animate-fade-in"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <Icon name="AlertCircle" size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode === 'register' && form.password !== form.confirm)}
              className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)', boxShadow: '0 4px 20px rgba(155,93,229,0.35)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader" size={16} className="animate-spin" />
                  {mode === 'login' ? 'Входим...' : 'Создаём аккаунт...'}
                </span>
              ) : (
                mode === 'login' ? 'Войти' : 'Создать аккаунт'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Letter — приватный мессенджер. Данные защищены.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
