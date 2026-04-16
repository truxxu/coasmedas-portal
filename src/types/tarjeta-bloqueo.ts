export interface TarjetaBloqueoConfirmationData {
  cardId: string;
  cardDisplay: string;
}

export interface TarjetaBloqueoResult {
  status: "success" | "error";
  cardDisplay: string;
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion?: string;
}
