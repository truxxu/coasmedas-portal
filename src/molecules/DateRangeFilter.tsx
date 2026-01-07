"use client";

import { DateInput } from "@/src/atoms";
import { Button } from "@/src/atoms";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  maxRangeMonths?: number;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  maxRangeMonths = 3,
  helperText,
  disabled = false,
  className = "",
}: DateRangeFilterProps) {
  const defaultHelperText = `El filtro de fecha solo permite un rango de los últimos ${maxRangeMonths} meses.`;

  return (
    <div className={className}>
      {/* Filter row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-[14px] text-brand-gray-label">Filtrar:</span>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <DateInput
            value={startDate}
            onChange={onStartDateChange}
            disabled={disabled}
            className="w-full sm:w-auto"
          />
          <DateInput
            value={endDate}
            onChange={onEndDateChange}
            disabled={disabled}
            className="w-full sm:w-auto"
          />
          <Button
            variant="secondary"
            size="md"
            onClick={onApply}
            disabled={disabled}
            className="w-full sm:w-auto !bg-brand-border !border-brand-border hover:!bg-brand-gray-low hover:!text-brand-navy hover:!border-brand-gray-low"
          >
            Aplicar
          </Button>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-2 text-[12px] text-brand-gray-secondary">
        {helperText || defaultHelperText}
      </p>
    </div>
  );
}
