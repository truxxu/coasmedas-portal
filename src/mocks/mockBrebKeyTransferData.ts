import type {
  BrebSourceAccount,
  BrebKeyTransferConfirmationData,
  BrebKeyTransferResult,
} from "@/src/types/brebKeyTransfer";
import type { Step } from "@/src/types/stepper";

export const mockBrebSourceAccounts: BrebSourceAccount[] = [
  {
    id: "savings-1",
    type: "Cuenta de Ahorros",
    balance: 8730500,
    maskedNumber: "****4428",
  },
];

export const mockBrebKeyTransferConfirmation: BrebKeyTransferConfirmationData =
  {
    sourceProduct: "Cuenta de Ahorros (***4428)",
    destinationHolder: "Usuario Desconocido",
    destinationKey: "3456789011",
    amount: 45000,
  };

export const mockBrebKeyTransferResultSuccess: BrebKeyTransferResult = {
  status: "success",
  destinationHolder: "Usuario Desconocido",
  destinationKey: "3456789011",
  amount: 45000,
  sourceAccount: "Cuenta de Ahorros (***4428)",
  transactionDate: "2 de septiembre de 2025",
  transactionTime: "08:44 a.m.",
  referenceNumber: "409012",
};

export const mockBrebKeyTransferResultError: BrebKeyTransferResult = {
  status: "error",
  destinationHolder: "Usuario Desconocido",
  destinationKey: "3456789011",
  amount: 0,
  sourceAccount: "Cuenta de Ahorros (***4428)",
  transactionDate: "2 de septiembre de 2025",
  transactionTime: "08:45 a.m.",
  referenceNumber: "-",
  errorMessage: "Fondos insuficientes",
};

export const BREB_KEY_TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];
