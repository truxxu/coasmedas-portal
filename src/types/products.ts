// Product types
export type ProductType = 'aportes' | 'ahorros' | 'inversiones' | 'proteccion' | 'coaspocket';

// Aportes-specific types
export interface AportesProduct {
  planName: string;
  productNumber: string;
  totalBalance: number;
  paymentDeadline: string;
  detalleAportes: ProductDetail;
  detalleFondos: ProductDetail;
}

export interface ProductDetail {
  vigentes: number;
  enMora: number;
  fechaCubrimiento: string;
}

// Month option for reports
export interface MonthOption {
  value: string;
  label: string;
}

// Date range filter
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}
