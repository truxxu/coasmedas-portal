# Feature 10f - Transferencias: Cuentas de mi Red Coopcentral

## Implementation Plan

**Version**: 1.0
**Status**: Ready for Implementation
**Estimated Phases**: 4

---

## Overview

This implementation plan adds a **Confirmation step** (Step 2) to the existing Coopcentral network transfer flow and enhances existing components with the **concept field** and **destination bank** information per the Figma designs.

### Current Flow (Missing Confirmation)

```
Account Selection → Details → SMS Verification → Result
```

### Target Flow (With Confirmation)

```
Account Selection → Details → Confirmation (NEW) → SMS Verification → Result
```

---

## Phase 1: Types and Mocks Updates

### Task 1.1: Update Network Transfer Types

**File**: `src/types/networkTransfer.ts`

**Changes**:

1. Add `concept` to `NetworkTransferFormData`:

```typescript
export interface NetworkTransferFormData {
  sourceAccountId: string;
  destinationProductId: string;
  amount: number;
  concept?: string; // NEW - Optional transfer concept
}
```

2. Add new `NetworkTransferConfirmationData` interface:

```typescript
/**
 * Step 2: Network transfer confirmation data
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
```

3. Update `NetworkTransferResult` to include new fields:

```typescript
export interface NetworkTransferResult {
  status: "success" | "error";
  sourceAccount: string;
  destinationBank: string; // NEW - "Coopcentral"
  destinationAccountNumber: string; // NEW - "123-456789-01"
  recipientName: string;
  destinationAccount: string; // Keep for backward compatibility
  amountTransferred: number;
  concept?: string; // NEW - Optional transfer concept
  transactionCost: number;
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
  errorMessage?: string;
}
```

4. Update `NetworkTransferFlowState` to include new fields:

```typescript
export interface NetworkTransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedRecipient: RegisteredNetworkAccount | null;
  selectedDestinationProduct: NetworkProduct | null;
  selectedSourceAccount: SourceAccount | null;
  amount: number;
  concept?: string; // NEW
  verificationCode: string;
  confirmationData: NetworkTransferConfirmationData | null; // NEW
  transactionResult: NetworkTransferResult | null;
  isLoading: boolean;
  error: string | null;
}
```

### Task 1.2: Update Types Index

**File**: `src/types/index.ts`

**Changes**: Export new type:

```typescript
export type {
  // ... existing exports
  NetworkTransferConfirmationData, // NEW
} from "./networkTransfer";
```

### Task 1.3: Update Mock Data

**File**: `src/mocks/mockNetworkTransferData.ts`

**Changes**:

1. Import new type:

```typescript
import {
  RegisteredNetworkAccount,
  SourceAccount,
  NetworkTransferResult,
  NetworkTransferConfirmationData, // NEW
} from "@/src/types/networkTransfer";
```

2. Add mock user data:

```typescript
/**
 * Mock user data for confirmation display
 */
export const mockNetworkTransferUserData = {
  holderName: "CAMILO ANDRES CRUZ",
  holderDocument: "CC 1.***.***. 231",
};
```

3. Add mock confirmation data:

```typescript
/**
 * Mock confirmation data
 */
export const mockNetworkTransferConfirmation: NetworkTransferConfirmationData =
  {
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

4. Update existing mock results to include new fields:

```typescript
export const mockNetworkTransferResult: NetworkTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Coopcentral", // NEW
  destinationAccountNumber: "123-456789-01", // NEW
  recipientName: "MARIA FERNANDA GONZALEZ",
  destinationAccount: "Cuenta de Ahorros (Ahorros ****4522)",
  amountTransferred: 350000,
  concept: "Clases mensuales", // NEW
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "450606",
  description: "Transferencia Exitosa",
};

