/**
 * Destination account for PSE recharge
 */
export interface PSERechargeDestination {
  id: string;
  name: string;
  maskedNumber: string;
  balance: number;
  accountType: string;
}

/**
 * Step 1: Recharge details form data
 */
export interface PSERechargeFormData {
  destinationAccountId: string;
  amount: number;
}

/**
 * Step 2: Confirmation display data
 */
export interface PSERechargeConfirmationData {
  holderName: string;
  documentNumber: string;
  productToRecharge: string;
  amount: number;
  method: string;
  transactionCost?: number;
}

/**
 * Step 4: Transaction result
 */
export interface PSERechargeResult {
  status: "success" | "error";
  productRecharged: string;
  amountRecharged: number;
  method: string;
  transactionCost: number;
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}

/**
 * Complete recharge flow state
 */
export interface PSERechargeFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedDestination: PSERechargeDestination | null;
  formData: PSERechargeFormData | null;
  confirmationData: PSERechargeConfirmationData | null;
  transactionResult: PSERechargeResult | null;
  isLoading: boolean;
  error: string | null;
}
