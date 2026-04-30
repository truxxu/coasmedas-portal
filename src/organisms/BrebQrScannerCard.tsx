"use client";

import { useRef } from "react";
import { Button, Card } from "@/src/atoms";

interface BrebQrScannerCardProps {
  onScan: () => void;
}

export function BrebQrScannerCard({ onScan }: BrebQrScannerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onScan();
    }
    e.target.value = "";
  };

  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Pagar con Código QR
        </h2>
        <p className="text-[14px] text-brand-text-black">
          Escanea el código QR para iniciar el pago. También puedes generar tu
          propio código para recibir dinero.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onScan}
            aria-label="Simular escaneo de QR"
            className="relative w-full aspect-square max-w-[280px] bg-black rounded-lg flex items-center justify-center text-white text-[13px] font-medium overflow-hidden"
          >
            <span className="absolute inset-4 border-2 border-white/40 rounded-md" />
            <span className="relative">[Simulación de Cámara]</span>
          </button>
          <button
            type="button"
            onClick={handleFileClick}
            className="text-[14px] font-bold text-brand-navy hover:underline"
          >
            Escanear desde archivo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="bg-brand-gray-light rounded-2xl p-6 flex flex-col justify-center gap-4 items-center">
          <h3 className="text-[16px] font-bold text-brand-navy">
            ¿Necesitas recibir un pago?
          </h3>
          <p className="text-[14px] text-brand-text-black">
            Genera tu propio código QR para que otros te paguen fácilmente.
          </p>
          <div>
            <Button variant="primary" disabled>
              Generar mi QR
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
