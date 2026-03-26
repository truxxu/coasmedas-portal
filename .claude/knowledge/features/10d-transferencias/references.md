# Feature 10d - Transferencias: Inscribir Cuentas

## Overview

The "Inscribir Cuentas" (Register Accounts) page allows users to register external bank accounts as destinations for transfers. This page combines a dynamic registration form with a list of already registered accounts, including edit and delete functionality.

**Route**: `/transferencias/inscribir-cuentas`

## Figma Design References

| Screen                                    | Node ID  | URL                                                                                        |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Form - Red Coopcentral (Persona Jurídica) | 3349-9   | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-9)   |
| Form - Otro Banco ACH (Persona Natural)   | 3349-10  | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3349-10)  |
| Register Success Modal                    | 810-1632 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-1632) |
| Edit Success Modal                        | 3403-511 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3403-511) |
| Delete Confirmation Modal                 | 3403-915 | [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=3403-915) |

---

## Page Layout

### Header Section

- **Back Button**: Arrow left, navigates to previous page
- **Page Title**: "Inscribir Cuentas" (20px, medium weight)
- **Breadcrumbs**: `Inicio / Transferencias / Inscribir Cuenta`
- **Hide Balances Toggle**: Top right corner

### Main Content (Two Sections)

#### Section 1: Registration Form Card

- **Card Title**: "Inscripción de Cuentas Externas" (21px, bold, navy `#005066`)
- **Description**: "Inscribe las cuentas de destino para tus transferencias a otros bancos y a la red Coopcentral."
- **Dynamic Form**: Fields change based on account type and holder type selection

#### Section 2: Registered Accounts List

- **Section Title**: "Cuentas Inscritas" (18px, bold, navy `#005066`)
- **List of RegisteredAccountItem components**
- Each item has edit and delete action buttons

---

## Form Fields (Dynamic)

### Account Type Selection

**Field**: "Tipo de Cuenta a Inscribir"
**Type**: Radio Button Group (horizontal)
**Options**:

- `Otro Banco (ACH)` - For transfers to other banks via ACH
- `Red Coopcentral` - For transfers within Coopcentral network

### Conditional Fields Based on Account Type

#### When "Otro Banco (ACH)" is selected:

| Field              | Type            | Label                | Placeholder    |
| ------------------ | --------------- | -------------------- | -------------- |
| Entidad Financiera | Select/Dropdown | "Entidad Financiera" | "Seleccione.." |

**Bank Options** (example):

- Bancolombia
- Davivienda
- Other Colombian banks...

#### When "Red Coopcentral" is selected:

| Field       | Type            | Label         | Placeholder    |
| ----------- | --------------- | ------------- | -------------- |
| Cooperativa | Select/Dropdown | "Cooperativa" | "Seleccione.." |

**Cooperativa Options** (example):

- Coopetraban
- Other Coopcentral network cooperatives...

### Common Fields (Always Visible)

| Field            | Type            | Label              | Placeholder |
| ---------------- | --------------- | ------------------ | ----------- |
| Tipo de Cuenta   | Select/Dropdown | "Tipo de Cuenta"   | -           |
| Número de Cuenta | Text Input      | "Número de Cuenta" | -           |

**Account Type Options**:

- Ahorros (Savings)
- Corriente (Checking)

### Holder Type Selection

**Field**: "Tipo de Titular"
**Type**: Radio Button Group (horizontal)
**Options**:

- `Persona Natural` - Individual person
- `Persona Jurídica` - Legal entity/Company

### Conditional Fields Based on Holder Type

#### When "Persona Natural" is selected:

| Field                 | Type       | Label                   | Placeholder |
| --------------------- | ---------- | ----------------------- | ----------- |
| Nombre del Titular    | Text Input | "Nombre del Titular"    | -           |
| Apellidos del Titular | Text Input | "Apellidos del Titular" | -           |

_Note: Two side-by-side fields for first name and last name_

#### When "Persona Jurídica" is selected:

