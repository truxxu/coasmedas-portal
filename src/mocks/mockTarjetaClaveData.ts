import { Step } from "@/src/types/stepper";
import { TarjetaClaveResult } from "@/src/types/tarjeta-clave";

export const TARJETA_CLAVE_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

const baseSuccess: TarjetaClaveResult = {
  status: "success",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

const baseError: TarjetaClaveResult = {
  ...baseSuccess,
  status: "error",
  numeroAprobacion: "-",
};

export const mockTarjetaClaveAsignarResult = baseSuccess;
export const mockTarjetaClaveAsignarResultError: TarjetaClaveResult = {
  ...baseError,
  descripcion: "No fue posible asignar la clave. Intenta nuevamente.",
};

export const mockTarjetaClaveCambiarResult = baseSuccess;
export const mockTarjetaClaveCambiarResultError: TarjetaClaveResult = {
  ...baseError,
  descripcion: "No fue posible cambiar la clave. Intenta nuevamente.",
};

export const mockTarjetaClaveOlvideResult = baseSuccess;
export const mockTarjetaClaveOlvideResultError: TarjetaClaveResult = {
  ...baseError,
  descripcion: "No fue posible recuperar la clave. Intenta nuevamente.",
};
