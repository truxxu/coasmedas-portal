# Feature 10f - Transferencias: Cuentas de mi Red Coopcentral

## Specification Document

**Version**: 1.0
**Status**: Ready for Implementation
**Related Feature**: 10-transferencias (parent), 10a-transferencias (internal transfers)

---

## 1. Overview

This feature implements the "Cuentas de mi Red Coopcentral" transfer flow. Users can transfer money from their Coasmedas savings account to accounts within the Coopcentral cooperative network that have been previously registered. This is a 4-step flow: Details → Confirmation → SMS Verification → Result.

### User Story

> As an associate, I want to transfer funds from my Coasmedas savings account to other cooperative accounts in the Coopcentral network that I've previously registered, so I can send money to family or friends at other cooperatives without visiting a branch.

### Business Rules

1. Users can only transfer from their Coasmedas savings accounts (source)
2. Users can only transfer to previously registered Coopcentral network accounts (destination)
3. Transfer amount cannot exceed the source account balance
4. Transfer amount must be greater than zero
5. All transfers require SMS verification for security
6. Transfer concept/description is optional (max 100 characters)
7. If no network accounts are registered, prompt user to register accounts first
8. Transaction cost is displayed (currently $0)
9. Destination accounts come from the registered Coopcentral network accounts list

---

## 2. Route Structure

```
/transferencias/internas/cuentas-mi-red              → Account Selection (existing)
/transferencias/internas/cuentas-mi-red/detalle      → Step 1: Details Form
/transferencias/internas/cuentas-mi-red/confirmacion → Step 2: Confirmation (NEW)
/transferencias/internas/cuentas-mi-red/verificacion → Step 3: SMS Verification
/transferencias/internas/cuentas-mi-red/resultado    → Step 4: Result
```

### Directory Structure

```
app/(authenticated)/transferencias/internas/cuentas-mi-red/
├── page.tsx                 # Account selection (existing)
├── detalle/
│   └── page.tsx            # Step 1: Details form (UPDATE)
├── confirmacion/
│   └── page.tsx            # Step 2: Confirmation (NEW)
├── verificacion/
│   └── page.tsx            # Step 3: SMS verification (existing)
└── resultado/
    └── page.tsx            # Step 4: Transaction result (UPDATE)
```

---

## 3. Type Definitions

Update types in `src/types/networkTransfer.ts`:

### Existing Types (review/keep)

```typescript
/**
 * Registered account in user's network (recipient)
 */
export interface RegisteredNetworkAccount {
  id: string;
  name: string; // Full name (e.g., "MARIA FERNANDA GONZALEZ")
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
```

### New/Updated Types

```typescript
/**
 * Step 1: Network transfer form data (UPDATE - add concept)
 */
export interface NetworkTransferFormData {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
  concept?: string; // Optional transfer concept
}

/**
 * Step 2: Network transfer confirmation data (NEW)
 */
export interface NetworkTransferConfirmationData {
  // Holder (sender) info
  holderName: string;
  holderDocument: string; // Masked: "CC 1.***.***. 231"
  sourceProduct: string; // e.g., "Cuenta de Ahorros"

  // Destination info
  destinationHolder: string; // e.g., "PEDRO PEREZ"
  destinationBank: string; // "Coopcentral"
  destinationAccountType: string; // e.g., "Ahorros"
  destinationAccountNumber: string; // e.g., "123.-456789-01"

  // Transfer details
  amount: number;
  concept?: string;
}

/**
 * Step 4: Network transfer result (UPDATE - add missing fields)
 */
export interface NetworkTransferResult {
  status: "success" | "error";

  // Transfer details
  sourceAccount: string; // "Cuenta de Ahorros"
  destinationBank: string; // "Coopcentral"
  destinationAccountNumber: string; // "123-456789-01"
  recipientName: string; // "MARIA FERNANDA GONZALEZ"
  destinationAccount: string; // Legacy field for display
  amountTransferred: number;
  concept?: string;
  transactionCost: number;

  // Transaction metadata
  transactionDate: string; // "5 de Enero de 2025"
  transactionTime: string; // "03:02 p.m."
  approvalNumber: string; // "251606"
  description: string; // "Transferencia Exitosa"

  // Error info (if failed)
  errorMessage?: string;
}

/**
 * Complete network transfer flow state (UPDATE)
 */
export interface NetworkTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedRecipient: RegisteredNetworkAccount | null;
  selectedDestinationProduct: NetworkProduct | null;
  selectedSourceAccount: SourceAccount | null;
  amount: number;
  concept?: string;
  verificationCode: string;
  confirmationData: NetworkTransferConfirmationData | null;
  transactionResult: NetworkTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
```