| Field                    | Type       | Label                      | Placeholder |
| ------------------------ | ---------- | -------------------------- | ----------- |
| Razón Social del Titular | Text Input | "Razón Social del Titular" | -           |

_Note: Single full-width field for company name_

### Document Fields (Always Visible)

| Field                 | Type            | Label                                | Placeholder       |
| --------------------- | --------------- | ------------------------------------ | ----------------- |
| Tipo de Documento     | Select/Dropdown | "Tipo de Documento"                  | "Seleccione.."    |
| Documento del Titular | Text Input      | "Documento del Titular (C.C. o NIT)" | -                 |
| Alias de la cuenta    | Text Input      | "Alias de la cuenta"                 | "Ej: Cuenta Mamá" |

**Document Type Options**:

- Cédula de Ciudadanía (CC)
- NIT
- Cédula de Extranjería (CE)
- Pasaporte

### Form Actions

- **Primary Button**: "Inscribir Cuenta" (or "Editar Cuenta" in edit mode)
- **Back Link**: "Volver" (text link, bottom of page)

---

## Registered Accounts List Item

Each registered account is displayed as a card with the following structure:

### Card Content

- **Alias** (title): Bold, 18px, navy `#005066` (e.g., "Cuenta Mamá")
- **Bank Badge**: Small pill/badge showing bank name
  - Background colors vary by bank (dark rounded badge)
  - White text, 10px font
  - Examples: "Bancolombia", "Davivienda", "Coopcentral"
- **Account Info**: "Ahorros - \*\*\*\*9-01" (masked account number)
- **Holder Name**: "MARÍA GONZALEZ" (uppercase)

### Card Actions (Right side)

- **Edit Button**: Pencil icon - Opens edit mode in form
- **Delete Button**: Trash icon (red) - Opens delete confirmation modal

### Card Styling

- White background
- Border: `1px solid #E4E6EA`
- Border radius: `8px`
- Padding: `16px`
- Margin bottom: `12px` between cards

---

## Modals

### 1. Register Success Modal

**Trigger**: After successful account registration

**Content**:

- **Icon**: Green checkmark circle (success icon)
- **Title**: "Cuenta Inscrita con Éxito" (20px, bold, navy)
- **Message**: "Su cuenta externa ha sido inscrita con éxito. Por favor revise en su lista de cuentas inscritas."
- **Actions**:
  - Primary Button: "Volver a Inicio" (blue `#00B8ED`)
  - Secondary Button: "Cancelar" (gray `#E4E6EA`)

**Modal Styling**:

- Background: White
- Border radius: `15px`
- Max width: ~460px
- Centered on screen
- Backdrop: Black with 50% opacity

### 2. Edit Success Modal

**Trigger**: After successful account edit

**Content**:

- **Icon**: Green checkmark circle (success icon)
- **Title**: "Cuenta Editada con Éxito" (20px, bold, navy)
- **Message**: "Su cuenta externa ha sido editada con éxito. Por favor revise en su lista de cuentas inscritas."
- **Actions**:
  - Primary Button: "Aceptar" (blue `#00B8ED`)

**Modal Styling**: Same as Register Success Modal

### 3. Delete Confirmation Modal

**Trigger**: When user clicks delete icon on a registered account

**Content**:

- **Title**: "Borrar cuenta inscrita" (20px, bold, navy)
- **Message**: "¿Está seguro que desea borrar esta cuenta?"
- **Actions**:
  - Secondary Button: "Cancelar" (gray `#E4E6EA`, left)
  - Primary Button: "Aceptar" (blue `#00B8ED`, right)

**Modal Styling**:

- Background: White
- Border radius: `15px`
- Max width: ~460px
- Centered on screen
- Backdrop: Black with 50% opacity

---

## Component Breakdown

### New Components to Create

#### Atoms

- None required (use existing)

#### Molecules

- `AccountTypeRadioGroup` - Radio group for account type selection (Otro Banco/Red Coopcentral)
- `HolderTypeRadioGroup` - Radio group for holder type (Persona Natural/Jurídica)
- `BankBadge` - Small badge showing bank name with colored background

