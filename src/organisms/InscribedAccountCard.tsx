"use client";

import { BankBadge } from "@/src/molecules";
import type { RegisteredAccount } from "@/src/types";

interface InscribedAccountCardProps {
  account: RegisteredAccount;
  onEdit: (accountId: string) => void;
  onDelete: (accountId: string) => void;
}

export function InscribedAccountCard({
  account,
  onEdit,
  onDelete,
}: InscribedAccountCardProps) {
  const accountTypeLabel =
    account.accountType === "ahorros" ? "Ahorros" : "Corriente";

  return (
    <div className="flex items-center justify-between bg-white border border-[#E4E6EA] rounded-lg p-4">
      {/* Left side: Account info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-[#005066]">{account.alias}</h3>
        <BankBadge bankName={account.bankName} />
        <p className="text-sm text-[#58585B]">
          {accountTypeLabel} - {account.accountNumberMasked}
        </p>
        <p className="text-sm text-[#111827] uppercase">{account.holderName}</p>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-3">
        {/* Edit button */}
        <button
          type="button"
          onClick={() => onEdit(account.id)}
          className="p-2 text-[#58585B] hover:text-[#1D4E8F] transition-colors"
          aria-label={`Editar cuenta ${account.alias}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.166 2.5L17.5 5.833M1.667 18.333L2.5 15L13.333 4.167L15.833 6.667L5 17.5L1.667 18.333Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(account.id)}
          className="p-2 text-[#FF0D00] hover:text-[#CC0000] transition-colors"
          aria-label={`Eliminar cuenta ${account.alias}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 5H17.5M6.667 5V3.333C6.667 2.5 7.5 1.667 8.333 1.667H11.667C12.5 1.667 13.333 2.5 13.333 3.333V5M15.833 5V16.667C15.833 17.5 15 18.333 14.167 18.333H5.833C5 18.333 4.167 17.5 4.167 16.667V5H15.833Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.333 9.167V14.167M11.667 9.167V14.167"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
