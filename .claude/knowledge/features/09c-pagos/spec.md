# Feature 09c - Pagos: Pago de Obligaciones Flow - Technical Specification

**Feature**: Obligaciones Payment Flow (Pago de Obligaciones)
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

The **Pago de Obligaciones** feature allows users to pay their loans and credit products (e.g., "Crédito de Inversión", "Tarjeta de Crédito") via PSE (external bank payment). This flow is accessible from "Pagos > Pagar mis Productos > Obligaciones".

### Key Characteristics
- **Multi-step flow**: 4 sequential steps with progress tracking
- **Product selection**: Users select which loan/credit to pay
- **Payment flexibility**: Quick buttons for minimum or total payment
- **PSE Integration**: External bank payment via PSE gateway
- **Reusability**: Reuses Stepper and PSE loading components from 09a-pagos

### User Journey
1. Select loan/credit product, configure payment amount
2. Review and confirm payment details
3. Wait for PSE connection (loading screen)
4. View transaction result with option to print/save

### Key Differences from Other Payment Flows

| Aspect | Pago Unificado (09a) | Pago de Aportes (09b) | Pago de Obligaciones (09c) |
|--------|----------------------|----------------------|---------------------------|
| Scope | All products combined | Single Aportes product | Single selected loan/credit |
| Step 1 | Summary totals only | Aportes breakdown | Product cards + payment options |
| Product Selection | None (all included) | No selection | Select from available products |
| Payment Method | Account selection | Account selection | PSE only |
| Amount Input | Fixed total | Editable amount | Quick buttons (Min/Total) + editable |
| Step 3 | SMS verification | SMS verification | PSE loading screen |
| Result Fields | Generic info | Aportes-specific | Obligaciones-specific (Abono Excedente) |

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   └── index.ts                         # UPDATE (export new atoms if any)
│
├── molecules/
│   ├── ObligacionPaymentCard.tsx        # NEW - Selectable product card
│   ├── PaymentTypeButton.tsx            # NEW - Quick payment button
│   └── index.ts                         # UPDATE
│
├── organisms/
│   ├── ObligacionDetailsCard.tsx        # NEW - Step 1 card
│   ├── ObligacionConfirmationCard.tsx   # NEW - Step 2 card
│   ├── ObligacionResultCard.tsx         # NEW - Step 4 card
│   └── index.ts                         # UPDATE
│
├── types/
│   ├── obligacion-payment.ts            # NEW - Obligaciones-specific types
│   └── index.ts                         # UPDATE
│
├── mocks/
│   ├── mockObligacionPaymentData.ts     # NEW - Obligaciones payment mock data
│   └── index.ts                         # UPDATE
│
└── schemas/
    └── obligacionPaymentSchemas.ts      # NEW - Validation schemas

app/(authenticated)/pagos/pago-obligaciones/
├── page.tsx                             # Step 1: Details
├── confirmacion/
│   └── page.tsx                         # Step 2: Confirmation
├── pse/
│   └── page.tsx                         # Step 3: PSE Loading
└── resultado/
    └── page.tsx                         # Step 4: Result
```

### Reused Components from 09a-pagos
- `StepperCircle` - Individual step indicator
- `StepperConnector` - Connector line
- `Stepper` - Multi-step progress indicator
- `TransactionDetailRow` - Key-value row
- `PSELoadingCard` - Loading card for PSE connection

### Reused Components from 09b-pagos
- `CurrencyInput` - Editable currency input field

### Technology Stack
- **React 19**: Component framework
- **Next.js 16 App Router**: Routing and page structure
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **react-hook-form**: Form state management
- **yup**: Validation schemas

---

## Type Definitions

### File: `src/types/obligacion-payment.ts`

```typescript
/**
 * Loan/credit product for payment selection
 */
export interface ObligacionPaymentProduct {
  id: string;
  name: string; // e.g., "Crédito de Inversión"
  productNumber: string; // Masked, e.g., "***5678"
  totalBalance: number;
  minimumPayment: number;
  paymentDeadline: string;
  status: 'al_dia' | 'en_mora';
}

/**
 * Step 1: Obligacion payment details form data
 */
export interface ObligacionPaymentDetailsData {
  paymentMethod: 'PSE';
  selectedProductId: string;
  selectedProduct: ObligacionPaymentProduct;
  valorAPagar: number; // User-entered/selected amount
  costoTransaccion: number;
}

/**
 * Step 2: Obligacion confirmation data
 */
