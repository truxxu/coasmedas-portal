'use client';

import { useState } from 'react';
import { UserAvatar, UserDropdown } from '@/src/molecules';

export function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="py-8 bg-[#F0F9FF] border-b border-brand-border px-8 flex items-center justify-end relative">
      <UserAvatar onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
      <UserDropdown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />
    </header>
  );
}
