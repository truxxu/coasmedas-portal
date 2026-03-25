"use client";

import { Card, Divider } from "@/src/atoms";
import { useUIContext } from "@/src/contexts";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ObligacionInfoCardProps {
  saldoTotal: number;
  saldoDisponible: number;
  fechaLimite: string;
  pagoTotal: number;
  diasMora: number;
  valorMora: number;
  numTransacciones: number;
  ultimoMovimiento: string;
  className?: string;
}

export function ObligacionInfoCard({
  saldoTotal,
  saldoDisponible,
  fechaLimite,
  pagoTotal,
  diasMora,
  valorMora,
  numTransacciones,
  ultimoMovimiento,
  className = "",
}: ObligacionInfoCardProps) {
  const { hideBalances } = useUIContext();

  const displayCurrency = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className={`p-6 rounded-2xl ${className}`}>
      <h2 className="text-[19px] font-bold text-brand-navy mb-4">
        Información General del Producto
      </h2>

      <Divider className="mb-6" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
        {/* Row 1 */}
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">Saldo Total</p>
          <p className="text-[21px] font-bold text-brand-navy">
            {displayCurrency(saldoTotal)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">
            Saldo Disponible
          </p>
          <p className="text-[21px] font-bold text-brand-navy">
            {displayCurrency(saldoDisponible)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">Fecha Límite</p>
          <p className="text-[14px] text-brand-text-black">{fechaLimite}</p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">Pago Total</p>
          <p className="text-[14px] text-brand-text-black">
            {displayCurrency(pagoTotal)}
          </p>
        </div>

        {/* Row 2 */}
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">Días de Mora</p>
          <p className="text-[14px] text-brand-text-black">{diasMora}</p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">Valor Mora</p>
          <p className="text-[14px] text-brand-text-black">
            {displayCurrency(valorMora)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">
            No. Transacciones
          </p>
          <p className="text-[14px] text-brand-text-black">{numTransacciones}</p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">
            Último Movimiento
          </p>
          <p className="text-[14px] text-brand-text-black">{ultimoMovimiento}</p>
        </div>
      </div>
    </Card>
  );
}
