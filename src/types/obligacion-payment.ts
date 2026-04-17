// ============================================================================
// Obligacion Payment Flow Types (Feature 09c - Pago de Obligaciones)
// ============================================================================

import type { FlowHolderInfoEs, FlowTransactionMetadataEs } from "./flow";

/**
 * Source account for obligacion payment
 */
export interface ObligacionSourceAccount {
  id: string;
  type: "ahorros" | "corriente";
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  displayName: string;
}

/**
 * Payment method type for obligaciones
 */
export type ObligacionPaymentMethod = "account" | "pse";

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
  fechaApertura: string; // Opening date — API gap: empty until backend provides it
  status: "al_dia" | "en_mora";
  valorEnMora: number; // API gap: no dedicated field in CreditAccountResponse, defaults to 0
}

/**
 * Step 1: Obligacion payment details form data
 */
export interface ObligacionPaymentDetailsData {
  paymentMethod: ObligacionPaymentMethod;
  sourceAccountId: string;
  sourceAccountDisplay: string;
  selectedProductId: string;
  selectedProduct: ObligacionPaymentProduct;
  valorAPagar: number; // User-entered/selected amount
  costoTransaccion: number;
}

/**
 * Step 2: Obligacion confirmation data
 */
export interface ObligacionConfirmationData extends FlowHolderInfoEs {
  // Credit details
  lineaCredito: string;
  fechaApertura: string;
  saldoTotal: number;
  fechaLimitePago: string;
  valorEnMora: number;
  pagoMinimo: number;
  pagoTotal: number;
  costoTransaccion: number;
  // Payment info
  productoADebitar: string; // "PSE (Pagos con otras entidades)" or account name
  valorAPagar: number;
  excessPaymentOption?: ExcessPaymentOption;
}

/**
 * Step 4: Obligacion transaction result
 */
export interface ObligacionTransactionResult extends FlowTransactionMetadataEs {
  status: "success" | "error";
  lineaCredito: string;
  numeroProducto: string;
  valorPagado: number;
  costoTransaccion: number;
  abonoExcedente: string; // e.g., "Reducción de Cuota"
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
export type PaymentType = "minimum" | "total";

/**
 * Excess payment option when amount exceeds minimum payment
 */
export type ExcessPaymentOption =
  | "proximas_cuotas"
  | "reduccion_plazo"
  | "reduccion_cuota";
