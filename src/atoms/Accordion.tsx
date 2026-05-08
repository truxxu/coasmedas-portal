"use client";

import { ReactNode, useState } from "react";
import { ChevronIcon } from "./ChevronIcon";

interface AccordionProps {
  title: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export function Accordion({
  title,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  children,
  className = "",
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={`border border-brand-border rounded-md ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <span className="text-sm font-medium text-black text-left">
          {title}
        </span>
        <ChevronIcon direction={isOpen ? "up" : "down"} />
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}
