export type AccountType = 'AHORROS' | 'CORRIENTE' | 'CREDITO' | 'INVERSION';

export interface Account {
  accountNumber: string;
  accountType: AccountType;
  productCode: string;
  availableBalance: number;
  totalBalance: number;
  maskedNumber: string;
}
