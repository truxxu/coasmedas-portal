'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { AportesConfirmationCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar, useUserContext } from '@/src/contexts';
import {
  APORTES_PAYMENT_STEPS,
  PSE_PAYMENT_NAME,
} from '@/src/mocks/mockAportesPaymentData';
import {
  AportesConfirmationData,
  AportesPaymentBreakdown,
  AportesPaymentMethod,
} from '@/src/types/aportes-payment';
import { maskNumber } from '@/src/utils';
import { buildAccountReference, buildAportesTarget } from '@/lib/mappers/payments.mapper';
import type { SavingsAccountResponse, ContributionsResponse } from '@/types/api/products';

export default function ConfirmacionAportesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [confirmationData] =
    useState<AportesConfirmationData | null>(() => {
      if (typeof window === 'undefined') return null;

      const accountId = sessionStorage.getItem('aportesPaymentAccountId');
      const valor = sessionStorage.getItem('aportesPaymentValor');
      const breakdownStr = sessionStorage.getItem('aportesPaymentBreakdown');
      const paymentMethod = sessionStorage.getItem('aportesPaymentMethod') as AportesPaymentMethod || 'account';

      if (!accountId || !valor || !breakdownStr) {
        return null;
      }

      const breakdown: AportesPaymentBreakdown = JSON.parse(breakdownStr);

      // Build user display
      const userName = user?.fullName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
      const maskedDoc = user
        ? `${user.documentType} ${maskNumber(user.documentNumber)}`
        : '';

      // For PSE, we don't need to find an account
      if (paymentMethod === 'pse') {
        return {
          titular: userName,
          documento: maskedDoc,
          productoAPagar: breakdown.planName,
          numeroProducto: breakdown.productNumber,
          productoADebitar: PSE_PAYMENT_NAME,
          valorAPagar: parseInt(valor, 10),
          paymentMethod: 'pse',
        };
      }

      // For account payment, read the stored account
      const sourceAccountStr = sessionStorage.getItem('aportesSourceAccount');
      if (!sourceAccountStr) return null;

      const sourceAccount: SavingsAccountResponse = JSON.parse(sourceAccountStr);

      return {
        titular: userName,
        documento: maskedDoc,
        productoAPagar: breakdown.planName,
        numeroProducto: breakdown.productNumber,
        productoADebitar: sourceAccount.nombreProducto,
        valorAPagar: parseInt(valor, 10),
        paymentMethod: 'account',
      };
    });

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: 'Pago de Aportes',
      backHref: '/pagos/pagar-mis-productos/aportes',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Redirect if data is missing
  useEffect(() => {
    if (!confirmationData) {
      router.push('/pagos/pagar-mis-productos/aportes');
    }
  }, [confirmationData, router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        'aportesPaymentConfirmation',
        JSON.stringify(confirmationData)
      );

      // Pre-build transaction request for the verification step
      const sourceAccountStr = sessionStorage.getItem('aportesSourceAccount');
      const contributionsStr = sessionStorage.getItem('aportesContributions');
      if (sourceAccountStr && contributionsStr) {
        const sourceAccount: SavingsAccountResponse = JSON.parse(sourceAccountStr);
        const contributions: ContributionsResponse = JSON.parse(contributionsStr);
        const txRequest = {
          origen: buildAccountReference(sourceAccount),
          cuentas: [buildAportesTarget(contributions, confirmationData.valorAPagar)],
          vlrPagoTotal: confirmationData.valorAPagar,
        };
        sessionStorage.setItem('aportesTransactionRequest', JSON.stringify(txRequest));
      }

      // Navigate based on payment method
      if (confirmationData.paymentMethod === 'pse') {
        router.push('/pagos/pagar-mis-productos/aportes/pse-redirect');
      } else {
        if (!sourceAccountStr || !contributionsStr) {
          router.push('/pagos/pagar-mis-productos/aportes');
          return;
        }
        router.push('/pagos/pagar-mis-productos/aportes/verificacion');
      }
    }
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos/aportes');
  };

  if (!confirmationData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={['Inicio', 'Pagos', 'Pagar mis productos', 'Pago de Aportes']}
      />

      <div className="-mx-8 bg-white shadow-sm">
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
