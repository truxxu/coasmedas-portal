"use client";

import { Card, ErrorIcon, SuccessIcon } from "@/src/atoms";
import type { BrebKeyModificationResult } from "@/src/types/brebKeyModification";

interface BrebKeyModificationResultCardProps {
  result: BrebKeyModificationResult;
}

export function BrebKeyModificationResultCard({
  result,
}: BrebKeyModificationResultCardProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        {result.success ? <SuccessIcon size="md" /> : <ErrorIcon size="md" />}
        <h2 className="text-[23px] font-bold text-brand-navy">
          {result.success ? "Transacción Exitosa" : "Transacción Fallida"}
        </h2>
        <p className="text-[15px] text-brand-gray-high max-w-[560px]">
          {result.message ??
            (result.success
              ? "Tu nueva Llave ha sido modificada con éxito."
              : "No fue posible modificar tu llave. Por favor intenta nuevamente.")}
        </p>
      </div>
    </Card>
  );
}
