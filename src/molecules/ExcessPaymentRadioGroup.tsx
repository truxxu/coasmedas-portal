"use client";

import React from "react";
import type { ExcessPaymentOption } from "@/src/types/obligacion-payment";

interface ExcessPaymentRadioGroupProps {
  value: ExcessPaymentOption | null;
  onChange: (value: ExcessPaymentOption) => void;
  disabled?: boolean;
}

const options: { value: ExcessPaymentOption; label: string }[] = [
  { value: "proximas_cuotas", label: "Abono a próximas cuotas" },
  { value: "reduccion_plazo", label: "Reducción de tiempo (plazo)" },
  { value: "reduccion_cuota", label: "Reducción de valor de cuota" },
];

export function ExcessPaymentRadioGroup({
  value,
  onChange,
  disabled = false,
}: ExcessPaymentRadioGroupProps) {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (disabled) return;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Aplicación del excedente"
      className="flex flex-col gap-3"
    >
      {options.map((option, index) => (
        <label
          key={option.value}
          className={`flex items-center gap-2 cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="radio"
            name="excessPaymentOption"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled}
            className="sr-only"
            aria-checked={value === option.value}
          />
          <span
            className={`
              w-4 h-4 rounded-full border flex items-center justify-center
              transition-colors duration-150
              ${
                value === option.value
                  ? "border-brand-primary"
                  : "border-brand-footer-text"
              }
            `}
          >
            {value === option.value && (
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
            )}
          </span>
          <span className="text-[15px] text-brand-text-black">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
