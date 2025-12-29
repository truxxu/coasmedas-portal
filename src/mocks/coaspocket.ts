import { CoaspocketProduct } from "@/src/types/coaspocket";
import { Transaction, MonthOption } from "@/src/types/products";
import { generateMonthOptions } from "@/src/utils/dates";

/**
 * Mock Coaspocket (digital pocket) products for carousel
 */
export const mockCoaspocketProducts: CoaspocketProduct[] = [
  {
    id: "1",
    title: "Vacaciones",
    pocketNumber: "1234",
    balance: 1500000,
    status: "activo",
  },
  {
    id: "2",
    title: "Fondo de Emergencia",
    pocketNumber: "5678",
    balance: 3200000,
    status: "activo",
  },
];

/**
 * Mock transactions for Coaspocket accounts
 */
export const mockCoaspocketTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-12-20",
    description: "Transferencia a bolsillo - Vacaciones",
    amount: 200000,
    type: "credit",
  },
  {
    id: "2",
    date: "2024-12-15",
    description: "Transferencia a bolsillo - Fondo de Emergencia",
    amount: 500000,
    type: "credit",
  },
  {
    id: "3",
    date: "2024-12-10",
    description: "Retiro de bolsillo - Educación",
    amount: 150000,
    type: "debit",
  },
];

/**
 * Available months for report download
 */
export const mockCoaspocketAvailableMonths: MonthOption[] =
  generateMonthOptions(12);
