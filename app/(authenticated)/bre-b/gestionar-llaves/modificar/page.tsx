"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import {
  BrebKeyModificationDetailsCard,
  type BrebModificationAccountOption,
} from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { useUserContext } from "@/src/contexts";
import { listBrebAccounts, listBrebKeys } from "@/services";
import {
  buildBrebDeviceContext,
  describeBrebAccount,
  mapBrebKeyToUi,
  maskNumber,
} from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import {
  BREB_KEY_MODIFICATION_STEPS,
  generateRandomBrebKey,
  mockBrebKeyRegistrationDefaults,
} from "@/src/mocks";
import type {
  BrebKeyType,
  BrebRegisteredKey,
} from "@/src/types/brebKeyRegistration";
import type { BrebKeyModificationFormData } from "@/src/types/brebKeyModification";
import type { BrebAccount, BrebKey } from "@/types/api/breb";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

function ModificarLlaveDetallePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useBrebPageHeader("Modificar Llave", "/bre-b/gestionar-llaves");
  const { user } = useUserContext();

  const idKeyCustomer = searchParams.get("id") ?? "";

  const [currentApiKey, setCurrentApiKey] = useState<BrebKey | null>(null);
  const [currentKey, setCurrentKey] = useState<BrebRegisteredKey | null>(null);
  const [loadingKey, setLoadingKey] = useState(true);

  const [accounts, setAccounts] = useState<BrebAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const rawAccountsRef = useRef<Map<string, BrebAccount>>(new Map());

  const [keyType, setKeyType] = useState<BrebKeyType | "">("");
  const [keyValue, setKeyValue] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !idKeyCustomer) return;
    let cancelled = false;
    listBrebKeys(buildBrebDeviceContext(user))
      .then((res) => {
        if (cancelled) return;
        const apiKey = res.keysCustomers.find(
          (k) => k.idKeyCustomer === idKeyCustomer,
        );
        if (!apiKey) {
          router.replace("/bre-b/gestionar-llaves");
          return;
        }
        setCurrentApiKey(apiKey);
        setCurrentKey(mapBrebKeyToUi(apiKey));
        setLoadError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setLoadError(
          e instanceof ApiError
            ? e.message
            : "No se pudo cargar la llave. Intente nuevamente.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingKey(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, idKeyCustomer, router]);

  useEffect(() => {
    if (!idKeyCustomer) {
      router.replace("/bre-b/gestionar-llaves");
    }
  }, [idKeyCustomer, router]);

  useEffect(() => {
    if (!user?.documentType || !user?.documentNumber) return;
    let cancelled = false;
    listBrebAccounts({
      documentType: user.documentType,
      documentNumber: user.documentNumber,
    })
      .then((res) => {
        if (cancelled) return;
        rawAccountsRef.current = new Map(res.map((a) => [a.numeroCuenta, a]));
        setAccounts(res);
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

  // Default account selection: prefer the one currently associated with the
  // key. Runs once accounts and key are both available; user input wins.
  useEffect(() => {
    if (accounts.length === 0) return;
    setAccountId((prev) => {
      if (prev) return prev;
      const associated = currentApiKey?.numberAccount;
      if (associated && rawAccountsRef.current.has(associated)) {
        return associated;
      }
      return accounts[0]?.numeroCuenta || "";
    });
  }, [accounts, currentApiKey?.numberAccount]);

  const accountOptions = useMemo<BrebModificationAccountOption[]>(
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
    if (!currentKey) return;
    if (!keyType) {
      setError("Por favor selecciona un tipo de llave");
      return;
    }
    if (!keyValue) {
      setError("La llave registrada no es válida");
      return;
    }
    if (keyType === currentKey.type && keyValue === currentKey.value) {
      setError("Selecciona una llave diferente a la actual.");
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

    const accountOption = accountOptions.find((o) => o.id === accountId);
    const form: BrebKeyModificationFormData = {
      idKeyCustomer: currentKey.id,
      currentKeyType: currentKey.type,
      currentKeyValue: currentKey.value,
      newKeyType: keyType,
      newKeyValue: keyValue,
      accountId,
      accountLabel: accountOption?.label ?? "",
      sourceNumberAccount: account.numeroCuenta,
      sourceTypeAccount: account.tipoCuenta,
      sourceSubTypeAccount: account.subtipoCuenta,
      sourceTypeAccountDescription:
        account.nombreProducto?.trim() ||
        describeBrebAccount(account.tipoCuenta, account.subtipoCuenta),
    };
    sessionStorage.setItem(
      BREB_SESSION_KEYS.keyModification.form,
      JSON.stringify(form),
    );
    router.push("/bre-b/gestionar-llaves/modificar/confirmacion");
  };

  const handleBack = () => {
    router.push("/bre-b/gestionar-llaves");
  };

  const isFormValid = Boolean(
    currentKey && keyType && keyValue && accountId && !loadingAccounts,
  );

  if (loadingKey || !currentKey) {
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
        <Stepper currentStep={1} steps={BREB_KEY_MODIFICATION_STEPS} />
      </div>

      {loadError && (
        <div
          role="alert"
          className="rounded-md border border-brand-error bg-brand-danger-bg px-4 py-3 text-sm text-brand-error"
        >
          {loadError}
        </div>
      )}

      <BrebKeyModificationDetailsCard
        currentKey={currentKey}
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
