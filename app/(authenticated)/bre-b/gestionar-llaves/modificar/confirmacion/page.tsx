"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyModificationConfirmationCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import {
  BREB_KEY_MODIFICATION_STEPS,
  BREB_KEY_TYPE_LABELS,
  mockBrebRegistrationAccounts,
  mockRegisteredKeys,
} from "@/src/mocks";
import type {
  BrebKeyModificationConfirmationData,
  BrebKeyModificationFormData,
} from "@/src/types/brebKeyModification";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function ModificarLlaveConfirmacionPage() {
  const router = useRouter();
  useBrebPageHeader("Modificar Llave", "/bre-b/gestionar-llaves/modificar");

  const [data] = useState<BrebKeyModificationConfirmationData | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(BREB_SESSION_KEYS.keyModification.form);
    if (!raw) return null;
    let form: BrebKeyModificationFormData;
    try {
      form = JSON.parse(raw) as BrebKeyModificationFormData;
    } catch {
      return null;
    }
    const currentKey = mockRegisteredKeys.find(
      (k) => k.id === form.currentKeyId,
    );
    const account = mockBrebRegistrationAccounts.find(
      (a) => a.id === form.accountId,
    );
    if (!currentKey || !account) return null;
    return {
      currentKeyTypeLabel: BREB_KEY_TYPE_LABELS[currentKey.type],
      currentKeyValue: currentKey.value,
      newKeyTypeLabel: BREB_KEY_TYPE_LABELS[form.newKeyType],
      newKeyValue: form.newKeyValue,
      accountLabel: account.label,
    };
  });

  useEffect(() => {
    if (!data) {
      router.push("/bre-b/gestionar-llaves");
    }
  }, [data, router]);

  const handleConfirm = () => {
    if (!data) return;
    sessionStorage.setItem(
      BREB_SESSION_KEYS.keyModification.confirmation,
      JSON.stringify(data),
    );
    router.push("/bre-b/gestionar-llaves/modificar/sms");
  };

  const handleBack = () => {
    router.back();
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Modificar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={BREB_KEY_MODIFICATION_STEPS} />
      </div>

      <BrebKeyModificationConfirmationCard data={data} />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
