"use client";

import React from "react";
import { Card } from "@/src/atoms";

interface PSELoadingCardProps {
  message?: string;
}

export const PSELoadingCard: React.FC<PSELoadingCardProps> = ({
  message = "Conectando con PSE...",
}) => {
  return (
    <Card className="max-w-2xl mx-auto py-12 px-6">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E4E6EA] rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#007FFF] border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#1D4E8F]">{message}</h2>
          <p className="text-[15px] text-[#58585B]">
            Serás redirigido al sitio seguro de tu banco para completar el pago.
          </p>
          <p className="text-sm text-[#808284]">
            Por favor, no cierres esta ventana.
          </p>
        </div>
      </div>
    </Card>
  );
};
