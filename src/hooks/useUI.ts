import {
  useHideBalancesContext,
  useSidebarExpandedContext,
  useMobileSidebarContext,
} from "@/src/contexts";

export function useHideBalances() {
  const { hideBalances, toggleHideBalances } = useHideBalancesContext();
  return { hideBalances, toggleHideBalances };
}

export function useSidebar() {
  const { sidebarExpanded, toggleSidebarItem } = useSidebarExpandedContext();
  return { sidebarExpanded, toggleSidebarItem };
}

export function useMobileSidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar } =
    useMobileSidebarContext();
  return { mobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar };
}
