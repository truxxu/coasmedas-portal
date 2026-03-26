import type {
  ExternalTransferSourceAccount,
  ExternalTransferDestinationAccount,
  ExternalTransferConfirmationData,
  ExternalTransferResult,
} from "@/src/types/externalTransfer";
import type { Step } from "@/src/types/stepper";

/**
 * Mock source accounts (user's savings accounts)
 */
export const mockExternalTransferSourceAccounts: ExternalTransferSourceAccount[] =
  [
    {
      id: "savings-1",
      type: "Cuenta de Ahorros",
      balance: 8730500,
      maskedNumber: "****4428",
    },
  ];

/**
 * Mock destination accounts (from Inscribir Cuentas feature)
 */
export const mockExternalTransferDestinations: ExternalTransferDestinationAccount[] =
  [
    {
      id: "dest-1",
      alias: "Cuenta Mama",
      bankName: "Bancolombia",
      accountType: "ahorros",
      accountNumber: "123-456789-01",
      holderName: "MARIA GONZALEZ",
    },
    {
      id: "dest-2",
      alias: "Cuenta Arriendo",
      bankName: "Davivienda",
      accountType: "ahorros",
      accountNumber: "987-654321-00",
      holderName: "INMOBILIARIA XYZ",
    },
    {
      id: "dest-3",
      alias: "Restaurante Almuerzos",
      bankName: "BBVA",
      accountType: "corriente",
      accountNumber: "456-789012-34",
      holderName: "DANIELA ALVARADO",
    },
  ];

/**
 * Mock user data for confirmation
 */
export const mockExternalTransferUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
};

/**
 * Mock confirmation data
 */
export const mockExternalTransferConfirmation: ExternalTransferConfirmationData =
  {
    holderName: "CAMILO ANDRES CRUZ",
    holderDocument: "CC 1.***.***. 231",
    sourceProduct: "Cuenta de Ahorros",
    destinationHolder: "MARIA GONZALEZ",
    destinationBank: "Bancolombia",
    destinationAccountType: "Ahorros",
    destinationAccountNumber: "123.-456789-01",
    amount: 500000,
    concept: "Vacaciones",
  };

/**
 * Mock successful transaction result
 */
export const mockExternalTransferResultSuccess: ExternalTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Bancolombia",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 500000,
  concept: "Vacaciones",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:02 p.m.",
  approvalNumber: "256606",
  description: "Transferencia Exitosa",
};

/**
 * Mock error transaction result
 */
export const mockExternalTransferResultError: ExternalTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Bancolombia",
  destinationAccountNumber: "123-456789-01",
  amountTransferred: 0,
  concept: "Vacaciones",
  transactionCost: 0,
  transactionDate: "5 de Enero de 2025",
  transactionTime: "03:03 p.m.",
  approvalNumber: "-",
  description: "Transaccion Fallida",
  errorMessage: "Fondos insuficientes",
};

/**
 * Valid SMS code for testing
 */
export const EXTERNAL_TRANSFER_MOCK_VALID_CODE = "123456";

/**
 * External transfer flow steps
 */
export const EXTERNAL_TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];
