import { Step } from "@/src/types/stepper";
import {
  TarjetaClaveAsignarResult,
  TarjetaClaveCambiarResult,
  TarjetaClaveOlvideResult,
} from "@/src/types/tarjeta-clave";

export const TARJETA_CLAVE_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

export const mockTarjetaClaveAsignarResult: TarjetaClaveAsignarResult = {
  status: "success",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

export const mockTarjetaClaveAsignarResultError: TarjetaClaveAsignarResult = {
  status: "error",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "-",
  direccionIp: "192.168.1.2",
  descripcion: "No fue posible asignar la clave. Intenta nuevamente.",
};

export const mockTarjetaClaveCambiarResult: TarjetaClaveCambiarResult = {
  status: "success",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

export const mockTarjetaClaveCambiarResultError: TarjetaClaveCambiarResult = {
  status: "error",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "-",
  direccionIp: "192.168.1.2",
  descripcion: "No fue posible cambiar la clave. Intenta nuevamente.",
};

export const mockTarjetaClaveOlvideResult: TarjetaClaveOlvideResult = {
  status: "success",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

export const mockTarjetaClaveOlvideResultError: TarjetaClaveOlvideResult = {
  status: "error",
  cardDisplay: "Tarjeta de Crédito Visa Clásica (**** 1111)",
  fechaTransaccion: "25 de Octubre de 2026",
  horaTransaccion: "08:34 a.m.",
  numeroAprobacion: "-",
  direccionIp: "192.168.1.2",
  descripcion: "No fue posible recuperar la clave. Intenta nuevamente.",
};
