# Feature 10d - Transferencias: Inscribir Cuentas

## Specification Document

**Version**: 1.0
**Status**: Ready for Implementation
**Related Feature**: 10-transferencias (parent)

---

## 1. Overview

This feature implements the "Inscribir Cuentas" (Register Accounts) page that allows users to register external bank accounts as destinations for transfers. The page combines a dynamic registration form with a list of already registered accounts, including edit and delete functionality.

### User Story

> As an associate, I want to register external bank accounts (from other banks or Coopcentral network) as transfer destinations, so I can easily make transfers to these accounts in the future without re-entering the details each time.

### Business Rules

1. Users can register accounts from two types: "Otro Banco (ACH)" or "Red Coopcentral"
2. Account holders can be "Persona Natural" (individual) or "Persona Juridica" (company)
3. Each registered account requires an alias for easy identification
4. Users can edit or delete previously registered accounts
5. Delete actions require confirmation before execution
6. All form fields are required (conditional fields only when their parent condition is met)

---

## 2. Route Structure

```
/transferencias/inscribir-cuentas → Registration form + Registered accounts list
```

### Directory Structure

```
app/(authenticated)/transferencias/
└── inscribir-cuentas/
    └── page.tsx                 # Registration form + Registered accounts list
```

---

## 3. Type Definitions

Create new types in `src/types/accountRegistration.ts`:

```typescript
/**
 * Account type options for registration
 */
export type AccountBankType = "otro_banco" | "red_coopcentral";

/**
 * Account holder type options
 */
export type HolderType = "persona_natural" | "persona_juridica";

/**
 * Account type (savings/checking)
 */
export type AccountType = "ahorros" | "corriente";

/**
 * Document type options
 */
export type DocumentType = "cc" | "nit" | "ce" | "pasaporte";

/**
 * Bank option for dropdown
 */
export interface BankOption {
  value: string;
  label: string;
}

/**
 * Cooperativa option for dropdown
 */
export interface CooperativaOption {
  value: string;
  label: string;
}

/**
 * Document type option for dropdown
 */
export interface DocumentTypeOption {
  value: DocumentType;
  label: string;
}

/**
 * Account type option for dropdown
 */
export interface AccountTypeOption {
  value: AccountType;
  label: string;
}

/**
 * Registration form data
 */
export interface AccountRegistrationFormData {
  // Account type selection
  accountType: AccountBankType;
  // For Otro Banco (ACH)
  entidadFinanciera?: string;
  // For Red Coopcentral
  cooperativa?: string;
  // Common fields
  tipoCuenta: AccountType;
  numeroCuenta: string;
  // Holder type selection
  tipoTitular: HolderType;
  // For Persona Natural
  nombreTitular?: string;
  apellidosTitular?: string;
  // For Persona Juridica
  razonSocial?: string;
  // Document fields
  tipoDocumento: DocumentType;
  documentoTitular: string;
  alias: string;
}

/**
 * Registered account data
 */
export interface RegisteredAccount {
  id: string;
  alias: string;
  bankName: string;
  bankType: AccountBankType;
  accountType: AccountType;
  accountNumberMasked: string;
  holderName: string;
  holderType: HolderType;
  // Full data for edit mode
  fullData?: AccountRegistrationFormData;
}

/**
 * Page state management
 */
export interface AccountRegistrationPageState {
  mode: "register" | "edit";
  editingAccountId: string | null;
  registeredAccounts: RegisteredAccount[];
  showSuccessModal: boolean;
  showDeleteModal: boolean;
  accountToDelete: string | null;
  successModalType: "register" | "edit";
}
```

Update `src/types/index.ts` to export these types.

---

## 4. Mock Data

Create mock data in `src/mocks/mockAccountRegistrationData.ts`:

