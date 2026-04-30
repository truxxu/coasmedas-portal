"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyRegistrationDetailsCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  BREB_KEY_REGISTRATION_STEPS,
  generateRandomBrebKey,
  mockBrebKeyRegistrationDefaults,
  mockBrebRegistrationAccounts,
} from "@/src/mocks";
import type {
  BrebKeyRegistrationFormData,
  BrebKeyType,
} from "@/src/types/brebKeyRegistration";

export default function RegistrarLlaveDetallePage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [keyType, setKeyType] = useState<BrebKeyType | "">("");
  const [keyValue, setKeyValue] = useState("");
  const [accountId, setAccountId] = useState(
    mockBrebRegistrationAccounts[0]?.id ?? "",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "Registrar Llave",
      backHref: "/bre-b/gestionar-llaves",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleKeyTypeChange = (value: BrebKeyType | "") => {
    setKeyType(value);
    setError("");
    if (value === "") {
      setKeyValue("");
      return;
    }
    if (value === "aleatoria") {
      setKeyValue(generateRandomBrebKey());
    } else {
      setKeyValue(mockBrebKeyRegistrationDefaults[value]);
    }
  };

  const handleContinue = () => {
    setError("");
    if (!keyType) {
      setError("Por favor selecciona un tipo de llave");
      return;
    }
    if (!keyValue) {
      setError("La llave registrada no es válida");
      return;
    }
    if (!accountId) {
      setError("Por favor selecciona una cuenta a asociar");
      return;
    }

    const form: BrebKeyRegistrationFormData = {
      keyType,
      keyValue,
      accountId,
    };
    sessionStorage.setItem("brebKeyRegistrationForm", JSON.stringify(form));
    router.push("/bre-b/gestionar-llaves/registrar/confirmacion");
  };

  const handleBack = () => {
    router.push("/bre-b/gestionar-llaves");
  };

  const isFormValid = Boolean(keyType && keyValue && accountId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Gestión Llaves", "Registrar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={BREB_KEY_REGISTRATION_STEPS} />
      </div>

      <BrebKeyRegistrationDetailsCard
        keyType={keyType}
        keyValue={keyValue}
        accountId={accountId}
        onKeyTypeChange={handleKeyTypeChange}
        onAccountChange={setAccountId}
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
          Continuar
        </Button>
      </div>
    </div>
  );
}
