"use client";

import React, { forwardRef } from "react";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
}

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
  (
    {
      value,
      onChange,
      onKeyDown,
      onFocus,
      onPaste,
      hasError = false,
      disabled = false,
      autoFocus = false,
      ariaLabel = "Dígito del código",
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Only allow single digit
      if (newValue.length <= 1 && /^\d*$/.test(newValue)) {
        onChange(newValue);
      }
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onPaste={onPaste}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        className={`
          w-12 h-14 md:w-14 md:h-16
          bg-white text-[#111827]
          text-center text-xl md:text-2xl font-medium
          border-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:border-[#007FFF]
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${hasError ? "border-[#FF0D00]" : "border-[#B1B1B1]"}
        `}
      />
    );
  }
);

CodeInput.displayName = "CodeInput";
