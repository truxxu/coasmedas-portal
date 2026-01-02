"use client";

import React, { useRef, useEffect } from "react";
import { CodeInput } from "@/src/atoms";

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
  const digits = value.padEnd(CODE_LENGTH, "").split("").slice(0, CODE_LENGTH);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleDigitChange = (index: number, newDigit: string) => {
    const newDigits = [...digits];
    newDigits[index] = newDigit;
    const newValue = newDigits.join("");
    onChange(newValue.replace(/\s/g, ""));

    // Auto-advance to next input
    if (newDigit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // If current is empty, go to previous
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

  const handleFocus = (index: number) => {
    // Select content when focused
    inputRefs.current[index]?.select();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData) {
      // Distribute pasted digits across inputs
      const newValue = pastedData.slice(0, CODE_LENGTH);
      onChange(newValue);

      // Focus the appropriate input after paste
      const focusIndex = Math.min(newValue.length, CODE_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-2 md:gap-3"
      role="group"
      aria-label="Código de verificación de 6 dígitos"
    >
      {digits.map((digit, index) => (
        <CodeInput
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit.trim()}
          onChange={(newDigit) => handleDigitChange(index, newDigit)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          hasError={hasError}
          disabled={disabled}
          ariaLabel={`Dígito ${index + 1} de ${CODE_LENGTH}`}
        />
      ))}
    </div>
  );
};
