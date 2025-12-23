import { ProteccionProduct } from '@/src/types/proteccion';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock insurance/protection products for carousel
 */
export const mockProteccionProducts: ProteccionProduct[] = [
  {
    id: '1',
    title: 'Póliza de Vida',
    productNumber: '65-9',
    status: 'activo',
    minimumPayment: 85000,
    paymentDeadline: '2025-12-31',
    annualPayment: 1020000,
  },
  {
    id: '2',
    title: 'Seguro de Accidentes',
    productNumber: '12-3',
    status: 'activo',
    minimumPayment: 45000,
    paymentDeadline: '2025-12-15',
    annualPayment: 540000,
  },
  {
    id: '3',
    title: 'Seguro Exequial',
    productNumber: '78-4',
    status: 'inactivo',
    minimumPayment: 25000,
    paymentDeadline: '2025-11-30',
    annualPayment: 300000,
  },
  {
    id: '4',
    title: 'Póliza Hogar',
    productNumber: '99-1',
    status: 'cancelado',
    minimumPayment: 120000,
    paymentDeadline: '2025-10-15',
    annualPayment: 1440000,
  },
];

/**
 * Mock transactions for protection/insurance accounts
 */
export const mockProteccionTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-01',
    description: 'Pago prima mensual - Póliza de Vida',
    amount: 85000,
    type: 'debit',
  },
  {
    id: '2',
    date: '2024-10-01',
    description: 'Pago prima mensual - Póliza de Vida',
    amount: 85000,
    type: 'debit',
  },
  {
    id: '3',
    date: '2024-09-01',
    description: 'Pago prima mensual - Póliza de Vida',
    amount: 85000,
    type: 'debit',
  },
];

/**
 * Available months for report download
 */
export const mockProteccionAvailableMonths: MonthOption[] = generateMonthOptions(12);
