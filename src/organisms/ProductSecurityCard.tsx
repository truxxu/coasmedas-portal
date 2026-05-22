"use client";

import { ProductSecurityRow } from "@/src/molecules";
import { useUser } from "@/src/hooks";
import type { ProductSecurityItem } from "@/src/types";

interface ProductSecurityCardProps {
  products: ProductSecurityItem[];
  onToggleRequest: (id: string, nextChecked: boolean) => void;
}

export function ProductSecurityCard({
  products,
  onToggleRequest,
}: ProductSecurityCardProps) {
  const user = useUser();
  const userName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "asociado";

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-brand-gray-low/60">
      <h2 className="text-[22px] font-bold text-brand-navy">
        Gestión de Seguridad
      </h2>
      <p className="text-sm text-brand-gray-high mt-2">
        Hola {userName.toUpperCase()}, en este módulo puedes activar y
        desactivar tus productos. Los productos bloqueados no se podrán
        utilizar.
      </p>

      <div className="mt-4">
        {products.map((item, idx) => (
          <ProductSecurityRow
            key={item.id}
            item={item}
            onToggleRequest={onToggleRequest}
            showDivider={idx < products.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
