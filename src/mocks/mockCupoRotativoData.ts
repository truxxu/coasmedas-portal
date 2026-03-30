import type {
  CupoRotativo,
  CupoRotativoDestination,
  CupoRotativoTransferResult,
} from "@/src/types/cupoRotativoTransfer";

/**
 * Mock cupos rotativos
 */
export const mockCuposRotativos: CupoRotativo[] = [
  {
    id: "cr-1",
    name: "Cupo Rotativo Personal",
    availableAmount: 2000000,
    totalAmount: 5000000,
  },
  {
    id: "cr-2",
    name: "Cupo Rotativo Personal",
    availableAmount: 2000000,
    totalAmount: 5000000,
  },
];

/**
 * Mock destination accounts
 */
export const mockCupoRotativoDestinations: CupoRotativoDestination[] = [
  {
    id: "dest-1",
    name: "Cuenta de Ahorros",
    maskedNumber: "***4428",
    accountType: "Ahorros",
  },
  {
    id: "dest-2",
    name: "Cuenta de Ahorros",
    maskedNumber: "***7891",
    accountType: "Ahorros",
  },
];

/**
 * Mock user data for confirmation
 */
export const mockCupoRotativoUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  documentNumber: "CC 1.***.***234",
};

/**
 * Mock successful transaction result
 */
export const mockCupoRotativoResultSuccess: CupoRotativoTransferResult = {
  status: "success",
  sourceAccount: "Cupo Rotativo Personal",
  destinationAccount: "Cuenta de Ahorros (***4428)",
  amountTransferred: 1000000,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "250606",
  description: "Transferencia Exitosa",
};

/**
 * Mock error transaction result
 */
export const mockCupoRotativoResultError: CupoRotativoTransferResult = {
  status: "error",
  sourceAccount: "Cupo Rotativo Personal",
  destinationAccount: "Cuenta de Ahorros (***4428)",
  amountTransferred: 0,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:22 pm",
  approvalNumber: "-",
  description: "Cupo no disponible",
};
