import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface CallModalProps {
  name: string;
  onClose: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ name, onClose }) => {
  const [status, setStatus] = useState<'calling' | 'connected'>('calling');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setStatus('connected'), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)' }}
    >
      <div
        className="relative w-80 rounded-3xl p-8 flex flex-col items-center gap-5 animate-scale-in overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #120820 0%, #0a1530 50%, #0d0820 100%)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(155,93,229,0.4), transparent 70%)' }} />

        {/* Rings when calling */}
        {status === 'calling' && (
          <div className="absolute inset-0 flex items-start justify-center pt-16 pointer-events-none">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="absolute rounded-full border border-purple-500/30 animate-pulse-ring"
                style={{
                  width: `${80 + i * 40}px`,
                  height: `${80 + i * 40}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-3">
          <Avatar name={name} size="xl" />
          <div className="text-center">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm mt-1" style={{ color: status === 'connected' ? '#06d6a0' : 'rgba(255,255,255,0.5)' }}>
              {status === 'calling' ? 'Вызов...' : fmt(seconds)}
            </p>
          </div>
        </div>

        {/* Wave bars when connected */}
        {status === 'connected' && (
          <div className="relative z-10 flex items-end justify-center gap-1 h-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="wave-bar rounded-full"
                style={{
                  width: 3,
                  height: `${30 + Math.sin(i * 0.8) * 14}%`,
                  minHeight: 4,
                  maxHeight: 28,
                  background: 'linear-gradient(to top, #9b5de5, #f15bb5)',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => setMuted(!muted)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{ background: muted ? 'rgba(255,100,100,0.2)' : 'rgba(255,255,255,0.1)' }}
          >
            <Icon name={muted ? 'MicOff' : 'Mic'} size={20} className={muted ? 'text-red-400' : 'text-white'} />
          </button>

          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            <Icon name="PhoneOff" size={22} className="text-white" />
          </button>

          <button
            onClick={() => setSpeaker(!speaker)}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{ background: speaker ? 'rgba(155,93,229,0.25)' : 'rgba(255,255,255,0.1)' }}
          >
            <Icon name={speaker ? 'Volume2' : 'VolumeX'} size={20} className={speaker ? 'text-purple-300' : 'text-white/60'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
