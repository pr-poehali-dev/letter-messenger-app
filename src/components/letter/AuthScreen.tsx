import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onRegister: (name: string, username: string, email: string, password: string, invite_code: string) => Promise<boolean>;
  onLogin: (login: string, password: string) => Promise<boolean>;
  onCheckInvite: (code: string) => Promise<{ valid: boolean; invitedBy?: string; error?: string }>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

type Step = 'login' | 'invite' | 'register';

const AuthScreen: React.FC<AuthScreenProps> = ({ onRegister, onLogin, onCheckInvite, loading, error, clearError }) => {
  const [step, setStep] = useState<Step>('login');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteChecking, setInviteChecking] = useState(false);
  const [invitedBy, setInvitedBy] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [form, setForm] = useState({ name: '', username: '', email: '', login: '', password: '', confirm: '' });

  const set = (k: string, v: string) => { clearError(); setForm(f => ({ ...f, [k]: v })); };

  const handleCheckInvite = async () => {
    if (!inviteCode.trim()) { setInviteError('Введите код приглашения'); return; }
    setInviteChecking(true);
    setInviteError('');
    const res = await onCheckInvite(inviteCode.trim());
    setInviteChecking(false);
    if (res.valid && res.invitedBy) {
      setInvitedBy(res.invitedBy);
      setStep('register');
    } else {
      setInviteError(res.error || 'Недействительный код');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'register') {
      if (form.password !== form.confirm) return;
      await onRegister(form.name, form.username, form.email, form.password, inviteCode.trim());
    } else if (step === 'login') {
      await onLogin(form.login, form.password);
    }
  };

  const inputCls = "w-full bg-white/[0.07] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors text-white";

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: 'linear-gradient(-45deg, #0a0a1a, #120820, #0d1530, #130825)', backgroundSize: '400% 400%', animation: 'gradient-shift 12s ease infinite' }}
    >
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

        <div
          className="rounded-3xl p-6 animate-scale-in"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)' }}
        >
          {/* ── Шаг 1: Вход ── */}
          {step === 'login' && (
            <>
              <div className="flex bg-white/[0.05] rounded-2xl p-1 mb-6">
                <button
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)', boxShadow: '0 4px 15px rgba(155,93,229,0.3)' }}
                >
                  Вход
                </button>
                <button
                  onClick={() => { setStep('invite'); clearError(); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all text-white/40"
                >
                  Регистрация
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
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
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm text-red-300 animate-fade-in"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <Icon name="AlertCircle" size={15} className="flex-shrink-0" />
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)', boxShadow: '0 4px 20px rgba(155,93,229,0.35)' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><Icon name="Loader" size={16} className="animate-spin" />Входим...</span>
                    : 'Войти'}
                </button>
              </form>
            </>
          )}

          {/* ── Шаг 2: Ввод инвайт-кода ── */}
          {step === 'invite' && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setStep('login')} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
                  <Icon name="ArrowLeft" size={16} />
                </button>
                <div>
                  <h3 className="font-bold text-base">Код приглашения</h3>
                  <p className="text-xs text-white/40">Letter доступен только по приглашению</p>
                </div>
              </div>

              {/* Иконка закрытого клуба */}
              <div className="flex flex-col items-center py-4 mb-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.25), rgba(241,91,181,0.15))' }}
                >
                  <Icon name="Ticket" size={30} className="text-purple-300" />
                </div>
                <p className="text-sm text-white/50 text-center max-w-[220px]">
                  Попросите друга в Letter поделиться инвайт-кодом
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    className={`${inputCls} text-center text-lg tracking-[0.25em] font-bold uppercase`}
                    placeholder="XXXXXXXX"
                    value={inviteCode}
                    onChange={e => { setInviteCode(e.target.value.toUpperCase().slice(0, 8)); setInviteError(''); }}
                    maxLength={8}
                  />
                </div>
                {inviteError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm text-red-300 animate-fade-in"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <Icon name="AlertCircle" size={15} className="flex-shrink-0" />
                    {inviteError}
                  </div>
                )}
                <button
                  onClick={handleCheckInvite}
                  disabled={inviteChecking || inviteCode.length < 6}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)', boxShadow: '0 4px 20px rgba(155,93,229,0.35)' }}
                >
                  {inviteChecking
                    ? <span className="flex items-center justify-center gap-2"><Icon name="Loader" size={16} className="animate-spin" />Проверяем...</span>
                    : 'Продолжить'}
                </button>
              </div>
            </>
          )}

          {/* ── Шаг 3: Регистрация ── */}
          {step === 'register' && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep('invite')} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
                  <Icon name="ArrowLeft" size={16} />
                </button>
                <div>
                  <h3 className="font-bold text-base">Создать аккаунт</h3>
                  <p className="text-xs text-white/40">
                    Приглашён от: <span className="text-purple-300 font-medium">{invitedBy}</span>
                  </p>
                </div>
              </div>

              {/* Код-бейдж */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
                style={{ background: 'rgba(155,93,229,0.12)', border: '1px solid rgba(155,93,229,0.25)' }}>
                <Icon name="Ticket" size={14} className="text-purple-400 flex-shrink-0" />
                <span className="text-xs text-white/50">Код:</span>
                <span className="text-xs font-bold tracking-wider text-purple-300">{inviteCode}</span>
                <Icon name="CheckCircle" size={14} className="text-green-400 ml-auto flex-shrink-0" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Icon name="User" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input className={`${inputCls} pl-11`} placeholder="Имя и фамилия" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                  <input className={`${inputCls} pl-9`} placeholder="имя_пользователя" value={form.username} onChange={e => set('username', e.target.value)} required />
                </div>
                <div className="relative">
                  <Icon name="Mail" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="email" className={`${inputCls} pl-11`} placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div className="relative">
                  <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="password" className={`${inputCls} pl-11`} placeholder="Пароль (мин. 6 символов)" value={form.password} onChange={e => set('password', e.target.value)} required />
                </div>
                <div className="relative">
                  <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="password" className={`${inputCls} pl-11`} placeholder="Повторите пароль" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
                  {form.confirm && form.password !== form.confirm && (
                    <p className="text-xs text-red-400 mt-1 ml-1">Пароли не совпадают</p>
                  )}
                </div>
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm text-red-300 animate-fade-in"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <Icon name="AlertCircle" size={15} className="flex-shrink-0" />
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || form.password !== form.confirm}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)', boxShadow: '0 4px 20px rgba(155,93,229,0.35)' }}
                >
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><Icon name="Loader" size={16} className="animate-spin" />Создаём аккаунт...</span>
                    : 'Создать аккаунт'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">Letter — приватный мессенджер. Данные защищены.</p>
      </div>
    </div>
  );
};

export default AuthScreen;
