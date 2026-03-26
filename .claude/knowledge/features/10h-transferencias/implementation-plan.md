# Feature 10h - Transferencias: Programar Transferencias — Implementation Plan

## Overview

Implement the "Programar Transferencias" feature under `/transferencias/programar`. This feature allows users to schedule recurring or one-time transfers/payments. It consists of 3 pages: a selection page with two option cards, a form page for scheduling new transfers (with dynamic fields based on periodicity and a success modal), and a history page with a data table of scheduled transfers.

**Sidebar navigation already includes** "Programar transferencias" sub-item under Transferencias pointing to `/transferencias/programar`.

---

## Step 1: Create TypeScript Types

**Create**: `src/types/scheduledTransfer.ts`

Define 7 interfaces/types:

- `TransactionTypeOption` — value, label
- `Periodicity` — union type: `"unica" | "mensual" | "quincenal"`
- `PeriodicityOption` — value (Periodicity), label
- `ScheduleSourceAccount` — id, name, accountType, balance
- `ScheduleDestinationAccount` — id, name, accountNumber
- `ScheduledTransferFormData` — transactionType, sourceAccountId?, destinationAccountId?, amount?, startDate, periodicity, numberOfPayments?, concept?
- `ScheduledTransfer` — id, type, origin, destination, nextExecutionDate, periodicity, amount, status

**Reference**: See spec section 1 for exact field definitions.

---

## Step 2: Create Yup Validation Schema

**Create**: `src/schemas/scheduledTransferSchema.ts`

Key validation rules:

- `transactionType`: Required
- `startDate`: Required
- `periodicity`: Required, oneOf `["unica", "mensual", "quincenal"]`
- `sourceAccountId`: Required only when periodicity is `"mensual"` or `"quincenal"` (use yup `.when()`)
- `destinationAccountId`: Required only when recurring
- `amount`: Required only when recurring, must be > 0 (parse formatted string)
- `numberOfPayments`: Optional, positive integer if provided
- `concept`: Optional, max 100 chars

Export inferred type: `ScheduledTransferFormValues`

**Reference**: Follow existing `loginSchema.ts` and `accountRegistrationSchema.ts` patterns with `yupResolver`.

---

## Step 3: Create Mock Data

**Create**: `src/mocks/mockScheduledTransferData.ts`

Contents:

- `TRANSACTION_TYPE_OPTIONS` — 3 options: "Transferencia a otros bancos", "Transferencia a mi red", "Pago de Obligación"
- `PERIODICITY_OPTIONS` — 3 options: "Única vez", "Mensual", "Quincenal"
- `mockScheduleSourceAccounts` — 1 savings account (balance: 8,730,500)
- `mockScheduleDestinationAccounts` — 2 registered external accounts ("Cuenta Mamá ***6745", "Valeria Alvarado ***1234")
- `mockScheduledTransfers` — 3 scheduled transfers for history table (mix of Pago de Obligación, Transferencia a mi red, Transferencia a otros bancos)

**Reference**: Mirror `src/mocks/mockExternalTransferData.ts` structure.

---

## Step 4: Update Mock Index Exports

**Modify**: `src/mocks/index.ts`

Add exports:

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

## Step 5: Create Organism — ScheduleTransferSelectionCard

**Create**: `src/organisms/ScheduleTransferSelectionCard.tsx`

**Clone from**: `InternasFlowGrid.tsx` / `ExternasFlowGrid.tsx` pattern

**Props interface:**

```typescript
interface ScheduleTransferSelectionCardProps {
  onSelectOption: (option: "nuevo" | "historial") => void;
}
```

**Layout:**

- White card container with `rounded-2xl p-8 shadow-sm`
- Centered header: title "Programación de Pagos y Transferencias" (24px, medium, navy) + description paragraph
- 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-4`) with 2 `FlowOptionCard` components

**Card 1**: "Programa Nuevo Pago/Transferencia"

- Custom inline SVG circle with "+" icon (40×40, stroke `#005066`)
- Description: "Crea una nueva programación para tus pagos o transferencias"
- onClick: `onSelectOption("nuevo")`

