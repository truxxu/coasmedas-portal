"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { TransferAmountInput, DestinationProductCard } from "@/src/molecules";
import {
  NetworkSourceAccount,
  NetworkProduct,
} from "@/src/types/networkTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface NetworkTransferFormProps {
  sourceAccounts: NetworkSourceAccount[];
  recipientName: string;
  recipientProducts: NetworkProduct[];
  selectedSourceId: string;
  selectedDestinationProductId: string;
  amount: string;
  concept: string;
  onSourceChange: (accountId: string) => void;
  onDestinationProductChange: (productId: string) => void;
  onAmountChange: (amount: string) => void;
  onConceptChange: (concept: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function NetworkTransferForm({
  sourceAccounts,
  recipientName,
  recipientProducts,
  selectedSourceId,
  selectedDestinationProductId,
  amount,
  concept,
  onSourceChange,
  onDestinationProductChange,
  onAmountChange,
  onConceptChange,
  hideBalances,
  error,
}: NetworkTransferFormProps) {
  const formatAccountOption = (account: NetworkSourceAccount) => {
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.name} - Saldo: ${balance}`;
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Transferencias a {recipientName}
        </h2>
      </div>

      {/* Source Account Select */}
      <div>
        <label
          htmlFor="source-account"
          className="block text-[15px] text-brand-text-black mb-2"
        >
          ¿De cual cuenta quieres transferir?
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

      {/* Destination Product Selection */}
      <div>
        <label className="block text-[15px] text-brand-text-black mb-2">
          Selecciona el producto de destino:
        </label>
        <div className="space-y-3">
          {recipientProducts.map((product) => (
            <DestinationProductCard
              key={product.id}
              productName={product.name}
              maskedNumber={product.maskedNumber}
              productType={product.type === "ahorros" ? "Ahorros" : "Corriente"}
              isSelected={selectedDestinationProductId === product.id}
              onClick={() => onDestinationProductChange(product.id)}
            />
          ))}
        </div>
      </div>

      {/* Transfer Amount */}
      <TransferAmountInput
        value={amount}
        onChange={onAmountChange}
        label="Valor a Transferir"
      />

      {/* Concept Input - Optional */}
      <div>
        <label
          htmlFor="concept"
          className="block text-sm text-brand-text-black mb-2"
        >
          Concepto (Opcional)
        </label>
        <input
          type="text"
          id="concept"
          value={concept}
          onChange={(e) => onConceptChange(e.target.value)}
          placeholder="Descripcion de la transferencia"
          maxLength={100}
          className="
            w-full h-11 px-3
            rounded-md border border-brand-footer-text
            text-base text-brand-text-black
            placeholder:text-brand-footer-text
            focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none
          "
        />
      </div>

      {error && (
        <p className="text-sm text-brand-error text-center">{error}</p>
      )}
    </Card>
  );
}
