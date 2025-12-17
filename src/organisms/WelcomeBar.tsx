'use client';

import { ReactNode } from 'react';
import { HideBalancesToggle } from '@/src/molecules';
import { useUser } from '@/src/hooks';

interface WelcomeBarProps {
  title?: ReactNode;
}

export function WelcomeBar({ title }: WelcomeBarProps) {
  const user = useUser();

  const displayTitle = title || (
    <>
      Bienvenido, <span className="text-brand-navy font-bold">{user?.firstName}</span>
    </>
  );

  return (
    <div className="h-14 bg-white border-b border-brand-border px-8 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-medium text-brand-text-black">
        {displayTitle}
      </h1>
      <HideBalancesToggle />
    </div>
  );
}
