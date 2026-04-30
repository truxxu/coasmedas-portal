"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { BrebFlowGrid } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

export default function BreBPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Bre-B",
      backHref: "/home",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSelectFlow = (flowId: string) => {
    if (flowId === "pagar-transferir-llave") {
      router.push("/bre-b/pagar-transferir-llave");
    } else if (flowId === "pagar-qr") {
      router.push("/bre-b/pagar-qr");
    } else if (flowId === "gestionar-llaves") {
      router.push("/bre-b/gestionar-llaves");
    } else if (flowId === "historial") {
      router.push("/bre-b/historial");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B"]} />
      </div>

      <BrebFlowGrid onSelectFlow={handleSelectFlow} />
    </div>
  );
}