Update `src/types/index.ts` to export the new types.

---

## 4. Mock Data Updates

Update mock data in `src/mocks/mockNetworkTransferData.ts`:

### New Mock Data to Add

```typescript
/**
 * Mock user data for confirmation display
 */
export const mockNetworkTransferUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
};

/**
 * Mock confirmation data
 */
export const mockNetworkTransferConfirmation: NetworkTransferConfirmationData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
  sourceProduct: "Cuenta de Ahorros",
  destinationHolder: "PEDRO PEREZ",
  destinationBank: "Coopcentral",
  destinationAccountType: "Ahorros",
  destinationAccountNumber: "123.-456789-01",
  amount: 200000,
  concept: "Clases mensuales",
};
```

### Updated Stepper Configuration

The stepper should reflect the actual 4-step flow from the details page onwards:

```typescript
/**
 * Network transfer flow steps
 */
export const NETWORK_TRANSFER_STEPS: Step[] = [
  { number: 1, label: "Detalle" },
  { number: 2, label: "Confirmación" },
  { number: 3, label: "SMS" },
  { number: 4, label: "Finalización" },
];
```

Update `src/mocks/index.ts` to export the new mocks.

---

## 5. Components

### 5.1 Update Organism: NetworkTransferForm

Location: `src/organisms/NetworkTransferForm.tsx`

Add concept field to the existing form.

**New Props:**

```typescript
interface NetworkTransferFormProps {
  recipientName: string;
  sourceAccounts: SourceAccount[];
  destinationProduct: NetworkProduct;
  selectedSourceId: string;
  amount: string;
  concept: string; // NEW
  onSourceChange: (accountId: string) => void;
  onAmountChange: (amount: string) => void;
  onConceptChange: (concept: string) => void; // NEW
  hideBalances: boolean;
  error?: string;
}
```

**New Form Section - Concept Input:**

Add after the Transfer Amount section:

```tsx
{/* Concept Input - Optional */}
<div>
  <label
    htmlFor="concept"
    className="block text-sm text-brand-text-black mb-2"
  >
    Concepto (Opcional)
  </label>
  <input
    type="text"
    id="concept"
    value={concept}
    onChange={(e) => onConceptChange(e.target.value)}
    placeholder="Descripción de la transferencia"
    maxLength={100}
    className="
      w-full h-11 px-3
      rounded-md border border-brand-footer-text
      text-base text-brand-text-black
      placeholder:text-[#B1B1B1]
      focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none
    "
  />
</div>
```

### 5.2 New Organism: NetworkTransferConfirmationCard

Location: `src/organisms/NetworkTransferConfirmationCard.tsx`

**Props:**

```typescript
interface NetworkTransferConfirmationCardProps {
  confirmationData: NetworkTransferConfirmationData;
  hideBalances: boolean;
  onConfirm: () => void;
  onBack: () => void;
}
```

**Layout:**

1. **Card Header**
   - Title: "Confirmación de Pago" (18px, Bold, navy `#005066`)
   - Description: "Por favor, verifica que los datos de la transacción sean correctos antes de continuar." (15px, light weight)

