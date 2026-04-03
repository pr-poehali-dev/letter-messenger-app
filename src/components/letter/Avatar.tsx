import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  gradient?: string;
}

const gradients = [
  'linear-gradient(135deg, #9b5de5, #f15bb5)',
  'linear-gradient(135deg, #f15bb5, #ff6b35)',
  'linear-gradient(135deg, #4cc9f0, #9b5de5)',
  'linear-gradient(135deg, #06d6a0, #4cc9f0)',
  'linear-gradient(135deg, #ff6b35, #f15bb5)',
  'linear-gradient(135deg, #9b5de5, #4cc9f0)',
];

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', online, gradient }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const charCode = name.charCodeAt(0) % gradients.length;
  const bg = gradient || gradients[charCode];

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white overflow-hidden`}
        style={{ background: src ? undefined : bg }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {online && <div className="online-dot" />}
    </div>
  );
};

export default Avatar;
