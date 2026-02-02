"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CuentasMiRedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to the details page
    router.replace("/transferencias/cuentas-mi-red/detalle");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-12">
      <span className="text-gray-500">Cargando...</span>
    </div>
  );
}
