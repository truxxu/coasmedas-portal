"use client";

import type { ReactNode } from "react";

interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon?: ReactNode;
}

export function FlowOptionCard({
  title,
  description,
  onClick,
  icon,
}: FlowOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full h-44 px-6 py-8
        bg-white
        border border-brand-border
        text-center
        cursor-pointer
        transition-all duration-200 ease-in-out
        hover:border-solid hover:bg-blue-50 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2
        active:bg-blue-100
      "
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
