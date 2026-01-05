# Feature 09b - Pagos: Pago de Aportes Flow - Technical Specification

**Feature**: Aportes Payment Flow (Pago de Aportes)
**Version**: 1.0
**Status**: Implementation Ready
**Last Updated**: 2026-01-05

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Technical Architecture](#technical-architecture)
3. [Type Definitions](#type-definitions)
4. [Component Specifications](#component-specifications)
5. [Page Implementations](#page-implementations)
6. [State Management](#state-management)
7. [Utility Functions](#utility-functions)
8. [Mock Data](#mock-data)
9. [Validation Schemas](#validation-schemas)
10. [File Structure](#file-structure)
11. [Implementation Order](#implementation-order)
12. [Testing Strategy](#testing-strategy)

---

## Feature Overview

The **Pago de Aportes** feature allows users to pay their pending aportes (contributions) to their specific plan (e.g., "Plan Senior"). This is a single-product payment flow within the "Pagar mis Productos" section.

### Key Characteristics
- **Multi-step flow**: 4 sequential steps with progress tracking
- **Single product**: Focuses on Aportes product only
- **Editable amount**: Users can modify the payment amount
- **Detailed breakdown**: Shows vigentes and mora amounts separately
- **Security**: SMS verification for transaction authorization
- **Reusability**: Reuses Stepper and code verification components from 09a-pagos

### User Journey
1. View aportes breakdown, select account, and enter payment amount
2. Review and confirm payment details
3. Enter 6-digit SMS security code
4. View transaction result with option to print/save

### Key Differences from Pago Unificado (09a)
| Aspect | Pago Unificado (09a) | Pago de Aportes (09b) |
|--------|----------------------|----------------------|
| Scope | All products combined | Single Aportes product |
| Step 1 | Summary totals only | Full breakdown with mora |
| Amount Input | Fixed total | Editable amount field |
| Confirmation | Multiple products | Single product details |
| Result | Generic info | Aportes-specific fields |

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   ├── CurrencyInput.tsx          # NEW - Editable currency field
│   └── index.ts                   # UPDATE
│
├── molecules/
│   ├── AportesPaymentDetailRow.tsx  # NEW - Row with colored values
│   └── index.ts                     # UPDATE
│
├── organisms/
│   ├── AportesDetailsCard.tsx       # NEW - Step 1 card
│   ├── AportesConfirmationCard.tsx  # NEW - Step 2 card
│   └── index.ts                     # UPDATE
│
├── types/
│   ├── aportes-payment.ts         # NEW - Aportes-specific types
│   └── index.ts                   # UPDATE
│
├── mocks/
│   ├── mockAportesPaymentData.ts  # NEW - Aportes payment mock data
│   └── index.ts                   # UPDATE
│
└── schemas/
    └── aportesPaymentSchemas.ts   # NEW - Validation schemas

app/(authenticated)/pagos/pago-aportes/
├── page.tsx                       # Step 1: Details
├── confirmacion/
│   └── page.tsx                   # Step 2: Confirmation
├── verificacion/
│   └── page.tsx                   # Step 3: Code Input
└── resultado/
    └── page.tsx                   # Step 4: Result
```

### Reused Components from 09a-pagos
- `StepperCircle` - Individual step indicator
- `StepperConnector` - Connector line
- `Stepper` - Multi-step progress indicator
- `CodeInput` - Single digit input
- `CodeInputGroup` - 6-digit code input
- `CodeInputCard` - Step 3 main card
- `TransactionDetailRow` - Key-value row
- `TransactionResultCard` - Step 4 main card (with adaptation)

### Technology Stack
- **React 19**: Component framework
- **Next.js 16 App Router**: Routing and page structure
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **react-hook-form**: Form state management
- **yup**: Validation schemas

---

## Type Definitions

### File: `src/types/aportes-payment.ts`

```typescript
/**
 * Aportes payment breakdown details
 */
export interface AportesPaymentBreakdown {
  planName: string;
  productNumber: string; // Masked
  aportesVigentes: number;
  fondoSolidaridadVigente: number;
  aportesEnMora: number;
  fondoSolidaridadEnMora: number;
  fechaLimitePago: string;
  costoTransaccion: number;
}

/**
 * Step 1: Aportes payment details form data
 */
export interface AportesPaymentDetailsData {
  selectedAccountId: string;
  valorAPagar: number; // User-entered amount
}

/**
 * Step 2: Aportes confirmation data
 */
export interface AportesConfirmationData {
  titular: string;
  documento: string; // Masked
  productoAPagar: string; // Plan name
  numeroProducto: string; // Masked
  productoADebitar: string; // Account name
  valorAPagar: number;
}

/**
 * Step 4: Aportes transaction result
 */
export interface AportesTransactionResult {
  status: 'success' | 'error';
  lineaCredito: string;
  numeroProducto: string;
  valorPagado: number;
  costoTransaccion: number;
  fechaTransmision: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  descripcion: string;
}

/**
 * Complete aportes payment flow state
 */
export interface AportesPaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedAccountId: string | null;
  paymentBreakdown: AportesPaymentBreakdown | null;
  valorAPagar: number;
  confirmationData: AportesConfirmationData | null;
  verificationCode: string;
  transactionResult: AportesTransactionResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Value color options for detail rows
 */
export type AportesValueColor = 'default' | 'red' | 'navy' | 'green';
```

---

## Component Specifications

### New Atoms

#### `CurrencyInput.tsx`

**Location**: `src/atoms/CurrencyInput.tsx`

**Props Interface**:
```typescript
interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
}
```

**Implementation**:
```typescript
'use client';

import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  prefix = '$',
  hasError = false,
  disabled = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    // Format the value with thousand separators
    setDisplayValue(formatNumberForDisplay(value));
  }, [value]);

  const formatNumberForDisplay = (num: number): string => {
    return num.toLocaleString('es-CO');
  };

  const parseDisplayValue = (str: string): number => {
    // Remove thousand separators and parse
    const cleaned = str.replace(/\./g, '').replace(/,/g, '');
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Only allow digits and separators
    const cleaned = rawValue.replace(/[^\d]/g, '');
    const numericValue = parseInt(cleaned, 10) || 0;

    onChange(numericValue);
    setDisplayValue(formatNumberForDisplay(numericValue));
  };

  const handleBlur = () => {
    // Ensure proper formatting on blur
    setDisplayValue(formatNumberForDisplay(value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xl font-bold text-black">{prefix}</span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`
          w-32 h-10 px-3 text-right text-lg font-medium rounded-md
          border transition-colors
          ${
            hasError
              ? 'border-[#FF0D00] focus:border-[#FF0D00] focus:ring-2 focus:ring-[#FF0D00]'
              : 'border-[#1D4E8F] focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF]'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          focus:outline-none
        `}
        aria-label="Valor a pagar"
      />
    </div>
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

### New Molecules

#### `AportesPaymentDetailRow.tsx`

**Location**: `src/molecules/AportesPaymentDetailRow.tsx`

**Props Interface**:
```typescript
interface AportesPaymentDetailRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'red' | 'navy' | 'green';
  hideValue?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { maskCurrency } from '@/src/utils';

interface AportesPaymentDetailRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'red' | 'navy' | 'green';
  hideValue?: boolean;
}

export const AportesPaymentDetailRow: React.FC<AportesPaymentDetailRowProps> = ({
  label,
  value,
  valueColor = 'default',
  hideValue = false,
}) => {
  const colorClasses = {
    default: 'text-black',
    red: 'text-[#E1172B]',
    navy: 'text-[#1D4E8F]',
    green: 'text-[#00A44C]',
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-[15px] text-black">{label}</span>
      <span className={`text-[15px] font-medium ${colorClasses[valueColor]}`}>
        {hideValue ? maskCurrency() : value}
      </span>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### New Organisms

#### `AportesDetailsCard.tsx`

**Location**: `src/organisms/AportesDetailsCard.tsx`

**Props Interface**:
```typescript
interface AportesDetailsCardProps {
  accounts: PaymentAccount[];
  paymentBreakdown: AportesPaymentBreakdown;
  selectedAccountId: string;
  valorAPagar: number;
  onAccountChange: (accountId: string) => void;
  onValorChange: (valor: number) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { Card } from '@/src/atoms';
import { CurrencyInput } from '@/src/atoms';
import { AportesPaymentDetailRow } from '@/src/molecules';
import { Divider } from '@/src/atoms';
import { PaymentAccount } from '@/src/types/payment';
import { AportesPaymentBreakdown } from '@/src/types/aportes-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface AportesDetailsCardProps {
  accounts: PaymentAccount[];
  paymentBreakdown: AportesPaymentBreakdown;
  selectedAccountId: string;
  valorAPagar: number;
  onAccountChange: (accountId: string) => void;
  onValorChange: (valor: number) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const AportesDetailsCard: React.FC<AportesDetailsCardProps> = ({
  accounts,
  paymentBreakdown,
  selectedAccountId,
  valorAPagar,
  onAccountChange,
  onValorChange,
  onNeedMoreBalance,
  hideBalances,
}) => {
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: `${account.name} - Saldo: ${
      hideBalances ? maskCurrency() : formatCurrency(account.balance)
    }`,
  }));

  return (
    <Card className="space-y-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Pago de Aportes
      </h2>

      {/* Account Selector Section */}
      <div className="space-y-2">
        <label className="block text-[15px] text-black">
          ¿De cuál cuenta quiere pagar?
        </label>
        <div className="flex items-center justify-between gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="flex-1 h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-black focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-xs text-[#1D4E8F] hover:underline whitespace-nowrap"
          >
            ¿Necesitas más saldo?
          </button>
        </div>
      </div>

      {/* Payment Breakdown Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#1D4E8F]">
          Detalle del Pago - {paymentBreakdown.planName}
        </h3>

        <Divider />

        {/* Vigentes Section */}
        <AportesPaymentDetailRow
          label="Aportes Vigentes:"
          value={
            hideBalances
              ? maskCurrency()
              : formatCurrency(paymentBreakdown.aportesVigentes)
          }
          hideValue={hideBalances}
        />
        <AportesPaymentDetailRow
          label="Fondo de Solidaridad Vigente:"
          value={
            hideBalances
              ? maskCurrency()
              : formatCurrency(paymentBreakdown.fondoSolidaridadVigente)
          }
          hideValue={hideBalances}
        />

        {/* Mora Section - Always show in red */}
        <AportesPaymentDetailRow
          label="Aportes en Mora:"
          value={
            hideBalances
              ? maskCurrency()
              : formatCurrency(paymentBreakdown.aportesEnMora)
          }
          valueColor="red"
          hideValue={hideBalances}
        />
        <AportesPaymentDetailRow
          label="Fondo de Solidaridad en Mora:"
          value={
            hideBalances
              ? maskCurrency()
              : formatCurrency(paymentBreakdown.fondoSolidaridadEnMora)
          }
          valueColor="red"
          hideValue={hideBalances}
        />

        <Divider />

        {/* Additional Info */}
        <AportesPaymentDetailRow
          label="Fecha Límite de Pago:"
          value={paymentBreakdown.fechaLimitePago}
        />
        <AportesPaymentDetailRow
          label="Costo de la Transacción:"
          value={formatCurrency(paymentBreakdown.costoTransaccion)}
        />

        <Divider />

        {/* Editable Value Section */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-medium text-[#1D4E8F]">Valor</span>
          <CurrencyInput
            value={valorAPagar}
            onChange={onValorChange}
            prefix="$"
          />
        </div>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `AportesConfirmationCard.tsx`

**Location**: `src/organisms/AportesConfirmationCard.tsx`

**Props Interface**:
```typescript
interface AportesConfirmationCardProps {
  confirmationData: AportesConfirmationData;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { AportesConfirmationData } from '@/src/types/aportes-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface AportesConfirmationCardProps {
  confirmationData: AportesConfirmationData;
  hideBalances: boolean;
}

export const AportesConfirmationCard: React.FC<AportesConfirmationCardProps> = ({
  confirmationData,
  hideBalances,
}) => {
  return (
    <Card className="space-y-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Confirmación de Pagos
      </h2>

      {/* Description */}
      <p className="text-[15px] text-black">
        Por favor, verifica que los datos de la transacción sean correctos
        antes de continuar.
      </p>

      {/* User Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Titular:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Documento:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      <Divider />

      {/* Payment Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Producto a Pagar:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.productoAPagar}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Numero de Producto:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.numeroProducto}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Producto a Debitar:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.productoADebitar}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Valor a Pagar:</span>
          <span className="text-[15px] font-medium text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.valorAPagar)}
          </span>
        </div>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `AportesTransactionResultCard.tsx`

**Location**: `src/organisms/AportesTransactionResultCard.tsx`

**Props Interface**:
```typescript
interface AportesTransactionResultCardProps {
  result: AportesTransactionResult;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { AportesTransactionResult } from '@/src/types/aportes-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface AportesTransactionResultCardProps {
  result: AportesTransactionResult;
  hideBalances: boolean;
}

export const AportesTransactionResultCard: React.FC<AportesTransactionResultCardProps> = ({
  result,
  hideBalances,
}) => {
  const isSuccess = result.status === 'success';

  return (
    <Card className="space-y-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-16 h-16 rounded-full border-4 border-[#00A44C] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#00A44C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full border-4 border-[#FF0D00] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#FF0D00]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Result Title */}
      <h2 className="text-[22px] font-bold text-[#1D4E8F] text-center">
        {isSuccess ? 'Transacción Exitosa' : 'Transacción Fallida'}
      </h2>

      {/* Transaction Details Section 1 */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Línea crédito:</span>
          <span className="text-[15px] font-medium text-black">
            {result.lineaCredito}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Número de producto:</span>
          <span className="text-[15px] font-medium text-black">
            {result.numeroProducto}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Valor pagado:</span>
          <span className="text-lg font-medium text-[#1D4E8F]">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(result.valorPagado)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Costo transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {formatCurrency(result.costoTransaccion)}
          </span>
        </div>
      </div>

      <Divider />

      {/* Transaction Details Section 2 */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Fecha de Transmisión:</span>
          <span className="text-[15px] font-medium text-black">
            {result.fechaTransmision}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Hora de Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {result.horaTransaccion}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Número de Aprobación:</span>
          <span className="text-[15px] font-medium text-black">
            {result.numeroAprobacion}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Descripción:</span>
          <span
            className={`text-[15px] font-medium ${
              isSuccess ? 'text-[#00A44C]' : 'text-[#FF0D00]'
            }`}
          >
            {result.descripcion}
          </span>
        </div>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

## Page Implementations

### Step 1: Details Page

**File**: `app/(authenticated)/pagos/pago-aportes/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { AportesDetailsCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockPaymentAccounts,
  mockAportesPaymentBreakdown,
  APORTES_PAYMENT_STEPS,
} from '@/src/mocks/mockAportesPaymentData';

export default function PagoAportesPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [valorAPagar, setValorAPagar] = useState<number>(
    mockAportesPaymentBreakdown.aportesVigentes +
    mockAportesPaymentBreakdown.fondoSolidaridadVigente
  );
  const [error, setError] = useState<string>('');

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Aportes', href: '/pagos/pago-aportes' },
  ];

  const handleContinue = () => {
    // Validation
    if (!selectedAccountId) {
      setError('Por favor selecciona una cuenta');
      return;
    }

    if (valorAPagar <= 0) {
      setError('El valor a pagar debe ser mayor a 0');
      return;
    }

    const selectedAccount = mockPaymentAccounts.find(
      (acc) => acc.id === selectedAccountId
    );

    if (selectedAccount && selectedAccount.balance < valorAPagar) {
      setError('Saldo insuficiente en la cuenta seleccionada');
      return;
    }

    // Store data in sessionStorage
    sessionStorage.setItem('aportesPaymentAccountId', selectedAccountId);
    sessionStorage.setItem('aportesPaymentValor', valorAPagar.toString());
    sessionStorage.setItem(
      'aportesPaymentBreakdown',
      JSON.stringify(mockAportesPaymentBreakdown)
    );

    router.push('/pagos/pago-aportes/confirmacion');
  };

  const handleNeedMoreBalance = () => {
    // TODO: Open modal or navigate to transfer page
    console.log('Need more balance');
  };

  const handleBack = () => {
    router.push('/pagos');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Stepper currentStep={1} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <AportesDetailsCard
        accounts={mockPaymentAccounts}
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
        <div className="text-sm text-[#FF0D00] text-center">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#1D4E8F] hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 2: Confirmation Page

**File**: `app/(authenticated)/pagos/pago-aportes/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { AportesConfirmationCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockPaymentAccounts,
  mockUserData,
  APORTES_PAYMENT_STEPS,
} from '@/src/mocks/mockAportesPaymentData';
import { AportesConfirmationData, AportesPaymentBreakdown } from '@/src/types/aportes-payment';

export default function ConfirmacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<AportesConfirmationData | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Aportes', href: '/pagos/pago-aportes' },
  ];

  useEffect(() => {
    // Get data from previous step
    const accountId = sessionStorage.getItem('aportesPaymentAccountId');
    const valor = sessionStorage.getItem('aportesPaymentValor');
    const breakdownStr = sessionStorage.getItem('aportesPaymentBreakdown');

    if (!accountId || !valor || !breakdownStr) {
      router.push('/pagos/pago-aportes');
      return;
    }

    const account = mockPaymentAccounts.find((acc) => acc.id === accountId);
    const breakdown: AportesPaymentBreakdown = JSON.parse(breakdownStr);

    if (!account) {
      router.push('/pagos/pago-aportes');
      return;
    }

    setConfirmationData({
      titular: mockUserData.name,
      documento: mockUserData.document,
      productoAPagar: breakdown.planName,
      numeroProducto: breakdown.productNumber,
      productoADebitar: account.name,
      valorAPagar: parseInt(valor, 10),
    });
  }, [router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        'aportesPaymentConfirmation',
        JSON.stringify(confirmationData)
      );
    }

    // TODO: API call to initiate payment and send SMS
    router.push('/pagos/pago-aportes/verificacion');
  };

  const handleBack = () => {
    router.push('/pagos/pago-aportes');
  };

  if (!confirmationData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Stepper currentStep={2} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <AportesConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#1D4E8F] hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 3: Code Input Page

**File**: `app/(authenticated)/pagos/pago-aportes/verificacion/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { CodeInputCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { APORTES_PAYMENT_STEPS, MOCK_VALID_CODE } from '@/src/mocks/mockAportesPaymentData';

export default function VerificacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Aportes', href: '/pagos/pago-aportes' },
  ];

  useEffect(() => {
    const confirmationData = sessionStorage.getItem('aportesPaymentConfirmation');
    if (!confirmationData) {
      router.push('/pagos/pago-aportes');
    }
  }, [router]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError('');
  };

  const handleResendCode = () => {
    console.log('Resending code...');
    setIsResendDisabled(true);
    setTimeout(() => {
      setIsResendDisabled(false);
    }, 60000);
  };

  const handlePay = async () => {
    if (code.length !== 6) {
      setError('Por favor ingresa el código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === MOCK_VALID_CODE) {
        router.push('/pagos/pago-aportes/resultado');
      } else {
        setError('Código incorrecto. Por favor intenta nuevamente.');
      }
    } catch {
      setError('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/pago-aportes/confirmacion');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Stepper currentStep={3} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        onResendCode={handleResendCode}
        hasError={!!error}
        errorMessage={error}
        isResendDisabled={isResendDisabled}
        isLoading={isLoading}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#1D4E8F] hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handlePay} disabled={isLoading}>
          {isLoading ? 'Procesando...' : 'Pagar'}
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 4: Result Page

**File**: `app/(authenticated)/pagos/pago-aportes/resultado/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { AportesTransactionResultCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  APORTES_PAYMENT_STEPS,
  mockAportesTransactionResult,
} from '@/src/mocks/mockAportesPaymentData';
import { AportesTransactionResult } from '@/src/types/aportes-payment';

export default function ResultadoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result, setResult] = useState<AportesTransactionResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Aportes', href: '/pagos/pago-aportes' },
  ];

  useEffect(() => {
    // Get valor from session and update mock result
    const valor = sessionStorage.getItem('aportesPaymentValor');
    const breakdownStr = sessionStorage.getItem('aportesPaymentBreakdown');

    if (valor && breakdownStr) {
      const breakdown = JSON.parse(breakdownStr);
      setResult({
        ...mockAportesTransactionResult,
        valorPagado: parseInt(valor, 10),
        lineaCredito: breakdown.planName,
        numeroProducto: breakdown.productNumber,
      });
    } else {
      setResult(mockAportesTransactionResult);
    }

    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('aportesPaymentAccountId');
      sessionStorage.removeItem('aportesPaymentValor');
      sessionStorage.removeItem('aportesPaymentBreakdown');
      sessionStorage.removeItem('aportesPaymentConfirmation');
    };
  }, []);

  const handlePrintSave = () => {
    // TODO: Generate PDF
    window.print();
  };

  const handleFinish = () => {
    // Clear session storage
    sessionStorage.removeItem('aportesPaymentAccountId');
    sessionStorage.removeItem('aportesPaymentValor');
    sessionStorage.removeItem('aportesPaymentBreakdown');
    sessionStorage.removeItem('aportesPaymentConfirmation');

    router.push('/pagos');
  };

  if (!result) {
    return <div>Cargando resultado...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Stepper currentStep={4} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <AportesTransactionResultCard result={result} hideBalances={hideBalances} />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handlePrintSave}>
          Imprimir/Guardar
        </Button>
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
```

---

## Mock Data

### File: `src/mocks/mockAportesPaymentData.ts`

```typescript
import { PaymentAccount } from '@/src/types/payment';
import { Step } from '@/src/types/stepper';
import {
  AportesPaymentBreakdown,
  AportesTransactionResult,
} from '@/src/types/aportes-payment';

/**
 * Mock payment accounts (reuse from 09a)
 */
export const mockPaymentAccounts: PaymentAccount[] = [
  {
    id: '1',
    name: 'Cuenta de Ahorros',
    balance: 8730500,
    number: '****4428',
  },
  {
    id: '2',
    name: 'Cuenta Corriente',
    balance: 5200000,
    number: '****7891',
  },
];

/**
 * Mock user data
 */
export const mockUserData = {
  name: 'CAMILO ANDRÉS CRUZ',
  document: 'CC 1.***.***234',
};

/**
 * Mock aportes payment breakdown
 */
export const mockAportesPaymentBreakdown: AportesPaymentBreakdown = {
  planName: 'Plan Senior',
  productNumber: '***5488',
  aportesVigentes: 500058,
  fondoSolidaridadVigente: 390000,
  aportesEnMora: 0,
  fondoSolidaridadEnMora: 0,
  fechaLimitePago: '15 Nov 2024',
  costoTransaccion: 0,
};

/**
 * Mock aportes transaction result (success)
 */
export const mockAportesTransactionResult: AportesTransactionResult = {
  status: 'success',
  lineaCredito: 'Plan Senior',
  numeroProducto: '***5488',
  valorPagado: 107058,
  costoTransaccion: 0,
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '463342',
  descripcion: 'Exitosa',
};

/**
 * Mock aportes transaction result (error)
 */
export const mockAportesTransactionResultError: AportesTransactionResult = {
  status: 'error',
  lineaCredito: 'Plan Senior',
  numeroProducto: '***5488',
  valorPagado: 0,
  costoTransaccion: 0,
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '-',
  descripcion: 'Fondos insuficientes',
};

/**
 * Aportes payment flow steps
 */
export const APORTES_PAYMENT_STEPS: Step[] = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalización' },
];

/**
 * Mock SMS verification code (for testing)
 */
export const MOCK_VALID_CODE = '123456';
```

**Export**: Add to `src/mocks/index.ts`

---

## Validation Schemas

### File: `src/schemas/aportesPaymentSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Step 1: Aportes payment details validation
 */
export const aportesPaymentDetailsSchema = yup.object({
  selectedAccountId: yup
    .string()
    .required('Por favor selecciona una cuenta'),
  valorAPagar: yup
    .number()
    .required('Por favor ingresa un valor')
    .positive('El valor debe ser mayor a 0')
    .integer('El valor debe ser un número entero'),
});

export type AportesPaymentDetailsFormData = yup.InferType<
  typeof aportesPaymentDetailsSchema
>;

/**
 * Step 3: Code verification validation (reuse from 09a)
 */
export const codeVerificationSchema = yup.object({
  code: yup
    .string()
    .required('Por favor ingresa el código')
    .length(6, 'El código debe tener 6 dígitos')
    .matches(/^\d+$/, 'El código debe contener solo números'),
});

export type CodeVerificationFormData = yup.InferType<typeof codeVerificationSchema>;
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/09b-pagos/
├── references.md
└── spec.md

src/
├── atoms/
│   ├── CurrencyInput.tsx              # NEW
│   └── index.ts                       # UPDATE
│
├── molecules/
│   ├── AportesPaymentDetailRow.tsx    # NEW
│   └── index.ts                       # UPDATE
│
├── organisms/
│   ├── AportesDetailsCard.tsx         # NEW
│   ├── AportesConfirmationCard.tsx    # NEW
│   ├── AportesTransactionResultCard.tsx # NEW
│   └── index.ts                       # UPDATE
│
├── types/
│   ├── aportes-payment.ts             # NEW
│   └── index.ts                       # UPDATE
│
├── mocks/
│   ├── mockAportesPaymentData.ts      # NEW
│   └── index.ts                       # UPDATE
│
└── schemas/
    └── aportesPaymentSchemas.ts       # NEW

app/(authenticated)/pagos/pago-aportes/
├── page.tsx                           # NEW - Step 1
├── confirmacion/
│   └── page.tsx                       # NEW - Step 2
├── verificacion/
│   └── page.tsx                       # NEW - Step 3
└── resultado/
    └── page.tsx                       # NEW - Step 4
```

---

## Implementation Order

### Phase 1: Types & Mock Data
1. Create type definitions:
   - `src/types/aportes-payment.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockAportesPaymentData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Atoms
3. Create atoms:
   - `src/atoms/CurrencyInput.tsx`
   - Update `src/atoms/index.ts`

### Phase 3: Molecules
4. Create molecules:
   - `src/molecules/AportesPaymentDetailRow.tsx`
   - Update `src/molecules/index.ts`

### Phase 4: Organisms
5. Create organisms:
   - `src/organisms/AportesDetailsCard.tsx`
   - `src/organisms/AportesConfirmationCard.tsx`
   - `src/organisms/AportesTransactionResultCard.tsx`
   - Update `src/organisms/index.ts`

### Phase 5: Pages
6. Create pages in order:
   - `app/(authenticated)/pagos/pago-aportes/page.tsx` (Step 1)
   - `app/(authenticated)/pagos/pago-aportes/confirmacion/page.tsx` (Step 2)
   - `app/(authenticated)/pagos/pago-aportes/verificacion/page.tsx` (Step 3)
   - `app/(authenticated)/pagos/pago-aportes/resultado/page.tsx` (Step 4)

### Phase 6: Validation Schemas (Optional)
7. Create validation schemas:
   - `src/schemas/aportesPaymentSchemas.ts`

### Phase 7: Testing & Refinement
8. Manual testing of complete flow
9. Edge case testing
10. Responsive testing
11. Accessibility testing

---

## Testing Strategy

### Manual Testing Checklist

#### Step 1: Details
- [ ] Page renders correctly
- [ ] Stepper shows step 1 as active
- [ ] Account dropdown populates correctly
- [ ] hideBalances toggle works for all amounts
- [ ] "¿Necesitas más saldo?" link is clickable
- [ ] Payment breakdown shows correct amounts
- [ ] Mora amounts display in red color
- [ ] Value input is editable
- [ ] Value input formats with thousand separators
- [ ] Validation: error if no account selected
- [ ] Validation: error if value is 0 or negative
- [ ] Validation: error if insufficient balance
- [ ] "Volver" navigates to /pagos
- [ ] "Continuar" navigates to step 2 with valid data

#### Step 2: Confirmation
- [ ] Page renders correctly
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] User name and masked document display
- [ ] Payment details show correctly
- [ ] hideBalances toggle works
- [ ] "Volver" navigates back to step 1
- [ ] "Guardar Cambios" navigates to step 3
- [ ] Redirects to step 1 if no sessionStorage data

#### Step 3: Verification
- [ ] Page renders correctly (reuses CodeInputCard from 09a)
- [ ] Stepper shows step 3 active, steps 1-2 completed
- [ ] 6 code inputs render and work correctly
- [ ] Auto-focus and auto-advance work
- [ ] "Reenviar" link with cooldown works
- [ ] Error shows for incomplete/invalid code
- [ ] "Volver" navigates back to step 2
- [ ] "Pagar" processes payment with valid code
- [ ] Redirects to step 1 if no sessionStorage data

#### Step 4: Result
- [ ] Page renders correctly
- [ ] Stepper shows all steps completed
- [ ] Success icon and title show correctly
- [ ] Aportes-specific fields display correctly
- [ ] Valor pagado shows in navy color
- [ ] Description shows in green for success
- [ ] "Imprimir/Guardar" triggers print dialog
- [ ] "Finalizar" navigates to /pagos
- [ ] sessionStorage is cleared on finish

### Responsive Testing
- [ ] Desktop: Layout correct
- [ ] Tablet: Layout adapts
- [ ] Mobile: Stacked layout works
- [ ] Currency input usable on mobile

### Accessibility Testing
- [ ] Tab navigation works
- [ ] Focus states visible
- [ ] Screen reader announces correctly
- [ ] Form fields have proper labels
- [ ] Error messages announced

---

## Dependencies

### Reused from 09a-pagos
- `Stepper` molecule
- `CodeInput` atom
- `CodeInputGroup` molecule
- `CodeInputCard` organism
- `TransactionDetailRow` molecule
- Step types and interfaces
- Payment account type

### New for 09b-pagos
- `CurrencyInput` atom
- `AportesPaymentDetailRow` molecule
- `AportesDetailsCard` organism
- `AportesConfirmationCard` organism
- `AportesTransactionResultCard` organism
- Aportes-specific types

---

## Notes & Considerations

### Component Reuse
- Leverage Stepper, CodeInputGroup, and CodeInputCard from 09a
- If those don't exist yet, implement them as part of this feature
- Ensure components are properly exported for reuse

### Mora Display
- Always show mora amounts in red (`#E1172B`)
- Even when value is 0, show in red to indicate the category

### Value Input
- Allow free editing of payment amount
- Format with Colombian thousand separators (.)
- Consider adding min/max validation based on available balance

### Session Storage Keys
- Use distinct keys to avoid conflicts with 09a:
  - `aportesPaymentAccountId`
  - `aportesPaymentValor`
  - `aportesPaymentBreakdown`
  - `aportesPaymentConfirmation`

### Error States
- Handle insufficient balance
- Handle invalid code (max 3 attempts recommended)
- Handle network errors gracefully

### Security
- SMS code verification is mock for now
- In production, implement proper 2FA
- Add rate limiting for code attempts

---

**Last Updated**: 2026-01-05
**Status**: Ready for Implementation
**Estimated Effort**: 6-8 hours (assuming 09a components exist)
**Dependencies**: Feature 09a-pagos components should be implemented first
