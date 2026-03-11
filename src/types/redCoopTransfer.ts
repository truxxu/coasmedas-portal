/**
 * Source account for Red Coopcentral transfer
 */
export interface RedCoopSourceAccount {
  id: string;
  type: string;
  balance: number;
  maskedNumber: string;
}

/**
 * Destination account (from registered Coopcentral network accounts)
 */
export interface RedCoopDestinationAccount {
  id: string;
  holderName: string;
  bankName: string;
  accountType: "ahorros" | "corriente";
  accountNumber: string;
  alias?: string;
}

/**
 * Step 1: Transfer details form data
 */
export interface RedCoopTransferFormData {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  concept: string;
}

/**
 * Step 2: Confirmation display data
 */
export interface RedCoopTransferConfirmationData {
  // Holder (user) info
  holderName: string;
  holderDocument: string;
  sourceProduct: string;

  // Destination info
  destinationHolder: string;
  destinationBank: string;
  destinationAccountType: string;
  destinationAccountNumber: string;

  // Transfer details
  amount: number;
  concept: string;
}

/**
 * Step 4: Transaction result
 */
export interface RedCoopTransferResult {
  status: "success" | "error";

  // Transfer details
  sourceAccount: string;
  destinationBank: string;
  destinationAccountNumber: string;
  amountTransferred: number;
  concept: string;
  transactionCost: number;

  // Transaction metadata
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;

  // Error info (if failed)
  errorMessage?: string;
}
