# Feature 10h - Transferencias: Programar Transferencias — Implementation Spec

## Summary

Implement the "Programar Transferencias" feature under `/transferencias/programar`. This feature allows users to schedule recurring or one-time transfers/payments. It consists of 3 pages: a selection page with two option cards, a form page for scheduling new transfers (with dynamic fields based on periodicity and a success modal), and a history page with a data table of scheduled transfers.

**Note**: The sidebar already includes the "Programar transferencias" sub-item under Transferencias pointing to `/transferencias/programar`.

---

## File Creation Plan

### New Files to Create (in order)

| #   | File                                                              | Type     | Description                                       |
| --- | ----------------------------------------------------------------- | -------- | ------------------------------------------------- |
| 1   | `src/types/scheduledTransfer.ts`                                  | Types    | All TypeScript interfaces for scheduled transfers |
| 2   | `src/schemas/scheduledTransferSchema.ts`                          | Schema   | Yup validation schema for the schedule form       |
| 3   | `src/mocks/mockScheduledTransferData.ts`                          | Mocks    | Mock data, options, and constants                 |
| 4   | `src/organisms/ScheduleTransferSelectionCard.tsx`                 | Organism | Two-option card grid for selection page           |
| 5   | `src/organisms/ScheduleTransferForm.tsx`                          | Organism | Dynamic form for scheduling transfers             |
| 6   | `src/organisms/ScheduleSuccessModal.tsx`                          | Organism | Success modal after scheduling                    |
| 7   | `src/organisms/ScheduledTransfersTable.tsx`                       | Organism | Table displaying scheduled transfers history      |
| 8   | `app/(authenticated)/transferencias/programar/page.tsx`           | Page     | Selection page                                    |
| 9   | `app/(authenticated)/transferencias/programar/nuevo/page.tsx`     | Page     | New schedule form page                            |
| 10  | `app/(authenticated)/transferencias/programar/historial/page.tsx` | Page     | History table page                                |

### Files to Modify

| File                             | Change                           |
| -------------------------------- | -------------------------------- |
| `src/organisms/index.ts`         | Export 4 new organism components |
| `src/mocks/index.ts`             | Export new mock data             |
| `src/types/index.ts` (if exists) | Export new types                 |

---

## Detailed Implementation

### 1. Types — `src/types/scheduledTransfer.ts`

```typescript
/**
 * Transaction type option for the schedule form
 */
export interface TransactionTypeOption {
  value: string;
  label: string;
}

/**
 * Periodicity type
 */
export type Periodicity = "unica" | "mensual" | "quincenal";

/**
 * Periodicity option for the schedule form
 */
export interface PeriodicityOption {
  value: Periodicity;
  label: string;
}

/**
 * Source account for scheduled transfer
 */
export interface ScheduleSourceAccount {
  id: string;
  name: string;
  accountType: string;
  balance: number;
}

/**
 * Destination account (registered external account)
 */
export interface ScheduleDestinationAccount {
  id: string;
  name: string;
  accountNumber: string;
}

/**
 * Form data for scheduling a new transfer
 */
export interface ScheduledTransferFormData {
  transactionType: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  amount?: string;
  startDate: string;
  periodicity: Periodicity;
  numberOfPayments?: string;
  concept?: string;
}

/**
 * Scheduled transfer record for history table
 */
export interface ScheduledTransfer {
  id: string;
  type: string;
  origin: string;
  destination: string;
  nextExecutionDate: string;
  periodicity: string;
  amount: number;
  status: string;
}
```

---

### 2. Schema — `src/schemas/scheduledTransferSchema.ts`

Use yup with conditional validation based on periodicity.

