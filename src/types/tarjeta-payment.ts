export type TarjetaPaymentMethod = "account";

export type TarjetaPaymentValueType = "total" | "minimum" | "custom";

export interface TarjetaSourceAccount {
  id: string;
  type: "ahorros" | "corriente";
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  displayName: string;
}

export interface TarjetaPaymentConfirmationData {
  sourceAccount: string;
  tarjetaDisplay: string;
  newEstimatedBalance: number;
  valorAPagar: number;
}

export interface TarjetaPaymentResult {
  status: "success" | "error";
  tarjetaDisplay: string;
  valorPagado: number;
  newEstimatedBalance: number;
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion?: string;
}