2. **Holder Section** (rows with label/value)
   - Nombre Titular: → CAMILO ANDRES CRUZ
   - Documento Titular: → CC 1.\*\*\*.\*\*\*. 231 (masked)
   - Producto a Debitar: → Cuenta de Ahorros
   - ─────────────── (divider)

3. **Destination Section**
   - Titular Destino: → PEDRO PEREZ
   - Banco Destino: → Coopcentral
   - Tipo de Cuenta: → Ahorros
   - Cuenta Destino: → 123.-456789-01
   - Valor a Transferir: → $ 200.000 (larger font, 18px, bold)
   - ─────────────── (divider)

4. **Transfer Details Section**
   - Concepto: → Clases mensuales (only if provided)

5. **Form Actions**
   - Back Link: "Volver" (navy `#004266`, left)
   - Primary Button: "Confirmar Pago" (blue `#00B8ED`, right)

**Row Styling:**

- Label: Light weight (`Ubuntu Light`), gray `#232323`, left aligned, 14px
- Value: Regular weight, black `#111827`, right aligned, 14px
- Amount value: Medium weight, 18px
- Divider lines: `1px solid #E4E6EA`
- Row spacing: `12px` vertical gap

**Component Implementation:**

```tsx
"use client";

import React from "react";
import { Card, Divider, Button } from "@/src/atoms";
import { NetworkTransferConfirmationData } from "@/src/types/networkTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface NetworkTransferConfirmationCardProps {
  confirmationData: NetworkTransferConfirmationData;
  hideBalances: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export function NetworkTransferConfirmationCard({
  confirmationData,
  hideBalances,
  onConfirm,
  onBack,
}: NetworkTransferConfirmationCardProps) {
  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmación de Pago
        </h2>
        <p className="text-[15px] text-[#58585B] mt-1">
          Por favor, verifica que los datos de la transacción sean correctos
          antes de continuar.
        </p>
      </div>

      {/* Holder Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Nombre Titular:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.holderName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Documento Titular:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.holderDocument}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Producto a Debitar:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.sourceProduct}
          </span>
        </div>
      </div>

      <Divider />

      {/* Destination Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Titular Destino:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationHolder}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Banco Destino:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationBank}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Tipo de Cuenta:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationAccountType}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Cuenta Destino:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationAccountNumber}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-[#232323]">
            Valor a Transferir:
          </span>
          <span className="text-lg font-medium text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.amount)}
          </span>
        </div>
      </div>

      {/* Concept (if provided) */}
      {confirmationData.concept && (
        <>
          <Divider />
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-light text-[#232323]">Concepto:</span>
            <span className="text-sm text-brand-text-black text-right">
              {confirmationData.concept}
            </span>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-[#004266] hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={onConfirm}>
          Confirmar Pago
        </Button>
      </div>
    </Card>
  );
}
```

### 5.3 Update Organism: NetworkTransferResultCard

Location: `src/organisms/NetworkTransferResultCard.tsx`

Update to include the `destinationBank` field and match Figma design more closely.

**Updated Layout for Success State:**

1. **Status Header** (centered)
   - Success Icon: Large green checkmark in circle (60px diameter)
   - Title: "Transacción Exitosa" (22px, Bold, navy `#005066`)

2. **Transfer Details Section**
   - Cuenta Origen: → Cuenta de Ahorros
   - Banco Destino: → Coopcentral (NEW)
   - Cuenta Destino: → 123-456789-01
   - Valor Transferido: → $200.000 (18px, bold)
   - Concepto: → Clases mensuales (only if provided)
   - Costo Transacción: → $ 0
   - ─────────────── (divider)

3. **Transaction Metadata Section**
   - Fecha de Transacción: → 5 de Enero de 2025
   - Hora de Transacción: → 03:02 p.m.
   - Número de Aprobación: → 251606
   - Descripción: → Transferencia Exitosa (green `#00A44C`)

