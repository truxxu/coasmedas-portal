import type {
  TransferAccount,
  DestinationProduct,
  TransferResult,
} from "@/src/types/transfer";
import type { Step } from "@/src/types/stepper";

/**
 * Mock user accounts for transfer source
 */
export const mockTransferAccounts: TransferAccount[] = [
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
    name: "Cuenta Nomina",
    accountType: "Nomina",
    productNumber: "2341",
    balance: 3450000,
  },
];

/**
 * Mock destination products
 */
export const mockDestinationProducts: DestinationProduct[] = [
  {
    id: "1",
    name: "Cuenta de Ahorros",
    productNumber: "4428",
    productType: "Ahorros",
  },
  {
    id: "4",
    name: "Ahorro Programado",
    productNumber: "1234",
    productType: "Ahorro Programado",
  },
  {
    id: "5",
    name: "Ahorro Metas",
    productNumber: "9876",
    productType: "Ahorro",
  },
  {
    id: "6",
    name: "CDAT",
    productNumber: "5678",
    productType: "Inversion",
  },
];

/**
 * Mock user data
 */
export const mockUserData = {
  name: "CAMILO ANDRES CRUZ",
  document: "CC 1.***.***234",
};

/**
 * Mock transaction result (success)
 */
export const mockTransferResult: TransferResult = {
  status: "success",
  sourceType: "Cuenta de Ahorros",
  productNumber: "Ahorro Programado",
  amountPaid: 50000,
  transactionCost: 0,
  transmissionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "950606",
  description: "Transferencia Exitosa",
};

/**
 * Mock transaction result (error)
 */
export const mockTransferResultError: TransferResult = {
  status: "error",
  sourceType: "Cuenta de Ahorros",
  productNumber: "Ahorro Programado",
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "-",
  description: "Fondos insuficientes",
};

/**
 * Transfer flow steps
 */
export const TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmacion" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalizacion" },
];

/**
 * Mock SMS verification code (for testing)
 */
export const TRANSFER_MOCK_VALID_CODE = "123456";
