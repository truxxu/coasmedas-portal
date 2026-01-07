/**
 * Source account for utility payment
 */
export interface SourceAccount {
  id: string;
  type: 'ahorros' | 'corriente';
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
}

/**
 * Step 1 - Payment details form data
 */
export interface UtilityPaymentDetails {
  sourceAccountId: string;
  sourceAccountDisplay: string;
  serviceId: string;
  serviceDisplay: string;
  serviceType: string;
  amount: number;
}

/**
 * Step 2 - Confirmation data (derived from step 1 + user context)
 */
export interface UtilityPaymentConfirmation {
  holderName: string;
  holderDocument: string;
  serviceToPay: string;
  invoiceReference: string;
  productToDebit: string;
  totalAmount: number;
}

/**
 * Step 4 - Transaction result
 */
export interface UtilityPaymentResult {
  success: boolean;
  creditLine: string;
  productNumber: string;
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}
