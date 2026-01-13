import {
  RegisteredNetworkAccount,
  SourceAccount,
  NetworkTransferResult,
} from "@/src/types/networkTransfer";
import { Step } from "@/src/types/stepper";

/**
 * Mock registered network accounts (recipients)
 */
export const mockRegisteredAccounts: RegisteredNetworkAccount[] = [
  {
    id: "1",
    name: "MARÍA FERNANDA GONZALEZ",
    productCount: 2,
    products: [
      {
        id: "p1",
        type: "ahorros",
        name: "Cuenta de Ahorros",
        maskedNumber: "****4522",
      },
      {
        id: "p2",
        type: "corriente",
        name: "Cuenta Corriente",
        maskedNumber: "****7890",
      },
    ],
  },
  {
    id: "2",
    name: "CARLOS ALBERTO PÉREZ",
    productCount: 1,
    products: [
      {
        id: "p3",
        type: "ahorros",
        name: "Cuenta de Ahorros",
        maskedNumber: "****3344",
      },
    ],
  },
  {
    id: "3",
    name: "JULIANA ANDREA BARRIOS",
    productCount: 1,
    products: [
      {
        id: "p4",
        type: "ahorros",
        name: "Cuenta de Ahorros",
        maskedNumber: "****9988",
      },
    ],
  },
];

/**
 * Mock source accounts (user's own accounts)
 */
export const mockSourceAccounts: SourceAccount[] = [
  {
    id: "1",
    name: "Cuenta de Ahorros",
    accountType: "Ahorros",
    productNumber: "4428",
    balance: 8730500,
  },
  {
    id: "2",
    name: "Cuenta Corriente",
    accountType: "Corriente",
    productNumber: "7891",
    balance: 5200000,
  },
  {
    id: "3",
    name: "Cuenta Nómina",
    accountType: "Nómina",
    productNumber: "2341",
    balance: 3450000,
  },
];

/**
 * Mock transaction result (success)
 */
export const mockNetworkTransferResult: NetworkTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  recipientName: "MARIA FERNANDA GONZALEZ",
  destinationAccount: "Cuenta de Ahorros (Ahorros ****4522)",
  amountTransferred: 350000,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "450606",
  description: "Transferencia Exitosa",
};

/**
 * Mock transaction result (error)
 */
export const mockNetworkTransferResultError: NetworkTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  recipientName: "MARIA FERNANDA GONZALEZ",
  destinationAccount: "Cuenta de Ahorros (Ahorros ****4522)",
  amountTransferred: 0,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "-",
  description: "Fondos insuficientes",
};

/**
 * Network transfer flow steps
 */
export const NETWORK_TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

/**
 * Mock SMS verification code (for testing)
 */
export const MOCK_VALID_CODE = "123456";
