import React from "react";
import { Card } from "@/src/atoms";
import {
  PaymentConfirmationData,
  UnifiedRecordView,
} from "@/src/types/payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface PaymentConfirmationCardProps {
  confirmationData: PaymentConfirmationData;
  hideBalances: boolean;
}

const SECTION_TITLES: Record<
  "aportes" | "obligaciones" | "proteccion",
  string
> = {
  aportes: "Aportes",
  obligaciones: "Obligaciones",
  proteccion: "Protección",
};

const CATEGORY_ORDER: Array<"aportes" | "obligaciones" | "proteccion"> = [
  "aportes",
  "obligaciones",
  "proteccion",
];

export const PaymentConfirmationCard: React.FC<
  PaymentConfirmationCardProps
> = ({ confirmationData, hideBalances }) => {
  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  const groups = confirmationData.recordsByCategory;
  const hasGroupedRecords =
    !!groups && CATEGORY_ORDER.some((category) => groups[category].length > 0);

  const renderRow = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm md:text-base text-brand-text-black">
        {label}
      </span>
      <span className="text-sm md:text-base text-brand-text-black text-right">
        {value}
      </span>
    </div>
  );

  const renderRecord = (
    record: UnifiedRecordView,
    category: "aportes" | "obligaciones" | "proteccion",
    index: number,
  ) => (
    <div
      key={`${category}-${record.idCuenta}-${index}`}
      className={`space-y-2 ${index > 0 ? "pt-4 mt-4 border-t border-brand-border" : ""}`}
    >
      {renderRow("Línea:", record.linea)}
      {renderRow("Fecha Apertura:", record.fechaApertura)}
      {renderRow("Saldo Total:", displayAmount(record.saldoTotal))}
      {renderRow("Saldo Límite:", record.fechaLimitePago)}
      {category !== "proteccion" &&
        renderRow("Valor Mora:", displayAmount(record.valorEnMora))}
      {renderRow("Pago Mínimo:", displayAmount(record.pagoMinimo))}
    </div>
  );

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-sm md:text-base text-brand-gray-high">
          Por favor, verifica que los datos de la transformación sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-brand-text-black">
            Titular:
          </span>
          <span className="text-sm md:text-base text-brand-text-black font-medium">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-brand-text-black">
            Documento:
          </span>
          <span className="text-sm md:text-base text-brand-text-black font-medium">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      {hasGroupedRecords ? (
        <div className="space-y-6">
          {CATEGORY_ORDER.map((category) => {
            const records = groups?.[category] ?? [];
            if (records.length === 0) return null;
            return (
              <section key={category} className="space-y-3">
                <div className="border-t border-brand-border pt-4">
                  <h3 className="text-lg md:text-xl font-bold text-brand-navy">
                    {SECTION_TITLES[category]}
                  </h3>
                </div>
                <div className="space-y-1">
                  {records.map((record, index) =>
                    renderRecord(record, category, index),
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="border-t border-brand-border pt-4">
          <h3 className="text-xl md:text-2xl font-bold text-brand-navy mt-2">
            Resumen del pago:
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-brand-text-black">
                Aportes:
              </span>
              <span className="text-sm md:text-base text-brand-text-black">
                {displayAmount(confirmationData.aportes)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-brand-text-black">
                Obligaciones:
              </span>
              <span className="text-sm md:text-base text-brand-text-black">
                {displayAmount(confirmationData.obligaciones)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-brand-text-black">
                Protección:
              </span>
              <span className="text-sm md:text-base text-brand-text-black">
                {displayAmount(confirmationData.proteccion)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-brand-border space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-brand-text-black">
            Producto a Debitar:
          </span>
          <span className="text-sm md:text-base text-brand-text-black font-medium">
            {confirmationData.debitAccount}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-brand-text-black">
            Valor Total a Pagar:
          </span>
          <span className="text-base md:text-lg text-brand-navy font-bold">
            {displayAmount(confirmationData.totalAmount)}
          </span>
        </div>
      </div>
    </Card>
  );
};
