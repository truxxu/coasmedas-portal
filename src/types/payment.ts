// ============================================================================
// Payment Option Types (Feature 09 - Pagos)
// ============================================================================

/**
 * Payment option identifier
 */
export type PaymentOptionId =
  | 'pago-unificado'
  | 'aportes'
  | 'obligaciones'
  | 'proteccion';

/**
 * Payment option configuration
 */
export interface PaymentOption {
  id: PaymentOptionId;
  title: string;
  description: string;
  variant: 'featured' | 'standard';
  route?: string; // Optional: Route to payment flow (TBD)
}
