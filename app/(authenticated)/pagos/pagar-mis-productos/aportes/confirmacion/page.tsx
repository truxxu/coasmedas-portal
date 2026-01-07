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
  PSE_PAYMENT_NAME,
} from '@/src/mocks/mockAportesPaymentData';
import {
  AportesConfirmationData,
  AportesPaymentBreakdown,
  AportesPaymentMethod,
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
    const paymentMethod = sessionStorage.getItem('aportesPaymentMethod') as AportesPaymentMethod || 'account';

    if (!accountId || !valor || !breakdownStr) {
      router.push('/pagos/pagar-mis-productos/aportes');
      return;
    }

    const breakdown: AportesPaymentBreakdown = JSON.parse(breakdownStr);

    // For PSE, we don't need to find an account
    if (paymentMethod === 'pse') {
      setConfirmationData({
        titular: mockAportesUserData.name,
        documento: mockAportesUserData.document,
        productoAPagar: breakdown.planName,
        numeroProducto: breakdown.productNumber,
        productoADebitar: PSE_PAYMENT_NAME,
        valorAPagar: parseInt(valor, 10),
        paymentMethod: 'pse',
      });
      setIsLoading(false);
      return;
    }

    // For account payment, find the account
    const account = mockAportesPaymentAccounts.find(
      (acc) => acc.id === accountId
    );

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
      paymentMethod: 'account',
    });
    setIsLoading(false);
  }, [router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        'aportesPaymentConfirmation',
        JSON.stringify(confirmationData)
      );

      // Navigate based on payment method
      if (confirmationData.paymentMethod === 'pse') {
        // PSE: Go to PSE redirect/loading page
        router.push('/pagos/pagar-mis-productos/aportes/pse-redirect');
      } else {
        // Account: Go to SMS verification step
        router.push('/pagos/pagar-mis-productos/aportes/verificacion');
      }
    }
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos/aportes');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-navy">Cargando...</div>
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
