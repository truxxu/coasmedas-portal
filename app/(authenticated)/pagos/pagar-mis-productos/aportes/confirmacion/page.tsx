'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { AportesConfirmationCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/contexts';
import {
  mockAportesPaymentAccounts,
  mockAportesUserData,
  APORTES_PAYMENT_STEPS,
} from '@/src/mocks/mockAportesPaymentData';
import {
  AportesConfirmationData,
  AportesPaymentBreakdown,
} from '@/src/types/aportes-payment';

export default function ConfirmacionAportesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<AportesConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: 'Pago de Aportes',
      backHref: '/pagos/pagar-mis-productos/aportes',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from previous step
    const accountId = sessionStorage.getItem('aportesPaymentAccountId');
    const valor = sessionStorage.getItem('aportesPaymentValor');
    const breakdownStr = sessionStorage.getItem('aportesPaymentBreakdown');

    if (!accountId || !valor || !breakdownStr) {
      router.push('/pagos/pagar-mis-productos/aportes');
      return;
    }

    const account = mockAportesPaymentAccounts.find(
      (acc) => acc.id === accountId
    );
    const breakdown: AportesPaymentBreakdown = JSON.parse(breakdownStr);

    if (!account) {
      router.push('/pagos/pagar-mis-productos/aportes');
      return;
    }

    setConfirmationData({
      titular: mockAportesUserData.name,
      documento: mockAportesUserData.document,
      productoAPagar: breakdown.planName,
      numeroProducto: breakdown.productNumber,
      productoADebitar: account.name,
      valorAPagar: parseInt(valor, 10),
    });
    setIsLoading(false);
  }, [router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        'aportesPaymentConfirmation',
        JSON.stringify(confirmationData)
      );
    }

    // Navigate to verification step
    router.push('/pagos/pagar-mis-productos/aportes/verificacion');
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos/aportes');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#1D4E8F]">Cargando...</div>
      </div>
    );
  }

  if (!confirmationData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={['Inicio', 'Pagos', 'Pagar mis productos', 'Pago de Aportes']}
        />
        <Stepper currentStep={2} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <AportesConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleBack}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