4. **Action Buttons** (horizontal layout)
   - Secondary: "Imprimir/Guardar" (outline, navy border `#005066`)
   - Secondary: "Realizar otra transacción" (outline, navy border `#005066`)
   - Primary: "Finalizar" (blue `#00B8ED`)

---

## 6. Page Implementations

### 6.1 Account Selection Page (Existing - No Changes)

Location: `app/(authenticated)/transferencias/internas/cuentas-mi-red/page.tsx`

This page already handles account/recipient selection. No changes required.

### 6.2 Step 1: Details Page (UPDATE)

Location: `app/(authenticated)/transferencias/internas/cuentas-mi-red/detalle/page.tsx`

**Changes Required:**

1. Add `concept` state
2. Pass `concept` and `onConceptChange` to `NetworkTransferForm`
3. Update navigation: On confirm, navigate to `/confirmacion` instead of `/verificacion`
4. Store concept in sessionStorage

**Updated Session Storage:**

```typescript
// On confirm
sessionStorage.setItem("networkTransferSourceId", selectedSourceId);
sessionStorage.setItem("networkTransferAmount", amount);
sessionStorage.setItem("networkTransferConcept", concept); // NEW

// Navigate to confirmation (not verification)
router.push("/transferencias/internas/cuentas-mi-red/confirmacion");
```

### 6.3 Step 2: Confirmation Page (NEW)

Location: `app/(authenticated)/transferencias/internas/cuentas-mi-red/confirmacion/page.tsx`

**Behavior:**

1. Read data from sessionStorage
2. If missing data, redirect back to account selection
3. Build confirmation data from stored values + mock user data
4. Display breadcrumbs and Stepper at step 2
5. Render `NetworkTransferConfirmationCard`
6. "Volver" link returns to details page
7. "Confirmar Pago" button navigates to SMS verification

