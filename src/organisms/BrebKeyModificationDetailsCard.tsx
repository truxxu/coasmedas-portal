"use client";

import { Card } from "@/src/atoms";
import {
  BREB_KEY_TYPE_LABELS,
  mockBrebKeyTypeOptions,
} from "@/src/mocks/mockBrebKeyRegistrationData";
import type {
  BrebKeyType,
  BrebRegisteredKey,
} from "@/src/types/brebKeyRegistration";

export interface BrebModificationAccountOption {
  id: string;
  label: string;
}

interface BrebKeyModificationDetailsCardProps {
  currentKey: BrebRegisteredKey;
  keyType: BrebKeyType | "";
  keyValue: string;
  accountId: string;
  accounts: BrebModificationAccountOption[];
  onKeyTypeChange: (value: BrebKeyType | "") => void;
  onAccountChange: (accountId: string) => void;
  loadingAccounts?: boolean;
  error?: string;
}

export function BrebKeyModificationDetailsCard({
  currentKey,
  keyType,
  keyValue,
  accountId,
  accounts,
  onKeyTypeChange,
  onAccountChange,
  loadingAccounts,
  error,
}: BrebKeyModificationDetailsCardProps) {
  const currentTypeLabel = BREB_KEY_TYPE_LABELS[currentKey.type];

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-[19px] font-bold text-brand-navy">
          Modificar Llave Bre-B
        </h2>
        <p className="mt-2 text-[14px] text-brand-gray-high">
          Esta acción cancelará tu llave actual y la reemplazará por una nueva.
        </p>
      </div>

      <div className="rounded-md border border-brand-danger-border bg-brand-danger-bg p-4 space-y-1">
        <p className="text-[15px] text-brand-danger-text">Llave a modificar:</p>
        <p className="text-[18px] font-bold text-brand-danger-text">
          {currentTypeLabel}: {currentKey.value}
        </p>
        {currentKey.associatedAccountMasked && (
          <p className="text-[15px] text-brand-danger-text">
            Asociada a: Cuenta de Ahorros ({currentKey.associatedAccountMasked})
          </p>
        )}
      </div>

      <div className="space-y-5 max-w-[520px] mx-auto w-full">
        <div>
          <label
            htmlFor="breb-modify-key-type"
            className="block text-[15px] font-normal text-black mb-2"
          >
            Tipo de Llave
          </label>
          <select
            id="breb-modify-key-type"
            value={keyType}
            onChange={(e) =>
              onKeyTypeChange(e.target.value as BrebKeyType | "")
            }
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-[16px] text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Seleccione el Tipo de Llave</option>
            {mockBrebKeyTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="breb-modify-key-value"
            className="block text-[15px] font-normal text-black mb-2"
          >
            Llave Registrada
          </label>
          <input
            id="breb-modify-key-value"
            type="text"
            readOnly
            value={keyValue}
            placeholder=""
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text bg-[#e7e7e7] text-[16px] text-brand-text-black outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="breb-modify-account"
            className="block text-[14px] font-normal text-black mb-2"
          >
            Asociar a la cuenta
          </label>
          <select
            id="breb-modify-account"
            value={accountId}
            onChange={(e) => onAccountChange(e.target.value)}
            disabled={loadingAccounts || accounts.length === 0}
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-[16px] text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:bg-[#e7e7e7] disabled:cursor-not-allowed"
          >
            {loadingAccounts ? (
              <option value="">Cargando cuentas...</option>
            ) : accounts.length === 0 ? (
              <option value="">No hay cuentas disponibles</option>
            ) : (
              accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.label}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-brand-error text-center">{error}</p>}
    </Card>
  );
}
