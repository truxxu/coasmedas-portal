"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumbs,
  BrebKeyActionConfirmModal,
  BrebKeyActionSuccessModal,
  type BrebKeyAction,
} from "@/src/molecules";
import { BrebKeysListCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { useUserContext } from "@/src/contexts";
import {
  blockBrebKey,
  deleteBrebKey,
  listBrebKeys,
  unblockBrebKey,
} from "@/services";
import {
  buildBrebDeviceContext,
  describeBrebAccount,
  mapBrebKeyToUi,
} from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import { BREB_KEY_TYPE_LABELS } from "@/src/mocks/mockBrebKeyRegistrationData";
import type { BrebRegisteredKey } from "@/src/types/brebKeyRegistration";
import type { BrebKey, KeyMutationRequest } from "@/types/api/breb";

const SUCCESS_STATE_CODE = "U000";

const ACTION_FALLBACK_ERROR: Record<BrebKeyAction, string> = {
  bloquear: "No se pudo bloquear la llave. Intente nuevamente.",
  activar: "No se pudo activar la llave. Intente nuevamente.",
  cancelar: "No se pudo cancelar la llave. Intente nuevamente.",
};

export default function GestionarLlavesPage() {
  const router = useRouter();
  useBrebPageHeader("Gestionar Llaves", "/bre-b");
  const { user } = useUserContext();

  const [keys, setKeys] = useState<BrebRegisteredKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    action: BrebKeyAction;
    keyId: string;
  } | null>(null);
  const [successAction, setSuccessAction] = useState<BrebKeyAction | null>(
    null,
  );

  // Raw API keys retained for building mutation requests (need source account fields).
  const rawKeysRef = useRef<Map<string, BrebKey>>(new Map());

  const fetchKeys = useCallback(async () => {
    if (!user) return;
    const ctx = buildBrebDeviceContext(user);
    const res = await listBrebKeys(ctx);
    rawKeysRef.current = new Map(
      res.keysCustomers.map((k) => [k.idKeyCustomer, k]),
    );
    setKeys(res.keysCustomers.map(mapBrebKeyToUi));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchKeys()
      .catch((e) => {
        if (cancelled) return;
        setError(
          e instanceof ApiError
            ? e.message
            : "No se pudieron cargar las llaves. Intente nuevamente.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, fetchKeys]);

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

  const buildMutationRequest = (apiKey: BrebKey): KeyMutationRequest | null => {
    if (!user) return null;
    const ctx = buildBrebDeviceContext(user);
    return {
      ...ctx,
      idKeyCustomer: apiKey.idKeyCustomer,
      typeKeyCustomer: apiKey.typeKeyCustomer,
      valueKeyCustomer: apiKey.valueKeyCustomer,
      sourceNumberAccount: apiKey.numberAccount,
      sourceTypeAccount: apiKey.typeAccount,
      sourceSubTypeAccount: apiKey.subTypeAccount,
      sourceTypeAccountDescription:
        apiKey.accountDescription?.trim() ||
        describeBrebAccount(apiKey.typeAccount, apiKey.subTypeAccount),
      firstName: user.firstName,
      surName: user.lastName,
    };
  };

  const handleConfirm = async () => {
    if (!confirmModal || actionPending) return;
    const apiKey = rawKeysRef.current.get(confirmModal.keyId);
    if (!apiKey) {
      setConfirmModal(null);
      return;
    }
    const mutation = buildMutationRequest(apiKey);
    if (!mutation) return;

    setActionPending(true);
    setError(null);
    try {
      const res =
        confirmModal.action === "cancelar"
          ? await deleteBrebKey(mutation)
          : confirmModal.action === "bloquear"
            ? await blockBrebKey(mutation)
            : await unblockBrebKey(mutation);
      if (res.stateCode && res.stateCode !== SUCCESS_STATE_CODE) {
        throw new ApiError(
          -1,
          res.stateDescriptionSystem ??
            ACTION_FALLBACK_ERROR[confirmModal.action],
        );
      }
      await fetchKeys();
      setSuccessAction(confirmModal.action);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "No se pudo completar la operación. Intente nuevamente.",
      );
    } finally {
      setActionPending(false);
      setConfirmModal(null);
    }
  };

  const handleCancelModal = () => {
    if (actionPending) return;
    setConfirmModal(null);
  };
  const handleSuccessAccept = () => setSuccessAction(null);

  const handleBack = () => {
    router.push("/bre-b");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Gestionar Llaves"]} />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-[#FF0D00] bg-[#FFEBEE] px-4 py-3 text-sm text-[#FF0D00]"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-sm text-brand-gray-high">
          Cargando llaves...
        </div>
      ) : (
        <BrebKeysListCard
          keys={keys}
          onRegisterNewKey={handleRegisterNewKey}
          onModifyKey={handleModifyKey}
          onToggleBlockKey={handleToggleBlockKey}
          onCancelKey={handleCancelKey}
        />
      )}

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
        pending={actionPending}
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
