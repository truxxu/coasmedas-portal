'use client';

import { Toggle } from '@/src/atoms';
import { useHideBalances } from '@/src/hooks';

export function HideBalancesToggle() {
  const { hideBalances, toggleHideBalances } = useHideBalances();

  return (
    <Toggle
      checked={hideBalances}
      onChange={toggleHideBalances}
      label="Ocultar saldos"
    />
  );
}
