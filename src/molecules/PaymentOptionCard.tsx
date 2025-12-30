'use client';

interface PaymentOptionCardProps {
  title: string;
  description: string;
  variant?: 'featured' | 'standard';
  onClick: () => void;
  className?: string;
}

export function PaymentOptionCard({
  title,
  description,
  variant = 'standard',
  onClick,
  className = '',
}: PaymentOptionCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-2xl p-6
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          isFeatured
            ? 'bg-brand-navy shadow-md hover:shadow-lg hover:scale-[1.02] active:shadow-sm'
            : 'bg-white border border-gray-200 shadow-md hover:border-brand-navy hover:bg-blue-50 hover:shadow-lg active:border-blue-500 active:bg-blue-100'
        }
        ${className}
      `}
      aria-label={`Pagar ${title}`}
    >
      <h3
        className={`
          text-xl font-medium mb-3
          ${isFeatured ? 'text-blue-400' : 'text-brand-navy'}
        `}
      >
        {title}
      </h3>
      <p
        className={`
          text-[15px] leading-relaxed
          ${isFeatured ? 'text-white' : 'text-gray-900'}
        `}
      >
        {description}
      </p>
    </button>
  );
}