**Implementation:**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { NetworkTransferConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  NetworkTransferConfirmationData,
  RegisteredNetworkAccount,
  NetworkProduct,
} from "@/src/types/networkTransfer";
import {
  NETWORK_TRANSFER_STEPS,
  mockSourceAccounts,
  mockNetworkTransferUserData,
} from "@/src/mocks/mockNetworkTransferData";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [confirmationData, setConfirmationData] =
    useState<NetworkTransferConfirmationData | null>(null);

  useEffect(() => {
    setWelcomeBar({
      title: "Red Coopcentral",
      backHref: "/transferencias/internas/cuentas-mi-red/detalle",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from session storage
    const recipientData = sessionStorage.getItem("networkTransferRecipient");
    const destinationData = sessionStorage.getItem("networkTransferDestination");
    const sourceId = sessionStorage.getItem("networkTransferSourceId");
    const amount = sessionStorage.getItem("networkTransferAmount");
    const concept = sessionStorage.getItem("networkTransferConcept") || "";

    if (!recipientData || !destinationData || !sourceId || !amount) {
      router.push("/transferencias/internas/cuentas-mi-red");
      return;
    }

    const recipient: RegisteredNetworkAccount = JSON.parse(recipientData);
    const destination: NetworkProduct = JSON.parse(destinationData);
    const sourceAccount = mockSourceAccounts.find((acc) => acc.id === sourceId);

    // Build confirmation data
    const data: NetworkTransferConfirmationData = {
      holderName: mockNetworkTransferUserData.holderName,
      holderDocument: mockNetworkTransferUserData.holderDocument,
      sourceProduct: sourceAccount?.name || "Cuenta de Ahorros",
      destinationHolder: recipient.name,
      destinationBank: "Coopcentral",
      destinationAccountType:
        destination.type === "ahorros" ? "Ahorros" : "Corriente",
      destinationAccountNumber: destination.maskedNumber.replace(/\*/g, "").length > 0
        ? `123-456789-${destination.maskedNumber.slice(-2)}`
        : destination.maskedNumber,
      amount: Number(amount),
      concept: concept || undefined,
    };

    setConfirmationData(data);
  }, [router]);

  const handleConfirm = () => {
    router.push("/transferencias/internas/cuentas-mi-red/verificacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas/cuentas-mi-red/detalle");
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
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Red Coopcentral"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <NetworkTransferConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
        onConfirm={handleConfirm}
        onBack={handleBack}
      />
    </div>
  );
}
```

### 6.4 Step 3: SMS Verification Page (UPDATE)

Location: `app/(authenticated)/transferencias/internas/cuentas-mi-red/verificacion/page.tsx`

**Changes Required:**

1. Update stepper to show step 3 (currently shows step 3, which is correct)
2. Change button text from "Pagar" to "Confirmar" or "Verificar"

### 6.5 Step 4: Result Page (UPDATE)

Location: `app/(authenticated)/transferencias/internas/cuentas-mi-red/resultado/page.tsx`

**Changes Required:**

1. Add `destinationBank` field ("Coopcentral") to result construction
2. Add `concept` from sessionStorage
3. Update stepper to show step 4

**Updated Result Construction:**

```typescript
const transferResult: NetworkTransferResult = {
  status: "success",
  sourceAccount: sourceAccount?.name || "Cuenta de Ahorros",
  destinationBank: "Coopcentral", // NEW
  destinationAccountNumber: `123-456789-${destination.maskedNumber.slice(-2)}`,
  recipientName: recipient.name,
  destinationAccount: `${destination.name} (${destination.type === "ahorros" ? "Ahorros" : "Corriente"} ${destination.maskedNumber})`,
  amountTransferred: Number(amount),
  concept: concept || undefined, // NEW
  transactionCost: 0,
  transactionDate: new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  transactionTime: new Date().toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }),
  approvalNumber: Math.floor(100000 + Math.random() * 900000).toString(),
  description: "Transferencia Exitosa",
};
```

---

## 7. Validation Rules

### Step 1: Details Form

| Field           | Rule             | Error Message                               |
| --------------- | ---------------- | ------------------------------------------- |
| Source Account  | Required         | "Por favor selecciona una cuenta origen"    |
| Amount          | Required         | "Por favor ingresa un valor a transferir"   |
| Amount          | > 0              | "El valor debe ser mayor a cero"            |
| Amount          | ≤ source balance | "Saldo insuficiente en la cuenta seleccionada" |
| Concept         | Optional         | N/A                                         |
| Concept         | Max 100 chars    | "El concepto no puede exceder 100 caracteres" |

### Step 3: SMS Verification

| Field | Rule               | Error Message                              |
| ----- | ------------------ | ------------------------------------------ |
| Code  | Required, 6 digits | "Por favor ingresa el código de 6 dígitos" |
| Code  | Valid code         | "Código incorrecto. Por favor intenta nuevamente." |

---

## 8. State Management

### Session Storage Keys

All prefixed with `networkTransfer` to avoid conflicts:

| Key                           | Type   | Description                                  |
| ----------------------------- | ------ | -------------------------------------------- |
| `networkTransferRecipient`    | JSON   | Selected recipient account object            |
| `networkTransferDestination`  | JSON   | Selected destination product object          |
| `networkTransferSourceId`     | string | Selected source account ID                   |
| `networkTransferAmount`       | string | Transfer amount (as string for preservation) |
| `networkTransferConcept`      | string | Transfer concept/description (NEW)           |

### Flow Navigation

```
Account Selection → [Select recipient] → Store recipient → Step 1
Step 1 → [Validate + Confirm] → Store form data → Step 2 (NEW)
Step 2 → [Confirm] → Step 3
Step 3 → [Verify SMS] → Generate result → Step 4
Step 4 → [Finalizar] → Clear sessionStorage → /home
       → [Otra transacción] → Clear sessionStorage → Account Selection
