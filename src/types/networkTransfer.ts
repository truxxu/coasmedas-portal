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
export interface SourceAccount {
  id: string;
  name: string; // "Cuenta de Ahorros"
  accountType: string; // "Ahorros"
  productNumber: string; // "4428" (raw, will be masked)
  balance: number;
}

/**
 * Step 2: Network transfer form data
 */
export interface NetworkTransferFormData {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
}

/**
 * Step 4: Network transfer result
 */
export interface NetworkTransferResult {
  status: "success" | "error";
  sourceAccount: string; // "Cuenta de Ahorros"
  recipientName: string; // "MARIA FERNANDA GONZALEZ"
  destinationAccount: string; // "Cuenta de Ahorros (Ahorros ****4522)"
  amountTransferred: number;
  transactionCost: number;
  transactionDate: string; // "1 de septiembre de 2025"
  transactionTime: string; // "7:21 pm"
  approvalNumber: string; // "450606"
  description: string; // "Transferencia Exitosa"
}

/**
 * Complete network transfer flow state
 */
export interface NetworkTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedRecipient: RegisteredNetworkAccount | null;
  selectedDestinationProduct: NetworkProduct | null;
  selectedSourceAccount: SourceAccount | null;
  amount: number;
  verificationCode: string;
  transactionResult: NetworkTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
