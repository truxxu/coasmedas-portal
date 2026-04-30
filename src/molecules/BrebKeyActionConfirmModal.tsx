"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/src/atoms";

export type BrebKeyAction = "bloquear" | "activar" | "cancelar";

interface BrebKeyActionConfirmModalProps {
  isOpen: boolean;
  action: BrebKeyAction;
  keyTypeLabel: string;
  keyValue: string;
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
  onConfirm,
  onCancel,
}: BrebKeyActionConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        onClick={onCancel}
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
            className="flex-1 h-10 bg-brand-border hover:bg-brand-gray-low text-brand-text-black"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            className={
              isDestructive
                ? "flex-1 h-10 bg-[#FF0D00] hover:bg-[#d70b00] text-white"
                : "flex-1 h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
