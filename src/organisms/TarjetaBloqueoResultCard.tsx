"use client";

import React from "react";
import { Card, Divider, ErrorIcon, SuccessIcon } from "@/src/atoms";
import { TarjetaBloqueoResult } from "@/src/types/tarjeta-bloqueo";

interface TarjetaBloqueoResultCardProps {
  result: TarjetaBloqueoResult;
}

export const TarjetaBloqueoResultCard: React.FC<
  TarjetaBloqueoResultCardProps
> = ({ result }) => {
  const isSuccess = result.status === "success";

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-col items-center gap-4">
        {isSuccess ? <SuccessIcon size="md" /> : <ErrorIcon size="md" />}
        <h2 className="text-[22px] font-bold text-brand-navy text-center">
          {isSuccess ? "¡Tarjeta Bloqueada!" : "No pudimos bloquear tu tarjeta"}
        </h2>
        <p className="text-[14px] text-brand-navy text-center">
          {isSuccess
            ? "Tu tarjeta ha sido bloqueada exitosamente."
            : (result.descripcion ??
              "Ocurrió un error al bloquear la tarjeta. Intenta nuevamente.")}
        </p>
      </div>

      {isSuccess && (
        <div
          role="note"
          className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-3"
        >
          <p className="text-[14px] font-bold text-[#cc7900]">
            Siguiente paso: Para solicitar una nueva tarjeta, por favor
            comunícate con nuestra línea de atención o acércate a una de
            nuestras oficinas.
          </p>
        </div>
      )}

      <div className="flex flex-col items-center gap-1 text-[14px]">
        <p className="text-brand-navy">
          ¿Sospechas de fraude?{" "}
          <button
            type="button"
            className="font-bold text-brand-navy hover:underline"
          >
            Bloquea tu tarjeta aquí.
          </button>
        </p>
        <p className="text-brand-navy">
          Ver{" "}
          <button
            type="button"
            className="font-bold text-brand-navy hover:underline"
          >
            Guía de Uso de la Tarjeta
          </button>
        </p>
      </div>
    </Card>
  );
};
