"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  UtilityPaymentConfirmationCard,
} from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { mockRegisteredServices, UTILITY_PAYMENT_STEPS } from "@/src/mocks";
import type {
  UtilityPaymentDetails,
  UtilityPaymentConfirmation,
} from "@/src/types";

export default function PagarServiciosConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [confirmation, setConfirmation] =
    useState<UtilityPaymentConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const detailsStr = sessionStorage.getItem("utilityPaymentDetails");
    if (!detailsStr) {
      router.push("/pagos/servicios-publicos/pagar/detalle");
      return;
    }

    const details: UtilityPaymentDetails = JSON.parse(detailsStr);

    let serviceToPay = "";
    let invoiceReference = "";

    if (details.paymentType === "no-inscrito") {
      serviceToPay = details.convenioName || "";
      invoiceReference = details.reference || "";
    } else {
      const service = mockRegisteredServices.find(
        (s) => s.id === details.serviceId,
      );
      serviceToPay = service
        ? `${service.provider} - ${service.serviceType}`
        : "";
      invoiceReference = service?.reference || "";
    }

    const confirmationData: UtilityPaymentConfirmation = {
      holderName: "CAMILO ANDRES CRUZ",
      holderDocument: "CC 1.***.***234",
      serviceToPay,
      invoiceReference,
      productToDebit:
        details.sourceAccountDisplay.split(" - ")[0] || "Cuenta de Ahorros",
      totalAmount: details.amount,
    };

    setConfirmation(confirmationData);
  }, [router]);

  const handleConfirm = async () => {
    if (!confirmation) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "utilityPaymentConfirmation",
        JSON.stringify(confirmation),
      );

      const detailsStr = sessionStorage.getItem("utilityPaymentDetails");
      const details: UtilityPaymentDetails | null = detailsStr
        ? JSON.parse(detailsStr)
        : null;
      const isPSE = details?.paymentMethod === "pse";

      if (isPSE) {
        router.push("/pagos/servicios-publicos/pagar/pse");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/pagos/servicios-publicos/pagar/codigo-sms");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Pagos", "Pago Servicio Publico"]}
      welcomeBarTitle="Pago de Servicios Públicos"
      welcomeBarBackHref="/pagos/servicios-publicos/pagar/detalle"
      fallbackPath="/pagos/servicios-publicos/pagar/detalle"
      steps={UTILITY_PAYMENT_STEPS}
      hasData={!!confirmation}
      isSubmitting={isLoading}
      submittingLabel="Procesando..."
      onBack={() => router.push("/pagos/servicios-publicos/pagar/detalle")}
      onConfirm={handleConfirm}
    >
      {confirmation && (
        <UtilityPaymentConfirmationCard
          confirmation={confirmation}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
