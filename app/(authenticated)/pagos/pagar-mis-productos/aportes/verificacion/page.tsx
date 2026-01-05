'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { CodeInputCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useWelcomeBar } from '@/src/contexts';
import {
  APORTES_PAYMENT_STEPS,
  APORTES_MOCK_VALID_CODE,
} from '@/src/mocks/mockAportesPaymentData';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerificacionAportesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: 'Pago de Aportes',
      backHref: '/pagos/pagar-mis-productos/aportes/confirmacion',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Verify session data exists
  useEffect(() => {
    const confirmationData = sessionStorage.getItem('aportesPaymentConfirmation');
    if (!confirmationData) {
      router.push('/pagos/pagar-mis-productos/aportes');
    }
  }, [router]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown, isResendDisabled]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setError('');
  }, []);

  const handleResendCode = useCallback(() => {
    console.log('Resending code...');
    setIsResendDisabled(true);
    setResendCountdown(RESEND_COOLDOWN_SECONDS);
    // TODO: API call to resend SMS code
  }, []);

  const handlePay = async () => {
    if (code.length !== 6) {
      setError('Por favor ingresa el codigo de 6 digitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === APORTES_MOCK_VALID_CODE) {
        router.push('/pagos/pagar-mis-productos/aportes/resultado');
      } else {
        setError('Codigo incorrecto. Por favor intenta nuevamente.');
      }
    } catch {
      setError('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos/aportes/confirmacion');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={['Inicio', 'Pagos', 'Pagar mis productos', 'Pago de Aportes']}
        />
        <Stepper currentStep={3} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        onResend={handleResendCode}
        hasError={!!error}
        errorMessage={error}
        resendDisabled={isResendDisabled}
        resendCountdown={resendCountdown > 0 ? resendCountdown : undefined}
        disabled={isLoading}
      />

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isLoading}
        >
          Volver
        </Button>
        <Button
          variant="primary"
          onClick={handlePay}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Pagar'}
        </Button>
      </div>
    </div>
  );
}
