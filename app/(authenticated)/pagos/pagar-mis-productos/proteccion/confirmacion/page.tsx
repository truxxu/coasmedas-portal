'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ProtectionPaymentConfirmationCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/contexts';
import { PROTECTION_PAYMENT_STEPS } from '@/src/mocks';
import type {
  ProtectionPaymentDetailsFormData,
  ProtectionPaymentConfirmationData,
} from '@/src/types';

export default function ProteccionConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [confirmation, setConfirmation] = useState<ProtectionPaymentConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Pago de Proteccion',
      backHref: '/pagos/pagar-mis-productos/proteccion/detalle',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Load details from sessionStorage and build confirmation data
  useEffect(() => {
    const detailsStr = sessionStorage.getItem('protectionPaymentDetails');
    if (!detailsStr) {
      router.push('/pagos/pagar-mis-productos/proteccion/detalle');
      return;
    }

    const details: ProtectionPaymentDetailsFormData = JSON.parse(detailsStr);

    // Build confirmation data from details + mock user data
    const confirmationData: ProtectionPaymentConfirmationData = {
      holderName: 'CAMILO ANDRES CRUZ',
      holderDocument: 'CC 1.***.***234',
      productToPay: details.selectedProduct?.title || '',
      policyNumber: details.selectedProduct?.productNumber || '',
      productToDebit: details.sourceAccountDisplay.split(' - ')[0] || 'Cuenta de Ahorros',
      amountToPay: details.selectedProduct?.nextPaymentAmount || 0,
    };

    setConfirmation(confirmationData);
  }, [router]);

  const handleConfirm = async () => {
    if (!confirmation) return;

    setIsLoading(true);

    try {
      // Store confirmation data for result page
      sessionStorage.setItem('protectionPaymentConfirmation', JSON.stringify(confirmation));

      // Simulate SMS send delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/pagos/pagar-mis-productos/proteccion/codigo-sms');
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos/proteccion/detalle');
  };

  if (!confirmation) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-[15px] text-[#58585B]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={['Inicio', 'Pagos', 'Pagos de Proteccion']} />
        <HideBalancesToggle />
      </div>

      {/* Stepper */}
      <Stepper currentStep={2} steps={PROTECTION_PAYMENT_STEPS} />

      {/* Confirmation Card */}
      <ProtectionPaymentConfirmationCard
        confirmation={confirmation}
        onBack={handleBack}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        hideBalances={hideBalances}
      />
    </div>
  );
}
