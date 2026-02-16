import { TransactionItem } from "@/src/molecules";
import { Transaction } from "@/src/types";

interface RecentTransactionsProps {
  transactions?: Transaction[];
  loading?: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-brand-text-black mb-4">
          Últimos Movimientos
        </h2>
        <div className="bg-white rounded-[5px] p-6 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold text-brand-text-black mb-4">
          Últimos Movimientos
        </h2>
        <div className="bg-white rounded-[5px] p-6">
          <p className="text-sm text-brand-gray-secondary text-center">
            No hay movimientos recientes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-text-black mb-4">
        Últimos Movimientos
      </h2>
      <div className="bg-white rounded-[5px] p-6">
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            showDivider={index < transactions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
