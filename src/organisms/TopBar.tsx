'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserAvatar, UserDropdown } from '@/src/molecules';
import { useMobileSidebar } from '@/src/hooks';

function HamburgerIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toggleMobileSidebar } = useMobileSidebar();

  return (
    <header className="py-4 lg:py-8 bg-brand-light-blue border-b border-brand-border px-4 lg:px-8 flex items-center justify-between lg:justify-end">
      {/* Mobile: Hamburger menu and logo */}
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 text-brand-navy hover:bg-brand-navy/10 rounded-lg"
          aria-label="Abrir menú"
        >
          <HamburgerIcon />
        </button>
        <Image
          src="/logo.svg"
          alt="Coasmedas"
          width={156}
          height={31}
          priority
        />
      </div>

      {/* User avatar */}
      <div className="relative">
        <UserAvatar onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
        <UserDropdown
          isOpen={isDropdownOpen}
          onClose={() => setIsDropdownOpen(false)}
        />
      </div>
    </header>
  );
}
