"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { BrebQrScannerCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { mockBrebQrDecodedPayload } from "@/src/mocks";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function BrebQrPaymentPage() {
  const router = useRouter();
  useBrebPageHeader("Pagar con QR", "/bre-b");

  const handleScan = () => {
    sessionStorage.setItem(
      BREB_SESSION_KEYS.qrPayment.decoded,
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

      <BrebQrScannerCard
        onScan={handleScan}
        onGenerate={() => router.push("/bre-b/generar-qr")}
      />

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
