export type TransactionType = 'DEBITO' | 'CREDITO';

export interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: TransactionType;
}
