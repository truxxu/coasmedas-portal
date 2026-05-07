export type SolicitudStatus =
  | "solicitado"
  | "en_proceso"
  | "exitoso"
  | "cancelada";

export interface SolicitudDocumento {
  id: string;
  title: string;
  requestedAt: string;
  status: SolicitudStatus;
}
