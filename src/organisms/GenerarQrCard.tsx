"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CurrencyInput } from "@/src/atoms";
import { SelectField } from "@/src/molecules";
import { brebGenerateQrSchema } from "@/src/schemas/brebGenerateQrSchema";
import {
  buildMockBrebQrPayload,
  getBrebGenerateQrSourceAccountOptions,
} from "@/src/mocks";
import type { BrebGenerateQrFormData, BrebGeneratedQr } from "@/src/types";
import { formatCurrency } from "@/src/utils";

interface GenerarQrCardProps {
  defaultSourceAccountId?: string;
}

const QR_PLACEHOLDER_SVG = (
  payload: string,
) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <rect width="320" height="320" fill="#ffffff"/>
  <rect x="20" y="20" width="280" height="280" fill="none" stroke="#005066" stroke-width="2"/>
  <text x="160" y="160" text-anchor="middle" dominant-baseline="middle" fill="#005066" font-family="Arial, sans-serif" font-size="20" font-weight="700">Código QR</text>
  <text x="160" y="190" text-anchor="middle" dominant-baseline="middle" fill="#58585B" font-family="Arial, sans-serif" font-size="10">${payload}</text>
</svg>`;

export function GenerarQrCard({ defaultSourceAccountId }: GenerarQrCardProps) {
  const sourceAccountOptions = useMemo(
    () => getBrebGenerateQrSourceAccountOptions(),
    [],
  );
  const [generated, setGenerated] = useState<BrebGeneratedQr | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BrebGenerateQrFormData>({
    resolver: yupResolver(brebGenerateQrSchema),
    defaultValues: {
      sourceAccountId:
        defaultSourceAccountId ?? sourceAccountOptions[0]?.value ?? "",
      amount: 0,
    },
  });

  const onSubmit = (data: BrebGenerateQrFormData) => {
    setShareMessage(null);
    setGenerated(buildMockBrebQrPayload(data));
  };

  const handleDownload = () => {
    if (!generated) return;
    const svg = QR_PLACEHOLDER_SVG(generated.payload);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-coasmedas.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!generated) return;
    const shareData = {
      title: "Código QR Coasmedas",
      text: `Pago vía Bre-B Coasmedas${
        generated.amount > 0 ? ` por ${formatCurrency(generated.amount)}` : ""
      }`,
    };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share(shareData);
        setShareMessage(null);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generated.payload);
        setShareMessage("Código copiado al portapapeles.");
        return;
      }
      setShareMessage("Compartir no está disponible en este navegador.");
    } catch {
      setShareMessage("No se pudo compartir el código.");
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-lg font-bold text-brand-navy">
            Generar Código QR para Recibir Pagos
          </h2>

          <SelectField
            label="Recibir en la cuenta"
            {...register("sourceAccountId")}
            options={sourceAccountOptions}
            placeholder="Seleccione.."
            error={errors.sourceAccountId?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-brand-text-black mb-2">
              Monto (Opcional)
            </label>
            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <CurrencyInput
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  className="w-full"
                  hasError={!!errors.amount}
                />
              )}
            />
            {errors.amount?.message ? (
              <p className="mt-1 text-sm text-brand-error">
                {errors.amount.message}
              </p>
            ) : (
              <p className="mt-2 text-xs text-brand-text-black">
                Si dejas el monto en 0, la persona que escanee el QR podrá
                ingresarlo.
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Generar QR
          </Button>
        </form>

        <div className="bg-brand-gray-light rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
          <div
            className="w-full max-w-[280px] aspect-square bg-white border border-brand-gray-low rounded-lg flex items-center justify-center text-brand-navy text-[16px] font-medium"
            aria-label={
              generated ? "Código QR generado" : "Vista previa del Código QR"
            }
          >
            {generated ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
                <span className="font-bold">Código QR</span>
                <span className="text-xs text-brand-gray-high break-all">
                  {generated.payload}
                </span>
                {generated.amount > 0 && (
                  <span className="text-sm text-brand-text-black mt-1">
                    Monto: {formatCurrency(generated.amount)}
                  </span>
                )}
              </div>
            ) : (
              <span>Código QR</span>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownload}
              disabled={!generated}
            >
              Descargar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleShare}
              disabled={!generated}
            >
              Compartir
            </Button>
          </div>

          {shareMessage && (
            <p className="text-xs text-brand-text-black text-center">
              {shareMessage}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
