"use client";

import { Card } from "@/src/atoms";
import type { TransferAccount, DestinationProduct } from "@/src/types/transfer";
import { formatCurrency, maskNumber, maskCurrency } from "@/src/utils";

interface TransferDetailsCardProps {
  accounts: TransferAccount[];
  destinations: DestinationProduct[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (productId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function TransferDetailsCard({
  accounts,
  destinations,
  selectedSourceId,
  selectedDestinationId,
  amount,
  onSourceChange,
  onDestinationChange,
  onAmountChange,
  hideBalances,
  error,
}: TransferDetailsCardProps) {
  const formatAccountOption = (account: TransferAccount) => {
    const maskedNumber = maskNumber(account.productNumber);
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.name} (${maskedNumber}) - Saldo: ${balance}`;
  };

  const formatDestinationOption = (product: DestinationProduct) => {
    const maskedNumber = maskNumber(product.productNumber);
    return `${product.name} (${maskedNumber})`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    onAmountChange(value);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("es-CO") : "0";

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Transferencias entre mis productos
        </h2>
        <p className="text-[15px] text-brand-text-black">
          Mueve dinero entre tus cuentas de ahorro, bolsillos, inversiones y
          mas.
        </p>
      </div>

      <div className="space-y-5">
        {/* Source Account */}
        <div>
          <label
            htmlFor="source-account"
            className="block text-[15px] text-brand-text-black mb-2"
          >
            De cual cuenta quieres transferir?
          </label>
          <select
            id="source-account"
            value={selectedSourceId}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-base text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {formatAccountOption(account)}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Product */}
        <div>
          <label
            htmlFor="destination-product"
            className="block text-[15px] text-brand-text-black mb-2"
          >
            A que producto quieres abonar?
          </label>
          <select
            id="destination-product"
            value={selectedDestinationId}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-base text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Seleccionar producto</option>
            {destinations
              .filter((d) => d.id !== selectedSourceId)
              .map((product) => (
                <option key={product.id} value={product.id}>
                  {formatDestinationOption(product)}
                </option>
              ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="transfer-amount"
            className="block text-[15px] text-brand-text-black mb-2"
          >
            Que valor deseas transferir?
          </label>
          <div className="flex items-center border-b border-brand-footer-text pb-2">
            <span className="text-[19px] font-medium text-brand-gray-high mr-2">
              $
            </span>
            <input
              id="transfer-amount"
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
