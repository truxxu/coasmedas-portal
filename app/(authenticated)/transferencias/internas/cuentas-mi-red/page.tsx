"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { RegisteredAccountsList } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockRegisteredNetworkAccounts } from "@/src/mocks/mockNetworkTransferData";
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
    sessionStorage.setItem(
      "networkTransferSelectedRecipient",
      JSON.stringify(account),
    );
    router.push("/transferencias/internas/cuentas-mi-red/detalle");
  };

  const handleBack = () => {
    router.push("/transferencias/internas");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "A Cuentas de mi Red"]}
        />
      </div>

      {/* Recipient Selection List - No Stepper */}
      <RegisteredAccountsList
        accounts={mockRegisteredNetworkAccounts}
        onSelectAccount={handleSelectAccount}
      />

      {/* Footer Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
