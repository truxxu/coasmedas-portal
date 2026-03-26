"use client";

import Link from "next/link";
import { Card, Input } from "@/src/atoms";
import type {
  ExternalTransferSourceAccount,
  ExternalTransferDestinationAccount,
} from "@/src/types/externalTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ExternalTransferDetailsCardProps {
  sourceAccounts: ExternalTransferSourceAccount[];
  destinationAccounts: ExternalTransferDestinationAccount[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  concept: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  onConceptChange: (concept: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function ExternalTransferDetailsCard({
  sourceAccounts,
  destinationAccounts,
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
}: ExternalTransferDetailsCardProps) {
  const formatSourceOption = (account: ExternalTransferSourceAccount) => {
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.type} - Saldo: ${balance}`;
  };

  const formatDestinationOption = (
    account: ExternalTransferDestinationAccount,
  ) => {
    return `${account.alias} (${account.bankName})`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    onAmountChange(value);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("es-CO") : "0";

  const hasNoDestinations = destinationAccounts.length === 0;

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Transferencias Externas
        </h2>
        <p className="text-[14px] text-brand-gray-high">
          Transfiere dinero a cuentas en otros bancos o entidades financieras.
        </p>
      </div>

      <div className="space-y-5">
        {/* Source Account */}
        <div>
          <label
            htmlFor="source-account"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
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
            {sourceAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {formatSourceOption(account)}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Account */}
        <div>
          <label
            htmlFor="destination-account"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Cuenta destino
          </label>
          {hasNoDestinations ? (
            <div className="p-4 bg-brand-background rounded-lg border border-brand-border">
              <p className="text-[14px] text-brand-gray-high mb-2">
                No tienes cuentas inscritas. Registra una cuenta para realizar
                transferencias.
              </p>
              <Link
                href="/transferencias/inscribir-cuentas"
                className="text-[14px] font-medium text-brand-teal-dark hover:underline"
              >
                Inscribir cuenta
              </Link>
            </div>
          ) : (
            <select
              id="destination-account"
              value={selectedDestinationId}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-base text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
              <option value="">Selecciona una cuenta inscrita...</option>
              {destinationAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {formatDestinationOption(account)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="transfer-amount"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
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

        {/* Concept */}
        <div>
          <label
            htmlFor="transfer-concept"
            className="block text-[14px] font-medium text-brand-text-black mb-2"
          >
            Cual es el concepto de la transaccion?{" "}
            <span className="font-normal text-brand-gray-high">(opcional)</span>
          </label>
          <Input
            id="transfer-concept"
            type="text"
            value={concept}
            onChange={(e) => onConceptChange(e.target.value)}
            placeholder="Descripcion de la transferencia"
            maxLength={100}
          />
        </div>
      </div>

      {error && <p className="text-sm text-brand-error text-center">{error}</p>}
    </Card>
  );
}
