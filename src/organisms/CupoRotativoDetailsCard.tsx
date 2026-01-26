"use client";

import { Card } from "@/src/atoms";
import { CupoRotativoCard } from "@/src/molecules";
import type { CupoRotativo, CupoRotativoDestination } from "@/src/types";

interface CupoRotativoDetailsCardProps {
  cupos: CupoRotativo[];
  destinations: CupoRotativoDestination[];
  selectedCupoId: string;
  selectedDestinationId: string;
  amount: string;
  onCupoChange: (cupoId: string) => void;
  onDestinationChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function CupoRotativoDetailsCard({
  cupos,
  destinations,
  selectedCupoId,
  selectedDestinationId,
  amount,
  onCupoChange,
  onDestinationChange,
  onAmountChange,
  hideBalances,
  error,
}: CupoRotativoDetailsCardProps) {
  const formatDestinationOption = (dest: CupoRotativoDestination) => {
    return `${dest.name} (${dest.maskedNumber})`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    onAmountChange(value);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("es-CO") : "0";

  return (
    <Card className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Transferencias de cupos rotativos a mis cuentas
        </h2>
        <p className="text-[15px] text-brand-text-black">
          Utiliza tus cupos rotativos para transferir a tus cuentas activas.
        </p>
      </div>

      {/* Cupo Selection */}
      <div className="space-y-3">
        <label className="block text-sm text-brand-text-black">
          Selecciona el cupo rotativo:
        </label>
        <div
          className="space-y-3"
          role="radiogroup"
          aria-label="Selecciona el cupo rotativo"
        >
          {cupos.map((cupo) => (
            <CupoRotativoCard
              key={cupo.id}
              cupo={cupo}
              isSelected={selectedCupoId === cupo.id}
              onSelect={onCupoChange}
              hideBalances={hideBalances}
            />
          ))}
        </div>
      </div>

      {/* Destination Account */}
      <div>
        <label
          htmlFor="destination-account"
          className="block text-sm text-brand-text-black mb-2"
        >
          ¿A qué cuenta quieres abonar?
        </label>
        <select
          id="destination-account"
          value={selectedDestinationId}
          onChange={(e) => onDestinationChange(e.target.value)}
          className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-base text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
        >
          <option value="">Seleccionar cuenta</option>
          {destinations.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {formatDestinationOption(dest)}
            </option>
          ))}
        </select>
      </div>

      {/* Transfer Amount */}
      <div>
        <label
          htmlFor="transfer-amount"
          className="block text-sm text-brand-text-black mb-2"
        >
          ¿Qué valor deseas transferir?
        </label>
        <div className="flex items-center border-b border-brand-footer-text pb-2">
          <span className="text-[21px] font-bold text-brand-text-black mr-2">
            $
          </span>
          <input
            id="transfer-amount"
            type="text"
            inputMode="numeric"
            value={formattedAmount}
            onChange={handleAmountChange}
            className="flex-1 text-right text-[21px] font-bold text-brand-text-black bg-transparent border-none outline-none focus:ring-0"
            placeholder="0"
          />
        </div>
        {error && (
          <p className="text-[13px] text-brand-error text-right mt-1">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
}
