"use client";

import type { ReactNode } from "react";

interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export function FlowOptionCard({
  title,
  description,
  onClick,
  icon,
  disabled = false,
}: FlowOptionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-44 px-6 py-8
        bg-white
        border border-brand-footer-text
        text-center
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-solid hover:border-brand-navy hover:bg-brand-light-blue hover:shadow-md active:bg-blue-100"
        }
      `}
      type="button"
      aria-label={title}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-3">
        {icon && <div className="mb-1">{icon}</div>}
        <h3 className="text-xl font-medium text-brand-navy">{title}</h3>
        <p className="text-[15px] text-gray-900 leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}
