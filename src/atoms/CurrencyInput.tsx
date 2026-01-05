'use client';

import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  prefix = '$',
  hasError = false,
  disabled = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  const formatNumberForDisplay = (num: number): string => {
    return num.toLocaleString('es-CO');
  };

  useEffect(() => {
    setDisplayValue(formatNumberForDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Only allow digits
    const cleaned = rawValue.replace(/[^\d]/g, '');
    const numericValue = parseInt(cleaned, 10) || 0;

    onChange(numericValue);
    setDisplayValue(formatNumberForDisplay(numericValue));
  };

  const handleBlur = () => {
    // Ensure proper formatting on blur
    setDisplayValue(formatNumberForDisplay(value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xl font-bold text-black">{prefix}</span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`
          w-32 h-10 px-3 text-right text-lg font-medium rounded-md
          border transition-colors
          ${
            hasError
              ? 'border-[#FF0D00] focus:border-[#FF0D00] focus:ring-2 focus:ring-[#FF0D00]'
              : 'border-[#1D4E8F] focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF]'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          focus:outline-none
        `}
        aria-label="Valor a pagar"
      />
    </div>
  );
};
