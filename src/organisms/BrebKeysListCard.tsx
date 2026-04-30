"use client";

import { useState } from "react";
import { Button, Card } from "@/src/atoms";
import { BREB_KEY_TYPE_LABELS } from "@/src/mocks/mockBrebKeyRegistrationData";
import type { BrebRegisteredKey } from "@/src/types/brebKeyRegistration";

interface BrebKeysListCardProps {
  keys: BrebRegisteredKey[];
  onRegisterNewKey: () => void;
  onModifyKey?: (keyId: string) => void;
}

const STATUS_STYLES: Record<
  BrebRegisteredKey["status"],
  { label: string; className: string }
> = {
  activa: {
    label: "Activa",
    className: "bg-[#d6f5e0] text-[#0b6637]",
  },
  bloqueada: {
    label: "Bloqueada",
    className: "bg-[#fdecc8] text-[#915916]",
  },
};

export function BrebKeysListCard({
  keys,
  onRegisterNewKey,
  onModifyKey,
}: BrebKeysListCardProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setOpenMenuId((current) => (current === id ? null : id));
  };

  return (
    <Card className="space-y-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[19px] font-bold text-brand-navy">
          Gestón de mis Llaves Bre-B
        </h2>
        <Button variant="primary" onClick={onRegisterNewKey}>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-lg leading-none">
              +
            </span>
            Registrar Nueva Llave
          </span>
        </Button>
      </div>

      <ul className="divide-y divide-brand-border">
        {keys.map((key) => {
          const status = STATUS_STYLES[key.status];
          const typeLabel = BREB_KEY_TYPE_LABELS[key.type];
          const isMenuOpen = openMenuId === key.id;

          return (
            <li key={key.id} className="py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[16px] font-bold text-brand-gray-high">
                    {typeLabel}: {key.value}
                  </p>
                  <p className="mt-1 text-[14px] text-brand-gray-high">
                    Asociada a Cta. Ahorros {key.associatedAccountMasked} | Últ.
                    Mod. : {key.lastModified}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleMenu(key.id)}
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-brand-border bg-white text-[15px] font-medium text-brand-text-black hover:bg-brand-gray-light transition-colors"
                    >
                      Acciones
                      <span aria-hidden className="text-[10px]">
                        ▼
                      </span>
                    </button>

                    {isMenuOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 mt-2 w-44 rounded-md border border-brand-border bg-white shadow-md z-10"
                      >
                        {["Modificar", "Bloquear", "Cancelar", "Portar"].map(
                          (action) => {
                            const isModificar =
                              action === "Modificar" && onModifyKey;
                            return (
                              <button
                                key={action}
                                type="button"
                                role="menuitem"
                                disabled={!isModificar}
                                onClick={() => {
                                  if (!isModificar) return;
                                  setOpenMenuId(null);
                                  onModifyKey(key.id);
                                }}
                                className={
                                  isModificar
                                    ? "block w-full text-left px-4 py-2 text-[14px] text-brand-text-black hover:bg-brand-gray-light"
                                    : "block w-full text-left px-4 py-2 text-[14px] text-brand-gray-medium cursor-not-allowed"
                                }
                              >
                                {action}
                              </button>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