```typescript
import type {
  RegisteredAccount,
  BankOption,
  CooperativaOption,
  DocumentTypeOption,
  AccountTypeOption,
} from "@/src/types/accountRegistration";

/**
 * Mock registered accounts
 */
export const mockRegisteredAccounts: RegisteredAccount[] = [
  {
    id: "1",
    alias: "Cuenta Mama",
    bankName: "Bancolombia",
    bankType: "otro_banco",
    accountType: "ahorros",
    accountNumberMasked: "****9-01",
    holderName: "MARIA GONZALEZ",
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
    holderName: "PEDRO PEREZ",
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

/**
 * Mock bank options for Otro Banco (ACH)
 */
export const mockBanks: BankOption[] = [
  { value: "bancolombia", label: "Bancolombia" },
  { value: "davivienda", label: "Davivienda" },
  { value: "bbva", label: "BBVA" },
  { value: "banco_bogota", label: "Banco de Bogota" },
  { value: "banco_occidente", label: "Banco de Occidente" },
  { value: "banco_popular", label: "Banco Popular" },
  { value: "banco_av_villas", label: "Banco AV Villas" },
  { value: "scotiabank_colpatria", label: "Scotiabank Colpatria" },
];

/**
 * Mock cooperativa options for Red Coopcentral
 */
export const mockCooperativas: CooperativaOption[] = [
  { value: "coopetraban", label: "Coopetraban" },
  { value: "coopcentral", label: "Coopcentral" },
  { value: "confiar", label: "Confiar" },
  { value: "coofinep", label: "Coofinep" },
  { value: "cotrafa", label: "Cotrafa" },
];

/**
 * Mock document type options
 */
export const mockDocumentTypes: DocumentTypeOption[] = [
  { value: "cc", label: "Cedula de Ciudadania" },
  { value: "nit", label: "NIT" },
  { value: "ce", label: "Cedula de Extranjeria" },
  { value: "pasaporte", label: "Pasaporte" },
];

/**
 * Mock account type options
 */
export const mockAccountTypes: AccountTypeOption[] = [
  { value: "ahorros", label: "Ahorros" },
  { value: "corriente", label: "Corriente" },
];
```

Update `src/mocks/index.ts` to export these mocks.

---

## 5. Components

### 5.1 New Molecule: AccountTypeRadioGroup

Location: `src/molecules/AccountTypeRadioGroup.tsx`

Radio group for selecting account bank type (Otro Banco/Red Coopcentral).

```typescript
interface AccountTypeRadioGroupProps {
  value: "otro_banco" | "red_coopcentral";
  onChange: (value: "otro_banco" | "red_coopcentral") => void;
  disabled?: boolean;
}
```

**Layout:**
- Horizontal flex layout with gap-6 between options
- Each option: Radio input + label text
- Radio size: 16px x 16px
- Selected state: Inner circle `#00B8ED` background
- Border: `1px solid #B1B1B1`
- Label: 14px, Regular, `#111827`

**Options:**
- `Otro Banco (ACH)` - value: `otro_banco`
- `Red Coopcentral` - value: `red_coopcentral`

### 5.2 New Molecule: HolderTypeRadioGroup

Location: `src/molecules/HolderTypeRadioGroup.tsx`

Radio group for selecting holder type (Persona Natural/Juridica).

```typescript
interface HolderTypeRadioGroupProps {
  value: "persona_natural" | "persona_juridica";
  onChange: (value: "persona_natural" | "persona_juridica") => void;
  disabled?: boolean;
}
```

**Layout:**
- Horizontal flex layout with gap-6 between options
- Same styling as AccountTypeRadioGroup

**Options:**
- `Persona Natural` - value: `persona_natural`
- `Persona Juridica` - value: `persona_juridica`

### 5.3 New Molecule: BankBadge

Location: `src/molecules/BankBadge.tsx`

Small badge showing bank name with colored background.

```typescript
interface BankBadgeProps {
  bankName: string;
  className?: string;
}
```

**Styling:**
- Background: Dark color (varies by bank, default `#1D4E8F`)
- Text: White, 10px, medium weight
- Padding: `2px 8px`
- Border radius: `4px` (small pill shape)
- Max width: fit-content

**Color Mapping (optional enhancement):**
- Bancolombia: `#FDDA24` (yellow) with black text
- Davivienda: `#ED1C24` (red)
- BBVA: `#004481` (dark blue)
- Coopcentral: `#1D4E8F` (navy)
- Default: `#1D4E8F` (navy)

### 5.4 New Organism: AccountRegistrationForm

Location: `src/organisms/AccountRegistrationForm.tsx`

Dynamic registration form with all conditional logic.

