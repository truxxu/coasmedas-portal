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
        bg-brand-light-blue rounded-lg p-4 flex items-start gap-3
        ${className}
      `}
    >
      {icon && (
        <div className="flex-shrink-0 text-brand-navy">
          {icon}
        </div>
      )}
      <div className="text-[16px] text-brand-navy font-bold leading-[22px]">
        {children}
      </div>
    </div>
  );
}
