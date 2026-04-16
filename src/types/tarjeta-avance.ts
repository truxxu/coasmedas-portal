export interface TarjetaAvanceFormData {
  destinationAccountId: string;
  cuotas: number;
  valor: number;
  vencimiento: string;
  cvv: string;
}

export interface TarjetaAvanceConfirmationData {
  destinationAccount: string;
  tarjetaDisplay: string;
  cuotas: number;
  comision: number;
  valorPorCuota: number;
  cupoRestante: number;
  valorTotal: number;
  valorAvance: number;
}

export interface TarjetaAvanceResult {
  status: "success" | "error";
  destinationAccount: string;
  valorAbonado: number;
  cupoDisponibleActualizado: number;
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion?: string;
}
