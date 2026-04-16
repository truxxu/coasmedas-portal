export type TarjetaClaveAction = "asignar" | "cambiar" | "olvide";

export interface TarjetaClaveAsignarConfirmationData {
  cardId: string;
  cardDisplay: string;
}

export interface TarjetaClaveAsignarResult {
  status: "success" | "error";
  cardDisplay: string;
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion?: string;
}

export interface TarjetaClaveCambiarConfirmationData {
  cardId: string;
  cardDisplay: string;
}

export interface TarjetaClaveCambiarResult {
  status: "success" | "error";
  cardDisplay: string;
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion?: string;
}