```

---

## 9. Component Exports

### New/Updated Organisms to Export

**Organisms** (`src/organisms/index.ts`):

```typescript
export { NetworkTransferConfirmationCard } from "./NetworkTransferConfirmationCard";
// NetworkTransferForm already exported
// NetworkTransferResultCard already exported
```

### Types Export Updates

**Types** (`src/types/index.ts`):

```typescript
export type {
  RegisteredNetworkAccount,
  NetworkProduct,
  SourceAccount,
  NetworkTransferFormData,
  NetworkTransferConfirmationData, // NEW
  NetworkTransferResult,
  NetworkTransferFlowState,
} from "./networkTransfer";
```

### Mock Export Updates

**Mocks** (`src/mocks/index.ts`):

```typescript
export {
  mockRegisteredAccounts,
  mockSourceAccounts,
  mockNetworkTransferResult,
  mockNetworkTransferResultError,
  mockNetworkTransferUserData, // NEW
  mockNetworkTransferConfirmation, // NEW
  NETWORK_TRANSFER_STEPS,
  MOCK_VALID_CODE,
} from "./mockNetworkTransferData";
```

---

## 10. Reusable Components

The following existing components should be reused:

| Component            | Location        | Usage                         |
| -------------------- | --------------- | ----------------------------- |
| `BackButton`         | atoms           | Back navigation arrow         |
| `Breadcrumbs`        | molecules       | Page navigation trail         |
| `HideBalancesToggle` | molecules       | Balance visibility toggle     |
| `Stepper`            | molecules       | 4-step progress indicator     |
| `CodeInputCard`      | organisms       | SMS verification (Step 3)     |
| `Card`               | atoms           | Container cards               |
| `Button`             | atoms           | Primary and secondary buttons |
| `Divider`            | atoms           | Horizontal separators         |
| `DestinationProductCard` | molecules   | Destination product display   |
| `TransferAmountInput` | molecules      | Amount input with formatting  |

---

## 11. Accessibility Requirements

1. **Form Labels**: All inputs must have associated labels with `htmlFor`/`id` attributes
2. **Stepper**: Steps have proper `aria-current` for active step
3. **Error Messages**: Associate with inputs via `aria-describedby`
4. **Focus Management**: Move focus to first error on validation failure
5. **Status Announcements**: Use `aria-live="polite"` for success/error states
6. **Keyboard Navigation**: All interactive elements must be keyboard accessible
7. **Color Contrast**: Ensure text meets WCAG AA standards
8. **Status Icons**: Color not used as sole indicator (icons + text)

---

## 12. Implementation Checklist

### Phase 1: Types and Mocks Updates

- [ ] Update `src/types/networkTransfer.ts` - Add NetworkTransferConfirmationData, update other types
- [ ] Update `src/types/index.ts` - Export new types
- [ ] Update `src/mocks/mockNetworkTransferData.ts` - Add user data and confirmation mocks
- [ ] Update `src/mocks/index.ts` - Export new mocks

### Phase 2: Component Updates

- [ ] Update `NetworkTransferForm` - Add concept field
- [ ] Create `NetworkTransferConfirmationCard` organism (NEW)
- [ ] Update `NetworkTransferResultCard` - Add destinationBank and concept fields
- [ ] Update `src/organisms/index.ts` - Export new organism

### Phase 3: Page Updates

- [ ] Update Step 1 page: `detalle/page.tsx` - Add concept, navigate to confirmation
- [ ] Create Step 2 page: `confirmacion/page.tsx` (NEW)
- [ ] Update Step 3 page: `verificacion/page.tsx` - Button text if needed
- [ ] Update Step 4 page: `resultado/page.tsx` - Add new fields to result

---

## 13. Testing Scenarios

### Happy Path

1. Navigate to `/transferencias/internas/cuentas-mi-red`
2. Select a registered network recipient
3. Select source account (savings)
4. Enter valid amount within balance
5. Optionally enter transfer concept
6. Click "Confirmar"
7. Review confirmation details
8. Click "Confirmar Pago"
9. Enter valid SMS code (123456)
10. View success result
11. Click "Finalizar" to return to home

### Validation Errors

1. No source account selected → Error message
2. Amount = 0 → Error message
3. Amount exceeds balance → "Saldo insuficiente"
4. Invalid SMS code → "Código incorrecto"

### Edge Cases

1. No registered network accounts → Show empty state prompting registration
2. Navigate directly to step 2/3/4 without data → Redirect to account selection
3. Session timeout during flow → Handle gracefully
4. Balance hidden mode → Mask all currency values
5. Multiple source accounts → All shown in dropdown
6. "Realizar otra transacción" → Resets form, returns to account selection
7. Empty concept → Allowed (optional field)

### Error States

1. SMS verification fails multiple times → Allow retry
2. Transfer fails → Show error result with retry option

---

## 14. Design References

| Step | Figma Node  | Description                                    |
| ---- | ----------- | ---------------------------------------------- |
| 1    | `842-11`    | Details form with source/destination selection |
| 2    | `842-594`   | Confirmation card with transfer summary        |
| 3    | (existing)  | SMS verification (reuse existing)              |
| 4    | `842-1052`  | Success/error result card                      |

Base URL: `https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=`

---

## 15. Color Reference

| Color Name       | Hex Code  | Usage                           |
| ---------------- | --------- | ------------------------------- |
| Primary Navy     | `#005066` | Card titles, section titles     |
| Dark Navy        | `#004266` | "Volver" link text              |
| Primary Blue     | `#00B8ED` | Primary buttons, active stepper |
| Disabled Blue    | `#8FE6FF` | Disabled button state           |
| Text Black       | `#111827` | Primary text, values            |
| Gray High        | `#58585B` | Secondary text, descriptions    |
| Gray Label       | `#232323` | Confirmation row labels         |
| Gray Placeholder | `#B1B1B1` | Input placeholders              |
| Gray Border      | `#B1B1B1` | Input borders                   |
| Gray Divider     | `#E4E6EA` | Divider lines, pending stepper  |
| Success Green    | `#00A44C` | Success icon, description       |
| Brand Teal       | `#00AFA9` | Alternative success color       |
| Error Red        | `#FF0D00` | Error icon, error messages      |
| White            | `#FFFFFF` | Backgrounds, button text        |

