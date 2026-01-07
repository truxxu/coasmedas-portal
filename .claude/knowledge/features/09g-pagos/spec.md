# Feature 09g - Pagos: Pago de Proteccion - Technical Specification

**Feature**: Protection Payment - Insurance/Policy Payment Flow
**Version**: 1.0
**Status**: Implementation Ready
**Last Updated**: 2026-01-07

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Technical Architecture](#technical-architecture)
3. [Type Definitions](#type-definitions)
4. [Component Specifications](#component-specifications)
5. [Page Implementations](#page-implementations)
6. [State Management](#state-management)
7. [Mock Data](#mock-data)
8. [Validation Schemas](#validation-schemas)
9. [File Structure](#file-structure)
10. [Implementation Order](#implementation-order)
11. [Testing Strategy](#testing-strategy)

---

## Feature Overview

The **Pago de Proteccion** feature allows users to pay their insurance products (protection policies) such as "Seguro de Vida" and "Poliza Exequial". This is a 4-step wizard flow nested within the `pagos/pagar-mis-productos` section.

### Key Characteristics
- **4-step wizard flow**: Detalle → Confirmacion → Codigo SMS → Respuesta
- **Visual product cards**: Users select protection products via selectable cards (not dropdowns)
- **SMS verification**: OTP code required to authorize the transaction
- **Transaction receipt**: Final page shows complete transaction details with print option
- **Insurance-specific labels**: Uses "Producto a Pagar", "Numero de Poliza" terminology

### User Journey
1. Select source account and protection product via visual cards
2. Review and confirm payment details (holder info, policy number, amount)
3. Enter 6-digit SMS verification code
4. View transaction result (success/failure) with receipt

### Route Structure
```
/pagos/pagar-mis-productos/proteccion/detalle       → Step 1: Payment Details
/pagos/pagar-mis-productos/proteccion/confirmacion  → Step 2: Confirmation
/pagos/pagar-mis-productos/proteccion/codigo-sms    → Step 3: SMS Code
/pagos/pagar-mis-productos/proteccion/respuesta     → Step 4: Response
```

### Key Differences from Other Payment Flows

| Aspect | Utility Payment (09f) | Protection Payment (09g) |
|--------|----------------------|--------------------------|
| Product Selection | Dropdown selection | Visual product cards |
| Card Display | N/A | Title + Number + Amount + Status |
| Selected State | N/A | Blue border (`#007FFF`) on card |
| Product Info | Service alias | Policy name, masked number |
| Confirmation Labels | "Servicio a Pagar" | "Producto a Pagar", "Numero de Poliza" |
| Response Labels | "Linea credito" | Insurance product name |

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   └── index.ts                                    # UPDATE (if needed)

├── molecules/
│   ├── ProtectionPaymentCard.tsx                   # NEW - Selectable protection product card
│   └── index.ts                                    # UPDATE

├── organisms/
│   ├── ProtectionPaymentForm.tsx                   # NEW - Step 1 form with cards
│   ├── ProtectionPaymentConfirmation.tsx           # NEW - Step 2 confirmation
│   ├── ProtectionPaymentSmsCode.tsx                # NEW - Step 3 SMS code
│   ├── ProtectionPaymentResponse.tsx               # NEW - Step 4 result
│   └── index.ts                                    # UPDATE

├── types/
│   ├── protection-payment.ts                       # NEW - Feature-specific types
│   └── index.ts                                    # UPDATE

├── mocks/
│   ├── mockProtectionPaymentData.ts                # NEW - Mock data
│   └── index.ts                                    # UPDATE

└── schemas/
    └── protectionPaymentSchemas.ts                 # NEW - Validation schemas

app/(authenticated)/pagos/
└── pagar-mis-productos/
    └── proteccion/
        ├── detalle/
        │   └── page.tsx                            # Step 1: Payment Details
        ├── confirmacion/
        │   └── page.tsx                            # Step 2: Confirmation
        ├── codigo-sms/
        │   └── page.tsx                            # Step 3: SMS Code
        └── respuesta/
            └── page.tsx                            # Step 4: Response
```

### Technology Stack
- **React 19**: Component framework
- **Next.js 16 App Router**: Routing and page structure
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **react-hook-form**: Form state management
- **yup**: Validation schemas

---

## Type Definitions

### File: `src/types/protection-payment.ts`

```typescript
/**
 * Source account for payment
 */
export interface ProtectionSourceAccount {
  id: string;
  type: 'ahorros' | 'corriente';
  accountNumber: string;
  maskedNumber: string;        // "***4428"
  balance: number;
  displayName: string;         // "Cuenta de Ahorros - Saldo: $ 8.730.500"
}

/**
 * Protection product status
 */
export type ProtectionPaymentStatus = 'activo' | 'inactivo' | 'cancelado';

/**
 * Protection product for payment selection
 */
export interface ProtectionPaymentProduct {
  id: string;
  title: string;               // "Seguro de Vida Grupo Deudores"
  productNumber: string;       // "No******65-9"
  nextPaymentAmount: number;   // 150000
  status: ProtectionPaymentStatus;
}

/**
 * Step 1 - Payment details form data
 */
export interface ProtectionPaymentDetailsForm {
  sourceAccountId: string;
  sourceAccountDisplay: string;
  selectedProduct: ProtectionPaymentProduct | null;
}

/**
 * Step 2 - Confirmation data
 */
export interface ProtectionPaymentConfirmation {
  holderName: string;          // "CAMILO ANDRES CRUZ"
  holderDocument: string;      // "CC 1.***.***234"
  productToPay: string;        // "Seguro de Vida Grupo Deudores"
  policyNumber: string;        // "No******65-9"
  productToDebit: string;      // "Cuenta de Ahorros"
  amountToPay: number;         // 150000
}

/**
 * Step 3 - SMS verification state
 */
export interface ProtectionSmsVerificationState {
  code: string;
  digits: string[];
  isSent: boolean;
  isResending: boolean;
  error: string | null;
  attemptsRemaining: number;
}

/**
 * Step 4 - Transaction result
 */
export interface ProtectionPaymentResult {
  success: boolean;
  creditLine: string;          // "Seguro de Vida Grupo Deudores"
  productNumber: string;       // "No******65-9"
  amountPaid: number;          // 150000
  transactionCost: number;     // 0
  transmissionDate: string;    // "3 de septiembre de 2025"
  transactionTime: string;     // "10:21 pm"
  approvalNumber: string;      // "463342"
  description: string;         // "Exitosa" or error message
}

/**
 * Complete payment flow state
 */
export interface ProtectionPaymentFlowState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4;

  // Step 1 data
  details: ProtectionPaymentDetailsForm;

  // Step 2 data (derived from step 1 + user data)
  confirmation: ProtectionPaymentConfirmation | null;

  // Step 3 data
  smsVerification: ProtectionSmsVerificationState;

  // Step 4 data
  result: ProtectionPaymentResult | null;

  // Options
  sourceAccounts: ProtectionSourceAccount[];
  products: ProtectionPaymentProduct[];

  // UI State
  isLoading: boolean;
  error: string | null;
}

/**
 * Stepper step configuration
 */
export interface ProtectionStepperStep {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}
```

### Update: `src/types/index.ts`

```typescript
export * from './protection-payment';
```

---

## Component Specifications

### Reusable Components (from previous features)

The following components should already exist from 09f-pagos and can be reused:

| Component | Location | Usage |
|-----------|----------|-------|
| `OtpDigitInput` | `src/atoms` | Single digit input for OTP |
| `OtpInput` | `src/molecules` | 6-digit OTP input group |
| `PaymentDetailRow` | `src/molecules` | Label-value row for confirmation |
| `TransactionSuccessHeader` | `src/molecules` | Success/error icon with title |
| `Stepper` | `src/molecules` | Progress stepper |
| `BackButton` | `src/atoms` | Back navigation arrow |
| `Button` | `src/atoms` | Primary, secondary buttons |
| `Card` | `src/atoms` | Main content card |
| `Divider` | `src/atoms` | Horizontal separators |
| `Breadcrumbs` | `src/molecules` | Navigation breadcrumbs |
| `HideBalancesToggle` | `src/molecules` | Balance visibility toggle |

---

### New Molecules

#### `ProtectionPaymentCard.tsx`

**Location**: `src/molecules/ProtectionPaymentCard.tsx`

**Purpose**: Selectable protection product card for Step 1 product selection

**Props Interface**:
```typescript
interface ProtectionPaymentCardProps {
  product: ProtectionPaymentProduct;
  isSelected: boolean;
  onSelect: (product: ProtectionPaymentProduct) => void;
  hideBalances?: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { ProtectionPaymentProduct } from '@/src/types/protection-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ProtectionPaymentCardProps {
  product: ProtectionPaymentProduct;
  isSelected: boolean;
  onSelect: (product: ProtectionPaymentProduct) => void;
  hideBalances?: boolean;
}

const statusColors = {
  activo: 'text-[#00A44C]',
  inactivo: 'text-[#808284]',
  cancelado: 'text-[#FF0D00]',
};

const statusLabels = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  cancelado: 'Cancelado',
};

export const ProtectionPaymentCard: React.FC<ProtectionPaymentCardProps> = ({
  product,
  isSelected,
  onSelect,
  hideBalances = false,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={`
        w-full min-w-[280px] max-w-[320px] p-5
        rounded-lg border-2 transition-all duration-200
        text-left cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:ring-offset-2
        ${isSelected
          ? 'bg-white border-[#007FFF]'
          : 'bg-white border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
      `}
      aria-pressed={isSelected}
      aria-label={`Seleccionar ${product.title}`}
    >
      {/* Product Title */}
      <h3 className="text-base font-medium text-black mb-2">
        {product.title}
      </h3>

      {/* Product Number */}
      <p className="text-sm text-black mb-3">
        Numero: {product.productNumber}
      </p>

      {/* Next Payment Section */}
      <div className="mb-3">
        <p className="text-sm text-black mb-1">Proximo Pago</p>
        <p className="text-[19px] font-medium text-[#194E8D]">
          {hideBalances ? maskCurrency() : formatCurrency(product.nextPaymentAmount)}
        </p>
      </div>

      {/* Status Badge */}
      <span className={`text-[15px] ${statusColors[product.status]}`}>
        {statusLabels[product.status]}
      </span>
    </button>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### New Organisms

#### `ProtectionPaymentForm.tsx`

**Location**: `src/organisms/ProtectionPaymentForm.tsx`

**Purpose**: Step 1 form with source account dropdown and product card selection

**Props Interface**:
```typescript
interface ProtectionPaymentFormProps {
  sourceAccounts: ProtectionSourceAccount[];
  products: ProtectionPaymentProduct[];
  formData: ProtectionPaymentDetailsForm;
  selectedProduct: ProtectionPaymentProduct | null;
  errors: {
    sourceAccount?: string;
    product?: string;
  };
  onSourceAccountChange: (accountId: string) => void;
  onProductSelect: (product: ProtectionPaymentProduct) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  hideBalances?: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { Card, Button } from '@/src/atoms';
import { ProtectionPaymentCard } from '@/src/molecules';
import {
  ProtectionSourceAccount,
  ProtectionPaymentProduct,
  ProtectionPaymentDetailsForm as FormData,
} from '@/src/types/protection-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ProtectionPaymentFormProps {
  sourceAccounts: ProtectionSourceAccount[];
  products: ProtectionPaymentProduct[];
  formData: FormData;
  selectedProduct: ProtectionPaymentProduct | null;
  errors: {
    sourceAccount?: string;
    product?: string;
  };
  onSourceAccountChange: (accountId: string) => void;
  onProductSelect: (product: ProtectionPaymentProduct) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  hideBalances?: boolean;
}

export const ProtectionPaymentForm: React.FC<ProtectionPaymentFormProps> = ({
  sourceAccounts,
  products,
  formData,
  selectedProduct,
  errors,
  onSourceAccountChange,
  onProductSelect,
  onSubmit,
  onBack,
  isLoading = false,
  hideBalances = false,
}) => {
  // Generate display name for account with optional masking
  const getAccountDisplayName = (account: ProtectionSourceAccount) => {
    if (hideBalances) {
      return `${account.type === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'} - Saldo: ${maskCurrency()}`;
    }
    return account.displayName;
  };

  return (
    <Card className="space-y-6">
      {/* Card Title */}
      <h2 className="text-xl font-bold text-[#194E8D]">
        Pago de Proteccion
      </h2>

      {/* Source Account Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-[15px] text-black">
            De cual cuenta quiere pagar?
          </label>
          <a
            href="/productos/ahorros"
            className="text-xs text-[#1D4E8F] hover:underline"
          >
            Necesitas mas saldo?
          </a>
        </div>
        <select
          value={formData.sourceAccountId}
          onChange={(e) => onSourceAccountChange(e.target.value)}
          className={`
            w-full h-10 px-3 rounded-md border text-base text-black bg-white
            focus:outline-none focus:ring-2 focus:ring-[#007FFF]
            ${errors.sourceAccount ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
          `}
        >
          <option value="">Seleccionar cuenta</option>
          {sourceAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {getAccountDisplayName(account)}
            </option>
          ))}
        </select>
        {errors.sourceAccount && (
          <p className="text-sm text-[#FF0D00]">{errors.sourceAccount}</p>
        )}
      </div>

      {/* Product Selection Section */}
      <div className="space-y-3">
        <label className="block text-[15px] text-black">
          Selecciona el producto que deseas pagar
        </label>

        {/* Product Cards - Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <ProtectionPaymentCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onSelect={onProductSelect}
              hideBalances={hideBalances}
            />
          ))}
        </div>

        {/* Helper Text */}
        <p className="text-sm text-[#636363] text-center">
          Selecciona el producto que deseas pagar
        </p>

        {errors.product && (
          <p className="text-sm text-[#FF0D00] text-center">{errors.product}</p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#1D4E8F] hover:underline"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Continuar'}
        </Button>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `ProtectionPaymentConfirmation.tsx`

**Location**: `src/organisms/ProtectionPaymentConfirmation.tsx`

**Props Interface**:
```typescript
interface ProtectionPaymentConfirmationProps {
  confirmation: ProtectionPaymentConfirmation;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  hideBalances?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Button, Divider } from '@/src/atoms';
import { PaymentDetailRow } from '@/src/molecules';
import { ProtectionPaymentConfirmation as ConfirmationData } from '@/src/types/protection-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ProtectionPaymentConfirmationProps {
  confirmation: ConfirmationData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  hideBalances?: boolean;
}

export const ProtectionPaymentConfirmation: React.FC<ProtectionPaymentConfirmationProps> = ({
  confirmation,
  onConfirm,
  onBack,
  isLoading = false,
  hideBalances = false,
}) => {
  return (
    <Card className="space-y-6">
      {/* Card Title */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-[#1D4E8F]">
          Confirmacion de Pagos
        </h2>
        <p className="text-[15px] text-black">
          Por favor, verifica que los datos de la transaccion sean correctos antes de continuar.
        </p>
      </div>

      {/* Confirmation Details */}
      <div className="space-y-1">
        {/* User Info Section */}
        <PaymentDetailRow
          label="Titular"
          value={confirmation.holderName}
        />
        <PaymentDetailRow
          label="Documento"
          value={confirmation.holderDocument}
          showDivider
        />

        {/* Product Info Section */}
        <PaymentDetailRow
          label="Producto a Pagar"
          value={confirmation.productToPay}
        />
        <PaymentDetailRow
          label="Numero de Poliza"
          value={confirmation.policyNumber}
        />
        <PaymentDetailRow
          label="Producto a Debitar"
          value={confirmation.productToDebit}
        />
        <PaymentDetailRow
          label="Valor a Pagar"
          value={hideBalances ? maskCurrency() : formatCurrency(confirmation.amountToPay)}
          valueSize="large"
        />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#004266] hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Confirmar Pago'}
        </Button>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `ProtectionPaymentSmsCode.tsx`

**Location**: `src/organisms/ProtectionPaymentSmsCode.tsx`

**Props Interface**:
```typescript
interface ProtectionPaymentSmsCodeProps {
  otpValue: string;
  onOtpChange: (value: string) => void;
  onResend: () => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { Card, Button } from '@/src/atoms';
import { OtpInput } from '@/src/molecules';

interface ProtectionPaymentSmsCodeProps {
  otpValue: string;
  onOtpChange: (value: string) => void;
  onResend: () => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string;
}

export const ProtectionPaymentSmsCode: React.FC<ProtectionPaymentSmsCodeProps> = ({
  otpValue,
  onOtpChange,
  onResend,
  onSubmit,
  onBack,
  isLoading = false,
  isResending = false,
  error,
}) => {
  return (
    <Card className="space-y-6">
      {/* Card Title */}
      <div className="text-center space-y-3">
        <h2 className="text-[17px] font-bold text-[#1D4E8F]">
          Codigo Enviado a tu Telefono
        </h2>
        <p className="text-[15px] text-black">
          Ingresa la clave de 6 digitos enviada a tu dispositivo para autorizar la transaccion
        </p>
      </div>

      {/* OTP Input */}
      <div className="py-4">
        <OtpInput
          value={otpValue}
          onChange={onOtpChange}
          length={6}
          hasError={!!error}
          errorMessage={error}
        />
      </div>

      {/* Resend Code Section */}
      <div className="text-center">
        <span className="text-[15px] text-black">No recibiste la clave? </span>
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="text-[15px] font-medium text-[#1D4E8F] underline hover:no-underline disabled:opacity-50"
        >
          {isResending ? 'Reenviando...' : 'Reenviar'}
        </button>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#004266] hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isLoading || otpValue.length !== 6}
        >
          {isLoading ? 'Procesando...' : 'Pagar'}
        </Button>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `ProtectionPaymentResponse.tsx`

**Location**: `src/organisms/ProtectionPaymentResponse.tsx`

**Props Interface**:
```typescript
interface ProtectionPaymentResponseProps {
  result: ProtectionPaymentResult;
  onPrint: () => void;
  onFinish: () => void;
  hideBalances?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Button, Divider } from '@/src/atoms';
import { TransactionSuccessHeader, PaymentDetailRow } from '@/src/molecules';
import { ProtectionPaymentResult } from '@/src/types/protection-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ProtectionPaymentResponseProps {
  result: ProtectionPaymentResult;
  onPrint: () => void;
  onFinish: () => void;
  hideBalances?: boolean;
}

export const ProtectionPaymentResponse: React.FC<ProtectionPaymentResponseProps> = ({
  result,
  onPrint,
  onFinish,
  hideBalances = false,
}) => {
  return (
    <Card className="space-y-6">
      {/* Success/Error Header */}
      <TransactionSuccessHeader success={result.success} />

      {/* Transaction Details */}
      <div className="space-y-1">
        <PaymentDetailRow
          label="Linea credito"
          value={result.creditLine}
        />
        <PaymentDetailRow
          label="Numero de producto"
          value={result.productNumber}
        />
        <PaymentDetailRow
          label="Valor pagado"
          value={hideBalances ? maskCurrency() : formatCurrency(result.amountPaid)}
          valueSize="large"
        />
        <PaymentDetailRow
          label="Costo Transaccion"
          value={formatCurrency(result.transactionCost)}
          showDivider
        />
        <PaymentDetailRow
          label="Fecha de Transmision"
          value={result.transmissionDate}
        />
        <PaymentDetailRow
          label="Hora de Transaccion"
          value={result.transactionTime}
        />
        <PaymentDetailRow
          label="Numero de Aprobacion"
          value={result.approvalNumber}
        />
        <PaymentDetailRow
          label="Descripcion"
          value={result.description}
          valueColor={result.success ? 'success' : 'error'}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end items-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onPrint}
        >
          Imprimir/Guardar
        </Button>
        <Button
          variant="primary"
          onClick={onFinish}
        >
          Finalizar
        </Button>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

## Page Implementations

### Constants: Stepper Configuration

```typescript
// Used across all pages
export const PROTECTION_PAYMENT_STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];
```

---

### Page 1: Payment Details (Detalle)

**File**: `app/(authenticated)/pagos/pagar-mis-productos/proteccion/detalle/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ProtectionPaymentForm } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { useUIContext } from '@/src/contexts';
import {
  mockProtectionSourceAccounts,
  mockProtectionPaymentProducts,
} from '@/src/mocks/mockProtectionPaymentData';
import {
  ProtectionPaymentDetailsForm as FormData,
  ProtectionPaymentProduct,
} from '@/src/types/protection-payment';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

const initialFormData: FormData = {
  sourceAccountId: '',
  sourceAccountDisplay: '',
  selectedProduct: null,
};

export default function ProteccionDetallePage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedProduct, setSelectedProduct] = useState<ProtectionPaymentProduct | null>(null);
  const [errors, setErrors] = useState<{
    sourceAccount?: string;
    product?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pagos de Proteccion', href: '/pagos/pagar-mis-productos/proteccion/detalle' },
  ];

  const handleSourceAccountChange = (accountId: string) => {
    const account = mockProtectionSourceAccounts.find(a => a.id === accountId);
    setFormData(prev => ({
      ...prev,
      sourceAccountId: accountId,
      sourceAccountDisplay: account?.displayName || '',
    }));
    setErrors(prev => ({ ...prev, sourceAccount: undefined }));
  };

  const handleProductSelect = (product: ProtectionPaymentProduct) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      selectedProduct: product,
    }));
    setErrors(prev => ({ ...prev, product: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.sourceAccountId) {
      newErrors.sourceAccount = 'Por favor selecciona una cuenta origen';
    }
    if (!selectedProduct) {
      newErrors.product = 'Por favor selecciona un producto de proteccion';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Store form data in sessionStorage
    const dataToStore = {
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
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">
            Pago de Proteccion
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={1} />

      {/* Form */}
      <ProtectionPaymentForm
        sourceAccounts={mockProtectionSourceAccounts}
        products={mockProtectionPaymentProducts}
        formData={formData}
        selectedProduct={selectedProduct}
        errors={errors}
        onSourceAccountChange={handleSourceAccountChange}
        onProductSelect={handleProductSelect}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLoading={isLoading}
        hideBalances={hideBalances}
      />
    </div>
  );
}
```

---

### Page 2: Confirmation (Confirmacion)

**File**: `app/(authenticated)/pagos/pagar-mis-productos/proteccion/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ProtectionPaymentConfirmation } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { useUIContext } from '@/src/contexts';
import {
  ProtectionPaymentDetailsForm,
  ProtectionPaymentConfirmation as ConfirmationData,
} from '@/src/types/protection-payment';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

export default function ProteccionConfirmacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pagos de Proteccion', href: '/pagos/pagar-mis-productos/proteccion/detalle' },
  ];

  useEffect(() => {
    const detailsStr = sessionStorage.getItem('protectionPaymentDetails');
    if (!detailsStr) {
      router.push('/pagos/pagar-mis-productos/proteccion/detalle');
      return;
    }

    const details: ProtectionPaymentDetailsForm = JSON.parse(detailsStr);

    // Build confirmation data
    setConfirmation({
      holderName: 'CAMILO ANDRES CRUZ',  // Would come from user context
      holderDocument: 'CC 1.***.***234',
      productToPay: details.selectedProduct?.title || '',
      policyNumber: details.selectedProduct?.productNumber || '',
      productToDebit: details.sourceAccountDisplay.split(' - ')[0] || 'Cuenta de Ahorros',
      amountToPay: details.selectedProduct?.nextPaymentAmount || 0,
    });
  }, [router]);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Store confirmation and trigger SMS send
      sessionStorage.setItem('protectionPaymentConfirmation', JSON.stringify(confirmation));

      // Simulate SMS send
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/pagos/pagar-mis-productos/proteccion/codigo-sms');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos/proteccion/detalle');
  };

  if (!confirmation) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">
            Pago de Proteccion
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={2} />

      {/* Confirmation Card */}
      <ProtectionPaymentConfirmation
        confirmation={confirmation}
        onConfirm={handleConfirm}
        onBack={handleBack}
        isLoading={isLoading}
        hideBalances={hideBalances}
      />
    </div>
  );
}
```

---

### Page 3: SMS Code (Codigo SMS)

**File**: `app/(authenticated)/pagos/pagar-mis-productos/proteccion/codigo-sms/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ProtectionPaymentSmsCode } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { mockProtectionTransactionResult } from '@/src/mocks/mockProtectionPaymentData';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

export default function ProteccionCodigoSmsPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pagos de Proteccion', href: '/pagos/pagar-mis-productos/proteccion/detalle' },
  ];

  useEffect(() => {
    // Check if we have confirmation data
    const confirmationStr = sessionStorage.getItem('protectionPaymentConfirmation');
    if (!confirmationStr) {
      router.push('/pagos/pagar-mis-productos/proteccion/detalle');
    }
  }, [router]);

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setError(undefined);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Simulate resend
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpValue('');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async () => {
    if (otpValue.length !== 6) {
      setError('Por favor ingresa el codigo completo de 6 digitos');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation - accept any 6-digit code for demo
      // In production, this would validate against the actual SMS code

      // Store result
      sessionStorage.setItem('protectionPaymentResult', JSON.stringify(mockProtectionTransactionResult));

      router.push('/pagos/pagar-mis-productos/proteccion/respuesta');
    } catch (err) {
      setError('Codigo invalido. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/pagar-mis-productos/proteccion/confirmacion');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">
            Pago de Proteccion
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={3} />

      {/* SMS Code Card */}
      <ProtectionPaymentSmsCode
        otpValue={otpValue}
        onOtpChange={handleOtpChange}
        onResend={handleResend}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLoading={isLoading}
        isResending={isResending}
        error={error}
      />
    </div>
  );
}
```

---

### Page 4: Response (Respuesta)

**File**: `app/(authenticated)/pagos/pagar-mis-productos/proteccion/respuesta/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ProtectionPaymentResponse } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { useUIContext } from '@/src/contexts';
import { ProtectionPaymentResult } from '@/src/types/protection-payment';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmacion' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalizacion' },
];

