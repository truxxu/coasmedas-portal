import { AportesProduct, MonthOption } from '@/src/types/products';
import { Transaction } from '@/src/types/transaction';
import { generateMonthOptions } from '@/src/utils/dates';

export const mockAportesData: AportesProduct = {
  planName: 'Plan 2 Senior',
  productNumber: '5488',
  totalBalance: 890058,
  paymentDeadline: '2025-11-15',
  detalleAportes: {
    vigentes: 500058,
    enMora: 0,
    fechaCubrimiento: '2025-12-31',
  },
  detalleFondos: {
    vigentes: 390000,
    enMora: 0,
    fechaCubrimiento: '2025-12-31',
  },
};

// Empty transactions for initial implementation - shows empty state
export const mockTransactions: Transaction[] = [];

// Generate last 12 months for report download
export const mockAvailableMonths: MonthOption[] = generateMonthOptions(12);
