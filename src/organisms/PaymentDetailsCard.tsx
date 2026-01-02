import React from "react";
import { Card } from "@/src/atoms";
import { PaymentSummaryRow } from "@/src/molecules";
import { PaymentAccount, PendingPayments } from "@/src/types/payment";
import { formatCurrency } from "@/src/utils";

interface PaymentDetailsCardProps {
  accounts: PaymentAccount[];
  pendingPayments: PendingPayments;
  selectedAccountId: string;
  onAccountChange: (accountId: string) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  accounts,
  pendingPayments,
  selectedAccountId,
  onAccountChange,
  onNeedMoreBalance,
  hideBalances,
}) => {
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: `${account.name} - Saldo: ${formatCurrency(account.balance)}`,
  }));

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1D4E8F] mb-2">
          Resumen de Pago Unificado
        </h2>
        <p className="text-base text-[#58585B]">
          A continuación, se presenta el resumen de todos tus pagos mínimos
          pendientes. Puedes pagar todo desde aquí.
        </p>
      </div>

      <div>
        <label className="block text-base font-medium text-[#111827] mb-2">
          ¿De cuál cuenta quieres transferir?
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="w-full sm:flex-1 h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-[#111827] focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value="pse">PSE (Pagos con otras entidades)</option>
          </select>
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-sm text-[#007FFF] hover:underline whitespace-nowrap self-end sm:self-auto"
          >
            ¿Necesitas más saldo?
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <PaymentSummaryRow
          label="Total Aportes:"
          amount={pendingPayments.aportes}
          hideAmount={hideBalances}
        />
        <PaymentSummaryRow
          label="Total Obligaciones (pago mínimo):"
          amount={pendingPayments.obligaciones}
          hideAmount={hideBalances}
        />
        <PaymentSummaryRow
          label="Total Protección:"
          amount={pendingPayments.proteccion}
          hideAmount={hideBalances}
        />
        <PaymentSummaryRow
          label="Total a Pagar:"
          amount={pendingPayments.total}
          variant="total"
          hideAmount={hideBalances}
        />
      </div>
    </Card>
  );
};