export default function ProteccionRespuestaPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [result, setResult] = useState<ProtectionPaymentResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pagos de Proteccion', href: '/pagos/pagar-mis-productos/proteccion/detalle' },
  ];

  useEffect(() => {
    const resultStr = sessionStorage.getItem('protectionPaymentResult');
    if (!resultStr) {
      router.push('/pagos/pagar-mis-productos/proteccion/detalle');
      return;
    }

    setResult(JSON.parse(resultStr));

    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('protectionPaymentDetails');
      sessionStorage.removeItem('protectionPaymentConfirmation');
      sessionStorage.removeItem('protectionPaymentResult');
    };
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear all session data
    sessionStorage.removeItem('protectionPaymentDetails');
    sessionStorage.removeItem('protectionPaymentConfirmation');
    sessionStorage.removeItem('protectionPaymentResult');

    router.push('/home');
  };

  if (!result) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleFinish} />
          <h1 className="text-xl font-medium text-black">
            Pago de Proteccion
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper - All completed */}
      <Stepper steps={STEPS} currentStep={4} />

      {/* Response Card */}
      <ProtectionPaymentResponse
        result={result}
        onPrint={handlePrint}
        onFinish={handleFinish}
        hideBalances={hideBalances}
      />
    </div>
  );
}
```

---

## State Management

### SessionStorage Keys

| Key | Description | Type |
|-----|-------------|------|
| `protectionPaymentDetails` | Form data from step 1 | JSON (ProtectionPaymentDetailsForm) |
| `protectionPaymentConfirmation` | Confirmation data from step 2 | JSON (ProtectionPaymentConfirmation) |
| `protectionPaymentResult` | Transaction result from step 4 | JSON (ProtectionPaymentResult) |

### Navigation Flow

```
/pagos/pagar-mis-productos (Product Type Selection)
    ↓ Select "Proteccion"
