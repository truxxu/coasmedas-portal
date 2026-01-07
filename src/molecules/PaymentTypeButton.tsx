import React from 'react';

interface PaymentTypeButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}

export const PaymentTypeButton: React.FC<PaymentTypeButtonProps> = ({
  label,
  onClick,
  active = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 text-[10px] font-medium rounded-[9px]
        shadow-sm transition-all
        ${active
          ? 'bg-brand-primary text-white'
          : 'bg-brand-border text-black hover:bg-brand-gray-low'
        }
      `}
    >
      {label}
    </button>
  );
};
