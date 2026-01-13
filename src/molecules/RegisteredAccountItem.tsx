import React from "react";
import { Avatar, ChevronIcon } from "@/src/atoms";

interface RegisteredAccountItemProps {
  name: string;
  productCount: number;
  onClick: () => void;
  className?: string;
}

/**
 * Generate initials from a full name
 * @example getInitialsFromFullName("MARÍA FERNANDA GONZALEZ") => "MG"
 */
function getInitialsFromFullName(fullName: string): string {
  const words = fullName.trim().split(/\s+/);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  // Take first letter of first word and first letter of last word
  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
}

export function RegisteredAccountItem({
  name,
  productCount,
  onClick,
  className = "",
}: RegisteredAccountItemProps) {
  const initials = getInitialsFromFullName(name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4
        border-b border-brand-border last:border-b-0
        hover:bg-brand-light-blue transition-colors
        ${className}
      `}
      aria-label={`Transferir a ${name}`}
    >
      <div className="flex items-center gap-4">
        <Avatar initials={initials} size="md" />
        <div className="text-left">
          <p className="text-lg font-medium text-brand-navy uppercase">{name}</p>
          <p className="text-sm text-brand-text-black">
            {productCount} producto{productCount !== 1 ? "s" : ""} disponible
            {productCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <ChevronIcon direction="right" className="text-brand-gray-medium" />
    </button>
  );
}
