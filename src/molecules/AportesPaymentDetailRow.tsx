import React from 'react';
import { AportesValueColor } from '@/src/types/aportes-payment';
import { maskCurrency } from '@/src/utils';

interface AportesPaymentDetailRowProps {
  label: string;
  value: string;
  valueColor?: AportesValueColor;
  hideValue?: boolean;
}

export const AportesPaymentDetailRow: React.FC<AportesPaymentDetailRowProps> = ({
  label,
  value,
  valueColor = 'default',
  hideValue = false,
}) => {
  const colorClasses: Record<AportesValueColor, string> = {
    default: 'text-black',
    red: 'text-[#E1172B]',
    navy: 'text-[#1D4E8F]',
    green: 'text-[#00A44C]',
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-[15px] text-black">{label}</span>
      <span className={`text-[15px] font-medium ${colorClasses[valueColor]}`}>
        {hideValue ? maskCurrency() : value}
      </span>
    </div>
  );
};
