"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyTransferDetailsCard } from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import { useBrebPageHeader } from "@/src/hooks";
import { listBrebAccounts, resolveBrebKey } from "@/services";
import {
  buildBrebDeviceContext,
  describeBrebAccount,
  maskNumber,
} from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import { BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";
import type {
  BrebResolvedDestination,
  BrebSourceAccount,
} from "@/src/types/brebKeyTransfer";
import type { BrebAccount } from "@/types/api/breb";

export default function BrebKeyTransferPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();
  useBrebPageHeader("Pagar con Llave", "/bre-b");

  const [accounts, setAccounts] = useState<BrebAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const rawAccountsRef = useRef<Map<string, BrebAccount>>(new Map());

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [destinationKey, setDestinationKey] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState(false);

  // Load real source accounts.
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
        setSelectedSourceId((prev) => prev || res[0]?.numeroCuenta || "");
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

  const sourceAccountOptions = useMemo<BrebSourceAccount[]>(
    () =>
      accounts.map((a) => ({
        id: a.numeroCuenta,
        type:
          a.nombreProducto?.trim() ||
          a.aliasCuenta?.trim() ||
          describeBrebAccount(a.tipoCuenta, a.subtipoCuenta),
        balance: 0,
        maskedNumber: maskNumber(a.numeroCuenta),
      })),
    [accounts],
  );

  const handleConfirm = async () => {
    setError("");

    if (!user) {
      setError("Sesión no válida. Inicie sesión nuevamente.");
      return;
    }
    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
      return;
    }
    if (!destinationKey.trim()) {
      setError("Por favor ingresa la llave del destinatario");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a enviar");
      return;
    }

    const account = rawAccountsRef.current.get(selectedSourceId);
    if (!account) {
      setError("La cuenta seleccionada no es válida");
      return;
    }

    setResolving(true);
    try {
      const ctx = buildBrebDeviceContext(user);
      const res = await resolveBrebKey({
        ...ctx,
        valueKeyCustomer: destinationKey.trim(),
      });
      const matched =
        res.keysCustomers.find(
          (k) => k.valueKeyCustomer === destinationKey.trim(),
        ) ?? res.keysCustomers[0];
      if (!matched) {
        setError("La llave ingresada no es válida o no se pudo verificar.");
        return;
      }

      const resolved: BrebResolvedDestination = {
        firstName: res.firstName,
        surname: res.surname,
        identification: res.identification,
        typeIdentification: res.typeIdentification,
        key: matched,
      };

      sessionStorage.setItem(
        BREB_SESSION_KEYS.keyTransfer.sourceId,
        selectedSourceId,
      );
      sessionStorage.setItem(
        BREB_SESSION_KEYS.keyTransfer.sourceAccount,
        JSON.stringify(account),
      );
      sessionStorage.setItem(
        BREB_SESSION_KEYS.keyTransfer.destinationKey,
        destinationKey.trim(),
      );
      sessionStorage.setItem(BREB_SESSION_KEYS.keyTransfer.amount, amount);
      sessionStorage.setItem(
        BREB_SESSION_KEYS.keyTransfer.resolvedKey,
        JSON.stringify(resolved),
      );

      router.push("/bre-b/pagar-transferir-llave/confirmacion");
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "La llave ingresada no es válida o no se pudo verificar.",
      );
    } finally {
      setResolving(false);
    }
  };

  const handleBack = () => {
    router.push("/bre-b");
  };

  const isFormValid =
    !loadingAccounts &&
    !resolving &&
    selectedSourceId &&
    destinationKey.trim() &&
    amount &&
    Number(amount) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={BREB_KEY_TRANSFER_STEPS} />
      </div>

      {loadError && (
        <div
          role="alert"
          className="rounded-md border border-[#FF0D00] bg-[#FFEBEE] px-4 py-3 text-sm text-[#FF0D00]"
        >
          {loadError}
        </div>
      )}

      <BrebKeyTransferDetailsCard
        sourceAccounts={sourceAccountOptions}
        selectedSourceId={selectedSourceId}
        destinationKey={destinationKey}
        amount={amount}
        onSourceChange={setSelectedSourceId}
        onDestinationKeyChange={setDestinationKey}
        onAmountChange={setAmount}
        hideBalances={hideBalances}
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
          onClick={handleConfirm}
          disabled={!isFormValid}
        >
          {resolving ? "Validando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