---

## 16. Related Features

- **10-transferencias**: Parent feature - Transfers main menu
- **10a-transferencias**: Internal transfers flow selection
- **10b-transferencias**: Between my accounts transfer (Entre Mis Cuentas)
- **10c-transferencias**: Network transfers - Account selection
- **10d-transferencias**: Account registration (Inscribir Cuentas)
- **10e-transferencias**: External bank transfers (A Otros Bancos)

---

## 17. Notes

- **Account Selection Step**: The first page (`page.tsx`) handles selecting which registered network recipient to transfer to. This step is already implemented.
- **Confirmation Page**: This is a new page that was missing from the original implementation. The flow was going directly from details to SMS verification.
- **Concept Field**: The concept/description field is optional for network transfers (unlike external bank transfers where it may be required).
- **Transaction Cost**: Currently displayed as $0, but the field should be present for future changes.
- **Print/Save**: Should generate a PDF receipt with transaction details.
- **"Realizar otra transacción"**: Clears form and returns to account selection, ready for new transfer.
- **"Finalizar"**: Clears session data and navigates to home dashboard.
- **Balance Masking**: When hideBalances is true, all currency amounts should show "$ \*\*\*\*".
- **Responsive Design**: Cards should stack vertically on mobile screens.
- **Destination Bank**: Always "Coopcentral" for network transfers (unlike external transfers where it varies).
- **Stepper Step Count**: The stepper starts counting from the details page as Step 1, so account selection is a "pre-step".
