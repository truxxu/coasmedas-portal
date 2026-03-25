import type {
  UserIdentification,
  AccountReference,
  DocumentType,
} from "./common";

// ─── Request Types ───

/**
 * Request for POST /payment/products and source-listing endpoints.
 */
export interface PaymentProductsRequest extends UserIdentification {
  /** Pagination indicator (optional per mobile evidence) */
  indPag?: string;
}

/**
 * Alias for source-listing endpoints (savings/credits).
 * Same shape as PaymentProductsRequest.
 */
export type PaymentSourcesRequest = PaymentProductsRequest;

// ─── /payment/products Response ───

/**
 * A product available for payment.
 */
export interface PaymentProduct {
  /** Product type code (e.g. "AH" = ahorros) */
  tipoProducto: string;
  /** Product description (e.g. "CUENTA AHORROS") */
  descProducto: string;
  numeroCuenta: string;
  pagoMinimo: string | number;
  idCuenta: string;
  alias: string;
}

// ─── /payment/internal/createTransaction ───

/**
 * Individual target account in a payment transaction.
 */
export interface PaymentAccountTarget {
  idCuenta: string;
  numeroCuenta: string;
  tipoProducto: string;
  vlrPago: number;
}

/**
 * Request for POST /payment/internal/createTransaction.
 * Supports multi-product unified payments via the `cuentas` array.
 */
export interface CreatePaymentTransactionRequest extends UserIdentification {
  /** 6-digit OTP code */
  otp: string;
  /** Total payment amount */
  vlrPagoTotal: number;
  /** Source account */
  origen: AccountReference;
  /** Target accounts to pay */
  cuentas: PaymentAccountTarget[];
}

/**
 * Successful payment transaction result.
 */
export interface PaymentTransactionResult {
  numAprobacion: number;
  /** Format: YYYYMMDD */
  fechaTrn: string;
  /** Format: HHMMSS (returned as number) */
  horaTrn: number;
  vlrPagoTotal: number;
}

// ─── /payment/payzen/createTransaction ───

/**
 * Payer information for Payzen (PSE) transactions.
 */
export interface PayzenPayer {
  documentType: DocumentType;
  documentNumber: string;
  names: string;
  lastNames: string;
  email: string;
  mobile: string;
}

/**
 * Request for POST /payment/payzen/createTransaction.
 * Creates an external Payzen payment link.
 */
export interface CreatePayzenTransactionRequest extends UserIdentification {
  vlrPagoTotal: number;
  pagador: PayzenPayer;
  merchantComment: string;
  /** Optional target accounts (mobile sends this, backend docs omit it) */
  cuentas?: PaymentAccountTarget[];
}

/**
 * Payzen transaction result with redirect URL.
 */
export interface PayzenTransactionResult {
  /** URL to redirect user to complete payment */
  paymentUrl: string;
}
