"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, ErrorIcon, SuccessIcon } from "@/src/atoms";
import { TarjetaClaveOlvideResult } from "@/src/types/tarjeta-clave";

interface TarjetaClaveOlvideResultCardProps {
  result: TarjetaClaveOlvideResult;
}

export const TarjetaClaveOlvideResultCard: React.FC<
  TarjetaClaveOlvideResultCardProps
> = ({ result }) => {
  const router = useRouter();
  const isSuccess = result.status === "success";

  const handleBlockCard = () => {
    router.push("/tarjeta/bloqueo-activacion");
  };

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-col items-center gap-4">
        {isSuccess ? <SuccessIcon size="md" /> : <ErrorIcon size="md" />}
        <h2 className="text-[22px] font-bold text-brand-navy text-center">
          {isSuccess ? "¡Clave Actualizada!" : "No pudimos recuperar tu clave"}
        </h2>
        <p className="text-[14px] text-brand-navy text-center">
          {isSuccess
            ? "Tu clave ha sido actualizada exitosamente."
            : (result.descripcion ??
              "Ocurrió un error al recuperar la clave. Intenta nuevamente.")}
        </p>
      </div>

      {isSuccess && (
        <>
          <div
            role="note"
            className="rounded-lg border border-brand-navy bg-[#f0faff] px-4 py-3"
          >
            <p className="text-[14px] text-brand-navy">
              <span className="font-bold">Recomendación de seguridad: </span>
              Nunca compartas tu clave con nadie. Cámbiala periódicamente y
              evita combinaciones predecibles.
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 text-[14px]">
            <p className="text-brand-navy">
              ¿Sospechas de fraude?{" "}
              <button
                type="button"
                onClick={handleBlockCard}
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
        </>
      )}
    </Card>
  );
};
