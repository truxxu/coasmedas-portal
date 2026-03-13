"use client";

import { useEffect, useRef } from "react";

interface ScheduleSuccessModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function ScheduleSuccessModal({
  isOpen,
  onAccept,
}: ScheduleSuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    acceptButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onAccept();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, onAccept]);

  // Prevent body scroll when modal is open
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onAccept}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-[15px] p-8 max-w-md w-full mx-4 text-center"
      >
        <h2
          id="schedule-modal-title"
          className="text-[20px] font-bold text-[#005066] mb-3"
        >
          Programación Nueva
        </h2>

        <p className="text-[15px] text-black mb-6">
          ¡Programación creada con éxito!
        </p>

        <button
          ref={acceptButtonRef}
          type="button"
          onClick={onAccept}
          className="bg-[#00B8ED] text-white rounded-md px-8 py-2 text-sm font-bold hover:bg-[#009bcc] transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
