import { Step } from "@/src/types/stepper";
import {
  RegisteredBeneficiary,
  PayableProduct,
  SourceAccount,
  OtrosAsociadosTransactionResult,
} from "@/src/types/otros-asociados-payment";

/**
 * Mock registered beneficiaries (other associates)
 */
export const mockRegisteredBeneficiaries: RegisteredBeneficiary[] = [
  {
    id: "1",
    fullName: "MARÍA FERNANDA GONZALEZ",
    alias: "Mamá",
    documentNumber: "***3040",
  },
  {
    id: "2",
    fullName: "CARLOS ALBERTO RAMIREZ",
    alias: "Papá",
    documentNumber: "***5678",
  },
  {
    id: "3",
    fullName: "ANDREA SOFIA MARTINEZ",
    alias: "Hermana",
    documentNumber: "***9012",
  },
];

/**
 * Mock source accounts
 */
export const mockSourceAccounts: SourceAccount[] = [
  {
    id: "1",
    type: "Cuenta de Ahorros",
    balance: 8730500,
    number: "****4428",
  },
  {
    id: "2",
    type: "Cuenta Corriente",
    balance: 5200000,
    number: "****7891",
  },
];

/**
 * Mock payable products for beneficiary
 */
export const mockPayableProducts: PayableProduct[] = [
  {
    id: "1",
    name: "Plan Senior",
    productNumber: "***5488",
    minimumPayment: 850000,
    totalPayment: 12500000,
    amountToPay: 850000,
    isSelected: false,
  },
  {
    id: "2",
    name: "Crédito de Libre Inversión",
    productNumber: "***1010",
    minimumPayment: 850000,
    totalPayment: 12500000,
    amountToPay: 850000,
    isSelected: false,
  },
  {
    id: "3",
    name: "Seguro de Vida",
    productNumber: "***2020",
    minimumPayment: 120000,
    totalPayment: 1440000,
    amountToPay: 120000,
    isSelected: false,
  },
];

/**
 * Mock user data (payer)
 */
export const mockUserData = {
  name: "CAMILO ANDRÉS CRUZ",
  document: "CC 1.***.***. 234",
};

/**
 * Mock transaction result (success)
 */
export const mockOtrosAsociadosTransactionResult: OtrosAsociadosTransactionResult =
  {
    success: true,
    creditLine: "Crédito de Libre Inversión",
    productNumber: "***5678",
    amountPaid: 850000,
    transactionCost: 0,
    transmissionDate: "1 de septiembre de 2025",
    transactionTime: "10:21 pm",
    approvalNumber: "950606",
    description: "Exitosa",
  };

/**
 * Mock transaction result (error)
 */
export const mockOtrosAsociadosTransactionResultError: OtrosAsociadosTransactionResult =
  {
    success: false,
    creditLine: "Crédito de Libre Inversión",
    productNumber: "***5678",
    amountPaid: 0,
    transactionCost: 0,
    transmissionDate: "1 de septiembre de 2025",
    transactionTime: "10:21 pm",
    approvalNumber: "-",
    description: "Fallida",
  };

/**
 * Payment flow steps
 */
export const OTROS_ASOCIADOS_PAYMENT_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

/**
 * Mock SMS verification code (for testing)
 */
export const MOCK_VALID_CODE = "123456";
