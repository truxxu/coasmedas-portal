import { useUIContext } from '@/src/contexts';

export function useHideBalances() {
  const { hideBalances, toggleHideBalances } = useUIContext();
  return { hideBalances, toggleHideBalances };
}

export function useSidebar() {
  const { sidebarExpanded, toggleSidebarItem } = useUIContext();
  return { sidebarExpanded, toggleSidebarItem };
}
