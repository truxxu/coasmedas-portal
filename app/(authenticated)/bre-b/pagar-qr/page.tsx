"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { BrebQrScannerCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockBrebQrDecodedPayload } from "@/src/mocks";

export default function BrebQrPaymentPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Pagar con QR",
      backHref: "/bre-b",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleScan = () => {
    sessionStorage.setItem(
      "brebQrDecoded",
      JSON.stringify(mockBrebQrDecodedPayload),
    );
    router.push("/bre-b/pagar-qr/detalle");
  };

  const handleBack = () => {
    router.push("/bre-b");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con QR"]} />
      </div>

      <BrebQrScannerCard onScan={handleScan} />

      <div className="flex justify-start items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
