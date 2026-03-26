"use client";

import { Card } from "@/src/atoms";
import type { PSERechargeDestination } from "@/src/types/pseRecharge";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface PSERechargeDetailsCardProps {
  destinations: PSERechargeDestination[];
  selectedDestinationId: string;
  amount: string;
  onDestinationChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

export function PSERechargeDetailsCard({
  destinations,
  selectedDestinationId,
  amount,
  onDestinationChange,
  onAmountChange,
  hideBalances,
  error,
}: PSERechargeDetailsCardProps) {
  const formatDestinationOption = (account: PSERechargeDestination) => {
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.name} (${account.maskedNumber}) - Saldo: ${balance}`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    onAmountChange(value);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("es-CO") : "0";

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Recargar mis cuentas con PSE
        </h2>
        <p className="text-[15px] text-brand-text-black">
          Trae dinero desde cualquier otra entidad financiera de forma facil y
          segura.
        </p>
      </div>

      <div className="space-y-5">
        {/* Destination Account */}
        <div>
          <label
            htmlFor="destination-account"
            className="block text-[15px] text-brand-text-black mb-2"
          >
            A que producto quieres abonar?
          </label>
          <select
            id="destination-account"
            value={selectedDestinationId}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-brand-footer-text text-base text-brand-text-black focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {destinations.map((account) => (
              <option key={account.id} value={account.id}>
                {formatDestinationOption(account)}
              </option>
            ))}
          </select>
        </div>

        {/* Recharge Amount */}
        <div>
          <label
            htmlFor="recharge-amount"
            className="block text-[15px] text-brand-text-black mb-2"
          >
            Que valor deseas recargar?
          </label>
          <div className="flex items-center border-b border-brand-footer-text pb-2">
            <span className="text-[19px] font-medium text-brand-gray-high mr-2">
              $
            </span>
            <input
              id="recharge-amount"
              type="text"
              inputMode="numeric"
              value={formattedAmount}
              onChange={handleAmountChange}
              className="flex-1 text-right text-[19px] font-medium text-brand-text-black bg-transparent border-none outline-none focus:ring-0"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-brand-error text-center">{error}</p>}
    </Card>
  );
}
