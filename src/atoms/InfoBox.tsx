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
        bg-[#F0F9FF] border-l-4 border-[#007FFF]
        rounded-r-lg p-4 flex items-start gap-3
        ${className}
      `}
    >
      {icon && (
        <div className="flex-shrink-0 text-[#007FFF]">
          {icon}
        </div>
      )}
      <div className="text-[14px] text-black">
        {children}
      </div>
    </div>
  );
}
