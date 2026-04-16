export type TarjetaClaveAction = "asignar" | "cambiar" | "olvide";

export interface TarjetaClaveConfirmationData {
  cardId: string;
  cardDisplay: string;
}

export interface TarjetaClaveResult {
  status: "success" | "error";
  cardDisplay: string;
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion?: string;
}
