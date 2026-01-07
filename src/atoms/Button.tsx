import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'cta' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary: 'bg-brand-primary text-white hover:opacity-90',
    secondary: 'bg-white text-brand-navy border border-brand-border hover:bg-brand-primary hover:text-white hover:border-brand-primary',
    ghost: 'text-brand-navy hover:bg-brand-navy/10',
    cta: 'bg-gradient-to-r from-brand-primary to-brand-primary text-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] hover:opacity-90',
    disabled: 'bg-brand-primary-disabled text-brand-navy cursor-not-allowed',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm rounded-[6px]',
    md: 'h-10 px-6 text-base rounded-[6px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)]',
    lg: 'h-14 px-8 text-lg rounded-[6px]',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
