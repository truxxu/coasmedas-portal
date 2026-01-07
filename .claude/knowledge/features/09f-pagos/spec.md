# Feature 09f - Pagos: Pago Servicios Publicos Inscritos - Technical Specification

**Feature**: Public Utilities Payment - Registered Services Payment Flow
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

The **Pago Servicios Publicos Inscritos** feature allows users to pay their previously registered utility services. This is a 4-step wizard flow that guides users through selecting a service, confirming payment details, entering SMS verification, and viewing the transaction result.

### Key Characteristics
- **4-step wizard flow**: Details → Confirmation → SMS Code → Response
- **Registered services**: Users pay from their list of previously registered utilities
- **SMS verification**: OTP code required to authorize the transaction
- **Transaction receipt**: Final page shows complete transaction details with print option

### User Journey
1. Select source account, registered service, and enter payment amount
2. Review and confirm payment details
3. Enter 6-digit SMS verification code
4. View transaction result (success/failure) with receipt

### Route Structure
```
/pagos/servicios-publicos/pagar/detalle       → Step 1: Payment Details
/pagos/servicios-publicos/pagar/confirmacion  → Step 2: Confirmation
/pagos/servicios-publicos/pagar/codigo-sms    → Step 3: SMS Code
/pagos/servicios-publicos/pagar/respuesta     → Step 4: Response
```

### Key Differences from Registration Flow (09e)

| Aspect | Registration (09e) | Payment (09f) |
|--------|-------------------|---------------|
| Purpose | Register utility services | Pay registered services |
| Steps | 3 steps (Form → Confirm → Result) | 4 steps (Details → Confirm → SMS → Response) |
| Verification | None | SMS OTP required |
| Form Fields | City, Convenio, Bill, Alias | Account, Service, Amount |
| Result Type | Registration status | Transaction receipt |

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   ├── OtpDigitInput.tsx                     # NEW - Single digit input for OTP
│   └── index.ts                              # UPDATE

├── molecules/
│   ├── OtpInput.tsx                          # NEW - 6-digit OTP input group
│   ├── PaymentDetailRow.tsx                  # NEW - Label-value row for confirmation
│   ├── TransactionSuccessHeader.tsx          # NEW - Success icon with title
│   ├── Stepper.tsx                           # REUSE or UPDATE from previous flows
│   └── index.ts                              # UPDATE

├── organisms/
│   ├── UtilityPaymentDetailsForm.tsx         # NEW - Step 1 form
│   ├── UtilityPaymentConfirmationCard.tsx    # NEW - Step 2 confirmation
│   ├── UtilityPaymentSmsCard.tsx             # NEW - Step 3 SMS code
│   ├── UtilityPaymentResponseCard.tsx        # NEW - Step 4 result
│   └── index.ts                              # UPDATE

├── types/
│   ├── utility-payment.ts                    # NEW - Feature-specific types
│   └── index.ts                              # UPDATE

├── mocks/
│   ├── mockUtilityPaymentData.ts             # NEW - Mock data
│   └── index.ts                              # UPDATE

└── schemas/
    └── utilityPaymentSchemas.ts              # NEW - Validation schemas

app/(authenticated)/pagos/
└── servicios-publicos/
    └── pagar/
        ├── detalle/
        │   └── page.tsx                      # Step 1: Payment Details
        ├── confirmacion/
        │   └── page.tsx                      # Step 2: Confirmation
        ├── codigo-sms/
        │   └── page.tsx                      # Step 3: SMS Code
        └── respuesta/
            └── page.tsx                      # Step 4: Response
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

### File: `src/types/utility-payment.ts`

```typescript
/**
 * Source account for payment
 */
export interface SourceAccount {
  id: string;
  type: 'ahorros' | 'corriente';
  accountNumber: string;
  maskedNumber: string;  // "***4428"
  balance: number;
  displayName: string;   // "Cuenta de Ahorros - Saldo: $ 8.730.500"
}

/**
 * Registered utility service
 */
export interface RegisteredService {
  id: string;
  alias: string;           // "Luz Apartamento"
  provider: string;        // "ENEL"
  serviceType: string;     // "Energía"
  reference: string;       // Invoice/bill number
  displayName: string;     // "Luz Apartamento (ENEL - Energía)"
}

/**
 * Step 1 - Payment details form data
 */
export interface UtilityPaymentDetailsForm {
  sourceAccountId: string;
  sourceAccountDisplay: string;
  serviceId: string;
  serviceDisplay: string;
  serviceType: string;
  amount: number;
}

/**
 * Step 2 - Confirmation data
 */
export interface UtilityPaymentConfirmation {
  holderName: string;
  holderDocument: string;      // Masked: "CC 1.***.***234"
  serviceToPay: string;        // "ENEL - Energía"
  invoiceReference: string;    // "123456789"
  productToDebit: string;      // "Cuenta de Ahorros"
  totalAmount: number;
}

/**
 * Step 3 - SMS verification state
 */
export interface SmsVerificationState {
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
export interface UtilityPaymentResult {
  success: boolean;
  creditLine: string;
  productNumber: string;       // Masked: "***5678"
  amountPaid: number;
  transactionCost: number;
  transmissionDate: string;    // "1 de septiembre de 2025"
  transactionTime: string;     // "10:21 pm"
  approvalNumber: string;      // "950606"
  description: string;         // "Exitosa" or error message
}

/**
 * Complete payment flow state
 */
export interface UtilityPaymentFlowState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4;

  // Step 1 data
  details: UtilityPaymentDetailsForm;

  // Step 2 data (derived from step 1)
  confirmation: UtilityPaymentConfirmation | null;

  // Step 3 data
  smsVerification: SmsVerificationState;

  // Step 4 data
  result: UtilityPaymentResult | null;

  // Options
  sourceAccounts: SourceAccount[];
  registeredServices: RegisteredService[];

  // UI State
  isLoading: boolean;
  error: string | null;
}

/**
 * Stepper step configuration
 */
export interface StepperStep {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}
```

