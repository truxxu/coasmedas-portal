"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, HideBalancesToggle } from "@/src/molecules";
import { InternasFlowGrid } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

export default function TransferenciasInternasPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Transferencias Internas",
      backHref: "/home",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSelectFlow = (flowId: string) => {
    if (flowId === "entre-mis-cuentas") {
      router.push("/transferencias/internas/entre-mis-cuentas");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Hide Balances Toggle */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "Internas"]} />
      </div>

      {/* Flow Selection Grid */}
      <InternasFlowGrid onSelectFlow={handleSelectFlow} />
    </div>
  );
}
