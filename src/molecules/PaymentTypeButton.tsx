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
          ? 'bg-[#007FFF] text-white'
          : 'bg-[#E4E6EA] text-black hover:bg-[#D1D2D4]'
        }
      `}
    >
      {label}
    </button>
  );
};