```typescript
interface AccountRegistrationFormProps {
  mode: "register" | "edit";
  initialData?: AccountRegistrationFormData;
  banks: BankOption[];
  cooperativas: CooperativaOption[];
  documentTypes: DocumentTypeOption[];
  accountTypes: AccountTypeOption[];
  onSubmit: (data: AccountRegistrationFormData) => void;
  onCancel?: () => void;
}
```

**Sections:**

1. **Card Header**
   - Title: "Inscripcion de Cuentas Externas" (21px, Bold, navy `#005066`)
   - Description: "Inscribe las cuentas de destino para tus transferencias a otros bancos y a la red Coopcentral." (14px, Regular, `#58585B`)

2. **Account Type Selection**
   - Label: "Tipo de Cuenta a Inscribir" (14px, Medium, `#111827`)
   - `AccountTypeRadioGroup` component

3. **Conditional Bank/Cooperativa Field**
   - If `otro_banco`: Show "Entidad Financiera" dropdown
   - If `red_coopcentral`: Show "Cooperativa" dropdown
   - Placeholder: "Seleccione.."

4. **Common Account Fields**
   - "Tipo de Cuenta" dropdown (Ahorros/Corriente)
   - "Numero de Cuenta" text input

5. **Holder Type Selection**
   - Label: "Tipo de Titular" (14px, Medium, `#111827`)
   - `HolderTypeRadioGroup` component

6. **Conditional Holder Fields**
   - If `persona_natural`: Two side-by-side inputs
     - "Nombre del Titular" (left, 50% width)
     - "Apellidos del Titular" (right, 50% width)
   - If `persona_juridica`: Single full-width input
     - "Razon Social del Titular"

7. **Document Fields**
   - "Tipo de Documento" dropdown
   - "Documento del Titular (C.C. o NIT)" text input

8. **Alias Field**
   - "Alias de la cuenta" text input
   - Placeholder: "Ej: Cuenta Mama"

9. **Form Actions**
   - Primary Button: "Inscribir Cuenta" (or "Editar Cuenta" in edit mode)
     - Background: `#00B8ED`
     - Text: White
     - Full width
     - Height: 40px
   - Text Link: "Volver" (below button, centered, `#004266`)

**Card Styling:**
- Background: White `#FFFFFF`
- Border radius: `16px`
- Padding: `24px`
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`

### 5.5 New Organism: RegisteredAccountCard

Location: `src/organisms/RegisteredAccountCard.tsx`

Individual registered account card with actions.

```typescript
interface RegisteredAccountCardProps {
  account: RegisteredAccount;
  onEdit: (accountId: string) => void;
  onDelete: (accountId: string) => void;
}
```

**Layout:**
- Horizontal flex container with space-between
- Left side: Account info (flex column)
- Right side: Action buttons (flex row, gap-3)

**Left Content:**
1. **Alias** (title): Bold, 18px, navy `#005066`
2. **Bank Badge**: `BankBadge` component with bank name
3. **Account Info**: "Ahorros - ****9-01" (14px, Regular, `#58585B`)
4. **Holder Name**: "MARIA GONZALEZ" (14px, Regular, `#111827`, uppercase)

**Right Actions:**
1. **Edit Button**: Pencil icon
   - Icon size: 20px
   - Color: `#58585B`
   - Hover: `#1D4E8F`
   - Cursor: pointer
2. **Delete Button**: Trash icon
   - Icon size: 20px
   - Color: `#FF0D00` (red)
   - Hover: `#CC0000`
   - Cursor: pointer

**Card Styling:**
- Background: White `#FFFFFF`
- Border: `1px solid #E4E6EA`
- Border radius: `8px`
- Padding: `16px`
- Margin bottom: `12px` between cards

### 5.6 New Organism: RegisteredAccountsList

Location: `src/organisms/RegisteredAccountsList.tsx`

List container for registered accounts.

```typescript
interface RegisteredAccountsListProps {
  accounts: RegisteredAccount[];
  onEdit: (accountId: string) => void;
  onDelete: (accountId: string) => void;
}
```

**Layout:**
1. **Section Title**: "Cuentas Inscritas" (18px, Bold, navy `#005066`)
2. **List**: Map through accounts, render `RegisteredAccountCard` for each
3. **Empty State** (when no accounts): "No tienes cuentas inscritas." (centered, gray text)

### 5.7 New Organism: AccountSuccessModal

Location: `src/organisms/AccountSuccessModal.tsx`

