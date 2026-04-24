"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, ErrorMessage } from "@/src/atoms";
import { FormField } from "@/src/molecules";
import {
  createPocketSchema,
  CreatePocketFormData,
} from "@/src/schemas/createPocketSchema";

interface CreatePocketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nombreBolsillo: string) => Promise<void>;
  submitting?: boolean;
  error?: string | null;
}

export function CreatePocketModal({
  isOpen,
  onClose,
  onSubmit,
  submitting = false,
  error = null,
}: CreatePocketModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreatePocketFormData>({
    resolver: yupResolver(createPocketSchema),
    mode: "onChange",
    defaultValues: { nombreBolsillo: "" },
  });

  const { ref: registerRef, ...nombreRegister } = register("nombreBolsillo");

  useEffect(() => {
    if (isOpen) {
      reset({ nombreBolsillo: "" });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
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
  }, [isOpen, onClose, submitting]);

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

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data.nombreBolsillo.trim());
  });

  const handleBackdropClick = () => {
    if (!submitting) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-pocket-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4"
      >
        <h2
          id="create-pocket-title"
          className="text-xl font-bold text-brand-navy-blue mb-2"
        >
          Crear nuevo bolsillo
        </h2>
        <p className="text-sm text-brand-gray-high mb-6">
          Asigna un nombre para identificar tu nuevo bolsillo.
        </p>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          <FormField
            label="Nombre del bolsillo"
            type="text"
            placeholder="Ej. Vacaciones"
            required
            maxLength={30}
            error={errors.nombreBolsillo?.message}
            disabled={submitting}
            {...nombreRegister}
            ref={(el) => {
              registerRef(el);
              inputRef.current = el;
            }}
          />

          {error && <ErrorMessage message={error} />}

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 h-10 bg-brand-border hover:bg-brand-gray-low text-brand-text-black"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={isValid && !submitting ? "primary" : "disabled"}
              disabled={!isValid || submitting}
              className="flex-1 h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
            >
              {submitting ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
