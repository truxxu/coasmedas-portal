import { Step } from "@/src/types/stepper";
import {
  TarjetaSourceAccount,
  TarjetaPaymentResult,
} from "@/src/types/tarjeta-payment";

export const mockTarjetaSourceAccounts: TarjetaSourceAccount[] = [
  {
    id: "1",
    type: "ahorros",
    accountNumber: "12345678",
    maskedNumber: "***5678",
    balance: 8730500,
    displayName: "Cuenta de Ahorros",
  },
  {
    id: "2",
    type: "corriente",
    accountNumber: "87654321",
    maskedNumber: "***4321",
    balance: 2500000,
    displayName: "Cuenta Corriente",
  },
];

export const TARJETA_PAYMENT_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

export const mockTarjetaPaymentResult: TarjetaPaymentResult = {
  status: "success",
  tarjetaDisplay: "Tarjeta de Crédito Visa Clásica (****1111)",
  valorPagado: 300000,
  newEstimatedBalance: 1500000,
  fechaTransaccion: "5 de Enero de 2025",
  horaTransaccion: "05:02 p.m.",
  numeroAprobacion: "654716",
  direccionIp: "192.168.1.2",
  descripcion: "Exitosa",
};

export const mockTarjetaPaymentResultError: TarjetaPaymentResult = {
  status: "error",
  tarjetaDisplay: "Tarjeta de Crédito Visa Clásica (****1111)",
  valorPagado: 0,
  newEstimatedBalance: 0,
  fechaTransaccion: "5 de Enero de 2025",
  horaTransaccion: "05:02 p.m.",
  numeroAprobacion: "-",
  direccionIp: "192.168.1.2",
  descripcion: "No fue posible procesar el pago. Intenta nuevamente.",
};