/pagos/pagar-mis-productos/proteccion/detalle (Step 1)
    ↓ Submit form
/pagos/pagar-mis-productos/proteccion/confirmacion (Step 2)
    ↓ Confirm payment (triggers SMS)
/pagos/pagar-mis-productos/proteccion/codigo-sms (Step 3)
    ↓ Enter OTP and submit
/pagos/pagar-mis-productos/proteccion/respuesta (Step 4)
    ↓ Finish
/home (Return to dashboard)
```

### Back Navigation
- Step 1 → /pagos/pagar-mis-productos page
- Step 2 → Step 1 (preserves form data)
- Step 3 → Step 2 (preserves data)
- Step 4 → Home (no back to SMS, transaction completed)

---

## Mock Data

### File: `src/mocks/mockProtectionPaymentData.ts`

```typescript
import {
  ProtectionSourceAccount,
  ProtectionPaymentProduct,
  ProtectionPaymentResult,
} from '@/src/types/protection-payment';

/**
 * Mock source accounts for protection payment
 */
export const mockProtectionSourceAccounts: ProtectionSourceAccount[] = [
  {
    id: '1',
    type: 'ahorros',
    accountNumber: '12345678',
    maskedNumber: '***5678',
    balance: 8730500,
    displayName: 'Cuenta de Ahorros - Saldo: $ 8.730.500',
  },
  {
    id: '2',
    type: 'corriente',
    accountNumber: '87654321',
    maskedNumber: '***4321',
    balance: 2500000,
    displayName: 'Cuenta Corriente - Saldo: $ 2.500.000',
  },
];