**Card 2**: "Ver Pagos Programados"

- No custom icon (use default FlowOptionCard)
- Description: "Consulta, edita o elimina tus programaciones existentes."
- onClick: `onSelectOption("historial")`

---

## Step 6: Create Organism — ScheduleTransferForm

**Create**: `src/organisms/ScheduleTransferForm.tsx`

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

**Key implementation details:**

- Uses `useForm<ScheduledTransferFormValues>` with `yupResolver(scheduledTransferSchema)`
- Watches `periodicity` field → derives `isRecurring` boolean
- Conditional rendering: when `isRecurring`, show source account, destination account, and amount fields between transaction type and date fields
- When periodicity changes from recurring to "unica", clear extra field values via `setValue`
- Source account select format: `"Cuenta de Ahorros - Saldos: $ 8.730.500"` (use `formatCurrency`)
- Destination account select format: `"Cuenta Mamá (***6745)"`
- "Programar" button disabled when `formState.isValid` is false

**Form field order (always visible):**

1. Tipo de Transacción (SelectField)
2. _[Conditional: Cuenta Origen, Cuenta Externa Inscrita, Monto — only when recurring]_
3. Fecha de Inicio del Pago (DateInput)
4. Periodicidad (SelectField)
5. Número de Pagos (FormField, optional)
6. Concepto o Descripción (FormField)

**Button styling:**

- Enabled: `bg-[#00B8ED] text-white rounded-md shadow-sm px-7 py-2 text-sm font-bold`
- Disabled: `bg-[#8FE6FF] text-white rounded-md px-7 py-2 text-sm font-bold cursor-not-allowed`

**Actions row:** "Volver" text link (left) + "Programar" button (right), `flex items-center justify-between pt-4`

---

## Step 7: Create Organism — ScheduleSuccessModal

**Create**: `src/organisms/ScheduleSuccessModal.tsx`

**Clone from**: `AccountSuccessModal.tsx` pattern

**Props interface:**

```typescript
interface ScheduleSuccessModalProps {
  isOpen: boolean;
  onAccept: () => void;
}
```

**Implementation:**

- Backdrop: `fixed inset-0 z-50 flex items-center justify-center` with `bg-black/50` overlay
- Modal container: `relative bg-white rounded-[15px] p-8 max-w-md w-full mx-4`
- Title: "Programación Nueva" (20px, bold, navy `#005066`, centered)
- Message: "¡Programación creada con éxito!" (15px, regular, black, centered)
- Single "Aceptar" button centered, blue `#00B8ED` with white text
- Accessibility: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, escape key closes
- Body scroll prevention: `document.body.style.overflow = "hidden"` on mount, restore on unmount
- Auto-focus "Aceptar" button on open

---

## Step 8: Create Organism — ScheduledTransfersTable

**Create**: `src/organisms/ScheduledTransfersTable.tsx`

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

- Card container with `space-y-6 p-8`
- Header: title "Historial de Pagos Programados" (left) + export buttons (right)
- Export buttons: "Exportar PDF" and "Exportar Excel" with small inline SVG icons, `text-[13.7px] font-medium text-black`
- Responsive table wrapped in `overflow-x-auto`

**Table structure:**

- 8 columns: TIPO, ORIGEN, DESTINO, PRÓXIMA EJECUCIÓN, PERIODICIDAD, MONTO, ESTADO, ACCIONES
- Header: `text-[15px] font-normal text-black`, transparent background, bottom border
- Rows: `text-[13.7px] text-black`, separated by `1px solid #E4E6EA`
- MONTO column: uses `hideBalances ? maskCurrency() : formatCurrency(transfer.amount)`
- ESTADO column: green text `#003500` (for both progress "2/12" and "Activa")
- ACCIONES column: "Eliminar" link in red text with `aria-label` per row

