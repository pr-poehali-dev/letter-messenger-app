import React, { useState } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';
import { useAuthContext } from '@/contexts/AuthContext';

const ProfilePanel: React.FC = () => {
  const { user } = useAuthContext();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      {/* Header card */}
      <div
        className="relative rounded-3xl p-6 mb-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.25), rgba(241,91,181,0.15), rgba(255,107,53,0.1))' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #9b5de5, transparent)' }} />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #f15bb5, transparent)' }} />

        <div className="relative flex items-start gap-4">
          <div className="relative">
            <Avatar name={name} size="xl" />
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #9b5de5, #f15bb5)' }}
            >
              <Icon name="Camera" size={13} />
            </button>
          </div>
          <div className="flex-1 pt-1">
            {editing ? (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-base font-bold w-full focus:outline-none mb-2"
              />
            ) : (
              <h2 className="text-xl font-bold">{name}</h2>
            )}
            {editing ? (
              <input
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-sm w-full focus:outline-none text-white/70"
              />
            ) : (
              <p className="text-sm text-white/60 mt-0.5">{bio}</p>
            )}
          </div>
        </div>

        <div className="relative flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex gap-6">
            {[['124', 'Чатов'], ['1.2к', 'Контактов'], ['48', 'Групп']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-bold text-base gradient-text">{val}</div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: editing ? 'linear-gradient(135deg, #06d6a0, #4cc9f0)' : 'rgba(255,255,255,0.1)' }}
          >
            {editing ? 'Сохранить' : 'Изменить'}
          </button>
        </div>
      </div>

      {/* Info blocks */}
      <div className="space-y-3">
        {[
          { icon: 'Phone', label: 'Телефон', value: '+7 999 123-45-67' },
          { icon: 'Mail', label: 'Email', value: 'alex.gromov@mail.ru' },
          { icon: 'MapPin', label: 'Город', value: 'Москва, Россия' },
        ].map(item => (
          <div key={item.label} className="glass rounded-2xl p-4 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(155,93,229,0.3), rgba(241,91,181,0.2))' }}
            >
              <Icon name={item.icon} size={16} className="text-purple-300" />
            </div>
            <div>
              <div className="text-xs text-white/40">{item.label}</div>
              <div className="text-sm font-medium">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="mt-4">
        <div className="text-xs text-white/40 mb-2 ml-1">Статус</div>
        <div className="flex gap-2 flex-wrap">
          {['Доступен', 'Занят', 'Не беспокоить', 'Невидимый'].map((s, i) => (
            <button
              key={s}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${i === 0 ? 'text-white' : 'text-white/50 hover:text-white/80 bg-white/[0.05] hover:bg-white/[0.08]'}`}
              style={i === 0 ? { background: 'linear-gradient(135deg, rgba(6,214,160,0.3), rgba(76,201,240,0.2))' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;