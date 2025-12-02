import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <h2 className={`text-3xl font-bold text-brand-navy ${className}`}>
      {children}
    </h2>
  );
}
