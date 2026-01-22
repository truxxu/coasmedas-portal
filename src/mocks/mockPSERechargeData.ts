import type { PSERechargeDestination, PSERechargeResult } from "@/src/types/pseRecharge";

/**
 * Mock destination accounts with balance
 */
export const mockPSERechargeAccounts: PSERechargeDestination[] = [
  {
    id: "pse-dest-1",
    name: "Cuenta de Ahorros",
    maskedNumber: "***4428",
    balance: 8730500,
    accountType: "Ahorros",
  },
  {
    id: "pse-dest-2",
    name: "Cuenta de Ahorros",
    maskedNumber: "***5512",
    balance: 1250000,
    accountType: "Ahorros",
  },
];

/**
 * Mock user data for confirmation
 */
export const mockPSERechargeUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  documentNumber: "CC 1.***.***234",
};

/**
 * Mock successful transaction result
 */
export const mockPSERechargeResultSuccess: PSERechargeResult = {
  status: "success",
  productRecharged: "Cuenta de Ahorros (****4428)",
  amountRecharged: 500000,
  method: "PSE",
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "150606",
  description: "Recarga Exitosa",
};

/**
 * Mock error transaction result
 */
export const mockPSERechargeResultError: PSERechargeResult = {
  status: "error",
  productRecharged: "Cuenta de Ahorros (****4428)",
  amountRecharged: 0,
  method: "PSE",
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:22 pm",
  approvalNumber: "-",
  description: "Pago rechazado por el banco",
};
