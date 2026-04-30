/**
 * Source account for Bre-B key transfer
 */
export interface BrebSourceAccount {
  id: string;
  type: string;
  balance: number;
  maskedNumber: string;
}

/**
 * Step 1: Transfer details form data
 */
export interface BrebKeyTransferFormData {
  sourceAccountId: string;
  destinationKey: string;
  amount: number;
}

/**
 * Step 2: Confirmation display data
 */
export interface BrebKeyTransferConfirmationData {
  sourceProduct: string;
  destinationHolder: string;
  destinationKey: string;
  amount: number;
}

/**
 * Step 4: Transaction result
 */
export interface BrebKeyTransferResult {
  status: "success" | "error";
  destinationHolder: string;
  destinationKey: string;
  amount: number;
  sourceAccount: string;
  transactionDate: string;
  transactionTime: string;
  referenceNumber: string;
  errorMessage?: string;
}