export interface ObligacionConfirmationData {
  titular: string;
  documento: string; // Masked
  productoAPagar: string; // Product name
  numeroProducto: string; // Masked product number
  productoADebitar: string; // "PSE (Pagos con otras entidades)"
  valorAPagar: number;
}

/**
 * Step 4: Obligacion transaction result
 */
export interface ObligacionTransactionResult {
  status: 'success' | 'error';
  lineaCredito: string;
  numeroProducto: string;
  valorPagado: number;
  costoTransaccion: number;
  abonoExcedente: string; // e.g., "Reducción de Cuota"
  fechaTransmision: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  descripcion: string;
}

/**
 * Complete obligacion payment flow state
 */
export interface ObligacionPaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedProductId: string | null;
  selectedProduct: ObligacionPaymentProduct | null;
  valorAPagar: number;
  confirmationData: ObligacionConfirmationData | null;
  transactionResult: ObligacionTransactionResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Payment type for quick selection
 */
export type PaymentType = 'minimum' | 'total';
```

---

## Component Specifications

### New Molecules

#### `ObligacionPaymentCard.tsx`

**Location**: `src/molecules/ObligacionPaymentCard.tsx`

**Props Interface**:
```typescript
interface ObligacionPaymentCardProps {
  product: ObligacionPaymentProduct;
  selected: boolean;
  onClick: () => void;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { ObligacionPaymentProduct } from '@/src/types/obligacion-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ObligacionPaymentCardProps {
  product: ObligacionPaymentProduct;
  selected: boolean;
  onClick: () => void;
  hideBalances: boolean;
}

export const ObligacionPaymentCard: React.FC<ObligacionPaymentCardProps> = ({
  product,
  selected,
  onClick,
  hideBalances,
}) => {
  const statusColor = product.status === 'al_dia' ? 'text-[#00A44C]' : 'text-[#E1172B]';
  const statusText = product.status === 'al_dia' ? 'Al día' : 'En mora';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full p-4 rounded-lg text-left transition-all
        ${selected
          ? 'border-2 border-[#007FFF] bg-white'
          : 'border border-[#E4E6EA] bg-white'
        }
      `}
      aria-pressed={selected}
    >
      {/* Product Title */}
      <h3 className="text-[19px] font-medium text-black mb-1">
        {product.name}
      </h3>

      {/* Product Number */}
      <p className="text-[15px] text-black mb-3">
        Número de producto: {product.productNumber}
      </p>

      {/* Balance Label */}
      <p className="text-[15px] text-black mb-1">
        Saldo Total
      </p>

      {/* Balance Amount */}
      <p className="text-[25px] font-bold text-black mb-2">
        {hideBalances ? maskCurrency() : formatCurrency(product.totalBalance)}
      </p>

      {/* Status */}
      <p className={`text-[15px] font-medium ${statusColor}`}>
        {statusText}
      </p>
    </button>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `PaymentTypeButton.tsx`

**Location**: `src/molecules/PaymentTypeButton.tsx`

**Props Interface**:
```typescript
interface PaymentTypeButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';

interface PaymentTypeButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}

