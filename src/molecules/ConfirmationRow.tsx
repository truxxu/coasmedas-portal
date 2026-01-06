import React from 'react';

interface ConfirmationRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'success' | 'error';
  className?: string;
}

export const ConfirmationRow: React.FC<ConfirmationRowProps> = ({
  label,
  value,
  valueColor = 'default',
  className = '',
}) => {
  const colorClasses = {
    default: 'text-black',
    success: 'text-[#00A44C]',
    error: 'text-[#FF0D00]',
  };

  return (
    <div className={`flex justify-between items-center py-2 ${className}`}>
      <span className="text-[15px] text-black">{label}</span>
      <span className={`text-[15px] font-medium ${colorClasses[valueColor]}`}>
        {value}
      </span>
    </div>
  );
};