```typescript
import * as yup from "yup";

export const scheduledTransferSchema = yup.object({
  transactionType: yup.string().required("Seleccione un tipo de transaccion"),
  startDate: yup.string().required("Ingrese la fecha de inicio del pago"),
  periodicity: yup
    .string()
    .oneOf(["unica", "mensual", "quincenal"])
    .required("Seleccione la periodicidad"),
  sourceAccountId: yup.string().when("periodicity", {
    is: (val: string) => val === "mensual" || val === "quincenal",
    then: (schema) => schema.required("Seleccione una cuenta origen"),
    otherwise: (schema) => schema.optional(),
  }),
  destinationAccountId: yup.string().when("periodicity", {
    is: (val: string) => val === "mensual" || val === "quincenal",
    then: (schema) => schema.required("Seleccione una cuenta destino"),
    otherwise: (schema) => schema.optional(),
  }),
  amount: yup.string().when("periodicity", {
    is: (val: string) => val === "mensual" || val === "quincenal",
    then: (schema) =>
      schema
        .required("Ingrese el monto a transferir")
        .test("positive", "El monto debe ser mayor a 0", (val) => {
          if (!val) return false;
          const num = Number(val.replace(/\./g, ""));
          return num > 0;
        }),
    otherwise: (schema) => schema.optional(),
  }),
  numberOfPayments: yup
    .string()
    .optional()
    .test("positive-integer", "Debe ser un numero entero positivo", (val) => {
      if (!val || val === "") return true;
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }),
  concept: yup
    .string()
    .optional()
    .max(100, "El concepto no puede exceder 100 caracteres"),
});

export type ScheduledTransferFormValues = yup.InferType<
  typeof scheduledTransferSchema
>;
```

---

### 3. Mock Data — `src/mocks/mockScheduledTransferData.ts`

```typescript
import type {
  TransactionTypeOption,
  PeriodicityOption,
  ScheduleSourceAccount,
  ScheduleDestinationAccount,
  ScheduledTransfer,
} from "@/src/types/scheduledTransfer";

/**
 * Transaction type options
 */
export const TRANSACTION_TYPE_OPTIONS: TransactionTypeOption[] = [
  {
    value: "transferencia-otros-bancos",
    label: "Transferencia a otros bancos",
  },
  { value: "transferencia-mi-red", label: "Transferencia a mi red" },
  { value: "pago-obligacion", label: "Pago de Obligacion" },
];

/**
 * Periodicity options
 */
export const PERIODICITY_OPTIONS: PeriodicityOption[] = [
  { value: "unica", label: "Unica vez" },
  { value: "mensual", label: "Mensual" },
  { value: "quincenal", label: "Quincenal" },
];

/**
 * Mock source accounts
 */
export const mockScheduleSourceAccounts: ScheduleSourceAccount[] = [
  {
    id: "savings-1",
    name: "Cuenta de Ahorros",
    accountType: "Cuenta de Ahorros",
    balance: 8730500,
  },
];

/**
 * Mock destination accounts (registered external accounts)
 */
export const mockScheduleDestinationAccounts: ScheduleDestinationAccount[] = [
  {
    id: "ext-1",
    name: "Cuenta Mama",
    accountNumber: "***6745",
  },
  {
    id: "ext-2",
    name: "Valeria Alvarado",
    accountNumber: "***1234",
  },
];

/**
 * Mock scheduled transfers for history table
 */
export const mockScheduledTransfers: ScheduledTransfer[] = [
  {
    id: "sched-1",
    type: "Pago de Obligacion",
    origin: "",
    destination: "Credito de Libre Inversion",
    nextExecutionDate: "30 Nov 2025",
    periodicity: "Unica vez",
    amount: 850000,
    status: "2/12",
  },
  {
    id: "sched-2",
    type: "Transferencia a mi red",
    origin: "",
    destination: "MARIA FERENANDA GONZALEZ",
    nextExecutionDate: "15 Nov 2025",
    periodicity: "Quincenal",
    amount: 200000,
    status: "Activa",
  },
  {
    id: "sched-3",
    type: "Transferencia a otros bancos",
    origin: "",
    destination: "Valeria Alvarado",
    nextExecutionDate: "20 Sept 2025",
    periodicity: "Mensual",
    amount: 200000,
    status: "Activa",
  },
];
```

---

