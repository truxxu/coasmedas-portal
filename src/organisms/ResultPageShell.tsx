"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { useWelcomeBar } from "@/src/contexts";
import type { Step } from "@/src/types/stepper";

export interface ResultActionHelpers {
  printSave: () => void;
  clearAndGoToStart: () => void;
  clearAndGoToHome: () => void;
}

export interface ResultPageShellProps {
  breadcrumbs: string[];
  welcomeBarTitle: string;
  welcomeBarBackHref?: string;
  startFlowPath: string;
  homePath?: string;
  sessionKeysToClean: string[];
  steps?: Step[];
  stepperCurrentStep?: number;
  showStepper?: boolean;
  hasResult: boolean;
  hideActions?: boolean;
  newTransactionLabel?: string;
  renderActions?: (helpers: ResultActionHelpers) => ReactNode;
  actionsClassName?: string;
  children: ReactNode;
}

export function ResultPageShell({
  breadcrumbs,
  welcomeBarTitle,
  welcomeBarBackHref,
  startFlowPath,
  homePath = "/home",
  sessionKeysToClean,
  steps,
  stepperCurrentStep = 5,
  showStepper = true,
  hasResult,
  hideActions = false,
  newTransactionLabel = "Realizar otra transaccion",
  renderActions,
  actionsClassName = "flex flex-wrap justify-end gap-3",
  children,
}: ResultPageShellProps) {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({ title: welcomeBarTitle, backHref: welcomeBarBackHref });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar, welcomeBarTitle, welcomeBarBackHref]);

  useEffect(() => {
    if (!hasResult) {
      router.push(startFlowPath);
    }
  }, [hasResult, router, startFlowPath]);

  const clearSessionData = () => {
    for (const key of sessionKeysToClean) {
      sessionStorage.removeItem(key);
    }
  };

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearSessionData();
    router.push(startFlowPath);
  };

  const handleFinish = () => {
    clearSessionData();
    router.push(homePath);
  };

  if (!hasResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {showStepper && steps && (
        <div className="-mx-8 bg-white shadow-sm">
          <Stepper currentStep={stepperCurrentStep} steps={steps} />
        </div>
      )}

      {children}

      {!hideActions && (
        <div className={actionsClassName}>
          {renderActions ? (
            renderActions({
              printSave: handlePrintSave,
              clearAndGoToStart: handleNewTransaction,
              clearAndGoToHome: handleFinish,
            })
          ) : (
            <>
              <Button variant="secondary" onClick={handlePrintSave}>
                Imprimir/Guardar
              </Button>
              <Button variant="secondary" onClick={handleNewTransaction}>
                {newTransactionLabel}
              </Button>
              <Button variant="primary" onClick={handleFinish}>
                Finalizar
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
