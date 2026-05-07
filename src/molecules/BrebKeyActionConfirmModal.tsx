"use client";

import { useRef } from "react";
import { Button } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

export type BrebKeyAction = "bloquear" | "activar" | "cancelar";

interface BrebKeyActionConfirmModalProps {
  isOpen: boolean;
  action: BrebKeyAction;
  keyTypeLabel: string;
  keyValue: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const COPY: Record<
  BrebKeyAction,
  { title: string; message: string; confirmLabel: string }
> = {
  bloquear: {
    title: "Bloquear llave",
    message:
      "¿Está seguro que desea bloquear esta llave? No podrá recibir pagos hasta activarla nuevamente.",
    confirmLabel: "Bloquear",
  },
  activar: {
    title: "Activar llave",
    message: "¿Está seguro que desea activar esta llave?",
    confirmLabel: "Activar",
  },
  cancelar: {
    title: "Cancelar llave",
    message:
      "Esta acción es irreversible. ¿Está seguro que desea cancelar esta llave? Una vez cancelada deberá registrarla nuevamente.",
    confirmLabel: "Cancelar llave",
  },
};

export function BrebKeyActionConfirmModal({
  isOpen,
  action,
  keyTypeLabel,
  keyValue,
  pending = false,
  onConfirm,
  onCancel,
}: BrebKeyActionConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onCancel,
    containerRef: modalRef,
    initialFocusRef: cancelButtonRef,
  });

  if (!isOpen) return null;

  const { title, message, confirmLabel } = COPY[action];
  const isDestructive = action === "cancelar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breb-key-confirm-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={pending ? undefined : onCancel}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        <h2
          id="breb-key-confirm-title"
          className="text-xl font-bold text-brand-navy-blue mb-3"
        >
          {title}
        </h2>

        <p className="text-sm text-brand-gray-high mb-2">{message}</p>
        <p className="text-sm font-medium text-brand-text-black mb-6">
          {keyTypeLabel}: {keyValue}
        </p>

        <div className="flex gap-3">
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={pending}
            className="flex-1 h-10 bg-brand-border hover:bg-brand-gray-low text-brand-text-black"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            disabled={pending}
            aria-busy={pending}
            className={
              isDestructive
                ? "flex-1 h-10 bg-brand-error hover:bg-brand-error-dark text-white"
                : "flex-1 h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
            }
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                  aria-hidden="true"
                />
                Procesando...
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
