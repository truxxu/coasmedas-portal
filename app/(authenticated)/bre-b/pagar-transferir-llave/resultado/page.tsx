"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyTransferResultCard } from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import { useBrebPageHeader } from "@/src/hooks";
import { getBrebTxStatus } from "@/services";
import {
  buildBrebDeviceContext,
  formatNowDate,
  formatNowTime,
} from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import type {
  BrebKeyTransferConfirmationData,
  BrebKeyTransferResult,
} from "@/src/types/brebKeyTransfer";
import type { BrebTxState } from "@/types/api/breb";
import { BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";
import {
  BREB_SESSION_KEYS,
  clearBrebFlow,
} from "@/src/constants/brebSessionKeys";

const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 10; // 20s wall-clock at 2s interval
const TERMINAL_STATES: ReadonlySet<BrebTxState> = new Set<BrebTxState>([
  "STTL",
  "RTRN",
  "CNCL",
  "TIMEOUT",
]);

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function BrebKeyTransferResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();
  useBrebPageHeader("Pagar con Llave");

  const [result, setResult] = useState<BrebKeyTransferResult | null>(null);
  const [polling, setPolling] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const paymentId = sessionStorage.getItem(
      BREB_SESSION_KEYS.keyTransfer.paymentId,
    );
    const persistedResult = readJson<BrebKeyTransferResult>(
      BREB_SESSION_KEYS.keyTransfer.result,
    );
    const confirmation = readJson<BrebKeyTransferConfirmationData>(
      BREB_SESSION_KEYS.keyTransfer.confirmation,
    );

    // No active transaction — render previously persisted result, or bail out.
    if (!paymentId) {
      if (persistedResult) {
        setResult(persistedResult);
      } else {
        router.push("/bre-b/pagar-transferir-llave");
      }
      return;
    }

    if (!confirmation) {
      router.push("/bre-b/pagar-transferir-llave");
      return;
    }
    // Wait for the user context to hydrate before polling.
    if (!user) {
      return;
    }

    setPolling(true);

    const finalize = (final: BrebKeyTransferResult) => {
      if (cancelledRef.current) return;
      sessionStorage.setItem(
        BREB_SESSION_KEYS.keyTransfer.result,
        JSON.stringify(final),
      );
      sessionStorage.removeItem(BREB_SESSION_KEYS.keyTransfer.paymentId);
      setResult(final);
      setPolling(false);
    };

    const buildResultFromState = (
      state: BrebTxState,
      description?: string,
    ): BrebKeyTransferResult => {
      const isSuccess = state === "STTL";
      return {
        status: isSuccess ? "success" : "error",
        destinationHolder: confirmation.destinationHolder,
        destinationKey: confirmation.destinationKey,
        amount: confirmation.amount,
        sourceAccount: confirmation.sourceProduct,
        transactionDate: formatNowDate(),
        transactionTime: formatNowTime(),
        referenceNumber: paymentId,
        stateCode: state,
        paymentId,
        errorMessage: isSuccess
          ? undefined
          : description ||
            (state === "TIMEOUT"
              ? "La transacción está tomando más tiempo del esperado. Consulta el estado en el historial."
              : "La transacción no pudo completarse."),
      };
    };

    let attempts = 0;
    const ctx = buildBrebDeviceContext(user);
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      if (cancelledRef.current) return;
      attempts += 1;
      try {
        const res = await getBrebTxStatus({ ...ctx, paymentId });
        if (cancelledRef.current) return;
        const state = res.stateCodePayment;
        if (TERMINAL_STATES.has(state)) {
          finalize(
            buildResultFromState(
              state,
              res.statePaymentDescription || res.stateDescriptionCustomer,
            ),
          );
          return;
        }
      } catch (e) {
        // Transient errors are tolerated until the timeout budget is spent.
        if (attempts >= POLL_MAX_ATTEMPTS) {
          const message =
            e instanceof ApiError
              ? e.message
              : "No se pudo consultar el estado de la transacción.";
          finalize(buildResultFromState("TIMEOUT", message));
          return;
        }
      }

      if (attempts >= POLL_MAX_ATTEMPTS) {
        finalize(buildResultFromState("TIMEOUT"));
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();

    return () => {
      cancelledRef.current = true;
      if (timer) clearTimeout(timer);
    };
    // user is captured by closure for buildBrebDeviceContext; re-poll only
    // when the logged-in identity changes, not when context rehydrates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, user?.documentNumber]);

  const clearSessionStorage = () => clearBrebFlow("keyTransfer");

  const handleDownload = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearSessionStorage();
    router.push("/bre-b/pagar-transferir-llave");
  };

  const handleFinish = () => {
    clearSessionStorage();
    router.push("/home");
  };

  const handleRetry = () => {
    sessionStorage.removeItem(BREB_SESSION_KEYS.keyTransfer.confirmation);
    sessionStorage.removeItem(BREB_SESSION_KEYS.keyTransfer.result);
    sessionStorage.removeItem(BREB_SESSION_KEYS.keyTransfer.paymentId);
    router.push("/bre-b/pagar-transferir-llave");
  };

  if (polling || !result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
        </div>

        <div className="-mx-8 bg-white shadow-sm">
          <Stepper currentStep={5} steps={BREB_KEY_TRANSFER_STEPS} />
        </div>

        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-text-black text-base">
            Procesando transacción...
          </p>
          <p className="text-brand-gray-medium text-sm text-center max-w-md">
            Estamos confirmando el estado de tu pago. Esto puede tardar unos
            segundos.
          </p>
        </div>
      </div>
    );
  }

  const isSuccess = result.status === "success";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={BREB_KEY_TRANSFER_STEPS} />
      </div>

      <BrebKeyTransferResultCard result={result} hideBalances={hideBalances} />

      <div className="flex flex-wrap justify-end gap-3">
        {isSuccess ? (
          <>
            <Button variant="secondary" onClick={handleDownload}>
              Descargar Comprobante
            </Button>
            <Button variant="secondary" onClick={handleNewTransaction}>
              Realizar otra transacción Bre-B
            </Button>
            <Button variant="primary" onClick={handleFinish}>
              Finalizar
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleRetry}>
              Reintentar
            </Button>
            <Button variant="primary" onClick={handleFinish}>
              Volver al inicio
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
