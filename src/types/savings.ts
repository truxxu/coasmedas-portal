/**
 * Status of a savings product
 */
export type SavingsStatus = 'activo' | 'bloqueado' | 'inactivo';

/**
 * Savings product information for carousel display
 */
export interface SavingsProduct {
  id: string;
  title: string;
  accountType: string;
  productNumber: string;
  balance: number;
  status: SavingsStatus;
}

/**
 * Carousel scroll state
 */
export interface CarouselState {
  currentIndex: number;
  totalItems: number;
  visibleItems: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

/**
 * Callback type for product selection
 */
export type OnProductSelect = (product: SavingsProduct) => void;
