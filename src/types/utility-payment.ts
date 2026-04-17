import type { FlowHolderInfoEn, FlowPaymentResultEn } from "./flow";

/**
 * Source account for utility payment
 */
export interface UtilitySourceAccount {
  id: string;
  type: "ahorros" | "corriente";
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  displayName: string;
}

/**
 * Registered utility service (from 09e registration)
 */
export interface RegisteredService {
  id: string;
  alias: string;
  provider: string;
  serviceType: string;
  reference: string;
  displayName: string;
  amount: number;
}

/**
 * Payment method type for utility payments
 */
export type UtilityPaymentMethod = "account" | "pse";

/**
 * Payment type: registered service or non-registered (one-time)
 */
export type UtilityPaymentType = "inscrito" | "no-inscrito";

/**
 * Step 1 - Payment details form data
 */
export interface UtilityPaymentDetails {
  sourceAccountId: string;
  sourceAccountDisplay: string;
  paymentType: UtilityPaymentType;
  serviceId: string;
  serviceDisplay: string;
  serviceType: string;
  amount: number;
  paymentMethod: UtilityPaymentMethod;
  // Fields for non-registered service payment
  categoryId?: string;
  categoryName?: string;
  convenioId?: string;
  convenioName?: string;
  reference?: string;
}

/**
 * Step 2 - Confirmation data (derived from step 1 + user context)
 */
export interface UtilityPaymentConfirmation extends FlowHolderInfoEn {
  serviceToPay: string;
  invoiceReference: string;
  productToDebit: string;
  totalAmount: number;
}

/**
 * Step 4 - Transaction result
 */
export interface UtilityPaymentResult extends FlowPaymentResultEn {
  description: string;
}
