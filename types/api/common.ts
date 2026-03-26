/**
 * Standard API response envelope used by all Coasmedas endpoints.
 * @see /docs/CONSOLIDATED_API_REFERENCE.md#response-envelope
 */
export interface ApiResponse<T = unknown> {
  statusCode: number;
  statusDesc: string;
  payload: T;
}

/**
 * Document type identifiers accepted by the backend.
 */
export type DocumentType = "CC" | "CE" | "NIT" | "TI" | "PA";

/**
 * Common user identification fields used in most request payloads.
 */
export interface UserIdentification {
  documentType: DocumentType;
  documentNumber: string;
}

/**
 * Source/destination account object used in payments and transfers.
 */
export interface AccountReference {
  codigoProductoCobis: string;
  idCuenta: string;
  numeroCuenta: string;
  tipoCartera?: string;
}

/**
 * Device info required by BRE-B endpoints.
 * For web: use "web" for platform, browser info for trademark/model.
 */
export interface DeviceInfo {
  ip: string;
  userAgentString: string;
  trademark: string;
  model: string;
  platform: string;
  versionPlatform: string;
}

/**
 * Transaction OTP types.
 * @see /docs/CONSOLIDATED_API_REFERENCE.md - POST /send-otp/transaction
 */
export type TransactionOtpType =
  | "PaymentInternal"
  | "TransferInternal"
  | "TransferExternalBanks"
  | "TransferExternalEntities";

/**
 * Normalize a monetary value that may come as string or number.
 * Backend returns strings (MapFrame), but some fields arrive as numbers.
 */
export function normalizeMoney(value: string | number): number {
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Normalize a string-or-number field to string.
 */
export function normalizeString(value: string | number): string {
  return String(value);
}
