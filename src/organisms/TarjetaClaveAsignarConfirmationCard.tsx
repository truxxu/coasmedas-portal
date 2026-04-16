"use client";

import React from "react";
import { Card } from "@/src/atoms";

export const TarjetaClaveAsignarConfirmationCard: React.FC = () => {
  return (
    <Card className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmar Asignación de Clave
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Estás a punto de asignar una nueva clave para tu tarjeta.
        </p>
      </div>
    </Card>
  );
};
