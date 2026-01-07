// ============================================================================
// Aportes Payment Flow Types (Feature 09b - Pago de Aportes)
// ============================================================================

/**
 * Payment method type
 */
export type AportesPaymentMethod = 'account' | 'pse';

/**
 * Aportes payment breakdown details
 */
export interface AportesPaymentBreakdown {
  planName: string;
  productNumber: string; // Masked
  aportesVigentes: number;
  fondoSolidaridadVigente: number;
  aportesEnMora: number;
  fondoSolidaridadEnMora: number;
  fechaLimitePago: string;
  costoTransaccion: number;
}

/**
 * Step 1: Aportes payment details form data
 */
export interface AportesPaymentDetailsData {
  selectedAccountId: string;
  valorAPagar: number; // User-entered amount
}

/**
 * Step 2: Aportes confirmation data
 */
export interface AportesConfirmationData {
  titular: string;
  documento: string; // Masked
  productoAPagar: string; // Plan name
  numeroProducto: string; // Masked
  productoADebitar: string; // Account name or "PSE - Pagos con otras entidades"
  valorAPagar: number;
  paymentMethod: AportesPaymentMethod;
}

/**
 * Step 4: Aportes transaction result
 */
export interface AportesTransactionResult {
  status: 'success' | 'error';
  lineaCredito: string;
  numeroProducto: string;
  valorPagado: number;
  costoTransaccion: number;
  fechaTransmision: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  descripcion: string;
}

/**
 * Complete aportes payment flow state
 */
export interface AportesPaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedAccountId: string | null;
  paymentMethod: AportesPaymentMethod;
  paymentBreakdown: AportesPaymentBreakdown | null;
  valorAPagar: number;
  confirmationData: AportesConfirmationData | null;
  verificationCode: string;
  transactionResult: AportesTransactionResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Value color options for detail rows
 */
export type AportesValueColor = 'default' | 'red' | 'navy' | 'green';
