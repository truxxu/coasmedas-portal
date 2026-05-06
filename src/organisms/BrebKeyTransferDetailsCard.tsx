"use client";

import { Card, Input } from "@/src/atoms";
import type { BrebSourceAccount } from "@/src/types/brebKeyTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface BrebKeyTransferDetailsCardProps {
  sourceAccounts: BrebSourceAccount[];
  selectedSourceId: string;
  destinationKey: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onDestinationKeyChange: (key: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

const NON_DIGITS = /[^0-9]/g;

export function BrebKeyTransferDetailsCard({
  sourceAccounts,
  selectedSourceId,
  destinationKey,
  amount,
  onSourceChange,
  onDestinationKeyChange,
  onAmountChange,
  hideBalances,
  error,
}: BrebKeyTransferDetailsCardProps) {
  const formatSourceOption = (account: BrebSourceAccount) => {
    const baseLabel = `${account.type}${
      account.maskedNumber ? ` (${account.maskedNumber})` : ""
    }`;
    if (account.balance <= 0) {
      return baseLabel;
    }
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${baseLabel} - Saldo: ${balance}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(NON_DIGITS, "");
    onAmountChange(value);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("es-CO") : "0";

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Pagar o Transferir con Llave
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="breb-source-account"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Cuenta Origen
          </label>
          <select
            id="breb-source-account"
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
            htmlFor="breb-destination-key"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Llave del Destinatario
          </label>
          <Input
            id="breb-destination-key"
            type="text"
            value={destinationKey}
            onChange={(e) => onDestinationKeyChange(e.target.value)}
            placeholder="Cédula, celular, email, etc."
          />
        </div>

        <div>
          <label
            htmlFor="breb-transfer-amount"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Monto a Enviar
          </label>
          <div className="flex items-center border-b border-brand-footer-text pb-2">
            <span className="text-[19px] font-medium text-brand-gray-high mr-2">
              $
            </span>
            <input
              id="breb-transfer-amount"
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