Reusable success modal for register/edit operations.

```typescript
interface AccountSuccessModalProps {
  isOpen: boolean;
  type: "register" | "edit";
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}
```

**Content by Type:**

**Register Success:**
- Icon: Green checkmark circle (SuccessIcon, teal `#00AFA9`)
- Title: "Cuenta Inscrita con Exito" (20px, Bold, navy `#1D4E8F`)
- Message: "Su cuenta externa ha sido inscrita con exito. Por favor revise en su lista de cuentas inscritas."
- Actions:
  - Primary: "Volver a Inicio" (blue `#00B8ED`, right)
  - Secondary: "Cancelar" (gray `#E4E6EA`, left)

**Edit Success:**
- Icon: Green checkmark circle (SuccessIcon, teal `#00AFA9`)
- Title: "Cuenta Editada con Exito" (20px, Bold, navy `#1D4E8F`)
- Message: "Su cuenta externa ha sido editada con exito. Por favor revise en su lista de cuentas inscritas."
- Actions:
  - Primary only: "Aceptar" (blue `#00B8ED`, centered)

**Modal Styling:**
- Background: White `#FFFFFF`
- Border radius: `15px`
- Max width: ~460px
- Padding: `32px`
- Centered on screen
- Backdrop: Black with 50% opacity
- Content centered (icon, title, message)

### 5.8 New Organism: AccountDeleteConfirmModal

Location: `src/organisms/AccountDeleteConfirmModal.tsx`

Delete confirmation modal.

```typescript
interface AccountDeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Content:**
- Title: "Borrar cuenta inscrita" (20px, Bold, navy `#1D4E8F`)
- Message: "Esta seguro que desea borrar esta cuenta?" (14px, Regular, `#58585B`)
- Actions:
  - Secondary: "Cancelar" (gray `#E4E6EA`, left)
  - Primary: "Aceptar" (blue `#00B8ED`, right)

**Modal Styling:**
- Same as AccountSuccessModal

---

## 6. Page Implementation

### 6.1 Main Page

Location: `app/(authenticated)/transferencias/inscribir-cuentas/page.tsx`

**Layout Structure:**

```tsx
<div className="space-y-6">
  {/* Header Section */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <BackButton onClick={handleBack} />
      <h1 className="text-xl font-medium text-gray-800">Inscribir Cuentas</h1>
    </div>
    <Breadcrumbs items={breadcrumbItems} />
  </div>

  {/* Hide Balances Toggle (top right of content area) */}
  <div className="flex justify-end">
    <HideBalancesToggle />
  </div>

  {/* Two-Column Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Section 1: Registration Form */}
    <AccountRegistrationForm
      mode={pageState.mode}
      initialData={editingAccountData}
      banks={mockBanks}
      cooperativas={mockCooperativas}
      documentTypes={mockDocumentTypes}
      accountTypes={mockAccountTypes}
      onSubmit={handleFormSubmit}
      onCancel={handleCancelEdit}
    />

    {/* Section 2: Registered Accounts List */}
    <RegisteredAccountsList
      accounts={pageState.registeredAccounts}
      onEdit={handleEdit}
      onDelete={handleDeleteClick}
    />
  </div>

  {/* Modals */}
  <AccountSuccessModal
    isOpen={pageState.showSuccessModal}
    type={pageState.successModalType}
    onPrimaryAction={handleSuccessModalPrimary}
    onSecondaryAction={handleSuccessModalSecondary}
  />

  <AccountDeleteConfirmModal
    isOpen={pageState.showDeleteModal}
    onConfirm={handleDeleteConfirm}
    onCancel={handleDeleteCancel}
  />
</div>
```

**Breadcrumbs:**
```typescript
const breadcrumbItems = [
  { label: "Inicio", href: "/home" },
  { label: "Transferencias", href: "/transferencias/internas" },
  { label: "Inscribir Cuenta" },
];
```

**WelcomeBar Configuration:**
```typescript
useEffect(() => {
  setWelcomeBarConfig({
    title: "Inscribir Cuentas",
    backHref: "/transferencias/internas",
  });
}, []);
```

---

## 7. Validation Rules

### Form Validation Schema (Yup)

