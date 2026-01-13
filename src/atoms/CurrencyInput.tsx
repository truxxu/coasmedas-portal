"use client";

import React from "react";

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
  prefix = "$",
  hasError = false,
  disabled = false,
  className = "",
}) => {
  // Derive displayValue directly from props instead of syncing via useEffect
  const displayValue = value.toLocaleString("es-CO");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Only allow digits
    const cleaned = rawValue.replace(/[^\d]/g, "");
    const numericValue = parseInt(cleaned, 10) || 0;

    onChange(numericValue);
  };

  // Check if full width is requested
  const isFullWidth = className.includes("w-full");

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`text-xl font-bold ${
          disabled ? "text-brand-gray-medium" : "text-black"
        }`}
      >
        {prefix}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        className={`
          ${
            isFullWidth ? "flex-1" : "w-32"
          } h-10 px-3 text-right text-lg font-medium
          border-b transition-colors
          ${
            hasError
              ? "border-brand-error focus:border-brand-error focus:ring-2 focus:ring-brand-error"
              : disabled
              ? "border-brand-gray-low"
              : "border-brand-navy focus:border-brand-primary focus:ring-2 focus:ring-brand-primary"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          focus:outline-none
        `}
        aria-label="Valor a pagar"
      />
    </div>
  );
};
