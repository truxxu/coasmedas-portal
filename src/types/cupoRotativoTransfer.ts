import type {
  FlowHolderInfoTransfer,
  FlowTransactionMetadataEn,
  FlowTransactionStatus,
} from "./flow";

/**
 * Cupo Rotativo (Revolving Credit Line) product
 */
export interface CupoRotativo {
  id: string;
  name: string;
  availableAmount: number;
  totalAmount: number;
}

/**
 * Destination account for cupo rotativo transfer
 */
export interface CupoRotativoDestination {
  id: string;
  name: string;
  maskedNumber: string;
  accountType: string;
}

/**
 * Step 1: Transfer details form data
 */
export interface CupoRotativoTransferFormData {
  cupoRotativoId: string;
  destinationAccountId: string;
  amount: number;
}

/**
 * Step 2: Confirmation display data
 */
export interface CupoRotativoConfirmationData extends FlowHolderInfoTransfer {
  cupoOrigen: string;
  cuentaDestino: string;
  amount: number;
  transactionCost?: number;
}

/**
 * Step 4: Transaction result
 */
export interface CupoRotativoTransferResult
  extends FlowTransactionStatus, FlowTransactionMetadataEn {
  sourceAccount: string;
  destinationAccount: string;
  amountTransferred: number;
  transactionCost: number;
}

/**
 * Complete transfer flow state
 */
export interface CupoRotativoTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedCupo: CupoRotativo | null;
  selectedDestination: CupoRotativoDestination | null;
  formData: CupoRotativoTransferFormData | null;
  confirmationData: CupoRotativoConfirmationData | null;
  verificationCode: string;
  transactionResult: CupoRotativoTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
