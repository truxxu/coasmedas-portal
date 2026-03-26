# Feature 10a - Transferencias: A Cuentas de mi Red - Technical Specification

**Feature**: Internal Transfers - To My Network Accounts
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

The **Transferencias Internas - A Cuentas de mi Red** feature allows users to transfer money to previously registered accounts belonging to other associates in the Coopcentral network. This is the second internal transfer flow, following "Entre mis cuentas".

### Key Characteristics

- **Multi-step flow**: 4 sequential steps with progress tracking
- **Recipient Selection**: First step allows selecting from pre-registered network contacts
- **Product Selection**: Users can choose the destination product from the recipient's available accounts
- **Security**: SMS verification for transaction authorization
- **Reusability**: Uses existing Stepper and CodeInputCard components from 09a-pagos/10-transferencias
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliant

### Navigation Context

**Sidebar Structure**:

```
Transferencias (accordion)
├── Internas
│   ├── Entre mis cuentas
│   ├── A cuentas de mi red ← THIS FEATURE
│   ├── Desde cupos rotativos
│   └── Recargar con PSE
├── Inscribir cuentas
├── A otros bancos
├── Cuentas de mi red Coopcentral
└── Programar transferencias
```

### User Journey

1. View list of registered network accounts (recipients)
2. Select recipient and their destination product, enter transfer amount
3. Enter 6-digit SMS security code
4. View transaction result with option to print/save

### Key Difference from "Entre mis cuentas"

| Aspect      | Entre mis cuentas                | A Cuentas de mi Red                        |
| ----------- | -------------------------------- | ------------------------------------------ |
| Step 1      | Form (source/destination/amount) | Recipient list selection                   |
| Step 2      | Confirmation review              | Form (source/destination/amount) + Captcha |
| Recipients  | Own accounts only                | Pre-registered network contacts            |
| Destination | Own products                     | Recipient's products                       |

---

## User Stories

### US-10a.1: View Registered Network Accounts

**As an** authenticated user
**I want** to see all my registered network contacts
**So that** I can choose who to transfer money to

**Acceptance Criteria**:

- [ ] Page displays at `/transferencias/internas/cuentas-mi-red`
- [ ] Stepper shows 4 steps with step 1 active
- [ ] Shows list of registered accounts with avatar, name, and product count
- [ ] Each item is clickable with chevron indicator
- [ ] Info note displays about registering new contacts
- [ ] "Volver" link navigates back to internal transfers selection

### US-10a.2: Enter Transfer Details

**As an** authenticated user
**I want** to fill in transfer details for my chosen recipient
**So that** I can send money to their account

**Acceptance Criteria**:

- [ ] Page displays at `/transferencias/internas/cuentas-mi-red/detalle`
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] Title shows recipient name: "Transferencias a [RECIPIENT_NAME]"
- [ ] Source account dropdown shows user's accounts with balances
- [ ] Destination product card shows selected recipient's product
- [ ] Amount field accepts currency input with formatting
- [ ] Captcha placeholder section displays
- [ ] "Confirmar" button validates form before proceeding
- [ ] "Volver" link navigates back to recipient selection

### US-10a.3: Enter SMS Verification Code

**As an** authenticated user
**I want** to enter the SMS code sent to my phone
**So that** I can authorize the transfer

**Acceptance Criteria**:

- [ ] Page displays at `/transferencias/internas/cuentas-mi-red/verificacion`
- [ ] Stepper shows step 3 active, steps 1-2 completed
- [ ] 6-digit OTP input with auto-advance
- [ ] "Reenviar" link to request new code
- [ ] "Pagar" button submits verification
- [ ] Error state for invalid code
- [ ] "Volver" link navigates back to details

### US-10a.4: View Transaction Result

**As an** authenticated user
**I want** to see the result of my transfer
**So that** I know if it was successful

**Acceptance Criteria**:

- [ ] Page displays at `/transferencias/internas/cuentas-mi-red/resultado`
- [ ] Stepper shows all 4 steps completed
- [ ] Success shows teal/green checkmark icon
- [ ] Displays: source account, recipient name, destination product, amount, cost
- [ ] Shows transaction metadata: date, time, approval number, description
- [ ] "Imprimir/Guardar" button available
- [ ] "Realizar otra transacción" returns to step 1
- [ ] "Finalizar" navigates to home/transfers

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   └── (uses existing: StepperCircle, StepperConnector, CodeInput, BackButton, Button, Avatar)
│
├── molecules/
│   ├── RegisteredAccountItem.tsx        # NEW: List item for network contacts
│   ├── DestinationProductCard.tsx       # NEW: Selected destination product display
│   ├── TransferAmountInput.tsx          # NEW: Currency input with $ symbol
│   ├── InfoNoteBox.tsx                  # NEW: Blue-bordered info note
│   └── (uses existing: Stepper, CodeInputGroup, HideBalancesToggle, Breadcrumbs)
│
├── organisms/
│   ├── RegisteredAccountsList.tsx       # NEW: List of network contacts
│   ├── NetworkTransferForm.tsx          # NEW: Step 2 transfer form
│   ├── NetworkTransferResultCard.tsx    # NEW: Step 4 result card with transfer-specific fields
│   └── (uses existing: CodeInputCard from 09a-pagos)
│
├── types/
│   └── networkTransfer.ts               # NEW: Network transfer type definitions
│
├── utils/
│   └── (uses existing: formatCurrency, maskCurrency, maskNumber)
│
├── mocks/
│   └── mockNetworkTransferData.ts       # NEW: Mock data for network transfer flow
│
└── contexts/
    └── (optional: NetworkTransferFlowContext.tsx for future)

