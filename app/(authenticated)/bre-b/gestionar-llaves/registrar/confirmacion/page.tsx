"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyRegistrationConfirmationCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import {
  BREB_KEY_REGISTRATION_STEPS,
  BREB_KEY_TYPE_LABELS,
  mockBrebRegistrationAccounts,
} from "@/src/mocks";
import type {
  BrebKeyRegistrationConfirmationData,
  BrebKeyRegistrationFormData,
} from "@/src/types/brebKeyRegistration";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function RegistrarLlaveConfirmacionPage() {
  const router = useRouter();
  useBrebPageHeader("Registrar Llave", "/bre-b/gestionar-llaves/registrar");

  const [data] = useState<BrebKeyRegistrationConfirmationData | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(BREB_SESSION_KEYS.keyRegistration.form);
    if (!raw) return null;
    let form: BrebKeyRegistrationFormData;
    try {
      form = JSON.parse(raw) as BrebKeyRegistrationFormData;
    } catch {
      return null;
    }
    if (!form.keyType) return null;
    const account = mockBrebRegistrationAccounts.find(
      (a) => a.id === form.accountId,
    );
    if (!account) return null;
    return {
      keyType: form.keyType,
      keyTypeLabel: BREB_KEY_TYPE_LABELS[form.keyType],
      keyValue: form.keyValue,
      accountLabel: account.label,
    };
  });

  useEffect(() => {
    if (!data) {
      router.push("/bre-b/gestionar-llaves/registrar");
    }
  }, [data, router]);

  const handleConfirm = () => {
    if (!data) return;
    sessionStorage.setItem(
      BREB_SESSION_KEYS.keyRegistration.confirmation,
      JSON.stringify(data),
    );
    router.push("/bre-b/gestionar-llaves/registrar/sms");
  };

  const handleBack = () => {
    router.push("/bre-b/gestionar-llaves/registrar");
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
        <Breadcrumbs items={["Inicio", "Gestión Llaves", "Registrar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={BREB_KEY_REGISTRATION_STEPS} />
      </div>

      <BrebKeyRegistrationConfirmationCard data={data} />

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
