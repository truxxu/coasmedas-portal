"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/src/atoms";
import { CardActionOptionCard } from "@/src/molecules";
import { useUIContext } from "@/src/contexts";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { formatCurrency, maskCurrency } from "@/src/utils";
import { formatDate } from "@/src/utils/dates";

interface TarjetaCreditoDetailsCardProps {
  product: TarjetaCreditoProduct;
}

type TabId = "resumen" | "operaciones";

const STATUS_BADGE: Record<
  TarjetaCreditoProduct["status"],
  { label: string; className: string }
> = {
  activa: {
    label: "Activa",
    className: "bg-brand-gray-light text-brand-success-icon",
  },
  pendiente_activacion: {
    label: "Pendiente",
    className: "bg-brand-gray-light text-brand-navy",
  },
  bloqueada: {
    label: "Bloqueada",
    className: "bg-brand-gray-light text-brand-error",
  },
};

export function TarjetaCreditoDetailsCard({
  product,
}: TarjetaCreditoDetailsCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("resumen");
  const { hideBalances } = useUIContext();
  const router = useRouter();

  const isActiva = product.status === "activa";
  const badge = STATUS_BADGE[product.status];

  const usagePct =
    product.cupoTotal > 0
      ? Math.min(100, (product.cupoUtilizado / product.cupoTotal) * 100)
      : 0;

  const fmt = (n: number) =>
    hideBalances ? maskCurrency() : formatCurrency(n);

  const handlePagarTarjeta = () => {
    router.push(`/tarjeta/pagar?cardId=${product.id}`);
  };

  const handleRealizarAvance = () => {
    router.push(`/tarjeta/avance?cardId=${product.id}`);
  };

  const handleBloquearActivar = () => {
    router.push("/tarjeta/bloqueo-activacion");
  };

  // TODO: wire remaining actions to real flows when available (e.g. /tarjeta/clave)
  const noop = () => {};

  return (
    <div className="bg-white rounded-2xl p-6">
      <Tabs
        tabs={[
          { id: "resumen", label: "Resumen y Movimientos" },
          { id: "operaciones", label: "Operaciones y Ajustes" },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      {activeTab === "resumen" ? (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-medium text-black">
              Resumen de la Tarjeta
            </h3>
            <span
              className={`text-[13px] px-3 py-1 rounded-full ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          {isActiva ? (
            <>
              <div className="flex items-end justify-between mb-1">
                <span className="text-[12px] font-medium text-brand-navy">
                  Utilizado: {fmt(product.cupoUtilizado)}
                </span>
                <span className="text-[12px] text-brand-gray-muted">
                  Disponible: {fmt(product.cupoDisponible)}
                </span>
              </div>
              <div className="h-[10px] w-full rounded-full bg-brand-border overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all"
                  style={{ width: `${usagePct}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-[12px] text-brand-gray-muted">
                    Deuda Total
                  </p>
                  <p className="text-[15px] font-medium text-brand-navy">
                    {fmt(product.deudaTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-brand-gray-muted">
                    Cupo Total
                  </p>
                  <p className="text-[15px] font-medium text-brand-navy">
                    {fmt(product.cupoTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-brand-gray-muted">
                    Pago Mínimo
                  </p>
                  <p className="text-[15px] font-medium text-brand-navy">
                    {fmt(product.pagoMinimo)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-brand-gray-muted">
                    Fecha Límite de Pago
                  </p>
                  <p className="text-[15px] font-medium text-brand-navy">
                    {product.fechaLimitePago
                      ? formatDate(product.fechaLimitePago)
                      : "-"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-brand-gray-light rounded-lg px-6 py-10 text-center">
              <p className="text-[14px] text-black">
                Esta tarjeta no está activa. No puedes realizar pagos ni
                avances.
              </p>
              {product.status === "pendiente_activacion" && (
                <p className="text-[14px] text-black mt-1">
                  Dirígete a la opción &ldquo;Bloquear/ Activar&rdquo; para
                  habilitarla.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardActionOptionCard
            title="Pagar Tarjeta"
            description="Realiza el pago de tu tarjeta."
            onClick={handlePagarTarjeta}
            disabled={!isActiva}
          />
          <CardActionOptionCard
            title="Realizar Avance"
            description="Transfiere de tu cupo a tu cuenta."
            onClick={handleRealizarAvance}
            disabled={!isActiva}
          />
          <CardActionOptionCard
            title="Bloquear / Activar"
            description="Gestiona la seguridad de tu tarjeta."
            onClick={handleBloquearActivar}
          />
          <CardActionOptionCard
            title="Gestionar Clave"
            description="Asigna, cambia u olvida tu clave."
            onClick={noop}
          />
        </div>
      )}
    </div>
  );
}
