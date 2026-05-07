"use client";

import { Card, SuccessIcon } from "@/src/atoms";
import type { BrebKeyRegistrationResult } from "@/src/types/brebKeyRegistration";

interface BrebKeyRegistrationResultCardProps {
  result: BrebKeyRegistrationResult;
}

export function BrebKeyRegistrationResultCard({
  result,
}: BrebKeyRegistrationResultCardProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <SuccessIcon size="md" />
        <h2 className="text-[23px] font-bold text-brand-navy">
          ¡Registro Exitoso!
        </h2>
        <p className="text-[15px] text-brand-gray-high max-w-[560px]">
          {result.message ??
            `Tu Llave '${result.keyValue}' fue registrada y estará activa en máximo 2 horas.`}
        </p>
      </div>
    </Card>
  );
}