/**
 * Mock protection products for payment selection
 */
export const mockProtectionPaymentProducts: ProtectionPaymentProduct[] = [
  {
    id: '1',
    title: 'Seguro de Vida Grupo Deudores',
    productNumber: 'No******65-9',
    nextPaymentAmount: 150000,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Poliza Exequial Familiar',
    productNumber: 'No******12-3',
    nextPaymentAmount: 55000,
    status: 'activo',
  },
];

/**
 * Mock transaction result (success)
 */
export const mockProtectionTransactionResult: ProtectionPaymentResult = {
  success: true,
  creditLine: 'Seguro de Vida Grupo Deudores',
  productNumber: 'No******65-9',
  amountPaid: 150000,
  transactionCost: 0,
  transmissionDate: '3 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '463342',
  description: 'Exitosa',
};

/**
 * Mock transaction result (error)
 */
export const mockProtectionTransactionResultError: ProtectionPaymentResult = {
  success: false,
  creditLine: 'Seguro de Vida Grupo Deudores',
  productNumber: 'No******65-9',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '3 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '',
  description: 'Fondos insuficientes',
};
```

### Update: `src/mocks/index.ts`

```typescript
export * from './mockProtectionPaymentData';
```

---

## Validation Schemas

### File: `src/schemas/protectionPaymentSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Step 1 - Payment details validation
 */
