'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { ChevronIcon } from '@/src/atoms';

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
  expandable?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
}

export function SidebarNavItem({
  label,
  href,
  icon,
  isActive = false,
  expandable = false,
  isExpanded = false,
  onToggle,
  children,
}: SidebarNavItemProps) {
  const baseClasses = 'flex items-center gap-3 px-4 py-2 rounded-lg text-white font-bold text-[15px] transition-colors';
  const activeClasses = isActive ? 'bg-brand-primary' : 'hover:bg-white/10';

  if (expandable) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`${baseClasses} ${activeClasses} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            {icon}
            {label}
          </span>
          <ChevronIcon direction={isExpanded ? 'up' : 'down'} className="text-white" />
        </button>
        {isExpanded && children && (
          <div className="ml-8 mt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      {icon}
      {label}
    </Link>
  );
}
