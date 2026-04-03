import React, { useState } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const contacts = [
  { id: 1, name: 'Алина Кузнецова', phone: '+7 915 234-56-78', status: 'UX/UI дизайнер', online: true, favorite: true },
  { id: 2, name: 'Артём Быков', phone: '+7 903 456-78-90', status: 'DevOps', online: false, favorite: true },
  { id: 3, name: 'Дима Волков', phone: '+7 926 789-01-23', status: 'Продакт', online: false, favorite: false },
  { id: 4, name: 'Ирина Нова', phone: '+7 916 345-67-89', status: 'Data Analyst', online: true, favorite: false },
  { id: 5, name: 'Катя Романова', phone: '+7 917 567-89-01', status: 'Маркетолог', online: false, favorite: true },
  { id: 6, name: 'Максим Орлов', phone: '+7 999 123-45-67', status: 'Разработчик', online: true, favorite: false },
  { id: 7, name: 'Надя Соколова', phone: '+7 905 678-90-12', status: 'QA Engineer', online: true, favorite: false },
];

const ContactsPanel: React.FC<{ onCall?: (name: string) => void }> = ({ onCall }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFav, setShowFav] = useState(false);

  const displayed = showFav ? contacts.filter(c => c.favorite) : contacts;
  const contact = contacts.find(c => c.id === selected);

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-72 flex-shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Контакты</h2>
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}
            >
              <Icon name="UserPlus" size={15} className="text-white" />
            </button>
          </div>
          <button
            onClick={() => setShowFav(!showFav)}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl transition-all ${showFav ? 'text-yellow-400' : 'text-white/40'}`}
            style={showFav ? { background: 'rgba(255,200,0,0.1)' } : {}}
          >
            <Icon name="Star" size={14} />
            <span>Избранные</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {displayed.map((c, i) => (
            <div
              key={c.id}
              onClick={() => setSelected(c.id)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all animate-fade-in"
              style={{
                animationDelay: `${i * 0.04}s`,
                opacity: 0,
                animationFillMode: 'forwards',
                background: selected === c.id ? 'linear-gradient(135deg, rgba(155,93,229,0.2), rgba(241,91,181,0.1))' : undefined,
              }}
            >
              <Avatar name={c.name} size="md" online={c.online} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm flex items-center gap-1">
                  {c.name}
                  {c.favorite && <Icon name="Star" size={11} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                </div>
                <div className="text-xs text-white/40 truncate">{c.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {contact ? (
          <div className="animate-scale-in flex flex-col items-center gap-4 max-w-sm w-full">
            <div className="relative">
              <Avatar name={contact.name} size="xl" online={contact.online} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">{contact.name}</h3>
              <p className="text-white/50 text-sm mt-1">{contact.status}</p>
              <p className="text-white/30 text-sm">{contact.phone}</p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.25), rgba(241,91,181,0.15))' }}
              >
                <Icon name="MessageCircle" size={22} className="text-purple-400" />
                <span className="text-xs text-white/70">Написать</span>
              </button>
              <button
                onClick={() => onCall?.(contact.name)}
                className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, rgba(6,214,160,0.2), rgba(76,201,240,0.15))' }}
              >
                <Icon name="Phone" size={22} className="text-green-400" />
                <span className="text-xs text-white/70">Позвонить</span>
              </button>
              <button
                onClick={() => onCall?.(contact.name)}
                className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, rgba(76,201,240,0.2), rgba(155,93,229,0.15))' }}
              >
                <Icon name="Video" size={22} className="text-blue-400" />
                <span className="text-xs text-white/70">Видео</span>
              </button>
            </div>

            <div className="w-full glass rounded-2xl p-4 mt-2 space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="Phone" size={16} className="text-white/30" />
                <span className="text-sm text-white/70">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Circle" size={16} className={contact.online ? 'text-green-400' : 'text-white/30'} />
                <span className="text-sm text-white/70">{contact.online ? 'В сети' : 'Был(а) недавно'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/30">
            <Icon name="Users" size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Выберите контакт</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPanel;
