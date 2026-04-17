"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { TarjetaClaveAction } from "@/src/types/tarjeta-clave";

const COPY: Record<TarjetaClaveAction, { title: string; description: string }> =
  {
    asignar: {
      title: "Confirmar Asignación de Clave",
      description: "Estás a punto de asignar una nueva clave para tu tarjeta.",
    },
    cambiar: {
      title: "Confirmar Cambio de Clave",
      description: "Estás a punto de cambiar la clave de tu tarjeta.",
    },
    olvide: {
      title: "Confirmar Cambio por Olvido de Clave",
      description: "Estás a punto de cambiar la clave de tu tarjeta.",
    },
  };

interface TarjetaClaveConfirmationCardProps {
  mode: TarjetaClaveAction;
}

export const TarjetaClaveConfirmationCard: React.FC<
  TarjetaClaveConfirmationCardProps
> = ({ mode }) => {
  const { title, description } = COPY[mode];
  return (
    <Card className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">{title}</h2>
        <p className="text-[14px] text-brand-text-black mt-2">{description}</p>
      </div>
    </Card>
  );
};
