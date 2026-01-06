"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { BeneficiarySelectionCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockRegisteredBeneficiaries } from "@/src/mocks";
import { RegisteredBeneficiary } from "@/src/types";

export default function OtrosAsociadosPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
      backHref: "/pagos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBeneficiarySelect = (beneficiary: RegisteredBeneficiary) => {
    // Store selected beneficiary in sessionStorage
    sessionStorage.setItem(
      "otrosAsociadosBeneficiary",
      JSON.stringify(beneficiary)
    );

    // Navigate to payment flow
    router.push("/pagos/otros-asociados/pago");
  };

  const handleBack = () => {
    router.push("/pagos");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Pagos", "Pago a otros asociados"]} />

      <BeneficiarySelectionCard
        beneficiaries={mockRegisteredBeneficiaries}
        onSelect={handleBeneficiarySelect}
      />
    </div>
  );
}
