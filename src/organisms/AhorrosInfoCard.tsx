"use client";

import { Card, Divider } from "@/src/atoms";
import { useUIContext } from "@/src/contexts";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface AhorrosInfoCardProps {
  saldoTotal: number;
  saldoDisponible: number;
  canjeLocal: number;
  canjeTotal: number;
  remesas: number;
  numTransacciones: number;
  ultimoMovimiento: string;
  className?: string;
}

export function AhorrosInfoCard({
  saldoTotal,
  saldoDisponible,
  canjeLocal,
  canjeTotal,
  remesas,
  numTransacciones,
  ultimoMovimiento,
  className = "",
}: AhorrosInfoCardProps) {
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
          <p className="text-[14px] text-brand-gray-medium mb-1">Bolsillos</p>
          <p className="text-[14px] text-brand-text-black">
            {displayCurrency(canjeLocal)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">Canje Total</p>
          <p className="text-[14px] text-brand-text-black">
            {displayCurrency(canjeTotal)}
          </p>
        </div>

        {/* Row 2 */}
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">Remesas</p>
          <p className="text-[14px] text-brand-text-black">
            {displayCurrency(remesas)}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">
            No. Transacciones
          </p>
          <p className="text-[14px] text-brand-text-black">
            {numTransacciones}
          </p>
        </div>
        <div>
          <p className="text-[14px] text-brand-gray-medium mb-1">
            Último Movimiento
          </p>
          <p className="text-[14px] text-brand-text-black">
            {ultimoMovimiento}
          </p>
        </div>
      </div>
    </Card>
  );
}
