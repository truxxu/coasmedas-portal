"use client";

interface BankBadgeProps {
  bankName: string;
  className?: string;
}

const bankColorMap: Record<string, { bg: string; text: string }> = {
  bancolombia: { bg: "bg-[#FDDA24]", text: "text-black" },
  davivienda: { bg: "bg-[#ED1C24]", text: "text-white" },
  bbva: { bg: "bg-[#004481]", text: "text-white" },
  coopcentral: { bg: "bg-[#1D4E8F]", text: "text-white" },
};

function getBankKey(bankName: string): string {
  return bankName.toLowerCase().replace(/\s+/g, "");
}

export function BankBadge({ bankName, className = "" }: BankBadgeProps) {
  const bankKey = getBankKey(bankName);
  const colors = bankColorMap[bankKey] || {
    bg: "bg-[#1D4E8F]",
    text: "text-white",
  };

  return (
    <span
      className={`
        inline-block px-2 py-0.5 rounded text-[10px] font-medium
        ${colors.bg} ${colors.text}
        max-w-fit
        ${className}
      `}
    >
      {bankName}
    </span>
  );
}