app/(authenticated)/transferencias/internas/cuentas-mi-red/
├── page.tsx                             # Step 1: Recipient Selection
├── detalle/
│   └── page.tsx                         # Step 2: Transfer Details
├── verificacion/
│   └── page.tsx                         # Step 3: SMS Verification
└── resultado/
    └── page.tsx                         # Step 4: Result
```

### Technology Stack

- **React 19**: Component framework
- **Next.js 16 App Router**: Routing and page structure
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **react-hook-form**: Form state management (Step 2)
- **yup**: Validation schemas
- **Existing components**: Reuses Stepper, CodeInputGroup, CodeInputCard from 09a-pagos

---

## Type Definitions

### File: `src/types/networkTransfer.ts`

```typescript
/**
 * Registered account in user's network (recipient)
 */
export interface RegisteredNetworkAccount {
  id: string;
  name: string; // Full name (e.g., "MARÍA FERNANDA GONZALEZ")
  productCount: number; // Number of available products
  products: NetworkProduct[]; // Available products for this recipient
}

/**
 * Product belonging to a network contact
 */
export interface NetworkProduct {
  id: string;
  type: "ahorros" | "corriente"; // Account type
  name: string; // "Cuenta de Ahorros"
  maskedNumber: string; // "****4522"
}

/**
 * User's own account for transfer source
 */
export interface SourceAccount {
  id: string;
  name: string; // "Cuenta de Ahorros"
  accountType: string; // "Ahorros"
  productNumber: string; // "4428" (raw, will be masked)
  balance: number;
}

/**
 * Step 2: Network transfer form data
 */
export interface NetworkTransferFormData {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
}

/**
 * Step 4: Network transfer result
 */
export interface NetworkTransferResult {
  status: "success" | "error";
  sourceAccount: string; // "Cuenta de Ahorros"
  recipientName: string; // "MARIA FERNANDA GONZALEZ"
  destinationAccount: string; // "Cuenta de Ahorros (Ahorros ****4522)"
  amountTransferred: number;
  transactionCost: number;
  transactionDate: string; // "1 de septiembre de 2025"
  transactionTime: string; // "7:21 pm"
  approvalNumber: string; // "450606"
  description: string; // "Transferencia Exitosa"
}

/**
 * Complete network transfer flow state
 */
export interface NetworkTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedRecipient: RegisteredNetworkAccount | null;
  selectedDestinationProduct: NetworkProduct | null;
  selectedSourceAccount: SourceAccount | null;
  amount: number;
  verificationCode: string;
  transactionResult: NetworkTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
```

### Update: `src/types/index.ts`

```typescript
// Add export
export * from "./networkTransfer";
```

---

## Component Specifications

### Molecules

#### `RegisteredAccountItem.tsx`

**Location**: `src/molecules/RegisteredAccountItem.tsx`

**Props Interface**:

```typescript
interface RegisteredAccountItemProps {
  name: string;
  productCount: number;
  onClick: () => void;
  className?: string;
}
```

**Implementation**:

```typescript
import React from 'react';
import { Avatar, ChevronIcon } from '@/src/atoms';
import { generateInitials } from '@/src/utils';

interface RegisteredAccountItemProps {
  name: string;
  productCount: number;
  onClick: () => void;
  className?: string;
}

