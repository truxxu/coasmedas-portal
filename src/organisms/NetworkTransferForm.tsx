"use client";

import React, { useMemo } from "react";
import { Card } from "@/src/atoms";
import { TransferAmountInput } from "@/src/molecules";
import {
  NetworkSourceAccount,
  RegisteredNetworkAccount,
} from "@/src/types/networkTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface NetworkTransferFormProps {
  sourceAccounts: NetworkSourceAccount[];
  registeredAccounts: RegisteredNetworkAccount[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  concept: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (destinationId: string) => void;
  onAmountChange: (amount: string) => void;
  onConceptChange: (concept: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function NetworkTransferForm({
  sourceAccounts,
  registeredAccounts,
  selectedSourceId,
  selectedDestinationId,
  amount,
  concept,
  onSourceChange,
  onDestinationChange,
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

  // Build destination options from registered accounts
  const destinationOptions = useMemo(() => {
    const options: {
      id: string;
      label: string;
      recipientName: string;
    }[] = [];

    registeredAccounts.forEach((account) => {
      account.products.forEach((product) => {
        options.push({
          id: `${account.id}-${product.id}`,
          label: `${account.name} - ${product.name} (${product.maskedNumber})`,
          recipientName: account.name,
        });
      });
    });

    return options;
  }, [registeredAccounts]);

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Transferencias a Cuentas de mi Red Coopcentral
        </h2>
        <p className="text-[15px] text-brand-gray-high mt-1">
          Envia dinero a otras cooperativas de la Red Coopcentral
        </p>
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

      {/* Destination Account Select */}
      <div>
        <label
          htmlFor="destination-account"
          className="block text-[15px] text-brand-text-black mb-2"
        >
          Cuenta destino
        </label>
        <select
          id="destination-account"
          value={selectedDestinationId}
          onChange={(e) => onDestinationChange(e.target.value)}
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
          <option value="">Selecciona una cuenta inscrita...</option>
          {destinationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Transfer Amount */}
      <TransferAmountInput
        value={amount}
        onChange={onAmountChange}
        label="¿Que valor deseas transferir?"
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
