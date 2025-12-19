'use client';

interface CarouselDotsProps {
  totalDots: number;
  activeDot: number;
  onDotClick?: (index: number) => void;
  className?: string;
}

export function CarouselDots({
  totalDots,
  activeDot,
  onDotClick,
  className = '',
}: CarouselDotsProps) {
  if (totalDots <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Páginas del carrusel"
      className={`flex items-center justify-center gap-2 mt-4 ${className}`}
    >
      {Array.from({ length: totalDots }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === activeDot}
          aria-label={`Ir a página ${index + 1}`}
          onClick={() => onDotClick?.(index)}
          className={`
            w-2 h-2 rounded-full transition-colors cursor-pointer
            ${index === activeDot
              ? 'bg-[#194E8D]'
              : 'border border-[#E4E6EA] bg-white hover:border-[#B1B1B1]'
            }
          `}
        />
      ))}
    </div>
  );
}
