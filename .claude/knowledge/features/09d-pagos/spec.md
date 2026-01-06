# Feature 09d - Pagos: Pago a Otros Asociados Flow - Technical Specification

**Feature**: Payment to Other Associates (Pago a Otros Asociados)
**Version**: 1.0
**Status**: Implementation Ready
**Last Updated**: 2026-01-06

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

The **Pago a Otros Asociados** feature allows users to make payments to registered beneficiaries (other Coasmedas associates). This flow consists of a beneficiary selection page followed by a 4-step payment wizard.

### Key Characteristics
- **Pre-step flow**: Beneficiary selection before entering the 4-step wizard
- **Multi-step wizard**: 4 sequential steps with progress tracking
- **Multi-product selection**: Users can select multiple products to pay with individual amounts
- **Source account selection**: Payment from user's own savings account
- **SMS verification**: 6-digit code authorization (same as 09a/09b)
- **Reusability**: Reuses Stepper, OTP, and result components from previous payment features

### User Journey
1. Select a registered beneficiary (associate) to pay
2. Select source account and products to pay with amounts (Step 1: Details)
3. Review and confirm payment details (Step 2: Confirmation)
4. Enter 6-digit SMS verification code (Step 3: SMS)
5. View transaction result with option to print/save (Step 4: Result)

### Key Differences from Other Payment Flows

| Aspect | Pago Unificado (09a) | Pago de Aportes (09b) | Pago de Obligaciones (09c) | Pago a Otros Asociados (09d) |
|--------|----------------------|----------------------|---------------------------|------------------------------|
| Target | Self (all products) | Self (Aportes) | Self (Loan/Credit) | Other associate |
| Pre-step | None | None | None | Beneficiary selection |
| Product Selection | None (all included) | No selection | Single product | Multiple products (checkbox) |
| Payment Source | Account dropdown | Account dropdown | PSE only | Account dropdown |
| Amount Input | Fixed totals | Single editable | Quick buttons + editable | Multiple per product |
| Step 3 | SMS verification | SMS verification | PSE loading | SMS verification |
| Result Fields | Generic | Aportes-specific | Obligaciones-specific | Multi-product summary |

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   ├── Checkbox.tsx                     # NEW (if not exists)
│   └── index.ts                         # UPDATE

├── molecules/
│   ├── BeneficiaryListItem.tsx          # NEW - Beneficiary selection item
│   ├── PayableProductCard.tsx           # NEW - Product with checkbox and amount input
│   ├── ConfirmationRow.tsx              # NEW - Label-value confirmation row
│   └── index.ts                         # UPDATE

├── organisms/
│   ├── BeneficiarySelectionCard.tsx     # NEW - List of registered beneficiaries
│   ├── OtrosAsociadosDetailsCard.tsx    # NEW - Step 1 card
│   ├── OtrosAsociadosConfirmationCard.tsx # NEW - Step 2 card
│   ├── OtrosAsociadosResultCard.tsx     # NEW - Step 4 card
│   └── index.ts                         # UPDATE

├── types/
│   ├── otros-asociados-payment.ts       # NEW - Feature-specific types
│   └── index.ts                         # UPDATE

├── mocks/
│   ├── mockOtrosAsociadosPaymentData.ts # NEW - Mock data
│   └── index.ts                         # UPDATE

└── schemas/
    └── otrosAsociadosPaymentSchemas.ts  # NEW - Validation schemas

app/(authenticated)/pagos/otros-asociados/
├── page.tsx                             # Beneficiary selection (Pre-step)
└── pago/
    ├── page.tsx                         # Step 1: Details
    ├── confirmacion/
    │   └── page.tsx                     # Step 2: Confirmation
    ├── sms/
    │   └── page.tsx                     # Step 3: SMS Code
    └── resultado/
        └── page.tsx                     # Step 4: Result
```

### Reused Components from Previous Payment Features
- `Stepper` (09a) - Multi-step progress indicator
- `StepperCircle` (09a) - Individual step indicator
- `StepperConnector` (09a) - Connector line between steps
- `CodeInput` (09a) - Single digit input
- `CodeInputGroup` (09a) - 6-digit code input group
- `CodeInputCard` (09a) - SMS code input card
- `TransactionDetailRow` (09a) - Key-value row
- `CurrencyInput` (09b) - Editable currency input

### Technology Stack
- **React 19**: Component framework
- **Next.js 16 App Router**: Routing and page structure
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **react-hook-form**: Form state management
- **yup**: Validation schemas

---

## Type Definitions

### File: `src/types/otros-asociados-payment.ts`

```typescript
/**
 * Registered beneficiary (other Coasmedas associate)
 */
export interface RegisteredBeneficiary {
  id: string;
  fullName: string;        // "MARÍA FERNANDA GONZALEZ"
  alias: string;           // "Mamá"
  documentNumber: string;  // masked: "***3040"
}

/**
 * Product available for payment to beneficiary
 */
export interface PayableProduct {
  id: string;
  name: string;              // "Plan Senior", "Crédito de Libre Inversión"
  productNumber: string;     // masked: "***5488"
  minimumPayment: number | null;  // null = "N/A"
  totalPayment: number | null;    // null = "Indefinido"
  amountToPay: number;       // user input
  isSelected: boolean;
}

/**
 * Source account for payment
 */
export interface SourceAccount {
  id: string;
  type: string;              // "Cuenta de Ahorros"
  balance: number;           // 8730500
  number: string;            // masked "****4428"
}

/**
 * Step 1: Payment details form data
 */
export interface OtrosAsociadosDetailsData {
  sourceAccountId: string;
  sourceAccount: SourceAccount;
  beneficiary: RegisteredBeneficiary;
  selectedProducts: PayableProduct[];
  totalAmount: number;
}

/**
 * Step 2: Confirmation data
 */
