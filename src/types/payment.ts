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

// ============================================================================
// Pago Unificado Flow Types (Feature 09a - Pago Unificado)
// ============================================================================

/**
 * Account available for payment source
 */
export interface PaymentAccount {
  id: string;
  name: string;
  balance: number;
  number: string; // Masked account number
}

/**
 * Pending payments by product type
 */
export interface PendingPayments {
  aportes: number;
  obligaciones: number;
  proteccion: number;
  total: number;
}

/**
 * Step 1: Payment details form data
 */
export interface PaymentDetailsFormData {
  selectedAccountId: string;
}

/**
 * Step 2: Confirmation data
 */
export interface PaymentConfirmationData {
  titular: string;
  documento: string; // Masked document number
  aportes: number;
  obligaciones: number;
  proteccion: number;
  debitAccount: string;
  debitAccountNumber: string;
  totalAmount: number;
}

/**
 * Step 3: Code verification form data
 */
export interface CodeVerificationFormData {
  code: string; // 6 digits
}

/**
 * Step 4: Transaction result
 */
export interface TransactionResult {
  status: 'success' | 'error';
  transactionCost: number;
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}

/**
 * Complete payment flow state
 */
export interface PaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedAccountId: string | null;
  selectedAccount: PaymentAccount | null;
  pendingPayments: PendingPayments | null;
  confirmationData: PaymentConfirmationData | null;
  verificationCode: string;
  transactionResult: TransactionResult | null;
  isLoading: boolean;
  error: string | null;
}
