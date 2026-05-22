"use client";

import { FlowOptionCard } from "@/src/molecules";
import type { OtrosServiciosOption } from "@/src/types";

interface FlowGridProps {
  title: string;
  subtitle: string;
  options: readonly OtrosServiciosOption[];
  gridClassName?: string;
  onSelect: (option: OtrosServiciosOption) => void;
  className?: string;
}

export function FlowGrid({
  title,
  subtitle,
  options,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-4",
  onSelect,
  className = "",
}: FlowGridProps) {
  return (
    <div className={`bg-white rounded-2xl p-8 shadow-sm ${className}`}>
      <div className="mb-6">
        <h2 className="text-[21px] font-bold text-brand-navy mb-2 text-center">
          {title}
        </h2>
        <p className="text-[15px] text-brand-text-black text-center">
          {subtitle}
        </p>
      </div>

      <div className={gridClassName}>
        {options.map((option) => (
          <FlowOptionCard
            key={option.id}
            title={option.title}
            description={option.description}
            onClick={() => onSelect(option)}
            disabled={!option.enabled}
          />
        ))}
      </div>
    </div>
  );
}
