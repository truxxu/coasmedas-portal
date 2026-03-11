"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { ExternasFlowGrid } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

export default function TransferenciasExternasPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Transferencias Externas",
      backHref: "/home",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSelectFlow = (flowId: string) => {
    if (flowId === "entre-mis-cuentas") {
      router.push("/transferencias/internas/entre-mis-cuentas");
    } else if (flowId === "cuentas-mi-red") {
      router.push("/transferencias/internas/cuentas-mi-red");
    } else if (flowId === "desde-cupos-rotativos") {
      router.push("/transferencias/internas/desde-cupos-rotativos");
    } else if (flowId === "recargar-pse") {
      router.push("/transferencias/internas/recargar-pse");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Hide Balances Toggle */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "Externas"]} />
      </div>

      {/* Flow Selection Grid */}
      <ExternasFlowGrid onSelectFlow={handleSelectFlow} />
    </div>
  );
}
