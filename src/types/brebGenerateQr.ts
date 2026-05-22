export interface BrebGenerateQrFormData {
  sourceAccountId: string;
  amount: number;
}

export interface BrebGenerateQrSourceAccount {
  id: string;
  label: string;
  balance: number;
}

export interface BrebGeneratedQr {
  payload: string;
  sourceAccountId: string;
  sourceAccountLabel: string;
  amount: number;
  generatedAt: string;
}
