import type { FlowHolderInfoEn, FlowPaymentResultEn } from "./flow";

/**
 * Source account for protection payment
 */
export interface ProtectionPaymentSourceAccount {
  id: string;
  type: "ahorros" | "corriente";
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  displayName: string;
}

/**
 * Protection product status for payment
 */
export type ProtectionPaymentProductStatus =
  | "activo"
  | "inactivo"
  | "cancelado";

/**
 * Protection product for payment selection
 */
export interface ProtectionPaymentProduct {
  id: string;
  title: string;
  productNumber: string; // "No******65-9"
  nextPaymentAmount: number;
  status: ProtectionPaymentProductStatus;
}

/**
 * Payment method type
 */
export type ProtectionPaymentMethod = "account" | "pse";

/**
 * Step 1 - Payment details form data
 */
export interface ProtectionPaymentDetailsFormData {
  sourceAccountId: string;
  sourceAccountDisplay: string;
  selectedProduct: ProtectionPaymentProduct | null;
  paymentMethod: ProtectionPaymentMethod;
}

/**
 * Step 2 - Confirmation data
 */
export interface ProtectionPaymentConfirmationData extends FlowHolderInfoEn {
  productToPay: string;
  policyNumber: string;
  productToDebit: string;
  amountToPay: number;
}

/**
 * Step 4 - Transaction result
 */
export interface ProtectionPaymentResultData extends FlowPaymentResultEn {
  description: string;
}
