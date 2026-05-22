"use client";

import type { ScheduledTransfer } from "@/src/types/scheduledTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ScheduledTransfersTableProps {
  transfers: ScheduledTransfer[];
  hideBalances: boolean;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onDelete: (transferId: string) => void;
  onBack: () => void;
}

export function ScheduledTransfersTable({
  transfers,
  hideBalances,
  onExportPDF,
  onExportExcel,
  onDelete,
  onBack,
}: ScheduledTransfersTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-navy">
          Historial de Pagos Programados
        </h2>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onExportPDF}
            className="flex items-center gap-1.5 text-[13.7px] font-medium text-black hover:underline"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12H12M8 2V9M8 9L5 6M8 9L11 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Exportar PDF
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-1.5 text-[13.7px] font-medium text-black hover:underline"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12H12M8 2V9M8 9L5 6M8 9L11 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Table */}
      {transfers.length === 0 ? (
        <p className="text-center text-brand-gray-high py-8">
          No hay pagos programados
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left text-[15px] font-normal text-black py-3 pr-4">
                  TIPO
                </th>
                <th className="text-left text-[15px] font-normal text-black py-3 pr-4">
                  ORIGEN
                </th>
                <th className="text-left text-[15px] font-normal text-black py-3 pr-4">
                  DESTINO
                </th>
                <th className="text-left text-[15px] font-normal text-black py-3 pr-4">
                  PRÓXIMA EJECUCIÓN
                </th>
                <th className="text-left text-[15px] font-normal text-black py-3 pr-4">
                  PERIODICIDAD
                </th>
                <th className="text-right text-[15px] font-normal text-black py-3 pr-4">
                  MONTO
                </th>
                <th className="text-left text-[15px] font-normal text-black py-3 pr-4">
                  ESTADO
                </th>
                <th className="text-left text-[15px] font-normal text-black py-3">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr
                  key={transfer.id}
                  className="border-b border-brand-border last:border-b-0"
                >
                  <td className="text-[13.7px] text-black py-3 pr-4">
                    {transfer.type}
                  </td>
                  <td className="text-[13.7px] text-black py-3 pr-4">
                    {transfer.origin}
                  </td>
                  <td className="text-[13.7px] text-black py-3 pr-4">
                    {transfer.destination}
                  </td>
                  <td className="text-[13.7px] text-black py-3 pr-4">
                    {transfer.nextExecutionDate}
                  </td>
                  <td className="text-[13.7px] text-black py-3 pr-4">
                    {transfer.periodicity}
                  </td>
                  <td className="text-[13.7px] text-black py-3 pr-4 text-right">
                    {hideBalances
                      ? maskCurrency()
                      : formatCurrency(transfer.amount)}
                  </td>
                  <td className="text-[13.7px] text-brand-positive font-medium py-3 pr-4">
                    {transfer.status}
                  </td>
                  <td className="text-[13.7px] py-3">
                    <button
                      type="button"
                      onClick={() => onDelete(transfer.id)}
                      className="text-red-600 hover:underline"
                      aria-label={`Eliminar transferencia a ${transfer.destination}`}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
