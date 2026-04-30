"use client";

import { Card } from "@/src/atoms";
import { BREB_KEY_TYPE_LABELS } from "@/src/mocks/mockBrebKeyRegistrationData";
import type {
  BrebAvailableNewKey,
  BrebKeyInUseElsewhere,
} from "@/src/types/brebKeyModification";
import type { BrebRegisteredKey } from "@/src/types/brebKeyRegistration";

interface AccountOption {
  id: string;
  label: string;
}

interface BrebKeyModificationDetailsCardProps {
  currentKey: BrebRegisteredKey;
  availableKeys: BrebAvailableNewKey[];
  keysInUseElsewhere: BrebKeyInUseElsewhere[];
  accountOptions: AccountOption[];
  selectedNewKeyId: string;
  accountId: string;
  onSelectNewKey: (keyId: string) => void;
  onAccountChange: (accountId: string) => void;
  error?: string;
}

const TYPE_DESCRIPTOR: Record<string, string> = {
  celular: "Celular",
  correo: "Correo Electrónico",
  documento: "Documento",
  aleatoria: "Alfanumérica",
};

export function BrebKeyModificationDetailsCard({
  currentKey,
  availableKeys,
  keysInUseElsewhere,
  accountOptions,
  selectedNewKeyId,
  accountId,
  onSelectNewKey,
  onAccountChange,
  error,
}: BrebKeyModificationDetailsCardProps) {
  const currentTypeLabel = BREB_KEY_TYPE_LABELS[currentKey.type];

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-[18px] font-bold text-brand-navy">
          Modificar Llave Bre-B
        </h2>
        <p className="mt-2 text-[14px] text-brand-gray-high">
          Esta acción cancelará tu llave actual y la reemplazará por una nueva
          de las disponibles.
        </p>
      </div>

      <div className="rounded-md border border-brand-danger-border bg-brand-danger-bg p-4 space-y-1">
        <p className="text-[15px] text-brand-danger-text">Llave a modificar:</p>
        <p className="text-[18px] font-bold text-brand-danger-text">
          {currentTypeLabel}: {currentKey.value}
        </p>
        <p className="text-[15px] text-brand-danger-text">
          Asociada a: Cuenta de Ahorros ({currentKey.associatedAccountMasked})
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[18px] font-bold text-brand-navy">
          Selecciona la nueva llave
        </h3>
        <p className="text-[15px] font-medium text-brand-navy">
          Asociar nuevo tipo
        </p>

        <ul className="space-y-3">
          {availableKeys.map((key) => {
            const isCurrent =
              key.value === currentKey.value && key.type === currentKey.type;
            const isSelected = selectedNewKeyId === key.id;
            const descriptor = TYPE_DESCRIPTOR[key.type] ?? "";

            return (
              <li key={key.id}>
                <label
                  className={`flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-brand-primary bg-brand-primary-light"
                      : "border-brand-border bg-white hover:bg-brand-gray-light"
                  }`}
                >
                  <input
                    type="radio"
                    name="breb-new-key"
                    value={key.id}
                    checked={isSelected}
                    onChange={() => onSelectNewKey(key.id)}
                    className="h-4 w-4 accent-brand-primary"
                  />
                  <span className="text-[16px] font-bold text-brand-navy-deep">
                    {key.displayLabel}
                  </span>
                  {descriptor && (
                    <span className="text-[14px] text-brand-gray-high">
                      ({descriptor})
                    </span>
                  )}
                  {isCurrent && (
                    <span className="ml-auto text-[14px] text-brand-positive font-medium">
                      Actual llave
                    </span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="breb-modify-account"
          className="block text-[15px] font-medium text-brand-navy"
        >
          Asociar nueva llave a la cuenta
        </label>
        <select
          id="breb-modify-account"
          value={accountId}
          onChange={(e) => onAccountChange(e.target.value)}
          className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-[15px] text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
        >
          <option value="">Selecciona una cuenta...</option>
          {accountOptions.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.label}
            </option>
          ))}
        </select>
      </div>

      {keysInUseElsewhere.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[16px] font-medium text-brand-navy">
            Llaves que ya tienes en uso (informativo)
          </h3>
          <ul className="space-y-2">
            {keysInUseElsewhere.map((key) => {
              const descriptor = TYPE_DESCRIPTOR[key.type] ?? "";
              return (
                <li
                  key={key.id}
                  className="flex items-center justify-between gap-3 border-b border-brand-border pb-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[14px] font-bold text-brand-navy-deep truncate">
                      {key.value}
                    </span>
                    {descriptor && (
                      <span className="text-[14px] text-brand-gray-high">
                        ({descriptor})
                      </span>
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-brand-navy-deep shrink-0">
                    {key.inUseAt}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-md border border-brand-info-border bg-brand-info-bg p-4">
        <p className="text-[14px] leading-[22px] text-brand-navy">
          <span className="font-bold">Sugerencia:</span> Para usar una de estas
          llaves en Coasmedas, primero debes cancelarla en la entidad donde está
          registrada. Puedes gestionar tus llaves de Coasmedas volviendo a la
          pantalla de{" "}
          <span className="font-bold underline">
            Gestión de mis Llaves y usando el botón &apos;Acciones&apos;.
          </span>
        </p>
      </div>

      {error && <p className="text-sm text-brand-error text-center">{error}</p>}
    </Card>
  );
}
