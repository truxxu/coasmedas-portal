"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { BrebKeysListCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockRegisteredKeys } from "@/src/mocks";

export default function GestionarLlavesPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Gestionar Llaves",
      backHref: "/bre-b",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleRegisterNewKey = () => {
    router.push("/bre-b/gestionar-llaves/registrar");
  };

  const handleBack = () => {
    router.push("/bre-b");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Gestionar Llaves"]} />
      </div>

      <BrebKeysListCard
        keys={mockRegisteredKeys}
        onRegisterNewKey={handleRegisterNewKey}
      />

      <div className="flex justify-start items-center">
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
