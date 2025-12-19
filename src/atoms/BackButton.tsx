'use client';

import Link from 'next/link';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({ href, onClick, className = '' }: BackButtonProps) {
  const baseClasses = `inline-flex items-center justify-center w-6 h-6 text-black hover:opacity-70 transition-opacity cursor-pointer ${className}`;

  const arrowIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {arrowIcon}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {arrowIcon}
    </button>
  );
}
