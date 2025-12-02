import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'news';
  className?: string;
}

export function Card({ children, variant = 'default', className = '' }: CardProps) {
  const variants = {
    default: 'bg-white rounded-lg shadow-sm',
    bordered: 'bg-white border border-brand-border rounded-lg',
    news: 'bg-white rounded-lg shadow-md overflow-hidden',
  };

  const classes = `${variants[variant]} ${className}`;

  return <div className={classes}>{children}</div>;
}