```typescript
import * as yup from "yup";

export const accountRegistrationSchema = yup.object({
  accountType: yup
    .string()
    .oneOf(["otro_banco", "red_coopcentral"])
    .required("Seleccione el tipo de cuenta"),

  entidadFinanciera: yup.string().when("accountType", {
    is: "otro_banco",
    then: (schema) => schema.required("Seleccione la entidad financiera"),
    otherwise: (schema) => schema.notRequired(),
  }),

  cooperativa: yup.string().when("accountType", {
    is: "red_coopcentral",
    then: (schema) => schema.required("Seleccione la cooperativa"),
    otherwise: (schema) => schema.notRequired(),
  }),

  tipoCuenta: yup
    .string()
    .oneOf(["ahorros", "corriente"])
    .required("Seleccione el tipo de cuenta"),

  numeroCuenta: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten numeros")
    .min(8, "El numero de cuenta debe tener al menos 8 digitos")
    .max(20, "El numero de cuenta no puede exceder 20 digitos")
    .required("Ingrese el numero de cuenta"),

  tipoTitular: yup
    .string()
    .oneOf(["persona_natural", "persona_juridica"])
    .required("Seleccione el tipo de titular"),

  nombreTitular: yup.string().when("tipoTitular", {
    is: "persona_natural",
    then: (schema) => schema.required("Ingrese el nombre del titular"),
    otherwise: (schema) => schema.notRequired(),
  }),

  apellidosTitular: yup.string().when("tipoTitular", {
    is: "persona_natural",
    then: (schema) => schema.required("Ingrese los apellidos del titular"),
    otherwise: (schema) => schema.notRequired(),
  }),

  razonSocial: yup.string().when("tipoTitular", {
    is: "persona_juridica",
    then: (schema) => schema.required("Ingrese la razon social"),
    otherwise: (schema) => schema.notRequired(),
  }),

  tipoDocumento: yup
    .string()
    .oneOf(["cc", "nit", "ce", "pasaporte"])
    .required("Seleccione el tipo de documento"),

  documentoTitular: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten numeros")
    .min(6, "El documento debe tener al menos 6 digitos")
    .max(12, "El documento no puede exceder 12 digitos")
    .required("Ingrese el documento del titular"),

  alias: yup
    .string()
    .max(50, "El alias no puede exceder 50 caracteres")
    .required("Ingrese un alias para la cuenta"),
});

export type AccountRegistrationFormData = yup.InferType<
  typeof accountRegistrationSchema
>;
```

### Validation Rules Summary

| Field | Rule | Error Message |
|-------|------|---------------|
| accountType | Required, enum | "Seleccione el tipo de cuenta" |
| entidadFinanciera | Required if otro_banco | "Seleccione la entidad financiera" |
| cooperativa | Required if red_coopcentral | "Seleccione la cooperativa" |
| tipoCuenta | Required, enum | "Seleccione el tipo de cuenta" |
| numeroCuenta | Required, numeric, 8-20 digits | "Ingrese el numero de cuenta" |
| tipoTitular | Required, enum | "Seleccione el tipo de titular" |
| nombreTitular | Required if persona_natural | "Ingrese el nombre del titular" |
| apellidosTitular | Required if persona_natural | "Ingrese los apellidos del titular" |
| razonSocial | Required if persona_juridica | "Ingrese la razon social" |
| tipoDocumento | Required, enum | "Seleccione el tipo de documento" |
| documentoTitular | Required, numeric, 6-12 digits | "Ingrese el documento del titular" |
| alias | Required, max 50 chars | "Ingrese un alias para la cuenta" |

### Error Styling

- Red border (`#FF0D00`) on invalid fields
- Error message below field (14px, red `#FF0D00`)
- Form cannot submit with validation errors

---

## 8. State Management

### Page State

```typescript
const [pageState, setPageState] = useState<AccountRegistrationPageState>({
  mode: "register",
  editingAccountId: null,
  registeredAccounts: mockRegisteredAccounts,
  showSuccessModal: false,
  showDeleteModal: false,
  accountToDelete: null,
  successModalType: "register",
});
```

### User Flows

#### Register New Account
1. User fills out the dynamic form
2. Form validates on submit
3. On success: Add account to registeredAccounts list
4. Show "Cuenta Inscrita con Exito" modal
5. User clicks "Volver a Inicio" or "Cancelar"
6. Modal closes, form resets

