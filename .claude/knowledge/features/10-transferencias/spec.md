# Feature 10 - Transferencias: Internal Transfers (Entre mis Cuentas) - Technical Specification

**Feature**: Internal Transfers - Between My Accounts
**Version**: 1.0
**Status**: Implementation Ready
**Last Updated**: 2026-01-13

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [User Stories](#user-stories)
3. [Technical Architecture](#technical-architecture)
4. [Type Definitions](#type-definitions)
5. [Component Specifications](#component-specifications)
6. [Page Implementations](#page-implementations)
7. [State Management](#state-management)
8. [Utility Functions](#utility-functions)
9. [Mock Data](#mock-data)
10. [Validation Schemas](#validation-schemas)
11. [File Structure](#file-structure)
12. [Implementation Order](#implementation-order)
13. [Testing Strategy](#testing-strategy)

---

## Feature Overview

The **Transferencias Internas - Entre mis Cuentas** feature allows users to transfer money between their own financial products within Coasmedas. This is one of four internal transfer flows, and is the primary flow to be implemented.

### Key Characteristics
- **Multi-step flow**: 4 sequential steps with progress tracking
- **Security**: SMS verification for transaction authorization
- **Reusability**: Uses existing Stepper component from 09a-pagos
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliant

### Navigation Context
**Sidebar Structure**:
```
Transferencias (accordion)
├── Internas
│   ├── Entre mis cuentas ← THIS FEATURE
│   ├── A cuentas de mi red
│   ├── Desde cupos rotativos
│   └── Recargar con PSE
├── Inscribir cuentas
├── A otros bancos
├── Cuentas de mi red Coopcentral
└── Programar transferencias
```

### User Journey
1. Select "Entre mis cuentas" from flow options
2. Fill transfer details (source, destination, amount)
3. Review and confirm transfer details
4. Enter 6-digit SMS security code
5. View transaction result with option to print/save

---

## User Stories

### US-10.1: View Internal Transfer Options
**As an** authenticated user
**I want** to see all internal transfer options
**So that** I can choose the type of transfer I need

**Acceptance Criteria**:
- [ ] Page displays at `/transferencias/internas`
- [ ] Shows 4 transfer flow options in a 2x2 grid
- [ ] Each option has title and description
- [ ] Cards are clickable with dashed borders
- [ ] "Entre mis cuentas" navigates to transfer details

### US-10.2: Enter Transfer Details
**As an** authenticated user
**I want** to fill in transfer details
**So that** I can move money between my accounts

**Acceptance Criteria**:
- [ ] Page displays at `/transferencias/internas/entre-mis-cuentas`
- [ ] Stepper shows 4 steps with step 1 active
- [ ] Source account dropdown shows all user accounts with balances
- [ ] Destination product dropdown shows available products
- [ ] Amount field accepts currency input
- [ ] Confirm button validates form before proceeding
- [ ] "Volver" link navigates back to flow selection

### US-10.3: Review and Confirm Transfer
**As an** authenticated user
**I want** to review my transfer details
**So that** I can verify the transaction is correct

**Acceptance Criteria**:
- [ ] Page displays at `/transferencias/internas/entre-mis-cuentas/confirmacion`
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] Shows holder name and masked document
- [ ] Shows source account and destination product
- [ ] Shows transfer amount
- [ ] "Confirmar Pago" button triggers SMS verification
- [ ] "Volver" link navigates back to details

### US-10.4: Enter SMS Verification Code
**As an** authenticated user
**I want** to enter the SMS code sent to my phone
**So that** I can authorize the transfer

**Acceptance Criteria**:
- [ ] Page displays at `/transferencias/internas/entre-mis-cuentas/sms`
- [ ] Stepper shows step 3 active, steps 1-2 completed
- [ ] 6-digit OTP input with auto-advance
- [ ] "Reenviar" link to request new code
- [ ] "Pagar" button submits verification
- [ ] Error state for invalid code
- [ ] "Volver" link navigates back to confirmation

### US-10.5: View Transaction Result
**As an** authenticated user
**I want** to see the result of my transfer
**So that** I know if it was successful

**Acceptance Criteria**:
- [ ] Page displays at `/transferencias/internas/entre-mis-cuentas/resultado`
- [ ] Stepper shows all 4 steps completed
- [ ] Success shows green checkmark icon
- [ ] Error shows red X icon
- [ ] Transaction details displayed (date, time, approval number)
- [ ] "Imprimir/Guardar" button available
- [ ] "Realizar otra transacción" returns to step 1
- [ ] "Finalizar" navigates to home/transfers

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   └── (uses existing StepperCircle, StepperConnector, CodeInput from 09a-pagos)
│
├── molecules/
│   ├── FlowOptionCard.tsx           # NEW: Clickable flow selection card
│   └── (uses existing Stepper, CodeInputGroup, TransactionDetailRow)
│
├── organisms/
│   ├── InternasFlowGrid.tsx         # NEW: Grid of internal transfer options
│   ├── TransferDetailsCard.tsx      # NEW: Step 1 main card
│   ├── TransferConfirmationCard.tsx # NEW: Step 2 main card
│   └── (uses existing CodeInputCard, TransactionResultCard from 09a-pagos)
│
├── types/
│   └── transfer.ts                  # NEW: Transfer-related type definitions
│
├── utils/
│   └── transferHelpers.ts           # NEW: Transfer utility functions
│
├── mocks/
│   └── mockTransferData.ts          # NEW: Mock data for transfer flow
│
└── contexts/
    └── (optional: TransferFlowContext.tsx for future)

app/(authenticated)/transferencias/
├── internas/
│   ├── page.tsx                     # Flow selection
│   └── entre-mis-cuentas/
│       ├── page.tsx                 # Step 1: Details
│       ├── confirmacion/
│       │   └── page.tsx             # Step 2: Confirmation
│       ├── sms/
│       │   └── page.tsx             # Step 3: SMS Verification
│       └── resultado/
│           └── page.tsx             # Step 4: Result
```

### Technology Stack
- **React 19**: Component framework
- **Next.js 16 App Router**: Routing and page structure
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **react-hook-form**: Form state management (Step 1)
- **yup**: Validation schemas
- **Existing components**: Reuses Stepper, CodeInputGroup, TransactionResultCard from 09a-pagos

---

## Type Definitions

### File: `src/types/transfer.ts`

```typescript
/**
 * User account available for transfers
 */
export interface TransferAccount {
  id: string;
  name: string;           // "Cuenta de Ahorros"
  accountType: string;    // "Ahorros", "Ahorro Programado"
  productNumber: string;  // "4428" (raw, will be masked)
  balance: number;
}

/**
 * Destination product for transfer
 */
export interface DestinationProduct {
  id: string;
  name: string;           // "Ahorro Programado"
  productNumber: string;  // "1234" (raw, will be masked)
  productType: string;    // Type of product
}

/**
 * Step 1: Transfer details form data
 */
export interface TransferDetailsFormData {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
}

/**
 * Step 2: Confirmation data
 */
export interface TransferConfirmationData {
  holderName: string;
  documentNumber: string;   // Masked document number
  sourceAccount: string;    // "Cuenta de Ahorros (***4428)"
  destinationProduct: string; // "Ahorro Programado (***1234)"
  amount: number;
}

/**
 * Step 3: SMS verification form data
 */
export interface SMSVerificationFormData {
  code: string; // 6 digits
}

/**
 * Step 4: Transaction result
 */
export interface TransferResult {
  status: 'success' | 'error';
  sourceType: string;       // "Cuenta de Ahorros"
  productNumber: string;    // "Ahorro Programado"
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}

/**
 * Complete transfer flow state
 */
export interface TransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  formData: TransferDetailsFormData | null;
  selectedSourceAccount: TransferAccount | null;
  selectedDestination: DestinationProduct | null;
  confirmationData: TransferConfirmationData | null;
  verificationCode: string;
  transactionResult: TransferResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Internal transfer flow option
 */
export interface InternalTransferOption {
  id: string;
  title: string;
  description: string;
  href: string;
  enabled: boolean;
}
```

### Update: `src/types/index.ts`

```typescript
// Add export
export * from './transfer';
```

---

## Component Specifications

### Molecules

#### `FlowOptionCard.tsx`

**Location**: `src/molecules/FlowOptionCard.tsx`

**Props Interface**:
```typescript
interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
```

**Implementation**:
```typescript
import React from 'react';

interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const FlowOptionCard: React.FC<FlowOptionCardProps> = ({
  title,
  description,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-5 text-left
        border border-dashed border-[#B1B1B1] rounded-lg
        bg-white
        transition-colors duration-200
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-[#F0F9FF] hover:border-[#1D4E8F] cursor-pointer'
        }
        ${className}
      `}
      aria-label={title}
    >
      <h3 className="text-xl font-medium text-[#1D4E8F] mb-2">
        {title}
      </h3>
      <p className="text-[15px] text-black leading-relaxed">
        {description}
      </p>
    </button>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### Organisms

#### `InternasFlowGrid.tsx`

**Location**: `src/organisms/InternasFlowGrid.tsx`

**Props Interface**:
```typescript
interface InternasFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { FlowOptionCard } from '@/src/molecules';
import { InternalTransferOption } from '@/src/types/transfer';

interface InternasFlowGridProps {
  onSelectFlow: (flowId: string) => void;
  className?: string;
}

const INTERNAL_FLOWS: InternalTransferOption[] = [
  {
    id: 'entre-mis-cuentas',
    title: 'Entre mis cuentas',
    description: 'Mueve dinero entre tus cuentas de ahorro, bolsillos y más.',
    href: '/transferencias/internas/entre-mis-cuentas',
    enabled: true,
  },
  {
    id: 'a-cuentas-mi-red',
    title: 'A cuentas de mi red',
    description: 'Transfiere a cuentas de asociados previamente inscritos.',
    href: '/transferencias/internas/a-cuentas-mi-red',
    enabled: false,
  },
  {
    id: 'desde-cupos-rotativos',
    title: 'Desde cupos rotativos',
    description: 'Utiliza tus cupos de crédito para transferir a tus cuentas.',
    href: '/transferencias/internas/desde-cupos-rotativos',
    enabled: false,
  },
  {
    id: 'recargar-pse',
    title: 'Recargar con PSE',
    description: 'Trae dinero desde otros bancos a tus cuentas Coasmedas.',
    href: '/transferencias/internas/recargar-pse',
    enabled: false,
  },
];

export const InternasFlowGrid: React.FC<InternasFlowGridProps> = ({
  onSelectFlow,
  className = '',
}) => {
  return (
    <Card className={className}>
      <div className="mb-6">
        <h2 className="text-[21px] font-bold text-[#1D4E8F] mb-2">
          Transferencias Internas
        </h2>
        <p className="text-[15px] text-black">
          Transfiere entre tus productos financieros, a otros asociados de la
          cooperativa o trae dinero desde otros bancos de manera rápida y sencilla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTERNAL_FLOWS.map((flow) => (
          <FlowOptionCard
            key={flow.id}
            title={flow.title}
            description={flow.description}
            onClick={() => onSelectFlow(flow.id)}
            disabled={!flow.enabled}
          />
        ))}
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `TransferDetailsCard.tsx`

**Location**: `src/organisms/TransferDetailsCard.tsx`

**Props Interface**:
```typescript
interface TransferDetailsCardProps {
  accounts: TransferAccount[];
  destinations: DestinationProduct[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (productId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { TransferAccount, DestinationProduct } from '@/src/types/transfer';
import { formatCurrency, maskNumber, maskCurrency } from '@/src/utils';

interface TransferDetailsCardProps {
  accounts: TransferAccount[];
  destinations: DestinationProduct[];
  selectedSourceId: string;
  selectedDestinationId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onDestinationChange: (productId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

export const TransferDetailsCard: React.FC<TransferDetailsCardProps> = ({
  accounts,
  destinations,
  selectedSourceId,
  selectedDestinationId,
  amount,
  onSourceChange,
  onDestinationChange,
  onAmountChange,
  hideBalances,
  error,
}) => {
  const formatAccountOption = (account: TransferAccount) => {
    const maskedNumber = maskNumber(account.productNumber);
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.name} (${maskedNumber}) - Saldo: ${balance}`;
  };

  const formatDestinationOption = (product: DestinationProduct) => {
    const maskedNumber = maskNumber(product.productNumber);
    return `${product.name} (${maskedNumber})`;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters except for the value
    const value = e.target.value.replace(/[^0-9]/g, '');
    onAmountChange(value);
  };

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#1D4E8F] mb-2">
          Transferencias entre mis productos
        </h2>
        <p className="text-[15px] text-black">
          Mueve dinero entre tus cuentas de ahorro, bolsillos, inversiones y más.
        </p>
      </div>

      <div className="space-y-5">
        {/* Source Account */}
        <div>
          <label
            htmlFor="source-account"
            className="block text-[15px] text-black mb-2"
          >
            ¿De cuál cuenta quieres transferir?
          </label>
          <select
            id="source-account"
            value={selectedSourceId}
            onChange={(e) => onSourceChange(e.target.value)}
            className="
              w-full h-11 px-3 pr-10
              rounded-md border border-[#B1B1B1]
              text-base text-[#111827]
              focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none
              appearance-none bg-white
              bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')]
              bg-no-repeat bg-[right_12px_center]
            "
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {formatAccountOption(account)}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Product */}
        <div>
          <label
            htmlFor="destination-product"
            className="block text-[15px] text-black mb-2"
          >
            ¿A qué producto quieres abonar?
          </label>
          <select
            id="destination-product"
            value={selectedDestinationId}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="
              w-full h-11 px-3 pr-10
              rounded-md border border-[#B1B1B1]
              text-base text-[#111827]
              focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none
              appearance-none bg-white
              bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')]
              bg-no-repeat bg-[right_12px_center]
            "
          >
            <option value="">Seleccionar producto</option>
            {destinations
              .filter((d) => d.id !== selectedSourceId)
              .map((product) => (
                <option key={product.id} value={product.id}>
                  {formatDestinationOption(product)}
                </option>
              ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="transfer-amount"
            className="block text-[15px] text-black mb-2"
          >
            ¿Qué valor deseas transferir?
          </label>
          <div className="flex items-center border-b border-[#B1B1B1] pb-2">
            <span className="text-[19px] font-medium text-[#595959] mr-2">$</span>
            <input
              id="transfer-amount"
              type="text"
              inputMode="numeric"
              value={amount ? Number(amount).toLocaleString('es-CO') : '0'}
              onChange={handleAmountChange}
              className="
                flex-1 text-right text-[19px] font-medium text-[#111827]
                bg-transparent border-none outline-none
                focus:ring-0
              "
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#FF0D00] text-center">{error}</p>
      )}
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `TransferConfirmationCard.tsx`

**Location**: `src/organisms/TransferConfirmationCard.tsx`

**Props Interface**:
```typescript
interface TransferConfirmationCardProps {
  confirmationData: TransferConfirmationData;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { TransferConfirmationData } from '@/src/types/transfer';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface TransferConfirmationCardProps {
  confirmationData: TransferConfirmationData;
  hideBalances: boolean;
}

export const TransferConfirmationCard: React.FC<TransferConfirmationCardProps> = ({
  confirmationData,
  hideBalances,
}) => {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#004266] mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-[15px] text-black">
          Por favor, verifica que los datos de la transacción sean correctos antes de continuar.
        </p>
      </div>

      <div className="space-y-4">
        {/* Holder Info */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Nombre del Titular:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.holderName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Documento Titular:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.documentNumber}
          </span>
        </div>

        <Divider />

        {/* Account Info */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Cuenta Origen:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.sourceAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Cuenta Destino:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.destinationProduct}
          </span>
        </div>

        <Divider />

        {/* Amount */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Valor a Transferir:</span>
          <span className="text-lg font-medium text-black">
            {hideBalances ? maskCurrency() : formatCurrency(confirmationData.amount)}
          </span>
        </div>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `TransferResultCard.tsx`

**Location**: `src/organisms/TransferResultCard.tsx`

**Purpose**: Specialized result card for transfers with specific fields.

**Props Interface**:
```typescript
interface TransferResultCardProps {
  result: TransferResult;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { TransferResult } from '@/src/types/transfer';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface TransferResultCardProps {
  result: TransferResult;
  hideBalances: boolean;
}

export const TransferResultCard: React.FC<TransferResultCardProps> = ({
  result,
  hideBalances,
}) => {
  const isSuccess = result.status === 'success';

  return (
    <Card className="space-y-6">
      {/* Success/Error Icon */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={`
            w-[60px] h-[60px] rounded-full
            flex items-center justify-center
            border-2
            ${isSuccess ? 'border-[#00AFA9]' : 'border-[#FF0D00]'}
          `}
        >
          {isSuccess ? (
            <svg
              className="w-8 h-8 text-[#00AFA9]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-[#FF0D00]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <h2 className="text-[22px] font-bold text-[#1D4E8F]">
          {isSuccess ? 'Transacción Exitosa' : 'Transacción Fallida'}
        </h2>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Línea crédito:</span>
          <span className="text-[15px] font-medium text-black">
            {result.sourceType}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Número de producto:</span>
          <span className="text-[15px] font-medium text-black">
            {result.productNumber}
          </span>
        </div>

        <Divider />

        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Valor pagado:</span>
          <span className="text-[15px] font-medium text-black">
            {hideBalances ? maskCurrency() : formatCurrency(result.amountPaid)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Costo transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {formatCurrency(result.transactionCost)}
          </span>
        </div>

        <Divider />

        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Fecha de Transmisión:</span>
          <span className="text-[15px] font-medium text-black">
            {result.transmissionDate}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Hora de Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {result.transactionTime}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Número de Aprobación:</span>
          <span className="text-[15px] font-medium text-black">
            {result.approvalNumber}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Descripción:</span>
          <span className={`text-[15px] font-medium ${isSuccess ? 'text-[#00A44C]' : 'text-[#FF0D00]'}`}>
            {result.description}
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

### Flow Selection Page

**File**: `app/(authenticated)/transferencias/internas/page.tsx`

```typescript
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle } from '@/src/molecules';
import { InternasFlowGrid } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';

export default function TransferenciasInternasPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'Internas' },
  ];

  const handleSelectFlow = (flowId: string) => {
    if (flowId === 'entre-mis-cuentas') {
      router.push('/transferencias/internas/entre-mis-cuentas');
    }
    // Other flows are disabled for now
  };

  const handleBack = () => {
    router.push('/home');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">Internas</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Flow Selection Grid */}
      <InternasFlowGrid onSelectFlow={handleSelectFlow} />
    </div>
  );
}
```

---

### Step 1: Details Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { TransferDetailsCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockTransferAccounts,
  mockDestinationProducts,
  TRANSFER_STEPS,
} from '@/src/mocks/mockTransferData';

export default function EntreMisCuentasPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [selectedDestinationId, setSelectedDestinationId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'Entre mis Cuentas' },
  ];

  const handleConfirm = () => {
    setError('');

    // Validation
    if (!selectedSourceId) {
      setError('Por favor selecciona una cuenta origen');
      return;
    }
    if (!selectedDestinationId) {
      setError('Por favor selecciona un producto destino');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Por favor ingresa un valor a transferir');
      return;
    }

    const sourceAccount = mockTransferAccounts.find(
      (acc) => acc.id === selectedSourceId
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError('Saldo insuficiente en la cuenta seleccionada');
      return;
    }

    // Store data for next step
    sessionStorage.setItem('transferSourceId', selectedSourceId);
    sessionStorage.setItem('transferDestinationId', selectedDestinationId);
    sessionStorage.setItem('transferAmount', amount);

    // Navigate to confirmation
    router.push('/transferencias/internas/entre-mis-cuentas/confirmacion');
  };

  const handleBack = () => {
    router.push('/transferencias/internas');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">Entre mis Cuentas</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={1} steps={TRANSFER_STEPS} />
      </div>

      {/* Form Card */}
      <TransferDetailsCard
        accounts={mockTransferAccounts}
        destinations={mockDestinationProducts}
        selectedSourceId={selectedSourceId}
        selectedDestinationId={selectedDestinationId}
        amount={amount}
        onSourceChange={setSelectedSourceId}
        onDestinationChange={setSelectedDestinationId}
        onAmountChange={setAmount}
        hideBalances={hideBalances}
        error={error}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedSourceId || !selectedDestinationId || !amount}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 2: Confirmation Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { TransferConfirmationCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { TransferConfirmationData } from '@/src/types/transfer';
import {
  mockTransferAccounts,
  mockDestinationProducts,
  mockUserData,
  TRANSFER_STEPS,
} from '@/src/mocks/mockTransferData';
import { maskNumber } from '@/src/utils';

export default function ConfirmacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<TransferConfirmationData | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'Entre mis Cuentas' },
  ];

  useEffect(() => {
    // Get data from previous step
    const sourceId = sessionStorage.getItem('transferSourceId');
    const destinationId = sessionStorage.getItem('transferDestinationId');
    const amount = sessionStorage.getItem('transferAmount');

    if (!sourceId || !destinationId || !amount) {
      router.push('/transferencias/internas/entre-mis-cuentas');
      return;
    }

    const sourceAccount = mockTransferAccounts.find((acc) => acc.id === sourceId);
    const destination = mockDestinationProducts.find((p) => p.id === destinationId);

    if (!sourceAccount || !destination) {
      router.push('/transferencias/internas/entre-mis-cuentas');
      return;
    }

    setConfirmationData({
      holderName: mockUserData.name,
      documentNumber: mockUserData.document,
      sourceAccount: `${sourceAccount.name} (${maskNumber(sourceAccount.productNumber)})`,
      destinationProduct: `${destination.name} (${maskNumber(destination.productNumber)})`,
      amount: Number(amount),
    });
  }, [router]);

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        'transferConfirmation',
        JSON.stringify(confirmationData)
      );
    }

    // TODO: API call to initiate transfer and send SMS
    router.push('/transferencias/internas/entre-mis-cuentas/sms');
  };

  const handleBack = () => {
    router.push('/transferencias/internas/entre-mis-cuentas');
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-gray-500">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">Entre mis Cuentas</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={2} steps={TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <TransferConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirmPayment}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 3: SMS Verification Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/sms/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { CodeInputCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { TRANSFER_STEPS, MOCK_VALID_CODE } from '@/src/mocks/mockTransferData';

export default function SMSVerificationPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'Entre mis Cuentas' },
  ];

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem('transferConfirmation');
    if (!confirmationData) {
      router.push('/transferencias/internas/entre-mis-cuentas');
    }
  }, [router]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError('');
  };

  const handleResendCode = () => {
    // TODO: API call to resend SMS
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
      // TODO: API call to verify code and execute transfer
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === MOCK_VALID_CODE) {
        router.push('/transferencias/internas/entre-mis-cuentas/resultado');
      } else {
        setError('Código incorrecto. Por favor intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al procesar la transferencia. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/transferencias/internas/entre-mis-cuentas/confirmacion');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">Entre mis Cuentas</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={3} steps={TRANSFER_STEPS} />
      </div>

      {/* SMS Input Card */}
      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        onResendCode={handleResendCode}
        hasError={!!error}
        errorMessage={error}
        isResendDisabled={isResendDisabled}
        isLoading={isLoading}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#004266] hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handlePay}
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Procesando...' : 'Pagar'}
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 4: Result Page

**File**: `app/(authenticated)/transferencias/internas/entre-mis-cuentas/resultado/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { TransferResultCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { TransferResult } from '@/src/types/transfer';
import { TRANSFER_STEPS, mockTransferResult } from '@/src/mocks/mockTransferData';

export default function ResultadoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result, setResult] = useState<TransferResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'Entre mis Cuentas' },
  ];

  useEffect(() => {
    // TODO: Get result from API or construct from stored data
    const confirmationData = sessionStorage.getItem('transferConfirmation');

    if (!confirmationData) {
      router.push('/transferencias/internas/entre-mis-cuentas');
      return;
    }

    // Use mock result for now
    setResult(mockTransferResult);

    // Clean up session storage on unmount
    return () => {
      sessionStorage.removeItem('transferSourceId');
      sessionStorage.removeItem('transferDestinationId');
      sessionStorage.removeItem('transferAmount');
      sessionStorage.removeItem('transferConfirmation');
    };
  }, [router]);

  const handlePrintSave = () => {
    // TODO: Generate PDF with transaction details
    console.log('Print/Save transaction');
    window.print();
  };

  const handleNewTransaction = () => {
    // Clean session storage
    sessionStorage.removeItem('transferSourceId');
    sessionStorage.removeItem('transferDestinationId');
    sessionStorage.removeItem('transferAmount');
    sessionStorage.removeItem('transferConfirmation');

    // Navigate to start of flow
    router.push('/transferencias/internas/entre-mis-cuentas');
  };

  const handleFinish = () => {
    // Clean session storage
    sessionStorage.removeItem('transferSourceId');
    sessionStorage.removeItem('transferDestinationId');
    sessionStorage.removeItem('transferAmount');
    sessionStorage.removeItem('transferConfirmation');

    // Navigate to home or transfers
    router.push('/home');
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-gray-500">Cargando resultado...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={() => {}} disabled />
          <h1 className="text-xl font-medium text-black">Entre mis Cuentas</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper - All completed */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={4} steps={TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <TransferResultCard result={result} hideBalances={hideBalances} />

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={handlePrintSave}>
          Imprimir/Guardar
        </Button>
        <Button variant="outline" onClick={handleNewTransaction}>
          Realizar otra transacción
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

### Option 1: SessionStorage (Recommended for MVP)

Use browser sessionStorage to persist data between steps. This is the same approach used in 09a-pagos.

**Storage Keys**:
- `transferSourceId` - Selected source account ID
- `transferDestinationId` - Selected destination product ID
- `transferAmount` - Transfer amount (string)
- `transferConfirmation` - JSON stringified confirmation data

**Lifecycle**:
1. Step 1: Store form data on "Confirmar"
2. Step 2: Read data, store confirmation on "Confirmar Pago"
3. Step 3: Read confirmation, verify code
4. Step 4: Display result, clear storage on "Finalizar"

---

## Utility Functions

### File: `src/utils/transferHelpers.ts`

```typescript
import { TransferAccount } from '@/src/types/transfer';

/**
 * Validate if account has sufficient balance for transfer
 */
export const hasInsufficientBalance = (
  account: TransferAccount,
  requiredAmount: number
): boolean => {
  return account.balance < requiredAmount;
};

/**
 * Validate transfer amount
 */
export const isValidTransferAmount = (
  amount: number,
  minAmount: number = 1,
  maxAmount: number = 100000000
): boolean => {
  return amount >= minAmount && amount <= maxAmount;
};

/**
 * Format account for display in dropdown
 */
export const formatAccountOption = (
  account: TransferAccount,
  hideBalance: boolean,
  formatCurrency: (n: number) => string,
  maskCurrency: () => string,
  maskNumber: (n: string) => string
): string => {
  const maskedNumber = maskNumber(account.productNumber);
  const balance = hideBalance ? maskCurrency() : formatCurrency(account.balance);
  return `${account.name} (${maskedNumber}) - Saldo: ${balance}`;
};

/**
 * Clear all transfer flow data from sessionStorage
 */
export const clearTransferFlowData = (): void => {
  sessionStorage.removeItem('transferSourceId');
  sessionStorage.removeItem('transferDestinationId');
  sessionStorage.removeItem('transferAmount');
  sessionStorage.removeItem('transferConfirmation');
};

/**
 * Check if transfer flow has required data for a step
 */
export const hasRequiredDataForStep = (step: 1 | 2 | 3 | 4): boolean => {
  switch (step) {
    case 1:
      return true; // No prerequisite data needed
    case 2:
      return !!(
        sessionStorage.getItem('transferSourceId') &&
        sessionStorage.getItem('transferDestinationId') &&
        sessionStorage.getItem('transferAmount')
      );
    case 3:
      return !!sessionStorage.getItem('transferConfirmation');
    case 4:
      return !!sessionStorage.getItem('transferConfirmation');
    default:
      return false;
  }
};
```

**Export**: Add to `src/utils/index.ts`

---

## Mock Data

### File: `src/mocks/mockTransferData.ts`

```typescript
import {
  TransferAccount,
  DestinationProduct,
  TransferResult,
} from '@/src/types/transfer';
import { Step } from '@/src/types/stepper';

/**
 * Mock user accounts for transfer source
 */
export const mockTransferAccounts: TransferAccount[] = [
  {
    id: '1',
    name: 'Cuenta de Ahorros',
    accountType: 'Ahorros',
    productNumber: '4428',
    balance: 8730500,
  },
  {
    id: '2',
    name: 'Cuenta Corriente',
    accountType: 'Corriente',
    productNumber: '7891',
    balance: 5200000,
  },
  {
    id: '3',
    name: 'Cuenta Nómina',
    accountType: 'Nómina',
    productNumber: '2341',
    balance: 3450000,
  },
];

/**
 * Mock destination products
 */
export const mockDestinationProducts: DestinationProduct[] = [
  {
    id: '1',
    name: 'Cuenta de Ahorros',
    productNumber: '4428',
    productType: 'Ahorros',
  },
  {
    id: '4',
    name: 'Ahorro Programado',
    productNumber: '1234',
    productType: 'Ahorro Programado',
  },
  {
    id: '5',
    name: 'Ahorro Metas',
    productNumber: '9876',
    productType: 'Ahorro',
  },
  {
    id: '6',
    name: 'CDAT',
    productNumber: '5678',
    productType: 'Inversión',
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
 * Mock transaction result (success)
 */
export const mockTransferResult: TransferResult = {
  status: 'success',
  sourceType: 'Cuenta de Ahorros',
  productNumber: 'Ahorro Programado',
  amountPaid: 50000,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '7:21 pm',
  approvalNumber: '950606',
  description: 'Transferencia Exitosa',
};

/**
 * Mock transaction result (error)
 */
export const mockTransferResultError: TransferResult = {
  status: 'error',
  sourceType: 'Cuenta de Ahorros',
  productNumber: 'Ahorro Programado',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '7:21 pm',
  approvalNumber: '-',
  description: 'Fondos insuficientes',
};

/**
 * Transfer flow steps (reuses structure from pagos)
 */
export const TRANSFER_STEPS: Step[] = [
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

### File: `src/schemas/transferSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Step 1: Transfer details validation
 */
export const transferDetailsSchema = yup.object({
  sourceAccountId: yup
    .string()
    .required('Por favor selecciona una cuenta origen'),
  destinationProductId: yup
    .string()
    .required('Por favor selecciona un producto destino'),
  amount: yup
    .number()
    .required('Por favor ingresa un valor a transferir')
    .positive('El valor debe ser mayor a 0')
    .max(100000000, 'El valor máximo es $100.000.000'),
});

export type TransferDetailsFormData = yup.InferType<typeof transferDetailsSchema>;

/**
 * Step 3: SMS code verification validation
 */
export const smsVerificationSchema = yup.object({
  code: yup
    .string()
    .required('Por favor ingresa el código')
    .length(6, 'El código debe tener 6 dígitos')
    .matches(/^\d+$/, 'El código debe contener solo números'),
});

export type SMSVerificationFormData = yup.InferType<typeof smsVerificationSchema>;
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/10-transferencias/
├── references.md
└── spec.md

src/
├── atoms/
│   └── (uses existing: StepperCircle, StepperConnector, CodeInput, BackButton, Button)
│
├── molecules/
│   ├── FlowOptionCard.tsx              # NEW
│   └── index.ts                        # UPDATE
│
├── organisms/
│   ├── InternasFlowGrid.tsx            # NEW
│   ├── TransferDetailsCard.tsx         # NEW
│   ├── TransferConfirmationCard.tsx    # NEW
│   ├── TransferResultCard.tsx          # NEW
│   └── index.ts                        # UPDATE
│
├── types/
│   ├── transfer.ts                     # NEW
│   └── index.ts                        # UPDATE
│
├── utils/
│   ├── transferHelpers.ts              # NEW
│   └── index.ts                        # UPDATE
│
├── mocks/
│   ├── mockTransferData.ts             # NEW
│   └── index.ts                        # UPDATE
│
└── schemas/
    └── transferSchemas.ts              # NEW (optional)

app/(authenticated)/transferencias/
├── internas/
│   ├── page.tsx                        # NEW - Flow selection
│   └── entre-mis-cuentas/
│       ├── page.tsx                    # NEW - Step 1
│       ├── confirmacion/
│       │   └── page.tsx                # NEW - Step 2
│       ├── sms/
│       │   └── page.tsx                # NEW - Step 3
│       └── resultado/
│           └── page.tsx                # NEW - Step 4
```

---

## Implementation Order

### Phase 1: Foundation (Types & Mock Data)
1. Create type definitions:
   - `src/types/transfer.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockTransferData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Molecules
3. Create molecules:
   - `src/molecules/FlowOptionCard.tsx`
   - Update `src/molecules/index.ts`

### Phase 3: Organisms
4. Create organisms:
   - `src/organisms/InternasFlowGrid.tsx`
   - `src/organisms/TransferDetailsCard.tsx`
   - `src/organisms/TransferConfirmationCard.tsx`
   - `src/organisms/TransferResultCard.tsx`
   - Update `src/organisms/index.ts`

### Phase 4: Utilities
5. Create utility functions:
   - `src/utils/transferHelpers.ts`
   - Update `src/utils/index.ts`

### Phase 5: Pages
6. Create pages in order:
   - `app/(authenticated)/transferencias/internas/page.tsx` (Flow selection)
   - `app/(authenticated)/transferencias/internas/entre-mis-cuentas/page.tsx` (Step 1)
   - `app/(authenticated)/transferencias/internas/entre-mis-cuentas/confirmacion/page.tsx` (Step 2)
   - `app/(authenticated)/transferencias/internas/entre-mis-cuentas/sms/page.tsx` (Step 3)
   - `app/(authenticated)/transferencias/internas/entre-mis-cuentas/resultado/page.tsx` (Step 4)

### Phase 6: Testing & Refinement
7. Manual testing:
   - Test complete flow from selection to result
   - Test back navigation at each step
   - Test form validations
   - Test responsive behavior
   - Test accessibility (keyboard navigation)
   - Test with `hideBalances` enabled/disabled

8. Edge case testing:
   - Insufficient balance
   - Invalid SMS code
   - Direct URL access to later steps
   - Page refresh behavior
   - Same source and destination selection

---

## Testing Strategy

### Manual Testing Checklist

#### Flow Selection Page (`/transferencias/internas`)
- [ ] Page renders correctly
- [ ] Back button navigates to home
- [ ] 4 flow options display in grid
- [ ] "Entre mis cuentas" is clickable
- [ ] Other options show disabled state
- [ ] Clicking "Entre mis cuentas" navigates to step 1

#### Step 1: Details (`/transferencias/internas/entre-mis-cuentas`)
- [ ] Page renders correctly
- [ ] Stepper shows step 1 as active
- [ ] Source account dropdown populates with mock accounts
- [ ] Account balances display correctly (or masked)
- [ ] Destination dropdown excludes selected source
- [ ] Amount field accepts numeric input
- [ ] Amount formats with Colombian separators
- [ ] Validation error for empty source
- [ ] Validation error for empty destination
- [ ] Validation error for zero/empty amount
- [ ] Validation error for insufficient balance
- [ ] "Volver" navigates to flow selection
- [ ] "Confirmar" stores data and navigates to step 2

#### Step 2: Confirmation (`/transferencias/internas/entre-mis-cuentas/confirmacion`)
- [ ] Page renders correctly
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] Holder name displays correctly
- [ ] Masked document number displays
- [ ] Source account with masked number displays
- [ ] Destination product with masked number displays
- [ ] Transfer amount displays (or masked)
- [ ] "Volver" navigates to step 1
- [ ] "Confirmar Pago" navigates to step 3
- [ ] Redirects to step 1 if no session data

#### Step 3: SMS Verification (`/transferencias/internas/entre-mis-cuentas/sms`)
- [ ] Page renders correctly
- [ ] Stepper shows step 3 active, steps 1-2 completed
- [ ] 6 code input fields render
- [ ] First input auto-focuses on load
- [ ] Typing digit auto-advances to next input
- [ ] Backspace on empty focuses previous
- [ ] Paste distributes digits correctly
- [ ] "Reenviar" link works
- [ ] Error shows for incomplete code
- [ ] Error shows for invalid code (not "123456")
- [ ] Valid code ("123456") navigates to result
- [ ] Loading state shows during verification
- [ ] "Volver" navigates to step 2
- [ ] Redirects to step 1 if no session data

#### Step 4: Result (`/transferencias/internas/entre-mis-cuentas/resultado`)
- [ ] Page renders correctly
- [ ] Stepper shows all 4 steps completed
- [ ] Success checkmark icon displays
- [ ] Transaction details display correctly
- [ ] Description shows in green for success
- [ ] "Imprimir/Guardar" button works
- [ ] "Realizar otra transacción" returns to step 1
- [ ] "Finalizar" navigates to home
- [ ] Session storage cleared on exit

### Responsive Testing
- [ ] Desktop (≥1024px): Layout correct, grid 2x2
- [ ] Tablet (640-1023px): Layout adapts
- [ ] Mobile (<640px): Single column layout
- [ ] Stepper readable on all breakpoints
- [ ] Code inputs sized for touch on mobile

### Accessibility Testing
- [ ] Tab navigation through all elements
- [ ] Focus states visible
- [ ] Screen reader announces steps
- [ ] Form fields have labels
- [ ] Error messages announced
- [ ] Buttons have descriptive text

---

## Dependencies

### Existing Components (from 09a-pagos)
- `StepperCircle` (atom)
- `StepperConnector` (atom)
- `CodeInput` (atom)
- `Stepper` (molecule)
- `CodeInputGroup` (molecule)
- `CodeInputCard` (organism)

### Existing Components (general)
- `Card` (atom)
- `Button` (atom)
- `BackButton` (atom)
- `Divider` (atom)
- `Breadcrumbs` (molecule)
- `HideBalancesToggle` (molecule)

### Existing Contexts
- `UIContext` - for `hideBalances`
- `useWelcomeBar` - for welcome bar visibility

### Existing Utils
- `formatCurrency`
- `maskCurrency`
- `maskNumber`

---

## Security Considerations

- SMS code verification is mock for now
- In production, implement proper 2FA
- Add rate limiting for code attempts
- Add timeout for code expiration (e.g., 5 minutes)
- Validate transfer limits on backend
- Encrypt sensitive data

---

## Future Enhancements

1. **Additional Internal Flows**:
   - A cuentas de mi red
   - Desde cupos rotativos
   - Recargar con PSE

2. **TransferFlowContext**: Better state management with React Context

3. **API Integration**: Replace mock data with actual API calls

4. **Transaction History**: Link to view recent transfers

5. **Scheduled Transfers**: Integration with "Programar transferencias"

6. **Favorites**: Save frequent transfer destinations

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [09a-pagos spec](../09a-pagos/spec.md) - Reference for Stepper and OTP components
- [Design System](/.claude/design-system.md) - Color palette, typography
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - Transferencias Internas](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=772-1203)
**Dependencies**: Feature 09a-pagos (Stepper, CodeInputCard components)
**Status**: Ready for Implementation
