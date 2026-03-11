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
    if (flowId === "inscribir-cuentas") {
      router.push("/transferencias/externas/inscribir-cuentas");
    } else if (flowId === "otros-bancos") {
      router.push("/transferencias/externas/otros-bancos");
    } else if (flowId === "red-copcentral") {
      router.push("/transferencias/externas/red-copcentral");
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
