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
    red: 'text-brand-error',
    navy: 'text-brand-navy',
    green: 'text-brand-success-icon',
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
