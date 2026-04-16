"use client";

import React from "react";
import { Card } from "@/src/atoms";

export const TarjetaClaveOlvideConfirmationCard: React.FC = () => {
  return (
    <Card className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmar Cambio por Olvido de Clave
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Estás a punto de cambiar la clave de tu tarjeta.
        </p>
      </div>
    </Card>
  );
};
