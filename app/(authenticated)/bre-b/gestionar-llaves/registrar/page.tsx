"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import {
  BrebKeyRegistrationDetailsCard,
  type BrebRegistrationAccountOption,
} from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { useUserContext } from "@/src/contexts";
import { listBrebAccounts } from "@/services";
import { describeBrebAccount, maskNumber } from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import {
  BREB_KEY_REGISTRATION_STEPS,
  generateRandomBrebKey,
  mockBrebKeyRegistrationDefaults,
} from "@/src/mocks";
import type {
  BrebKeyRegistrationFormData,
  BrebKeyType,
} from "@/src/types/brebKeyRegistration";
import type { BrebAccount } from "@/types/api/breb";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function RegistrarLlaveDetallePage() {
  const router = useRouter();
  useBrebPageHeader("Registrar Llave", "/bre-b/gestionar-llaves");
  const { user } = useUserContext();

  const [keyType, setKeyType] = useState<BrebKeyType | "">("");
  const [keyValue, setKeyValue] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState<BrebAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Keep raw API accounts indexed for downstream lookup of source-account fields.
  const rawAccountsRef = useRef<Map<string, BrebAccount>>(new Map());

  useEffect(() => {
    if (!user?.documentType || !user?.documentNumber) return;
    let cancelled = false;
    setLoadingAccounts(true);
    setLoadError(null);
    listBrebAccounts({
      documentType: user.documentType,
      documentNumber: user.documentNumber,
    })
      .then((res) => {
        if (cancelled) return;
        rawAccountsRef.current = new Map(res.map((a) => [a.numeroCuenta, a]));
        setAccounts(res);
        setAccountId((prev) => prev || res[0]?.numeroCuenta || "");
      })
      .catch((e) => {
        if (cancelled) return;
        setLoadError(
          e instanceof ApiError
            ? e.message
            : "No se pudieron cargar las cuentas. Intente nuevamente.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingAccounts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.documentType, user?.documentNumber]);

  const accountOptions = useMemo<BrebRegistrationAccountOption[]>(
    () =>
      accounts.map((a) => ({
        id: a.numeroCuenta,
        label: `${a.nombreProducto || a.aliasCuenta || "Cuenta"} (${maskNumber(a.numeroCuenta)})`,
      })),
    [accounts],
  );

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
    const account = rawAccountsRef.current.get(accountId);
    if (!account) {
      setError("La cuenta seleccionada no es válida");
      return;
    }

    const form: BrebKeyRegistrationFormData = {
      keyType,
      keyValue,
      accountId,
      sourceNumberAccount: account.numeroCuenta,
      sourceTypeAccount: account.tipoCuenta,
      sourceSubTypeAccount: account.subtipoCuenta,
      sourceTypeAccountDescription:
        account.nombreProducto?.trim() ||
        describeBrebAccount(account.tipoCuenta, account.subtipoCuenta),
    };
    sessionStorage.setItem(
      BREB_SESSION_KEYS.keyRegistration.form,
      JSON.stringify(form),
    );
    router.push("/bre-b/gestionar-llaves/registrar/confirmacion");
  };

  const handleBack = () => {
    router.push("/bre-b/gestionar-llaves");
  };

  const isFormValid = Boolean(
    keyType && keyValue && accountId && !loadingAccounts,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Gestión Llaves", "Registrar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={BREB_KEY_REGISTRATION_STEPS} />
      </div>

      {loadError && (
        <div
          role="alert"
          className="rounded-md border border-brand-error bg-brand-danger-bg px-4 py-3 text-sm text-brand-error"
        >
          {loadError}
        </div>
      )}

      <BrebKeyRegistrationDetailsCard
        keyType={keyType}
        keyValue={keyValue}
        accountId={accountId}
        accounts={accountOptions}
        loadingAccounts={loadingAccounts}
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