export const PaymentTypeButton: React.FC<PaymentTypeButtonProps> = ({
  label,
  onClick,
  active = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 text-[10px] font-medium rounded-[9px]
        shadow-sm transition-all
        ${active
          ? 'bg-[#007FFF] text-white'
          : 'bg-[#E4E6EA] text-black hover:bg-[#D1D2D4]'
        }
      `}
    >
      {label}
    </button>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### New Organisms

#### `ObligacionDetailsCard.tsx`

**Location**: `src/organisms/ObligacionDetailsCard.tsx`

**Props Interface**:
```typescript
interface ObligacionDetailsCardProps {
  products: ObligacionPaymentProduct[];
  selectedProductId: string;
  valorAPagar: number;
  activePaymentType: PaymentType | null;
  onProductSelect: (productId: string) => void;
  onValorChange: (valor: number) => void;
  onPaymentTypeSelect: (type: PaymentType) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { CurrencyInput } from '@/src/atoms';
import { ObligacionPaymentCard, PaymentTypeButton } from '@/src/molecules';
import { ObligacionPaymentProduct, PaymentType } from '@/src/types/obligacion-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ObligacionDetailsCardProps {
  products: ObligacionPaymentProduct[];
  selectedProductId: string;
  valorAPagar: number;
  activePaymentType: PaymentType | null;
  onProductSelect: (productId: string) => void;
  onValorChange: (valor: number) => void;
  onPaymentTypeSelect: (type: PaymentType) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const ObligacionDetailsCard: React.FC<ObligacionDetailsCardProps> = ({
  products,
  selectedProductId,
  valorAPagar,
  activePaymentType,
  onProductSelect,
  onValorChange,
  onPaymentTypeSelect,
  onNeedMoreBalance,
  hideBalances,
}) => {
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <Card className="space-y-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Pago de Obligaciones
      </h2>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <label className="block text-[15px] text-black">
          ¿De cuál cuenta quiere pagar?
        </label>
        <div className="flex items-center justify-between gap-4">
          <select
            disabled
            className="flex-1 h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-black bg-white"
          >
            <option>PSE (Pagos con otras entidades)</option>
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

      {/* Product Selection Section */}
      <div className="space-y-3">
        <label className="block text-[15px] text-black">
          ¿Cuál producto desea pagar?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <ObligacionPaymentCard
              key={product.id}
              product={product}
              selected={product.id === selectedProductId}
              onClick={() => onProductSelect(product.id)}
              hideBalances={hideBalances}
            />
          ))}
        </div>
      </div>

      {/* Payment Details Section - Only show if product selected */}
      {selectedProduct && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#1D4E8F]">
            Detalle del Pago
          </h3>

          <Divider />

          {/* Payment Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">Pago Mínimo del Periodo:</span>
              <span className="text-[15px] font-medium text-black">
                {hideBalances ? maskCurrency() : formatCurrency(selectedProduct.minimumPayment)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">Pago Total:</span>
              <span className="text-[15px] font-medium text-black">
                {hideBalances ? maskCurrency() : formatCurrency(selectedProduct.totalBalance)}
              </span>
            </div>
          </div>

          <Divider />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">Fecha Límite de Pago:</span>
              <span className="text-[15px] font-medium text-black">
                {selectedProduct.paymentDeadline}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">Costo de la Transacción:</span>
              <span className="text-[15px] font-medium text-black">
                $ 0
              </span>
            </div>
          </div>

          {/* Payment Type Buttons */}
          <div className="flex gap-3">
            <PaymentTypeButton
              label="Pago Mínimo"
              onClick={() => onPaymentTypeSelect('minimum')}
              active={activePaymentType === 'minimum'}
            />
            <PaymentTypeButton
              label="Pago Total"
              onClick={() => onPaymentTypeSelect('total')}
              active={activePaymentType === 'total'}
            />
          </div>

          {/* Value Input */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold text-[#1D4E8F]">Valor a Pagar</span>
            <CurrencyInput
              value={valorAPagar}
              onChange={(value) => {
                onValorChange(value);
              }}
              prefix="$"
            />
          </div>

          <Divider />

          {/* Total Display */}
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-black">Total a Pagar</span>
            <span className="text-lg font-medium text-black">
              {hideBalances ? maskCurrency() : formatCurrency(valorAPagar)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `ObligacionConfirmationCard.tsx`

**Location**: `src/organisms/ObligacionConfirmationCard.tsx`

**Props Interface**:
```typescript
interface ObligacionConfirmationCardProps {
  confirmationData: ObligacionConfirmationData;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { ObligacionConfirmationData } from '@/src/types/obligacion-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ObligacionConfirmationCardProps {
  confirmationData: ObligacionConfirmationData;
  hideBalances: boolean;
}

export const ObligacionConfirmationCard: React.FC<ObligacionConfirmationCardProps> = ({
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

#### `PSELoadingCard.tsx`

**Location**: `src/organisms/PSELoadingCard.tsx`

**Note**: This component may already exist from 09a-pagos. If not, create it.

**Props Interface**:
```typescript
interface PSELoadingCardProps {
  message?: string;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';

interface PSELoadingCardProps {
  message?: string;
}

export const PSELoadingCard: React.FC<PSELoadingCardProps> = ({
  message = 'Conectando con PSE...',
}) => {
  return (
    <Card className="max-w-2xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E4E6EA] rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#007FFF] border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#1D4E8F]">
            {message}
          </h2>
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
```

**Export**: Add to `src/organisms/index.ts`

---

#### `ObligacionResultCard.tsx`

**Location**: `src/organisms/ObligacionResultCard.tsx`

**Props Interface**:
```typescript
interface ObligacionResultCardProps {
  result: ObligacionTransactionResult;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { ObligacionTransactionResult } from '@/src/types/obligacion-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ObligacionResultCardProps {
  result: ObligacionTransactionResult;
  hideBalances: boolean;
}

export const ObligacionResultCard: React.FC<ObligacionResultCardProps> = ({
  result,
  hideBalances,
}) => {
  const isSuccess = result.status === 'success';

  return (
    <Card className="space-y-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-16 h-16 rounded-full border-4 border-[#00AFA9] flex items-center justify-center">
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

      <Divider />

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
          <span className="text-lg font-medium text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(result.valorPagado)}
          </span>
        </div>
      </div>

      {/* Transaction Details Section 2 */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Costo Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {formatCurrency(result.costoTransaccion)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Abono Excedente:</span>
          <span className="text-[15px] font-medium text-black">
            {result.abonoExcedente}
          </span>
        </div>
      </div>

      <Divider />

      {/* Transaction Details Section 3 */}
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

**File**: `app/(authenticated)/pagos/pago-obligaciones/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ObligacionDetailsCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { PaymentType } from '@/src/types/obligacion-payment';
import {
  mockObligacionProducts,
  OBLIGACION_PAYMENT_STEPS,
} from '@/src/mocks/mockObligacionPaymentData';

export default function PagoObligacionesPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [valorAPagar, setValorAPagar] = useState<number>(0);
  const [activePaymentType, setActivePaymentType] = useState<PaymentType | null>(null);
  const [error, setError] = useState<string>('');

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Obligaciones', href: '/pagos/pago-obligaciones' },
  ];

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setError('');
    // Reset payment amount when product changes
    const product = mockObligacionProducts.find((p) => p.id === productId);
    if (product) {
      setValorAPagar(product.minimumPayment);
      setActivePaymentType('minimum');
    }
  };

  const handlePaymentTypeSelect = (type: PaymentType) => {
    const product = mockObligacionProducts.find((p) => p.id === selectedProductId);
    if (!product) return;

    setActivePaymentType(type);
    if (type === 'minimum') {
      setValorAPagar(product.minimumPayment);
    } else {
      setValorAPagar(product.totalBalance);
    }
  };

  const handleValorChange = (valor: number) => {
    setValorAPagar(valor);
    setActivePaymentType(null); // Clear active button when manually editing
    setError('');
  };

  const handleContinue = () => {
    // Validation
    if (!selectedProductId) {
      setError('Por favor selecciona un producto');
      return;
    }

    const selectedProduct = mockObligacionProducts.find(
      (p) => p.id === selectedProductId
    );

    if (!selectedProduct) {
      setError('Producto no encontrado');
      return;
    }

    if (valorAPagar <= 0) {
      setError('El valor a pagar debe ser mayor a 0');
      return;
    }

    if (valorAPagar < selectedProduct.minimumPayment) {
      setError(`El valor mínimo de pago es ${selectedProduct.minimumPayment}`);
      return;
    }

    if (valorAPagar > selectedProduct.totalBalance) {
      setError('El valor no puede exceder el saldo total');
      return;
    }

    // Store data in sessionStorage
    sessionStorage.setItem('obligacionPaymentProductId', selectedProductId);
    sessionStorage.setItem('obligacionPaymentValor', valorAPagar.toString());
    sessionStorage.setItem(
      'obligacionPaymentProduct',
      JSON.stringify(selectedProduct)
    );

    router.push('/pagos/pago-obligaciones/confirmacion');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">Pago de Obligaciones</h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={1} steps={OBLIGACION_PAYMENT_STEPS} />

      <ObligacionDetailsCard
        products={mockObligacionProducts}
        selectedProductId={selectedProductId}
        valorAPagar={valorAPagar}
        activePaymentType={activePaymentType}
        onProductSelect={handleProductSelect}
        onValorChange={handleValorChange}
        onPaymentTypeSelect={handlePaymentTypeSelect}
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

**File**: `app/(authenticated)/pagos/pago-obligaciones/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ObligacionConfirmationCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockUserData,
  OBLIGACION_PAYMENT_STEPS,
} from '@/src/mocks/mockObligacionPaymentData';
import {
  ObligacionConfirmationData,
  ObligacionPaymentProduct,
} from '@/src/types/obligacion-payment';

export default function ConfirmacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<ObligacionConfirmationData | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Obligaciones', href: '/pagos/pago-obligaciones' },
  ];

  useEffect(() => {
    // Get data from previous step
    const productStr = sessionStorage.getItem('obligacionPaymentProduct');
    const valor = sessionStorage.getItem('obligacionPaymentValor');

    if (!productStr || !valor) {
      router.push('/pagos/pago-obligaciones');
      return;
    }

    const product: ObligacionPaymentProduct = JSON.parse(productStr);

    setConfirmationData({
      titular: mockUserData.name,
      documento: mockUserData.document,
      productoAPagar: product.name,
      numeroProducto: product.productNumber,
      productoADebitar: 'PSE (Pagos con otras entidades)',
      valorAPagar: parseInt(valor, 10),
    });
  }, [router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        'obligacionPaymentConfirmation',
        JSON.stringify(confirmationData)
      );
    }

    // Navigate to PSE loading
    router.push('/pagos/pago-obligaciones/pse');
  };

  const handleBack = () => {
    router.push('/pagos/pago-obligaciones');
  };

  if (!confirmationData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">Pago de Obligaciones</h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={2} steps={OBLIGACION_PAYMENT_STEPS} />

      <ObligacionConfirmationCard
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
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 3: PSE Loading Page

**File**: `app/(authenticated)/pagos/pago-obligaciones/pse/page.tsx`

```typescript
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { PSELoadingCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { OBLIGACION_PAYMENT_STEPS } from '@/src/mocks/mockObligacionPaymentData';

export default function PSEPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Obligaciones', href: '/pagos/pago-obligaciones' },
  ];

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem('obligacionPaymentConfirmation');
    if (!confirmationData) {
      router.push('/pagos/pago-obligaciones');
      return;
    }

    // Simulate PSE connection delay
    const timer = setTimeout(() => {
      // In production, this would handle PSE callback
      router.push('/pagos/pago-obligaciones/resultado');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-black">Pago de Obligaciones</h1>
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={3} steps={OBLIGACION_PAYMENT_STEPS} />

      <PSELoadingCard message="Conectando con PSE..." />
    </div>
  );
}
```

---

### Step 4: Result Page

**File**: `app/(authenticated)/pagos/pago-obligaciones/resultado/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { ObligacionResultCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  OBLIGACION_PAYMENT_STEPS,
  mockObligacionTransactionResult,
} from '@/src/mocks/mockObligacionPaymentData';
import { ObligacionTransactionResult, ObligacionPaymentProduct } from '@/src/types/obligacion-payment';

export default function ResultadoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result, setResult] = useState<ObligacionTransactionResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago de Obligaciones', href: '/pagos/pago-obligaciones' },
  ];

  useEffect(() => {
    // Get data from session and build result
    const valor = sessionStorage.getItem('obligacionPaymentValor');
    const productStr = sessionStorage.getItem('obligacionPaymentProduct');

    if (valor && productStr) {
      const product: ObligacionPaymentProduct = JSON.parse(productStr);
      setResult({
        ...mockObligacionTransactionResult,
        valorPagado: parseInt(valor, 10),
        lineaCredito: product.name,
        numeroProducto: product.productNumber,
      });
    } else {
      setResult(mockObligacionTransactionResult);
    }

    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('obligacionPaymentProductId');
      sessionStorage.removeItem('obligacionPaymentValor');
      sessionStorage.removeItem('obligacionPaymentProduct');
      sessionStorage.removeItem('obligacionPaymentConfirmation');
    };
  }, []);

  const handlePrintSave = () => {
    // TODO: Generate PDF
    window.print();
  };

  const handleFinish = () => {
    // Clear session storage
    sessionStorage.removeItem('obligacionPaymentProductId');
    sessionStorage.removeItem('obligacionPaymentValor');
    sessionStorage.removeItem('obligacionPaymentProduct');
    sessionStorage.removeItem('obligacionPaymentConfirmation');

    router.push('/pagos');
  };

  if (!result) {
    return <div>Cargando resultado...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-black">Pago de Obligaciones</h1>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={4} steps={OBLIGACION_PAYMENT_STEPS} />

      <ObligacionResultCard result={result} hideBalances={hideBalances} />

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

## State Management

### SessionStorage Keys

Use distinct keys to avoid conflicts with other payment flows:
- `obligacionPaymentProductId` - Selected product ID
- `obligacionPaymentValor` - Payment amount
- `obligacionPaymentProduct` - Full product object (JSON)
- `obligacionPaymentConfirmation` - Confirmation data (JSON)

### Navigation Between Steps
- Use Next.js routing for each step
- Store form data in sessionStorage
- Prevent direct access to later steps without completing previous steps
- Allow "Volver" to go back with data preserved

---

## Mock Data

### File: `src/mocks/mockObligacionPaymentData.ts`

```typescript
import { Step } from '@/src/types/stepper';
import {
  ObligacionPaymentProduct,
  ObligacionTransactionResult,
} from '@/src/types/obligacion-payment';

/**
 * Mock obligacion products for payment
 */
export const mockObligacionProducts: ObligacionPaymentProduct[] = [
  {
    id: '1',
    name: 'Crédito de Inversión',
    productNumber: '***5678',
    totalBalance: 12500000,
    minimumPayment: 850000,
    paymentDeadline: '15 Nov 2024',
    status: 'al_dia',
  },
  {
    id: '2',
    name: 'Tarjeta de Crédito',
    productNumber: '***1111',
    totalBalance: 1800000,
    minimumPayment: 180000,
    paymentDeadline: '20 Nov 2024',
    status: 'al_dia',
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
 * Mock obligacion transaction result (success)
 */
export const mockObligacionTransactionResult: ObligacionTransactionResult = {
  status: 'success',
  lineaCredito: 'Crédito Libre Inversión',
  numeroProducto: '***5488',
  valorPagado: 850000,
  costoTransaccion: 0,
  abonoExcedente: 'Reducción de Cuota',
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '463342',
  descripcion: 'Exitosa',
};

/**
 * Mock obligacion transaction result (error)
 */
export const mockObligacionTransactionResultError: ObligacionTransactionResult = {
  status: 'error',
  lineaCredito: 'Crédito Libre Inversión',
  numeroProducto: '***5488',
  valorPagado: 0,
  costoTransaccion: 0,
  abonoExcedente: '-',
  fechaTransmision: '3 de septiembre de 2025',
  horaTransaccion: '10:21 pm',
  numeroAprobacion: '-',
  descripcion: 'Error en la conexión con PSE',
};

/**
 * Obligacion payment flow steps
 */
export const OBLIGACION_PAYMENT_STEPS: Step[] = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'Conectando a PSE' },
  { number: 4, label: 'Finalización' },
];
```

**Export**: Add to `src/mocks/index.ts`

---

## Validation Schemas

### File: `src/schemas/obligacionPaymentSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Step 1: Obligacion payment details validation
 */
export const obligacionPaymentDetailsSchema = yup.object({
  selectedProductId: yup
    .string()
    .required('Por favor selecciona un producto'),
  valorAPagar: yup
    .number()
    .required('Por favor ingresa un valor')
    .positive('El valor debe ser mayor a 0')
    .integer('El valor debe ser un número entero'),
});

export type ObligacionPaymentDetailsFormData = yup.InferType<
  typeof obligacionPaymentDetailsSchema
>;

/**
 * Custom validation function for payment amount
 */
export const validatePaymentAmount = (
  valor: number,
  minimumPayment: number,
  totalBalance: number
): string | null => {
  if (valor <= 0) {
    return 'El valor a pagar debe ser mayor a 0';
  }
  if (valor < minimumPayment) {
    return `El valor mínimo de pago es ${minimumPayment}`;
  }
  if (valor > totalBalance) {
    return 'El valor no puede exceder el saldo total';
  }
  return null;
};
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/09c-pagos/
├── references.md
└── spec.md

src/
├── atoms/
│   └── index.ts                           # UPDATE (if needed)
│
├── molecules/
│   ├── ObligacionPaymentCard.tsx          # NEW
│   ├── PaymentTypeButton.tsx              # NEW
│   └── index.ts                           # UPDATE
│
├── organisms/
│   ├── ObligacionDetailsCard.tsx          # NEW
│   ├── ObligacionConfirmationCard.tsx     # NEW
│   ├── PSELoadingCard.tsx                 # NEW (or reuse from 09a)
│   ├── ObligacionResultCard.tsx           # NEW
│   └── index.ts                           # UPDATE
│
├── types/
│   ├── obligacion-payment.ts              # NEW
│   └── index.ts                           # UPDATE
│
├── mocks/
│   ├── mockObligacionPaymentData.ts       # NEW
│   └── index.ts                           # UPDATE
│
└── schemas/
    └── obligacionPaymentSchemas.ts        # NEW

app/(authenticated)/pagos/pago-obligaciones/
├── page.tsx                               # NEW - Step 1
├── confirmacion/
│   └── page.tsx                           # NEW - Step 2
├── pse/
│   └── page.tsx                           # NEW - Step 3
└── resultado/
    └── page.tsx                           # NEW - Step 4
```

---

## Implementation Order

### Phase 1: Types & Mock Data
1. Create type definitions:
   - `src/types/obligacion-payment.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockObligacionPaymentData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Molecules
3. Create molecules:
   - `src/molecules/ObligacionPaymentCard.tsx`
   - `src/molecules/PaymentTypeButton.tsx`
   - Update `src/molecules/index.ts`

### Phase 3: Organisms
4. Create organisms:
   - `src/organisms/ObligacionDetailsCard.tsx`
   - `src/organisms/ObligacionConfirmationCard.tsx`
   - `src/organisms/PSELoadingCard.tsx` (if not exists from 09a)
   - `src/organisms/ObligacionResultCard.tsx`
   - Update `src/organisms/index.ts`

### Phase 4: Pages
5. Create pages in order:
   - `app/(authenticated)/pagos/pago-obligaciones/page.tsx` (Step 1)
   - `app/(authenticated)/pagos/pago-obligaciones/confirmacion/page.tsx` (Step 2)
   - `app/(authenticated)/pagos/pago-obligaciones/pse/page.tsx` (Step 3)
   - `app/(authenticated)/pagos/pago-obligaciones/resultado/page.tsx` (Step 4)

### Phase 5: Validation Schemas (Optional)
6. Create validation schemas:
   - `src/schemas/obligacionPaymentSchemas.ts`

### Phase 6: Testing & Refinement
7. Manual testing of complete flow
8. Edge case testing
9. Responsive testing
10. Accessibility testing

---

## Testing Strategy

### Manual Testing Checklist

#### Step 1: Details
- [ ] Page renders correctly
- [ ] Stepper shows step 1 as active
- [ ] PSE dropdown shows correct option (disabled)
- [ ] "¿Necesitas más saldo?" link is clickable
- [ ] Product cards render correctly
- [ ] Product selection updates card border
- [ ] Selected product shows payment details section
- [ ] hideBalances toggle works for all amounts
- [ ] Status shows correct color (green for "Al día", red for "En mora")
- [ ] "Pago Mínimo" button sets correct value
- [ ] "Pago Total" button sets correct value
- [ ] Value input is editable
- [ ] Value input formats with thousand separators
- [ ] Validation: error if no product selected
- [ ] Validation: error if value is 0 or negative
- [ ] Validation: error if value < minimum payment
- [ ] Validation: error if value > total balance
- [ ] "Volver" navigates to Pagar mis Productos
- [ ] "Continuar" navigates to step 2 with valid data

#### Step 2: Confirmation
- [ ] Page renders correctly
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] User name and masked document display
- [ ] Payment details show correctly
- [ ] Product name and number display correctly
- [ ] "PSE (Pagos con otras entidades)" shows as payment method
- [ ] hideBalances toggle works
- [ ] "Volver" navigates back to step 1
- [ ] "Confirmar Pago" navigates to step 3
- [ ] Redirects to step 1 if no sessionStorage data

#### Step 3: PSE Loading
- [ ] Page renders correctly
- [ ] Stepper shows step 3 active, steps 1-2 completed
- [ ] Loading spinner animates
- [ ] Loading message displays
- [ ] Instructions about PSE redirect show
- [ ] Auto-navigates to step 4 after delay
- [ ] Redirects to step 1 if no sessionStorage data

#### Step 4: Result
- [ ] Page renders correctly
- [ ] Stepper shows all steps completed
- [ ] Success icon and title show correctly
- [ ] Línea crédito shows correct product
- [ ] Número de producto is masked
- [ ] Valor pagado shows correct amount
- [ ] Costo Transacción shows $ 0
- [ ] Abono Excedente shows "Reducción de Cuota"
- [ ] Transaction date/time display correctly
- [ ] Número de Aprobación displays
- [ ] Description shows in green for success
- [ ] hideBalances toggle works for valor pagado
- [ ] "Imprimir/Guardar" triggers print dialog
- [ ] "Finalizar" navigates to /pagos
- [ ] sessionStorage is cleared on finish

### Error States Testing
- [ ] Error state result card shows correctly
- [ ] Error icon (red X) displays
- [ ] "Transacción Fallida" title shows
- [ ] Description shows in red for error

### Responsive Testing
- [ ] Desktop: Layout correct, cards side by side
- [ ] Tablet: Layout adapts, cards may stack
- [ ] Mobile: Stacked layout works
- [ ] Product cards responsive on mobile
- [ ] Stepper labels visible on all breakpoints

### Accessibility Testing
- [ ] Tab navigation works through all interactive elements
- [ ] Product cards are keyboard accessible
- [ ] Focus states visible
- [ ] Screen reader announces steps
- [ ] Error messages announced
- [ ] Form fields have proper labels
- [ ] Buttons have descriptive text

---

## Dependencies

### Reused from 09a-pagos
- `StepperCircle` atom
- `StepperConnector` atom
- `Stepper` molecule
- `TransactionDetailRow` molecule
- `PSELoadingCard` organism (if exists)
- Step types and interfaces

### Reused from 09b-pagos
- `CurrencyInput` atom

### New for 09c-pagos
- `ObligacionPaymentCard` molecule
- `PaymentTypeButton` molecule
- `ObligacionDetailsCard` organism
- `ObligacionConfirmationCard` organism
- `ObligacionResultCard` organism
- Obligacion-specific types
- Obligacion mock data

---

## Notes & Considerations

### Component Reuse
- Leverage Stepper from 09a-pagos
- Leverage CurrencyInput from 09b-pagos
- PSELoadingCard may need to be created if not already in 09a

### Product Selection
- Only one product can be selected at a time
- Selection updates the payment details section
- Payment amount defaults to minimum when product changes

### Payment Type Buttons
- "Pago Mínimo" sets value to minimum payment
- "Pago Total" sets value to total balance
- Manual editing clears the active button state

### PSE Integration
- Step 3 is mock/simulation for now
- In production, would redirect to external PSE gateway
- Would handle PSE callback to determine success/failure

### Abono Excedente
- Shows how excess payment is applied
- Options: "Reducción de Cuota", "Reducción de Plazo", etc.
- Currently hardcoded in mock data

### Session Storage Keys
- Use distinct keys to avoid conflicts with 09a and 09b:
  - `obligacionPaymentProductId`
  - `obligacionPaymentValor`
  - `obligacionPaymentProduct`
  - `obligacionPaymentConfirmation`

### Error Handling
- Handle invalid product selection
- Handle amount below minimum
- Handle amount above total balance
- Handle PSE connection errors gracefully

### Security
- PSE handles actual payment security
- No SMS verification needed (PSE has its own)
- In production, implement proper PSE integration

---

## API Integration Points (Future)

- `GET /api/payments/obligaciones/products` - Get user's loan/credit products
- `GET /api/payments/obligaciones/:productId/details` - Get payment details for product
- `POST /api/payments/obligaciones/initiate` - Start PSE payment flow
- `GET /api/payments/obligaciones/:transactionId/status` - Check PSE transaction status
- `GET /api/payments/obligaciones/:transactionId` - Get transaction result

---

## Design System Values Reference

### Colors
- **Primary Blue**: `#007FFF` - Stepper active, primary buttons, selected card border
- **Navy**: `#1D4E8F` - Text, labels, titles
- **Text Black**: `#111827` - Primary text
- **Success Green**: `#00A44C` - Status "Al día", success descriptions
- **Error Red**: `#E1172B` - Status "En mora", error states
- **Teal**: `#00AFA9` - Success icon border
- **Gray Border**: `#B1B1B1` - Input borders
- **Gray Divider**: `#E4E6EA` - Dividers, unselected card border
- **Gray Button**: `#E4E6EA` - Payment type buttons background
- **Gray Medium**: `#808284` - Pending stepper state

### Typography
- **Page Title**: 20px, Medium, Black
- **Card Title**: 18px, Bold, Navy
- **Section Subtitle**: 14px, Medium, Navy
- **Product Card Title**: 19px, Medium, Black
- **Product Card Amount**: 25px, Bold, Black
- **Labels**: 15px, Regular, Black
- **Values**: 15px, Medium, Black
- **Payment Type Button**: 10px, Medium

### Spacing
- Card padding: `24px` (p-6)
- Section spacing: `24px` (space-y-6)
- Product cards gap: `16px` (gap-4)

### Border Radius
- Cards: `16px` (rounded-2xl)
- Product cards: `8px` (rounded-lg)
- Payment type buttons: `9px`
- Inputs: `6px` (rounded-md)

---

**Last Updated**: 2026-01-05
**Status**: Ready for Implementation
**Estimated Effort**: 6-8 hours (assuming 09a/09b components exist)
**Dependencies**: Feature 09a-pagos and 09b-pagos components should be implemented first
