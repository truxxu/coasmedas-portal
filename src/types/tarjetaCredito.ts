export type TarjetaCreditoStatus =
  | "activa"
  | "pendiente_activacion"
  | "bloqueada";

export type TarjetaCreditoClaveEstado = "asignada" | "no_asignada";

export interface TarjetaCreditoProduct {
  id: string;
  title: string;
  maskedNumber: string;
  last4: string;
  status: TarjetaCreditoStatus;
  claveEstado: TarjetaCreditoClaveEstado;
  deudaTotal: number;
  cupoTotal: number;
  cupoUtilizado: number;
  cupoDisponible: number;
  pagoMinimo: number;
  fechaLimitePago: string;
}
