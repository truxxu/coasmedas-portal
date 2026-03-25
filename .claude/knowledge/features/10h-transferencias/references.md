# Feature 10h - Transferencias: Programar Transferencias

## Overview

The "Programar Transferencias" feature allows users to schedule recurring or one-time transfers/payments. It consists of 3 pages:

1. **Selection Page**: Two option cards — "Programa Nuevo Pago/Transferencia" and "Ver Pagos Programados"
2. **Form Page (Programar Nuevo)**: A dynamic form for scheduling transfers, with fields that change based on selected periodicity. Includes a success confirmation modal.
3. **History Page (Historial)**: A table listing all scheduled transfers with status, export options, and delete actions.

**Route**: `/transferencias/programar`

---

## Figma Design References

| Screen                     | Node ID  | URL                                                                                        |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Selection Page             | 1032:2   | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1032-2)   |
| Form (Unique transfer)     | 1033:112 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1033-112) |
| Form (Monthly transfer)    | 1033:227 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1033-227) |
| Confirmation Modal         | 1033:354 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1033-354) |
| History (Active Transfers) | 1033:488 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1033-488) |

---

## Page 1: Selection Page (`/transferencias/programar/page.tsx`)

### Header

- **Page Title**: "Programar Tranferencias" (20px, medium weight)
- **Back Button**: Arrow left, navigates to `/transferencias`
- **Breadcrumbs**: `Inicio / Transferencias / Programar Transferencias`
- **Hide Balances Toggle**: Top right

### Main Content

- **Section Title**: "Programación de Pagos y Transferencias" (24px, medium, navy `#005066`, centered)
- **Description** (centered, 14px, regular, black):
  - "Automatiza tus transacciones recurrentes y olvídate de las fechas de pago. Define tus condiciones y nosotros nos encargamos del resto."

### Option Cards (2 cards side by side)

Two clickable cards displayed in a horizontal grid:

#### Card 1: Programa Nuevo Pago/Transferencia

- **Icon**: Circle with "+" icon (left side of card)
- **Title**: "Programa Nuevo Pago/Transferencia" (18px, bold, navy `#005066`)
- **Description**: "Crea una nueva programación para tus pagos o transferencias" (14px, regular, `#6B6B6B`)
- **Action**: Navigates to `/transferencias/programar/nuevo`

#### Card 2: Ver Pagos Programados

- **Title**: "Ver Pagos Programados" (18px, bold, navy `#005066`)
- **Description**: "Consulta, edita o elimina tus programaciones existentes." (14px, regular, `#6B6B6B`)
- **Action**: Navigates to `/transferencias/programar/historial`

### Card Styling

- White background, rounded corners (`16px`)
- Border: `1px solid #E4E6EA`
- Padding: `24px`
- Both cards same height, equal width in a 2-column grid

---

## Page 2: Form Page — Programar Nuevo (`/transferencias/programar/nuevo/page.tsx`)

### Header

- **Page Title**: "Programar Nuevo" (20px, medium weight)
- **Back Button**: Arrow left
- **Breadcrumbs**: `Inicio / Programación / Programar Nuevo`
- **Hide Balances Toggle**: Top right

### Main Content Card

- **Card Title**: "Programar Nuevo Pago o Transferencia" (18px, medium, navy `#005066`)
- White card with rounded corners, standard padding

### Form Fields

The form fields change dynamically based on the selected **Periodicidad** (periodicity).

#### Base Fields (Always Shown)

| Field                    | Type            | Label                      | Notes                                        |
| ------------------------ | --------------- | -------------------------- | -------------------------------------------- |
| Tipo de Transacción      | Select/Dropdown | "Tipo de Transacción"      | Placeholder: "Seleccione..."                 |
| Fecha de Inicio del Pago | DateInput       | "Fecha de Inicio del Pago" | Format: dd/mm/aaaa, calendar icon on right   |
| Periodicidad             | Select/Dropdown | "Periodicidad"             | Options: "Única vez", "Mensual", "Quincenal" |

#### When Periodicidad = "Única vez" (Default State)

Shows base fields plus:

| Field                  | Type  | Label                                               | Notes                 |
| ---------------------- | ----- | --------------------------------------------------- | --------------------- |
| Número de Pagos        | Input | "Número de Pagos (dejar en blanco para indefinido)" | Placeholder: "Ej: 12" |
| Concepto o Descripción | Input | "Concepto o Descripción"                            | Text input            |

#### When Periodicidad = "Mensual" or "Quincenal"

Shows base fields plus additional fields for the specific transfer configuration:

