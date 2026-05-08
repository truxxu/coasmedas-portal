"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, SuccessIcon, ErrorIcon } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import { useBrebPageHeader } from "@/src/hooks";

const BASE_PATH = "/otros-servicios/datos-personales";
const DRAFT_KEY = "datosPersonalesDraft";
const STATUS_KEY = "datosPersonalesStatus";

export default function DatosPersonalesResultadoPage() {
  useBrebPageHeader("Datos Personales", "/otros-servicios");
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get("status") === "error" ? "error" : "success";
  const isSuccess = status === "success";

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.removeItem(STATUS_KEY);
    };
  }, []);

  const handleBackToServices = () => {
    router.push("/otros-servicios");
  };

  const handleRetry = () => {
    router.push(BASE_PATH);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Otros Servicios", "Datos Personales", "Resultado"]}
      />
      <Card className="p-6 md:p-10 max-w-2xl mx-auto text-center space-y-5">
        <div className="flex justify-center">
          {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-navy">
          {isSuccess
            ? "Solicitud enviada exitosamente"
            : "No pudimos procesar tu solicitud"}
        </h2>
        <p className="text-[15px] text-brand-gray-high">
          {isSuccess
            ? "Tu solicitud de actualización fue enviada para validación. Recibirás una notificación por correo y SMS cuando sea aprobada."
            : "Ocurrió un error al validar el código. Por favor intenta nuevamente."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          {!isSuccess && (
            <Button variant="secondary" onClick={handleRetry}>
              Reintentar
            </Button>
          )}
          <Button variant="primary" onClick={handleBackToServices}>
            Volver a Otros Servicios
          </Button>
        </div>
      </Card>
    </div>
  );
}