### Update: `src/types/index.ts`

```typescript
export * from './utility-payment';
```

---

## Component Specifications

### New Atoms

#### `OtpDigitInput.tsx`

**Location**: `src/atoms/OtpDigitInput.tsx`

**Props Interface**:
```typescript
interface OtpDigitInputProps {
  value: string;
  index: number;
  onChange: (value: string, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  hasError?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';

interface OtpDigitInputProps {
  value: string;
  index: number;
  onChange: (value: string, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  hasError?: boolean;
}

export const OtpDigitInput: React.FC<OtpDigitInputProps> = ({
  value,
  index,
  onChange,
  onKeyDown,
  onPaste,
  inputRef,
  hasError = false,
}) => {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value, index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      onPaste={onPaste}
      className={`
        w-12 h-14 text-center text-2xl font-bold
        border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-[#007FFF]
        ${hasError ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
      `}
      aria-label={`Dígito ${index + 1} del código`}
    />
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

### New Molecules

#### `OtpInput.tsx`

**Location**: `src/molecules/OtpInput.tsx`

**Props Interface**:
```typescript
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hasError?: boolean;
  errorMessage?: string;
}
```

**Implementation**:
```typescript
'use client';

import React, { useRef, useCallback } from 'react';
import { OtpDigitInput } from '@/src/atoms';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hasError?: boolean;
  errorMessage?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  hasError = false,
  errorMessage,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split('').concat(Array(length - value.length).fill(''));

  const handleChange = useCallback((digitValue: string, index: number) => {
    if (!/^\d*$/.test(digitValue)) return;

    const newDigits = [...digits];
    newDigits[index] = digitValue;
    const newValue = newDigits.join('').slice(0, length);
    onChange(newValue);

    // Auto-focus next input
    if (digitValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits, length, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits, length]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);

    // Focus last filled input or first empty
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  }, [length, onChange]);

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-3">
        {digits.slice(0, length).map((digit, index) => (
          <OtpDigitInput
            key={index}
            value={digit}
            index={index}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            inputRef={(el) => { inputRefs.current[index] = el; }}
            hasError={hasError}
          />
        ))}
      </div>
      {hasError && errorMessage && (
        <p className="text-center text-sm text-[#FF0D00]">{errorMessage}</p>
      )}
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `PaymentDetailRow.tsx`

**Location**: `src/molecules/PaymentDetailRow.tsx`

**Props Interface**:
```typescript
interface PaymentDetailRowProps {
  label: string;
  value: string;
  valueSize?: 'normal' | 'large';
  valueColor?: 'default' | 'success' | 'error';
  showDivider?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Divider } from '@/src/atoms';

interface PaymentDetailRowProps {
  label: string;
  value: string;
  valueSize?: 'normal' | 'large';
  valueColor?: 'default' | 'success' | 'error';
  showDivider?: boolean;
}

const colorClasses = {
  default: 'text-black',
  success: 'text-[#00A44C]',
  error: 'text-[#FF0D00]',
};

export const PaymentDetailRow: React.FC<PaymentDetailRowProps> = ({
  label,
  value,
  valueSize = 'normal',
  valueColor = 'default',
  showDivider = false,
}) => {
  return (
    <>
      <div className="flex justify-between items-center py-3">
        <span className="text-[15px] text-black">{label}</span>
        <span
          className={`
            font-medium ${colorClasses[valueColor]}
            ${valueSize === 'large' ? 'text-lg' : 'text-[15px]'}
          `}
        >
          {value}
        </span>
      </div>
      {showDivider && <Divider />}
    </>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `TransactionSuccessHeader.tsx`

**Location**: `src/molecules/TransactionSuccessHeader.tsx`

**Props Interface**:
```typescript
interface TransactionSuccessHeaderProps {
  success: boolean;
  title?: string;
}
```

**Implementation**:
```typescript
import React from 'react';
import { SuccessIcon, ErrorIcon } from '@/src/atoms';

interface TransactionSuccessHeaderProps {
  success: boolean;
  title?: string;
}

