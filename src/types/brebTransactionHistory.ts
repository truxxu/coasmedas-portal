export type BrebTransactionType =
  | "envio_llave"
  | "recepcion_llave"
  | "envio_qr"
  | "recepcion_qr"
  | "devolucion_pago";

export type BrebTransactionStatus = "exitosa" | "fallida" | "revision_en_curso";

export type BrebTransactionAmountSign = "credit" | "debit";

export interface BrebTransaction {
  id: string;
  title: string;
  type: BrebTransactionType;
  date: string;
  amount: number;
  sign: BrebTransactionAmountSign;
  status: BrebTransactionStatus;
  keyUsed?: string;
  sourceProduct?: string;
  destinationProduct?: string;
}

export type BrebTransactionDateRange =
  | "ultimos_30"
  | "ultimos_60"
  | "ultimos_90"
  | "todos";

export interface BrebTransactionFilter {
  dateRange: BrebTransactionDateRange;
  type: BrebTransactionType | "todos";
  status: BrebTransactionStatus | "todos";
}