export interface OtrosAsociadosConfirmationData {
  titular: string;
  documento: string;           // Masked
  productoADebitar: string;    // "Cuenta de Ahorro"
  beneficiaryName: string;
  products: Array<{
    name: string;
    amount: number;
  }>;
  totalAmount: number;
}

/**
 * Step 4: Transaction result
 */
export interface OtrosAsociadosTransactionResult {
  success: boolean;
  creditLine: string;
  productNumber: string;
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: 'Exitosa' | 'Fallida' | 'Pendiente';
}

/**
 * Complete payment flow state
 */
export interface OtrosAsociadosPaymentFlowState {
  // Step 0: Beneficiary Selection
  selectedBeneficiary: RegisteredBeneficiary | null;

  // Step 1: Details
  sourceAccount: SourceAccount | null;
  products: PayableProduct[];
  totalAmount: number;

  // Step 3: SMS
  otpCode: string;
  otpError: string | null;
  isResending: boolean;

  // Step 4: Result
  transactionResult: OtrosAsociadosTransactionResult | null;

  // Navigation
  currentStep: 0 | 1 | 2 | 3 | 4;
  isLoading: boolean;
  error: string | null;
}
```

---

## Component Specifications

### New Atoms

#### `Checkbox.tsx`

**Location**: `src/atoms/Checkbox.tsx`

**Note**: May already exist. If not, create it.

**Props Interface**:
```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}
```

**Implementation**:
```typescript
import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  'aria-label': ariaLabel,
}) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        w-4 h-4 rounded border-[#B1B1B1]
        text-[#007FFF] focus:ring-[#007FFF] focus:ring-2
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      `}
    />
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

### New Molecules

#### `BeneficiaryListItem.tsx`

**Location**: `src/molecules/BeneficiaryListItem.tsx`

**Props Interface**:
```typescript
interface BeneficiaryListItemProps {
  name: string;
  alias: string;
  maskedDocument: string;
  onClick: () => void;
}
```

**Implementation**:
```typescript
import React from 'react';
import { ChevronIcon } from '@/src/atoms';

interface BeneficiaryListItemProps {
  name: string;
  alias: string;
  maskedDocument: string;
  onClick: () => void;
}

export const BeneficiaryListItem: React.FC<BeneficiaryListItemProps> = ({
  name,
  alias,
  maskedDocument,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full flex items-center justify-between p-4
        border border-[#E4E6EA] rounded-lg bg-white
        hover:border-[#007FFF] hover:bg-[#F0F9FF]
        transition-colors cursor-pointer text-left
      "
    >
      <div>
        <h3 className="text-lg font-medium text-[#1D4E8F] uppercase">
          {name}
        </h3>
        <p className="text-sm text-black">
          Alias: {alias} - Doc: {maskedDocument}
        </p>
      </div>
      <ChevronIcon direction="right" className="w-5 h-5 text-[#58585B]" />
    </button>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `PayableProductCard.tsx`

**Location**: `src/molecules/PayableProductCard.tsx`

**Props Interface**:
```typescript
interface PayableProductCardProps {
  product: PayableProduct;
  onSelectionChange: (selected: boolean) => void;
  onAmountChange: (amount: number) => void;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { Checkbox, Divider } from '@/src/atoms';
import { CurrencyInput } from '@/src/atoms';
import { PayableProduct } from '@/src/types/otros-asociados-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface PayableProductCardProps {
  product: PayableProduct;
  onSelectionChange: (selected: boolean) => void;
  onAmountChange: (amount: number) => void;
  hideBalances: boolean;
}

export const PayableProductCard: React.FC<PayableProductCardProps> = ({
  product,
  onSelectionChange,
  onAmountChange,
  hideBalances,
}) => {
  const formatAmount = (amount: number | null): string => {
    if (amount === null) return 'N/A';
    if (hideBalances) return maskCurrency();
    return formatCurrency(amount);
  };

  const formatTotalPayment = (amount: number | null): string => {
    if (amount === null) return 'Indefinido';
    if (hideBalances) return maskCurrency();
    return formatCurrency(amount);
  };

  return (
    <div className="border-b border-[#E4E6EA] pb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={product.isSelected}
            onChange={onSelectionChange}
            aria-label={`Seleccionar ${product.name}`}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          {/* Product Title */}
          <h3 className="text-lg font-bold text-[#1D4E8F]">
            {product.name} ({product.productNumber})
          </h3>

          {/* Payment Info Row */}
          <div className="flex gap-8 text-xs text-black">
            <div>
              <span className="text-[#58585B]">Pago Mínimo: </span>
              <span className="font-medium">
                {formatAmount(product.minimumPayment)}
              </span>
            </div>
            <div>
              <span className="text-[#58585B]">Pago Total: </span>
              <span className="font-medium">
                {formatTotalPayment(product.totalPayment)}
              </span>
            </div>
          </div>

          {/* Amount Input - Only show when selected */}
          {product.isSelected && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-black">Valor a Pagar:</span>
              <CurrencyInput
                value={product.amountToPay}
                onChange={onAmountChange}
                prefix="$"
                className="text-xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `ConfirmationRow.tsx`

**Location**: `src/molecules/ConfirmationRow.tsx`

**Props Interface**:
```typescript
interface ConfirmationRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'success' | 'error';
  className?: string;
}
```

**Implementation**:
```typescript
import React from 'react';

interface ConfirmationRowProps {
  label: string;
  value: string;
  valueColor?: 'default' | 'success' | 'error';
  className?: string;
}

export const ConfirmationRow: React.FC<ConfirmationRowProps> = ({
  label,
  value,
  valueColor = 'default',
  className = '',
}) => {
  const colorClasses = {
    default: 'text-black',
    success: 'text-[#00A44C]',
    error: 'text-[#FF0D00]',
  };

  return (
    <div className={`flex justify-between items-center py-2 ${className}`}>
      <span className="text-[15px] text-black">{label}</span>
      <span className={`text-[15px] font-medium ${colorClasses[valueColor]}`}>
        {value}
      </span>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### New Organisms

#### `BeneficiarySelectionCard.tsx`

**Location**: `src/organisms/BeneficiarySelectionCard.tsx`

**Props Interface**:
```typescript
interface BeneficiarySelectionCardProps {
  beneficiaries: RegisteredBeneficiary[];
  onSelect: (beneficiary: RegisteredBeneficiary) => void;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { BeneficiaryListItem } from '@/src/molecules';
import { RegisteredBeneficiary } from '@/src/types/otros-asociados-payment';

interface BeneficiarySelectionCardProps {
  beneficiaries: RegisteredBeneficiary[];
  onSelect: (beneficiary: RegisteredBeneficiary) => void;
}

export const BeneficiarySelectionCard: React.FC<BeneficiarySelectionCardProps> = ({
  beneficiaries,
  onSelect,
}) => {
  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Asociados inscritos
      </h2>

      <div className="space-y-3">
        {beneficiaries.map((beneficiary) => (
          <BeneficiaryListItem
            key={beneficiary.id}
            name={beneficiary.fullName}
            alias={beneficiary.alias}
            maskedDocument={beneficiary.documentNumber}
            onClick={() => onSelect(beneficiary)}
          />
        ))}
      </div>

      {beneficiaries.length === 0 && (
        <p className="text-center text-[#58585B] py-8">
          No tienes asociados inscritos.
        </p>
      )}
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `OtrosAsociadosDetailsCard.tsx`

**Location**: `src/organisms/OtrosAsociadosDetailsCard.tsx`

**Props Interface**:
```typescript
interface OtrosAsociadosDetailsCardProps {
  beneficiaryName: string;
  accounts: SourceAccount[];
  selectedAccountId: string;
  products: PayableProduct[];
  totalAmount: number;
  onAccountChange: (accountId: string) => void;
  onProductSelectionChange: (productId: string, selected: boolean) => void;
  onProductAmountChange: (productId: string, amount: number) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { PayableProductCard } from '@/src/molecules';
import { SourceAccount, PayableProduct } from '@/src/types/otros-asociados-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface OtrosAsociadosDetailsCardProps {
  beneficiaryName: string;
  accounts: SourceAccount[];
  selectedAccountId: string;
  products: PayableProduct[];
  totalAmount: number;
  onAccountChange: (accountId: string) => void;
  onProductSelectionChange: (productId: string, selected: boolean) => void;
  onProductAmountChange: (productId: string, amount: number) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const OtrosAsociadosDetailsCard: React.FC<OtrosAsociadosDetailsCardProps> = ({
  beneficiaryName,
  accounts,
  selectedAccountId,
  products,
  totalAmount,
  onAccountChange,
  onProductSelectionChange,
  onProductAmountChange,
  onNeedMoreBalance,
  hideBalances,
}) => {
  return (
    <Card className="space-y-6">
      {/* Title with Beneficiary Name */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Pago de {beneficiaryName}
      </h2>

      {/* Source Account Selection */}
      <div className="space-y-2">
        <label className="block text-[15px] text-black">
          ¿De cuál cuenta quiere pagar?
        </label>
        <div className="flex items-center justify-between gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="flex-1 h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-black bg-white focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.type} - Saldo: {hideBalances ? maskCurrency() : formatCurrency(account.balance)}
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

      {/* Products Selection Section */}
      <div className="space-y-3">
        <label className="block text-[15px] text-black">
          Selecciona el/los producto(s) a pagar:
        </label>
        <div className="space-y-4">
          {products.map((product) => (
            <PayableProductCard
              key={product.id}
              product={product}
              onSelectionChange={(selected) =>
                onProductSelectionChange(product.id, selected)
              }
              onAmountChange={(amount) =>
                onProductAmountChange(product.id, amount)
              }
              hideBalances={hideBalances}
            />
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-[#1D4E8F]">
          Resumen del Pago
        </h3>

        <Divider />

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#1D4E8F]">
            Total a Pagar:
          </span>
          <span className="text-xl font-medium text-black">
            {hideBalances ? maskCurrency() : formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `OtrosAsociadosConfirmationCard.tsx`

**Location**: `src/organisms/OtrosAsociadosConfirmationCard.tsx`

**Props Interface**:
```typescript
interface OtrosAsociadosConfirmationCardProps {
  confirmationData: OtrosAsociadosConfirmationData;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { ConfirmationRow } from '@/src/molecules';
import { OtrosAsociadosConfirmationData } from '@/src/types/otros-asociados-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface OtrosAsociadosConfirmationCardProps {
  confirmationData: OtrosAsociadosConfirmationData;
  hideBalances: boolean;
}

export const OtrosAsociadosConfirmationCard: React.FC<OtrosAsociadosConfirmationCardProps> = ({
  confirmationData,
  hideBalances,
}) => {
  return (
    <Card className="space-y-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Confirmación de Pago
      </h2>

      {/* Description */}
      <p className="text-[15px] text-black">
        Por favor, verifica que los datos de la transacción sean correctos antes de continuar.
      </p>

      {/* Payer Info Section */}
      <div className="space-y-2">
        <ConfirmationRow
          label="Nombre del Titular:"
          value={confirmationData.titular}
        />
        <ConfirmationRow
          label="Documento:"
          value={confirmationData.documento}
        />
        <ConfirmationRow
          label="Producto a Debitar:"
          value={confirmationData.productoADebitar}
        />
      </div>

      {/* Products Section */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-[#1D4E8F]">
          Productos a pagar para {confirmationData.beneficiaryName}
        </h3>

        <Divider />

        <div className="space-y-2">
          {confirmationData.products.map((product, index) => (
            <ConfirmationRow
              key={index}
              label={`${product.name}:`}
              value={hideBalances ? maskCurrency() : formatCurrency(product.amount)}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* Total Section */}
      <div className="flex justify-between items-center">
        <span className="text-[15px] text-black">Valor Total:</span>
        <span className="text-lg font-medium text-black">
          {hideBalances ? maskCurrency() : formatCurrency(confirmationData.totalAmount)}
        </span>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `OtrosAsociadosResultCard.tsx`

**Location**: `src/organisms/OtrosAsociadosResultCard.tsx`

**Props Interface**:
```typescript
interface OtrosAsociadosResultCardProps {
  result: OtrosAsociadosTransactionResult;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { ConfirmationRow } from '@/src/molecules';
import { OtrosAsociadosTransactionResult } from '@/src/types/otros-asociados-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface OtrosAsociadosResultCardProps {
  result: OtrosAsociadosTransactionResult;
  hideBalances: boolean;
}

export const OtrosAsociadosResultCard: React.FC<OtrosAsociadosResultCardProps> = ({
  result,
  hideBalances,
}) => {
  const isSuccess = result.success;

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

      <Divider />

      {/* Transaction Details */}
      <div className="space-y-2">
        <ConfirmationRow
          label="Línea crédito:"
          value={result.creditLine}
        />
        <ConfirmationRow
          label="Número de producto:"
          value={result.productNumber}
        />
        <ConfirmationRow
          label="Valor pagado:"
          value={hideBalances ? maskCurrency() : formatCurrency(result.amountPaid)}
        />
      </div>

      <Divider />

      <ConfirmationRow
        label="Costo transacción:"
        value={formatCurrency(result.transactionCost)}
      />

      <Divider />

      <div className="space-y-2">
        <ConfirmationRow
          label="Fecha de Transmisión:"
          value={result.transmissionDate}
        />
        <ConfirmationRow
          label="Hora de Transacción:"
          value={result.transactionTime}
        />
        <ConfirmationRow
          label="Número de Aprobación:"
          value={result.approvalNumber}
        />
        <ConfirmationRow
          label="Descripción:"
          value={result.description}
          valueColor={isSuccess ? 'success' : 'error'}
        />
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

## Page Implementations

### Pre-Step: Beneficiary Selection Page

**File**: `app/(authenticated)/pagos/otros-asociados/page.tsx`

```typescript
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs } from '@/src/molecules';
import { BeneficiarySelectionCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { mockRegisteredBeneficiaries } from '@/src/mocks/mockOtrosAsociadosPaymentData';
import { RegisteredBeneficiary } from '@/src/types/otros-asociados-payment';

export default function OtrosAsociadosPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago a otros asociados', href: '/pagos/otros-asociados' },
  ];

  const handleBeneficiarySelect = (beneficiary: RegisteredBeneficiary) => {
    // Store selected beneficiary in sessionStorage
    sessionStorage.setItem(
      'otrosAsociadosBeneficiary',
      JSON.stringify(beneficiary)
    );

    // Navigate to payment flow
    router.push('/pagos/otros-asociados/pago');
  };

  const handleBack = () => {
    router.push('/pagos');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton onClick={handleBack} />
        <h1 className="text-xl font-medium text-black">
          Pago a otros asociados
        </h1>
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <BeneficiarySelectionCard
        beneficiaries={mockRegisteredBeneficiaries}
        onSelect={handleBeneficiarySelect}
      />
    </div>
  );
}
```

---

### Step 1: Details Page

**File**: `app/(authenticated)/pagos/otros-asociados/pago/page.tsx`

```typescript
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { OtrosAsociadosDetailsCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockSourceAccounts,
  mockPayableProducts,
  OTROS_ASOCIADOS_PAYMENT_STEPS,
} from '@/src/mocks/mockOtrosAsociadosPaymentData';
import {
  RegisteredBeneficiary,
  PayableProduct,
} from '@/src/types/otros-asociados-payment';

export default function OtrosAsociadosPagoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [beneficiary, setBeneficiary] = useState<RegisteredBeneficiary | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [products, setProducts] = useState<PayableProduct[]>(mockPayableProducts);
  const [error, setError] = useState<string>('');

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago a otros asociados', href: '/pagos/otros-asociados' },
  ];

  useEffect(() => {
    // Get beneficiary from sessionStorage
    const beneficiaryStr = sessionStorage.getItem('otrosAsociadosBeneficiary');
    if (!beneficiaryStr) {
      router.push('/pagos/otros-asociados');
      return;
    }
    setBeneficiary(JSON.parse(beneficiaryStr));
  }, [router]);

  const totalAmount = products
    .filter((p) => p.isSelected)
    .reduce((sum, p) => sum + p.amountToPay, 0);

  const handleProductSelectionChange = useCallback((productId: string, selected: boolean) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isSelected: selected } : p
      )
    );
    setError('');
  }, []);

  const handleProductAmountChange = useCallback((productId: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, amountToPay: amount } : p
      )
    );
    setError('');
  }, []);

  const handleContinue = () => {
    // Validation
    if (!selectedAccountId) {
      setError('Por favor selecciona una cuenta');
      return;
    }

    const selectedProducts = products.filter((p) => p.isSelected);
    if (selectedProducts.length === 0) {
      setError('Por favor selecciona al menos un producto');
      return;
    }

    const hasZeroAmount = selectedProducts.some((p) => p.amountToPay <= 0);
    if (hasZeroAmount) {
      setError('El valor a pagar debe ser mayor a 0 para todos los productos seleccionados');
      return;
    }

    const selectedAccount = mockSourceAccounts.find((a) => a.id === selectedAccountId);
    if (selectedAccount && totalAmount > selectedAccount.balance) {
      setError('Saldo insuficiente en la cuenta seleccionada');
      return;
    }

    // Store data in sessionStorage
    sessionStorage.setItem('otrosAsociadosAccountId', selectedAccountId);
    sessionStorage.setItem('otrosAsociadosProducts', JSON.stringify(selectedProducts));
    sessionStorage.setItem('otrosAsociadosTotalAmount', totalAmount.toString());

    router.push('/pagos/otros-asociados/pago/confirmacion');
  };

  const handleNeedMoreBalance = () => {
    console.log('Need more balance');
  };

  const handleBack = () => {
    router.push('/pagos/otros-asociados');
  };

  if (!beneficiary) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">Pago a otros asociados</h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={1} steps={OTROS_ASOCIADOS_PAYMENT_STEPS} />

      <OtrosAsociadosDetailsCard
        beneficiaryName={beneficiary.fullName}
        accounts={mockSourceAccounts}
        selectedAccountId={selectedAccountId}
        products={products}
        totalAmount={totalAmount}
        onAccountChange={setSelectedAccountId}
        onProductSelectionChange={handleProductSelectionChange}
        onProductAmountChange={handleProductAmountChange}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
      />

      {error && (
        <div className="text-sm text-[#FF0D00] text-center">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
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

**File**: `app/(authenticated)/pagos/otros-asociados/pago/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { OtrosAsociadosConfirmationCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockUserData,
  mockSourceAccounts,
  OTROS_ASOCIADOS_PAYMENT_STEPS,
} from '@/src/mocks/mockOtrosAsociadosPaymentData';
import {
  RegisteredBeneficiary,
  PayableProduct,
  OtrosAsociadosConfirmationData,
} from '@/src/types/otros-asociados-payment';

export default function OtrosAsociadosConfirmacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<OtrosAsociadosConfirmationData | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago a otros asociados', href: '/pagos/otros-asociados' },
  ];

  useEffect(() => {
    // Get data from sessionStorage
    const beneficiaryStr = sessionStorage.getItem('otrosAsociadosBeneficiary');
    const accountId = sessionStorage.getItem('otrosAsociadosAccountId');
    const productsStr = sessionStorage.getItem('otrosAsociadosProducts');
    const totalAmount = sessionStorage.getItem('otrosAsociadosTotalAmount');

    if (!beneficiaryStr || !accountId || !productsStr || !totalAmount) {
      router.push('/pagos/otros-asociados/pago');
      return;
    }

    const beneficiary: RegisteredBeneficiary = JSON.parse(beneficiaryStr);
    const products: PayableProduct[] = JSON.parse(productsStr);
    const account = mockSourceAccounts.find((a) => a.id === accountId);

    if (!account) {
      router.push('/pagos/otros-asociados/pago');
      return;
    }

    setConfirmationData({
      titular: mockUserData.name,
      documento: mockUserData.document,
      productoADebitar: account.type,
      beneficiaryName: beneficiary.fullName,
      products: products.map((p) => ({
        name: p.name,
        amount: p.amountToPay,
      })),
      totalAmount: parseInt(totalAmount, 10),
    });
  }, [router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        'otrosAsociadosConfirmation',
        JSON.stringify(confirmationData)
      );
    }

    // TODO: API call to initiate payment and send SMS
    router.push('/pagos/otros-asociados/pago/sms');
  };

  const handleBack = () => {
    router.push('/pagos/otros-asociados/pago');
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
          <h1 className="text-xl font-medium text-black">Pago a otros asociados</h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={2} steps={OTROS_ASOCIADOS_PAYMENT_STEPS} />

      <OtrosAsociadosConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
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

### Step 3: SMS Code Page

**File**: `app/(authenticated)/pagos/otros-asociados/pago/sms/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { CodeInputCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { OTROS_ASOCIADOS_PAYMENT_STEPS } from '@/src/mocks/mockOtrosAsociadosPaymentData';

export default function OtrosAsociadosSmsPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago a otros asociados', href: '/pagos/otros-asociados' },
  ];

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem('otrosAsociadosConfirmation');
    if (!confirmationData) {
      router.push('/pagos/otros-asociados/pago');
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
    // Validation
    if (code.length !== 6) {
      setError('Por favor ingresa el código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Accept code "123456" for testing
      if (code === '123456') {
        router.push('/pagos/otros-asociados/pago/resultado');
      } else {
        setError('Código incorrecto. Por favor intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/otros-asociados/pago/confirmacion');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton onClick={handleBack} />
        <h1 className="text-xl font-medium text-black">Pago a otros asociados</h1>
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={3} steps={OTROS_ASOCIADOS_PAYMENT_STEPS} />

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
          className="text-sm font-medium text-[#004266] hover:underline disabled:opacity-50"
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

**File**: `app/(authenticated)/pagos/otros-asociados/pago/resultado/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { OtrosAsociadosResultCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  OTROS_ASOCIADOS_PAYMENT_STEPS,
  mockOtrosAsociadosTransactionResult,
} from '@/src/mocks/mockOtrosAsociadosPaymentData';
import {
  OtrosAsociadosTransactionResult,
  PayableProduct,
} from '@/src/types/otros-asociados-payment';

export default function OtrosAsociadosResultadoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result, setResult] = useState<OtrosAsociadosTransactionResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago a otros asociados', href: '/pagos/otros-asociados' },
  ];

  useEffect(() => {
    // Get data from session and build result
    const totalAmount = sessionStorage.getItem('otrosAsociadosTotalAmount');
    const productsStr = sessionStorage.getItem('otrosAsociadosProducts');

    if (totalAmount && productsStr) {
      const products: PayableProduct[] = JSON.parse(productsStr);
      const firstProduct = products[0];

      setResult({
        ...mockOtrosAsociadosTransactionResult,
        amountPaid: parseInt(totalAmount, 10),
        creditLine: firstProduct?.name || 'Pago a Asociado',
        productNumber: firstProduct?.productNumber || '***0000',
      });
    } else {
      setResult(mockOtrosAsociadosTransactionResult);
    }

    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('otrosAsociadosBeneficiary');
      sessionStorage.removeItem('otrosAsociadosAccountId');
      sessionStorage.removeItem('otrosAsociadosProducts');
      sessionStorage.removeItem('otrosAsociadosTotalAmount');
      sessionStorage.removeItem('otrosAsociadosConfirmation');
    };
  }, []);

  const handlePrintSave = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear session storage
    sessionStorage.removeItem('otrosAsociadosBeneficiary');
    sessionStorage.removeItem('otrosAsociadosAccountId');
    sessionStorage.removeItem('otrosAsociadosProducts');
    sessionStorage.removeItem('otrosAsociadosTotalAmount');
    sessionStorage.removeItem('otrosAsociadosConfirmation');

    router.push('/pagos');
  };

  if (!result) {
    return <div>Cargando resultado...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-black">Pago a otros asociados</h1>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={4} steps={OTROS_ASOCIADOS_PAYMENT_STEPS} />

      <OtrosAsociadosResultCard result={result} hideBalances={hideBalances} />

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

| Key | Description | Type |
|-----|-------------|------|
| `otrosAsociadosBeneficiary` | Selected beneficiary object | JSON (RegisteredBeneficiary) |
| `otrosAsociadosAccountId` | Selected source account ID | string |
| `otrosAsociadosProducts` | Selected products with amounts | JSON (PayableProduct[]) |
| `otrosAsociadosTotalAmount` | Total payment amount | string |
| `otrosAsociadosConfirmation` | Confirmation data | JSON (OtrosAsociadosConfirmationData) |

### Navigation Flow

```
/pagos/otros-asociados (Pre-step: Beneficiary Selection)
    ↓ Select beneficiary
/pagos/otros-asociados/pago (Step 1: Details)
    ↓ Continue
/pagos/otros-asociados/pago/confirmacion (Step 2: Confirmation)
    ↓ Confirm Payment
/pagos/otros-asociados/pago/sms (Step 3: SMS Code)
    ↓ Pay
/pagos/otros-asociados/pago/resultado (Step 4: Result)
    ↓ Finish
/pagos (Return to payments menu)
```

---

## Mock Data

### File: `src/mocks/mockOtrosAsociadosPaymentData.ts`

```typescript
import { Step } from '@/src/types/stepper';
import {
  RegisteredBeneficiary,
  PayableProduct,
  SourceAccount,
  OtrosAsociadosTransactionResult,
} from '@/src/types/otros-asociados-payment';

/**
 * Mock registered beneficiaries (other associates)
 */
export const mockRegisteredBeneficiaries: RegisteredBeneficiary[] = [
  {
    id: '1',
    fullName: 'MARÍA FERNANDA GONZALEZ',
    alias: 'Mamá',
    documentNumber: '***3040',
  },
  {
    id: '2',
    fullName: 'CARLOS ALBERTO RAMIREZ',
    alias: 'Papá',
    documentNumber: '***5678',
  },
  {
    id: '3',
    fullName: 'ANDREA SOFIA MARTINEZ',
    alias: 'Hermana',
    documentNumber: '***9012',
  },
];

/**
 * Mock source accounts
 */
export const mockSourceAccounts: SourceAccount[] = [
  {
    id: '1',
    type: 'Cuenta de Ahorros',
    balance: 8730500,
    number: '****4428',
  },
  {
    id: '2',
    type: 'Cuenta Corriente',
    balance: 5200000,
    number: '****7891',
  },
];

/**
 * Mock payable products for beneficiary
 */
export const mockPayableProducts: PayableProduct[] = [
  {
    id: '1',
    name: 'Plan Senior',
    productNumber: '***5488',
    minimumPayment: null,
    totalPayment: null,
    amountToPay: 0,
    isSelected: false,
  },
  {
    id: '2',
    name: 'Crédito de Libre Inversión',
    productNumber: '***1010',
    minimumPayment: 850000,
    totalPayment: 12500000,
    amountToPay: 850000,
    isSelected: false,
  },
  {
    id: '3',
    name: 'Seguro de Vida',
    productNumber: '***2020',
    minimumPayment: 120000,
    totalPayment: 1440000,
    amountToPay: 120000,
    isSelected: false,
  },
];

/**
 * Mock user data (payer)
 */
export const mockUserData = {
  name: 'CAMILO ANDRÉS CRUZ',
  document: 'CC 1.***.***. 234',
};

/**
 * Mock transaction result (success)
 */
export const mockOtrosAsociadosTransactionResult: OtrosAsociadosTransactionResult = {
  success: true,
  creditLine: 'Crédito de Libre Inversión',
  productNumber: '***5678',
  amountPaid: 850000,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '950606',
  description: 'Exitosa',
};

/**
 * Mock transaction result (error)
 */
export const mockOtrosAsociadosTransactionResultError: OtrosAsociadosTransactionResult = {
  success: false,
  creditLine: 'Crédito de Libre Inversión',
  productNumber: '***5678',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '-',
  description: 'Fallida',
};

/**
 * Payment flow steps
 */
export const OTROS_ASOCIADOS_PAYMENT_STEPS: Step[] = [
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

### File: `src/schemas/otrosAsociadosPaymentSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Step 1: Payment details validation
 */
export const otrosAsociadosDetailsSchema = yup.object({
  sourceAccountId: yup
    .string()
    .required('Por favor selecciona una cuenta'),
  selectedProducts: yup
    .array()
    .min(1, 'Por favor selecciona al menos un producto'),
});

export type OtrosAsociadosDetailsFormData = yup.InferType<
  typeof otrosAsociadosDetailsSchema
>;

/**
 * Custom validation for payment amounts
 */
export const validatePaymentAmounts = (
  products: Array<{ amountToPay: number; minimumPayment: number | null; isSelected: boolean }>
): string | null => {
  for (const product of products) {
    if (product.isSelected && product.amountToPay <= 0) {
      return 'El valor a pagar debe ser mayor a 0 para todos los productos seleccionados';
    }
  }
  return null;
};

/**
 * Validate total amount against account balance
 */
export const validateSufficientBalance = (
  totalAmount: number,
  accountBalance: number
): string | null => {
  if (totalAmount > accountBalance) {
    return 'Saldo insuficiente en la cuenta seleccionada';
  }
  return null;
};
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/09d-pagos/
├── references.md
└── spec.md

src/
├── atoms/
│   ├── Checkbox.tsx                           # NEW (if not exists)
│   └── index.ts                               # UPDATE

├── molecules/
│   ├── BeneficiaryListItem.tsx                # NEW
│   ├── PayableProductCard.tsx                 # NEW
│   ├── ConfirmationRow.tsx                    # NEW
│   └── index.ts                               # UPDATE

├── organisms/
│   ├── BeneficiarySelectionCard.tsx           # NEW
│   ├── OtrosAsociadosDetailsCard.tsx          # NEW
│   ├── OtrosAsociadosConfirmationCard.tsx     # NEW
│   ├── OtrosAsociadosResultCard.tsx           # NEW
│   └── index.ts                               # UPDATE

├── types/
│   ├── otros-asociados-payment.ts             # NEW
│   └── index.ts                               # UPDATE

├── mocks/
│   ├── mockOtrosAsociadosPaymentData.ts       # NEW
│   └── index.ts                               # UPDATE

└── schemas/
    └── otrosAsociadosPaymentSchemas.ts        # NEW

app/(authenticated)/pagos/otros-asociados/
├── page.tsx                                   # NEW - Beneficiary selection
└── pago/
    ├── page.tsx                               # NEW - Step 1
    ├── confirmacion/
    │   └── page.tsx                           # NEW - Step 2
    ├── sms/
    │   └── page.tsx                           # NEW - Step 3
    └── resultado/
        └── page.tsx                           # NEW - Step 4
```

---

## Implementation Order

### Phase 1: Types & Mock Data
1. Create type definitions:
   - `src/types/otros-asociados-payment.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockOtrosAsociadosPaymentData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Atoms
3. Create atoms (if not exists):
   - `src/atoms/Checkbox.tsx`
   - Update `src/atoms/index.ts`

### Phase 3: Molecules
4. Create molecules:
   - `src/molecules/BeneficiaryListItem.tsx`
   - `src/molecules/PayableProductCard.tsx`
   - `src/molecules/ConfirmationRow.tsx`
   - Update `src/molecules/index.ts`

### Phase 4: Organisms
5. Create organisms:
   - `src/organisms/BeneficiarySelectionCard.tsx`
   - `src/organisms/OtrosAsociadosDetailsCard.tsx`
   - `src/organisms/OtrosAsociadosConfirmationCard.tsx`
   - `src/organisms/OtrosAsociadosResultCard.tsx`
   - Update `src/organisms/index.ts`

### Phase 5: Pages
6. Create pages in order:
   - `app/(authenticated)/pagos/otros-asociados/page.tsx` (Beneficiary selection)
   - `app/(authenticated)/pagos/otros-asociados/pago/page.tsx` (Step 1)
   - `app/(authenticated)/pagos/otros-asociados/pago/confirmacion/page.tsx` (Step 2)
   - `app/(authenticated)/pagos/otros-asociados/pago/sms/page.tsx` (Step 3)
   - `app/(authenticated)/pagos/otros-asociados/pago/resultado/page.tsx` (Step 4)

### Phase 6: Validation Schemas (Optional)
7. Create validation schemas:
   - `src/schemas/otrosAsociadosPaymentSchemas.ts`

### Phase 7: Testing & Refinement
8. Manual testing of complete flow
9. Edge case testing
10. Responsive testing
11. Accessibility testing

---

## Testing Strategy

### Manual Testing Checklist

#### Pre-step: Beneficiary Selection
- [ ] Page renders correctly
- [ ] Back button navigates to /pagos
- [ ] Breadcrumbs display correctly
- [ ] Beneficiary list renders all mock beneficiaries
- [ ] Each beneficiary shows name, alias, and masked document
- [ ] Chevron icon appears on right side
- [ ] Clicking beneficiary navigates to Step 1
- [ ] Selected beneficiary stored in sessionStorage
- [ ] Empty state shows message when no beneficiaries

#### Step 1: Details
- [ ] Page renders correctly
- [ ] Stepper shows step 1 as active
- [ ] Beneficiary name displays in card title
- [ ] Account dropdown populates with mock accounts
- [ ] Account balances display (and hide with toggle)
- [ ] "¿Necesitas más saldo?" link is clickable
- [ ] Products list renders with checkboxes
- [ ] Checking product shows amount input
- [ ] Unchecking product hides amount input
- [ ] Amount input is editable
- [ ] Total amount updates dynamically
- [ ] hideBalances toggle works for all amounts
- [ ] Validation: error if no account selected
- [ ] Validation: error if no products selected
- [ ] Validation: error if any amount is 0 or negative
- [ ] Validation: error if total exceeds account balance
- [ ] "Volver" navigates back to beneficiary selection
- [ ] "Continuar" navigates to step 2 with valid data
- [ ] Redirects to beneficiary selection if no beneficiary in sessionStorage

#### Step 2: Confirmation
- [ ] Page renders correctly
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] Titular name and masked document display
- [ ] Source account type displays
- [ ] Beneficiary name displays
- [ ] All selected products with amounts display
- [ ] Total amount displays correctly
- [ ] hideBalances toggle works
- [ ] "Volver" navigates back to step 1
- [ ] "Confirmar Pago" navigates to step 3
- [ ] Redirects to step 1 if no sessionStorage data

#### Step 3: SMS Code
- [ ] Page renders correctly
- [ ] Stepper shows step 3 active, steps 1-2 completed
- [ ] 6 code input fields render
- [ ] First input auto-focuses on load
- [ ] Typing digit auto-advances to next input
- [ ] Backspace on empty input focuses previous
- [ ] Arrow keys navigate between inputs
- [ ] Paste distributes digits across inputs
- [ ] "Reenviar" link is clickable
- [ ] Resend disabled for 60 seconds after clicking
- [ ] Error shows for incomplete code
- [ ] Error shows for invalid code (not "123456")
- [ ] "Volver" navigates back to step 2
- [ ] "Pagar" processes with loading state
- [ ] Success navigates to step 4
- [ ] Redirects to step 1 if no sessionStorage data

#### Step 4: Result
- [ ] Page renders correctly
- [ ] Stepper shows all steps completed
- [ ] Success icon displays for successful transaction
- [ ] "Transacción Exitosa" title shows
- [ ] Credit line and product number display
- [ ] Amount paid displays correctly
- [ ] Transaction cost shows $ 0
- [ ] Date and time display
- [ ] Approval number displays
- [ ] Description shows in green for success
- [ ] hideBalances toggle works for amount
- [ ] "Imprimir/Guardar" triggers print dialog
- [ ] "Finalizar" navigates to /pagos
- [ ] sessionStorage is cleared on finish

### Error States Testing
- [ ] Error result card renders correctly
- [ ] Error icon (red X) displays
- [ ] "Transacción Fallida" title shows
- [ ] Description shows in red for error

### Responsive Testing
- [ ] Desktop (≥1024px): Layout correct
- [ ] Tablet (640-1023px): Layout adapts
- [ ] Mobile (<640px): Stacked layout works
- [ ] Beneficiary list items responsive
- [ ] Product cards responsive
- [ ] Stepper labels visible on all breakpoints

### Accessibility Testing
- [ ] Tab navigation works through all interactive elements
- [ ] Beneficiary items are keyboard accessible
- [ ] Checkboxes have proper labels
- [ ] Focus states visible
- [ ] Screen reader announces steps
- [ ] Error messages announced
- [ ] Form fields have proper labels
- [ ] Buttons have descriptive text

---

## Dependencies

### Reused from 09a-pagos
- `Stepper` molecule
- `StepperCircle` atom
- `StepperConnector` atom
- `CodeInput` atom
- `CodeInputGroup` molecule
- `CodeInputCard` organism
- `TransactionDetailRow` molecule
- Step types and interfaces

### Reused from 09b-pagos
- `CurrencyInput` atom

### Existing Components
- `BackButton` atom
- `Button` atom
- `Card` atom
- `Divider` atom
- `ChevronIcon` atom
- `Breadcrumbs` molecule
- `HideBalancesToggle` molecule

### New for 09d-pagos
- `Checkbox` atom (if not exists)
- `BeneficiaryListItem` molecule
- `PayableProductCard` molecule
- `ConfirmationRow` molecule
- `BeneficiarySelectionCard` organism
- `OtrosAsociadosDetailsCard` organism
- `OtrosAsociadosConfirmationCard` organism
- `OtrosAsociadosResultCard` organism

---

## Notes & Considerations

### Key Differences from Other Payment Flows
1. **Pre-step**: Beneficiary selection is required before entering the wizard
2. **Multi-product selection**: Uses checkboxes for multiple products
3. **Per-product amounts**: Each selected product has its own amount input
4. **Payment to others**: Pays another associate's products, not own products

### Product Selection Logic
- Products are shown with checkboxes
- Selecting a product reveals the amount input
- Default amount can be minimum payment or 0
- User can edit amount for each product
- Total is calculated from all selected products

### Session Storage Cleanup
- All sessionStorage keys are cleared on:
  - Successful completion (Finalizar button)
  - Leaving the flow (manual navigation)
  - Component unmount on result page

### SMS Code Testing
- Mock valid code: `123456`
- Any other 6-digit code will show error
- In production, implement actual SMS verification

### Error Handling
- Handle no beneficiary selected
- Handle no account selected
- Handle no products selected
- Handle zero/negative amounts
- Handle insufficient balance
- Handle invalid SMS code
- Handle network failures gracefully

### Accessibility
- All interactive elements keyboard accessible
- Checkboxes have aria-labels
- Focus management in OTP inputs
- Error messages linked to inputs
- Color contrast meets WCAG AA

---

## API Integration Points (Future)

- `GET /api/beneficiaries` - Get registered beneficiaries
- `GET /api/beneficiaries/:id/products` - Get payable products for beneficiary
- `GET /api/accounts` - Get user's source accounts
- `POST /api/payments/otros-asociados/initiate` - Start payment and send SMS
- `POST /api/payments/otros-asociados/verify` - Verify SMS code and execute payment
- `GET /api/payments/otros-asociados/:transactionId` - Get transaction result

---

## Design System Values Reference

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Primary Text (titles) | Navy Blue | #1D4E8F |
| Primary Button | Blue | #007FFF |
| Secondary Button Border | Navy | #1D4E8F |
| Link Text | Dark Blue | #004266 |
| Success Text/Icon | Green | #00A44C |
| Error Text/Icon | Red | #FF0D00 |
| Inactive Step | Gray | #E4E6EA |
| Inactive Step Text | Gray | #808284 |
| Card Background | White | #FFFFFF |
| Page Background | Light Blue | #F0F9FF |
| Divider Lines | Gray | #E4E6EA, #B1B1B1 |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Section Title | Ubuntu | 18px | Bold |
| Beneficiary Name | Ubuntu | 18px | Medium |
| Body Text | Ubuntu | 15px | Regular |
| Small Text | Ubuntu | 14px | Regular |
| Labels (light) | Ubuntu | 12px | Light/Regular |
| Currency Values | Ubuntu | 21px | Regular/Medium |
| Button Text | Ubuntu | 14-16px | Bold |

### Spacing
- Card padding: `24px` (p-6)
- Section spacing: `24px` (space-y-6)
- List item spacing: `12px` (space-y-3)

### Border Radius
- Cards: `16px` (rounded-2xl)
- List items: `8px` (rounded-lg)
- Inputs: `6px` (rounded-md)

---

**Last Updated**: 2026-01-06
**Status**: Ready for Implementation
**Estimated Effort**: 8-10 hours (assuming 09a/09b/09c components exist)
**Dependencies**: Features 09a-pagos, 09b-pagos components should be implemented first
