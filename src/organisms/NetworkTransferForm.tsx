"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { DestinationProductCard, TransferAmountInput } from "@/src/molecules";
import { SourceAccount, NetworkProduct } from "@/src/types/networkTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface NetworkTransferFormProps {
  recipientName: string;
  sourceAccounts: SourceAccount[];
  destinationProduct: NetworkProduct;
  selectedSourceId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function NetworkTransferForm({
  recipientName,
  sourceAccounts,
  destinationProduct,
  selectedSourceId,
  amount,
  onSourceChange,
  onAmountChange,
  hideBalances,
  error,
}: NetworkTransferFormProps) {
  const formatAccountOption = (account: SourceAccount) => {
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.name} - Saldo: ${balance}`;
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-lg font-bold text-brand-navy">
        Transferencias a {recipientName}
      </h2>

      {/* Source Account Select */}
      <div>
        <label
          htmlFor="source-account"
          className="block text-[15px] text-brand-text-black mb-2"
        >
          ¿De cuál cuenta quieres transferir?
        </label>
        <select
          id="source-account"
          value={selectedSourceId}
          onChange={(e) => onSourceChange(e.target.value)}
          className="
            w-full h-11 px-3 pr-10
            rounded-md border border-brand-footer-text
            text-base text-brand-text-black
            focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none
            appearance-none bg-white
            bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')]
            bg-no-repeat bg-[right_12px_center]
          "
        >
          <option value="">Seleccionar cuenta</option>
          {sourceAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {formatAccountOption(account)}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Product */}
      <div>
        <label className="block text-sm text-brand-text-black mb-2">
          Selecciona el producto de destino:
        </label>
        <DestinationProductCard
          productName={destinationProduct.name}
          maskedNumber={destinationProduct.maskedNumber}
          productType={
            destinationProduct.type === "ahorros" ? "Ahorros" : "Corriente"
          }
          isSelected
        />
      </div>

      {/* Transfer Amount */}
      <TransferAmountInput
        value={amount}
        onChange={onAmountChange}
        label="Valor a Transferir"
      />

      {error && (
        <p className="text-sm text-brand-error text-center">{error}</p>
      )}
    </Card>
  );
}
