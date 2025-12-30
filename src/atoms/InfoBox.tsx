import React from 'react';

interface InfoBoxProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function InfoBox({
  children,
  icon,
  className = '',
}: InfoBoxProps) {
  return (
    <div
      role="note"
      className={`
        bg-[#F0F9FF] rounded-lg p-4 flex items-start gap-3
        ${className}
      `}
    >
      {icon && (
        <div className="flex-shrink-0 text-[#1D4E8F]">
          {icon}
        </div>
      )}
      <div className="text-[16px] text-[#1D4E8F] font-bold leading-[22px]">
        {children}
      </div>
    </div>
  );
}
