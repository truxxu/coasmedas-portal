'use client';

import { ChevronIcon } from './ChevronIcon';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function CarouselArrow({
  direction,
  onClick,
  disabled = false,
  className = '',
}: CarouselArrowProps) {
  const ariaLabel = direction === 'left'
    ? 'Ver productos anteriores'
    : 'Ver productos siguientes';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`
        w-[42px] h-[42px] rounded-full bg-white
        border border-brand-border shadow-sm
        flex items-center justify-center
        hover:bg-brand-light-blue transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <ChevronIcon
        direction={direction}
        className="w-4 h-4 text-brand-gray-label"
      />
    </button>
  );
}
