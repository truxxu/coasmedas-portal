import { Step } from "@/src/types/stepper";
import { TarjetaBloqueoResult } from "@/src/types/tarjeta-bloqueo";

export const TARJETA_BLOQUEO_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

export const mockTarjetaBloqueoResult: TarjetaBloqueoResult = {
  status: "success",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

export const mockTarjetaBloqueoResultError: TarjetaBloqueoResult = {
  status: "error",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "-",
  direccionIp: "192.168.1.2",
  descripcion: "No fue posible bloquear la tarjeta. Intenta nuevamente.",
};
