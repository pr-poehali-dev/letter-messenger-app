import React, { useState } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const notifications = [
  { id: 1, type: 'message', name: 'Алина Кузнецова', text: 'Окей, увидимся в 7 вечера!', time: '2 мин назад', read: false },
  { id: 2, type: 'call', name: 'Максим Орлов', text: 'Пропущенный звонок', time: '15 мин назад', read: false },
  { id: 3, type: 'mention', name: 'Команда Proekt', text: 'упомянул вас: @Алексей посмотри', time: '1 час назад', read: false },
  { id: 4, type: 'message', name: 'Дизайн-чат', text: 'Надя: Новые макеты готовы!', time: '2 часа назад', read: true },
  { id: 5, type: 'call', name: 'Катя Романова', text: 'Входящий звонок — 3 мин 12 сек', time: 'вчера', read: true },
  { id: 6, type: 'system', name: 'Letter', text: 'Новое устройство вошло в аккаунт', time: 'вчера', read: true },
];

const typeIcon: Record<string, { icon: string; color: string }> = {
  message: { icon: 'MessageCircle', color: '#9b5de5' },
  call: { icon: 'Phone', color: '#06d6a0' },
  mention: { icon: 'AtSign', color: '#f15bb5' },
  system: { icon: 'Bell', color: '#ff6b35' },
};

const NotificationsPanel: React.FC = () => {
  const [items, setItems] = useState(notifications);

  const markAll = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const unread = items.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Уведомления</h2>
          {unread > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}
            >
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Прочитать все
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {items.map((n, i) => {
          const ti = typeIcon[n.type];
          return (
            <div
              key={n.id}
              onClick={() => setItems(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
              className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all animate-fade-in ${
                n.read ? 'opacity-60' : ''
              }`}
              style={{
                animationDelay: `${i * 0.05}s`,
                opacity: n.read ? undefined : 0,
                animationFillMode: 'forwards',
                background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)',
                border: n.read ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.09)',
              }}
            >
              <div className="relative flex-shrink-0">
                <Avatar name={n.name} size="md" />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: ti.color }}
                >
                  <Icon name={ti.icon} fallback="Bell" size={10} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm">{n.name}</span>
                  <span className="text-xs text-white/30 flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{n.text}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#9b5de5' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPanel;