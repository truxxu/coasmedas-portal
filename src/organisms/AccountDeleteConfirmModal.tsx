"use client";

import { useRef } from "react";
import { Button } from "@/src/atoms";
import { useModalA11y } from "@/src/hooks";

interface AccountDeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AccountDeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: AccountDeleteConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useModalA11y({
    isOpen,
    onClose: onCancel,
    containerRef: modalRef,
    initialFocusRef: cancelButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        {/* Title */}
        <h2
          id="delete-modal-title"
          className="text-xl font-bold text-brand-navy-blue mb-3"
        >
          Borrar cuenta inscrita
        </h2>

        {/* Message */}
        <p className="text-sm text-brand-gray-high mb-6">
          Esta seguro que desea borrar esta cuenta?
        </p>

        {/* Actions */}
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
            className="flex-1 h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