**Empty state:** Centered text "No hay pagos programados" when `transfers.length === 0`

**Footer:** "Volver" text link, `text-sm font-medium text-[#004266] hover:underline`

---

## Step 9: Update Organism Index Exports

**Modify**: `src/organisms/index.ts`

Add 4 new exports:

```typescript
export { ScheduleTransferSelectionCard } from "./ScheduleTransferSelectionCard";
export { ScheduleTransferForm } from "./ScheduleTransferForm";
export { ScheduleSuccessModal } from "./ScheduleSuccessModal";
export { ScheduledTransfersTable } from "./ScheduledTransfersTable";
```

---

## Step 10: Create Page — Selection (`/transferencias/programar/page.tsx`)

**Create**: `app/(authenticated)/transferencias/programar/page.tsx`

**Clone from**: `app/(authenticated)/transferencias/internas/page.tsx` or `externas/page.tsx` pattern

**Component name:** `ProgramarTransferenciasPage`

**Key details:**

- `"use client"` component
- WelcomeBar title: `"Programar Transferencias"`, backHref: `"/transferencias"`
- Breadcrumbs: `["Inicio", "Transferencias", "Programar Transferencias"]`
- Renders `ScheduleTransferSelectionCard` with `onSelectOption` handler
- Navigation: `"nuevo"` → `/transferencias/programar/nuevo`, `"historial"` → `/transferencias/programar/historial`
- Header row: `Breadcrumbs` (left) + `HideBalancesToggle` (right)

---

## Step 11: Create Page — New Schedule Form (`/transferencias/programar/nuevo/page.tsx`)

**Create**: `app/(authenticated)/transferencias/programar/nuevo/page.tsx`

**Component name:** `ProgramarNuevoPage`

**Key details:**

- `"use client"` component
- WelcomeBar title: `"Programar Nuevo"`, backHref: `"/transferencias/programar"`
- Breadcrumbs: `["Inicio", "Programación", "Programar Nuevo"]` (note: "Programación" not "Transferencias")
- Renders `ScheduleTransferForm` with mock data + `ScheduleSuccessModal`
- Local state: `showSuccessModal: boolean`
- On form submit: set `showSuccessModal = true`
- On modal accept: set `showSuccessModal = false` + navigate to `/transferencias/programar`
- Uses `useUIContext()` for `hideBalances`
- No stepper — this is a single-page form, not a multi-step flow
- No sessionStorage needed

---

## Step 12: Create Page — History (`/transferencias/programar/historial/page.tsx`)

**Create**: `app/(authenticated)/transferencias/programar/historial/page.tsx`

**Component name:** `HistorialProgramacionPage`

**Key details:**

- `"use client"` component
- WelcomeBar title: `"Historial"`, backHref: `"/transferencias/programar"`
- Breadcrumbs: `["Inicio", "Programación", "Historial"]` (note: "Programación" not "Transferencias")
- Local state: `transfers` initialized from `mockScheduledTransfers`
- Delete handler: removes transfer from local state (use `window.confirm` for confirmation)
- Export PDF/Excel handlers: no-ops (console.log)
- Back handler: navigate to `/transferencias/programar`
- Uses `useUIContext()` for `hideBalances`

---

## Summary Checklist

