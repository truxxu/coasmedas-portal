"use client";

import React from "react";
import { Card, ErrorIcon, SuccessIcon } from "@/src/atoms";
import { TarjetaActivacionResult } from "@/src/types/tarjeta-activacion";

interface TarjetaActivacionResultCardProps {
  result: TarjetaActivacionResult;
}

export const TarjetaActivacionResultCard: React.FC<
  TarjetaActivacionResultCardProps
> = ({ result }) => {
  const isSuccess = result.status === "success";

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-col items-center gap-4">
        {isSuccess ? <SuccessIcon size="md" /> : <ErrorIcon size="md" />}
        <h2 className="text-[22px] font-bold text-brand-navy text-center">
          {isSuccess ? "¡Tarjeta Activada!" : "No pudimos activar tu tarjeta"}
        </h2>
        <p className="text-[14px] text-brand-navy text-center">
          {isSuccess
            ? "Tu tarjeta ha sido activada exitosamente."
            : (result.descripcion ??
              "Ocurrió un error al activar la tarjeta. Intenta nuevamente.")}
        </p>
      </div>

      {isSuccess && (
        <div
          role="note"
          className="rounded-lg border border-brand-navy bg-[#f0faff] px-4 py-3"
        >
          <p className="text-[14px] text-brand-navy">
            <span className="font-bold">Recomendación de seguridad: </span>
            Por tu seguridad, te recomendamos cambiar la clave de tu tarjeta y
            nunca compartirla con nadie.
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
