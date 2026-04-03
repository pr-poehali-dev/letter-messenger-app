import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/letter/Avatar';
import ChatsPanel from '@/components/letter/ChatsPanel';
import SearchPanel from '@/components/letter/SearchPanel';
import ContactsPanel from '@/components/letter/ContactsPanel';
import ProfilePanel from '@/components/letter/ProfilePanel';
import SettingsPanel from '@/components/letter/SettingsPanel';
import NotificationsPanel from '@/components/letter/NotificationsPanel';
import CallModal from '@/components/letter/CallModal';
import AuthScreen from '@/components/letter/AuthScreen';
import { useAuthContext } from '@/contexts/AuthContext';

type Tab = 'chats' | 'search' | 'contacts' | 'notifications' | 'profile' | 'settings';

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'search', icon: 'Search', label: 'Поиск' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'notifications', icon: 'Bell', label: 'Лента' },
  { id: 'settings', icon: 'Settings', label: 'Настр.' },
];

const Index: React.FC = () => {
  const [tab, setTab] = useState<Tab>('chats');
  const [callTarget, setCallTarget] = useState<string | null>(null);
  const { user, loading, error, register, login, logout, setError, checkInvite } = useAuthContext();

  const handleCall = (name: string) => setCallTarget(name);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center gradient-animated">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-3xl flex items-center justify-center font-caveat font-bold text-2xl text-white animate-pulse"
            style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}
          >
            L
          </div>
          <p className="text-white/30 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        onRegister={register}
        onLogin={login}
        onCheckInvite={checkInvite}
        loading={loading}
        error={error}
        clearError={() => setError(null)}
      />
    );
  }

  return (
    <div className="gradient-animated w-screen h-screen flex overflow-hidden font-golos">
      {/* Decorative blobs */}
      <div className="fixed pointer-events-none inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #9b5de5, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-24 w-80 h-80 rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, #f15bb5, transparent 70%)', opacity: 0.07, animationDelay: '1.5s' }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, #4cc9f0, transparent 70%)' }}
        />
      </div>

      {/* Sidebar Nav */}
      <nav
        className="relative z-10 flex flex-col items-center py-5 gap-1"
        style={{
          width: 72,
          background: 'rgba(8,6,18,0.85)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <div className="mb-4 flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-caveat font-bold text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}
          >
            L
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-0.5 w-full px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`nav-item w-full ${tab === item.id ? 'active' : ''}`}
            >
              <div className="relative">
                <Icon name={item.icon} size={20} />
                {item.id === 'notifications' && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                    style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}
                  >
                    3
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-none">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom — profile */}
        <div className="mt-auto pt-3 border-t border-white/[0.06] w-full px-2">
          <button
            onClick={() => setTab('profile')}
            className={`nav-item w-full ${tab === 'profile' ? 'active' : ''}`}
          >
            <Avatar name={user.name} size="sm" online={true} />
            <span className="text-[10px] leading-none">Профиль</span>
          </button>
          <button
            onClick={logout}
            className="nav-item w-full mt-0.5"
            title="Выйти"
          >
            <Icon name="LogOut" size={18} className="text-red-400/70" />
            <span className="text-[10px] leading-none text-red-400/70">Выход</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main
        className="relative z-10 flex-1 min-w-0 overflow-hidden"
        style={{
          background: 'rgba(10,8,22,0.72)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2">
            <span className="font-caveat font-bold text-2xl gradient-text">Letter</span>
            <span className="text-xs text-white/25 ml-1 font-golos">мессенджер</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all">
              <Icon name="Edit" size={15} />
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all">
              <Icon name="MoreHorizontal" size={15} />
            </button>
          </div>
        </div>

        {/* Panel */}
        <div className="h-[calc(100%-52px)] overflow-hidden">
          {tab === 'chats' && <ChatsPanel onCall={handleCall} />}
          {tab === 'search' && <SearchPanel />}
          {tab === 'contacts' && <ContactsPanel onCall={handleCall} />}
          {tab === 'notifications' && <NotificationsPanel />}
          {tab === 'profile' && <ProfilePanel />}
          {tab === 'settings' && <SettingsPanel />}
        </div>
      </main>

      {/* Call Modal */}
      {callTarget && (
        <CallModal name={callTarget} onClose={() => setCallTarget(null)} />
      )}
    </div>
  );
};

export default Index;