### 4. Organism — `ScheduleTransferSelectionCard.tsx`

Renders two `FlowOptionCard` components in a 2-column grid, similar to `InternasFlowGrid` / `ExternasFlowGrid` pattern.

**Props interface:**

```typescript
interface ScheduleTransferSelectionCardProps {
  onSelectOption: (option: "nuevo" | "historial") => void;
}
```

**Layout:**

```tsx
<div className="bg-white rounded-2xl p-8 shadow-sm">
  {/* Header */}
  <div className="text-center mb-8">
    <h2 className="text-2xl font-medium text-brand-navy mb-3">
      Programacion de Pagos y Transferencias
    </h2>
    <p className="text-sm text-black">
      Automatiza tus transacciones recurrentes y olvidate de las fechas de pago.
      Define tus condiciones y nosotros nos encargamos del resto.
    </p>
  </div>

  {/* Option cards grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FlowOptionCard
      title="Programa Nuevo Pago/Transferencia"
      description="Crea una nueva programacion para tus pagos o transferencias"
      onClick={() => onSelectOption("nuevo")}
      icon={/* Circle with "+" icon */}
    />
    <FlowOptionCard
      title="Ver Pagos Programados"
      description="Consulta, edita o elimina tus programaciones existentes."
      onClick={() => onSelectOption("historial")}
    />
  </div>
</div>
```

**Icon for Card 1**: An inline SVG circle with a "+" symbol inside:

```tsx
const PlusCircleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="19" stroke="#005066" strokeWidth="2" />
    <path
      d="M20 12V28M12 20H28"
      stroke="#005066"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
```

**Card 2**: Uses the existing `FlowOptionCard` without a custom icon (the Figma shows it without one).

---

### 5. Organism — `ScheduleTransferForm.tsx`

A single-card form that uses `react-hook-form` with yup resolver. Fields render conditionally based on periodicity.

**Props interface:**

```typescript
interface ScheduleTransferFormProps {
  sourceAccounts: ScheduleSourceAccount[];
  destinationAccounts: ScheduleDestinationAccount[];
  hideBalances: boolean;
  onSubmit: (data: ScheduledTransferFormValues) => void;
  onBack: () => void;
}
```

**Implementation details:**

- Uses `useForm<ScheduledTransferFormValues>` with `yupResolver(scheduledTransferSchema)`
- Watches `periodicity` field to conditionally render additional fields
- Uses `SelectField` for dropdowns, `FormField` for text inputs, `DateInput` for date
- Source account select options format: `"Cuenta de Ahorros - Saldos: $ 8.730.500"` (use `formatCurrency`)
- Destination account select options format: `"Cuenta Mama (***6745)"`
- The "Programar" button is disabled when form is invalid (use `formState.isValid`)

**Layout:**

```tsx
<Card className="space-y-6 p-8">
  <h3 className="text-lg font-medium text-brand-navy">
    Programar Nuevo Pago o Transferencia
  </h3>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    {/* Always visible */}
    <SelectField label="Tipo de Transaccion" ... />

    {/* Conditional: shown when periodicity is "mensual" or "quincenal" */}
    {isRecurring && (
      <>
        <SelectField label="Cuenta Origen" ... />
        <SelectField label="Cuenta Externa Inscrita" ... />
        <FormField label="Monto" ... />
      </>
    )}

    {/* Always visible */}
    <DateInput label="Fecha de Inicio del Pago" ... />
    <SelectField label="Periodicidad" ... />
    <FormField label="Numero de Pagos (dejar en blanco para indefinido)" placeholder="Ej: 12" ... />
    <FormField label="Concepto o Descripcion" ... />

    {/* Actions */}
    <div className="flex items-center justify-between pt-4">
      <button type="button" onClick={onBack}
        className="text-sm font-medium text-[#004266] hover:underline">
        Volver
      </button>
      <Button type="submit" variant="primary" disabled={!formState.isValid}>
        Programar
      </Button>
    </div>
  </form>
</Card>
```

