"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { CardActionOptionCard } from "@/src/molecules";

interface TarjetaClaveActionsCardProps {
  onAsignar: () => void;
  onCambiar: () => void;
  onOlvide: () => void;
}

export function TarjetaClaveActionsCard({
  onAsignar,
  onCambiar,
  onOlvide,
}: TarjetaClaveActionsCardProps) {
  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-[20px] font-bold text-brand-navy">
          Gestión de Clave de Tarjeta de Crédito
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Selecciona la acción que deseas realizar. Por tu seguridad, te
          pediremos validaciones adicionales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardActionOptionCard
          title="Asignar Clave"
          description="Para tarjetas nuevas que nunca han tenido clave."
          onClick={onAsignar}
        />
        <CardActionOptionCard
          title="Cambiar Clave"
          description="Si conoces tu clave actual y deseas cambiarla."
          onClick={onCambiar}
        />
        <CardActionOptionCard
          title="Olvidé Clave"
          description="Si no recuerdas tu clave y necesitas una nueva."
          onClick={onOlvide}
        />
      </div>
    </Card>
  );
}
