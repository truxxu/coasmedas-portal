"use client";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  className = "",
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-12 h-6 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2 ${
        checked ? "bg-[#82BC00]" : "bg-brand-gray-low"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <span
        className={`inline-block w-[18px] h-[18px] rounded-full bg-white shadow-sm transform transition-transform ${
          checked ? "translate-x-[27px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
