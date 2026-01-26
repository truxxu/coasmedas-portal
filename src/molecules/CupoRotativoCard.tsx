import { formatCurrency, maskCurrency } from "@/src/utils";
import type { CupoRotativo } from "@/src/types";

interface CupoRotativoCardProps {
  cupo: CupoRotativo;
  isSelected: boolean;
  onSelect: (id: string) => void;
  hideBalances: boolean;
}

export function CupoRotativoCard({
  cupo,
  isSelected,
  onSelect,
  hideBalances,
}: CupoRotativoCardProps) {
  const availableDisplay = hideBalances
    ? maskCurrency()
    : formatCurrency(cupo.availableAmount);
  const totalDisplay = hideBalances
    ? maskCurrency()
    : formatCurrency(cupo.totalAmount);

  return (
    <button
      type="button"
      onClick={() => onSelect(cupo.id)}
      className={`
        w-full p-4 rounded-lg border text-left flex items-start gap-3
        transition-colors cursor-pointer
        ${
          isSelected
            ? "bg-white border-brand-border"
            : "bg-white border-brand-border hover:border-brand-navy"
        }
      `}
    >
      {/* Radio button indicator */}
      <div className="mt-1 flex-shrink-0">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${isSelected ? "border-brand-primary" : "border-brand-border"}
          `}
        >
          {isSelected && (
            <div className="w-3 h-3 rounded-full bg-brand-primary" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-lg font-bold text-brand-navy">{cupo.name}</p>
        <p className="text-sm text-brand-text-black">
          Disponible: {availableDisplay} de {totalDisplay}
        </p>
      </div>
    </button>
  );
}
