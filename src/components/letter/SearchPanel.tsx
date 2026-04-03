import React, { useState } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const allUsers = [
  { id: 1, name: 'Алина Кузнецова', status: 'Дизайнер UX/UI', online: true },
  { id: 2, name: 'Максим Орлов', status: 'Разработчик', online: true },
  { id: 3, name: 'Катя Романова', status: 'Маркетолог', online: false },
  { id: 4, name: 'Дима Волков', status: 'Продукт-менеджер', online: false },
  { id: 5, name: 'Ирина Нова', status: 'Аналитик данных', online: true },
  { id: 6, name: 'Артём Быков', status: 'DevOps-инженер', online: false },
  { id: 7, name: 'Надя Соколова', status: 'QA-инженер', online: true },
];

const channels = [
  { id: 1, name: 'Стартапы и идеи', members: '1.2к', icon: '🚀' },
  { id: 2, name: 'Дизайн-мастерская', members: '845', icon: '🎨' },
  { id: 3, name: 'Код и кофе', members: '2.3к', icon: '☕' },
  { id: 4, name: 'Бизнес-клуб', members: '567', icon: '💼' },
];

const SearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'people' | 'channels'>('people');

  const filtered = query
    ? allUsers.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    : allUsers;

  return (
    <div className="flex flex-col h-full p-5">
      <h2 className="text-lg font-bold mb-4">Поиск</h2>

      {/* Search input */}
      <div className="relative mb-4">
        <Icon name="Search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/40 transition-colors"
          placeholder="Люди, каналы, сообщения..."
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
            <Icon name="X" size={15} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['people', 'channels'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t
                ? 'text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
            style={tab === t ? { background: 'linear-gradient(135deg, rgba(155,93,229,0.3), rgba(241,91,181,0.2))' } : {}}
          >
            {t === 'people' ? 'Люди' : 'Каналы'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {tab === 'people' ? (
          filtered.map((user, i) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <Avatar name={user.name} size="md" online={user.online} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{user.name}</div>
                <div className="text-xs text-white/40">{user.status}</div>
              </div>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all">
                  <Icon name="MessageCircle" size={16} />
                </button>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all">
                  <Icon name="UserPlus" size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          channels.map((ch, i) => (
            <div
              key={ch.id}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-xl flex-shrink-0">
                {ch.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{ch.name}</div>
                <div className="text-xs text-white/40">{ch.members} участников</div>
              </div>
              <button
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.3), rgba(241,91,181,0.2))' }}
              >
                Вступить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
