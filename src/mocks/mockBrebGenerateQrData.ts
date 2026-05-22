import type {
  BrebGenerateQrFormData,
  BrebGenerateQrSourceAccount,
  BrebGeneratedQr,
} from "@/src/types";
import { formatCurrency } from "@/src/utils";

export const mockBrebGenerateQrSourceAccounts: BrebGenerateQrSourceAccount[] = [
  {
    id: "ahorros-001",
    label: "Cuenta de Ahorros",
    balance: 8730500,
  },
];

export function getBrebGenerateQrSourceAccountOptions() {
  return mockBrebGenerateQrSourceAccounts.map((account) => ({
    value: account.id,
    label: `${account.label} - Saldo: ${formatCurrency(account.balance)}`,
  }));
}

export function buildMockBrebQrPayload(
  form: BrebGenerateQrFormData,
): BrebGeneratedQr {
  const account = mockBrebGenerateQrSourceAccounts.find(
    (a) => a.id === form.sourceAccountId,
  );
  const label = account
    ? `${account.label} - Saldo: ${formatCurrency(account.balance)}`
    : form.sourceAccountId;
  const generatedAt = new Date().toISOString();
  return {
    payload: `BREB|MOCK|${form.sourceAccountId}|${form.amount}|${generatedAt}`,
    sourceAccountId: form.sourceAccountId,
    sourceAccountLabel: label,
    amount: form.amount,
    generatedAt,
  };
}
