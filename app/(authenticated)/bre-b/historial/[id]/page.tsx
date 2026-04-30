"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, BrebReversalConfirmModal } from "@/src/molecules";
import {
  BrebTransactionDetailCard,
  BrebReversalSuccessModal,
} from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import {
  markBrebTransactionUnderReview,
  mockBrebTransactions,
} from "@/src/mocks/mockBrebTransactionHistoryData";
import type { BrebTransaction } from "@/src/types/brebTransactionHistory";

type ModalState = "none" | "confirm" | "success";

export default function HistorialBrebDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  useBrebPageHeader("Detalle de Transacción", "/bre-b/historial");

  const id = useMemo(() => {
    const raw = params?.id;
    if (!raw) return "";
    return decodeURIComponent(Array.isArray(raw) ? raw[0] : raw);
  }, [params]);

  const initialTransaction = useMemo<BrebTransaction | null>(() => {
    return mockBrebTransactions.find((t) => t.id === id) ?? null;
  }, [id]);

  const [transaction, setTransaction] = useState<BrebTransaction | null>(
    initialTransaction,
  );
  const [modal, setModal] = useState<ModalState>("none");

  useEffect(() => {
    if (!initialTransaction) {
      router.replace("/bre-b/historial");
    }
  }, [initialTransaction, router]);

  if (!transaction) return null;

  const handleRequestReversal = () => setModal("confirm");
  const handleCancelConfirm = () => setModal("none");

  const handleConfirm = () => {
    markBrebTransactionUnderReview(transaction.id);
    setTransaction({ ...transaction, status: "revision_en_curso" });
    setModal("success");
  };

  const handleSuccessAccept = () => {
    setModal("none");
    router.push("/bre-b/historial");
  };

  const handleDownloadReceipt = () => {
    // TODO: hook into receipt generation; mock no-op for now.
  };

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
