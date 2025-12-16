interface ChevronIconProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function ChevronIcon({ direction = 'down', className = '' }: ChevronIconProps) {
  const rotations = {
    up: 'rotate-180',
    down: 'rotate-0',
    left: 'rotate-90',
    right: '-rotate-90',
  };

  return (
    <svg
      className={`w-4 h-4 transition-transform ${rotations[direction]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