export const RegisteredAccountItem: React.FC<RegisteredAccountItemProps> = ({
  name,
  productCount,
  onClick,
  className = '',
}) => {
  const initials = generateInitials(name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4
        border-b border-[#E4E6EA] last:border-b-0
        hover:bg-[#F0F9FF] transition-colors
        ${className}
      `}
      aria-label={`Transferir a ${name}`}
    >
      <div className="flex items-center gap-4">
        <Avatar name={name} size="md" />
        <div className="text-left">
          <p className="text-lg font-medium text-[#1D4E8F] uppercase">
            {name}
          </p>
          <p className="text-sm text-black">
            {productCount} producto{productCount !== 1 ? 's' : ''} disponible{productCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <ChevronIcon direction="right" className="text-[#808284]" />
    </button>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `DestinationProductCard.tsx`

**Location**: `src/molecules/DestinationProductCard.tsx`

**Props Interface**:

```typescript
interface DestinationProductCardProps {
  productName: string;
  maskedNumber: string;
  productType: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}
```

**Implementation**:

```typescript
import React from 'react';

interface DestinationProductCardProps {
  productName: string;
  maskedNumber: string;
  productType: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const DestinationProductCard: React.FC<DestinationProductCardProps> = ({
  productName,
  maskedNumber,
  productType,
  isSelected = true,
  onClick,
  className = '',
}) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`
        w-full p-4 rounded-lg border text-left
        ${isSelected
          ? 'bg-white border-[#1D4E8F]'
          : 'bg-[#F5F5F5] border-[#E4E6EA] hover:bg-white hover:border-[#1D4E8F]'
        }
        ${onClick ? 'cursor-pointer transition-colors' : ''}
        ${className}
      `}
    >
      <p className="text-lg font-bold text-[#1D4E8F]">
        {productName} ({productType} {maskedNumber})
      </p>
    </Component>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `TransferAmountInput.tsx`

**Location**: `src/molecules/TransferAmountInput.tsx`

**Props Interface**:

```typescript
interface TransferAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}
```

**Implementation**:

```typescript
import React from 'react';

interface TransferAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const TransferAmountInput: React.FC<TransferAmountInputProps> = ({
  value,
  onChange,
  label = 'Valor a Transferir',
  error,
  disabled = false,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  // Format display value with Colombian number format
  const displayValue = value
    ? Number(value).toLocaleString('es-CO')
    : '0';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-black mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center border-b border-[#B1B1B1] pb-2">
        <span className="text-[21px] font-bold text-black mr-2">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          className={`
            flex-1 text-right text-[21px] font-bold text-black
            bg-transparent border-none outline-none
            focus:ring-0
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          placeholder="0"
          aria-label={label}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#FF0D00]">{error}</p>
      )}
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `InfoNoteBox.tsx`

**Location**: `src/molecules/InfoNoteBox.tsx`

**Props Interface**:

```typescript
interface InfoNoteBoxProps {
  children: React.ReactNode;
  className?: string;
}
```

**Implementation**:

```typescript
import React from 'react';

interface InfoNoteBoxProps {
  children: React.ReactNode;
  className?: string;
}

export const InfoNoteBox: React.FC<InfoNoteBoxProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-[#F0F9FF] border-l-4 border-[#007FFF]
        p-4 rounded-r-lg
        ${className}
      `}
      role="note"
    >
      <p className="text-[15px] text-[#1D4E8F]">
        {children}
      </p>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### Organisms

#### `RegisteredAccountsList.tsx`

**Location**: `src/organisms/RegisteredAccountsList.tsx`

**Props Interface**:

```typescript
interface RegisteredAccountsListProps {
  accounts: RegisteredNetworkAccount[];
  onSelectAccount: (account: RegisteredNetworkAccount) => void;
  className?: string;
}
```

**Implementation**:

```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { RegisteredAccountItem, InfoNoteBox } from '@/src/molecules';
import { RegisteredNetworkAccount } from '@/src/types/networkTransfer';

interface RegisteredAccountsListProps {
  accounts: RegisteredNetworkAccount[];
  onSelectAccount: (account: RegisteredNetworkAccount) => void;
  className?: string;
}

export const RegisteredAccountsList: React.FC<RegisteredAccountsListProps> = ({
  accounts,
  onSelectAccount,
  className = '',
}) => {
  return (
    <Card className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-lg font-bold text-[#1D4E8F] mb-2">
          Transferencias a cuentas de mi Red Coopcentral
        </h2>
        <p className="text-[15px] text-black">
          Transfiere a cuentas de asociados previamente inscritos en tu red.
        </p>
      </div>

      <div className="border border-[#E4E6EA] rounded-lg overflow-hidden">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <RegisteredAccountItem
              key={account.id}
              name={account.name}
              productCount={account.productCount}
              onClick={() => onSelectAccount(account)}
            />
          ))
        ) : (
          <div className="p-6 text-center text-[#808284]">
            No tienes cuentas registradas en tu red.
          </div>
        )}
      </div>

      <InfoNoteBox>
        <strong>Nota:</strong> Para transferir a un nuevo asociado, primero debes
        inscribir su cuenta en una de nuestras oficinas.
      </InfoNoteBox>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `NetworkTransferForm.tsx`

**Location**: `src/organisms/NetworkTransferForm.tsx`

**Props Interface**:

```typescript
interface NetworkTransferFormProps {
  recipientName: string;
  sourceAccounts: SourceAccount[];
  destinationProduct: NetworkProduct;
  selectedSourceId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}
```

**Implementation**:

```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { DestinationProductCard, TransferAmountInput } from '@/src/molecules';
import { SourceAccount, NetworkProduct } from '@/src/types/networkTransfer';
import { formatCurrency, maskCurrency, maskNumber } from '@/src/utils';

interface NetworkTransferFormProps {
  recipientName: string;
  sourceAccounts: SourceAccount[];
  destinationProduct: NetworkProduct;
  selectedSourceId: string;
  amount: string;
  onSourceChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  hideBalances: boolean;
  error?: string;
}

export const NetworkTransferForm: React.FC<NetworkTransferFormProps> = ({
  recipientName,
  sourceAccounts,
  destinationProduct,
  selectedSourceId,
  amount,
  onSourceChange,
  onAmountChange,
  hideBalances,
  error,
}) => {
  const formatAccountOption = (account: SourceAccount) => {
    const balance = hideBalances
      ? maskCurrency()
      : formatCurrency(account.balance);
    return `${account.name} - Saldo: ${balance}`;
  };

  return (
    <Card className="space-y-6">
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Transferencias a {recipientName}
      </h2>

      {/* Source Account Select */}
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
          {sourceAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {formatAccountOption(account)}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Product */}
      <div>
        <label className="block text-sm text-black mb-2">
          Selecciona el producto de destino:
        </label>
        <DestinationProductCard
          productName={destinationProduct.name}
          maskedNumber={destinationProduct.maskedNumber}
          productType={destinationProduct.type === 'ahorros' ? 'Ahorros' : 'Corriente'}
          isSelected
        />
      </div>

      {/* Transfer Amount */}
      <TransferAmountInput
        value={amount}
        onChange={onAmountChange}
        label="Valor a Transferir"
      />

      {/* Captcha Placeholder */}
      <div className="bg-[#F5F5F5] p-6 rounded-lg text-center">
        <span className="text-[#808284]">[Espacio para validación Captcha]</span>
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

#### `NetworkTransferResultCard.tsx`

**Location**: `src/organisms/NetworkTransferResultCard.tsx`

**Props Interface**:

```typescript
interface NetworkTransferResultCardProps {
  result: NetworkTransferResult;
  hideBalances: boolean;
}
```

**Implementation**:

```typescript
import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { NetworkTransferResult } from '@/src/types/networkTransfer';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface NetworkTransferResultCardProps {
  result: NetworkTransferResult;
  hideBalances: boolean;
}

export const NetworkTransferResultCard: React.FC<NetworkTransferResultCardProps> = ({
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

      {/* Transfer Details - Section 1 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Cuenta Origen:</span>
          <span className="text-[15px] font-medium text-black text-right">
            {result.sourceAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Destinatario:</span>
          <span className="text-[15px] font-medium text-black text-right">
            {result.recipientName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Cuenta Destino:</span>
          <span className="text-[15px] font-medium text-black text-right">
            {result.destinationAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Valor Transferido:</span>
          <span className="text-[15px] font-medium text-black">
            {hideBalances ? maskCurrency() : formatCurrency(result.amountTransferred)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Costo Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {formatCurrency(result.transactionCost)}
          </span>
        </div>
      </div>

      <Divider />

      {/* Transaction Metadata - Section 2 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Fecha de Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {result.transactionDate}
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

### Step 1: Recipient Selection Page

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/page.tsx`

```typescript
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { RegisteredAccountsList } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockRegisteredAccounts,
  NETWORK_TRANSFER_STEPS,
} from '@/src/mocks/mockNetworkTransferData';
import { RegisteredNetworkAccount } from '@/src/types/networkTransfer';

export default function CuentasMiRedPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'A Cuentas de mi Red' },
  ];

  const handleSelectAccount = (account: RegisteredNetworkAccount) => {
    // Store selected recipient for next step
    sessionStorage.setItem('networkTransferRecipient', JSON.stringify(account));

    // For now, select the first product by default
    if (account.products.length > 0) {
      sessionStorage.setItem(
        'networkTransferDestination',
        JSON.stringify(account.products[0])
      );
    }

    router.push('/transferencias/internas/cuentas-mi-red/detalle');
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
          <h1 className="text-xl font-medium text-black">A Cuentas de mi Red</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={1} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Registered Accounts List */}
      <RegisteredAccountsList
        accounts={mockRegisteredAccounts}
        onSelectAccount={handleSelectAccount}
      />

      {/* Footer Actions */}
      <div>
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
```

---

### Step 2: Transfer Details Page

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/detalle/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { NetworkTransferForm } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockSourceAccounts,
  NETWORK_TRANSFER_STEPS,
} from '@/src/mocks/mockNetworkTransferData';
import {
  RegisteredNetworkAccount,
  NetworkProduct,
} from '@/src/types/networkTransfer';

export default function DetallePage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [recipient, setRecipient] = useState<RegisteredNetworkAccount | null>(null);
  const [destinationProduct, setDestinationProduct] = useState<NetworkProduct | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'A Cuentas de mi Red' },
  ];

  useEffect(() => {
    // Get data from previous step
    const recipientData = sessionStorage.getItem('networkTransferRecipient');
    const destinationData = sessionStorage.getItem('networkTransferDestination');

    if (!recipientData || !destinationData) {
      router.push('/transferencias/internas/cuentas-mi-red');
      return;
    }

    setRecipient(JSON.parse(recipientData));
    setDestinationProduct(JSON.parse(destinationData));
  }, [router]);

  const handleConfirm = () => {
    setError('');

    // Validation
    if (!selectedSourceId) {
      setError('Por favor selecciona una cuenta origen');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Por favor ingresa un valor a transferir');
      return;
    }

    const sourceAccount = mockSourceAccounts.find(
      (acc) => acc.id === selectedSourceId
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError('Saldo insuficiente en la cuenta seleccionada');
      return;
    }

    // Store data for next step
    sessionStorage.setItem('networkTransferSourceId', selectedSourceId);
    sessionStorage.setItem('networkTransferAmount', amount);

    // Navigate to SMS verification
    router.push('/transferencias/internas/cuentas-mi-red/verificacion');
  };

  const handleBack = () => {
    router.push('/transferencias/internas/cuentas-mi-red');
  };

  if (!recipient || !destinationProduct) {
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
          <h1 className="text-xl font-medium text-black">A Cuentas de mi Red</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={2} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Transfer Form */}
      <NetworkTransferForm
        recipientName={recipient.name}
        sourceAccounts={mockSourceAccounts}
        destinationProduct={destinationProduct}
        selectedSourceId={selectedSourceId}
        amount={amount}
        onSourceChange={setSelectedSourceId}
        onAmountChange={setAmount}
        hideBalances={hideBalances}
        error={error}
      />

      {/* Footer Actions */}
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
          disabled={!selectedSourceId || !amount}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 3: SMS Verification Page

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/verificacion/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { CodeInputCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  NETWORK_TRANSFER_STEPS,
  MOCK_VALID_CODE,
} from '@/src/mocks/mockNetworkTransferData';