#### Edit Existing Account
1. User clicks edit (pencil) icon on a registered account
2. Page state mode changes to "edit"
3. Form populates with existing account data
4. Form button changes to "Editar Cuenta"
5. On submit: Update account in registeredAccounts list
6. Show "Cuenta Editada con Exito" modal
7. User clicks "Aceptar"
8. Modal closes, mode resets to "register", form clears

#### Delete Account
1. User clicks delete (trash) icon on a registered account
2. Page state stores accountToDelete
3. "Borrar cuenta inscrita" confirmation modal appears
4. User clicks "Aceptar" to confirm or "Cancelar" to abort
5. On confirm: Remove account from registeredAccounts list
6. Modal closes, accountToDelete cleared

---

## 9. Component Exports

### New Components to Export

**Molecules** (`src/molecules/index.ts`):
```typescript
export { AccountTypeRadioGroup } from "./AccountTypeRadioGroup";
export { HolderTypeRadioGroup } from "./HolderTypeRadioGroup";
export { BankBadge } from "./BankBadge";
```

**Organisms** (`src/organisms/index.ts`):
```typescript
export { AccountRegistrationForm } from "./AccountRegistrationForm";
export { RegisteredAccountsList } from "./RegisteredAccountsList";
export { RegisteredAccountCard } from "./RegisteredAccountCard";
export { AccountSuccessModal } from "./AccountSuccessModal";
export { AccountDeleteConfirmModal } from "./AccountDeleteConfirmModal";
```

**Types** (`src/types/index.ts`):
```typescript
export type {
  AccountBankType,
  HolderType,
  AccountType,
  DocumentType,
  BankOption,
  CooperativaOption,
  DocumentTypeOption,
  AccountTypeOption,
  AccountRegistrationFormData,
  RegisteredAccount,
  AccountRegistrationPageState,
} from "./accountRegistration";
```

**Mocks** (`src/mocks/index.ts`):
```typescript
export {
  mockRegisteredAccounts,
  mockBanks,
  mockCooperativas,
  mockDocumentTypes,
  mockAccountTypes,
} from "./mockAccountRegistrationData";
```

---

## 10. Reusable Components

The following existing components should be reused:

| Component | Location | Usage |
|-----------|----------|-------|
| `BackButton` | atoms | Back navigation arrow |
| `Breadcrumbs` | molecules | Page navigation trail |
| `HideBalancesToggle` | molecules | Balance visibility toggle |
| `Card` | atoms | Container cards |
| `Button` | atoms | Primary and secondary buttons |
| `Input` | atoms | Text inputs |
| `Select` | atoms | Dropdown selects |
| `Label` | atoms | Form labels |
| `ErrorMessage` | atoms | Form validation errors |
| `SuccessIcon` | atoms | Green checkmark icon |

---

## 11. Accessibility Requirements

1. **Form Labels**: All inputs must have associated labels with `htmlFor`/`id` attributes
2. **Radio Groups**:
   - Use `role="radiogroup"` on container
   - Use `aria-labelledby` pointing to group label
   - Each radio has `role="radio"` and proper `aria-checked` state
3. **Modal Dialogs**:
   - Use `role="dialog"` and `aria-modal="true"`
   - Focus trapped inside modal when open
   - Close on Escape key
   - Return focus to trigger element on close
4. **Error Messages**: Associate with inputs via `aria-describedby`
5. **Delete Action**: Requires confirmation (destructive action protection)
6. **Keyboard Navigation**:
   - All interactive elements must be keyboard accessible
   - Tab order follows visual order
   - Radio groups navigable with arrow keys
7. **Screen Reader Announcements**:
   - Success/error states announced via `aria-live="polite"`

---

## 12. Implementation Checklist

### Phase 1: Types and Mocks
- [ ] Create `src/types/accountRegistration.ts`
- [ ] Update `src/types/index.ts`
- [ ] Create `src/mocks/mockAccountRegistrationData.ts`
- [ ] Update `src/mocks/index.ts`

### Phase 2: Molecules
- [ ] Create `AccountTypeRadioGroup` molecule
- [ ] Create `HolderTypeRadioGroup` molecule
- [ ] Create `BankBadge` molecule
- [ ] Update `src/molecules/index.ts`

