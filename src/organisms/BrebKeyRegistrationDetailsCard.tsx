"use client";

import { Card } from "@/src/atoms";
import { mockBrebKeyTypeOptions } from "@/src/mocks/mockBrebKeyRegistrationData";
import type { BrebKeyType } from "@/src/types/brebKeyRegistration";

export interface BrebRegistrationAccountOption {
  id: string;
  label: string;
}

interface BrebKeyRegistrationDetailsCardProps {
  keyType: BrebKeyType | "";
  keyValue: string;
  accountId: string;
  accounts: BrebRegistrationAccountOption[];
  onKeyTypeChange: (value: BrebKeyType | "") => void;
  onAccountChange: (accountId: string) => void;
  loadingAccounts?: boolean;
  error?: string;
}

export function BrebKeyRegistrationDetailsCard({
  keyType,
  keyValue,
  accountId,
  accounts,
  onKeyTypeChange,
  onAccountChange,
  loadingAccounts,
  error,
}: BrebKeyRegistrationDetailsCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <h2 className="text-[19px] font-bold text-brand-navy">
        Registrar Nueva Llave Bre-B
      </h2>

      <div className="space-y-5 max-w-[520px] mx-auto w-full">
        <div>
          <label
            htmlFor="breb-key-type"
            className="block text-[15px] font-normal text-black mb-2"
          >
            Tipo de Llave
          </label>
          <select
            id="breb-key-type"
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
            htmlFor="breb-key-value"
            className="block text-[15px] font-normal text-black mb-2"
          >
            Llave Registrada
          </label>
          <input
            id="breb-key-value"
            type="text"
            readOnly
            value={keyValue}
            placeholder=""
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text bg-[#e7e7e7] text-[16px] text-brand-text-black outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="breb-key-account"
            className="block text-[14px] font-normal text-black mb-2"
          >
            Asociar a la cuenta
          </label>
          <select
            id="breb-key-account"
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
