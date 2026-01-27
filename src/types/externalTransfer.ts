/**
 * Source account for external transfer
 */
export interface ExternalTransferSourceAccount {
  id: string;
  type: string;              // e.g., "Cuenta de Ahorros"
  balance: number;           // Available balance
  maskedNumber: string;      // e.g., "****4428"
}

/**
 * Destination account (from registered external accounts)
 */
export interface ExternalTransferDestinationAccount {
  id: string;
  alias: string;             // User-defined alias e.g., "Cuenta Mama"
  bankName: string;          // e.g., "Bancolombia"
  accountType: "ahorros" | "corriente";
  accountNumber: string;     // e.g., "123-456789-01"
  holderName: string;        // e.g., "MARIA GONZALEZ"
}

/**
 * Step 1: Transfer details form data
 */
export interface ExternalTransferFormData {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  concept: string;
}

/**
 * Step 2: Confirmation display data
 */
export interface ExternalTransferConfirmationData {
  // Holder (user) info
  holderName: string;
  holderDocument: string;     // Masked: "CC 1.***.***. 231"
  sourceProduct: string;      // e.g., "Cuenta de Ahorros"

  // Destination info
  destinationHolder: string;  // e.g., "MARIA GONZALEZ"
  destinationBank: string;    // e.g., "Bancolombia"
  destinationAccountType: string; // e.g., "Ahorros"
  destinationAccountNumber: string; // e.g., "123.-456789-01"

  // Transfer details
  amount: number;
  concept: string;
}

/**
 * Step 4: Transaction result
 */
export interface ExternalTransferResult {
  status: "success" | "error";

  // Transfer details
  sourceAccount: string;
  destinationBank: string;
  destinationAccountNumber: string;
  amountTransferred: number;
  concept: string;
  transactionCost: number;

  // Transaction metadata
  transactionDate: string;    // e.g., "5 de Enero de 2025"
  transactionTime: string;    // e.g., "03:02 p.m."
  approvalNumber: string;     // e.g., "256606"
  description: string;        // e.g., "Transferencia Exitosa"

  // Error info (if failed)
  errorMessage?: string;
}

/**
 * Complete transfer flow state
 */
export interface ExternalTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedSourceAccount: ExternalTransferSourceAccount | null;
  selectedDestinationAccount: ExternalTransferDestinationAccount | null;
  formData: ExternalTransferFormData | null;
  confirmationData: ExternalTransferConfirmationData | null;
  verificationCode: string;
  transactionResult: ExternalTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
