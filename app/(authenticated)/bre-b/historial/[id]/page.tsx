"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, BrebReversalConfirmModal } from "@/src/molecules";
import {
  BrebTransactionDetailCard,
  BrebReversalSuccessModal,
} from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { useUserContext } from "@/src/contexts";
import { listBrebTxs } from "@/services";
import {
  buildBrebDeviceContext,
  buildDateRangeParams,
  mapBrebTxMovementToUi,
} from "@/src/utils";
import type { BrebTransaction } from "@/src/types/brebTransactionHistory";
import { BREB_HISTORIAL_CACHE_KEY } from "@/src/constants/brebSessionKeys";

type ModalState = "none" | "confirm" | "success";

function readCachedTransaction(id: string): BrebTransaction | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(BREB_HISTORIAL_CACHE_KEY);
    if (!raw) return null;
    const list: BrebTransaction[] = JSON.parse(raw);
    return list.find((t) => t.id === id) ?? null;
  } catch {
    return null;
  }
}

export default function HistorialBrebDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  useBrebPageHeader("Detalle de Transacción", "/bre-b/historial");
  const { user } = useUserContext();

  const id = useMemo(() => {
    const raw = params?.id;
    if (!raw) return "";
    return decodeURIComponent(Array.isArray(raw) ? raw[0] : raw);
  }, [params]);

  const [transaction, setTransaction] = useState<BrebTransaction | null>(() =>
    readCachedTransaction(id),
  );
  const [modal, setModal] = useState<ModalState>("none");

  // If not in cache (e.g. user landed here via direct URL / refresh), refetch
  // the widest window and look up by id.
  useEffect(() => {
    if (!id || transaction || !user) return;
    let cancelled = false;
    const ctx = buildBrebDeviceContext(user);
    const dateParams = buildDateRangeParams("todos");
    listBrebTxs({
      documentType: ctx.documentType,
      documentNumber: ctx.documentNumber,
      ...dateParams,
    })
      .then((res) => {
        if (cancelled) return;
        const mapped = res.movements
          .map((m) => mapBrebTxMovementToUi(m, ctx.documentNumber))
          .filter((x): x is BrebTransaction => x !== null);
        try {
          sessionStorage.setItem(
            BREB_HISTORIAL_CACHE_KEY,
            JSON.stringify(mapped),
          );
        } catch {
          // sessionStorage may be unavailable (private mode, quota).
        }
        const found = mapped.find((t) => t.id === id);
        if (found) {
          setTransaction(found);
        } else {
          router.replace("/bre-b/historial");
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/bre-b/historial");
      });
    return () => {
      cancelled = true;
    };
  }, [id, transaction, user, router]);

  const handleRequestReversal = useCallback(() => setModal("confirm"), []);
  const handleCancelConfirm = useCallback(() => setModal("none"), []);

  const handleConfirm = useCallback(() => {
    // TODO: wire to backend reversal endpoint.
    if (transaction) {
      setTransaction({ ...transaction, status: "revision_en_curso" });
    }
    setModal("success");
  }, [transaction]);

  const handleSuccessAccept = useCallback(() => {
    setModal("none");
    router.push("/bre-b/historial");
  }, [router]);

  const handleDownloadReceipt = useCallback(() => {
    // TODO: hook into receipt generation.
  }, []);

  if (!transaction) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Historial Bre-B", "Detalle de Transacción"]}
        />
      </div>

      <BrebTransactionDetailCard
        transaction={transaction}
        onRequestReversal={handleRequestReversal}
        onDownloadReceipt={handleDownloadReceipt}
      />

      <div className="flex justify-start">
        <button
          onClick={() => router.push("/bre-b/historial")}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
      </div>

      <BrebReversalConfirmModal
        isOpen={modal === "confirm"}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />

      <BrebReversalSuccessModal
        isOpen={modal === "success"}
        onAccept={handleSuccessAccept}
      />
    </div>
  );
}