export const mockNetworkTransferResultError: NetworkTransferResult = {
  status: "error",
  sourceAccount: "Cuenta de Ahorros",
  destinationBank: "Coopcentral", // NEW
  destinationAccountNumber: "123-456789-01", // NEW
  recipientName: "MARIA FERNANDA GONZALEZ",
  destinationAccount: "Cuenta de Ahorros (Ahorros ****4522)",
  amountTransferred: 0,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "-",
  description: "Fondos insuficientes",
};
```

### Task 1.4: Update Mocks Index

**File**: `src/mocks/index.ts`

**Changes**: Export new mocks:

```typescript
export {
  // ... existing exports
  mockNetworkTransferUserData, // NEW
  mockNetworkTransferConfirmation, // NEW
} from "./mockNetworkTransferData";
```

---

## Phase 2: Component Updates

### Task 2.1: Update NetworkTransferForm

**File**: `src/organisms/NetworkTransferForm.tsx`

**Changes**:

1. Add new props for concept:

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

2. Add concept field after the TransferAmountInput:

```tsx
{
  /* Concept Input - Optional */
}
<div>
  <label htmlFor="concept" className="block text-sm text-brand-text-black mb-2">
    Concepto (Opcional)
  </label>
  <input
    type="text"
    id="concept"
    value={concept}
    onChange={(e) => onConceptChange(e.target.value)}
    placeholder="Descripcion de la transferencia"
    maxLength={100}
    className="
      w-full h-11 px-3
      rounded-md border border-brand-footer-text
      text-base text-brand-text-black
      placeholder:text-[#B1B1B1]
      focus:border-brand-primary focus:ring-2 focus:ring-brand-primary focus:outline-none
    "
  />
</div>;
```

### Task 2.2: Create NetworkTransferConfirmationCard

**File**: `src/organisms/NetworkTransferConfirmationCard.tsx` (NEW)

**Implementation**:

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
          Por favor, verifica que los datos de la transaccion sean correctos
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

### Task 2.3: Update NetworkTransferResultCard

**File**: `src/organisms/NetworkTransferResultCard.tsx`

**Changes**:

1. Add new fields to display (destinationBank, concept):
   - Add "Banco Destino:" row after "Cuenta Origen:"
   - Add "Concepto:" row after "Valor Transferido:" (only if concept exists)

2. Updated JSX structure for the transfer details section:

```tsx
{
  /* Transfer Details - Section 1 */
}
<div className="space-y-3">
  <div className="flex justify-between items-center py-2">
    <span className="text-[15px] text-brand-text-black">Cuenta Origen:</span>
    <span className="text-[15px] font-medium text-brand-text-black text-right">
      {result.sourceAccount}
    </span>
  </div>
  {/* NEW: Banco Destino */}
  {result.destinationBank && (
    <div className="flex justify-between items-center py-2">
      <span className="text-[15px] text-brand-text-black">Banco Destino:</span>
      <span className="text-[15px] font-medium text-brand-text-black text-right">
        {result.destinationBank}
      </span>
    </div>
  )}
  {/* NEW: Cuenta Destino (number) */}
  {result.destinationAccountNumber && (
    <div className="flex justify-between items-center py-2">
      <span className="text-[15px] text-brand-text-black">Cuenta Destino:</span>
      <span className="text-[15px] font-medium text-brand-text-black text-right">
        {result.destinationAccountNumber}
      </span>
    </div>
  )}
  {/* Keep existing: Destinatario and Cuenta Destino (full) can be removed or kept for backward compat */}
  <div className="flex justify-between items-center py-2">
    <span className="text-[15px] text-brand-text-black">
      Valor Transferido:
    </span>
    <span className="text-lg font-medium text-brand-text-black">
      {hideBalances ? maskCurrency() : formatCurrency(result.amountTransferred)}
    </span>
  </div>
  {/* NEW: Concepto (if exists) */}
  {result.concept && (
    <div className="flex justify-between items-center py-2">
      <span className="text-[15px] text-brand-text-black">Concepto:</span>
      <span className="text-[15px] font-medium text-brand-text-black text-right">
        {result.concept}
      </span>
    </div>
  )}
  <div className="flex justify-between items-center py-2">
    <span className="text-[15px] text-brand-text-black">
      Costo Transaccion:
    </span>
    <span className="text-[15px] font-medium text-brand-text-black">
      {formatCurrency(result.transactionCost)}
    </span>
  </div>
</div>;
```

### Task 2.4: Update Organisms Index

**File**: `src/organisms/index.ts`

**Changes**: Export new component:

```typescript
export { NetworkTransferConfirmationCard } from "./NetworkTransferConfirmationCard";
```

---

## Phase 3: Page Updates

### Task 3.1: Update Details Page (Step 1)

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/detalle/page.tsx`

**Changes**:

1. Add concept state:

```typescript
const [concept, setConcept] = useState("");
```

2. Update the Stepper to show step 1:

```tsx
<Stepper currentStep={1} steps={NETWORK_TRANSFER_STEPS} />
```

3. Update NetworkTransferForm to include concept props:

```tsx
<NetworkTransferForm
  recipientName={recipient.name}
  sourceAccounts={mockSourceAccounts}
  destinationProduct={destinationProduct}
  selectedSourceId={selectedSourceId}
  amount={amount}
  concept={concept}
  onSourceChange={setSelectedSourceId}
  onAmountChange={setAmount}
  onConceptChange={setConcept}
  hideBalances={hideBalances}
  error={error}
/>
```

4. Update handleConfirm to store concept and navigate to confirmation:

```typescript
const handleConfirm = () => {
  setError("");

  // Validation
  if (!selectedSourceId) {
    setError("Por favor selecciona una cuenta origen");
    return;
  }
  if (!amount || Number(amount) <= 0) {
    setError("Por favor ingresa un valor a transferir");
    return;
  }

  const sourceAccount = mockSourceAccounts.find(
    (acc) => acc.id === selectedSourceId,
  );

  if (sourceAccount && Number(amount) > sourceAccount.balance) {
    setError("Saldo insuficiente en la cuenta seleccionada");
    return;
  }

  // Store data for next step
  sessionStorage.setItem("networkTransferSourceId", selectedSourceId);
  sessionStorage.setItem("networkTransferAmount", amount);
  sessionStorage.setItem("networkTransferConcept", concept); // NEW

  // Navigate to confirmation (changed from verificacion)
  router.push("/transferencias/internas/cuentas-mi-red/confirmacion");
};
```

### Task 3.2: Create Confirmation Page (Step 2) - NEW

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/confirmacion/page.tsx` (NEW)

**Implementation**:

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
    const destinationData = sessionStorage.getItem(
      "networkTransferDestination",
    );
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
      destinationAccountNumber: `123-456789-${destination.maskedNumber.slice(-2)}`,
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
        <Breadcrumbs items={["Inicio", "Transferencias", "Red Coopcentral"]} />
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

### Task 3.3: Update Verification Page (Step 3)

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/verificacion/page.tsx`

**Changes**:

1. Update WelcomeBar backHref to point to confirmation page:

```typescript
setWelcomeBar({
  title: "A Cuentas de mi Red",
  backHref: "/transferencias/internas/cuentas-mi-red/confirmacion", // Changed from detalle
});
```

2. Update handleBack to navigate to confirmation:

```typescript
const handleBack = () => {
  router.push("/transferencias/internas/cuentas-mi-red/confirmacion"); // Changed from detalle
};
```

3. Optionally change button text from "Pagar" to "Confirmar" (per spec):

```tsx
<Button
  variant="primary"
  onClick={handlePay}
  disabled={isLoading || code.length !== 6}
>
  {isLoading ? "Procesando..." : "Confirmar"}
</Button>
```

### Task 3.4: Update Result Page (Step 4)

**File**: `app/(authenticated)/transferencias/internas/cuentas-mi-red/resultado/page.tsx`

**Changes**:

1. Add concept to session storage retrieval:

```typescript
const concept = sessionStorage.getItem("networkTransferConcept") || "";
```

2. Update the transferResult construction to include new fields:

```typescript
const transferResult: NetworkTransferResult = {
  status: "success",
  sourceAccount: sourceAccount?.name || "Cuenta de Ahorros",
  destinationBank: "Coopcentral", // NEW
  destinationAccountNumber: `123-456789-${destination.maskedNumber.slice(-2)}`, // NEW
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

3. Update clearNetworkTransferData to remove concept:

```typescript
const clearNetworkTransferData = () => {
  sessionStorage.removeItem("networkTransferRecipient");
  sessionStorage.removeItem("networkTransferDestination");
  sessionStorage.removeItem("networkTransferSourceId");
  sessionStorage.removeItem("networkTransferAmount");
  sessionStorage.removeItem("networkTransferConcept"); // NEW
};
```

---

## Phase 4: Testing and Validation

### Task 4.1: Manual Testing Checklist

#### Happy Path

- [ ] Navigate to `/transferencias/internas/cuentas-mi-red`
- [ ] Select a registered network recipient
- [ ] Verify Step 1 (Detalle) displays correctly with stepper at step 1
- [ ] Select source account
- [ ] Enter valid amount within balance
- [ ] Enter optional concept
- [ ] Click "Confirmar" - should navigate to confirmation page
- [ ] Verify Step 2 (Confirmación) displays all data correctly
- [ ] Click "Confirmar Pago" - should navigate to SMS verification
- [ ] Verify Step 3 (SMS) shows stepper at step 3
- [ ] Enter valid SMS code (123456)
- [ ] Verify Step 4 (Resultado) shows success with all fields including destinationBank and concept
- [ ] Click "Finalizar" - should clear data and return to home

#### Validation Errors

- [ ] No source account selected - shows error
- [ ] Amount = 0 - shows error
- [ ] Amount exceeds balance - shows "Saldo insuficiente"
- [ ] Invalid SMS code - shows "Codigo incorrecto"

#### Navigation

- [ ] "Volver" on Step 1 - returns to account selection
- [ ] "Volver" on Step 2 - returns to Step 1 (details)
- [ ] "Volver" on Step 3 - returns to Step 2 (confirmation)
- [ ] "Realizar otra transaccion" on Step 4 - clears data, returns to account selection
- [ ] Direct URL access without session data - redirects to account selection

#### Edge Cases

- [ ] Empty concept field - should work (optional)
- [ ] Balance hidden mode - all currency values masked
- [ ] Concept with special characters - displays correctly
- [ ] Long concept (100 chars) - displays correctly, truncated if needed

### Task 4.2: Visual Verification

Compare each screen against Figma designs:

| Step | Figma Node | Check Points                                      |
| ---- | ---------- | ------------------------------------------------- |
| 1    | 842-11     | Form layout, labels, input styles, button states  |
| 2    | 842-594    | Summary rows, dividers, typography, spacing       |
| 3    | (existing) | Stepper shows step 3, code input works            |
| 4    | 842-1052   | Success icon, all fields displayed, button layout |

---

## Summary of Files to Create/Modify

### New Files (2)

| File                                                                               | Description                         |
| ---------------------------------------------------------------------------------- | ----------------------------------- |
| `src/organisms/NetworkTransferConfirmationCard.tsx`                                | Confirmation summary card component |
| `app/(authenticated)/transferencias/internas/cuentas-mi-red/confirmacion/page.tsx` | Step 2 confirmation page            |

### Modified Files (8)

| File                                           | Changes                                                    |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `src/types/networkTransfer.ts`                 | Add NetworkTransferConfirmationData, update existing types |
| `src/types/index.ts`                           | Export new type                                            |
| `src/mocks/mockNetworkTransferData.ts`         | Add mock user data and confirmation data                   |
| `src/mocks/index.ts`                           | Export new mocks                                           |
| `src/organisms/NetworkTransferForm.tsx`        | Add concept field                                          |
| `src/organisms/NetworkTransferResultCard.tsx`  | Add destinationBank and concept fields                     |
| `src/organisms/index.ts`                       | Export NetworkTransferConfirmationCard                     |
| `app/.../cuentas-mi-red/detalle/page.tsx`      | Add concept, change navigation                             |
| `app/.../cuentas-mi-red/verificacion/page.tsx` | Update back navigation                                     |
| `app/.../cuentas-mi-red/resultado/page.tsx`    | Add new fields to result                                   |

---

## Implementation Order

1. **Phase 1** - Types and Mocks (foundation)
   - Task 1.1 → Task 1.2 → Task 1.3 → Task 1.4

2. **Phase 2** - Components (dependencies first)
   - Task 2.1 (NetworkTransferForm)
   - Task 2.2 (NetworkTransferConfirmationCard - NEW)
   - Task 2.3 (NetworkTransferResultCard)
   - Task 2.4 (exports)

3. **Phase 3** - Pages (sequential by flow)
   - Task 3.1 (detalle - Step 1)
   - Task 3.2 (confirmacion - Step 2 NEW)
   - Task 3.3 (verificacion - Step 3)
   - Task 3.4 (resultado - Step 4)

4. **Phase 4** - Testing
   - Task 4.1 (manual testing)
   - Task 4.2 (visual verification)

---

## Notes

- **Stepper Step Numbers**: The spec indicates Step 1 starts at the details page, not the account selection page. Account selection is a "pre-step".
- **Destination Bank**: Always "Coopcentral" for network transfers - this is hardcoded.
- **Concept Field**: Optional (max 100 characters), displays only if provided.
- **Transaction Cost**: Currently $0, field present for future changes.
- **Session Storage Keys**: All prefixed with `networkTransfer` to avoid conflicts.
- **Backward Compatibility**: Keep `destinationAccount` field in result type for any existing consumers.