**Key behavior:**

- When periodicity changes from recurring to "unica", clear `sourceAccountId`, `destinationAccountId`, and `amount` fields using `reset` or `setValue`
- The `DateInput` should use format `dd/mm/aaaa` with a calendar icon
- Amount field uses standard `FormField` input (not the bottom-border `CurrencyInput` style)
- Button disabled styling: `#8FE6FF` background with white text (per design spec)

**Button styling override:**
The "Programar" button has a custom disabled style. Apply via className or conditional styling:

- Enabled: `bg-[#00B8ED] text-white rounded-md shadow-sm px-7 py-2 text-sm font-bold`
- Disabled: `bg-[#8FE6FF] text-white rounded-md px-7 py-2 text-sm font-bold cursor-not-allowed`

---

### 6. Organism — `ScheduleSuccessModal.tsx`

A simple success modal that follows the existing `AccountSuccessModal` pattern.

**Props interface:**

```typescript
interface ScheduleSuccessModalProps {
  isOpen: boolean;
  onAccept: () => void;
}
```

**Implementation:**

Follow the `AccountSuccessModal.tsx` pattern with these specifics:

- **Backdrop**: `fixed inset-0 z-50 flex items-center justify-center` with `bg-black/50` overlay
- **Modal container**: `relative bg-white rounded-[15px] p-8 max-w-md w-full mx-4`
- **Title**: "Programacion Nueva" (20px, bold, navy `#005066`, centered)
- **Message**: "Programacion creada con exito!" (15px, regular, black, centered)
- **Button**: Single "Aceptar" button, centered, blue `#00B8ED` with white text
- **Accessibility**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, escape key closes

**Focus management:**

- On open: focus the "Aceptar" button
- Trap focus within modal
- On escape: call `onAccept`
- Prevent body scroll: `document.body.style.overflow = "hidden"` on mount, restore on unmount

---

### 7. Organism — `ScheduledTransfersTable.tsx`

A table displaying scheduled transfers with export buttons and delete actions.

**Props interface:**

```typescript
interface ScheduledTransfersTableProps {
  transfers: ScheduledTransfer[];
  hideBalances: boolean;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onDelete: (transferId: string) => void;
  onBack: () => void;
}
```

**Layout:**

```tsx
<Card className="space-y-6 p-8">
  {/* Header with title and export buttons */}
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-medium text-brand-navy">
      Historial de Pagos Programados
    </h3>
    <div className="flex items-center gap-4">
      <button
        onClick={onExportPDF}
        className="flex items-center gap-1 text-[13.7px] font-medium text-black hover:underline"
      >
        {/* Download/document icon */}
        Exportar PDF
      </button>
      <button
        onClick={onExportExcel}
        className="flex items-center gap-1 text-[13.7px] font-medium text-black hover:underline"
      >
        {/* Spreadsheet icon */}
        Exportar Excel
      </button>
    </div>
  </div>

  {/* Data Table */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            TIPO
          </th>
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            ORIGEN
          </th>
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            DESTINO
          </th>
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            PROXIMA EJECUCION
          </th>
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            PERIODICIDAD
          </th>
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            MONTO
          </th>
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            ESTADO
          </th>
          <th className="text-left text-[15px] font-normal text-black py-3 px-2">
            ACCIONES
          </th>
        </tr>
      </thead>
      <tbody>
        {transfers.map((transfer) => (
          <tr key={transfer.id} className="border-b border-[#E4E6EA]">
            <td className="text-[13.7px] text-black py-3 px-2">
              {transfer.type}
            </td>
            <td className="text-[13.7px] text-black py-3 px-2">
              {transfer.origin || "—"}
            </td>
            <td className="text-[13.7px] text-black py-3 px-2">
              {transfer.destination}
            </td>
            <td className="text-[13.7px] text-black py-3 px-2">
              {transfer.nextExecutionDate}
            </td>
            <td className="text-[13.7px] text-black py-3 px-2">
              {transfer.periodicity}
            </td>
            <td className="text-[13.7px] text-black py-3 px-2">
              {hideBalances ? maskCurrency() : formatCurrency(transfer.amount)}
            </td>
            <td className="text-[13.7px] text-[#003500] py-3 px-2">
              {transfer.status}
            </td>
            <td className="py-3 px-2">
              <button
                onClick={() => onDelete(transfer.id)}
                className="text-[13.7px] text-red-600 hover:underline"
                aria-label={`Eliminar transferencia a ${transfer.destination}`}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Back link */}
  <div className="pt-4">
    <button
      onClick={onBack}
      className="text-sm font-medium text-[#004266] hover:underline"
    >
      Volver
    </button>
  </div>
</Card>
```