| Step | Action                         | Files                                                    |
| ---- | ------------------------------ | -------------------------------------------------------- |
| 1    | Create types                   | Create `src/types/scheduledTransfer.ts`                  |
| 2    | Create schema                  | Create `src/schemas/scheduledTransferSchema.ts`          |
| 3    | Create mocks                   | Create `src/mocks/mockScheduledTransferData.ts`          |
| 4    | Update mock index              | Modify `src/mocks/index.ts`                              |
| 5    | Create selection card organism | Create `src/organisms/ScheduleTransferSelectionCard.tsx` |
| 6    | Create form organism           | Create `src/organisms/ScheduleTransferForm.tsx`          |
| 7    | Create success modal organism  | Create `src/organisms/ScheduleSuccessModal.tsx`          |
| 8    | Create history table organism  | Create `src/organisms/ScheduledTransfersTable.tsx`       |
| 9    | Update organism index          | Modify `src/organisms/index.ts`                          |
| 10   | Create selection page          | Create `app/.../programar/page.tsx`                      |
| 11   | Create form page               | Create `app/.../programar/nuevo/page.tsx`                |
| 12   | Create history page            | Create `app/.../programar/historial/page.tsx`            |

**Total**: 10 new files created, 2 existing files modified (2 index updates)

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

1. Tipo de Transacción (select)
2. Fecha de Inicio del Pago (date)
3. Periodicidad (select — "Única vez")
4. Número de Pagos (input, optional)
5. Concepto o Descripción (input)

### Periodicity = "mensual" or "quincenal"

Fields shown in order:

1. Tipo de Transacción (select)
2. Cuenta Origen (select — with balance display)
3. Cuenta Externa Inscrita (select)
4. Monto (input)
5. Fecha de Inicio del Pago (date)
6. Periodicidad (select — "Mensual" or "Quincenal")
7. Número de Pagos (input, optional)
8. Concepto o Descripción (input)

**Transition behavior:**

- When periodicity changes from "unica" to recurring, additional fields (Cuenta Origen, Cuenta Externa, Monto) appear between transaction type and date fields
- When periodicity changes from recurring to "unica", clear additional field values using `setValue("sourceAccountId", "")`, etc.
- Use `watch("periodicity")` to derive `isRecurring` boolean

---

## Validation Rules

| Field               | Rule                                   | Error Message                                                   |
| ------------------- | -------------------------------------- | --------------------------------------------------------------- |
| Tipo de Transacción | Required                               | "Seleccione un tipo de transacción"                             |
| Fecha de Inicio     | Required, format dd/mm/aaaa            | "Ingrese la fecha de inicio del pago"                           |
| Periodicidad        | Required                               | "Seleccione la periodicidad"                                    |
| Cuenta Origen       | Required when recurring                | "Seleccione una cuenta origen"                                  |
| Cuenta Externa      | Required when recurring                | "Seleccione una cuenta destino"                                 |
| Monto               | Required when recurring, > 0           | "Ingrese el monto a transferir" / "El monto debe ser mayor a 0" |
| Número de Pagos     | Optional, positive integer if provided | "Debe ser un número entero positivo"                            |
| Concepto            | Optional, max 100 chars                | "El concepto no puede exceder 100 caracteres"                   |

---

## Key Patterns to Follow

- All pages are `"use client"` components
- Use `useWelcomeBar()` context to set/clear welcome bar title on mount/unmount
- Use `useUIContext()` for `hideBalances` state
- Use `react-hook-form` with `yupResolver` for form validation
- Use `formatCurrency` and `maskCurrency` from `@/src/utils` for amount display
- Follow existing `FlowOptionCard` usage from `InternasFlowGrid` / `ExternasFlowGrid` for selection cards
- Follow existing `AccountSuccessModal` pattern for success modal
- No sessionStorage needed — the form is single-page with modal confirmation
- Export buttons in history are presentational (no-op) for now
- Delete action in history should use `window.confirm` for simple confirmation

---

## Accessibility

- All form fields have associated labels via `SelectField` / `FormField` components
- Modal has `role="dialog"`, `aria-modal="true"`, focus trap, escape key handling
- Table uses proper `<thead>` / `<tbody>` structure
- Status badges use text (not just color) for state indication
- "Eliminar" actions have descriptive `aria-label` per row (e.g., `Eliminar transferencia a ${destination}`)
- Export buttons are keyboard accessible
- FlowOptionCards have built-in focus management