### Phase 3: Organisms
- [ ] Create `AccountRegistrationForm` organism
- [ ] Create `RegisteredAccountCard` organism
- [ ] Create `RegisteredAccountsList` organism
- [ ] Create `AccountSuccessModal` organism
- [ ] Create `AccountDeleteConfirmModal` organism
- [ ] Update `src/organisms/index.ts`

### Phase 4: Page
- [ ] Create `app/(authenticated)/transferencias/inscribir-cuentas/page.tsx`

---

## 13. Testing Scenarios

### Happy Path - Register
1. Navigate to `/transferencias/inscribir-cuentas`
2. Select "Otro Banco (ACH)" as account type
3. Select a bank from dropdown
4. Select account type (Ahorros/Corriente)
5. Enter account number
6. Select "Persona Natural" as holder type
7. Enter holder name and last name
8. Select document type
9. Enter document number
10. Enter alias
11. Click "Inscribir Cuenta"
12. Verify success modal appears
13. Click "Volver a Inicio" or "Cancelar"
14. Verify new account appears in list

### Happy Path - Edit
1. Click edit icon on existing account
2. Verify form populates with account data
3. Modify some fields
4. Click "Editar Cuenta"
5. Verify edit success modal appears
6. Click "Aceptar"
7. Verify account list reflects changes

### Happy Path - Delete
1. Click delete icon on existing account
2. Verify confirmation modal appears
3. Click "Aceptar"
4. Verify account removed from list

### Validation Errors
1. Submit form with empty required fields → See error messages
2. Enter invalid account number (letters) → See validation error
3. Enter too short document number → See validation error

### Dynamic Form Behavior
1. Select "Otro Banco" → Verify "Entidad Financiera" dropdown appears
2. Select "Red Coopcentral" → Verify "Cooperativa" dropdown appears
3. Select "Persona Natural" → Verify name/lastname fields appear
4. Select "Persona Juridica" → Verify "Razon Social" field appears

### Edge Cases
1. Cancel edit mode → Form resets to register mode
2. Modal close behaviors (backdrop click, Escape key)
3. Empty accounts list → Show empty state message

---

## 14. Design References

| Screen | Figma Node | Description |
|--------|------------|-------------|
| Form - Red Coopcentral (Persona Juridica) | `3349-9` | Registration form with Coopcentral selected |
| Form - Otro Banco ACH (Persona Natural) | `3349-10` | Registration form with Otro Banco selected |
| Register Success Modal | `810-1632` | Success modal after registration |
| Edit Success Modal | `3403-511` | Success modal after edit |
| Delete Confirmation Modal | `3403-915` | Delete confirmation modal |

Base URL: `https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=`

---

## 15. Color Reference

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Navy | `#1D4E8F` | Card titles, modal titles |
| Dark Navy | `#005066` | Section titles, aliases |
| Primary Blue/Teal | `#00B8ED` | Primary buttons, selected radio |
| Text Black | `#111827` | Primary text, labels |
| Gray High | `#58585B` | Secondary text, descriptions |
| Gray Medium | `#808284` | Placeholder text |
| Gray Border | `#B1B1B1` | Input borders, radio borders |
| Gray Low | `#E4E6EA` | Card borders, secondary buttons |
| Error Red | `#FF0D00` | Error messages, delete icon |
| Success Teal | `#00AFA9` | Success icon |
| White | `#FFFFFF` | Backgrounds, button text |
| Light Blue BG | `#F0F9FF` | Page background |
| Link Dark | `#004266` | "Volver" link text |

---

## 16. Related Features

- **10-transferencias**: Parent feature - Transfers main menu
- **10a-transferencias**: Internal transfers flow selection
- **10b-transferencias**: Between my accounts transfer
- **10c-transferencias**: PSE recharge flow

The registered accounts from this feature (10d) can be used as destinations in:
- Network transfers (Coopcentral) - Feature 10b
- Future: ACH transfers to other banks

---

## 17. Notes

- The form dynamically shows/hides fields based on radio button selections
- Bank badges use different background colors based on the bank (visual differentiation)
- Edit mode reuses the same form component with pre-populated data
- Newly registered account should appear at the bottom of the list
- After successful registration/edit, the form should reset to initial state
- Delete operation should show confirmation before removing account
- Consider responsive design: On mobile, stack form and list vertically
