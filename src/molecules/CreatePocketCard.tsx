'use client';

interface CreatePocketCardProps {
  onClick: () => void;
  className?: string;
}

export function CreatePocketCard({
  onClick,
  className = '',
}: CreatePocketCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        rounded-2xl p-5 cursor-pointer min-w-[280px]
        transition-all duration-200
        bg-brand-border border border-brand-border
        hover:border-brand-footer-text hover:bg-white
        flex flex-col items-center justify-center
        min-h-[200px]
        ${className}
      `}
    >
      {/* Plus Icon */}
      <div className="w-16 h-16 rounded-full bg-brand-navy-dark flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>

      {/* Call to Action Text */}
      <h3 className="text-[16px] font-medium text-brand-navy-dark text-center">
        Crear nuevo bolsillo
      </h3>
      <p className="text-[14px] text-brand-gray-muted text-center mt-2">
        Organiza tus ahorros
      </p>
    </div>
  );
}
