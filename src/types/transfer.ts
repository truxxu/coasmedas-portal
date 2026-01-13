/**
 * User account available for transfers
 */
export interface TransferAccount {
  id: string;
  name: string;
  accountType: string;
  productNumber: string;
  balance: number;
}

/**
 * Destination product for transfer
 */
export interface DestinationProduct {
  id: string;
  name: string;
  productNumber: string;
  productType: string;
}

/**
 * Step 1: Transfer details form data
 */
export interface TransferDetailsFormData {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
}

/**
 * Step 2: Confirmation data
 */
export interface TransferConfirmationData {
  holderName: string;
  documentNumber: string;
  sourceAccount: string;
  destinationProduct: string;
  amount: number;
}

/**
 * Step 3: SMS verification form data
 */
export interface SMSVerificationFormData {
  code: string;
}

/**
 * Step 4: Transaction result
 */
export interface TransferResult {
  status: "success" | "error";
  sourceType: string;
  productNumber: string;
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}

/**
 * Complete transfer flow state
 */
export interface TransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  formData: TransferDetailsFormData | null;
  selectedSourceAccount: TransferAccount | null;
  selectedDestination: DestinationProduct | null;
  confirmationData: TransferConfirmationData | null;
  verificationCode: string;
  transactionResult: TransferResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Internal transfer flow option
 */
export interface InternalTransferOption {
  id: string;
  title: string;
  description: string;
  href: string;
  enabled: boolean;
}
