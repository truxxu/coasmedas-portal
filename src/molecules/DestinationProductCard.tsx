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
            ? "bg-white border-[#1D4E8F]"
            : "bg-[#F5F5F5] border-[#E4E6EA] hover:bg-white hover:border-[#1D4E8F]"
        }
        ${onClick ? "cursor-pointer transition-colors" : ""}
        ${className}
      `}
    >
      <p className="text-lg font-bold text-[#1D4E8F]">
        {productName} ({productType} {maskedNumber})
      </p>
    </Component>
  );
}
