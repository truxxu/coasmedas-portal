"use client";

import { Button, Card, ErrorIcon, SuccessIcon } from "@/src/atoms";
import { maskNumber } from "@/src/utils/formatCurrency";
import { formatDateCapitalized } from "@/src/utils/dates";
import type { ProductSecurityDraft } from "@/src/types";

interface ProductSecurityResultCardProps {
  status: "success" | "error";
  draft?: ProductSecurityDraft;
  onBackToList: () => void;
  onBackToHome: () => void;
  onRetry?: () => void;
}

export function ProductSecurityResultCard({
  status,
  draft,
  onBackToList,
  onBackToHome,
  onRetry,
}: ProductSecurityResultCardProps) {
  if (status === "error") {
    return (
      <Card className="p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="flex justify-center">
          <ErrorIcon />
        </div>
        <h2 className="text-xl font-bold text-brand-error">
          No fue posible actualizar la seguridad del producto
        </h2>
        <p className="text-md text-brand-gray-high">
          Ocurrió un error al procesar la solicitud. Por favor intenta
          nuevamente.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="secondary" onClick={onBackToList}>
            Volver
          </Button>
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const action = draft?.action ?? "block";
  const title = action === "block" ? "Bloqueo Exitoso" : "Activación Exitosa";
  const message =
    action === "block"
      ? "Tu producto ha sido bloqueado exitosamente. Recuerda que para utilizar nuevamente tu producto o servicio debes desbloquearlo."
      : "Tu producto ha sido activado exitosamente. Ya puedes utilizarlo normalmente.";
  const statusLabel = draft?.newStatus === "activo" ? "Activo" : "Bloqueado";
  const statusColor =
    draft?.newStatus === "activo"
      ? "text-brand-success-icon"
      : "text-brand-error";

  return (
    <Card className="p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4">
      <div className="flex justify-center">
        <SuccessIcon />
      </div>
      <h2 className="text-xl font-bold text-brand-primary">{title}</h2>
      <p className="text-md text-brand-gray-high">{message}</p>

      {draft && (
        <div className="text-left border border-brand-border rounded-md p-4 bg-gray-50 space-y-2">
          <p className="text-md font-medium text-brand-primary">
            Resumen de la operación
          </p>
          <div className="grid grid-cols-1 gap-1 text-md text-brand-text-secondary">
            <p>
              <span className="font-medium">Producto: </span>
              {draft.title} ({maskNumber(draft.productNumber)})
            </p>
            <p>
              <span className="font-medium">Nuevo estado: </span>
              <span className={statusColor}>{statusLabel}</span>
            </p>
            <p>
              <span className="font-medium">Fecha: </span>
              {formatDateCapitalized(draft.lastUpdate)}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3 pt-2">
        <Button variant="secondary" onClick={onBackToHome}>
          Volver al inicio
        </Button>
        <Button variant="primary" onClick={onBackToList}>
          Volver a Gestión de Productos
        </Button>
      </div>
    </Card>
  );
}
