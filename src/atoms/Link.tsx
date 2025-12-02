import NextLink from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export function Link({
  href,
  children,
  className = '',
  external = false,
  ...props
}: LinkProps) {
  const baseStyles = 'text-brand-navy hover:opacity-70 transition-opacity';
  const classes = `${baseStyles} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} {...props}>
      {children}
    </NextLink>
  );
}
