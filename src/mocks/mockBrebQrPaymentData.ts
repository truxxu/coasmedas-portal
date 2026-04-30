import type {
  BrebQrDecodedPayload,
  BrebQrPaymentConfirmationData,
  BrebQrPaymentResult,
} from "@/src/types/brebQrPayment";
import type { Step } from "@/src/types/stepper";

export const mockBrebQrDecodedPayload: BrebQrDecodedPayload = {
  destinationName: "COMERCIO XYZ SAS",
  destinationKey: "Pago con QR",
  amount: 125000,
};

export const mockBrebQrPaymentConfirmation: BrebQrPaymentConfirmationData = {
  sourceProduct: "Cuenta de Ahorros (***4428)",
  destinationName: "COMERCIO XYZ SAS",
  destinationKey: "Pago con QR",
  amount: 125000,
};

export const mockBrebQrPaymentResultSuccess: BrebQrPaymentResult = {
  status: "success",
  destinationName: "COMERCIO XYZ SAS",
  destinationKey: "Pago QR",
  amount: 125000,
  sourceAccount: "Cuenta de Ahorros (***4428)",
  transactionDate: "2 de septiembre de 2025",
  transactionTime: "08:44 a.m.",
  referenceNumber: "599012",
};

export const mockBrebQrPaymentResultError: BrebQrPaymentResult = {
  status: "error",
  destinationName: "COMERCIO XYZ SAS",
  destinationKey: "Pago QR",
  amount: 0,
  sourceAccount: "Cuenta de Ahorros (***4428)",
  transactionDate: "2 de septiembre de 2025",
  transactionTime: "08:45 a.m.",
  referenceNumber: "-",
  errorMessage: "Fondos insuficientes",
};

export const BREB_QR_PAYMENT_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];
