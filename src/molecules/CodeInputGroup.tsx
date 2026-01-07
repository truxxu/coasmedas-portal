"use client";

import React, { useRef, useEffect } from "react";

interface CodeInputGroupProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

const CODE_LENGTH = 6;

export const CodeInputGroup: React.FC<CodeInputGroupProps> = ({
  value,
  onChange,
  hasError = false,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of digits
  const digits = value.split("").concat(Array(CODE_LENGTH).fill("")).slice(0, CODE_LENGTH);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newDigit = e.target.value.replace(/\D/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = newDigit;
    const newValue = newDigits.join("").replace(/\s/g, "");
    onChange(newValue);

    // Auto-advance to next input if digit was entered
    if (newDigit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData) {
      const newValue = pastedData.slice(0, CODE_LENGTH);
      onChange(newValue);

      const focusIndex = Math.min(newValue.length, CODE_LENGTH - 1);
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-2 md:gap-3"
      role="group"
      aria-label="Código de verificación de 6 dígitos"
    >
      {Array.from({ length: CODE_LENGTH }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          aria-label={`Dígito ${index + 1} de ${CODE_LENGTH}`}
          className={`
            w-12 h-14 md:w-14 md:h-16
            bg-transparent text-brand-text-black
            text-center text-xl md:text-2xl font-medium
            border-0 border-b-2 rounded-none
            focus:outline-none focus:border-b-brand-primary
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${hasError ? "border-b-brand-error" : "border-b-brand-footer-text"}
          `}
        />
      ))}
    </div>
  );
};