export const protectionPaymentDetailsSchema = yup.object({
  sourceAccountId: yup
    .string()
    .required('Por favor selecciona una cuenta origen'),
  selectedProduct: yup
    .object()
    .nullable()
    .required('Por favor selecciona un producto de proteccion'),
});

/**
 * Step 3 - SMS code validation
 */
export const protectionOtpCodeSchema = yup.object({
  code: yup
    .string()
    .length(6, 'El codigo debe tener 6 digitos')
    .matches(/^\d{6}$/, 'El codigo debe contener solo numeros')
    .required('Por favor ingresa el codigo'),
});

export type ProtectionPaymentDetailsFormData = yup.InferType<typeof protectionPaymentDetailsSchema>;
export type ProtectionOtpCodeFormData = yup.InferType<typeof protectionOtpCodeSchema>;
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/09g-pagos/
├── references.md
└── spec.md

src/
├── molecules/
│   ├── ProtectionPaymentCard.tsx                   # NEW
│   └── index.ts                                    # UPDATE

├── organisms/
│   ├── ProtectionPaymentForm.tsx                   # NEW
│   ├── ProtectionPaymentConfirmation.tsx           # NEW
│   ├── ProtectionPaymentSmsCode.tsx                # NEW
│   ├── ProtectionPaymentResponse.tsx               # NEW
│   └── index.ts                                    # UPDATE

