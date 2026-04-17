import { Step } from "@/src/types/stepper";
import { TarjetaAvanceResult } from "@/src/types/tarjeta-avance";

export const TARJETA_AVANCE_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

export const mockTarjetaAvanceResult: TarjetaAvanceResult = {
  status: "success",
  destinationAccount: "Cuenta de Ahorros (***4428)",
  valorAbonado: 200000,
  cupoDisponibleActualizado: 3000000,
  fechaTransaccion: "5 de Enero de 2025",
  horaTransaccion: "05:02 p.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

export const mockTarjetaAvanceResultError: TarjetaAvanceResult = {
  status: "error",
  destinationAccount: "Cuenta de Ahorros (***4428)",
  valorAbonado: 0,
  cupoDisponibleActualizado: 0,
  fechaTransaccion: "5 de Enero de 2025",
  horaTransaccion: "05:02 p.m.",
  numeroAprobacion: "-",
  direccionIp: "192.168.1.2",
  descripcion: "No fue posible procesar el avance. Intenta nuevamente.",
};
