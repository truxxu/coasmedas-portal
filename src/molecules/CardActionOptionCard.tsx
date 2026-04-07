"use client";

interface CardActionOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

export function CardActionOptionCard({
  title,
  description,
  onClick,
  disabled = false,
}: CardActionOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      className={`
        w-full text-left bg-white border border-brand-border rounded-lg
        px-5 py-4 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-brand-navy hover:shadow-md"
        }
      `}
    >
      <h4 className="text-[16px] font-bold text-black">{title}</h4>
      <p className="text-[12px] text-black mt-1">{description}</p>
    </button>
  );
}