**Table header styling:**

- Background: transparent (inherits page background `#FFFEF2`)
- Text: `15px`, normal weight, black
- Bottom border separating header from body rows

**Status column:**

- Green text `#003500` for both progress indicators (e.g., "2/12") and "Activa" status

**Export buttons:**

- Presentational only — `onExportPDF` and `onExportExcel` callbacks are no-ops for now
- Include small inline SVG icons (download icon for PDF, spreadsheet icon for Excel)

**Empty state:**

- When `transfers.length === 0`, show centered text: "No hay pagos programados"

---

### 8. Page — Selection (`/transferencias/programar/page.tsx`)

Follow the existing `internas/page.tsx` and `externas/page.tsx` pattern.

**Component name:** `ProgramarTransferenciasPage`

**Implementation:**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Breadcrumbs } from "@/src/molecules";
import { HideBalancesToggle } from "@/src/molecules";
import { ScheduleTransferSelectionCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

export default function ProgramarTransferenciasPage() {
  const router = useRouter();
  const { setWelcomeBarConfig, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBarConfig({
      title: "Programar Transferencias",
      backHref: "/transferencias",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBarConfig, clearWelcomeBar]);

  const handleSelectOption = (option: "nuevo" | "historial") => {
    if (option === "nuevo") {
      router.push("/transferencias/programar/nuevo");
    } else {
      router.push("/transferencias/programar/historial");
    }
  };

  const breadcrumbItems = [
    { label: "Inicio", href: "/home" },
    { label: "Transferencias", href: "/transferencias" },
    { label: "Programar Transferencias" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={breadcrumbItems} />
        <HideBalancesToggle />
      </div>
      <ScheduleTransferSelectionCard onSelectOption={handleSelectOption} />
    </div>
  );
}
```

---

### 9. Page — New Schedule Form (`/transferencias/programar/nuevo/page.tsx`)

**Component name:** `ProgramarNuevoPage`

**Implementation:**

```tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Breadcrumbs, HideBalancesToggle } from "@/src/molecules";
import { ScheduleTransferForm, ScheduleSuccessModal } from "@/src/organisms";
import { useWelcomeBar, useUIContext } from "@/src/contexts";
import {
  mockScheduleSourceAccounts,
  mockScheduleDestinationAccounts,
} from "@/src/mocks";
import type { ScheduledTransferFormValues } from "@/src/schemas/scheduledTransferSchema";

export default function ProgramarNuevoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBarConfig, clearWelcomeBar } = useWelcomeBar();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setWelcomeBarConfig({
      title: "Programar Nuevo",
      backHref: "/transferencias/programar",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBarConfig, clearWelcomeBar]);

  const handleSubmit = useCallback((data: ScheduledTransferFormValues) => {
    // In production, this would call the API
    console.log("Schedule transfer:", data);
    setShowSuccessModal(true);
  }, []);

  const handleBack = useCallback(() => {
    router.push("/transferencias/programar");
  }, [router]);

  const handleModalAccept = useCallback(() => {
    setShowSuccessModal(false);
    router.push("/transferencias/programar");
  }, [router]);

  const breadcrumbItems = [
    { label: "Inicio", href: "/home" },
    { label: "Programacion", href: "/transferencias/programar" },
    { label: "Programar Nuevo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={breadcrumbItems} />
        <HideBalancesToggle />
      </div>

      <ScheduleTransferForm
        sourceAccounts={mockScheduleSourceAccounts}
        destinationAccounts={mockScheduleDestinationAccounts}
        hideBalances={hideBalances}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />

      <ScheduleSuccessModal
        isOpen={showSuccessModal}
        onAccept={handleModalAccept}
      />
    </div>
  );
}
```

**Key notes:**

- Breadcrumbs use "Programacion" (not "Transferencias") per the design reference
- No stepper is used — this is a single-page form, not a multi-step flow
- The success modal appears after form submission
- On modal accept, navigate back to the selection page

---

### 10. Page — History (`/transferencias/programar/historial/page.tsx`)

**Component name:** `HistorialProgramacionPage`

**Implementation:**

```tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Breadcrumbs, HideBalancesToggle } from "@/src/molecules";
import { ScheduledTransfersTable } from "@/src/organisms";
import { useWelcomeBar, useUIContext } from "@/src/contexts";
import { mockScheduledTransfers } from "@/src/mocks";
import type { ScheduledTransfer } from "@/src/types/scheduledTransfer";