├── types/
│   ├── protection-payment.ts                       # NEW
│   └── index.ts                                    # UPDATE

├── mocks/
│   ├── mockProtectionPaymentData.ts                # NEW
│   └── index.ts                                    # UPDATE

└── schemas/
    └── protectionPaymentSchemas.ts                 # NEW

app/(authenticated)/pagos/
└── pagar-mis-productos/
    └── proteccion/
        ├── detalle/
        │   └── page.tsx                            # NEW - Step 1
        ├── confirmacion/
        │   └── page.tsx                            # NEW - Step 2
        ├── codigo-sms/
        │   └── page.tsx                            # NEW - Step 3
        └── respuesta/
            └── page.tsx                            # NEW - Step 4
```

---

## Implementation Order

### Phase 1: Types & Mock Data
1. Create type definitions:
   - `src/types/protection-payment.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockProtectionPaymentData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Molecules
3. Create molecules:
   - `src/molecules/ProtectionPaymentCard.tsx`
   - Update `src/molecules/index.ts`

### Phase 3: Organisms
4. Create organisms:
   - `src/organisms/ProtectionPaymentForm.tsx`
   - `src/organisms/ProtectionPaymentConfirmation.tsx`
   - `src/organisms/ProtectionPaymentSmsCode.tsx`
   - `src/organisms/ProtectionPaymentResponse.tsx`
   - Update `src/organisms/index.ts`

