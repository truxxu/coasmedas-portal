/**
 * Payments Service
 *
 * Handles payment product listing, source account selection,
 * internal payments, and Payzen/PSE payments.
 *
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#5-payments
 * @see /services/_template.ts for implementation patterns
 */

import { apiPost } from '@/lib/api/client';
import type {
  PaymentProductsRequest,
  PaymentProduct,
  PaymentSourcesRequest,
  CreatePaymentTransactionRequest,
  PaymentTransactionResult,
  CreatePayzenTransactionRequest,
  PayzenTransactionResult,
} from '@/types/api/payments';
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from '@/types/api/products';

// ─── Payment Products ───

/**
 * List products available for payment.
 *
 * @endpoint POST /payment/products
 * @auth JWT
 * @status ✅ Used in mobile (payment selection)
 */
export async function getPaymentProducts(params: PaymentProductsRequest): Promise<PaymentProduct[]> {
  return apiPost<PaymentProduct[]>('/payment/products', params);
}

// ─── Payment Sources ───

/**
 * List savings accounts available as payment source.
 * Returns same structure as `/products/savings`.
 *
 * @endpoint POST /payment/internal/sources/savings
 * @auth JWT
 * @status ✅ Used in mobile (payment source selection)
 */
export async function getPaymentSourcesSavings(params: PaymentSourcesRequest): Promise<SavingsAccountResponse[]> {
  return apiPost<SavingsAccountResponse[]>('/payment/internal/sources/savings', params);
}

/**
 * List credit accounts available as payment source.
 * Returns same structure as `/products/credits`.
 *
 * @endpoint POST /payment/internal/sources/credits
 * @auth JWT
 * @status ✅ Used in mobile (payment source selection)
 */
export async function getPaymentSourcesCredits(params: PaymentSourcesRequest): Promise<CreditAccountResponse[]> {
  return apiPost<CreditAccountResponse[]>('/payment/internal/sources/credits', params);
}

// ─── Payment Transactions ───

/**
 * Execute an internal payment transaction.
 * Supports multi-product unified payments via the `cuentas` array.
 *
 * @endpoint POST /payment/internal/createTransaction
 * @auth JWT + OTP
 * @status ✅ Used in mobile (payment confirmation)
 */
export async function createPaymentTransaction(params: CreatePaymentTransactionRequest): Promise<PaymentTransactionResult> {
  return apiPost<PaymentTransactionResult>('/payment/internal/createTransaction', params);
}

/**
 * Create a Payzen payment link (PSE external payment).
 * User should be redirected to the returned `paymentUrl` to complete payment.
 *
 * @endpoint POST /payment/payzen/createTransaction
 * @auth JWT
 * @status ✅ Used in mobile (PSE payment)
 */
export async function createPayzenTransaction(params: CreatePayzenTransactionRequest): Promise<PayzenTransactionResult> {
  return apiPost<PayzenTransactionResult>('/payment/payzen/createTransaction', params);
}
