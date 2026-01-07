"use client";

import React, { useEffect } from "react";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";
import { OBLIGACION_PAYMENT_STEPS } from "@/src/mocks/mockObligacionPaymentData";

export default function PSEPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();

  const { message } = usePSERedirect({
    sessionKey: "obligacionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/obligaciones",
    successPath: "/pagos/pagar-mis-productos/obligaciones/resultado",
  });

  const breadcrumbItems = [
    "Inicio",
    "Pagos",
    "Pagar mis productos",
    "Pago de Obligaciones",
  ];

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos/obligaciones",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />
      <Stepper currentStep={3} steps={OBLIGACION_PAYMENT_STEPS} />
      <PSELoadingCard message={message} />
    </div>
  );
}
