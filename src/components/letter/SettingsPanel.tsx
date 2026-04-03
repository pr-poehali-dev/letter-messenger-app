import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
    style={{ background: value ? 'linear-gradient(135deg, #9b5de5, #f15bb5)' : 'rgba(255,255,255,0.1)' }}
  >
    <div
      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
      style={{ left: value ? 'calc(100% - 20px)' : '4px' }}
    />
  </button>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2 ml-1">{title}</div>
    <div className="glass rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
      {children}
    </div>
  </div>
);

interface RowProps {
  icon: string;
  iconColor?: string;
  label: string;
  sub?: string;
  toggle?: boolean;
  value?: boolean;
  onChange?: (v: boolean) => void;
  arrow?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, iconColor, label, sub, toggle, value, onChange, arrow }) => (
  <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors cursor-pointer">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: iconColor || 'rgba(155,93,229,0.2)' }}
    >
      <Icon name={icon} size={16} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium">{label}</div>
      {sub && <div className="text-xs text-white/40">{sub}</div>}
    </div>
    {toggle && onChange !== undefined && value !== undefined && (
      <Toggle value={value} onChange={onChange} />
    )}
    {arrow && <Icon name="ChevronRight" size={16} className="text-white/30" />}
  </div>
);

const SettingsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [callsEnabled, setCallsEnabled] = useState(true);
  const [voiceOptimize, setVoiceOptimize] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className="flex flex-col h-full p-5 overflow-y-auto">
      <h2 className="text-lg font-bold mb-5">Настройки</h2>

      <Section title="Уведомления">
        <Row icon="Bell" iconColor="rgba(155,93,229,0.25)" label="Push-уведомления" toggle value={notifications} onChange={setNotifications} />
        <Row icon="Volume2" iconColor="rgba(241,91,181,0.25)" label="Звуки" sub="Звуки сообщений и звонков" toggle value={sounds} onChange={setSounds} />
        <Row icon="Eye" iconColor="rgba(76,201,240,0.25)" label="Статус прочтения" sub="Показывать галочки" toggle value={readReceipts} onChange={setReadReceipts} />
      </Section>

      <Section title="Звонки">
        <Row icon="Phone" iconColor="rgba(6,214,160,0.25)" label="Входящие звонки" toggle value={callsEnabled} onChange={setCallsEnabled} />
        <Row icon="Mic" iconColor="rgba(255,107,53,0.25)" label="Оптимизация микрофона" sub="Шумоподавление и эхо" toggle value={voiceOptimize} onChange={setVoiceOptimize} />
        <Row icon="Headphones" iconColor="rgba(155,93,229,0.2)" label="Аудио-устройство" sub="По умолчанию" arrow />
      </Section>

      <Section title="Внешний вид">
        <div className="px-4 py-3">
          <div className="text-sm font-medium mb-3">Тема оформления</div>
          <div className="flex gap-3">
            {(['dark', 'light'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
                style={theme === t ? { background: 'linear-gradient(135deg, rgba(155,93,229,0.3), rgba(241,91,181,0.2))' } : { background: 'rgba(255,255,255,0.05)' }}
              >
                <Icon name={t === 'dark' ? 'Moon' : 'Sun'} size={15} className={theme === t ? 'text-purple-300' : 'text-white/40'} />
                <span className={theme === t ? 'text-white' : 'text-white/50'}>{t === 'dark' ? 'Тёмная' : 'Светлая'}</span>
              </button>
            ))}
          </div>
        </div>
        <Row icon="Type" iconColor="rgba(76,201,240,0.2)" label="Размер шрифта" sub="Средний" arrow />
      </Section>

      <Section title="Аккаунт">
        <Row icon="Shield" iconColor="rgba(6,214,160,0.2)" label="Конфиденциальность" arrow />
        <Row icon="Lock" iconColor="rgba(255,107,53,0.2)" label="Двухфакторная аутентификация" sub="Отключена" arrow />
        <Row icon="Smartphone" iconColor="rgba(155,93,229,0.2)" label="Активные устройства" sub="2 устройства" arrow />
      </Section>

      <div className="mt-2">
        <button className="w-full py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20">
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