export default function HistorialProgramacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBarConfig, clearWelcomeBar } = useWelcomeBar();
  const [transfers, setTransfers] = useState<ScheduledTransfer[]>(
    mockScheduledTransfers,
  );

  useEffect(() => {
    setWelcomeBarConfig({
      title: "Historial",
      backHref: "/transferencias/programar",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBarConfig, clearWelcomeBar]);

  const handleDelete = useCallback((transferId: string) => {
    // In production, this would call the API and then refresh
    // For now, remove from local state
    setTransfers((prev) => prev.filter((t) => t.id !== transferId));
  }, []);

  const handleExportPDF = useCallback(() => {
    // Presentational — no-op for now
    console.log("Export PDF");
  }, []);

  const handleExportExcel = useCallback(() => {
    // Presentational — no-op for now
    console.log("Export Excel");
  }, []);

  const handleBack = useCallback(() => {
    router.push("/transferencias/programar");
  }, [router]);

  const breadcrumbItems = [
    { label: "Inicio", href: "/home" },
    { label: "Programacion", href: "/transferencias/programar" },
    { label: "Historial" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={breadcrumbItems} />
        <HideBalancesToggle />
      </div>

      <ScheduledTransfersTable
        transfers={transfers}
        hideBalances={hideBalances}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}
```

**Key notes:**

- Breadcrumbs use "Programacion" (not "Transferencias") per the design reference
- Delete action removes transfer from local state (mock behavior)
- Export buttons are no-ops — just log to console
- Consider adding a confirmation dialog before delete (use `window.confirm` or a simple modal)

---

## Index Export Updates

### `src/organisms/index.ts`

Add these exports:

```typescript
export { ScheduleTransferSelectionCard } from "./ScheduleTransferSelectionCard";
export { ScheduleTransferForm } from "./ScheduleTransferForm";
export { ScheduleSuccessModal } from "./ScheduleSuccessModal";
export { ScheduledTransfersTable } from "./ScheduledTransfersTable";
```

### `src/mocks/index.ts`

Add these exports:

```typescript
export {
  TRANSACTION_TYPE_OPTIONS,
  PERIODICITY_OPTIONS,
  mockScheduleSourceAccounts,
  mockScheduleDestinationAccounts,
  mockScheduledTransfers,
} from "./mockScheduledTransferData";
```

---

## Route Structure

```
app/(authenticated)/transferencias/
└── programar/
    ├── page.tsx                    # Selection page (two option cards)
    ├── nuevo/
    │   └── page.tsx                # Form for scheduling new transfer
    └── historial/
        └── page.tsx                # History of scheduled transfers
```

---

## Dynamic Form Behavior

The key interaction on the form page is **conditional field rendering** based on the `periodicity` value:

### Periodicity = "unica" (default)

Fields shown in order:

1. Tipo de Transaccion (select)
2. Fecha de Inicio del Pago (date)
3. Periodicidad (select — "Unica vez")
4. Numero de Pagos (input, optional)
5. Concepto o Descripcion (input)

### Periodicity = "mensual" or "quincenal"

Fields shown in order:

1. Tipo de Transaccion (select)
2. Cuenta Origen (select — with balance display)
3. Cuenta Externa Inscrita (select)
4. Monto (input)
5. Fecha de Inicio del Pago (date)
6. Periodicidad (select — "Mensual" or "Quincenal")
7. Numero de Pagos (input, optional)
8. Concepto o Descripcion (input)

**Transition behavior:**

- When periodicity changes from "unica" to recurring, the additional fields (Cuenta Origen, Cuenta Externa, Monto) appear between the transaction type and date fields
- When periodicity changes from recurring to "unica", clear the additional field values using `setValue("sourceAccountId", "")`, etc.
- Use `watch("periodicity")` to derive `isRecurring` boolean

---

## Validation Rules

| Field               | Rule                                   | Error Message                                                   |
| ------------------- | -------------------------------------- | --------------------------------------------------------------- |
| Tipo de Transaccion | Required                               | "Seleccione un tipo de transaccion"                             |
| Fecha de Inicio     | Required, format dd/mm/aaaa            | "Ingrese la fecha de inicio del pago"                           |
| Periodicidad        | Required                               | "Seleccione la periodicidad"                                    |
| Cuenta Origen       | Required when recurring                | "Seleccione una cuenta origen"                                  |
| Cuenta Externa      | Required when recurring                | "Seleccione una cuenta destino"                                 |
| Monto               | Required when recurring, > 0           | "Ingrese el monto a transferir" / "El monto debe ser mayor a 0" |
| Numero de Pagos     | Optional, positive integer if provided | "Debe ser un numero entero positivo"                            |
| Concepto            | Optional, max 100 chars                | "El concepto no puede exceder 100 caracteres"                   |

---

## Key Patterns to Follow

- All pages are `"use client"` components
- Use `useWelcomeBar()` context to set/clear welcome bar title on mount/unmount
- Use `useUIContext()` for `hideBalances` state
- Use `react-hook-form` with `yupResolver` for form validation
- Use `formatCurrency` and `maskCurrency` from `@/src/utils` for amount display
- Follow existing `FlowOptionCard` pattern for selection cards
- Follow existing `AccountSuccessModal` pattern for success modal
- Follow existing form patterns from other transfer pages for consistent UX
- No sessionStorage needed — the form is single-page with modal confirmation
- Export buttons are presentational (no-op) for now
- Delete action in history should use `window.confirm` for simple confirmation

---

## Accessibility

- All form fields have associated labels via `SelectField` / `FormField` components
- Modal has `role="dialog"`, `aria-modal="true"`, focus trap, escape key handling
- Table uses proper `<thead>` / `<tbody>` structure with scope headers
- Status badges use text (not just color) for state indication
- "Eliminar" actions have descriptive `aria-label` per row (e.g., `Eliminar transferencia a ${destination}`)
- Export buttons are keyboard accessible
- FlowOptionCards have built-in `aria-label` and focus management

---

## Implementation Order

1. **Create types** `src/types/scheduledTransfer.ts`
2. **Create schema** `src/schemas/scheduledTransferSchema.ts`
3. **Create mocks** `src/mocks/mockScheduledTransferData.ts`
4. **Update mock index** `src/mocks/index.ts`
5. **Create organisms** (4 files):
   - `ScheduleTransferSelectionCard.tsx`
   - `ScheduleTransferForm.tsx`
   - `ScheduleSuccessModal.tsx`
   - `ScheduledTransfersTable.tsx`
6. **Update organisms index** `src/organisms/index.ts`
7. **Create pages** (3 route files):
   - `programar/page.tsx` (selection)
   - `programar/nuevo/page.tsx` (form)
   - `programar/historial/page.tsx` (history)
