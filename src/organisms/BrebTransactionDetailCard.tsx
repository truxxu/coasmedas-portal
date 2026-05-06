"use client";

import { Button } from "@/src/atoms";
import { useHideBalances } from "@/src/hooks";
import { formatCurrency, maskCurrency } from "@/src/utils";
import { BREB_TRANSACTION_STATUS_LABELS } from "@/src/mocks/mockBrebTransactionHistoryData";
import type { BrebTransaction } from "@/src/types/brebTransactionHistory";

interface BrebTransactionDetailCardProps {
  transaction: BrebTransaction;
  onRequestReversal: () => void;
  onDownloadReceipt?: () => void;
}

const STATUS_COLOR: Record<BrebTransaction["status"], string> = {
  exitosa: "text-brand-success-icon",
  fallida: "text-brand-error",
  revision_en_curso: "text-black",
};

function formatDateLong(iso: string): string {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const d = new Date(iso);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${day} ${month} de ${year}, ${hours}:${minutes} ${ampm}`;
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between py-1.5 text-[15px]">
      <span className="text-black">{label}</span>
      <span className={`text-black font-normal ${valueClass}`}>{value}</span>
    </div>
  );
}

export function BrebTransactionDetailCard({
  transaction,
  onRequestReversal,
  onDownloadReceipt,
}: BrebTransactionDetailCardProps) {
  const { hideBalances } = useHideBalances();
  const amount = hideBalances
    ? maskCurrency()
    : formatCurrency(transaction.amount);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-[21px] font-bold text-brand-navy mb-5">
          Detalle de la Transacción
        </h2>

        <div className="space-y-1">
          <Row label="Fecha y Hora:" value={formatDateLong(transaction.date)} />
          <Row label="ID de Transacción:" value={transaction.id} />
          <Row label="Llave Utilizada:" value={transaction.keyUsed ?? "-"} />
        </div>

        <div className="my-4 border-t border-brand-border" />

        <div className="space-y-1">
          <Row
            label="Medio de Pago Origen:"
            value={transaction.sourceProduct ?? "-"}
          />
          <Row
            label="Medio de Pago Destino:"
            value={transaction.destinationProduct ?? "-"}
            valueClass="font-medium"
          />
        </div>

        <div className="my-4 border-t border-brand-border" />

        <div className="space-y-1">
          <Row label="Valor:" value={amount} />
          <Row
            label="Estado Final:"
            value={BREB_TRANSACTION_STATUS_LABELS[transaction.status]}
            valueClass={STATUS_COLOR[transaction.status]}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 mt-6">
        {onDownloadReceipt && (
          <Button
            type="button"
            variant="secondary"
            onClick={onDownloadReceipt}
            className="h-10 px-7 text-brand-navy border-brand-navy"
          >
            Descargar Comprobante
          </Button>
        )}
        {transaction.status === "exitosa" && (
          <Button
            type="button"
            variant="primary"
            onClick={onRequestReversal}
            className="h-10 px-7"
          >
            Solicitar Revisión
          </Button>
        )}
      </div>
    </>
  );
}