### Phase 4: Pages
5. Create pages in order:
   - `app/(authenticated)/pagos/pagar-mis-productos/proteccion/detalle/page.tsx`
   - `app/(authenticated)/pagos/pagar-mis-productos/proteccion/confirmacion/page.tsx`
   - `app/(authenticated)/pagos/pagar-mis-productos/proteccion/codigo-sms/page.tsx`
   - `app/(authenticated)/pagos/pagar-mis-productos/proteccion/respuesta/page.tsx`

### Phase 5: Integration
6. Update pagar-mis-productos page:
   - Add link/navigation to protection payment flow

### Phase 6: Validation Schemas (Optional)
7. Create validation schemas:
   - `src/schemas/protectionPaymentSchemas.ts`

### Phase 7: Testing & Refinement
8. Manual testing of complete flow
9. Edge case testing
10. Responsive testing
11. Accessibility testing

---

## Testing Strategy

### Manual Testing Checklist

#### Page 1: Payment Details (Detalle)
- [ ] Page renders correctly
- [ ] Back button navigates to pagar-mis-productos page
- [ ] Breadcrumbs display correctly: "Inicio / Pagos / Pagos de Proteccion"
- [ ] Stepper shows step 1 as active (blue)
- [ ] Steps 2, 3, 4 show as inactive (gray)
- [ ] "Ocultar saldos" toggle works
- [ ] Card title "Pago de Proteccion" displays in navy blue
- [ ] Cuenta Origen dropdown populates with accounts
- [ ] Balance hidden when hideBalances is true
- [ ] "Necesitas mas saldo?" link displays
- [ ] Protection product cards render horizontally
- [ ] Cards show: title, number, next payment amount, status
- [ ] Clicking a card selects it (blue border)
- [ ] Only one card can be selected at a time
- [ ] Previously selected card deselects when new one selected
- [ ] Helper text "Selecciona el producto que deseas pagar" displays
- [ ] Validation: error if account not selected
- [ ] Validation: error if no product selected
- [ ] "Volver" link navigates back
- [ ] "Continuar" button validates and navigates to step 2
- [ ] Form data stored in sessionStorage

#### Page 2: Confirmation (Confirmacion)
- [ ] Page renders correctly
- [ ] Back button navigates to step 1
- [ ] Stepper shows steps 1-2 as active
- [ ] Card title "Confirmacion de Pagos" displays
- [ ] Subtitle "Por favor, verifica que los datos..." displays
- [ ] Titular displays (e.g., "CAMILO ANDRES CRUZ")
- [ ] Documento displays masked (e.g., "CC 1.***.***234")
- [ ] Divider between user info and product info
- [ ] Producto a Pagar displays correctly
- [ ] Numero de Poliza displays correctly
- [ ] Producto a Debitar displays
- [ ] Valor a Pagar displays (large, formatted)
- [ ] Amount hidden when hideBalances is true
- [ ] "Volver" link navigates back (preserves data)
- [ ] "Confirmar Pago" button shows loading state
- [ ] Successful confirmation navigates to step 3

#### Page 3: SMS Code (Codigo SMS)
- [ ] Page renders correctly
- [ ] Back button navigates to step 2
- [ ] Stepper shows steps 1-3 as active
- [ ] Card title "Codigo Enviado a tu Telefono" displays centered
- [ ] Instructions text displays centered
- [ ] 6 digit input boxes render
- [ ] Each box accepts only 1 digit
- [ ] Auto-focus moves to next box on input
- [ ] Backspace moves to previous box
- [ ] Paste works for full 6-digit code
- [ ] "No recibiste la clave?" text displays
- [ ] "Reenviar" link triggers resend
- [ ] Resend shows loading state
- [ ] "Volver" link navigates back
- [ ] "Pagar" button disabled until 6 digits entered
- [ ] "Pagar" button shows loading state
- [ ] Invalid code shows error message
- [ ] Successful submission navigates to step 4

#### Page 4: Response (Respuesta)
- [ ] Page renders correctly
- [ ] Stepper shows all 4 steps as active (blue)
- [ ] Success icon (green checkmark) displays for success
- [ ] "Transaccion Exitosa" title displays
- [ ] All transaction details display correctly:
  - [ ] Linea credito (product name)
  - [ ] Numero de producto (masked)
  - [ ] Valor pagado (large, formatted)
  - [ ] Costo Transaccion
  - [ ] Fecha de Transmision
  - [ ] Hora de Transaccion
  - [ ] Numero de Aprobacion
  - [ ] Descripcion (green for success)
- [ ] Dividers separate sections appropriately
- [ ] "Imprimir/Guardar" button triggers print
- [ ] "Finalizar" button navigates to home
- [ ] sessionStorage is cleared on finish

### Error States Testing
- [ ] Empty source account shows error
- [ ] No product selected shows error
- [ ] Invalid OTP shows error
- [ ] Expired OTP shows error
- [ ] Network error handling
- [ ] Transaction failure displays error result