export default function VerificacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'A Cuentas de mi Red' },
  ];

  useEffect(() => {
    // Check if previous steps were completed
    const recipientData = sessionStorage.getItem('networkTransferRecipient');
    const sourceId = sessionStorage.getItem('networkTransferSourceId');
    const amount = sessionStorage.getItem('networkTransferAmount');

    if (!recipientData || !sourceId || !amount) {
      router.push('/transferencias/internas/cuentas-mi-red');
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
        router.push('/transferencias/internas/cuentas-mi-red/resultado');
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
    router.push('/transferencias/internas/cuentas-mi-red/detalle');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">A Cuentas de mi Red</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={3} steps={NETWORK_TRANSFER_STEPS} />
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

      {/* Footer Actions */}
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

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/resultado/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle, Stepper } from '@/src/molecules';
import { NetworkTransferResultCard } from '@/src/organisms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { NetworkTransferResult, RegisteredNetworkAccount, NetworkProduct } from '@/src/types/networkTransfer';
import {
  NETWORK_TRANSFER_STEPS,
  mockSourceAccounts,
} from '@/src/mocks/mockNetworkTransferData';
import { maskNumber } from '@/src/utils';

export default function ResultadoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result, setResult] = useState<NetworkTransferResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Transferencias', href: '/transferencias' },
    { label: 'A Cuentas de mi Red' },
  ];

  useEffect(() => {
    // Get data from session storage to construct result
    const recipientData = sessionStorage.getItem('networkTransferRecipient');
    const destinationData = sessionStorage.getItem('networkTransferDestination');
    const sourceId = sessionStorage.getItem('networkTransferSourceId');
    const amount = sessionStorage.getItem('networkTransferAmount');

    if (!recipientData || !destinationData || !sourceId || !amount) {
      router.push('/transferencias/internas/cuentas-mi-red');
      return;
    }

    const recipient: RegisteredNetworkAccount = JSON.parse(recipientData);
    const destination: NetworkProduct = JSON.parse(destinationData);
    const sourceAccount = mockSourceAccounts.find((acc) => acc.id === sourceId);

    // Construct result
    const transferResult: NetworkTransferResult = {
      status: 'success',
      sourceAccount: sourceAccount?.name || 'Cuenta de Ahorros',
      recipientName: recipient.name,
      destinationAccount: `${destination.name} (${destination.type === 'ahorros' ? 'Ahorros' : 'Corriente'} ${destination.maskedNumber})`,
      amountTransferred: Number(amount),
      transactionCost: 0,
      transactionDate: new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      transactionTime: new Date().toLocaleTimeString('es-CO', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      approvalNumber: Math.floor(100000 + Math.random() * 900000).toString(),
      description: 'Transferencia Exitosa',
    };

    setResult(transferResult);
  }, [router]);

  const handlePrintSave = () => {
    // TODO: Generate PDF with transaction details
    console.log('Print/Save transaction');
    window.print();
  };

  const handleNewTransaction = () => {
    // Clean session storage
    clearNetworkTransferData();
    router.push('/transferencias/internas/cuentas-mi-red');
  };

  const handleFinish = () => {
    // Clean session storage
    clearNetworkTransferData();
    router.push('/home');
  };

  const clearNetworkTransferData = () => {
    sessionStorage.removeItem('networkTransferRecipient');
    sessionStorage.removeItem('networkTransferDestination');
    sessionStorage.removeItem('networkTransferSourceId');
    sessionStorage.removeItem('networkTransferAmount');
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
          <h1 className="text-xl font-medium text-black">A Cuentas de mi Red</h1>
        </div>
        <HideBalancesToggle />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper - All completed */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Stepper currentStep={4} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <NetworkTransferResultCard result={result} hideBalances={hideBalances} />

      {/* Footer Actions */}
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

### SessionStorage (Recommended for MVP)

Use browser sessionStorage to persist data between steps, consistent with 09a-pagos and 10-transferencias.

**Storage Keys**:

- `networkTransferRecipient` - JSON stringified RegisteredNetworkAccount
- `networkTransferDestination` - JSON stringified NetworkProduct
- `networkTransferSourceId` - Selected source account ID
- `networkTransferAmount` - Transfer amount (string)

**Lifecycle**:

1. Step 1: Store recipient on selection
2. Step 2: Read recipient, store source and amount on "Confirmar"
3. Step 3: Read all data, verify code
4. Step 4: Display result, clear storage on "Finalizar"

---

## Utility Functions

### Existing Utils to Reuse

- `formatCurrency` - Format as Colombian Peso
- `maskCurrency` - Returns masked currency string
- `maskNumber` - Mask account numbers
- `generateInitials` - Get initials from name

### File: `src/utils/networkTransferHelpers.ts` (Optional)

```typescript
import {
  RegisteredNetworkAccount,
  SourceAccount,
} from "@/src/types/networkTransfer";

/**
 * Clear all network transfer flow data from sessionStorage
 */
export const clearNetworkTransferFlowData = (): void => {
  sessionStorage.removeItem("networkTransferRecipient");
  sessionStorage.removeItem("networkTransferDestination");
  sessionStorage.removeItem("networkTransferSourceId");
  sessionStorage.removeItem("networkTransferAmount");
};

/**
 * Check if network transfer flow has required data for a step
 */
export const hasRequiredDataForStep = (step: 1 | 2 | 3 | 4): boolean => {
  switch (step) {
    case 1:
      return true; // No prerequisite data needed
    case 2:
      return !!sessionStorage.getItem("networkTransferRecipient");
    case 3:
      return !!(
        sessionStorage.getItem("networkTransferRecipient") &&
        sessionStorage.getItem("networkTransferSourceId") &&
        sessionStorage.getItem("networkTransferAmount")
      );
    case 4:
      return !!(
        sessionStorage.getItem("networkTransferRecipient") &&
        sessionStorage.getItem("networkTransferSourceId") &&
        sessionStorage.getItem("networkTransferAmount")
      );
    default:
      return false;
  }
};

/**
 * Validate if account has sufficient balance for transfer
 */
export const hasInsufficientBalance = (
  account: SourceAccount,
  requiredAmount: number,
): boolean => {
  return account.balance < requiredAmount;
};
```

---

## Mock Data

### File: `src/mocks/mockNetworkTransferData.ts`

```typescript
import {
  RegisteredNetworkAccount,
  SourceAccount,
  NetworkTransferResult,
} from "@/src/types/networkTransfer";
import { Step } from "@/src/types/stepper";

/**
 * Mock registered network accounts (recipients)
 */
export const mockRegisteredAccounts: RegisteredNetworkAccount[] = [
  {
    id: "1",
    name: "MARÍA FERNANDA GONZALEZ",
    productCount: 2,
    products: [
      {
        id: "p1",
        type: "ahorros",
        name: "Cuenta de Ahorros",
        maskedNumber: "****4522",
      },
      {
        id: "p2",
        type: "corriente",
        name: "Cuenta Corriente",
        maskedNumber: "****7890",
      },
    ],
  },
  {
    id: "2",
    name: "CARLOS ALBERTO PÉREZ",
    productCount: 1,
    products: [
      {
        id: "p3",
        type: "ahorros",
        name: "Cuenta de Ahorros",
        maskedNumber: "****3344",
      },
    ],
  },
  {
    id: "3",
    name: "JULIANA ANDREA BARRIOS",
    productCount: 1,
    products: [
      {
        id: "p4",
        type: "ahorros",
        name: "Cuenta de Ahorros",
        maskedNumber: "****9988",
      },
    ],
  },
];

/**
 * Mock source accounts (user's own accounts)
 */
export const mockSourceAccounts: SourceAccount[] = [
  {
    id: "1",
    name: "Cuenta de Ahorros",
    accountType: "Ahorros",
    productNumber: "4428",
    balance: 8730500,
  },
  {
    id: "2",
    name: "Cuenta Corriente",
    accountType: "Corriente",
    productNumber: "7891",
    balance: 5200000,
  },
  {
    id: "3",
    name: "Cuenta Nómina",
    accountType: "Nómina",
    productNumber: "2341",
    balance: 3450000,
  },
];

/**
 * Mock transaction result (success)
 */
export const mockNetworkTransferResult: NetworkTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  recipientName: "MARIA FERNANDA GONZALEZ",
  destinationAccount: "Cuenta de Ahorros (Ahorros ****4522)",
  amountTransferred: 350000,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "450606",
  description: "Transferencia Exitosa",
};

/**
 * Mock transaction result (error)
 */
export const mockNetworkTransferResultError: NetworkTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  recipientName: "MARIA FERNANDA GONZALEZ",
  destinationAccount: "Cuenta de Ahorros (Ahorros ****4522)",
  amountTransferred: 0,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "-",
  description: "Fondos insuficientes",
};

/**
 * Network transfer flow steps
 */
export const NETWORK_TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];

/**
 * Mock SMS verification code (for testing)
 */
export const MOCK_VALID_CODE = "123456";
```

**Export**: Add to `src/mocks/index.ts`

---

## Validation Schemas

### File: `src/schemas/networkTransferSchemas.ts`

```typescript
import * as yup from "yup";

/**
 * Step 2: Network transfer details validation
 */
export const networkTransferDetailsSchema = yup.object({
  sourceAccountId: yup
    .string()
    .required("Por favor selecciona una cuenta origen"),
  amount: yup
    .number()
    .required("Por favor ingresa un valor a transferir")
    .positive("El valor debe ser mayor a 0")
    .max(100000000, "El valor máximo es $100.000.000"),
});

export type NetworkTransferDetailsFormData = yup.InferType<
  typeof networkTransferDetailsSchema
>;

/**
 * Step 3: SMS code verification validation
 */
export const smsVerificationSchema = yup.object({
  code: yup
    .string()
    .required("Por favor ingresa el código")
    .length(6, "El código debe tener 6 dígitos")
    .matches(/^\d+$/, "El código debe contener solo números"),
});

export type SMSVerificationFormData = yup.InferType<
  typeof smsVerificationSchema
>;
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/10a-transferencias/
├── references.md
└── spec.md

src/
├── atoms/
│   └── (uses existing: StepperCircle, StepperConnector, CodeInput, BackButton, Button, Avatar, ChevronIcon)
│
├── molecules/
│   ├── RegisteredAccountItem.tsx        # NEW
│   ├── DestinationProductCard.tsx       # NEW
│   ├── TransferAmountInput.tsx          # NEW
│   ├── InfoNoteBox.tsx                  # NEW
│   └── index.ts                         # UPDATE
│
├── organisms/
│   ├── RegisteredAccountsList.tsx       # NEW
│   ├── NetworkTransferForm.tsx          # NEW
│   ├── NetworkTransferResultCard.tsx    # NEW
│   └── index.ts                         # UPDATE
│
├── types/
│   ├── networkTransfer.ts               # NEW
│   └── index.ts                         # UPDATE
│
├── utils/
│   ├── networkTransferHelpers.ts        # NEW (optional)
│   └── index.ts                         # UPDATE
│
├── mocks/
│   ├── mockNetworkTransferData.ts       # NEW
│   └── index.ts                         # UPDATE
│
└── schemas/
    └── networkTransferSchemas.ts        # NEW (optional)

app/(authenticated)/transferencias/internas/cuentas-mi-red/
├── page.tsx                             # NEW - Step 1: Recipient Selection
├── detalle/
│   └── page.tsx                         # NEW - Step 2: Transfer Details
├── verificacion/
│   └── page.tsx                         # NEW - Step 3: SMS Verification
└── resultado/
    └── page.tsx                         # NEW - Step 4: Result
```

---

## Implementation Order

### Phase 1: Foundation (Types & Mock Data)

1. Create type definitions:
   - `src/types/networkTransfer.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockNetworkTransferData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Molecules

3. Create molecules:
   - `src/molecules/RegisteredAccountItem.tsx`
   - `src/molecules/DestinationProductCard.tsx`
   - `src/molecules/TransferAmountInput.tsx`
   - `src/molecules/InfoNoteBox.tsx`
   - Update `src/molecules/index.ts`

### Phase 3: Organisms

4. Create organisms:
   - `src/organisms/RegisteredAccountsList.tsx`
   - `src/organisms/NetworkTransferForm.tsx`
   - `src/organisms/NetworkTransferResultCard.tsx`
   - Update `src/organisms/index.ts`

### Phase 4: Utilities (Optional)

5. Create utility functions:
   - `src/utils/networkTransferHelpers.ts`
   - Update `src/utils/index.ts`

### Phase 5: Pages

6. Create pages in order:
   - `app/(authenticated)/transferencias/internas/cuentas-mi-red/page.tsx` (Step 1)
   - `app/(authenticated)/transferencias/internas/cuentas-mi-red/detalle/page.tsx` (Step 2)
   - `app/(authenticated)/transferencias/internas/cuentas-mi-red/verificacion/page.tsx` (Step 3)
   - `app/(authenticated)/transferencias/internas/cuentas-mi-red/resultado/page.tsx` (Step 4)

### Phase 6: Integration

7. Update InternasFlowGrid:
   - Enable "A cuentas de mi red" option in the flow selection grid
   - Update navigation to point to the new route

### Phase 7: Testing & Refinement

8. Manual testing:
   - Test complete flow from recipient selection to result
   - Test back navigation at each step
   - Test form validations
   - Test responsive behavior
   - Test accessibility (keyboard navigation)
   - Test with `hideBalances` enabled/disabled

9. Edge case testing:
   - Insufficient balance
   - Invalid SMS code
   - Direct URL access to later steps
   - Page refresh behavior
   - Empty registered accounts list

---

## Testing Strategy

### Manual Testing Checklist

#### Step 1: Recipient Selection (`/transferencias/internas/cuentas-mi-red`)

- [ ] Page renders correctly
- [ ] Stepper shows step 1 as active
- [ ] Registered accounts list displays with avatars
- [ ] Each account shows name and product count
- [ ] Clicking account stores data and navigates to step 2
- [ ] Info note displays correctly
- [ ] "Volver" navigates to internal transfers selection
- [ ] Empty state displays if no accounts

#### Step 2: Transfer Details (`/transferencias/internas/cuentas-mi-red/detalle`)

- [ ] Page renders correctly
- [ ] Stepper shows step 2 active, step 1 completed
- [ ] Title shows recipient name
- [ ] Source account dropdown populates with mock accounts
- [ ] Account balances display correctly (or masked)
- [ ] Destination product card shows selected product
- [ ] Amount field accepts numeric input
- [ ] Amount formats with Colombian separators
- [ ] Captcha placeholder displays
- [ ] Validation error for empty source
- [ ] Validation error for zero/empty amount
- [ ] Validation error for insufficient balance
- [ ] "Volver" navigates to step 1
- [ ] "Confirmar" stores data and navigates to step 3
- [ ] Redirects to step 1 if no session data

#### Step 3: SMS Verification (`/transferencias/internas/cuentas-mi-red/verificacion`)

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

#### Step 4: Result (`/transferencias/internas/cuentas-mi-red/resultado`)

- [ ] Page renders correctly
- [ ] Stepper shows all 4 steps completed
- [ ] Success checkmark icon displays (teal border)
- [ ] All transaction details display correctly:
  - [ ] Source account
  - [ ] Recipient name
  - [ ] Destination account with masked number
  - [ ] Amount transferred
  - [ ] Transaction cost
  - [ ] Date, time, approval number
  - [ ] Description in green for success
- [ ] "Imprimir/Guardar" button works
- [ ] "Realizar otra transacción" returns to step 1
- [ ] "Finalizar" navigates to home
- [ ] Session storage cleared on exit

### Responsive Testing

- [ ] Desktop (≥1024px): Layout correct
- [ ] Tablet (640-1023px): Layout adapts
- [ ] Mobile (<640px): Stacked layout works
- [ ] Stepper readable on all breakpoints
- [ ] Account list scrollable on mobile
- [ ] Code inputs sized for touch on mobile

### Accessibility Testing

- [ ] Tab navigation through all interactive elements
- [ ] Focus states visible
- [ ] Screen reader announces steps
- [ ] Account items are keyboard accessible
- [ ] Form fields have proper labels
- [ ] Error messages announced
- [ ] Buttons have descriptive text

---

## Dependencies

### Existing Components (from 09a-pagos/10-transferencias)

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
- `Avatar` (atom)
- `ChevronIcon` (atom)
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
- `generateInitials`

---

## Security Considerations

- SMS code verification is mock for now
- In production, implement proper 2FA
- Add rate limiting for code attempts
- Add timeout for code expiration (e.g., 5 minutes)
- Validate transfer limits on backend
- Encrypt sensitive data
- Validate recipient belongs to user's network
- Captcha integration required for production

---

## Future Enhancements

1. **Product Selection**: Allow user to select from multiple products when recipient has more than one

2. **Recipient Search**: Add search/filter functionality for long contact lists

3. **Recent Transfers**: Show recently transferred recipients at the top

4. **Favorites**: Star frequently used recipients

5. **New Recipient Registration**: Deep link to register new network contacts

6. **Transfer Limits**: Display and enforce daily/monthly transfer limits

7. **Scheduled Transfers**: Option to schedule future transfers

8. **NetworkTransferFlowContext**: Better state management with React Context

9. **API Integration**: Replace mock data with actual API calls

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [10-transferencias spec](../10-transferencias/spec.md) - Reference for Entre mis cuentas flow
- [09a-pagos spec](../09a-pagos/spec.md) - Reference for Stepper and OTP components
- [Design System](/.claude/design-system.md) - Color palette, typography
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - A Cuentas de mi Red](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-563)
**Dependencies**: Feature 09a-pagos (Stepper, CodeInputCard components), Feature 10 (existing transfer types)
**Status**: Ready for Implementation
