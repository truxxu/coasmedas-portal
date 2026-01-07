'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ProtectionPaymentDetailsCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/contexts';
import {
  mockProtectionSourceAccounts,
  mockProtectionPaymentProducts,
  PROTECTION_PAYMENT_STEPS,
} from '@/src/mocks';
import type {
  ProtectionPaymentProduct,
  ProtectionPaymentDetailsFormData,
  ProtectionPaymentMethod,
} from '@/src/types';

const initialFormData: ProtectionPaymentDetailsFormData = {
  sourceAccountId: '',
  sourceAccountDisplay: '',
  selectedProduct: null,
  paymentMethod: 'account',
};

export default function ProteccionDetallePage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [formData, setFormData] = useState<ProtectionPaymentDetailsFormData>(initialFormData);
  const [selectedProduct, setSelectedProduct] = useState<ProtectionPaymentProduct | null>(null);
  const [errors, setErrors] = useState<{
    sourceAccount?: string;
    product?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Pago de Proteccion',
      backHref: '/pagos/pagar-mis-productos',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleAccountChange = (accountId: string, paymentMethod: ProtectionPaymentMethod) => {
    const isPSE = paymentMethod === 'pse';
    const account = mockProtectionSourceAccounts.find((a) => a.id === accountId);

    setFormData((prev) => ({
      ...prev,
      sourceAccountId: accountId,
      sourceAccountDisplay: isPSE ? 'PSE (Pagos con otras entidades)' : (account?.displayName || ''),
      paymentMethod,
    }));
    setErrors((prev) => ({ ...prev, sourceAccount: undefined }));
  };

  const handleProductSelect = (product: ProtectionPaymentProduct) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      selectedProduct: product,
    }));
    setErrors((prev) => ({ ...prev, product: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.sourceAccountId) {
      newErrors.sourceAccount = 'Por favor selecciona una cuenta origen';
    }
    if (!selectedProduct) {
      newErrors.product = 'Por favor selecciona un producto de proteccion';
    }

    // Check if balance is sufficient (only for account payments, not PSE)
    if (formData.sourceAccountId && selectedProduct && formData.paymentMethod === 'account') {
      const selectedAccount = mockProtectionSourceAccounts.find(
        (a) => a.id === formData.sourceAccountId
      );
      if (selectedAccount && selectedProduct.nextPaymentAmount > selectedAccount.balance) {
        newErrors.sourceAccount = 'Saldo insuficiente en la cuenta seleccionada';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Store form data in sessionStorage
    const dataToStore: ProtectionPaymentDetailsFormData = {
      ...formData,
      selectedProduct,
    };
    sessionStorage.setItem('protectionPaymentDetails', JSON.stringify(dataToStore));

    router.push('/pagos/pagar-mis-productos/proteccion/confirmacion');
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={['Inicio', 'Pagos', 'Pagos de Proteccion']} />
        <HideBalancesToggle />
      </div>

      {/* Stepper */}
      <Stepper currentStep={1} steps={PROTECTION_PAYMENT_STEPS} />

      {/* Details Card */}
      <ProtectionPaymentDetailsCard
        sourceAccounts={mockProtectionSourceAccounts}
        products={mockProtectionPaymentProducts}
        selectedAccountId={formData.sourceAccountId}
        selectedProduct={selectedProduct}
        onAccountChange={handleAccountChange}
        onProductSelect={handleProductSelect}
        onBack={handleBack}
        onContinue={handleContinue}
        errors={errors}
        isLoading={isLoading}
        hideBalances={hideBalances}
      />
    </div>
  );
}
