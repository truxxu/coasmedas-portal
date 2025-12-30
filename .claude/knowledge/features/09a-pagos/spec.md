# Feature 09a - Pagos: Pago Unificado Flow - Technical Specification

**Feature**: Unified Payment Flow (Pago Unificado)
**Version**: 1.0
**Status**: Implementation Ready
**Last Updated**: 2025-12-30

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

The **Pago Unificado** feature allows users to pay all pending minimum payments across multiple products (Aportes, Obligaciones, Protección) in a single consolidated transaction.

### Key Characteristics
- **Multi-step flow**: 4 sequential steps with progress tracking
- **Security**: SMS verification for transaction authorization
- **Reusability**: Stepper component reusable across other flows
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliant

### User Journey
1. View payment summary and select payment source account
2. Review and confirm payment details
3. Enter 6-digit SMS security code
4. View transaction result with option to print/save

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   ├── StepperCircle.tsx       # Individual step indicator
│   ├── StepperConnector.tsx    # Connector line between steps
│   └── CodeInput.tsx           # Single digit input field
│
├── molecules/
│   ├── Stepper.tsx             # Multi-step progress indicator
│   ├── PaymentSummaryRow.tsx   # Payment breakdown row
│   ├── CodeInputGroup.tsx      # 6-digit code input group
│   └── TransactionDetailRow.tsx # Transaction detail key-value row
│
├── organisms/
│   ├── PaymentDetailsCard.tsx       # Step 1 main card
│   ├── PaymentConfirmationCard.tsx  # Step 2 main card
│   ├── CodeInputCard.tsx            # Step 3 main card
│   └── TransactionResultCard.tsx    # Step 4 main card
│
├── types/
│   ├── payment.ts              # Payment-related type definitions
│   └── stepper.ts              # Stepper type definitions
│
├── utils/
│   └── paymentHelpers.ts       # Payment utility functions
│
├── mocks/
│   └── mockPaymentData.ts      # Mock data for payment flow
│
└── contexts/
    └── PaymentFlowContext.tsx  # Payment flow state management

app/(authenticated)/pagos/pago-unificado/
├── page.tsx                    # Step 1: Details
├── confirmacion/
│   └── page.tsx                # Step 2: Confirmation
├── verificacion/
│   └── page.tsx                # Step 3: Code Input
└── resultado/
    └── page.tsx                # Step 4: Result
```

### Technology Stack
- **React 19**: Component framework
- **Next.js 16 App Router**: Routing and page structure
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **react-hook-form**: Form state management (Step 1, Step 3)
- **yup**: Validation schemas

---

## Type Definitions

### File: `src/types/payment.ts`

```typescript
/**
 * Account available for payment source
 */
export interface PaymentAccount {
  id: string;
  name: string;
  balance: number;
  number: string; // Masked account number
}

/**
 * Pending payments by product type
 */
export interface PendingPayments {
  aportes: number;
  obligaciones: number;
  proteccion: number;
  total: number;
}

/**
 * Step 1: Payment details form data
 */
export interface PaymentDetailsFormData {
  selectedAccountId: string;
}

/**
 * Step 2: Confirmation data
 */
export interface PaymentConfirmationData {
  titular: string;
  documento: string; // Masked document number
  aportes: number;
  obligaciones: number;
  proteccion: number;
  debitAccount: string;
  debitAccountNumber: string;
  totalAmount: number;
}

/**
 * Step 3: Code verification form data
 */
export interface CodeVerificationFormData {
  code: string; // 6 digits
}

/**
 * Step 4: Transaction result
 */
export interface TransactionResult {
  status: 'success' | 'error';
  transactionCost: number;
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}

/**
 * Complete payment flow state
 */
export interface PaymentFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedAccountId: string | null;
  selectedAccount: PaymentAccount | null;
  pendingPayments: PendingPayments | null;
  confirmationData: PaymentConfirmationData | null;
  verificationCode: string;
  transactionResult: TransactionResult | null;
  isLoading: boolean;
  error: string | null;
}
```

### File: `src/types/stepper.ts`

```typescript
/**
 * Single step in the stepper
 */
export interface Step {
  number: number;
  label: string;
}

/**
 * Step status
 */
export type StepStatus = 'pending' | 'active' | 'completed';

/**
 * Stepper props
 */
export interface StepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

/**
 * StepperCircle props
 */
export interface StepperCircleProps {
  stepNumber: number;
  label: string;
  status: StepStatus;
}

/**
 * StepperConnector props
 */
export interface StepperConnectorProps {
  isActive: boolean;
}
```

---

## Component Specifications

### Atoms

#### `StepperCircle.tsx`

**Location**: `src/atoms/StepperCircle.tsx`

**Props Interface**:
```typescript
interface StepperCircleProps {
  stepNumber: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}
