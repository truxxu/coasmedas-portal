import { Step } from "@/src/types/stepper";
import { TarjetaActivacionResult } from "@/src/types/tarjeta-activacion";

export const TARJETA_ACTIVACION_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

export const mockTarjetaActivacionResult: TarjetaActivacionResult = {
  status: "success",
  cardDisplay: "Tarjeta de Crédito Mastercard Gold (**** 2222)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

export const mockTarjetaActivacionResultError: TarjetaActivacionResult = {
  status: "error",
  cardDisplay: "Tarjeta de Crédito Mastercard Gold (**** 2222)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "-",
  direccionIp: "192.168.1.2",
  descripcion: "No fue posible activar la tarjeta. Intenta nuevamente.",
};
