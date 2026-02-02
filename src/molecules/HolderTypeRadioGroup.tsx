"use client";

import type { HolderType } from "@/src/types";

interface HolderTypeRadioGroupProps {
  value: HolderType;
  onChange: (value: HolderType) => void;
  disabled?: boolean;
}

export function HolderTypeRadioGroup({
  value,
  onChange,
  disabled = false,
}: HolderTypeRadioGroupProps) {
  const options: { value: HolderType; label: string }[] = [
    { value: "persona_natural", label: "Persona Natural" },
    { value: "persona_juridica", label: "Persona Juridica" },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (disabled) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Tipo de titular"
      className="flex flex-row gap-6"
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
            name="tipoTitular"
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
          <span className="text-sm text-brand-text-black">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
