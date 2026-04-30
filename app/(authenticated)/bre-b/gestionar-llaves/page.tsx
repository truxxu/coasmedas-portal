"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumbs,
  BrebKeyActionConfirmModal,
  BrebKeyActionSuccessModal,
  type BrebKeyAction,
} from "@/src/molecules";
import { BrebKeysListCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  BREB_KEY_TYPE_LABELS,
  mockRegisteredKeys,
} from "@/src/mocks/mockBrebKeyRegistrationData";
import type { BrebRegisteredKey } from "@/src/types/brebKeyRegistration";

export default function GestionarLlavesPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [keys, setKeys] = useState<BrebRegisteredKey[]>(mockRegisteredKeys);
  const [confirmModal, setConfirmModal] = useState<{
    action: BrebKeyAction;
    keyId: string;
  } | null>(null);
  const [successAction, setSuccessAction] = useState<BrebKeyAction | null>(
    null,
  );

  useEffect(() => {
    setWelcomeBar({
      title: "Gestionar Llaves",
      backHref: "/bre-b",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const confirmTarget = useMemo(() => {
    if (!confirmModal) return null;
    return keys.find((k) => k.id === confirmModal.keyId) ?? null;
  }, [confirmModal, keys]);

  const handleRegisterNewKey = () => {
    router.push("/bre-b/gestionar-llaves/registrar");
  };

  const handleModifyKey = (keyId: string) => {
    router.push(`/bre-b/gestionar-llaves/modificar?id=${keyId}`);
  };

  const handleToggleBlockKey = (keyId: string) => {
    const target = keys.find((k) => k.id === keyId);
    if (!target) return;
    setConfirmModal({
      action: target.status === "activa" ? "bloquear" : "activar",
      keyId,
    });
  };

  const handleCancelKey = (keyId: string) => {
    setConfirmModal({ action: "cancelar", keyId });
  };

  const handleConfirm = () => {
    if (!confirmModal) return;
    const { action, keyId } = confirmModal;

    setKeys((prev) => {
      if (action === "cancelar") {
        return prev.filter((k) => k.id !== keyId);
      }
      return prev.map((k) =>
        k.id === keyId
          ? { ...k, status: k.status === "activa" ? "bloqueada" : "activa" }
          : k,
      );
    });
    setConfirmModal(null);
    setSuccessAction(action);
  };

  const handleCancelModal = () => setConfirmModal(null);
  const handleSuccessAccept = () => setSuccessAction(null);

  const handleBack = () => {
    router.push("/bre-b");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Gestionar Llaves"]} />
      </div>

      <BrebKeysListCard
        keys={keys}
        onRegisterNewKey={handleRegisterNewKey}
        onModifyKey={handleModifyKey}
        onToggleBlockKey={handleToggleBlockKey}
        onCancelKey={handleCancelKey}
      />

      <div className="flex justify-start items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
      </div>

      <BrebKeyActionConfirmModal
        isOpen={Boolean(confirmModal && confirmTarget)}
        action={confirmModal?.action ?? "bloquear"}
        keyTypeLabel={
          confirmTarget ? BREB_KEY_TYPE_LABELS[confirmTarget.type] : ""
        }
        keyValue={confirmTarget?.value ?? ""}
        onConfirm={handleConfirm}
        onCancel={handleCancelModal}
      />

      <BrebKeyActionSuccessModal
        isOpen={successAction !== null}
        action={successAction ?? "bloquear"}
        onAccept={handleSuccessAccept}
      />
    </div>
  );
}
