"use client";

import { InscribedAccountCard } from "./InscribedAccountCard";
import type { RegisteredAccount } from "@/src/types";

interface InscribedAccountsListProps {
  accounts: RegisteredAccount[];
  onEdit: (accountId: string) => void;
  onDelete: (accountId: string) => void;
}

export function InscribedAccountsList({
  accounts,
  onEdit,
  onDelete,
}: InscribedAccountsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[#005066]">Cuentas Inscritas</h2>

      {accounts.length > 0 ? (
        <div className="space-y-3">
          {accounts.map((account) => (
            <InscribedAccountCard
              key={account.id}
              account={account}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#808284]">
          No tienes cuentas inscritas.
        </div>
      )}
    </div>
  );
}
