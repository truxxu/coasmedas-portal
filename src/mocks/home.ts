import { Transaction } from '@/src/types';

export const mockConsolidatedTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Compra de tiquetes',
    date: '05 Jun 2025',
    amount: -1250000,
    type: 'DEBITO',
    productName: 'Cuenta de ahorros',
  },
  {
    id: '2',
    description: 'Abono extraordinario',
    date: '05 Jun 2025',
    amount: 1250000,
    type: 'CREDITO',
    productName: 'Inversiones',
  },
  {
    id: '3',
    description: 'Pago de obligación',
    date: '05 Jun 2025',
    amount: -1250000,
    type: 'DEBITO',
    productName: 'Obligaciones',
  },
  {
    id: '4',
    description: 'Abono de salario',
    date: '05 Jun 2025',
    amount: 1250000,
    type: 'CREDITO',
    productName: 'Aportes',
  },
  {
    id: '5',
    description: 'Compra por internet',
    date: '05 Jun 2025',
    amount: -1250000,
    type: 'DEBITO',
    productName: 'Cuenta de ahorros',
  },
];
