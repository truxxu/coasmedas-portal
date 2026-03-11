"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { RegisteredAccountItem, InfoNoteBox } from "@/src/molecules";
import { RegisteredNetworkAccount } from "@/src/types/networkTransfer";

interface RegisteredAccountsListProps {
  accounts: RegisteredNetworkAccount[];
  onSelectAccount: (account: RegisteredNetworkAccount) => void;
  className?: string;
}

export function RegisteredAccountsList({
  accounts,
  onSelectAccount,
  className = "",
}: RegisteredAccountsListProps) {
  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Transferencias a cuentas de mi Red Coopcentral
        </h2>
        <p className="text-[15px] text-brand-text-black">
          Transfiere a cuentas de asociados previamente inscritos en tu red.
        </p>
      </div>

      <div className="border border-brand-border rounded-lg overflow-hidden">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <RegisteredAccountItem
              key={account.id}
              name={account.name}
              productCount={account.productCount}
              onClick={() => onSelectAccount(account)}
            />
          ))
        ) : (
          <div className="p-6 text-center text-brand-gray-medium">
            No tienes cuentas registradas en tu red.
          </div>
        )}
      </div>

      <InfoNoteBox>
        <strong>Nota:</strong> Para transferir a un nuevo asociado, primero
        debes inscribir su cuenta en una de nuestras oficinas.
      </InfoNoteBox>
    </Card>
  );
}
