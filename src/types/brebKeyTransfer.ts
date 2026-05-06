import type {
  BrebAccountSubType,
  BrebAccountType,
  BrebKey,
  BrebKeyType,
  BrebTxState,
} from "@/types/api/breb";

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
 * Resolved destination returned by `/bre-b/keys/resolve`, narrowed to the
 * single key the user typed in.
 */
export interface BrebResolvedDestination {
  firstName: string;
  surname: string;
  identification: string;
  typeIdentification: string;
  key: BrebKey;
}

/**
 * Step 2: Confirmation display + routing data carried into init.
 */
export interface BrebKeyTransferConfirmationData {
  // Display
  sourceProduct: string;
  destinationHolder: string;
  destinationKey: string;
  amount: number;
  // Source routing (fed into initBrebTx)
  sourceNumberAccount: string;
  sourceTypeAccount: BrebAccountType;
  sourceSubTypeAccount: BrebAccountSubType;
  sourceTypeAccountDescription: string;
  // Target routing (fed into initBrebTx)
  targetNode: string;
  targetResolutionId: string;
  targetEntity: string;
  targetNumberAccount: string;
  targetTypeAccount: BrebAccountType;
  targetSubTypeAccount: BrebAccountSubType;
  targetTypeAccountDescription: string;
  targetTypeKeyCustomer: BrebKeyType;
  targetIdentification: string;
  targetTypeIdentification: string;
  targetFirstName: string;
  targetSurName: string;
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
  stateCode?: BrebTxState;
  paymentId?: string;
}
