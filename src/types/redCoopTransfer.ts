import type {
  FlowHolderInfoEn,
  FlowTransactionMetadataEn,
  FlowTransactionStatus,
} from "./flow";

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
export interface RedCoopTransferConfirmationData extends FlowHolderInfoEn {
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
export interface RedCoopTransferResult
  extends FlowTransactionStatus, FlowTransactionMetadataEn {
  // Transfer details
  sourceAccount: string;
  destinationBank: string;
  destinationAccountNumber: string;
  amountTransferred: number;
  concept: string;
  transactionCost: number;
}
