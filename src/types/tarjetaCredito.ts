export type TarjetaCreditoStatus =
  | "activa"
  | "pendiente_activacion"
  | "bloqueada";

export interface TarjetaCreditoProduct {
  id: string;
  title: string;
  maskedNumber: string;
  last4: string;
  status: TarjetaCreditoStatus;
  deudaTotal: number;
  cupoTotal: number;
  cupoUtilizado: number;
  cupoDisponible: number;
  pagoMinimo: number;
  fechaLimitePago: string;
}
