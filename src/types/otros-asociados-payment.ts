/**
 * Types for Pago a Otros Asociados (Payment to Other Associates) feature
 */

/**
 * Registered beneficiary (other Coasmedas associate)
 */
export interface RegisteredBeneficiary {
  id: string;
  fullName: string;        // "MARÍA FERNANDA GONZALEZ"
  alias: string;           // "Mamá"
  documentNumber: string;  // masked: "***3040"
}

/**
 * Product available for payment to beneficiary
 */
export interface PayableProduct {
  id: string;
  name: string;              // "Plan Senior", "Crédito de Libre Inversión"
  productNumber: string;     // masked: "***5488"
  minimumPayment: number | null;  // null = "N/A"
  totalPayment: number | null;    // null = "Indefinido"
  amountToPay: number;       // user input
  isSelected: boolean;
}

/**
 * Source type for payment funding
 */
export type FundingSourceType = 'cuenta' | 'pse';

/**
 * Source account for payment
 */
export interface SourceAccount {
  id: string;
  type: string;              // "Cuenta de Ahorros", "Aportes"
  balance: number;           // 8730500
  number: string;            // masked "****4428"
  sourceType: FundingSourceType;  // 'aportes' = no SMS, 'cuenta' = SMS required
}

/**
 * Step 1: Payment details form data
 */
export interface OtrosAsociadosDetailsData {
  sourceAccountId: string;
  sourceAccount: SourceAccount;
  beneficiary: RegisteredBeneficiary;
  selectedProducts: PayableProduct[];
  totalAmount: number;
}

/**
 * Step 2: Confirmation data
 */
export interface OtrosAsociadosConfirmationData {
  titular: string;
  documento: string;           // Masked
  productoADebitar: string;    // "Cuenta de Ahorro"
  beneficiaryName: string;
  products: Array<{
    name: string;
    amount: number;
  }>;
  totalAmount: number;
}

/**
 * Step 4: Transaction result
 */
export interface OtrosAsociadosTransactionResult {
  success: boolean;
  creditLine: string;
  productNumber: string;
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: 'Exitosa' | 'Fallida' | 'Pendiente';
}

/**
 * Complete payment flow state
 */
export interface OtrosAsociadosPaymentFlowState {
  // Step 0: Beneficiary Selection
  selectedBeneficiary: RegisteredBeneficiary | null;

  // Step 1: Details
  sourceAccount: SourceAccount | null;
  products: PayableProduct[];
  totalAmount: number;

  // Step 3: SMS
  otpCode: string;
  otpError: string | null;
  isResending: boolean;

  // Step 4: Result
  transactionResult: OtrosAsociadosTransactionResult | null;

  // Navigation
  currentStep: 0 | 1 | 2 | 3 | 4;
  isLoading: boolean;
  error: string | null;
}
