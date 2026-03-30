import type {
  RedCoopSourceAccount,
  RedCoopDestinationAccount,
  RedCoopTransferConfirmationData,
  RedCoopTransferResult,
} from "@/src/types/redCoopTransfer";
import type { Step } from "@/src/types/stepper";

/**
 * Mock source accounts (user's savings accounts)
 */
export const mockRedCoopSourceAccounts: RedCoopSourceAccount[] = [
  {
    id: "savings-1",
    type: "Cuenta de Ahorros",
    balance: 8730500,
    maskedNumber: "****4428",
  },
];

/**
 * Mock destination accounts (Coopcentral network accounts)
 */
export const mockRedCoopDestinationAccounts: RedCoopDestinationAccount[] = [
  {
    id: "dest-1",
    holderName: "COOPERATIVA COOFINAL",
    bankName: "Coopcentral",
    accountType: "ahorros",
    accountNumber: "300-123456-01",
  },
  {
    id: "dest-2",
    holderName: "COOPERATIVA COOMEVA",
    bankName: "Coopcentral",
    accountType: "corriente",
    accountNumber: "300-654321-02",
  },
];

/**
 * Mock user data for confirmation
 */
export const mockRedCoopUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
};

/**
 * Mock confirmation data
 */
export const mockRedCoopConfirmation: RedCoopTransferConfirmationData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
  sourceProduct: "Cuenta de Ahorros",
  destinationHolder: "COOPERATIVA COOFINAL",
  destinationBank: "Coopcentral",
  destinationAccountType: "Ahorros",
  destinationAccountNumber: "300-123456-01",
  amount: 500000,
  concept: "Transferencia red",
};

/**
 * Mock successful transaction result
 */
export const mockRedCoopResultSuccess: RedCoopTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Coopcentral",
  destinationAccountNumber: "300-123456-01",
  amountTransferred: 500000,
  concept: "Transferencia red",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:02 p.m.",
  approvalNumber: "256606",
  description: "Transferencia Exitosa",
};

/**
 * Mock error transaction result
 */
export const mockRedCoopResultError: RedCoopTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Coopcentral",
  destinationAccountNumber: "300-123456-01",
  amountTransferred: 0,
  concept: "Transferencia red",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:03 p.m.",
  approvalNumber: "-",
  description: "Transaccion Fallida",
  errorMessage: "Fondos insuficientes",
};

/**
 * Red Coopcentral transfer flow steps
 */
export const RED_COOP_TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];
