import React from 'react';

interface InfoBoxProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'info' | 'warning';
  className?: string;
}

export function InfoBox({
  children,
  icon,
  variant = 'info',
  className = '',
}: InfoBoxProps) {
  const variantStyles = {
    info: 'bg-brand-light-blue',
    warning: 'bg-amber-50 border border-amber-400',
  };

  const textStyles = {
    info: 'text-brand-navy font-bold',
    warning: 'text-brand-navy font-medium',
  };

  return (
    <div
      role="note"
      className={`
        rounded-lg p-4 flex items-start gap-3
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {icon && (
        <div className="flex-shrink-0 text-brand-navy">
          {icon}
        </div>
      )}
      <div className={`text-[16px] leading-[22px] ${textStyles[variant]}`}>
        {children}
      </div>
    </div>
  );
}
