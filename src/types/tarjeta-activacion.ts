export interface TarjetaActivacionConfirmationData {
  cardId: string;
  cardDisplay: string;
  fechaEmision: string;
}

export interface TarjetaActivacionResult {
  status: "success" | "error";
  cardDisplay: string;
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion?: string;
}
