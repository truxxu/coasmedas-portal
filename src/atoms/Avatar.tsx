interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full bg-brand-navy text-white
        flex items-center justify-center font-bold
        ${className}
      `}
    >
      {initials}
    </div>
  );
}