export const TransactionSuccessHeader: React.FC<TransactionSuccessHeaderProps> = ({
  success,
  title,
}) => {
  const defaultTitle = success ? 'Transacción Exitosa' : 'Transacción Fallida';

  return (
    <div className="flex flex-col items-center gap-4">
      {success ? (
        <SuccessIcon size="lg" />
      ) : (
        <ErrorIcon size="lg" />
      )}
      <h2 className="text-[22px] font-bold text-[#1D4E8F]">
        {title || defaultTitle}
      </h2>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `Stepper.tsx`

**Location**: `src/molecules/Stepper.tsx`

**Note**: May already exist from previous payment flows. If so, reuse or update.

**Props Interface**:
```typescript
interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
}
```

**Implementation**:
```typescript
import React from 'react';

interface StepperStep {
  number: number;
  label: string;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-bold text-base
                  ${step.number <= currentStep
                    ? 'bg-[#007FFF] text-white'
                    : 'bg-[#E4E6EA] text-[#808284]'
                  }
                `}
              >
                {step.number}
              </div>
              <span
                className={`
                  mt-2 text-xs text-center
                  ${step.number <= currentStep ? 'text-[#4B5563]' : 'text-[#6B7280]'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  h-1 w-[140px] mx-2
                  ${step.number < currentStep ? 'bg-[#007FFF]' : 'bg-[#E4E6EA]'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

### New Organisms

#### `UtilityPaymentDetailsForm.tsx`

**Location**: `src/organisms/UtilityPaymentDetailsForm.tsx`

**Props Interface**:
```typescript
interface UtilityPaymentDetailsFormProps {
  sourceAccounts: SourceAccount[];
  registeredServices: RegisteredService[];
  formData: UtilityPaymentDetailsForm;
  errors: {
    sourceAccount?: string;
    service?: string;
    amount?: string;
  };
  onSourceAccountChange: (accountId: string) => void;
  onServiceChange: (serviceId: string) => void;
  onAmountChange: (amount: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}
```

**Implementation**:
```typescript
'use client';

import React from 'react';
import { Card, Button } from '@/src/atoms';
import { CaptchaPlaceholder } from '@/src/molecules';
import {
  SourceAccount,
  RegisteredService,
  UtilityPaymentDetailsForm as FormData,
} from '@/src/types/utility-payment';
import { formatCurrency } from '@/src/utils';

interface UtilityPaymentDetailsFormProps {
  sourceAccounts: SourceAccount[];
  registeredServices: RegisteredService[];
  formData: FormData;
  errors: {
    sourceAccount?: string;
    service?: string;
    amount?: string;
  };
  onSourceAccountChange: (accountId: string) => void;
  onServiceChange: (serviceId: string) => void;
  onAmountChange: (amount: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const UtilityPaymentDetailsForm: React.FC<UtilityPaymentDetailsFormProps> = ({
  sourceAccounts,
  registeredServices,
  formData,
  errors,
  onSourceAccountChange,
  onServiceChange,
  onAmountChange,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const selectedService = registeredServices.find(s => s.id === formData.serviceId);

  return (
    <Card className="space-y-6">
      {/* Card Title */}
      <h2 className="text-lg font-bold text-[#004266]">
        Pago de Servicios Públicos
      </h2>

      {/* Form Fields */}
      <div className="space-y-5 max-w-[500px]">
        {/* Cuenta Origen */}
        <div className="space-y-2">
          <label className="block text-[15px] text-black">
            Cuenta Origen
          </label>
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
                {account.displayName}
              </option>
            ))}
          </select>
          {errors.sourceAccount && (
            <p className="text-sm text-[#FF0D00]">{errors.sourceAccount}</p>
          )}
        </div>

        {/* Servicio a Pagar */}
        <div className="space-y-2">
          <label className="block text-[15px] text-black">
            Servicio a Pagar
          </label>
          <select
            value={formData.serviceId}
            onChange={(e) => onServiceChange(e.target.value)}
            className={`
              w-full h-10 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-[#007FFF]
              ${errors.service ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
            `}
          >
            <option value="">Seleccionar servicio</option>
            {registeredServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.displayName}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="text-sm text-[#FF0D00]">{errors.service}</p>
          )}
        </div>

        {/* Tipo Servicio (Read-only) */}
        {selectedService && (
          <div className="space-y-2">
            <label className="block text-[15px] text-black">
              Tipo de Servicio
            </label>
            <input
              type="text"
              value={selectedService.serviceType}
              readOnly
              className="w-full h-10 px-3 rounded-md border border-[#E4E6EA] text-base text-black bg-gray-50"
            />
          </div>
        )}

        {/* Valor a Pagar */}
        <div className="space-y-2">
          <label className="block text-[15px] text-black">
            Valor a Pagar
          </label>
          <input
            type="text"
            value={formData.amount ? formatCurrency(formData.amount) : ''}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              onAmountChange(numericValue);
            }}
            placeholder="$ 0"
            className={`
              w-full h-10 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-[#007FFF]
              placeholder:text-[#808284]
              ${errors.amount ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
            `}
          />
          {errors.amount && (
            <p className="text-sm text-[#FF0D00]">{errors.amount}</p>
          )}
        </div>
      </div>

      {/* Captcha Placeholder */}
      <CaptchaPlaceholder />

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#004266] hover:underline"
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

#### `UtilityPaymentConfirmationCard.tsx`

**Location**: `src/organisms/UtilityPaymentConfirmationCard.tsx`

**Props Interface**:
```typescript
interface UtilityPaymentConfirmationCardProps {
  confirmation: UtilityPaymentConfirmation;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Button } from '@/src/atoms';
import { PaymentDetailRow } from '@/src/molecules';
import { UtilityPaymentConfirmation } from '@/src/types/utility-payment';
import { formatCurrency } from '@/src/utils';

interface UtilityPaymentConfirmationCardProps {
  confirmation: UtilityPaymentConfirmation;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const UtilityPaymentConfirmationCard: React.FC<UtilityPaymentConfirmationCardProps> = ({
  confirmation,
  onConfirm,
  onBack,
  isLoading = false,
}) => {
  return (
    <Card className="space-y-6">
      {/* Card Title */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-[#004266]">
          Confirmación de Pago
        </h2>
        <p className="text-[15px] text-black">
          Por favor, verifica que los datos de la transacción sean correctos antes de continuar.
        </p>
      </div>

      {/* Confirmation Details */}
      <div className="space-y-1">
        <PaymentDetailRow
          label="Nombre del Titular:"
          value={confirmation.holderName}
        />
        <PaymentDetailRow
          label="Documento Titular:"
          value={confirmation.holderDocument}
        />
        <PaymentDetailRow
          label="Servicio a Pagar:"
          value={confirmation.serviceToPay}
          showDivider
        />
        <PaymentDetailRow
          label="Referencia (Factura):"
          value={confirmation.invoiceReference}
        />
        <PaymentDetailRow
          label="Producto a Debitar:"
          value={confirmation.productToDebit}
          showDivider
        />
        <PaymentDetailRow
          label="Valor Total:"
          value={formatCurrency(confirmation.totalAmount)}
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

#### `UtilityPaymentSmsCard.tsx`

**Location**: `src/organisms/UtilityPaymentSmsCard.tsx`

**Props Interface**:
```typescript
interface UtilityPaymentSmsCardProps {
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

interface UtilityPaymentSmsCardProps {
  otpValue: string;
  onOtpChange: (value: string) => void;
  onResend: () => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string;
}

export const UtilityPaymentSmsCard: React.FC<UtilityPaymentSmsCardProps> = ({
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
          Código Enviado a tu Teléfono
        </h2>
        <p className="text-[15px] text-black">
          Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar la transacción
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
        <span className="text-[15px] text-black">¿No recibiste la clave? </span>
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

#### `UtilityPaymentResponseCard.tsx`

**Location**: `src/organisms/UtilityPaymentResponseCard.tsx`

**Props Interface**:
```typescript
interface UtilityPaymentResponseCardProps {
  result: UtilityPaymentResult;
  onPrint: () => void;
  onFinish: () => void;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Button } from '@/src/atoms';
import { TransactionSuccessHeader, PaymentDetailRow } from '@/src/molecules';
import { UtilityPaymentResult } from '@/src/types/utility-payment';
import { formatCurrency } from '@/src/utils';

interface UtilityPaymentResponseCardProps {
  result: UtilityPaymentResult;
  onPrint: () => void;
  onFinish: () => void;
}

export const UtilityPaymentResponseCard: React.FC<UtilityPaymentResponseCardProps> = ({
  result,
  onPrint,
  onFinish,
}) => {
  return (
    <Card className="space-y-6">
      {/* Success/Error Header */}
      <TransactionSuccessHeader success={result.success} />

      {/* Transaction Details */}
      <div className="space-y-1">
        <PaymentDetailRow
          label="Línea crédito:"
          value={result.creditLine}
        />
        <PaymentDetailRow
          label="Número de producto:"
          value={result.productNumber}
        />
        <PaymentDetailRow
          label="Valor pagado:"
          value={formatCurrency(result.amountPaid)}
          valueSize="large"
        />
        <PaymentDetailRow
          label="Costo transacción:"
          value={formatCurrency(result.transactionCost)}
          showDivider
        />
        <PaymentDetailRow
          label="Fecha de Transmisión:"
          value={result.transmissionDate}
        />
        <PaymentDetailRow
          label="Hora de Transacción:"
          value={result.transactionTime}
        />
        <PaymentDetailRow
          label="Número de Aprobación:"
          value={result.approvalNumber}
        />
        <PaymentDetailRow
          label="Descripción:"
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
// constants/stepperSteps.ts
export const UTILITY_PAYMENT_STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalización' },
];
```

---

### Page 1: Payment Details (Detalle)

**File**: `app/(authenticated)/pagos/servicios-publicos/pagar/detalle/page.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper } from '@/src/molecules';
import { UtilityPaymentDetailsForm } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { useUIContext } from '@/src/contexts';
import { HideBalancesToggle } from '@/src/molecules';
import {
  mockSourceAccounts,
  mockRegisteredServices,
} from '@/src/mocks/mockUtilityPaymentData';
import { UtilityPaymentDetailsForm as FormData } from '@/src/types/utility-payment';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalización' },
];

const initialFormData: FormData = {
  sourceAccountId: '',
  sourceAccountDisplay: '',
  serviceId: '',
  serviceDisplay: '',
  serviceType: '',
  amount: 0,
};

export default function PagarServiciosDetallePage() {
  useWelcomeBar(false);
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{
    sourceAccount?: string;
    service?: string;
    amount?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago Servicio Público', href: '/pagos/servicios-publicos/pagar/detalle' },
  ];

  const handleSourceAccountChange = (accountId: string) => {
    const account = mockSourceAccounts.find(a => a.id === accountId);
    setFormData(prev => ({
      ...prev,
      sourceAccountId: accountId,
      sourceAccountDisplay: account?.displayName || '',
    }));
    setErrors(prev => ({ ...prev, sourceAccount: undefined }));
  };

  const handleServiceChange = (serviceId: string) => {
    const service = mockRegisteredServices.find(s => s.id === serviceId);
    setFormData(prev => ({
      ...prev,
      serviceId,
      serviceDisplay: service?.displayName || '',
      serviceType: service?.serviceType || '',
    }));
    setErrors(prev => ({ ...prev, service: undefined }));
  };

  const handleAmountChange = (amount: string) => {
    setFormData(prev => ({
      ...prev,
      amount: parseInt(amount) || 0,
    }));
    setErrors(prev => ({ ...prev, amount: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.sourceAccountId) {
      newErrors.sourceAccount = 'Por favor selecciona una cuenta origen';
    }
    if (!formData.serviceId) {
      newErrors.service = 'Por favor selecciona un servicio a pagar';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Por favor ingresa un valor válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Store form data in sessionStorage
    sessionStorage.setItem('utilityPaymentDetails', JSON.stringify(formData));

    router.push('/pagos/servicios-publicos/pagar/confirmacion');
  };

  const handleBack = () => {
    router.push('/pagos/servicios-publicos');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">
            Pagar Servicio Público
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={1} />

      {/* Form */}
      <UtilityPaymentDetailsForm
        sourceAccounts={mockSourceAccounts}
        registeredServices={mockRegisteredServices}
        formData={formData}
        errors={errors}
        onSourceAccountChange={handleSourceAccountChange}
        onServiceChange={handleServiceChange}
        onAmountChange={handleAmountChange}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
```

---

### Page 2: Confirmation (Confirmación)

**File**: `app/(authenticated)/pagos/servicios-publicos/pagar/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { UtilityPaymentConfirmationCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  UtilityPaymentDetailsForm,
  UtilityPaymentConfirmation,
} from '@/src/types/utility-payment';
import { mockRegisteredServices } from '@/src/mocks/mockUtilityPaymentData';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalización' },
];

export default function PagarServiciosConfirmacionPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const [confirmation, setConfirmation] = useState<UtilityPaymentConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago Servicio Público', href: '/pagos/servicios-publicos/pagar/detalle' },
  ];

  useEffect(() => {
    const detailsStr = sessionStorage.getItem('utilityPaymentDetails');
    if (!detailsStr) {
      router.push('/pagos/servicios-publicos/pagar/detalle');
      return;
    }

    const details: UtilityPaymentDetailsForm = JSON.parse(detailsStr);
    const service = mockRegisteredServices.find(s => s.id === details.serviceId);

    // Build confirmation data
    setConfirmation({
      holderName: 'CAMILO ANDRÉS CRUZ',  // Would come from user context
      holderDocument: 'CC 1.***.***234',
      serviceToPay: service ? `${service.provider} - ${service.serviceType}` : '',
      invoiceReference: service?.reference || '',
      productToDebit: details.sourceAccountDisplay.split(' - ')[0] || 'Cuenta de Ahorros',
      totalAmount: details.amount,
    });
  }, [router]);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Store confirmation and trigger SMS send
      sessionStorage.setItem('utilityPaymentConfirmation', JSON.stringify(confirmation));

      // Simulate SMS send
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/pagos/servicios-publicos/pagar/codigo-sms');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/servicios-publicos/pagar/detalle');
  };

  if (!confirmation) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">
            Pagar Servicio Público
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={2} />

      {/* Confirmation Card */}
      <UtilityPaymentConfirmationCard
        confirmation={confirmation}
        onConfirm={handleConfirm}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
```

---

### Page 3: SMS Code (Código SMS)

**File**: `app/(authenticated)/pagos/servicios-publicos/pagar/codigo-sms/page.tsx`

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { UtilityPaymentSmsCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { mockTransactionResult } from '@/src/mocks/mockUtilityPaymentData';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalización' },
];

export default function PagarServiciosCodigoSmsPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const [otpValue, setOtpValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago Servicio Público', href: '/pagos/servicios-publicos/pagar/detalle' },
  ];

  useEffect(() => {
    // Check if we have confirmation data
    const confirmationStr = sessionStorage.getItem('utilityPaymentConfirmation');
    if (!confirmationStr) {
      router.push('/pagos/servicios-publicos/pagar/detalle');
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
      setError('Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation - accept any 6-digit code for demo
      // In production, this would validate against the actual SMS code

      // Store result
      sessionStorage.setItem('utilityPaymentResult', JSON.stringify(mockTransactionResult));

      router.push('/pagos/servicios-publicos/pagar/respuesta');
    } catch (err) {
      setError('Código inválido. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/servicios-publicos/pagar/confirmacion');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleBack} />
          <h1 className="text-xl font-medium text-black">
            Pagar Servicio Público
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={3} />

      {/* SMS Code Card */}
      <UtilityPaymentSmsCard
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

**File**: `app/(authenticated)/pagos/servicios-publicos/pagar/respuesta/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, Stepper, HideBalancesToggle } from '@/src/molecules';
import { UtilityPaymentResponseCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { UtilityPaymentResult } from '@/src/types/utility-payment';

const STEPS = [
  { number: 1, label: 'Detalle' },
  { number: 2, label: 'Confirmación' },
  { number: 3, label: 'SMS' },
  { number: 4, label: 'Finalización' },
];

export default function PagarServiciosRespuestaPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const [result, setResult] = useState<UtilityPaymentResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pago Servicio Público', href: '/pagos/servicios-publicos/pagar/detalle' },
  ];

  useEffect(() => {
    const resultStr = sessionStorage.getItem('utilityPaymentResult');
    if (!resultStr) {
      router.push('/pagos/servicios-publicos/pagar/detalle');
      return;
    }

    setResult(JSON.parse(resultStr));

    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('utilityPaymentDetails');
      sessionStorage.removeItem('utilityPaymentConfirmation');
      sessionStorage.removeItem('utilityPaymentResult');
    };
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear all session data
    sessionStorage.removeItem('utilityPaymentDetails');
    sessionStorage.removeItem('utilityPaymentConfirmation');
    sessionStorage.removeItem('utilityPaymentResult');

    router.push('/home');
  };

  if (!result) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton onClick={handleFinish} />
          <h1 className="text-xl font-medium text-black">
            Pagar Servicio Público
          </h1>
        </div>
        <HideBalancesToggle />
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={4} />

      {/* Response Card */}
      <UtilityPaymentResponseCard
        result={result}
        onPrint={handlePrint}
        onFinish={handleFinish}
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
| `utilityPaymentDetails` | Form data from step 1 | JSON (UtilityPaymentDetailsForm) |
| `utilityPaymentConfirmation` | Confirmation data from step 2 | JSON (UtilityPaymentConfirmation) |
| `utilityPaymentResult` | Transaction result from step 4 | JSON (UtilityPaymentResult) |

### Navigation Flow

```
/pagos/servicios-publicos (Flow Selection - from 09e)
    ↓ Select "Pagar Servicios"
/pagos/servicios-publicos/pagar/detalle (Step 1)
    ↓ Submit form
/pagos/servicios-publicos/pagar/confirmacion (Step 2)
    ↓ Confirm payment (triggers SMS)
/pagos/servicios-publicos/pagar/codigo-sms (Step 3)
    ↓ Enter OTP and submit
/pagos/servicios-publicos/pagar/respuesta (Step 4)
    ↓ Finish
/home (Return to dashboard)
```

### Back Navigation
- Step 1 → Flow selection page (/pagos/servicios-publicos)
- Step 2 → Step 1 (preserves form data)
- Step 3 → Step 2 (preserves data)
- Step 4 → Home (no back to SMS, transaction completed)

---

## Mock Data

### File: `src/mocks/mockUtilityPaymentData.ts`

```typescript
import {
  SourceAccount,
  RegisteredService,
  UtilityPaymentResult,
} from '@/src/types/utility-payment';

/**
 * Mock source accounts
 */
export const mockSourceAccounts: SourceAccount[] = [
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
 * Mock registered services (from 09e registration)
 */
export const mockRegisteredServices: RegisteredService[] = [
  {
    id: '1',
    alias: 'Luz Apartamento',
    provider: 'ENEL',
    serviceType: 'Energía',
    reference: '123456789',
    displayName: 'Luz Apartamento (ENEL - Energía)',
  },
  {
    id: '2',
    alias: 'Gas Casa',
    provider: 'Vanti',
    serviceType: 'Gas',
    reference: '987654321',
    displayName: 'Gas Casa (Vanti - Gas)',
  },
  {
    id: '3',
    alias: 'Agua Oficina',
    provider: 'EAAB',
    serviceType: 'Agua',
    reference: '456789123',
    displayName: 'Agua Oficina (EAAB - Agua)',
  },
];

/**
 * Mock transaction result (success)
 */
export const mockTransactionResult: UtilityPaymentResult = {
  success: true,
  creditLine: 'Cambio de palabras',
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
export const mockTransactionResultError: UtilityPaymentResult = {
  success: false,
  creditLine: 'Cambio de palabras',
  productNumber: '***5678',
  amountPaid: 0,
  transactionCost: 0,
  transmissionDate: '1 de septiembre de 2025',
  transactionTime: '10:21 pm',
  approvalNumber: '',
  description: 'Fondos insuficientes',
};
```

### Update: `src/mocks/index.ts`

```typescript
export * from './mockUtilityPaymentData';
```

---

## Validation Schemas

### File: `src/schemas/utilityPaymentSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Step 1 - Payment details validation
 */
export const utilityPaymentDetailsSchema = yup.object({
  sourceAccountId: yup
    .string()
    .required('Por favor selecciona una cuenta origen'),
  serviceId: yup
    .string()
    .required('Por favor selecciona un servicio a pagar'),
  amount: yup
    .number()
    .positive('El valor debe ser mayor a cero')
    .required('Por favor ingresa el valor a pagar'),
});

/**
 * Step 3 - SMS code validation
 */
export const otpCodeSchema = yup.object({
  code: yup
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .matches(/^\d{6}$/, 'El código debe contener solo números')
    .required('Por favor ingresa el código'),
});

export type UtilityPaymentDetailsFormData = yup.InferType<typeof utilityPaymentDetailsSchema>;
export type OtpCodeFormData = yup.InferType<typeof otpCodeSchema>;
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/09f-pagos/
├── references.md
└── spec.md

src/
├── atoms/
│   ├── OtpDigitInput.tsx                        # NEW
│   └── index.ts                                  # UPDATE

├── molecules/
│   ├── OtpInput.tsx                              # NEW
│   ├── PaymentDetailRow.tsx                      # NEW
│   ├── TransactionSuccessHeader.tsx              # NEW
│   ├── Stepper.tsx                               # NEW or REUSE
│   └── index.ts                                  # UPDATE

├── organisms/
│   ├── UtilityPaymentDetailsForm.tsx             # NEW
│   ├── UtilityPaymentConfirmationCard.tsx        # NEW
│   ├── UtilityPaymentSmsCard.tsx                 # NEW
│   ├── UtilityPaymentResponseCard.tsx            # NEW
│   └── index.ts                                  # UPDATE

├── types/
│   ├── utility-payment.ts                        # NEW
│   └── index.ts                                  # UPDATE

├── mocks/
│   ├── mockUtilityPaymentData.ts                 # NEW
│   └── index.ts                                  # UPDATE

└── schemas/
    └── utilityPaymentSchemas.ts                  # NEW

app/(authenticated)/pagos/
└── servicios-publicos/
    └── pagar/
        ├── detalle/
        │   └── page.tsx                          # NEW - Step 1
        ├── confirmacion/
        │   └── page.tsx                          # NEW - Step 2
        ├── codigo-sms/
        │   └── page.tsx                          # NEW - Step 3
        └── respuesta/
            └── page.tsx                          # NEW - Step 4
```

---

## Implementation Order

### Phase 1: Types & Mock Data
1. Create type definitions:
   - `src/types/utility-payment.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockUtilityPaymentData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Atoms
3. Create atoms:
   - `src/atoms/OtpDigitInput.tsx`
   - Update `src/atoms/index.ts`

### Phase 3: Molecules
4. Create molecules:
   - `src/molecules/OtpInput.tsx`
   - `src/molecules/PaymentDetailRow.tsx`
   - `src/molecules/TransactionSuccessHeader.tsx`
   - `src/molecules/Stepper.tsx` (if not exists)
   - Update `src/molecules/index.ts`

### Phase 4: Organisms
5. Create organisms:
   - `src/organisms/UtilityPaymentDetailsForm.tsx`
   - `src/organisms/UtilityPaymentConfirmationCard.tsx`
   - `src/organisms/UtilityPaymentSmsCard.tsx`
   - `src/organisms/UtilityPaymentResponseCard.tsx`
   - Update `src/organisms/index.ts`

### Phase 5: Pages
6. Create pages in order:
   - `app/(authenticated)/pagos/servicios-publicos/pagar/detalle/page.tsx`
   - `app/(authenticated)/pagos/servicios-publicos/pagar/confirmacion/page.tsx`
   - `app/(authenticated)/pagos/servicios-publicos/pagar/codigo-sms/page.tsx`
   - `app/(authenticated)/pagos/servicios-publicos/pagar/respuesta/page.tsx`

### Phase 6: Integration
7. Update flow selection page (09e):
   - Update `/pagos/servicios-publicos/page.tsx` to link to payment flow

### Phase 7: Validation Schemas (Optional)
8. Create validation schemas:
   - `src/schemas/utilityPaymentSchemas.ts`

### Phase 8: Testing & Refinement
9. Manual testing of complete flow
10. Edge case testing
11. Responsive testing
12. Accessibility testing

---

## Testing Strategy

### Manual Testing Checklist

#### Page 1: Payment Details (Detalle)
- [ ] Page renders correctly
- [ ] Back button navigates to flow selection
- [ ] Breadcrumbs display correctly
- [ ] Stepper shows step 1 as active (blue)
- [ ] Steps 2, 3, 4 show as inactive (gray)
- [ ] "Ocultar saldos" toggle works
- [ ] Card title "Pago de Servicios Públicos" displays
- [ ] Cuenta Origen dropdown populates with accounts
- [ ] Balance hidden when hideBalances is true
- [ ] Servicio a Pagar dropdown populates with registered services
- [ ] Selecting service shows Tipo Servicio (read-only)
- [ ] Valor a Pagar accepts numeric input
- [ ] Currency formatting applies as user types
- [ ] Captcha placeholder displays
- [ ] Validation: error if account not selected
- [ ] Validation: error if service not selected
- [ ] Validation: error if amount is 0 or empty
- [ ] "Volver" link navigates back
- [ ] "Continuar" button validates and navigates to step 2
- [ ] Form data stored in sessionStorage

#### Page 2: Confirmation (Confirmación)
- [ ] Page renders correctly
- [ ] Back button navigates to step 1
- [ ] Stepper shows steps 1-2 as active
- [ ] Card title "Confirmación de Pago" displays
- [ ] Subtitle displays
- [ ] Nombre del Titular displays
- [ ] Documento Titular displays (masked)
- [ ] Servicio a Pagar displays
- [ ] Referencia (Factura) displays
- [ ] Producto a Debitar displays
- [ ] Valor Total displays (large, formatted)
- [ ] Dividers separate sections
- [ ] "Volver" link navigates back (preserves data)
- [ ] "Confirmar Pago" button shows loading state
- [ ] Successful confirmation navigates to step 3

#### Page 3: SMS Code (Código SMS)
- [ ] Page renders correctly
- [ ] Back button navigates to step 2
- [ ] Stepper shows steps 1-3 as active
- [ ] Card title "Código Enviado a tu Teléfono" displays
- [ ] Instructions text displays
- [ ] 6 digit input boxes render
- [ ] Each box accepts only 1 digit
- [ ] Auto-focus moves to next box on input
- [ ] Backspace moves to previous box
- [ ] Paste works for full 6-digit code
- [ ] "¿No recibiste la clave?" text displays
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
- [ ] "Transacción Exitosa" title displays
- [ ] All transaction details display correctly
- [ ] Línea crédito displays
- [ ] Número de producto displays (masked)
- [ ] Valor pagado displays (large, formatted)
- [ ] Costo transacción displays
- [ ] Fecha de Transmisión displays
- [ ] Hora de Transacción displays
- [ ] Número de Aprobación displays
- [ ] Descripción displays in green for success
- [ ] "Imprimir/Guardar" button triggers print
- [ ] "Finalizar" button navigates to home
- [ ] sessionStorage is cleared on finish

### Error States Testing
- [ ] Empty source account shows error
- [ ] Empty service shows error
- [ ] Zero amount shows error
- [ ] Negative amount shows error
- [ ] Invalid OTP shows error
- [ ] Expired OTP shows error
- [ ] Network error handling
- [ ] Transaction failure displays error result

### Responsive Testing
- [ ] Desktop (>=1024px): Full layout
- [ ] Tablet (640-1023px): Adjusted spacing
- [ ] Mobile (<640px): Stacked layouts
- [ ] OTP inputs fit on mobile
- [ ] Buttons stack on mobile
- [ ] Stepper labels visible on all sizes

### Accessibility Testing
- [ ] Tab navigation works through all elements
- [ ] Focus states visible on all interactive elements
- [ ] Form labels properly associated
- [ ] OTP inputs have aria-labels
- [ ] Error messages announced to screen readers
- [ ] Success/Error icons have aria-labels
- [ ] Color contrast meets WCAG AA
- [ ] Stepper has aria-current for active step

---

## Design System Values Reference

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Card Title | Dark Blue | #004266 |
| SMS Title | Navy Blue | #1D4E8F |
| Primary Button | Blue | #007FFF |
| Link Text | Dark Blue | #004266 |
| Success Text/Icon | Green | #00A44C |
| Error Text/Icon | Red | #FF0D00 |
| Active Stepper | Blue | #007FFF |
| Inactive Stepper | Gray | #E4E6EA |
| Stepper Text (Active) | Dark Gray | #4B5563 |
| Stepper Text (Inactive) | Gray | #6B7280 |
| Dividers | Light Gray | #E4E6EA |
| Card Background | White | #FFFFFF |
| Page Background | Light Blue | #F0F9FF |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Card Title | Ubuntu | 18px | Bold |
| SMS Title | Ubuntu | 17px | Bold |
| Body Text | Ubuntu | 15px | Regular |
| Label | Ubuntu | 15px | Regular |
| Value | Ubuntu | 15px | Medium |
| Amount (Large) | Ubuntu | 18px | Medium |
| Stepper Label | Ubuntu | 12px | Regular |
| Stepper Number | Ubuntu | 16px | Bold |
| Button | Ubuntu | 14-16px | Bold |
| Success Title | Ubuntu | 22px | Bold |

### Spacing
- Card padding: `24px` (p-6)
- Section spacing: `24px` (space-y-6)
- Form field spacing: `20px` (space-y-5)
- Stepper connector width: `140px`

### Border Radius
- Cards: `16px` (rounded-2xl)
- Stepper circles: `9999px` (rounded-full)
- Inputs: `6px` (rounded-md)
- Buttons: `6px` (rounded-md)

---

## Dependencies

### Existing Components (Reuse)
- `BackButton` atom
- `Button` atom
- `Card` atom
- `Divider` atom
- `SuccessIcon` atom (from 09e)
- `ErrorIcon` atom (from 09e)
- `Breadcrumbs` molecule
- `HideBalancesToggle` molecule
- `CaptchaPlaceholder` molecule

### May Exist from Previous Features
- `Stepper` molecule
- `ConfirmationRow` molecule (similar to PaymentDetailRow)

### New for 09f-pagos
- `OtpDigitInput` atom
- `OtpInput` molecule
- `PaymentDetailRow` molecule
- `TransactionSuccessHeader` molecule
- `UtilityPaymentDetailsForm` organism
- `UtilityPaymentConfirmationCard` organism
- `UtilityPaymentSmsCard` organism
- `UtilityPaymentResponseCard` organism

---

## API Integration Points (Future)

- `GET /api/accounts` - Get user's source accounts
- `GET /api/utilities/registered` - Get user's registered services
- `POST /api/utilities/pay/initiate` - Initiate payment (returns confirmation data)
- `POST /api/utilities/pay/send-otp` - Send SMS verification code
- `POST /api/utilities/pay/verify-otp` - Verify OTP code
- `POST /api/utilities/pay/confirm` - Confirm and process payment
- `GET /api/utilities/pay/receipt/{transactionId}` - Get transaction receipt

---

**Last Updated**: 2026-01-07
**Status**: Ready for Implementation
**Estimated Effort**: 6-8 hours
**Dependencies**: Core UI components and 09e-pagos flow selection should be implemented
