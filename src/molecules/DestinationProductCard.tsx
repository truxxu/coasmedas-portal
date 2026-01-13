import React from "react";

interface DestinationProductCardProps {
  productName: string;
  maskedNumber: string;
  productType: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DestinationProductCard({
  productName,
  maskedNumber,
  productType,
  isSelected = true,
  onClick,
  className = "",
}: DestinationProductCardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`
        w-full p-4 rounded-lg border text-left
        ${
          isSelected
            ? "bg-white border-brand-navy"
            : "bg-brand-gray-light border-brand-border hover:bg-white hover:border-brand-navy"
        }
        ${onClick ? "cursor-pointer transition-colors" : ""}
        ${className}
      `}
    >
      <p className="text-lg font-bold text-brand-navy">
        {productName} ({productType} {maskedNumber})
      </p>
    </Component>
  );
}
