'use client';

import { BackButton } from '@/src/atoms';
import { Breadcrumbs } from './Breadcrumbs';
import { HideBalancesToggle } from './HideBalancesToggle';

interface ProductPageHeaderProps {
  title: string;
  backHref?: string;
  breadcrumbs: string[];
  showHideBalances?: boolean;
}

export function ProductPageHeader({
  title,
  backHref = '/home',
  breadcrumbs,
  showHideBalances = true,
}: ProductPageHeaderProps) {
  return (
    <div className="space-y-2">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton href={backHref} />
          <h1 className="text-[20px] font-medium text-black">{title}</h1>
        </div>
        {showHideBalances && <HideBalancesToggle />}
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />
    </div>
  );
}
