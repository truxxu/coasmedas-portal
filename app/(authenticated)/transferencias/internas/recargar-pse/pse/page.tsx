"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockPSERechargeAccounts,
  mockPSERechargeResultSuccess,
  TRANSFER_STEPS,
} from "@/src/mocks";
import type { PSERechargeResult } from "@/src/types/pseRecharge";

export default function PSEPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Recargar con PSE",
      backHref: "/transferencias/internas/recargar-pse",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Verify we have the required data
    const destinationId = sessionStorage.getItem("pseRechargeDestinationId");
    const amount = sessionStorage.getItem("pseRechargeAmount");

    if (!destinationId || !amount) {
      router.push("/transferencias/internas/recargar-pse");
      return;
    }

    const destination = mockPSERechargeAccounts.find(
      (acc) => acc.id === destinationId
    );

    if (!destination) {
      router.push("/transferencias/internas/recargar-pse");
      return;
    }

    // Simulate PSE redirect and response
    const timer = setTimeout(() => {
      // Generate result based on mock data
      const result: PSERechargeResult = {
        ...mockPSERechargeResultSuccess,
        productRecharged: `${destination.name} (${destination.maskedNumber})`,
        amountRecharged: Number(amount),
      };

      // Store result for the next page
      sessionStorage.setItem(
        "pseRechargeTransactionResult",
        JSON.stringify(result)
      );

      // Navigate to result page
      router.push("/transferencias/internas/recargar-pse/resultado");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Recargar con PSE"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={TRANSFER_STEPS} />
      </div>

      {/* PSE Loading Card */}
      <PSELoadingCard message="Redirigiendo al portal de PSE..." />
    </div>
  );
}