#### Organisms

- `AccountRegistrationForm` - Dynamic registration form with all conditional logic
- `RegisteredAccountsList` - List container for registered accounts
- `RegisteredAccountCard` - Individual registered account card with actions
- `AccountSuccessModal` - Reusable success modal (for register/edit)
- `AccountDeleteConfirmModal` - Delete confirmation modal

### Existing Components to Reuse

- `BackButton` - Back navigation
- `Breadcrumbs` - Navigation breadcrumbs
- `HideBalancesToggle` - Balance visibility toggle
- `Card` - Container card
- `Button` - Primary/Secondary buttons
- `Input` - Text inputs
- `Select` - Dropdown selects
- `Label` - Form labels
- `ErrorMessage` - Form validation errors

---

## State Management

### Form State

```typescript
interface AccountRegistrationForm {
  accountType: "otro_banco" | "red_coopcentral";
  // For Otro Banco (ACH)
  entidadFinanciera?: string;
  // For Red Coopcentral
  cooperativa?: string;
  // Common fields
  tipoCuenta: "ahorros" | "corriente";
  numeroCuenta: string;
  tipoTitular: "persona_natural" | "persona_juridica";
  // For Persona Natural
  nombreTitular?: string;
  apellidosTitular?: string;
  // For Persona Juridica
  razonSocial?: string;
  // Document fields
  tipoDocumento: string;
  documentoTitular: string;
  alias: string;
}
```

### Page State

```typescript
interface PageState {
  mode: "register" | "edit";
  editingAccountId: string | null;
  registeredAccounts: RegisteredAccount[];
  showSuccessModal: boolean;
  showDeleteModal: boolean;
  accountToDelete: string | null;
  successModalType: "register" | "edit";
}
```

### Registered Account Type

```typescript
interface RegisteredAccount {
  id: string;
  alias: string;
  bankName: string;
  bankType: "otro_banco" | "red_coopcentral";
  accountType: "ahorros" | "corriente";
  accountNumberMasked: string;
  holderName: string;
  holderType: "persona_natural" | "persona_juridica";
}
```

---

## User Flows

### Register New Account

1. User fills out the dynamic form
2. Form validates on submit
3. On success: Show "Cuenta Inscrita con Éxito" modal
4. User clicks "Volver a Inicio" or "Cancelar"
5. Modal closes, new account appears in registered list

### Edit Existing Account

1. User clicks edit (pencil) icon on a registered account
2. Form populates with existing account data
3. Form title changes to reflect edit mode
4. Submit button changes to "Editar Cuenta"
5. On success: Show "Cuenta Editada con Éxito" modal
6. User clicks "Aceptar"
7. Modal closes, account list refreshes

### Delete Account

1. User clicks delete (trash) icon on a registered account
2. "Borrar cuenta inscrita" confirmation modal appears
3. User clicks "Aceptar" to confirm or "Cancelar" to abort
4. On confirm: Account removed from list
5. Modal closes

---

## Validation Rules

### Required Fields

- All fields are required
- Conditional fields only required when their parent condition is met

### Field Validations

- **Número de Cuenta**: Numeric only, length varies by bank
- **Documento del Titular**: Numeric only, 6-12 digits
- **Alias**: Max 50 characters, alphanumeric with spaces

### Error States

- Red border (`#FF0D00`) on invalid fields
- Error message below field
- Form cannot submit with validation errors

---

## Styling Notes

### Form Card

- Background: White `#FFFFFF`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`

### Radio Buttons

- Size: `16px × 16px`
- Selected: Inner circle with `#00B8ED` background
- Border: `1px solid #B1B1B1`

### Input Fields

- Height: `44px`
- Border: `1px solid #B1B1B1`
- Border radius: `6px`
- Focus: `2px solid #00B8ED`

### Primary Button

- Background: `#00B8ED`
- Text: White
- Border radius: `6px`
- Height: `40px`
- Full width in form context