| Field                    | Type            | Label                                               | Notes                                                                        |
| ------------------------ | --------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| Cuenta Origen            | Select/Dropdown | "Cuenta Origen"                                     | Shows account with balance (e.g., "Cuenta de Ahorros - Saldos: $ 8.730.500") |
| Cuenta Externa Inscrita  | Select/Dropdown | "Cuenta Externa Inscrita"                           | Shows registered external accounts (e.g., "Cuenta Mamá (\*\*\*6745)")        |
| Monto                    | Input           | "Monto"                                             | Numeric, e.g., "200.000"                                                     |
| Fecha de Inicio del Pago | DateInput       | "Fecha de Inicio del Pago"                          | Format: dd/mm/aaaa, calendar icon                                            |
| Periodicidad             | Select/Dropdown | "Periodicidad"                                      | Already selected "Mensual"                                                   |
| Número de Pagos          | Input           | "Número de Pagos (dejar en blanco para indefinido)" | e.g., "5"                                                                    |
| Concepto o Descripción   | Input           | "Concepto o Descripción"                            | e.g., "Única vez" (text content, not the periodicity)                        |

#### Transaction Type Options

- Transferencia a otros bancos
- Transferencia a mi red (Coopcentral)
- Pago de Obligación

### Form Input Styling

- All inputs: standard `h-11` height, `1px solid #B1B1B1` border, `6px` radius
- Select dropdowns: chevron down icon on right side
- DateInput: calendar icon on right side
- Labels: `14px`, regular, `#353535`
- Input text: `17px`, regular, black
- Placeholder text: `17px`, regular, `#B1B1B1`

### Actions

- **Back Link**: "Volver" (14px, medium, `#004266`, bottom left)
- **Primary Button**: "Programar" (bottom right)
  - **Disabled state**: `#8FE6FF` background, white text
  - **Enabled state**: `#00B8ED` background, white text
  - Border radius: `6px`, shadow: `0px 2px 4px rgba(0,0,0,0.1)`
  - Padding: `9px 28px`, bold `14px`

### Success Confirmation Modal

After successful form submission, a modal overlay appears:

- **Backdrop**: Dark semi-transparent overlay
- **Modal Container**: White background, `15px` rounded corners, centered on screen
- **Title**: "Programación Nueva" (20px, bold, navy `#005066`, centered)
- **Message**: "¡Programación creada con éxito!" (15px, regular, black, centered)
- **Button**: "Aceptar" (blue `#00B8ED`, white text, `6px` radius, shadow, centered)
- **On Accept**: Navigate back to selection page or historial

---

## Page 3: History Page — Historial (`/transferencias/programar/historial/page.tsx`)

### Header

- **Page Title**: "Historial" (20px, medium weight)
- **Back Button**: Arrow left
- **Breadcrumbs**: `Inicio / Programación / Historial`
- **Hide Balances Toggle**: Top right

### Main Content Card

- **Card Title**: "Historial de Pagos Programados" (18px, medium, navy `#005066`)
- White card, rounded corners, standard padding

### Export Buttons (top right of card)

Two buttons aligned to the right of the card title:

- **"Exportar PDF"**: Icon (download/document icon) + text, `13.7px`, medium, black
- **"Exportar Excel"**: Icon (spreadsheet icon) + text, `13.7px`, medium, black
- Both are outlined/text style buttons

### Data Table

| Column Header     | Width | Notes                                                 |
| ----------------- | ----- | ----------------------------------------------------- |
| TIPO              | ~15%  | Transfer type (e.g., "Pago de Obligación")            |
| ORIGEN            | ~10%  | Origin description                                    |
| DESTINO           | ~18%  | Destination name (e.g., "Crédito de Libre Inversión") |
| PRÓXIMA EJECICIÓN | ~13%  | Next execution date (e.g., "30 Nov 2025")             |
| PERIODICIDAD      | ~12%  | Frequency (e.g., "Única vez", "Quincenal", "Mensual") |
| MONTO             | ~10%  | Amount (e.g., "$ 850.000")                            |
| ESTADO            | ~10%  | Status badge                                          |
| ACCIONES          | ~10%  | Action links                                          |

#### Table Header Styling

- Text: `15px`, regular, black
- Background: Light beige/cream `#FFFEF2` (same as page background)
- Bottom border separating header from rows

#### Table Row Styling

- Text: `13.7px`, regular, black
- Rows separated by `1px solid #E4E6EA` dividers
- Alternating or consistent white background

#### Status Badges

- **"2/12"**: Green text `#003500`, indicates progress (2 of 12 payments completed)
- **"Activa"**: Green text `#003500`, indicates active scheduled transfer

#### Actions Column

