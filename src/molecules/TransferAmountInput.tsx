import React from "react";

interface TransferAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function TransferAmountInput({
  value,
  onChange,
  label = "Valor a Transferir",
  error,
  disabled = false,
  className = "",
}: TransferAmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(numericValue);
  };

  // Format display value with Colombian number format
  const displayValue = value ? Number(value).toLocaleString("es-CO") : "0";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-brand-text-black mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center border-b border-brand-footer-text pb-2">
        <span className="text-[21px] font-bold text-brand-text-black mr-2">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          className={`
            flex-1 text-right text-[21px] font-bold text-brand-text-black
            bg-transparent border-none outline-none
            focus:ring-0
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          placeholder="0"
          aria-label={label}
        />
      </div>
      {error && <p className="mt-1 text-sm text-brand-error">{error}</p>}
    </div>
  );
}
