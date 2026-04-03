import React, { useState } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const chats = [
  { id: 1, name: 'Алина Кузнецова', lastMsg: 'Окей, увидимся в 7 вечера!', time: '14:32', unread: 3, online: true, voice: false },
  { id: 2, name: 'Команда Proekt', lastMsg: '🎤 Голосовое сообщение', time: '13:15', unread: 0, online: false, voice: true, isGroup: true },
  { id: 3, name: 'Максим Орлов', lastMsg: 'Отправил файл презентации', time: '12:00', unread: 1, online: true, voice: false },
  { id: 4, name: 'Катя Романова', lastMsg: 'Спасибо большое! ❤️', time: 'вчера', unread: 0, online: false, voice: false },
  { id: 5, name: 'Дизайн-чат', lastMsg: 'Новые макеты готовы', time: 'вчера', unread: 7, online: false, voice: false, isGroup: true },
  { id: 6, name: 'Дима Волков', lastMsg: 'Позвоню завтра', time: 'пн', unread: 0, online: false, voice: false },
  { id: 7, name: 'Ирина Нова', lastMsg: '🎤 Голосовое сообщение', time: 'пн', unread: 0, online: true, voice: true },
];

const messages: Record<number, Array<{id: number, text: string, out: boolean, time: string, voice?: boolean, duration?: string}>> = {
  1: [
    { id: 1, text: 'Привет! Как дела?', out: false, time: '13:55' },
    { id: 2, text: 'Всё отлично, спасибо! Ты как?', out: true, time: '13:56' },
    { id: 3, text: 'Тоже хорошо! Встретимся сегодня?', out: false, time: '14:10' },
    { id: 4, text: 'Да, конечно! В 7 где обычно?', out: true, time: '14:30' },
    { id: 5, text: 'Окей, увидимся в 7 вечера!', out: false, time: '14:32' },
  ],
  2: [
    { id: 1, text: 'Народ, митинг в 15:00', out: false, time: '12:00' },
    { id: 2, text: 'Буду', out: true, time: '12:05' },
    { id: 3, text: '', out: false, time: '13:15', voice: true, duration: '0:42' },
  ],
  3: [
    { id: 1, text: 'Привет, посмотри презентацию', out: false, time: '11:50' },
    { id: 2, text: 'Сейчас гляну!', out: true, time: '11:55' },
    { id: 3, text: 'Отправил файл презентации', out: false, time: '12:00' },
  ],
};

interface ChatsPanelProps {
  onCall?: (name: string) => void;
}

const ChatsPanel: React.FC<ChatsPanelProps> = ({ onCall }) => {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);

  const chat = chats.find(c => c.id === activeChat);
  const msgs = activeChat ? (messages[activeChat] || []) : [];

  return (
    <div className="flex h-full">
      {/* Sidebar list */}
      <div className="w-72 flex-shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="p-4 pb-3">
          <h2 className="text-lg font-bold mb-3">Сообщения</h2>
          <div className="relative">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="Поиск чатов..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {chats.map((chat, i) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 animate-fade-in`}
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
              data-active={activeChat === chat.id}
            >
              <div
                className="flex items-center gap-3 w-full rounded-xl"
                style={{
                  background: activeChat === chat.id
                    ? 'linear-gradient(135deg, rgba(155,93,229,0.2), rgba(241,91,181,0.1))'
                    : 'transparent',
                  padding: '6px 8px',
                  margin: '-6px -8px',
                  borderRadius: '12px',
                }}
              >
                <Avatar name={chat.name} size="md" online={chat.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">
                      {chat.isGroup && <Icon name="Users" size={12} className="inline mr-1 text-purple-400" />}
                      {chat.name}
                    </span>
                    <span className="text-xs text-white/30 ml-1 flex-shrink-0">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-white/40 truncate">{chat.lastMsg}</span>
                    {chat.unread > 0 && (
                      <span className="ml-1 flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                        style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {chat ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Avatar name={chat.name} size="md" online={chat.online} />
                <div>
                  <div className="font-semibold text-sm">{chat.name}</div>
                  <div className="text-xs" style={{ color: chat.online ? 'var(--letter-green)' : 'rgba(255,255,255,0.35)' }}>
                    {chat.online ? 'в сети' : 'был(а) недавно'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onCall?.(chat.name)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <Icon name="Phone" size={17} />
                </button>
                <button
                  onClick={() => onCall?.(chat.name)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <Icon name="Video" size={17} />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
                  <Icon name="MoreVertical" size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {msgs.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.out ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${i * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}
                >
                  {msg.voice ? (
                    <div className={`${msg.out ? 'bubble-out' : 'bubble-in'} rounded-2xl px-4 py-3 flex items-center gap-3 max-w-[240px]`}>
                      <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Icon name="Play" size={14} className="text-white ml-0.5" />
                      </button>
                      <div className="flex items-end gap-0.5 h-6">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 rounded-full bg-white/70"
                            style={{ height: `${20 + Math.sin(i * 1.2) * 14}%`, minHeight: 3, maxHeight: 20 }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/60 flex-shrink-0">{msg.duration}</span>
                    </div>
                  ) : (
                    <div className={`${msg.out ? 'bubble-out' : 'bubble-in'} rounded-2xl px-4 py-2.5 max-w-[70%]`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`text-[10px] mt-1 ${msg.out ? 'text-white/60 text-right' : 'text-white/40'}`}>
                        {msg.time} {msg.out && <Icon name="CheckCheck" size={11} className="inline ml-0.5 text-white/70" />}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-2xl px-3 py-2">
                <button className="text-white/40 hover:text-white/70 transition-colors">
                  <Icon name="Smile" size={20} />
                </button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setInput('')}
                  className="flex-1 bg-transparent text-sm placeholder:text-white/30 focus:outline-none"
                  placeholder="Написать сообщение..."
                />
                <button className="text-white/40 hover:text-white/70 transition-colors">
                  <Icon name="Paperclip" size={18} />
                </button>
                {input.trim() ? (
                  <button
                    onClick={() => setInput('')}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}
                  >
                    <Icon name="Send" size={15} />
                  </button>
                ) : (
                  <button
                    onMouseDown={() => setRecording(true)}
                    onMouseUp={() => setRecording(false)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      recording ? 'text-red-400 scale-110' : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <Icon name="Mic" size={18} />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30 gap-3">
            <Icon name="MessageCircle" size={48} />
            <span>Выберите чат</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPanel;
