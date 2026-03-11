/**
 * Registered account in user's network (recipient)
 */
export interface RegisteredNetworkAccount {
  id: string;
  name: string; // Full name (e.g., "MARÍA FERNANDA GONZALEZ")
  productCount: number; // Number of available products
  products: NetworkProduct[]; // Available products for this recipient
}

/**
 * Product belonging to a network contact
 */
export interface NetworkProduct {
  id: string;
  type: "ahorros" | "corriente"; // Account type
  name: string; // "Cuenta de Ahorros"
  maskedNumber: string; // "****4522"
}

/**
 * User's own account for transfer source
 */
export interface NetworkSourceAccount {
  id: string;
  name: string; // "Cuenta de Ahorros"
  accountType: string; // "Ahorros"
  productNumber: string; // "4428" (raw, will be masked)
  balance: number;
}

/**
 * Step 1: Network transfer form data
 */
export interface NetworkTransferFormData {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
  concept?: string; // Optional transfer concept
}

/**
 * Step 2: Network transfer confirmation data
 */
export interface NetworkTransferConfirmationData {
  // Holder (sender) info
  holderName: string;
  holderDocument: string; // Masked: "CC 1.***.***. 231"
  sourceProduct: string; // e.g., "Cuenta de Ahorros"
  sourceAccountMaskedNumber?: string; // e.g., "***4428"

  // Destination info
  destinationHolder: string; // e.g., "PEDRO PEREZ"
  destinationBank: string; // "Coopcentral"
  destinationAccountType: string; // e.g., "Ahorros"
  destinationAccountNumber: string; // e.g., "123.-456789-01"

  // Transfer details
  amount: number;
  transactionCost?: number; // Always 0 for now
  concept?: string;
}

/**
 * Step 4: Network transfer result
 */
export interface NetworkTransferResult {
  status: "success" | "error";
  sourceAccount: string; // "Cuenta de Ahorros"
  destinationBank: string; // "Coopcentral"
  destinationAccountNumber: string; // "123-456789-01"
  recipientName: string; // "MARIA FERNANDA GONZALEZ"
  destinationAccount: string; // Legacy field for display
  amountTransferred: number;
  concept?: string; // Optional transfer concept
  transactionCost: number;
  transactionDate: string; // "1 de septiembre de 2025"
  transactionTime: string; // "7:21 pm"
  approvalNumber: string; // "450606"
  description: string; // "Transferencia Exitosa"
  errorMessage?: string;
}

/**
 * Complete network transfer flow state
 */
export interface NetworkTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedRecipient: RegisteredNetworkAccount | null;
  selectedDestinationProduct: NetworkProduct | null;
  selectedNetworkSourceAccount: NetworkSourceAccount | null;
  amount: number;
  concept?: string;
  verificationCode: string;
  confirmationData: NetworkTransferConfirmationData | null;
  transactionResult: NetworkTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