- **"Eliminar"**: Red text (`red`), `13.7px`, regular — clickable link to delete the scheduled transfer

### Sample Data Rows

| TIPO                         | ORIGEN | DESTINO                    | PRÓXIMA EJECICIÓN | PERIODICIDAD | MONTO     | ESTADO | ACCIONES |
| ---------------------------- | ------ | -------------------------- | ----------------- | ------------ | --------- | ------ | -------- |
| Pago de Obligación           | —      | Crédito de Libre Inversión | 30 Nov 2025       | Única vez    | $ 850.000 | 2/12   | Eliminar |
| Transferencia a mi red       | —      | MARÍA FERENANDA GONZALEZ   | 15 Nov 2025       | Quincenal    | $ 200.000 | Activa | Eliminar |
| Transferencia a otros bancos | —      | Valeria Alvarado           | 20 Sept 2025      | Mensual      | $ 200.000 | Activa | Eliminar |

### Actions (Bottom)

- **Back Link**: "Volver" (14px, medium, `#004266`, bottom left) — navigates to selection page

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

## Components to Create

### New Organisms

| Component                       | Purpose                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| `ScheduleTransferSelectionCard` | Two-option card grid for selection page                              |
| `ScheduleTransferForm`          | Dynamic form for scheduling transfers (fields change by periodicity) |
| `ScheduleSuccessModal`          | Success modal after scheduling                                       |
| `ScheduledTransfersTable`       | Table displaying scheduled transfers history                         |

### Existing Components to Reuse

| Component                | Usage                                                 |
| ------------------------ | ----------------------------------------------------- |
| `BackButton`             | Back arrow navigation                                 |
| `Breadcrumbs`            | Navigation trail                                      |
| `HideBalancesToggle`     | Top right balance visibility toggle                   |
| `Card`                   | Container cards                                       |
| `Select` / `SelectField` | Dropdowns for transaction type, periodicity, accounts |
| `Input` / `FormField`    | Text inputs for amount, concept, number of payments   |
| `DateInput`              | Date picker for start date                            |
| `Button`                 | Primary/secondary action buttons                      |
| `FlowOptionCard`         | Option cards in selection page (or custom)            |
| `SectionTitle`           | Section headings                                      |

---

## Types

### ScheduledTransferFormData

```typescript
interface ScheduledTransferFormData {
  transactionType: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  amount?: string;
  startDate: string; // dd/mm/aaaa
  periodicity: "unica" | "mensual" | "quincenal";
  numberOfPayments?: number; // blank = indefinido
  concept?: string;
}
```

### ScheduledTransfer (for history table)

```typescript
interface ScheduledTransfer {
  id: string;
  type: string; // "Pago de Obligación", "Transferencia a mi red", "Transferencia a otros bancos"
  origin: string;
  destination: string;
  nextExecutionDate: string; // "30 Nov 2025"
  periodicity: string; // "Única vez", "Quincenal", "Mensual"
  amount: number;
  status: string; // "2/12", "Activa"
}
```

### TransactionTypeOption

```typescript
interface TransactionTypeOption {
  value: string;
  label: string;
}
```

### PeriodicityOption

```typescript
type Periodicity = "unica" | "mensual" | "quincenal";

interface PeriodicityOption {
  value: Periodicity;
  label: string; // "Única vez", "Mensual", "Quincenal"
}
```

---

## Validation Rules

### Form Validation (Programar Nuevo)

| Field               | Rule                                                  |
| ------------------- | ----------------------------------------------------- |
| Tipo de Transacción | Required                                              |
| Fecha de Inicio     | Required, must be future date, format dd/mm/aaaa      |
| Periodicidad        | Required                                              |
| Cuenta Origen       | Required (when periodicity is mensual/quincenal)      |
| Cuenta Externa      | Required (when periodicity is mensual/quincenal)      |
| Monto               | Required (when periodicity is mensual/quincenal), > 0 |
| Número de Pagos     | Optional, if provided must be positive integer        |
| Concepto            | Optional, max 100 characters                          |

---

## State Management

Form state is managed locally with `react-hook-form`. No sessionStorage needed since there is no multi-page step flow — the form is a single page with a modal confirmation.

### Modal State

- `showSuccessModal: boolean` — toggled on successful form submission

---

## Mock Data

