/**
 * Status of an obligation/loan product
 */
export type ObligacionStatus = 'al_dia' | 'en_mora';

/**
 * Obligation/loan product information for carousel display
 */
export interface ObligacionProduct {
  id: string;
  title: string;
  productNumber: string;
  productPrefix?: string;           // e.g., "CR-" for Cupo Rotativo
  currentBalance: number;           // Saldo a la fecha
  status: ObligacionStatus;
  disbursedAmount: number;          // Valor desembolsado
  nextPaymentDate: string;          // Próximo pago (ISO date)
  nextPaymentAmount: number;        // Valor próximo pago
}

/**
 * Callback type for obligation product selection
 */
export type OnObligacionSelect = (product: ObligacionProduct) => void;