### Secondary/Cancel Button

- Background: `#E4E6EA`
- Text: `#111827`
- Border radius: `6px`

---

## Accessibility

- All form fields have associated labels
- Radio groups have proper `role="radiogroup"` and `aria-labelledby`
- Modal has `role="dialog"` and `aria-modal="true"`
- Focus trapped in modal when open
- Delete action requires confirmation (destructive action)
- Error messages linked to inputs via `aria-describedby`

---

## Mock Data

```typescript
const mockRegisteredAccounts: RegisteredAccount[] = [
  {
    id: "1",
    alias: "Cuenta Mamá",
    bankName: "Bancolombia",
    bankType: "otro_banco",
    accountType: "ahorros",
    accountNumberMasked: "****9-01",
    holderName: "MARÍA GONZALEZ",
    holderType: "persona_natural",
  },
  {
    id: "2",
    alias: "Cuenta Arriendo",
    bankName: "Davivienda",
    bankType: "otro_banco",
    accountType: "ahorros",
    accountNumberMasked: "****2-10",
    holderName: "INMOBILIARIA XYZ",
    holderType: "persona_juridica",
  },
  {
    id: "3",
    alias: "Coopcentral Pedro",
    bankName: "Coopcentral",
    bankType: "red_coopcentral",
    accountType: "ahorros",
    accountNumberMasked: "****5-55",
    holderName: "PEDRO PÉREZ",
    holderType: "persona_natural",
  },
  {
    id: "4",
    alias: "Restaurante Almuerzos",
    bankName: "Bancolombia",
    bankType: "otro_banco",
    accountType: "ahorros",
    accountNumberMasked: "****3-45",
    holderName: "DANIELA ALVARADO",
    holderType: "persona_natural",
  },
];

const mockBanks = [
  { value: "bancolombia", label: "Bancolombia" },
  { value: "davivienda", label: "Davivienda" },
  { value: "bbva", label: "BBVA" },
  { value: "banco_bogota", label: "Banco de Bogotá" },
  // ... more banks
];

const mockCooperativas = [
  { value: "coopetraban", label: "Coopetraban" },
  { value: "coopcentral", label: "Coopcentral" },
  // ... more cooperativas
];

const mockDocumentTypes = [
  { value: "cc", label: "Cédula de Ciudadanía" },
  { value: "nit", label: "NIT" },
  { value: "ce", label: "Cédula de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
];

const mockAccountTypes = [
  { value: "ahorros", label: "Ahorros" },
  { value: "corriente", label: "Corriente" },
];
```

---

## File Structure (Proposed)

```
app/(authenticated)/transferencias/
└── inscribir-cuentas/
    └── page.tsx

src/
├── atoms/
│   └── (use existing)
├── molecules/
│   ├── AccountTypeRadioGroup.tsx
│   ├── HolderTypeRadioGroup.tsx
│   ├── BankBadge.tsx
│   └── index.ts (update exports)
├── organisms/
│   ├── AccountRegistrationForm.tsx
│   ├── RegisteredAccountsList.tsx
│   ├── RegisteredAccountCard.tsx
│   ├── AccountSuccessModal.tsx
│   ├── AccountDeleteConfirmModal.tsx
│   └── index.ts (update exports)
├── types/
│   └── account-registration.ts
└── mocks/
    └── account-registration.ts
```

---

## Related Features

- **10a - Transferencias Internas**: `/transferencias/internas` - Internal transfers between own accounts
- **10b - Transferencias Entre Mis Cuentas**: `/transferencias/internas/entre-mis-cuentas`
- **10c - Transferencias Cuentas Mi Red**: `/transferencias/internas/cuentas-mi-red` - Coopcentral network transfers

---

## Notes

- The form dynamically shows/hides fields based on radio button selections
- Bank badges use different background colors based on the bank (visual differentiation)
- Edit mode reuses the same form component with pre-populated data
- Newly registered account should appear at the bottom of the list
- After successful registration/edit, the form should reset
- Delete operation should show confirmation before removing account
