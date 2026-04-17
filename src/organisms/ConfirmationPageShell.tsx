"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { useWelcomeBar } from "@/src/contexts";
import type { Step } from "@/src/types/stepper";

export type VolverStyle = "link" | "ghost";

export interface ConfirmationPageShellProps {
  breadcrumbs: string[];
  welcomeBarTitle: string;
  welcomeBarBackHref: string;
  fallbackPath: string;
  steps?: Step[];
  stepperCurrentStep?: number;
  showStepper?: boolean;
  hasData: boolean;
  isSubmitting?: boolean;
  confirmDisabled?: boolean;
  confirmLabel?: string;
  submittingLabel?: string;
  volverStyle?: VolverStyle;
  volverColorClass?: string;
  noDataFallback?: ReactNode;
  breadcrumbsWrapped?: boolean;
  onBack: () => void;
  onConfirm: () => void | Promise<void>;
  children: ReactNode;
}

const DEFAULT_LOADING = (
  <div className="flex items-center justify-center py-12">
    <span className="text-brand-gray-medium">Cargando...</span>
  </div>
);

export function ConfirmationPageShell({
  breadcrumbs,
  welcomeBarTitle,
  welcomeBarBackHref,
  fallbackPath,
  steps,
  stepperCurrentStep = 2,
  showStepper = true,
  hasData,
  isSubmitting = false,
  confirmDisabled = false,
  confirmLabel = "Confirmar Pago",
  submittingLabel = "Enviando...",
  volverStyle = "link",
  volverColorClass = "text-brand-teal-dark",
  noDataFallback = DEFAULT_LOADING,
  breadcrumbsWrapped = true,
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
    return <>{noDataFallback}</>;
  }

  const breadcrumbsNode = <Breadcrumbs items={breadcrumbs} />;

  return (
    <div className="space-y-6">
      {breadcrumbsWrapped ? (
        <div className="flex items-center justify-between">
          {breadcrumbsNode}
        </div>
      ) : (
        breadcrumbsNode
      )}

      {showStepper && steps && (
        <div className="-mx-8 bg-white shadow-sm">
          <Stepper currentStep={stepperCurrentStep} steps={steps} />
        </div>
      )}

      {children}

      <div
        className={
          volverStyle === "ghost"
            ? "flex justify-between"
            : "flex justify-between items-center"
        }
      >
        {volverStyle === "ghost" ? (
          <Button variant="ghost" onClick={onBack} disabled={isSubmitting}>
            Volver
          </Button>
        ) : (
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className={`text-sm font-medium hover:underline disabled:opacity-50 ${volverColorClass}`}
          >
            Volver
          </button>
        )}
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isSubmitting || confirmDisabled}
        >
          {isSubmitting ? submittingLabel : confirmLabel}
        </Button>
      </div>
    </div>
  );
}
