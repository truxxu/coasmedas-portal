'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { AportesDetailsCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/contexts';
import {
  mockAportesPaymentAccounts,
  mockAportesPaymentBreakdown,
  APORTES_PAYMENT_STEPS,
  isPSEPayment,
  getPaymentMethod,
} from '@/src/mocks/mockAportesPaymentData';

export default function PagoAportesPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [valorAPagar, setValorAPagar] = useState<number>(
    mockAportesPaymentBreakdown.aportesVigentes +
      mockAportesPaymentBreakdown.fondoSolidaridadVigente
  );
  const [error, setError] = useState<string>('');

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: 'Pago de Aportes',
      backHref: '/pagos/pagar-mis-productos',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleContinue = () => {
    // Validation
    if (!selectedAccountId) {
      setError('Por favor selecciona una cuenta o metodo de pago');
      return;
    }

    if (valorAPagar <= 0) {
      setError('El valor a pagar debe ser mayor a 0');
      return;
    }

    // Only check balance if paying from an internal account (not PSE)
    if (!isPSEPayment(selectedAccountId)) {
      const selectedAccount = mockAportesPaymentAccounts.find(
        (acc) => acc.id === selectedAccountId
      );

      if (selectedAccount && selectedAccount.balance < valorAPagar) {
        setError('Saldo insuficiente en la cuenta seleccionada');
        return;
      }
    }

    // Store data in sessionStorage
    sessionStorage.setItem('aportesPaymentAccountId', selectedAccountId);
    sessionStorage.setItem('aportesPaymentValor', valorAPagar.toString());
    sessionStorage.setItem(
      'aportesPaymentBreakdown',
      JSON.stringify(mockAportesPaymentBreakdown)
    );
    sessionStorage.setItem(
      'aportesPaymentMethod',
      getPaymentMethod(selectedAccountId)
    );

    router.push('/pagos/pagar-mis-productos/aportes/confirmacion');
  };

  const handleNeedMoreBalance = () => {
    // TODO: Open modal or navigate to transfer page
    console.log('Need more balance');
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={['Inicio', 'Pagos', 'Pagar mis productos', 'Pago de Aportes']}
        />
        <Stepper currentStep={1} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <AportesDetailsCard
        accounts={mockAportesPaymentAccounts}
        paymentBreakdown={mockAportesPaymentBreakdown}
        selectedAccountId={selectedAccountId}
        valorAPagar={valorAPagar}
        onAccountChange={(id) => {
          setSelectedAccountId(id);
          setError('');
        }}
        onValorChange={(valor) => {
          setValorAPagar(valor);
          setError('');
        }}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
      />

      {error && (
        <div className="text-sm text-brand-error text-center">{error}</div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleBack}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
