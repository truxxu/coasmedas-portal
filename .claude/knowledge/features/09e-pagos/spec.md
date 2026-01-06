# Feature 09e - Pagos: Pagar Servicios Publicos (Inscripcion) - Technical Specification

**Feature**: Public Utilities Payment - Registration Flow (Inscribir Servicios Publicos)
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
7. [Mock Data](#mock-data)
8. [Validation Schemas](#validation-schemas)
9. [File Structure](#file-structure)
10. [Implementation Order](#implementation-order)
11. [Testing Strategy](#testing-strategy)

---

## Feature Overview

The **Pagar Servicios Publicos** feature allows users to register and pay their utility bills. This specification covers the **registration sub-flow** that enables users to register their utility services (electricity, water, gas, etc.) before making payments.

### Key Characteristics
- **Flow Selection**: Initial page to choose between registering or paying utility services
- **Multi-step wizard**: Registration flow with form, confirmation, and result pages
- **City-Convenio relationship**: Utility providers are filtered based on selected city
- **Alias support**: User-friendly names for registered services
- **Simple form**: Minimal required fields for quick registration

### User Journey
1. Select action: "Inscribir Servicios" (Register) or "Pagar Servicios" (Pay)
2. Fill registration form with city, utility provider, bill number, and alias
3. Review and confirm registration data
4. View registration result (success/error)

### Key Differences from Other Payment Flows

| Aspect | Pago Unificado (09a) | Pago a Otros Asociados (09d) | Servicios Publicos (09e) |
|--------|----------------------|------------------------------|--------------------------|
| Purpose | Pay own products | Pay other associate's products | Register/Pay utilities |
| Flow Type | 4-step wizard | Pre-step + 4-step wizard | Selection + 3-step wizard |
| Pre-step | None | Beneficiary selection | Flow selection |
| Form Fields | Account selection | Multi-product checkbox | City, Convenio, Bill, Alias |
| Verification | SMS code | SMS code | None (registration only) |
| Result Type | Transaction | Transaction | Registration status |

---

## Technical Architecture

### Component Architecture

```
src/
├── atoms/
│   ├── SuccessIcon.tsx                    # NEW - Green checkmark icon
│   ├── ErrorIcon.tsx                      # NEW - Red X icon (if not exists)
│   └── index.ts                           # UPDATE

├── molecules/
│   ├── FlowOptionCard.tsx                 # NEW - Selectable flow option card
│   ├── ConfirmationRow.tsx                # REUSE from 09d or NEW
│   └── index.ts                           # UPDATE

├── organisms/
│   ├── FlowSelectionCard.tsx              # NEW - Card with flow options
│   ├── UtilityRegistrationForm.tsx        # NEW - Registration form
│   ├── UtilityConfirmationCard.tsx        # NEW - Confirmation display
│   ├── UtilityRegistrationResultCard.tsx  # NEW - Result display
│   └── index.ts                           # UPDATE

├── types/
│   ├── utility-registration.ts            # NEW - Feature-specific types
│   └── index.ts                           # UPDATE

├── mocks/
│   ├── mockUtilityRegistrationData.ts     # NEW - Mock data
│   └── index.ts                           # UPDATE

└── schemas/
    └── utilityRegistrationSchemas.ts      # NEW - Validation schemas

app/(authenticated)/pagos/
└── servicios-publicos/
    ├── page.tsx                           # Flow Selection page
    └── inscribir/
        ├── page.tsx                       # Registration Form
        ├── confirmacion/
        │   └── page.tsx                   # Confirmation
        └── resultado/
            └── page.tsx                   # Result
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

### File: `src/types/utility-registration.ts`

```typescript
/**
 * City option for dropdown
 */
export interface CityOption {
  id: string;
  name: string;  // "Cali", "Bogota", "Medellin"
}

/**
 * Utility provider (convenio) option for dropdown
 */
export interface ConvenioOption {
  id: string;
  name: string;       // "ENEL - Energia"
  category: string;   // "Energia", "Gas", "Agua", "Telefonia"
  cityId: string;     // Available in which city
}

/**
 * Registration form data
 */
export interface UtilityRegistrationForm {
  cityId: string;
  cityName: string;
  convenioId: string;
  convenioName: string;
  billNumber: string;     // Numero de factura o referencia
  alias: string;          // User-friendly name (e.g., "Luz casa")
}

/**
 * Registration confirmation data
 */
export interface UtilityConfirmationData {
  city: string;
  convenio: string;
  billNumber: string;
  alias: string;
}

/**
 * Registration result status
 */
export type RegistrationStatus = 'Aceptada' | 'Rechazada' | 'Pendiente';

/**
 * Registration result
 */
export interface UtilityRegistrationResult {
  success: boolean;
  status: RegistrationStatus;
  registrationId?: string;
  alias: string;
  convenio: string;
  city: string;
  billNumber: string;
  errorMessage?: string;
}

/**
 * Flow selection type
 */
export type UtilityFlowType = 'inscribir' | 'pagar';

/**
 * Complete registration flow state
 */
export interface UtilityRegistrationFlowState {
  // Step tracking
  currentStep: 'selection' | 'form' | 'confirmation' | 'result';

  // Form data
  formData: UtilityRegistrationForm;

  // Options
  cities: CityOption[];
  convenios: ConvenioOption[];
  filteredConvenios: ConvenioOption[];  // Filtered by selected city

  // Validation
  errors: {
    city?: string;
    convenio?: string;
    billNumber?: string;
    alias?: string;
  };

  // Result
  result: UtilityRegistrationResult | null;

  // UI State
  isLoading: boolean;
  error: string | null;
}
```

### Update: `src/types/index.ts`

```typescript
export * from './utility-registration';
```

---

## Component Specifications

### New Atoms

#### `SuccessIcon.tsx`

**Location**: `src/atoms/SuccessIcon.tsx`

**Props Interface**:
```typescript
interface SuccessIconProps {
  size?: 'sm' | 'md' | 'lg';  // sm=40px, md=60px, lg=80px
  className?: string;
}
```

**Implementation**:
```typescript
import React from 'react';

interface SuccessIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-[60px] h-[60px]',
  lg: 'w-20 h-20',
};

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        ${sizeMap[size]}
        rounded-full border-[3px] border-[#009900]
        flex items-center justify-center
        ${className}
      `}
      aria-label="Exitoso"
      role="img"
    >
      <svg
        className="w-1/2 h-1/2 text-[#009900]"
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
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

#### `ErrorIcon.tsx`

**Location**: `src/atoms/ErrorIcon.tsx`

**Note**: May already exist from previous features. If so, reuse.

**Props Interface**:
```typescript
interface ErrorIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Implementation**:
```typescript
import React from 'react';

interface ErrorIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-[60px] h-[60px]',
  lg: 'w-20 h-20',
};

export const ErrorIcon: React.FC<ErrorIconProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        ${sizeMap[size]}
        rounded-full border-[3px] border-[#FF0D00]
        flex items-center justify-center
        ${className}
      `}
      aria-label="Error"
      role="img"
    >
      <svg
        className="w-1/2 h-1/2 text-[#FF0D00]"
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
  );
};
```

**Export**: Add to `src/atoms/index.ts`

---

### New Molecules

#### `FlowOptionCard.tsx`

**Location**: `src/molecules/FlowOptionCard.tsx`

**Purpose**: Selectable card for flow choice (Inscribir vs Pagar)

**Props Interface**:
```typescript
interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon?: React.ReactNode;
}
```

**Implementation**:
```typescript
import React from 'react';

interface FlowOptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const FlowOptionCard: React.FC<FlowOptionCardProps> = ({
  title,
  description,
  onClick,
  icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full h-[176px] p-6
        bg-white rounded-lg
        border border-dashed border-[#1D4E8F]
        hover:bg-[#F0F9FF] hover:border-solid
        transition-all duration-200
        flex flex-col items-center justify-center gap-3
        cursor-pointer text-center
        focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:ring-offset-2
      "
    >
      {icon && (
        <div className="text-[#1D4E8F]">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-medium text-[#1D4E8F]">
        {title}
      </h3>
      <p className="text-[15px] text-black">
        {description}
      </p>
    </button>
  );
};
```

**Export**: Add to `src/molecules/index.ts`

---

#### `ConfirmationRow.tsx`

**Location**: `src/molecules/ConfirmationRow.tsx`

**Note**: May already exist from 09d-pagos. If so, reuse that component.

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

const colorClasses = {
  default: 'text-black',
  success: 'text-[#009900]',
  error: 'text-[#FF0D00]',
};

export const ConfirmationRow: React.FC<ConfirmationRowProps> = ({
  label,
  value,
  valueColor = 'default',
  className = '',
}) => {
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

**Export**: Add to `src/molecules/index.ts` (if not already present)

---

### New Organisms

#### `FlowSelectionCard.tsx`

**Location**: `src/organisms/FlowSelectionCard.tsx`

**Props Interface**:
```typescript
interface FlowSelectionCardProps {
  onSelectInscribir: () => void;
  onSelectPagar: () => void;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card } from '@/src/atoms';
import { FlowOptionCard } from '@/src/molecules';

interface FlowSelectionCardProps {
  onSelectInscribir: () => void;
  onSelectPagar: () => void;
}

export const FlowSelectionCard: React.FC<FlowSelectionCardProps> = ({
  onSelectInscribir,
  onSelectPagar,
}) => {
  return (
    <Card className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-[21px] font-bold text-[#1D4E8F]">
          Pago de Servicios Publicos
        </h2>
        <p className="text-[15px] text-black">
          Que deseas hacer hoy?
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FlowOptionCard
          title="Inscribir Servicios"
          description="Inscribe tus facturas para pagarlas facilmente."
          onClick={onSelectInscribir}
        />
        <FlowOptionCard
          title="Pagar Servicios"
          description="Realiza el pago de tus facturas inscritas."
          onClick={onSelectPagar}
        />
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `UtilityRegistrationForm.tsx`

**Location**: `src/organisms/UtilityRegistrationForm.tsx`

**Props Interface**:
```typescript
interface UtilityRegistrationFormProps {
  cities: CityOption[];
  convenios: ConvenioOption[];
  formData: UtilityRegistrationForm;
  errors: {
    city?: string;
    convenio?: string;
    billNumber?: string;
    alias?: string;
  };
  onCityChange: (cityId: string, cityName: string) => void;
  onConvenioChange: (convenioId: string, convenioName: string) => void;
  onBillNumberChange: (value: string) => void;
  onAliasChange: (value: string) => void;
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
import { SelectField, FormField } from '@/src/molecules';
import { CityOption, ConvenioOption, UtilityRegistrationForm as FormData } from '@/src/types/utility-registration';

interface UtilityRegistrationFormProps {
  cities: CityOption[];
  convenios: ConvenioOption[];
  formData: FormData;
  errors: {
    city?: string;
    convenio?: string;
    billNumber?: string;
    alias?: string;
  };
  onCityChange: (cityId: string, cityName: string) => void;
  onConvenioChange: (convenioId: string, convenioName: string) => void;
  onBillNumberChange: (value: string) => void;
  onAliasChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const UtilityRegistrationForm: React.FC<UtilityRegistrationFormProps> = ({
  cities,
  convenios,
  formData,
  errors,
  onCityChange,
  onConvenioChange,
  onBillNumberChange,
  onAliasChange,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = cities.find((c) => c.id === e.target.value);
    if (selectedCity) {
      onCityChange(selectedCity.id, selectedCity.name);
    }
  };

  const handleConvenioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedConvenio = convenios.find((c) => c.id === e.target.value);
    if (selectedConvenio) {
      onConvenioChange(selectedConvenio.id, selectedConvenio.name);
    }
  };

  return (
    <Card className="space-y-6">
      {/* Section Header */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Inscripcion de Servicios Publicos
      </h2>

      {/* Form Fields */}
      <div className="space-y-5 max-w-[500px]">
        {/* Ciudad */}
        <div className="space-y-2">
          <label className="block text-[15px] text-black">
            Ciudad
          </label>
          <select
            value={formData.cityId}
            onChange={handleCityChange}
            className={`
              w-full h-10 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-[#007FFF]
              ${errors.city ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
            `}
          >
            <option value="">Seleccionar ciudad</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-sm text-[#FF0D00]">{errors.city}</p>
          )}
        </div>

        {/* Convenio */}
        <div className="space-y-2">
          <label className="block text-[15px] text-black">
            Convenio
          </label>
          <select
            value={formData.convenioId}
            onChange={handleConvenioChange}
            disabled={!formData.cityId}
            className={`
              w-full h-10 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-[#007FFF]
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${errors.convenio ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
            `}
          >
            <option value="">Seleccionar convenio</option>
            {convenios.map((convenio) => (
              <option key={convenio.id} value={convenio.id}>
                {convenio.name}
              </option>
            ))}
          </select>
          {errors.convenio && (
            <p className="text-sm text-[#FF0D00]">{errors.convenio}</p>
          )}
        </div>

        {/* Numero de Factura */}
        <div className="space-y-2">
          <label className="block text-[15px] text-black">
            Numero de Factura o Referencia
          </label>
          <input
            type="text"
            value={formData.billNumber}
            onChange={(e) => onBillNumberChange(e.target.value)}
            placeholder="Ingrese el numero de factura"
            className={`
              w-full h-10 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-[#007FFF]
              placeholder:text-[#808284]
              ${errors.billNumber ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
            `}
          />
          {errors.billNumber && (
            <p className="text-sm text-[#FF0D00]">{errors.billNumber}</p>
          )}
        </div>

        {/* Alias */}
        <div className="space-y-2">
          <label className="block text-[15px] text-black">
            Alias (ej. "Luz Apartamento")
          </label>
          <input
            type="text"
            value={formData.alias}
            onChange={(e) => onAliasChange(e.target.value)}
            placeholder="Nombre para identificar este servicio"
            maxLength={50}
            className={`
              w-full h-10 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-[#007FFF]
              placeholder:text-[#808284]
              ${errors.alias ? 'border-[#FF0D00]' : 'border-[#E4E6EA]'}
            `}
          />
          {errors.alias && (
            <p className="text-sm text-[#FF0D00]">{errors.alias}</p>
          )}
        </div>
      </div>

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
          {isLoading ? 'Procesando...' : 'Inscribir'}
        </Button>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `UtilityConfirmationCard.tsx`

**Location**: `src/organisms/UtilityConfirmationCard.tsx`

**Props Interface**:
```typescript
interface UtilityConfirmationCardProps {
  confirmationData: UtilityConfirmationData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, Button } from '@/src/atoms';
import { ConfirmationRow } from '@/src/molecules';
import { UtilityConfirmationData } from '@/src/types/utility-registration';

interface UtilityConfirmationCardProps {
  confirmationData: UtilityConfirmationData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const UtilityConfirmationCard: React.FC<UtilityConfirmationCardProps> = ({
  confirmationData,
  onConfirm,
  onBack,
  isLoading = false,
}) => {
  return (
    <Card className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-[#1D4E8F]">
          Confirmar Inscripcion
        </h2>
        <p className="text-[15px] text-black">
          Verifica los datos del servicio que vas a inscribir.
        </p>
      </div>

      {/* Confirmation Details */}
      <div className="space-y-2">
        <ConfirmationRow
          label="Ciudad:"
          value={confirmationData.city}
        />
        <ConfirmationRow
          label="Convenio:"
          value={confirmationData.convenio}
        />
        <ConfirmationRow
          label="Numero de Factura:"
          value={confirmationData.billNumber}
        />
        <ConfirmationRow
          label="Alias:"
          value={confirmationData.alias}
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
          {isLoading ? 'Procesando...' : 'Confirmar Inscripcion'}
        </Button>
      </div>
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

#### `UtilityRegistrationResultCard.tsx`

**Location**: `src/organisms/UtilityRegistrationResultCard.tsx`

**Props Interface**:
```typescript
interface UtilityRegistrationResultCardProps {
  result: UtilityRegistrationResult;
}
```

**Implementation**:
```typescript
import React from 'react';
import { Card, SuccessIcon, ErrorIcon } from '@/src/atoms';
import { ConfirmationRow } from '@/src/molecules';
import { UtilityRegistrationResult } from '@/src/types/utility-registration';

interface UtilityRegistrationResultCardProps {
  result: UtilityRegistrationResult;
}

export const UtilityRegistrationResultCard: React.FC<UtilityRegistrationResultCardProps> = ({
  result,
}) => {
  const isSuccess = result.success;

  return (
    <Card className="space-y-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <SuccessIcon size="md" />
        ) : (
          <ErrorIcon size="md" />
        )}
      </div>

      {/* Result Title */}
      <h2 className="text-[23px] font-bold text-[#1D4E8F] text-center">
        {isSuccess ? 'Inscripcion Aceptada' : 'Inscripcion Rechazada'}
      </h2>

      {/* Result Details */}
      <div className="space-y-2">
        <ConfirmationRow
          label="Estado de Inscripcion:"
          value={result.status}
          valueColor={isSuccess ? 'success' : 'error'}
        />
        <ConfirmationRow
          label="Alias:"
          value={result.alias}
        />
        <ConfirmationRow
          label="Convenio:"
          value={result.convenio}
        />
        <ConfirmationRow
          label="Ciudad:"
          value={result.city}
        />
        <ConfirmationRow
          label="Numero de Factura:"
          value={result.billNumber}
        />
      </div>

      {/* Error Message (if failed) */}
      {!isSuccess && result.errorMessage && (
        <div className="p-4 bg-red-50 border border-[#FF0D00] rounded-lg">
          <p className="text-sm text-[#FF0D00]">
            {result.errorMessage}
          </p>
        </div>
      )}
    </Card>
  );
};
```

**Export**: Add to `src/organisms/index.ts`

---

## Page Implementations

### Page 1: Flow Selection

**File**: `app/(authenticated)/pagos/servicios-publicos/page.tsx`

```typescript
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs } from '@/src/molecules';
import { FlowSelectionCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';

export default function ServiciosPublicosPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Pagar servicios publicos', href: '/pagos/servicios-publicos' },
  ];

  const handleSelectInscribir = () => {
    router.push('/pagos/servicios-publicos/inscribir');
  };

  const handleSelectPagar = () => {
    // Future feature: Payment flow
    router.push('/pagos/servicios-publicos/pagar');
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
          Pagar Servicios Publicos
        </h1>
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <FlowSelectionCard
        onSelectInscribir={handleSelectInscribir}
        onSelectPagar={handleSelectPagar}
      />
    </div>
  );
}
```

---

### Page 2: Registration Form

**File**: `app/(authenticated)/pagos/servicios-publicos/inscribir/page.tsx`

```typescript
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs } from '@/src/molecules';
import { UtilityRegistrationForm } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  mockCities,
  mockConvenios,
} from '@/src/mocks/mockUtilityRegistrationData';
import { UtilityRegistrationForm as FormData } from '@/src/types/utility-registration';

const initialFormData: FormData = {
  cityId: '',
  cityName: '',
  convenioId: '',
  convenioName: '',
  billNumber: '',
  alias: '',
};

export default function InscribirServiciosPage() {
  useWelcomeBar(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{
    city?: string;
    convenio?: string;
    billNumber?: string;
    alias?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Inscribir Servicios Publicos', href: '/pagos/servicios-publicos/inscribir' },
  ];

  // Filter convenios based on selected city
  const filteredConvenios = useMemo(() => {
    if (!formData.cityId) return [];
    return mockConvenios.filter((c) => c.cityId === formData.cityId);
  }, [formData.cityId]);

  const handleCityChange = (cityId: string, cityName: string) => {
    setFormData((prev) => ({
      ...prev,
      cityId,
      cityName,
      convenioId: '',  // Reset convenio when city changes
      convenioName: '',
    }));
    setErrors((prev) => ({ ...prev, city: undefined }));
  };

  const handleConvenioChange = (convenioId: string, convenioName: string) => {
    setFormData((prev) => ({
      ...prev,
      convenioId,
      convenioName,
    }));
    setErrors((prev) => ({ ...prev, convenio: undefined }));
  };

  const handleBillNumberChange = (value: string) => {
    setFormData((prev) => ({ ...prev, billNumber: value }));
    setErrors((prev) => ({ ...prev, billNumber: undefined }));
  };

  const handleAliasChange = (value: string) => {
    setFormData((prev) => ({ ...prev, alias: value }));
    setErrors((prev) => ({ ...prev, alias: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.cityId) {
      newErrors.city = 'Por favor selecciona una ciudad';
    }
    if (!formData.convenioId) {
      newErrors.convenio = 'Por favor selecciona un convenio';
    }
    if (!formData.billNumber.trim()) {
      newErrors.billNumber = 'Por favor ingresa el numero de factura';
    }
    if (!formData.alias.trim()) {
      newErrors.alias = 'Por favor ingresa un alias';
    } else if (formData.alias.length > 50) {
      newErrors.alias = 'El alias no puede exceder 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Store form data in sessionStorage
    sessionStorage.setItem('utilityRegistrationData', JSON.stringify(formData));

    router.push('/pagos/servicios-publicos/inscribir/confirmacion');
  };

  const handleBack = () => {
    router.push('/pagos/servicios-publicos');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton onClick={handleBack} />
        <h1 className="text-xl font-medium text-black">
          Pago de Servicios Publicos
        </h1>
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <UtilityRegistrationForm
        cities={mockCities}
        convenios={filteredConvenios}
        formData={formData}
        errors={errors}
        onCityChange={handleCityChange}
        onConvenioChange={handleConvenioChange}
        onBillNumberChange={handleBillNumberChange}
        onAliasChange={handleAliasChange}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
```

---

### Page 3: Confirmation

**File**: `app/(authenticated)/pagos/servicios-publicos/inscribir/confirmacion/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs } from '@/src/molecules';
import { UtilityConfirmationCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import {
  UtilityRegistrationForm,
  UtilityConfirmationData,
} from '@/src/types/utility-registration';

export default function ConfirmacionServiciosPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const [confirmationData, setConfirmationData] = useState<UtilityConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Inscribir Servicios Publicos', href: '/pagos/servicios-publicos/inscribir' },
  ];

  useEffect(() => {
    // Get data from sessionStorage
    const formDataStr = sessionStorage.getItem('utilityRegistrationData');
    if (!formDataStr) {
      router.push('/pagos/servicios-publicos/inscribir');
      return;
    }

    const formData: UtilityRegistrationForm = JSON.parse(formDataStr);
    setConfirmationData({
      city: formData.cityName,
      convenio: formData.convenioName,
      billNumber: formData.billNumber,
      alias: formData.alias,
    });
  }, [router]);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store result in sessionStorage
      const result = {
        success: true,
        status: 'Aceptada',
        registrationId: 'REG-' + Date.now(),
        ...confirmationData,
      };
      sessionStorage.setItem('utilityRegistrationResult', JSON.stringify(result));

      router.push('/pagos/servicios-publicos/inscribir/resultado');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/pagos/servicios-publicos/inscribir');
  };

  if (!confirmationData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton onClick={handleBack} />
        <h1 className="text-xl font-medium text-black">
          Pago de servicios publicos
        </h1>
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <UtilityConfirmationCard
        confirmationData={confirmationData}
        onConfirm={handleConfirm}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
```

---

### Page 4: Result

**File**: `app/(authenticated)/pagos/servicios-publicos/inscribir/resultado/page.tsx`

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton, Button } from '@/src/atoms';
import { Breadcrumbs } from '@/src/molecules';
import { UtilityRegistrationResultCard } from '@/src/organisms';
import { useWelcomeBar } from '@/src/hooks/useWelcomeBar';
import { UtilityRegistrationResult } from '@/src/types/utility-registration';

export default function ResultadoServiciosPage() {
  useWelcomeBar(false);
  const router = useRouter();
  const [result, setResult] = useState<UtilityRegistrationResult | null>(null);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/home' },
    { label: 'Pagos', href: '/pagos' },
    { label: 'Inscribir Servicios Publicos', href: '/pagos/servicios-publicos/inscribir' },
  ];

  useEffect(() => {
    // Get result from sessionStorage
    const resultStr = sessionStorage.getItem('utilityRegistrationResult');
    if (!resultStr) {
      router.push('/pagos/servicios-publicos/inscribir');
      return;
    }

    setResult(JSON.parse(resultStr));

    // Cleanup on unmount
    return () => {
      sessionStorage.removeItem('utilityRegistrationData');
      sessionStorage.removeItem('utilityRegistrationResult');
    };
  }, [router]);

  const handleNewRegistration = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('utilityRegistrationData');
    sessionStorage.removeItem('utilityRegistrationResult');

    router.push('/pagos/servicios-publicos/inscribir');
  };

  const handleGoToPayments = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('utilityRegistrationData');
    sessionStorage.removeItem('utilityRegistrationResult');

    router.push('/pagos');
  };

  if (!result) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton onClick={handleGoToPayments} />
        <h1 className="text-xl font-medium text-black">
          Pago de servicios publicos
        </h1>
      </div>

      <Breadcrumbs items={breadcrumbItems} />

      <UtilityRegistrationResultCard result={result} />

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleNewRegistration}>
          Inscribir otro servicio
        </Button>
        <Button variant="primary" onClick={handleGoToPayments}>
          Ir a Pagos
        </Button>
      </div>
    </div>
  );
}
```

---

## State Management

### SessionStorage Keys

| Key | Description | Type |
|-----|-------------|------|
| `utilityRegistrationData` | Form data from registration form | JSON (UtilityRegistrationForm) |
| `utilityRegistrationResult` | Registration result | JSON (UtilityRegistrationResult) |

### Navigation Flow

```
/pagos/servicios-publicos (Flow Selection)
    ↓ Select "Inscribir Servicios"
/pagos/servicios-publicos/inscribir (Registration Form)
    ↓ Submit form
/pagos/servicios-publicos/inscribir/confirmacion (Confirmation)
    ↓ Confirm registration
/pagos/servicios-publicos/inscribir/resultado (Result)
    ↓ Finish
/pagos (Return to payments menu)
```

---

## Mock Data

### File: `src/mocks/mockUtilityRegistrationData.ts`

```typescript
import {
  CityOption,
  ConvenioOption,
  UtilityRegistrationResult,
} from '@/src/types/utility-registration';

/**
 * Mock cities for dropdown
 */
export const mockCities: CityOption[] = [
  { id: '1', name: 'Cali' },
  { id: '2', name: 'Bogota' },
  { id: '3', name: 'Medellin' },
  { id: '4', name: 'Barranquilla' },
  { id: '5', name: 'Cartagena' },
];

/**
 * Mock convenios (utility providers) for dropdown
 */
export const mockConvenios: ConvenioOption[] = [
  // Cali (cityId: 1)
  { id: '1', name: 'ENEL - Energia', category: 'Energia', cityId: '1' },
  { id: '2', name: 'EMCALI - Agua', category: 'Agua', cityId: '1' },
  { id: '3', name: 'Gases de Occidente', category: 'Gas', cityId: '1' },
  { id: '4', name: 'Claro - Telefonia', category: 'Telefonia', cityId: '1' },

  // Bogota (cityId: 2)
  { id: '5', name: 'Codensa - Energia', category: 'Energia', cityId: '2' },
  { id: '6', name: 'Acueducto de Bogota', category: 'Agua', cityId: '2' },
  { id: '7', name: 'Vanti Gas', category: 'Gas', cityId: '2' },
  { id: '8', name: 'ETB - Telefonia', category: 'Telefonia', cityId: '2' },

  // Medellin (cityId: 3)
  { id: '9', name: 'EPM - Energia', category: 'Energia', cityId: '3' },
  { id: '10', name: 'EPM - Agua', category: 'Agua', cityId: '3' },
  { id: '11', name: 'EPM - Gas', category: 'Gas', cityId: '3' },
  { id: '12', name: 'UNE - Telefonia', category: 'Telefonia', cityId: '3' },

  // Barranquilla (cityId: 4)
  { id: '13', name: 'Electricaribe', category: 'Energia', cityId: '4' },
  { id: '14', name: 'Triple A - Agua', category: 'Agua', cityId: '4' },
  { id: '15', name: 'Gases del Caribe', category: 'Gas', cityId: '4' },

  // Cartagena (cityId: 5)
  { id: '16', name: 'Afinia - Energia', category: 'Energia', cityId: '5' },
  { id: '17', name: 'Aguas de Cartagena', category: 'Agua', cityId: '5' },
  { id: '18', name: 'Surtigas', category: 'Gas', cityId: '5' },
];

/**
 * Mock registration result (success)
 */
export const mockRegistrationResultSuccess: UtilityRegistrationResult = {
  success: true,
  status: 'Aceptada',
  registrationId: 'REG-123456',
  alias: 'Luz casa',
  convenio: 'ENEL - Energia',
  city: 'Cali',
  billNumber: '555',
};

/**
 * Mock registration result (error)
 */
export const mockRegistrationResultError: UtilityRegistrationResult = {
  success: false,
  status: 'Rechazada',
  alias: 'Luz casa',
  convenio: 'ENEL - Energia',
  city: 'Cali',
  billNumber: '555',
  errorMessage: 'El numero de factura no existe en el sistema del convenio seleccionado.',
};
```

### Update: `src/mocks/index.ts`

```typescript
export * from './mockUtilityRegistrationData';
```

---

## Validation Schemas

### File: `src/schemas/utilityRegistrationSchemas.ts`

```typescript
import * as yup from 'yup';

/**
 * Utility registration form validation schema
 */
export const utilityRegistrationSchema = yup.object({
  cityId: yup
    .string()
    .required('Por favor selecciona una ciudad'),
  cityName: yup
    .string()
    .required(),
  convenioId: yup
    .string()
    .required('Por favor selecciona un convenio'),
  convenioName: yup
    .string()
    .required(),
  billNumber: yup
    .string()
    .trim()
    .required('Por favor ingresa el numero de factura')
    .min(1, 'El numero de factura es requerido'),
  alias: yup
    .string()
    .trim()
    .required('Por favor ingresa un alias')
    .max(50, 'El alias no puede exceder 50 caracteres'),
});

export type UtilityRegistrationFormData = yup.InferType<typeof utilityRegistrationSchema>;
```

---

## File Structure

### Complete File Tree

```
.claude/knowledge/features/09e-pagos/
├── references.md
└── spec.md

src/
├── atoms/
│   ├── SuccessIcon.tsx                      # NEW
│   ├── ErrorIcon.tsx                        # NEW (if not exists)
│   └── index.ts                             # UPDATE

├── molecules/
│   ├── FlowOptionCard.tsx                   # NEW
│   ├── ConfirmationRow.tsx                  # NEW or REUSE from 09d
│   └── index.ts                             # UPDATE

├── organisms/
│   ├── FlowSelectionCard.tsx                # NEW
│   ├── UtilityRegistrationForm.tsx          # NEW
│   ├── UtilityConfirmationCard.tsx          # NEW
│   ├── UtilityRegistrationResultCard.tsx    # NEW
│   └── index.ts                             # UPDATE

├── types/
│   ├── utility-registration.ts              # NEW
│   └── index.ts                             # UPDATE

├── mocks/
│   ├── mockUtilityRegistrationData.ts       # NEW
│   └── index.ts                             # UPDATE

└── schemas/
    └── utilityRegistrationSchemas.ts        # NEW

app/(authenticated)/pagos/
└── servicios-publicos/
    ├── page.tsx                             # NEW - Flow Selection
    └── inscribir/
        ├── page.tsx                         # NEW - Registration Form
        ├── confirmacion/
        │   └── page.tsx                     # NEW - Confirmation
        └── resultado/
            └── page.tsx                     # NEW - Result
```

---

## Implementation Order

### Phase 1: Types & Mock Data
1. Create type definitions:
   - `src/types/utility-registration.ts`
   - Update `src/types/index.ts`

2. Create mock data:
   - `src/mocks/mockUtilityRegistrationData.ts`
   - Update `src/mocks/index.ts`

### Phase 2: Atoms
3. Create atoms:
   - `src/atoms/SuccessIcon.tsx`
   - `src/atoms/ErrorIcon.tsx` (if not exists)
   - Update `src/atoms/index.ts`

### Phase 3: Molecules
4. Create molecules:
   - `src/molecules/FlowOptionCard.tsx`
   - `src/molecules/ConfirmationRow.tsx` (if not exists from 09d)
   - Update `src/molecules/index.ts`

### Phase 4: Organisms
5. Create organisms:
   - `src/organisms/FlowSelectionCard.tsx`
   - `src/organisms/UtilityRegistrationForm.tsx`
   - `src/organisms/UtilityConfirmationCard.tsx`
   - `src/organisms/UtilityRegistrationResultCard.tsx`
   - Update `src/organisms/index.ts`

### Phase 5: Pages
6. Create pages in order:
   - `app/(authenticated)/pagos/servicios-publicos/page.tsx` (Flow Selection)
   - `app/(authenticated)/pagos/servicios-publicos/inscribir/page.tsx` (Form)
   - `app/(authenticated)/pagos/servicios-publicos/inscribir/confirmacion/page.tsx` (Confirmation)
   - `app/(authenticated)/pagos/servicios-publicos/inscribir/resultado/page.tsx` (Result)

### Phase 6: Validation Schemas (Optional)
7. Create validation schemas:
   - `src/schemas/utilityRegistrationSchemas.ts`

### Phase 7: Testing & Refinement
8. Manual testing of complete flow
9. Edge case testing
10. Responsive testing
11. Accessibility testing

---

## Testing Strategy

### Manual Testing Checklist

#### Page 1: Flow Selection
- [ ] Page renders correctly
- [ ] Back button navigates to /pagos
- [ ] Breadcrumbs display correctly
- [ ] Card title "Pago de Servicios Publicos" displays
- [ ] Subtitle "Que deseas hacer hoy?" displays
- [ ] Two option cards render side by side
- [ ] "Inscribir Servicios" card has correct title and description
- [ ] "Pagar Servicios" card has correct title and description
- [ ] Cards have dashed blue border
- [ ] Hover effect changes border to solid
- [ ] Clicking "Inscribir Servicios" navigates to registration form
- [ ] Clicking "Pagar Servicios" navigates to payment flow (future)
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Focus states visible

#### Page 2: Registration Form
- [ ] Page renders correctly
- [ ] Back button navigates to flow selection
- [ ] Breadcrumbs display correctly
- [ ] Form title "Inscripcion de Servicios Publicos" displays
- [ ] Ciudad dropdown populates with mock cities
- [ ] Convenio dropdown is disabled when no city selected
- [ ] Selecting city enables Convenio dropdown
- [ ] Convenio dropdown filters by selected city
- [ ] Changing city resets Convenio selection
- [ ] Bill number input accepts text
- [ ] Alias input accepts text (max 50 chars)
- [ ] Validation: error if city not selected
- [ ] Validation: error if convenio not selected
- [ ] Validation: error if bill number empty
- [ ] Validation: error if alias empty
- [ ] Validation: error if alias > 50 chars
- [ ] Error messages display in red below fields
- [ ] Input borders turn red on error
- [ ] "Volver" link navigates back
- [ ] "Inscribir" button validates and navigates
- [ ] Form data stored in sessionStorage

#### Page 3: Confirmation
- [ ] Page renders correctly
- [ ] Back button navigates to registration form
- [ ] Breadcrumbs display correctly
- [ ] Title "Confirmar Inscripcion" displays
- [ ] Instruction text displays
- [ ] City value displays correctly
- [ ] Convenio value displays correctly
- [ ] Bill number value displays correctly
- [ ] Alias value displays correctly
- [ ] "Volver" link navigates back
- [ ] "Confirmar Inscripcion" button shows loading state
- [ ] Successful confirmation navigates to result
- [ ] Redirects to form if no sessionStorage data

#### Page 4: Result
- [ ] Page renders correctly
- [ ] Back button navigates to /pagos
- [ ] Breadcrumbs display correctly
- [ ] Success icon (green checkmark) displays for success
- [ ] "Inscripcion Aceptada" title displays for success
- [ ] "Estado de Inscripcion: Aceptada" in green
- [ ] All details display correctly
- [ ] "Inscribir otro servicio" button navigates to form
- [ ] "Ir a Pagos" button navigates to /pagos
- [ ] sessionStorage is cleared on finish
- [ ] Error state shows red X icon
- [ ] Error state shows "Inscripcion Rechazada"
- [ ] Error state shows error message

### Error States Testing
- [ ] Empty city shows error
- [ ] Empty convenio shows error
- [ ] Empty bill number shows error
- [ ] Empty alias shows error
- [ ] Long alias (>50 chars) shows error
- [ ] Network error shows appropriate message
- [ ] Registration rejection shows error result

### Responsive Testing
- [ ] Desktop (>=1024px): Two-column option cards
- [ ] Tablet (640-1023px): Two-column or stacked cards
- [ ] Mobile (<640px): Stacked cards
- [ ] Form fields full width on mobile
- [ ] Buttons stack on mobile
- [ ] Confirmation rows readable on all sizes

### Accessibility Testing
- [ ] Tab navigation works through all elements
- [ ] Focus states visible on all interactive elements
- [ ] Form labels properly associated
- [ ] Error messages announced to screen readers
- [ ] Icon buttons have aria-labels
- [ ] Color contrast meets WCAG AA
- [ ] Success/Error icons have alt text

---

## Dependencies

### Existing Components (Reuse)
- `BackButton` atom
- `Button` atom
- `Card` atom
- `Breadcrumbs` molecule
- `SelectField` molecule (or use native select)
- `FormField` molecule (or use native input)

### May Exist from 09d-pagos
- `ConfirmationRow` molecule

### New for 09e-pagos
- `SuccessIcon` atom
- `ErrorIcon` atom
- `FlowOptionCard` molecule
- `FlowSelectionCard` organism
- `UtilityRegistrationForm` organism
- `UtilityConfirmationCard` organism
- `UtilityRegistrationResultCard` organism

---

## Notes & Considerations

### City-Convenio Relationship
- Convenios are filtered based on selected city
- When city changes, convenio selection resets
- Convenio dropdown disabled until city selected
- Each convenio has a category (Energia, Gas, Agua, Telefonia)

### Form Validation Rules
- **Ciudad**: Required
- **Convenio**: Required (depends on city selection)
- **Numero de Factura**: Required, non-empty
- **Alias**: Required, max 50 characters

### Session Storage Cleanup
- Clear data on successful completion
- Clear data when navigating away
- Clear data on component unmount (result page)

### Future Features
- Payment flow (`/pagos/servicios-publicos/pagar`)
- List of registered services
- Edit/delete registered services
- Scheduled payments
- Payment history

### Error Handling
- Form validation errors
- Network/API errors
- Registration rejection from backend
- Missing sessionStorage data (redirect to form)

### Accessibility
- All form fields have labels
- Error messages linked to fields
- Keyboard navigation through options
- Focus management on page transitions
- Color contrast for error states

---

## API Integration Points (Future)

- `GET /api/utilities/cities` - Get available cities
- `GET /api/utilities/convenios?cityId={id}` - Get convenios for city
- `POST /api/utilities/register` - Register utility service
- `GET /api/utilities/registered` - Get user's registered services
- `DELETE /api/utilities/registered/{id}` - Delete registered service

---

## Design System Values Reference

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Primary Text (titles) | Navy Blue | #1D4E8F |
| Primary Button | Blue | #007FFF |
| Link Text | Dark Blue | #004266 |
| Success Text/Icon | Green | #009900 |
| Error Text/Icon | Red | #FF0D00 |
| Card Background | White | #FFFFFF |
| Page Background | Light Blue | #F0F9FF |
| Input Border | Gray | #E4E6EA |
| Dashed Border (options) | Navy Blue | #1D4E8F |
| Body Text | Black | #000000 |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Card Title | Ubuntu | 21px | Bold |
| Section Title | Ubuntu | 18px | Bold |
| Option Card Title | Ubuntu | 20px | Medium |
| Form Labels | Ubuntu | 15px | Regular |
| Body Text | Ubuntu | 15px | Regular |
| Confirmation Labels | Ubuntu | 15px | Regular |
| Confirmation Values | Ubuntu | 15px | Medium |
| Success Title | Ubuntu | 23px | Bold |
| Button Text | Ubuntu | 14px | Bold |
| Link Text | Ubuntu | 14px | Medium |

### Spacing
- Card padding: `24px` (p-6)
- Section spacing: `24px` (space-y-6)
- Form field spacing: `20px` (space-y-5)
- Option card height: `176px`

### Border Radius
- Cards: `16px` (rounded-2xl)
- Option cards: `8px` (rounded-lg)
- Inputs: `6px` (rounded-md)
- Button: `6px` (rounded-md)

---

**Last Updated**: 2026-01-06
**Status**: Ready for Implementation
**Estimated Effort**: 4-6 hours
**Dependencies**: Core UI components should be implemented (atoms, molecules from previous features)
