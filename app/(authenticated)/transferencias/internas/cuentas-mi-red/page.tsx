"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, HideBalancesToggle, Stepper } from "@/src/molecules";
import { RegisteredAccountsList } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockRegisteredAccounts,
  NETWORK_TRANSFER_STEPS,
} from "@/src/mocks/mockNetworkTransferData";
import { RegisteredNetworkAccount } from "@/src/types/networkTransfer";

export default function CuentasMiRedPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "A Cuentas de mi Red",
      backHref: "/transferencias/internas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSelectAccount = (account: RegisteredNetworkAccount) => {
    // Store selected recipient for next step
    sessionStorage.setItem("networkTransferRecipient", JSON.stringify(account));

    // For now, select the first product by default
    if (account.products.length > 0) {
      sessionStorage.setItem(
        "networkTransferDestination",
        JSON.stringify(account.products[0])
      );
    }

    router.push("/transferencias/internas/cuentas-mi-red/detalle");
  };

  const handleBack = () => {
    router.push("/transferencias/internas");
  };

  return (
    <div className="space-y-6">
      {/* Header with Hide Balances Toggle */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "A Cuentas de mi Red"]}
        />
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-sm">
        <Stepper currentStep={1} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Registered Accounts List */}
      <RegisteredAccountsList
        accounts={mockRegisteredAccounts}
        onSelectAccount={handleSelectAccount}
      />

      {/* Footer Actions */}
      <div>
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
