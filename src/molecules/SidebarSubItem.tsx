'use client';

import Link from 'next/link';

interface SidebarSubItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarSubItem({ label, href, isActive = false, onClick }: SidebarSubItemProps) {
  const baseClasses = 'block px-4 py-2 text-[15px] font-bold text-white rounded-lg transition-colors';
  const activeClasses = isActive ? 'bg-brand-primary' : 'hover:bg-white/10';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      {label}
    </Link>
  );
}