### Responsive Testing
- [ ] Desktop (>=1024px): Full layout, cards side by side
- [ ] Tablet (640-1023px): Cards may stack or scroll
- [ ] Mobile (<640px): Stacked layouts, horizontal scroll for cards
- [ ] OTP inputs fit on mobile
- [ ] Buttons stack on mobile if needed
- [ ] Stepper labels visible on all sizes

### Accessibility Testing
- [ ] Tab navigation works through all elements
- [ ] Focus states visible on all interactive elements
- [ ] Form labels properly associated
- [ ] Product cards have aria-pressed state
- [ ] Product cards have aria-label
- [ ] OTP inputs have aria-labels
- [ ] Error messages announced to screen readers
- [ ] Success/Error icons have aria-labels
- [ ] Color contrast meets WCAG AA

---

## Design System Values Reference

### Colors

| Element | Color | Hex |
|---------|-------|-----|
| Card Title | Navy Blue | #194E8D |
| SMS Title | Navy Blue | #1D4E8F |
| Primary Button | Blue | #007FFF |
| Link Text | Navy Blue | #1D4E8F |
| Back Link Text | Dark Blue | #004266 |
| Success Text/Icon | Green | #00A44C |
| Error Text/Icon | Red | #FF0D00 |
| Active Stepper | Blue | #007FFF |
| Inactive Stepper | Gray | #E4E6EA |
| Selected Card Border | Blue | #007FFF |
| Unselected Card Border | Gray | #E4E6EA |
| Dividers | Light Gray | #E4E6EA |
| Card Background | White | #FFFFFF |
| Page Background | Light Blue | #F0F9FF |
| Payment Amount | Navy | #194E8D |
| Helper Text | Gray | #636363 |
| Active Status | Green | #00A44C |
| Inactive Status | Gray | #808284 |
| Cancelled Status | Red | #FF0D00 |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Card Title | Ubuntu | 20px | Bold |
| Section Title | Ubuntu | 18px | Bold |
| SMS Title | Ubuntu | 17px | Bold |
| Body Text | Ubuntu | 15px | Regular |
| Label | Ubuntu | 15px | Regular |
| Value | Ubuntu | 15px | Medium |
| Payment Amount (Large) | Ubuntu | 19px | Medium |
| Amount on Card | Ubuntu | 19px | Medium |
| Stepper Label | Ubuntu | 12px | Regular |
| Button | Ubuntu | 14px | Bold |
| Helper Text | Ubuntu | 14px | Regular |
| Small Link | Ubuntu | 12px | Regular |
| Status Badge | Ubuntu | 15px | Regular |

### Spacing
- Card padding: `20-24px` (p-5 to p-6)
- Section spacing: `24px` (space-y-6)
- Form field spacing: `12-20px` (space-y-3 to space-y-5)
- Product card min-width: `280px`
- Product card max-width: `320px`
- Stepper connector width: `140px`

### Border Radius
- Cards: `16px` (rounded-2xl) for main card
- Product cards: `8px` (rounded-lg)
- Stepper circles: `9999px` (rounded-full)
- Inputs: `6px` (rounded-md)
- Buttons: `6px` (rounded-md)

---

## Dependencies

### Existing Components (Reuse from 09f-pagos)
- `OtpDigitInput` atom
- `OtpInput` molecule
- `PaymentDetailRow` molecule
- `TransactionSuccessHeader` molecule
- `Stepper` molecule
- `BackButton` atom
- `Button` atom
- `Card` atom
- `Divider` atom
- `Breadcrumbs` molecule
- `HideBalancesToggle` molecule
- `SuccessIcon` atom
- `ErrorIcon` atom

### New for 09g-pagos
- `ProtectionPaymentCard` molecule
- `ProtectionPaymentForm` organism
- `ProtectionPaymentConfirmation` organism
- `ProtectionPaymentSmsCode` organism
- `ProtectionPaymentResponse` organism

---

## API Integration Points (Future)

- `GET /api/accounts` - Get user's source accounts
- `GET /api/protection/products` - Get user's protection products for payment
- `POST /api/protection/pay/initiate` - Initiate payment (returns confirmation data)
- `POST /api/protection/pay/send-otp` - Send SMS verification code
- `POST /api/protection/pay/verify-otp` - Verify OTP code
- `POST /api/protection/pay/confirm` - Confirm and process payment
- `GET /api/protection/pay/receipt/{transactionId}` - Get transaction receipt

---

## Notes & Considerations

### Key Differences from Utility Payment (09f)
1. **Product Selection**: Uses visual cards instead of dropdown
2. **Card Structure**: Shows title, masked number, next payment, and status
3. **Selection State**: Blue border on selected card
4. **Labels**: Insurance-specific ("Producto a Pagar", "Numero de Poliza")
5. **Amount Display**: Shows "Proximo Pago" on each card

### Product Card Behavior
- Cards are horizontally scrollable on smaller screens
- Only active products should be selectable
- Inactive/cancelled products could be shown but disabled

### Hide Balances Feature
- Source account balances should be masked
- Product payment amounts should be masked
- Transaction values should be masked on confirmation and result

### Error Handling
- Form validation errors (Step 1)
- Network/API errors
- SMS code validation (Step 3)
- Transaction failures (Step 4)
- Missing sessionStorage data (redirect to Step 1)

---

**Last Updated**: 2026-01-07
**Status**: Ready for Implementation
**Estimated Effort**: 4-6 hours
**Dependencies**: Core UI components and 09f-pagos OTP components should be implemented
