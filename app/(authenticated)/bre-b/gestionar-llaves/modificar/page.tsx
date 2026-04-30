"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyModificationDetailsCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  BREB_KEY_MODIFICATION_STEPS,
  mockBrebAvailableNewKeys,
  mockBrebKeysInUseElsewhere,
  mockBrebRegistrationAccounts,
  mockRegisteredKeys,
} from "@/src/mocks";
import type { BrebKeyModificationFormData } from "@/src/types/brebKeyModification";

function ModificarLlaveDetallePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const keyId = searchParams.get("id") ?? "";
  const currentKey = useMemo(
    () => mockRegisteredKeys.find((k) => k.id === keyId),
    [keyId],
  );

  const [selectedNewKeyId, setSelectedNewKeyId] = useState("");
  const [accountId, setAccountId] = useState(
    mockBrebRegistrationAccounts[0]?.id ?? "",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "Modificar Llave",
      backHref: "/bre-b/gestionar-llaves",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!currentKey) {
      router.replace("/bre-b/gestionar-llaves");
      return;
    }
    const raw = sessionStorage.getItem("brebKeyModificationForm");
    if (!raw) return;
    try {
      const stored = JSON.parse(raw) as BrebKeyModificationFormData;
      if (stored.currentKeyId === currentKey.id) {
        setSelectedNewKeyId(stored.newKeyId);
        setAccountId(stored.accountId);
      }
    } catch {
      // ignore
    }
  }, [currentKey, router]);

  if (!currentKey) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando...</span>
      </div>
    );
  }

  const selectedKey = mockBrebAvailableNewKeys.find(
    (k) => k.id === selectedNewKeyId,
  );
  const isSelectedSameAsCurrent =
    selectedKey !== undefined &&
    selectedKey.value === currentKey.value &&
    selectedKey.type === currentKey.type;

  const isFormValid = Boolean(
    selectedNewKeyId && !isSelectedSameAsCurrent && accountId,
  );

  const handleSelectNewKey = (id: string) => {
    setSelectedNewKeyId(id);
    setError("");
  };

  const handleAccountChange = (id: string) => {
    setAccountId(id);
    setError("");
  };

  const handleContinue = () => {
    setError("");
    if (!selectedNewKeyId) {
      setError("Selecciona una llave nueva.");
      return;
    }
    if (isSelectedSameAsCurrent) {
      setError("Selecciona una llave diferente a la actual.");
      return;
    }
    if (!accountId) {
      setError("Selecciona una cuenta a asociar.");
      return;
    }
    if (!selectedKey) return;

    const form: BrebKeyModificationFormData = {
      currentKeyId: currentKey.id,
      newKeyId: selectedKey.id,
      newKeyType: selectedKey.type,
      newKeyValue: selectedKey.value,
      accountId,
    };
    sessionStorage.setItem("brebKeyModificationForm", JSON.stringify(form));
    router.push("/bre-b/gestionar-llaves/modificar/confirmacion");
  };

  const handleBack = () => {
    router.push("/bre-b/gestionar-llaves");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Modificar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={BREB_KEY_MODIFICATION_STEPS} />
      </div>

      <BrebKeyModificationDetailsCard
        currentKey={currentKey}
        availableKeys={mockBrebAvailableNewKeys}
        keysInUseElsewhere={mockBrebKeysInUseElsewhere}
        accountOptions={mockBrebRegistrationAccounts}
        selectedNewKeyId={selectedNewKeyId}
        accountId={accountId}
        onSelectNewKey={handleSelectNewKey}
        onAccountChange={handleAccountChange}
        error={error}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={!isFormValid}
        >
          Modificar Llave
        </Button>
      </div>
    </div>
  );
}

export default function ModificarLlaveDetallePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <span className="text-brand-gray-medium">Cargando...</span>
        </div>
      }
    >
      <ModificarLlaveDetallePageInner />
    </Suspense>
  );
}
