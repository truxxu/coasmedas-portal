'use client';

import { Card } from '@/src/atoms';
import { Select } from '@/src/atoms';
import { MonthOption } from '@/src/types/products';

interface DownloadReportsCardProps {
  title?: string;
  description?: string;
  availableMonths: MonthOption[];
  selectedMonth?: string;
  onMonthChange: (month: string) => void;
  onDownload?: () => void;
  loading?: boolean;
  className?: string;
}

export function DownloadReportsCard({
  title = 'Descargar extractos',
  description = 'Selecciona el mes que deseas consultar para descargar tu extracto en formato PDF.',
  availableMonths,
  selectedMonth,
  onMonthChange,
  loading = false,
  className = '',
}: DownloadReportsCardProps) {
  const selectOptions = availableMonths.map((month) => ({
    value: month.value,
    label: month.label,
  }));

  return (
    <Card className={`p-6 rounded-2xl ${className}`}>
      {/* Header */}
      <h2 className="text-[19px] font-bold text-brand-navy mb-2">{title}</h2>
      <p className="text-[14px] text-brand-gray-label mb-4">{description}</p>

      {/* Month selector */}
      <Select
        options={selectOptions}
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        disabled={loading}
        className="w-full"
      />
    </Card>
  );
}
