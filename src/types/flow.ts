/**
 * Shared fragment types reused across payment and transfer flow result /
 * confirmation interfaces. These are pure intersections — no property names
 * are renamed, so sessionStorage payloads and existing consumers stay intact.
 */

/** success/error string discriminator + optional error message */
export interface FlowTransactionStatus {
  status: "success" | "error";
  errorMessage?: string;
}

/** English-named transaction metadata (used by transfer flows + some payments) */
export interface FlowTransactionMetadataEn {
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}

/** Spanish-named transaction metadata (used by aportes + obligacion payments) */
export interface FlowTransactionMetadataEs {
  fechaTransmision: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  descripcion: string;
}

/** Common payment result amounts (English naming) */
export interface FlowPaymentAmounts {
  creditLine: string;
  productNumber: string;
  amountPaid: number;
  transactionCost: number;
}

/**
 * Shared body of Protection / OtrosAsociados / Utility payment results.
 * These flows use boolean success + English "transmissionDate" naming (distinct
 * from both the transfer flows' `transactionDate` and the aportes/obligacion
 * flows' Spanish `fechaTransmision`). Each consuming type adds its own
 * `description` field since OtrosAsociados narrows it to a literal union.
 */
export interface FlowPaymentResultEn extends FlowPaymentAmounts {
  success: boolean;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
}

/** Common payment confirmation holder info (Spanish naming) */
export interface FlowHolderInfoEs {
  titular: string;
  documento: string;
}

/** Common payment confirmation holder info (English naming) */
export interface FlowHolderInfoEn {
  holderName: string;
  holderDocument: string;
}

/** Common transfer confirmation holder info (used by internal transfers) */
export interface FlowHolderInfoTransfer {
  holderName: string;
  documentNumber: string;
}
