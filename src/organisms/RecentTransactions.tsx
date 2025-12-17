import { TransactionItem } from "@/src/molecules";
import { Transaction } from "@/src/types";

// Mock data for development
const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Compra de tiquetes",
    date: "05 Jun 2025",
    amount: -1250000,
    type: "DEBITO",
  },
  {
    id: "2",
    description: "Abono extraordinario",
    date: "05 Jun 2025",
    amount: 1250000,
    type: "CREDITO",
  },
  {
    id: "3",
    description: "Pago de obligación",
    date: "05 Jun 2025",
    amount: -1250000,
    type: "DEBITO",
  },
  {
    id: "4",
    description: "Abono de salario",
    date: "05 Jun 2025",
    amount: 1250000,
    type: "CREDITO",
  },
  {
    id: "5",
    description: "Compra por internet",
    date: "05 Jun 2025",
    amount: -1250000,
    type: "DEBITO",
  },
];

export function RecentTransactions() {
  return (
    <div>
      <h2 className="text-xl font-bold text-brand-text-black mb-4">
        Últimos Movimientos
      </h2>
      <div className="bg-white rounded-[5px] p-6">
        {mockTransactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            showDivider={index < mockTransactions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
