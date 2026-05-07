"use client";

import { Card } from "@/src/atoms";
import type { BrebSourceAccount } from "@/src/types/brebKeyTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface BrebQrPaymentDetailsCardProps {
  destinationName: string;
  sourceAccounts: BrebSourceAccount[];
  selectedSourceId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function BrebQrPaymentDetailsCard({
  destinationName,
  sourceAccounts,
  selectedSourceId,
  amount,
  onSourceChange,
  onAmountChange,
  hideBalances,
  error,
}: BrebQrPaymentDetailsCardProps) {
  const formatSourceOption = (account: BrebSourceAccount) => {
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.type} - Saldo: ${balance}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    onAmountChange(value);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("es-CO") : "0";

  return (
    <Card className="space-y-6 p-8">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="breb-qr-destination"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Pagando a:
          </label>
          <div
            id="breb-qr-destination"
            className="w-full h-11 px-3 flex items-center rounded-md bg-brand-gray-light text-base font-bold text-brand-navy"
          >
            {destinationName}
          </div>
        </div>

        <div>
          <label
            htmlFor="breb-qr-source-account"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Cuenta Origen
          </label>
          <select
            id="breb-qr-source-account"
            value={selectedSourceId}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-base text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {sourceAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {formatSourceOption(account)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="breb-qr-amount"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Monto a Enviar
          </label>
          <div className="flex items-center border-b border-brand-footer-text pb-2">
            <span className="text-[19px] font-medium text-brand-gray-high mr-2">
              $
            </span>
            <input
              id="breb-qr-amount"
              type="text"
              inputMode="numeric"
              value={formattedAmount}
              onChange={handleAmountChange}
              className="flex-1 text-right text-[19px] font-medium text-brand-text-black bg-transparent border-none outline-none focus:ring-0"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-brand-error text-center">{error}</p>}
    </Card>
  );
}