```

**Implementation**:
```typescript
import React from 'react';

interface StepperCircleProps {
  stepNumber: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export const StepperCircle: React.FC<StepperCircleProps> = ({
  stepNumber,
  label,
  status,
}) => {
  const circleClasses = {
    pending: 'border-2 border-[#E4E6EA] bg-white',
    active: 'border-2 border-[#007FFF] bg-[#007FFF]',
    completed: 'border-2 border-[#007FFF] bg-[#007FFF]',
  };

  const numberClasses = {
    pending: 'text-[#808284]',
    active: 'text-white',
    completed: 'text-white',
  };

  const labelClasses = {
    pending: 'text-[#808284]',
    active: 'text-[#007FFF] font-bold',
    completed: 'text-[#007FFF]',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${circleClasses[status]}`}
        role="presentation"
      >
        {status === 'completed' ? (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <span className={`text-base ${numberClasses[status]}`}>
            {stepNumber}
          </span>
        )}
      </div>
      <span className={`text-sm ${labelClasses[status]}`}>{label}</span>
    </div>
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

#### `StepperConnector.tsx`

**Location**: `src/atoms/StepperConnector.tsx`

**Props Interface**:
```typescript
interface StepperConnectorProps {
  isActive: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';

interface StepperConnectorProps {
  isActive: boolean;
}

export const StepperConnector: React.FC<StepperConnectorProps> = ({
  isActive,
}) => {
  return (
    <div
      className={`h-0.5 flex-1 ${isActive ? 'bg-[#007FFF]' : 'bg-[#E4E6EA]'}`}
      role="presentation"
    />
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

#### `CodeInput.tsx`

**Location**: `src/atoms/CodeInput.tsx`

**Props Interface**:
```typescript
interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  hasError?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  hasError?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onFocus,
  hasError = false,
  inputRef,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow single digit
    if (newValue.length <= 1 && /^\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="\d*"
      maxLength={1}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      disabled={disabled}
      className={`
        w-12 h-14 text-center text-2xl font-medium rounded-md
        border transition-colors
        ${
          hasError
            ? 'border-[#FF0D00] focus:border-[#FF0D00] focus:ring-2 focus:ring-[#FF0D00]'
            : 'border-[#B1B1B1] focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF]'
        }
        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        focus:outline-none
      `}
      aria-label="Dígito del código de verificación"
    />
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

### Molecules

#### `Stepper.tsx`

**Location**: `src/molecules/Stepper.tsx`

**Props Interface**:
```typescript
interface StepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}
```

**Implementation**:
```typescript
import React from 'react';
import { StepperCircle, StepperConnector } from '@/src/atoms';

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  steps,
  className = '',
}) => {
  const getStepStatus = (stepNumber: number): 'pending' | 'active' | 'completed' => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="navigation"
      aria-label="Progreso del pago"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <StepperCircle
            stepNumber={step.number}
            label={step.label}
            status={getStepStatus(step.number)}
          />
          {index < steps.length - 1 && (
            <StepperConnector isActive={step.number < currentStep} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `PaymentSummaryRow.tsx`

**Location**: `src/molecules/PaymentSummaryRow.tsx`

**Props Interface**:
```typescript
interface PaymentSummaryRowProps {
  label: string;
  amount: number;
  variant?: 'default' | 'total';
  hideAmount?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface PaymentSummaryRowProps {
  label: string;
  amount: number;
  variant?: 'default' | 'total';
  hideAmount?: boolean;
}

export const PaymentSummaryRow: React.FC<PaymentSummaryRowProps> = ({
  label,
  amount,
  variant = 'default',
  hideAmount = false,
}) => {
  const isTotal = variant === 'total';

  return (
    <div
      className={`flex justify-between items-center ${
        isTotal ? 'pt-4 mt-4 border-t border-[#E4E6EA]' : 'py-2'
      }`}
    >
      <span className={`text-base ${isTotal ? 'font-bold' : 'font-normal'} text-[#111827]`}>
        {label}
      </span>
      <span className={`text-base ${isTotal ? 'font-bold' : 'font-normal'} text-[#111827]`}>
        {hideAmount ? maskCurrency() : formatCurrency(amount)}
      </span>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `CodeInputGroup.tsx`

**Location**: `src/molecules/CodeInputGroup.tsx`

**Props Interface**:
```typescript
interface CodeInputGroupProps {
  value: string;
  onChange: (code: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}
```

**Implementation**:
```typescript
import React, { useRef, useEffect } from 'react';
import { CodeInput } from '@/src/atoms';

interface CodeInputGroupProps {
  value: string;
  onChange: (code: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export const CodeInputGroup: React.FC<CodeInputGroupProps> = ({
  value,
  onChange,
  hasError = false,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, digit: string) => {
    const newDigits = [...digits];
    newDigits[index] = digit;
    const newValue = newDigits.join('').trim();
    onChange(newValue);

    // Auto-focus next input
    if (digit && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select content on focus for easy replacement
    inputRefs.current[index]?.select();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pastedData);

    // Focus appropriate input after paste
    const focusIndex = Math.min(pastedData.length, 5);
    setTimeout(() => {
      inputRefs.current[focusIndex]?.focus();
    }, 0);
  };

  return (
    <div
      className="flex gap-3 justify-center"
      onPaste={handlePaste}
      role="group"
      aria-label="Código de verificación de 6 dígitos"
    >
      {digits.map((digit, index) => (
        <CodeInput
          key={index}
          value={digit}
          onChange={(newDigit) => handleDigitChange(index, newDigit)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          hasError={hasError}
          inputRef={(el) => {
            inputRefs.current[index] = el;
            return undefined;
          }}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `TransactionDetailRow.tsx`

**Location**: `src/molecules/TransactionDetailRow.tsx`

**Props Interface**:
```typescript
interface TransactionDetailRowProps {
  label: string;
  value: string | number;
  valueColor?: 'default' | 'success' | 'error';
}
```

**Implementation**:
```typescript
import React from 'react';

interface TransactionDetailRowProps {
  label: string;
  value: string | number;
  valueColor?: 'default' | 'success' | 'error';
}

export const TransactionDetailRow: React.FC<TransactionDetailRowProps> = ({
  label,
  value,
  valueColor = 'default',
}) => {
  const colorClasses = {
    default: 'text-[#111827]',
    success: 'text-[#82BC00]',
    error: 'text-[#FF0D00]',
  };

  return (
    <div className="flex justify-between items-center py-3 border-b border-[#E4E6EA] last:border-0">
      <span className="text-base text-[#58585B]">{label}</span>
      <span className={`text-base font-medium ${colorClasses[valueColor]}`}>
        {value}
      </span>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### Organisms

#### `PaymentDetailsCard.tsx`

**Location**: `src/organisms/PaymentDetailsCard.tsx`

**Props Interface**:
```typescript
interface PaymentDetailsCardProps {
  accounts: PaymentAccount[];
  pendingPayments: PendingPayments;
  selectedAccountId: string;
  onAccountChange: (accountId: string) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { SelectField, PaymentSummaryRow } from '@/src/molecules';
import { PaymentAccount, PendingPayments } from '@/src/types/payment';
import { formatCurrency } from '@/src/utils';

interface PaymentDetailsCardProps {
  accounts: PaymentAccount[];
  pendingPayments: PendingPayments;
  selectedAccountId: string;
  onAccountChange: (accountId: string) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  accounts,
  pendingPayments,
  selectedAccountId,
  onAccountChange,
  onNeedMoreBalance,
  hideBalances,
}) => {
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: `${account.name} - Saldo: ${formatCurrency(account.balance)}`,
  }));

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1D4E8F] mb-2">
          Resumen de Pago Unificado
        </h2>
        <p className="text-base text-[#58585B]">
          A continuación, se presenta el resumen de todos tus pagos mínimos
          pendientes. Puedes pagar todo desde aquí.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-base font-medium text-[#111827] mb-2">
            ¿De cuál cuenta quieres transferir?
          </label>
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-[#111827] focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-sm text-[#007FFF] hover:underline"
          >
            ¿Necesitas más saldo?
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <PaymentSummaryRow
          label="Total Aportes:"
          amount={pendingPayments.aportes}
          hideAmount={hideBalances}
        />
        <PaymentSummaryRow
          label="Total Obligaciones (pago mínimo):"
          amount={pendingPayments.obligaciones}
          hideAmount={hideBalances}
        />
        <PaymentSummaryRow
          label="Total Protección:"
          amount={pendingPayments.proteccion}
          hideAmount={hideBalances}
        />
        <PaymentSummaryRow
          label="Total a Pagar:"
          amount={pendingPayments.total}
          variant="total"
          hideAmount={hideBalances}
        />
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `PaymentConfirmationCard.tsx`

**Location**: `src/organisms/PaymentConfirmationCard.tsx`

**Props Interface**:
```typescript
interface PaymentConfirmationCardProps {
  confirmationData: PaymentConfirmationData;
  hideBalances: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { TransactionDetailRow } from '@/src/molecules';
import { PaymentConfirmationData } from '@/src/types/payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface PaymentConfirmationCardProps {
  confirmationData: PaymentConfirmationData;
  hideBalances: boolean;
}

export const PaymentConfirmationCard: React.FC<PaymentConfirmationCardProps> = ({
  confirmationData,
  hideBalances,
}) => {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1D4E8F] mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-base text-[#58585B]">
          Por favor, verificar que los datos de la transformación sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between py-2">
          <span className="text-base text-[#58585B]">Titular:</span>
          <span className="text-base font-medium text-[#111827]">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-base text-[#58585B]">Documento:</span>
          <span className="text-base font-medium text-[#111827]">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1D4E8F] mb-4">
          Resumen del pago:
        </h3>
        <div className="space-y-0">
          <TransactionDetailRow
            label="Aportes:"
            value={
              hideBalances
                ? maskCurrency()
                : formatCurrency(confirmationData.aportes)
            }
          />
          <TransactionDetailRow
            label="Obligaciones:"
            value={
              hideBalances
                ? maskCurrency()
                : formatCurrency(confirmationData.obligaciones)
            }
          />
          <TransactionDetailRow
            label="Protección:"
            value={
              hideBalances
                ? maskCurrency()
                : formatCurrency(confirmationData.proteccion)
            }
          />
          <TransactionDetailRow
            label="Producto a Debitar:"
            value={confirmationData.debitAccount}
          />
          <TransactionDetailRow
            label="Valor Total a Pagar:"
            value={
              hideBalances
                ? maskCurrency()
                : formatCurrency(confirmationData.totalAmount)
            }
          />
        </div>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `CodeInputCard.tsx`

**Location**: `src/organisms/CodeInputCard.tsx`

**Props Interface**:
```typescript
interface CodeInputCardProps {
  code: string;
  onCodeChange: (code: string) => void;
  onResendCode: () => void;
  hasError: boolean;
  errorMessage?: string;
  isResendDisabled: boolean;
  isLoading: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { CodeInputGroup } from '@/src/molecules';
import { ErrorMessage } from '@/src/atoms';

interface CodeInputCardProps {
  code: string;
  onCodeChange: (code: string) => void;
  onResendCode: () => void;
  hasError: boolean;
  errorMessage?: string;
  isResendDisabled: boolean;
  isLoading: boolean;
}

export const CodeInputCard: React.FC<CodeInputCardProps> = ({
  code,
  onCodeChange,
  onResendCode,
  hasError,
  errorMessage,
  isResendDisabled,
  isLoading,
}) => {
  return (
    <Card className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1D4E8F] mb-2">
          Código Enviado a tu Teléfono
        </h2>
        <p className="text-base text-[#58585B]">
          Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar
          la transacción
        </p>
      </div>

      <div className="space-y-4">
        <CodeInputGroup
          value={code}
          onChange={onCodeChange}
          hasError={hasError}
          disabled={isLoading}
        />

        {hasError && errorMessage && (
          <div className="text-center">
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={onResendCode}
            disabled={isResendDisabled || isLoading}
            className={`text-sm ${
              isResendDisabled || isLoading
                ? 'text-[#808284] cursor-not-allowed'
                : 'text-[#007FFF] hover:underline'
            }`}
          >
            ¿No recibiste la clave?{' '}
            <span className="font-medium">Reenviar</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `TransactionResultCard.tsx`

**Location**: `src/organisms/TransactionResultCard.tsx`

**Props Interface**:
```typescript
interface TransactionResultCardProps {
  result: TransactionResult;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { TransactionDetailRow } from '@/src/molecules';
import { TransactionResult } from '@/src/types/payment';

interface TransactionResultCardProps {
  result: TransactionResult;
}

export const TransactionResultCard: React.FC<TransactionResultCardProps> = ({
  result,
}) => {
  const isSuccess = result.status === 'success';

  return (
    <Card className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        {isSuccess ? (
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#82BC00] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
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
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FF0D00] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
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
          </div>
        )}

        <h2 className="text-2xl font-bold text-[#1D4E8F]">
          {isSuccess ? 'Transacción Exitosa' : 'Transacción Fallida'}
        </h2>
      </div>

      <div className="space-y-0">
        <TransactionDetailRow
          label="Costo Transacción:"
          value={`$ ${result.transactionCost}`}
        />
        <TransactionDetailRow
          label="Fecha de Transacción:"
          value={result.transactionDate}
        />
        <TransactionDetailRow
          label="Hora de Transacción:"
          value={result.transactionTime}
        />
        <TransactionDetailRow
          label="Número Aprobación:"
          value={result.approvalNumber}
        />
        <TransactionDetailRow
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

### Step 1: Details Page

**File**: `app/(authenticated)/pagos/pago-unificado/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import { Stepper } from '@/src/molecules';
import { PaymentDetailsCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockPaymentAccounts,
  mockPendingPayments,
  PAYMENT_STEPS
} from '@/src/mocks/mockPaymentData';

export default function PagoUnificadoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago Unificado', href: '/pagos/pago-unificado' },
  ];

  const handleContinue = () => {
    // Validation
    if (!selectedAccountId) {
      setError('Por favor selecciona una cuenta');
      return;
    }

    const selectedAccount = mockPaymentAccounts.find(
      (acc) => acc.id === selectedAccountId
    );

    if (selectedAccount && selectedAccount.balance < mockPendingPayments.total) {
      setError('Saldo insuficiente en la cuenta seleccionada');
      return;
    }

    // Store data in sessionStorage for next step
    sessionStorage.setItem('paymentAccountId', selectedAccountId);

    // Navigate to confirmation
    router.push('/pagos/pago-unificado/confirmacion');
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
        <Stepper currentStep={1} steps={PAYMENT_STEPS} />
      </div>

      <PaymentDetailsCard
        accounts={mockPaymentAccounts}
        pendingPayments={mockPendingPayments}
        selectedAccountId={selectedAccountId}
        onAccountChange={setSelectedAccountId}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
      />

      {error && (
        <div className="text-sm text-[#FF0D00] text-center">{error}</div>
      )}

      <div className="flex justify-between">
        <Button variant="text" onClick={handleBack}>
          Volver
        </Button>
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

**File**: `app/(authenticated)/pagos/pago-unificado/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import { Stepper } from '@/src/molecules';
import { PaymentConfirmationCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useUIContext } from '@/src/contexts/UIContext';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockPaymentAccounts,
  mockPendingPayments,
  mockUserData,
  PAYMENT_STEPS,
} from '@/src/mocks/mockPaymentData';
import { PaymentConfirmationData } from '@/src/types/payment';

export default function ConfirmacionPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<PaymentConfirmationData | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago Unificado', href: '/pagos/pago-unificado' },
  ];

  useEffect(() => {
    // Get data from previous step
    const accountId = sessionStorage.getItem('paymentAccountId');

    if (!accountId) {
      // Redirect back to step 1 if no data
      router.push('/pagos/pago-unificado');
      return;
    }

    const account = mockPaymentAccounts.find((acc) => acc.id === accountId);

    if (!account) {
      router.push('/pagos/pago-unificado');
      return;
    }

    setConfirmationData({
      titular: mockUserData.name,
      documento: mockUserData.document,
      aportes: mockPendingPayments.aportes,
      obligaciones: mockPendingPayments.obligaciones,
      proteccion: mockPendingPayments.proteccion,
      debitAccount: account.name,
      debitAccountNumber: account.number,
      totalAmount: mockPendingPayments.total,
    });
  }, [router]);

  const handleConfirm = () => {
    // Store confirmation data
    if (confirmationData) {
      sessionStorage.setItem(
        'paymentConfirmation',
        JSON.stringify(confirmationData)
      );
    }

    // TODO: API call to initiate payment and send SMS
    // For now, just navigate to code input
    router.push('/pagos/pago-unificado/verificacion');
  };

  const handleBack = () => {
    router.push('/pagos/pago-unificado');
  };

  if (!confirmationData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Stepper currentStep={2} steps={PAYMENT_STEPS} />
      </div>

      <PaymentConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between">
        <Button variant="text" onClick={handleBack}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
```

---

### Step 3: Code Input Page

**File**: `app/(authenticated)/pagos/pago-unificado/verificacion/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import { Stepper } from '@/src/molecules';
import { CodeInputCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { PAYMENT_STEPS } from '@/src/mocks/mockPaymentData';

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
    { label: 'Pago Unificado', href: '/pagos/pago-unificado' },
  ];

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem('paymentConfirmation');
    if (!confirmationData) {
      router.push('/pagos/pago-unificado');
    }
  }, [router]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError(''); // Clear error on change
  };

  const handleResendCode = () => {
    // TODO: API call to resend SMS
    console.log('Resending code...');
    setIsResendDisabled(true);

    // Enable resend after 60 seconds
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
      // TODO: API call to verify code and execute payment
      // For mock, accept code "123456"
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === '123456') {
        // Success - navigate to result
        router.push('/pagos/pago-unificado/resultado');
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
    router.push('/pagos/pago-unificado/confirmacion');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Stepper currentStep={3} steps={PAYMENT_STEPS} />
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

      <div className="flex justify-between">
        <Button variant="text" onClick={handleBack} disabled={isLoading}>
          Volver
        </Button>
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

**File**: `app/(authenticated)/pagos/pago-unificado/resultado/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/src/molecules';
import { Stepper } from '@/src/molecules';
import { TransactionResultCard } from '@/src/organisms';
import { Button } from '@/src/atoms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { PAYMENT_STEPS, mockTransactionResult } from '@/src/mocks/mockPaymentData';
import { TransactionResult } from '@/src/types/payment';

export default function ResultadoPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const [result, setResult] = useState<TransactionResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago Unificado', href: '/pagos/pago-unificado' },
  ];

  useEffect(() => {
    // TODO: Get result from API or sessionStorage
    // For now, use mock data
    setResult(mockTransactionResult);

    // Clean up session storage
    return () => {
      sessionStorage.removeItem('paymentAccountId');
      sessionStorage.removeItem('paymentConfirmation');
    };
  }, []);

  const handlePrintSave = () => {
    // TODO: Generate PDF with transaction details
    console.log('Print/Save transaction');
    window.print();
  };

  const handleFinish = () => {
    // Clean session storage
    sessionStorage.removeItem('paymentAccountId');
    sessionStorage.removeItem('paymentConfirmation');

    // Navigate to payments menu or home
    router.push('/pagos');
  };

  if (!result) {
    return <div>Cargando resultado...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Stepper currentStep={4} steps={PAYMENT_STEPS} />
      </div>

      <TransactionResultCard result={result} />

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

### Option 1: SessionStorage (Recommended for MVP)

Use browser sessionStorage to persist data between steps. This is simple and works well for this linear flow.

**Pros**:
- Simple implementation
- No additional dependencies
- Data persists on page refresh
- Automatically cleared on browser close

**Cons**:
- Not suitable for complex state management
- Data not shareable across tabs

### Option 2: React Context (Future Enhancement)

Create a PaymentFlowContext for more complex state management.

**File**: `src/contexts/PaymentFlowContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentFlowState, PaymentAccount, PendingPayments } from '@/src/types/payment';

interface PaymentFlowContextType extends PaymentFlowState {
  setSelectedAccount: (account: PaymentAccount) => void;
  setPendingPayments: (payments: PendingPayments) => void;
  setVerificationCode: (code: string) => void;
  resetFlow: () => void;
}

const PaymentFlowContext = createContext<PaymentFlowContextType | undefined>(
  undefined
);

const initialState: PaymentFlowState = {
  currentStep: 1,
  selectedAccountId: null,
  selectedAccount: null,
  pendingPayments: null,
  confirmationData: null,
  verificationCode: '',
  transactionResult: null,
  isLoading: false,
  error: null,
};

export const PaymentFlowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<PaymentFlowState>(initialState);

  const setSelectedAccount = (account: PaymentAccount) => {
    setState((prev) => ({
      ...prev,
      selectedAccountId: account.id,
      selectedAccount: account,
    }));
  };

  const setPendingPayments = (payments: PendingPayments) => {
    setState((prev) => ({ ...prev, pendingPayments: payments }));
  };

  const setVerificationCode = (code: string) => {
    setState((prev) => ({ ...prev, verificationCode: code }));
  };

  const resetFlow = () => {
    setState(initialState);
  };

  return (
    <PaymentFlowContext.Provider
      value={{
        ...state,
        setSelectedAccount,
        setPendingPayments,
        setVerificationCode,
        resetFlow,
      }}
    >
      {children}
    </PaymentFlowContext.Provider>
  );
};

export const usePaymentFlow = () => {
  const context = useContext(PaymentFlowContext);
  if (!context) {
    throw new Error('usePaymentFlow must be used within PaymentFlowProvider');
  }
  return context;
};
```

---

## Utility Functions

### File: `src/utils/paymentHelpers.ts`

```typescript
import { PaymentAccount } from '@/src/types/payment';

/**
 * Validate if account has sufficient balance for payment
 */
export const hasInsufficientBalance = (
  account: PaymentAccount,
  requiredAmount: number
): boolean => {
  return account.balance < requiredAmount;
};

/**
 * Format verification code (add spaces every 3 digits)
 */
export const formatVerificationCode = (code: string): string => {
  return code.replace(/(.{3})/g, '$1 ').trim();
};

/**
 * Generate mock SMS code (for development)
 */
export const generateMockSMSCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate total from pending payments
 */
export const calculateTotalPayment = (
  aportes: number,
  obligaciones: number,
  proteccion: number
): number => {
  return aportes + obligaciones + proteccion;
};
```

---

## Mock Data

### File: `src/mocks/mockPaymentData.ts`

```typescript
import {
  PaymentAccount,
  PendingPayments,
  TransactionResult
} from '@/src/types/payment';
import { Step } from '@/src/types/stepper';

/**
 * Mock payment accounts
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
  {
    id: '3',
    name: 'Cuenta Nómina',
    balance: 3450000,
    number: '****2341',
  },
];

/**
 * Mock pending payments
 */
export const mockPendingPayments: PendingPayments = {
  aportes: 170058,
  obligaciones: 1100000,
  proteccion: 205000,
  total: 1475058,
};

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
export const mockTransactionResult: TransactionResult = {
  status: 'success',
  transactionCost: 0,
  transactionDate: '19 de diciembre de 2025',
  transactionTime: '11:04 a.m',
  approvalNumber: '102450',
  description: 'Exitosa',
};

/**
 * Mock transaction result (error)
 */
export const mockTransactionResultError: TransactionResult = {
  status: 'error',
  transactionCost: 0,
  transactionDate: '19 de diciembre de 2025',
  transactionTime: '11:04 a.m',
  approvalNumber: '-',
  description: 'Fondos insuficientes',
};

/**
 * Payment flow steps
 */
export const PAYMENT_STEPS: Step[] = [
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

### File: `src/schemas/paymentSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Step 1: Payment details validation
 */
export const paymentDetailsSchema = yup.object({
  selectedAccountId: yup
    .string()
    .required('Por favor selecciona una cuenta'),
});

export type PaymentDetailsFormData = yup.InferType<typeof paymentDetailsSchema>;

/**
 * Step 3: Code verification validation
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
.claude/knowledge/features/09a-pagos/
├── references.md
└── spec.md

src/
├── atoms/
│   ├── StepperCircle.tsx          # NEW
│   ├── StepperConnector.tsx       # NEW
│   ├── CodeInput.tsx              # NEW
│   └── index.ts                   # UPDATE
│
├── molecules/
│   ├── Stepper.tsx                # NEW
│   ├── PaymentSummaryRow.tsx      # NEW
│   ├── CodeInputGroup.tsx         # NEW
│   ├── TransactionDetailRow.tsx   # NEW
│   └── index.ts                   # UPDATE
│
├── organisms/
│   ├── PaymentDetailsCard.tsx          # NEW
│   ├── PaymentConfirmationCard.tsx     # NEW
│   ├── CodeInputCard.tsx               # NEW
│   ├── TransactionResultCard.tsx       # NEW
│   └── index.ts                        # UPDATE
│
├── types/
│   ├── payment.ts                 # NEW
│   ├── stepper.ts                 # NEW
│   └── index.ts                   # UPDATE
│
├── utils/
│   ├── paymentHelpers.ts          # NEW
│   └── index.ts                   # UPDATE
│
├── mocks/
│   ├── mockPaymentData.ts         # NEW
│   └── index.ts                   # UPDATE
│
├── schemas/
│   └── paymentSchemas.ts          # NEW (optional)
│
└── contexts/
    └── PaymentFlowContext.tsx     # NEW (optional, for future)

app/(authenticated)/pagos/pago-unificado/
├── page.tsx                       # NEW - Step 1
├── confirmacion/
│   └── page.tsx                   # NEW - Step 2
├── verificacion/
│   └── page.tsx                   # NEW - Step 3
└── resultado/
    └── page.tsx                   # NEW - Step 4
```

---

## Implementation Order

### Phase 1: Foundation (Atoms & Types)
1. Create type definitions:
   - `src/types/payment.ts`
   - `src/types/stepper.ts`
   - Update `src/types/index.ts`

2. Create atoms:
   - `src/atoms/StepperCircle.tsx`
   - `src/atoms/StepperConnector.tsx`
   - `src/atoms/CodeInput.tsx`
   - Update `src/atoms/index.ts`

3. Create mock data:
   - `src/mocks/mockPaymentData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Molecules
4. Create molecules:
   - `src/molecules/Stepper.tsx` (uses StepperCircle, StepperConnector)
   - `src/molecules/PaymentSummaryRow.tsx`
   - `src/molecules/CodeInputGroup.tsx` (uses CodeInput)
   - `src/molecules/TransactionDetailRow.tsx`
   - Update `src/molecules/index.ts`

### Phase 3: Organisms
5. Create organisms:
   - `src/organisms/PaymentDetailsCard.tsx` (uses PaymentSummaryRow)
   - `src/organisms/PaymentConfirmationCard.tsx` (uses TransactionDetailRow)
   - `src/organisms/CodeInputCard.tsx` (uses CodeInputGroup)
   - `src/organisms/TransactionResultCard.tsx` (uses TransactionDetailRow)
   - Update `src/organisms/index.ts`

### Phase 4: Utilities
6. Create utility functions:
   - `src/utils/paymentHelpers.ts`
   - Update `src/utils/index.ts`

### Phase 5: Pages
7. Create pages in order:
   - `app/(authenticated)/pagos/pago-unificado/page.tsx` (Step 1)
   - `app/(authenticated)/pagos/pago-unificado/confirmacion/page.tsx` (Step 2)
   - `app/(authenticated)/pagos/pago-unificado/verificacion/page.tsx` (Step 3)
   - `app/(authenticated)/pagos/pago-unificado/resultado/page.tsx` (Step 4)

### Phase 6: Testing & Refinement
8. Manual testing:
   - Test complete flow from Step 1 to Step 4
   - Test back navigation
   - Test form validations
   - Test responsive behavior
   - Test accessibility (keyboard navigation)
   - Test with `hideBalances` enabled/disabled

9. Edge case testing:
   - Insufficient balance
   - Invalid code
   - Direct URL access to later steps
   - Page refresh behavior

### Phase 7: Future Enhancements (Post-MVP)
10. Optional improvements:
    - Add PaymentFlowContext for better state management
    - Add validation schemas with yup
    - Add loading states and animations
    - Add print/save PDF functionality
    - Add API integration
    - Add error boundary
    - Add unit tests

---

## Testing Strategy

### Manual Testing Checklist

#### Step 1: Details
- [ ] Page renders correctly
- [ ] Stepper shows step 1 as active
- [ ] Account dropdown populates with mock accounts
- [ ] Account balance displays correctly
- [ ] hideBalances toggle works
- [ ] "¿Necesitas más saldo?" link is clickable
- [ ] Payment breakdown shows correct amounts
- [ ] Validation shows error if no account selected
- [ ] Validation shows error if insufficient balance
- [ ] "Volver" button navigates to /pagos
- [ ] "Continuar" button navigates to step 2 with valid data

#### Step 2: Confirmation
- [ ] Page renders correctly
- [ ] Stepper shows step 2 as active, step 1 as completed
- [ ] User name and masked document display
- [ ] Payment summary shows correct amounts
- [ ] Selected account name displays
- [ ] hideBalances toggle works
- [ ] "Volver" button navigates back to step 1
- [ ] "Confirmar Pago" button navigates to step 3
- [ ] Redirects to step 1 if no data in sessionStorage

#### Step 3: Verification
- [ ] Page renders correctly
- [ ] Stepper shows step 3 as active, steps 1-2 completed
- [ ] 6 code input fields render
- [ ] First input auto-focuses on load
- [ ] Typing digit auto-advances to next input
- [ ] Backspace on empty input focuses previous
- [ ] Arrow keys navigate between inputs
- [ ] Paste distributes digits across inputs
- [ ] "Reenviar" link is clickable
- [ ] Error shows for incomplete code
- [ ] Error shows for invalid code
- [ ] "Volver" button navigates back to step 2
- [ ] "Pagar" button processes payment with valid code
- [ ] Loading state shows during processing
- [ ] Redirects to step 1 if no data in sessionStorage

#### Step 4: Result
- [ ] Page renders correctly
- [ ] Stepper shows all steps completed
- [ ] Success icon shows for successful transaction
- [ ] Error icon shows for failed transaction
- [ ] Transaction details display correctly
- [ ] Description shows in correct color (green/red)
- [ ] "Imprimir/Guardar" button is clickable
- [ ] "Finalizar" button navigates to /pagos
- [ ] sessionStorage is cleared on finish
- [ ] Redirects appropriately if accessed directly

### Responsive Testing
- [ ] Desktop (≥1024px): Layout correct
- [ ] Tablet (640-1023px): Layout adapts
- [ ] Mobile (<640px): Stacked layout works
- [ ] Stepper responsive on all breakpoints
- [ ] Code inputs sized appropriately on mobile

### Accessibility Testing
- [ ] Tab navigation works through all interactive elements
- [ ] Focus states visible
- [ ] Screen reader announces steps
- [ ] Error messages announced
- [ ] Form fields have proper labels
- [ ] Buttons have descriptive text

---

## Dependencies

### Existing
- React 19
- Next.js 16
- TypeScript
- Tailwind CSS v4
- Existing atoms (Button, Card, ErrorMessage)
- Existing molecules (Breadcrumbs, SelectField)
- Existing contexts (UIContext)
- Existing hooks (useWelcomeBar)
- Existing utils (formatCurrency, maskCurrency)

### New (None required)
All functionality can be implemented with existing dependencies.

---

## Notes & Considerations

### Security
- SMS code verification is mock for now
- In production, implement proper 2FA
- Add rate limiting for code attempts
- Add timeout for code expiration
- Encrypt sensitive data in sessionStorage

### Performance
- Components are lightweight
- No heavy computations
- SessionStorage is fast
- Consider lazy loading for future API calls

### Accessibility
- All interactive elements are keyboard accessible
- Focus management in code inputs
- ARIA labels for screen readers
- Color contrast meets WCAG AA standards

### Future API Integration
When integrating with backend:
1. Replace mock data with API calls
2. Add loading states during API calls
3. Add error handling for network failures
4. Add retry logic for failed requests
5. Implement actual SMS sending
6. Implement code verification
7. Implement payment execution
8. Add transaction receipt generation

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2017+ features used
- CSS Grid and Flexbox
- sessionStorage supported in all modern browsers

---

**Last Updated**: 2025-12-30
**Status**: Ready for Implementation
**Estimated Effort**: 8-12 hours for full implementation
