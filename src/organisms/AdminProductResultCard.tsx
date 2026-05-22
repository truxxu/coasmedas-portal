"use client";

import { Button, Card, ErrorIcon, SuccessIcon } from "@/src/atoms";
import { formatCurrency } from "@/src/utils";
import type { AdminProduct } from "@/src/types";
import type { AdminProductoFormValues } from "@/src/schemas/adminProductoSchema";

interface AdminProductResultCardProps {
  status: "success" | "error";
  product: AdminProduct;
  data?: AdminProductoFormValues;
  onBackToList: () => void;
  onBackToHome: () => void;
  onRetry?: () => void;
}

export function AdminProductResultCard({
  status,
  product,
  data,
  onBackToList,
  onBackToHome,
  onRetry,
}: AdminProductResultCardProps) {
  if (status === "error") {
    return (
      <Card className="p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="flex justify-center">
          <ErrorIcon />
        </div>
        <h2 className="text-xl font-bold text-brand-error">
          No fue posible guardar tus cambios
        </h2>
        <p className="text-md text-brand-gray-high">
          Ocurrió un error al actualizar los límites. Por favor intenta
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

  const limits = data?.globalLimits ?? product.globalLimits;

  return (
    <Card className="p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4">
      <div className="flex justify-center">
        <SuccessIcon />
      </div>
      <h2 className="text-xl font-bold text-brand-primary">
        ¡Tus nuevos límites han sido guardados!
      </h2>
      <p className="text-md text-brand-gray-high">
        Los cambios para {product.displayName} ya están activos.
      </p>

      <div className="text-left border border-brand-border rounded-md p-4 bg-gray-50 space-y-2">
        <p className="text-md font-medium text-brand-primary">
          Resumen de límites globales
        </p>
        <div className="grid grid-cols-2 gap-3 text-md text-brand-text-secondary">
          <div>
            <p className="font-medium">Transacciones</p>
            <p>Diarias: {limits.transactions.daily}</p>
            <p>Semanales: {limits.transactions.weekly}</p>
            <p>Mensuales: {limits.transactions.monthly}</p>
          </div>
          <div>
            <p className="font-medium">Monto</p>
            <p>Diarias: {formatCurrency(limits.amounts.daily)}</p>
            <p>Semanales: {formatCurrency(limits.amounts.weekly)}</p>
            <p>Mensuales: {formatCurrency(limits.amounts.monthly)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Button variant="secondary" onClick={onBackToHome}>
          Volver al inicio
        </Button>
        <Button variant="primary" onClick={onBackToList}>
          Volver a Administración de Productos
        </Button>
      </div>
    </Card>
  );
}
