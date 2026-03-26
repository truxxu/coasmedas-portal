"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { ScheduleTransferForm, ScheduleSuccessModal } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  mockScheduleSourceAccounts,
  mockScheduleDestinationAccounts,
} from "@/src/mocks";

export default function ProgramarNuevoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setWelcomeBar({
      title: "Programar Nuevo",
      backHref: "/transferencias/programar",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  const handleModalAccept = () => {
    setShowSuccessModal(false);
    router.push("/transferencias/programar");
  };

  const handleBack = () => {
    router.push("/transferencias/programar");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Programación", "Programar Nuevo"]} />
      </div>

      {/* Form */}
      <ScheduleTransferForm
        sourceAccounts={mockScheduleSourceAccounts}
        destinationAccounts={mockScheduleDestinationAccounts}
        hideBalances={hideBalances}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />

      {/* Success Modal */}
      <ScheduleSuccessModal
        isOpen={showSuccessModal}
        onAccept={handleModalAccept}
      />
    </div>
  );
}
