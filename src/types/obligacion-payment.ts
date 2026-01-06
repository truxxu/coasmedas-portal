// ============================================================================
// Obligacion Payment Flow Types (Feature 09c - Pago de Obligaciones)
// ============================================================================

/**
 * Loan/credit product for payment selection
 */
export interface ObligacionPaymentProduct {
  id: string;
  name: string; // e.g., "Crédito de Inversión"
  productNumber: string; // Masked, e.g., "***5678"
  totalBalance: number;
  minimumPayment: number;
  paymentDeadline: string;
  status: 'al_dia' | 'en_mora';
}

/**
 * Step 1: Obligacion payment details form data
 */
export interface ObligacionPaymentDetailsData {
  paymentMethod: 'PSE';
  selectedProductId: string;
  selectedProduct: ObligacionPaymentProduct;
  valorAPagar: number; // User-entered/selected amount
  costoTransaccion: number;
}

/**
 * Step 2: Obligacion confirmation data
 */
export interface ObligacionConfirmationData {
  titular: string;
  documento: string; // Masked
  productoAPagar: string; // Product name
  numeroProducto: string; // Masked product number
  productoADebitar: string; // "PSE (Pagos con otras entidades)"
  valorAPagar: number;
}

/**
 * Step 4: Obligacion transaction result
 */
export interface ObligacionTransactionResult {
  status: 'success' | 'error';
  lineaCredito: string;
  numeroProducto: string;
  valorPagado: number;
  costoTransaccion: number;
  abonoExcedente: string; // e.g., "Reducción de Cuota"
  fechaTransmision: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  descripcion: string;
}

/**
 * Complete obligacion payment flow state
 */
export interface ObligacionPaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedProductId: string | null;
  selectedProduct: ObligacionPaymentProduct | null;
  valorAPagar: number;
  confirmationData: ObligacionConfirmationData | null;
  transactionResult: ObligacionTransactionResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Payment type for quick selection
 */
export type PaymentType = 'minimum' | 'total';