```typescript
// Transaction type options
export const TRANSACTION_TYPE_OPTIONS: TransactionTypeOption[] = [
  {
    value: "transferencia-otros-bancos",
    label: "Transferencia a otros bancos",
  },
  { value: "transferencia-mi-red", label: "Transferencia a mi red" },
  { value: "pago-obligacion", label: "Pago de Obligación" },
];

// Periodicity options
export const PERIODICITY_OPTIONS: PeriodicityOption[] = [
  { value: "unica", label: "Única vez" },
  { value: "mensual", label: "Mensual" },
  { value: "quincenal", label: "Quincenal" },
];

// Source accounts (reuse pattern from existing transfers)
export const mockScheduleSourceAccounts = [
  {
    id: "savings-1",
    name: "Cuenta de Ahorros",
    accountType: "Cuenta de Ahorros",
    balance: 8730500,
  },
];

// Destination accounts
export const mockScheduleDestinationAccounts = [
  {
    id: "ext-1",
    name: "Cuenta Mamá",
    accountNumber: "***6745",
  },
  {
    id: "ext-2",
    name: "Valeria Alvarado",
    accountNumber: "***1234",
  },
];

// Scheduled transfers for history table
export const mockScheduledTransfers: ScheduledTransfer[] = [
  {
    id: "sched-1",
    type: "Pago de Obligación",
    origin: "",
    destination: "Crédito de Libre Inversión",
    nextExecutionDate: "30 Nov 2025",
    periodicity: "Única vez",
    amount: 850000,
    status: "2/12",
  },
  {
    id: "sched-2",
    type: "Transferencia a mi red",
    origin: "",
    destination: "MARÍA FERENANDA GONZALEZ",
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

## User Flow

### Happy Path — Schedule New Transfer

1. User navigates to `Transferencias → Programar Transferencias`
2. **Selection**: Clicks "Programa Nuevo Pago/Transferencia"
3. **Form**: Selects transaction type, date, periodicity
4. If periodicity is "Mensual" or "Quincenal", additional fields appear (source account, destination, amount)
5. Fills required fields, clicks "Programar"
6. **Modal**: Sees "¡Programación creada con éxito!" success modal
7. Clicks "Aceptar" → returns to selection page

### Happy Path — View Scheduled Transfers

1. User navigates to `Transferencias → Programar Transferencias`
2. **Selection**: Clicks "Ver Pagos Programados"
3. **History**: Sees table of all scheduled transfers
4. Can export as PDF or Excel
5. Can delete a scheduled transfer via "Eliminar" link
6. Clicks "Volver" → returns to selection page

### Error Cases

- Missing required fields → validation errors shown inline
- Delete transfer → confirmation before deletion (optional)

---

## Dynamic Form Behavior

The key interaction on the form page is the **conditional field rendering** based on periodicity:

### Periodicity = "Única vez"

Fields shown:

1. Tipo de Transacción (select)
2. Fecha de Inicio del Pago (date)
3. Periodicidad (select — selected "Única vez")
4. Número de Pagos (input, optional)
5. Concepto o Descripción (input)

### Periodicity = "Mensual" or "Quincenal"

Fields shown:

1. Tipo de Transacción (select)
2. Cuenta Origen (select — with balance)
3. Cuenta Externa Inscrita (select)
4. Monto (input)
5. Fecha de Inicio del Pago (date)
6. Periodicidad (select — selected "Mensual"/"Quincenal")
7. Número de Pagos (input, optional)
8. Concepto o Descripción (input)

The additional fields (Cuenta Origen, Cuenta Externa Inscrita, Monto) appear between the transaction type and date fields when a recurring periodicity is selected.

---

## Sidebar Navigation

The "Programar Transferencias" option should appear as a sub-item under the Transferencias sidebar menu, alongside "Internas" and "Externas". The sidebar shows:

- Transferencias
  - Internas
  - Externas
  - Programar Transferencias ← this feature

---

## Related Features

- **10 - Transferencias (Internas)**: Internal transfer flows — source accounts reused
- **10d - Inscribir Cuentas**: Registered external accounts — destination accounts come from here
- **10e - A Otros Bancos**: External transfer flow — transaction type reference
- **10g - Red Coopcentral**: Network transfer flow — transaction type reference

---

## Accessibility

- All form fields have associated labels
- Modal has proper focus trap and keyboard navigation
- Table has proper `<thead>`/`<tbody>` structure with scope headers
- Status badges use text (not just color) for state indication
- "Eliminar" actions have descriptive aria-labels per row
- Export buttons are keyboard accessible

---

## Notes

- The form page title in breadcrumbs uses "Programación" (not "Transferencias")
- The "Programar" button is disabled until required fields are filled
- The success modal is a simple confirmation — not a full-page result
- History table "ESTADO" column shows progress (e.g., "2/12") or status text ("Activa")
- "Eliminar" action in history table should show a confirmation before deleting
- Export functionality (PDF/Excel) is presentational — mock the buttons without actual file generation
