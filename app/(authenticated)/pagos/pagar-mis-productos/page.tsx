"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { PaymentOptionsGrid } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

export default function PagarMisProductosPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pagar mis productos",
      backHref: "/home",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleOptionClick = (optionId: string) => {
    // TODO: Navigate to payment flow when routes are defined
    console.log(`Payment option selected: ${optionId}`);
    // Example: router.push(`/pagos/pagar-mis-productos/${optionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={["Inicio", "Pagos", "Pagar mis productos"]} />

      {/* White Container for Main Content */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {/* Section Heading */}
        <div className="space-y-3 mb-8">
          <h2 className="text-[21px] font-bold text-brand-navy text-center">
            Pago mis productos
          </h2>
          <p className="text-[15px] text-gray-900 text-center">
            ¿Qué producto deseas pagar hoy?
          </p>
        </div>

        {/* Payment Options Grid */}
        <PaymentOptionsGrid onOptionClick={handleOptionClick} />
      </div>
    </div>
  );
}
