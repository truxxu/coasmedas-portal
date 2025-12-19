'use client';

import { Card, Divider } from '@/src/atoms';
import { useUIContext } from '@/src/contexts';
import { formatCurrency, maskCurrency, maskNumber } from '@/src/utils';
import { formatDateCapitalized } from '@/src/utils/dates';
import { ProductDetail } from '@/src/types/products';

interface AportesInfoCardProps {
  planName: string;
  productNumber: string;
  totalBalance: number;
  paymentDeadline: string;
  detalleAportes: ProductDetail;
  detalleFondos: ProductDetail;
  className?: string;
}

interface DetailColumnProps {
  title: string;
  data: ProductDetail;
  hideBalances: boolean;
}

function DetailColumn({ title, data, hideBalances }: DetailColumnProps) {
  const displayCurrency = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <div>
      <h3 className="text-[14px] font-medium text-brand-navy underline-offset-2 hover:underline cursor-pointer mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-[#6A717F]">Vigentes:</span>
          <span className="text-[14px] font-medium text-black">
            {displayCurrency(data.vigentes)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-[#6A717F]">En mora:</span>
          <span className={`text-[15px] font-bold ${data.enMora > 0 ? 'text-red-600' : 'text-red-600'}`}>
            {displayCurrency(data.enMora)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[14px] text-[#6A717F]">Fecha cubrimiento:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDateCapitalized(data.fechaCubrimiento)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AportesInfoCard({
  planName,
  productNumber,
  totalBalance,
  paymentDeadline,
  detalleAportes,
  detalleFondos,
  className = '',
}: AportesInfoCardProps) {
  const { hideBalances } = useUIContext();

  const displayCurrency = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className={`p-6 rounded-2xl ${className}`}>
      {/* Plan name */}
      <h2 className="text-[20px] font-bold text-brand-navy mb-4">{planName}</h2>

      <Divider className="mb-6" />

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_3fr_3fr] gap-6">
        {/* Left column - General info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#6A717F]">Número de producto:</span>
            <span className="text-[14px] font-medium text-black">
              {maskNumber(productNumber)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#6A717F]">Saldo total aportes:</span>
            <span className="text-[18px] font-bold text-brand-navy">
              {displayCurrency(totalBalance)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#6A717F]">Fecha límite de pago:</span>
            <span className="text-[14px] font-medium text-black">
              {formatDateCapitalized(paymentDeadline)}
            </span>
          </div>
        </div>

        {/* Middle column - Detalle Aportes */}
        <DetailColumn
          title="Detalle Aportes"
          data={detalleAportes}
          hideBalances={hideBalances}
        />

        {/* Right column - Detalle Fondos */}
        <DetailColumn
          title="Detalle Fondos"
          data={detalleFondos}
          hideBalances={hideBalances}
        />
      </div>
    </Card>
  );
}
