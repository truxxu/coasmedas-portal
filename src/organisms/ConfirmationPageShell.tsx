"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { useWelcomeBar } from "@/src/contexts";
import type { Step } from "@/src/types/stepper";

export interface ConfirmationPageShellProps {
  breadcrumbs: string[];
  welcomeBarTitle: string;
  welcomeBarBackHref: string;
  fallbackPath: string;
  steps: Step[];
  stepperCurrentStep?: number;
  hasData: boolean;
  isSubmitting?: boolean;
  confirmLabel?: string;
  submittingLabel?: string;
  volverColorClass?: string;
  onBack: () => void;
  onConfirm: () => void | Promise<void>;
  children: ReactNode;
}

export function ConfirmationPageShell({
  breadcrumbs,
  welcomeBarTitle,
  welcomeBarBackHref,
  fallbackPath,
  steps,
  stepperCurrentStep = 2,
  hasData,
  isSubmitting = false,
  confirmLabel = "Confirmar Pago",
  submittingLabel = "Enviando...",
  volverColorClass = "text-brand-teal-dark",
  onBack,
  onConfirm,
  children,
}: ConfirmationPageShellProps) {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: welcomeBarTitle,
      backHref: welcomeBarBackHref,
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar, welcomeBarTitle, welcomeBarBackHref]);

  useEffect(() => {
    if (!hasData) {
      router.push(fallbackPath);
    }
  }, [hasData, router, fallbackPath]);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={stepperCurrentStep} steps={steps} />
      </div>

      {children}

      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className={`text-sm font-medium hover:underline disabled:opacity-50 ${volverColorClass}`}
        >
          Volver
        </button>
        <Button variant="primary" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : confirmLabel}
        </Button>
      </div>
    </div>
  );
}
