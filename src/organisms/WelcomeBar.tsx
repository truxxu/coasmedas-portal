'use client';

import { BackButton } from '@/src/atoms';
import { HideBalancesToggle } from '@/src/molecules';
import { useWelcomeBarConfig } from '@/src/contexts';
import { useUser } from '@/src/hooks';

export function WelcomeBar() {
  const user = useUser();
  const { title, backHref } = useWelcomeBarConfig();

  const displayTitle = title || (
    <>
      Bienvenido, <span className="text-brand-navy font-bold">{user?.firstName}</span>
    </>
  );

  return (
    <div className="bg-white border-b border-brand-border px-4 lg:px-8 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && <BackButton href={backHref} />}
          <h1 className="text-xl font-medium text-brand-text-black">
            {displayTitle}
          </h1>
        </div>
        <HideBalancesToggle />
      </div>
    </div>
  );
}
