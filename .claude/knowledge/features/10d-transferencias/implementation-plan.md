# Feature 10d - Transferencias: Inscribir Cuentas

## Implementation Plan

**Version**: 1.0
**Status**: Ready for Implementation
**Estimated Phases**: 4

---

## Prerequisites

Before starting implementation, ensure:
- [ ] Feature 10a-10c transferencias features are implemented
- [ ] Review existing transfer components in `src/organisms/`
- [ ] Review modal patterns from utility and payment flows

---

## Phase 1: Types and Mock Data

### Step 1.1: Create Account Registration Types

**File**: `src/types/accountRegistration.ts`

Create the following types:
- `AccountBankType` - Union type: `"otro_banco" | "red_coopcentral"`
- `HolderType` - Union type: `"persona_natural" | "persona_juridica"`
- `AccountType` - Union type: `"ahorros" | "corriente"`
- `DocumentType` - Union type: `"cc" | "nit" | "ce" | "pasaporte"`
- `BankOption` - Interface for bank dropdown options
- `CooperativaOption` - Interface for cooperativa dropdown options
- `DocumentTypeOption` - Interface for document type dropdown options
- `AccountTypeOption` - Interface for account type dropdown options
- `AccountRegistrationFormData` - Interface for form data with conditional fields
- `RegisteredAccount` - Interface for registered account list items
- `AccountRegistrationPageState` - Interface for page state management

### Step 1.2: Export Types

**File**: `src/types/index.ts`

Add exports for all new types from `accountRegistration.ts`.

### Step 1.3: Create Mock Data

**File**: `src/mocks/mockAccountRegistrationData.ts`

Create mock data:
- `mockRegisteredAccounts` - Array of 4 pre-registered accounts
- `mockBanks` - Array of 8 Colombian bank options
- `mockCooperativas` - Array of 5 cooperativa options
- `mockDocumentTypes` - Array of 4 document type options
- `mockAccountTypes` - Array of 2 account type options (Ahorros/Corriente)

### Step 1.4: Export Mock Data

**File**: `src/mocks/index.ts`

Add exports for all new mock data.

### Step 1.5: Create Validation Schema

**File**: `src/schemas/accountRegistrationSchema.ts`

Create Yup validation schema with:
- Conditional validation for `entidadFinanciera` (required if `accountType === "otro_banco"`)
- Conditional validation for `cooperativa` (required if `accountType === "red_coopcentral"`)
- Conditional validation for `nombreTitular` and `apellidosTitular` (required if `tipoTitular === "persona_natural"`)
- Conditional validation for `razonSocial` (required if `tipoTitular === "persona_juridica"`)
- Numeric validation for `numeroCuenta` (8-20 digits)
- Numeric validation for `documentoTitular` (6-12 digits)
- Max length validation for `alias` (50 characters)

---

## Phase 2: Molecules

### Step 2.1: Create AccountTypeRadioGroup

**File**: `src/molecules/AccountTypeRadioGroup.tsx`

Props:
```typescript
interface AccountTypeRadioGroupProps {
  value: "otro_banco" | "red_coopcentral";
  onChange: (value: "otro_banco" | "red_coopcentral") => void;
  disabled?: boolean;
}
```

Implementation details:
- Horizontal flex layout with `gap-6`
- Two radio options: "Otro Banco (ACH)" and "Red Coopcentral"
- Radio size: 16px x 16px
- Selected state: Inner circle `#00B8ED` background
- Border: `1px solid #B1B1B1`
- Label: 14px, Regular, `#111827`
- Keyboard navigation support (arrow keys)
- ARIA attributes: `role="radiogroup"`, `aria-labelledby`

### Step 2.2: Create HolderTypeRadioGroup

**File**: `src/molecules/HolderTypeRadioGroup.tsx`

Props:
```typescript
interface HolderTypeRadioGroupProps {
  value: "persona_natural" | "persona_juridica";
  onChange: (value: "persona_natural" | "persona_juridica") => void;
  disabled?: boolean;
}
```

Implementation details:
- Same styling as AccountTypeRadioGroup
- Two options: "Persona Natural" and "Persona Juridica"
- Same accessibility requirements

### Step 2.3: Create BankBadge

**File**: `src/molecules/BankBadge.tsx`

Props:
```typescript
interface BankBadgeProps {
  bankName: string;
  className?: string;
}
```

Implementation details:
- Background: Dark color (default `#1D4E8F`)
- Text: White, 10px, medium weight
- Padding: `2px 8px`
- Border radius: `4px`
- Max width: fit-content
- Optional: Color mapping for specific banks (Bancolombia yellow, Davivienda red, etc.)

### Step 2.4: Export New Molecules

**File**: `src/molecules/index.ts`

Add exports:
```typescript
export { AccountTypeRadioGroup } from "./AccountTypeRadioGroup";
export { HolderTypeRadioGroup } from "./HolderTypeRadioGroup";
export { BankBadge } from "./BankBadge";
```

---

## Phase 3: Organisms

### Step 3.1: Create RegisteredAccountCard

**File**: `src/organisms/RegisteredAccountCard.tsx`

Props:
```typescript
interface RegisteredAccountCardProps {
  account: RegisteredAccount;
  onEdit: (accountId: string) => void;
  onDelete: (accountId: string) => void;
}
```

Implementation details:
- Horizontal flex layout with `space-between`
- Left side (flex column):
  - Alias: Bold, 18px, `#005066`
  - BankBadge component
  - Account info: "Ahorros - ****9-01" (14px, `#58585B`)
  - Holder name: uppercase (14px, `#111827`)
- Right side (flex row, gap-3):
  - Edit button: Pencil icon (20px, `#58585B`, hover `#1D4E8F`)
  - Delete button: Trash icon (20px, `#FF0D00`, hover `#CC0000`)
- Card styling:
  - Background: White
  - Border: `1px solid #E4E6EA`
  - Border radius: `8px`
  - Padding: `16px`

### Step 3.2: Create RegisteredAccountsList

**File**: `src/organisms/RegisteredAccountsList.tsx`

Props:
```typescript
interface RegisteredAccountsListProps {
  accounts: RegisteredAccount[];
  onEdit: (accountId: string) => void;
  onDelete: (accountId: string) => void;
}
```

Implementation details:
- Section title: "Cuentas Inscritas" (18px, Bold, `#005066`)
- Map accounts to RegisteredAccountCard components
- Empty state: "No tienes cuentas inscritas." (centered, gray)
- Margin bottom `12px` between cards

### Step 3.3: Create AccountRegistrationForm

**File**: `src/organisms/AccountRegistrationForm.tsx`

Props:
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

Implementation details:
- Use `react-hook-form` with `yupResolver`
- Card container with title and description
- Watch `accountType` field for conditional bank/cooperativa rendering
- Watch `tipoTitular` field for conditional name/razonSocial rendering
- Form sections:
  1. Account Type Selection (AccountTypeRadioGroup)
  2. Bank/Cooperativa dropdown (conditional)
  3. Account Type dropdown + Account Number input
  4. Holder Type Selection (HolderTypeRadioGroup)
  5. Name fields (conditional based on holder type)
  6. Document Type dropdown + Document Number input
  7. Alias input
  8. Submit button ("Inscribir Cuenta" or "Editar Cuenta")
  9. "Volver" link (triggers onCancel in edit mode)
- Form validation on submit
- Reset form on mode change or after successful submission

### Step 3.4: Create AccountSuccessModal

**File**: `src/organisms/AccountSuccessModal.tsx`

Props:
```typescript
interface AccountSuccessModalProps {
  isOpen: boolean;
  type: "register" | "edit";
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}
```

Implementation details:
- Modal container (backdrop, centered, max-width ~460px)
- Content by type:
  - Register: SuccessIcon, "Cuenta Inscrita con Exito", two buttons
  - Edit: SuccessIcon, "Cuenta Editada con Exito", single button
- Icon: Green checkmark (SuccessIcon component, teal `#00AFA9`)
- Title: 20px, Bold, `#1D4E8F`
- Message text: 14px, Regular, `#58585B`
- Primary button: Blue `#00B8ED`
- Secondary button: Gray `#E4E6EA`
- Focus trap when open
- Close on Escape key
- Backdrop: Black 50% opacity

### Step 3.5: Create AccountDeleteConfirmModal

**File**: `src/organisms/AccountDeleteConfirmModal.tsx`

Props:
```typescript
interface AccountDeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

Implementation details:
- Same modal container styling as AccountSuccessModal
- Title: "Borrar cuenta inscrita"
- Message: "Esta seguro que desea borrar esta cuenta?"
- Two buttons: "Cancelar" (secondary, left) + "Aceptar" (primary, right)
- Same accessibility requirements (focus trap, escape key)

### Step 3.6: Export New Organisms

**File**: `src/organisms/index.ts`

Add exports:
```typescript
export { AccountRegistrationForm } from "./AccountRegistrationForm";
export { RegisteredAccountsList } from "./RegisteredAccountsList";
export { RegisteredAccountCard } from "./RegisteredAccountCard";
export { AccountSuccessModal } from "./AccountSuccessModal";
export { AccountDeleteConfirmModal } from "./AccountDeleteConfirmModal";
```

---

## Phase 4: Page Implementation

### Step 4.1: Create Inscribir Cuentas Page

**File**: `app/(authenticated)/transferencias/inscribir-cuentas/page.tsx`

Implementation details:

**Page State**:
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

**WelcomeBar Configuration**:
```typescript
useEffect(() => {
  setWelcomeBarConfig({
    title: "Inscribir Cuentas",
    backHref: "/transferencias/internas",
  });
}, []);
```

**Layout Structure**:
1. Header section:
   - BackButton (navigates to `/transferencias/internas`)
   - Page title: "Inscribir Cuentas"
   - Breadcrumbs: Inicio / Transferencias / Inscribir Cuenta
2. HideBalancesToggle (top right)
3. Two-column grid (`lg:grid-cols-2`):
   - Left: AccountRegistrationForm
   - Right: RegisteredAccountsList
4. Modals:
   - AccountSuccessModal
   - AccountDeleteConfirmModal

**Event Handlers**:
- `handleFormSubmit` - Add/update account, show success modal
- `handleEdit` - Set mode to "edit", populate form with account data
- `handleCancelEdit` - Reset mode to "register", clear form
- `handleDeleteClick` - Set accountToDelete, show delete modal
- `handleDeleteConfirm` - Remove account from list, close modal
- `handleDeleteCancel` - Close delete modal
- `handleSuccessModalPrimary` - Close modal, optionally navigate
- `handleSuccessModalSecondary` - Close modal

**Responsive Design**:
- On mobile: Stack form and list vertically (`grid-cols-1`)
- On desktop: Side-by-side layout (`lg:grid-cols-2`)

---

## Verification Checklist

### Phase 1 Verification
- [ ] Types compile without errors
- [ ] Types are properly exported from index
- [ ] Mock data matches type definitions
- [ ] Validation schema handles all conditional fields

### Phase 2 Verification
- [ ] Radio groups render correctly with both options
- [ ] Radio selection triggers onChange callback
- [ ] BankBadge renders with correct colors
- [ ] All molecules exported from index

### Phase 3 Verification
- [ ] RegisteredAccountCard displays all account info
- [ ] Edit/Delete buttons trigger callbacks with correct accountId
- [ ] RegisteredAccountsList handles empty state
- [ ] AccountRegistrationForm shows/hides conditional fields correctly
- [ ] Form validation shows errors on invalid submit
- [ ] Form resets properly after successful submission
- [ ] Modals open/close correctly
- [ ] Modal focus trap works
- [ ] Escape key closes modals

### Phase 4 Verification
- [ ] Page renders with form and list side by side (desktop)
- [ ] Page renders with form and list stacked (mobile)
- [ ] Register flow works end-to-end
- [ ] Edit flow populates form and updates account
- [ ] Delete flow shows confirmation and removes account
- [ ] Success modals display correct content for register/edit
- [ ] Breadcrumbs navigate correctly
- [ ] Back button navigates to transfer selection

---

## Testing Scenarios

### Happy Path - Register
1. Navigate to `/transferencias/inscribir-cuentas`
2. Select "Otro Banco (ACH)"
3. Select bank from dropdown
4. Select "Ahorros" as account type
5. Enter account number (8+ digits)
6. Select "Persona Natural"
7. Enter first name and last name
8. Select document type
9. Enter document number
10. Enter alias
11. Click "Inscribir Cuenta"
12. Verify success modal appears
13. Click "Volver a Inicio"
14. Verify new account appears in list

### Happy Path - Edit
1. Click edit (pencil) icon on existing account
2. Verify form populates with account data
3. Change alias
4. Click "Editar Cuenta"
5. Verify edit success modal appears
6. Click "Aceptar"
7. Verify account list shows updated alias

### Happy Path - Delete
1. Click delete (trash) icon on existing account
2. Verify confirmation modal appears
3. Click "Aceptar"
4. Verify account removed from list

### Validation Errors
1. Submit form with empty required fields
2. Verify error messages appear
3. Enter letters in account number field
4. Verify numeric validation error

### Dynamic Form Behavior
1. Toggle between "Otro Banco" and "Red Coopcentral"
2. Verify correct dropdown appears
3. Toggle between "Persona Natural" and "Persona Juridica"
4. Verify correct name fields appear

### Edge Cases
1. Cancel edit mode - verify form resets
2. Register with Red Coopcentral + Persona Juridica
3. Test modal close via backdrop click
4. Test modal close via Escape key
5. Test with empty registered accounts list

---

## File Summary

### New Files
| File | Type | Description |
|------|------|-------------|
| `src/types/accountRegistration.ts` | Types | All type definitions |
| `src/mocks/mockAccountRegistrationData.ts` | Mocks | Mock data for development |
| `src/schemas/accountRegistrationSchema.ts` | Schema | Yup validation schema |
| `src/molecules/AccountTypeRadioGroup.tsx` | Molecule | Account type radio selector |
| `src/molecules/HolderTypeRadioGroup.tsx` | Molecule | Holder type radio selector |
| `src/molecules/BankBadge.tsx` | Molecule | Bank name badge |
| `src/organisms/AccountRegistrationForm.tsx` | Organism | Dynamic registration form |
| `src/organisms/RegisteredAccountCard.tsx` | Organism | Single registered account card |
| `src/organisms/RegisteredAccountsList.tsx` | Organism | List of registered accounts |
| `src/organisms/AccountSuccessModal.tsx` | Organism | Success modal (register/edit) |
| `src/organisms/AccountDeleteConfirmModal.tsx` | Organism | Delete confirmation modal |
| `app/(authenticated)/transferencias/inscribir-cuentas/page.tsx` | Page | Main page |

### Modified Files
| File | Change |
|------|--------|
| `src/types/index.ts` | Add exports |
| `src/mocks/index.ts` | Add exports |
| `src/molecules/index.ts` | Add exports |
| `src/organisms/index.ts` | Add exports |

---

## Dependencies

### Existing Dependencies (already installed)
- `react-hook-form` - Form state management
- `yup` - Schema validation
- `@hookform/resolvers` - Yup resolver for react-hook-form

### No New Dependencies Required

---

## Notes

1. The form uses conditional field rendering based on radio button selections
2. Edit mode reuses the same form component - only the submit button text changes
3. Bank badges provide visual differentiation - optional enhancement with bank-specific colors
4. Newly registered accounts appear at the bottom of the list
5. All modals follow the same styling pattern for consistency
6. Responsive design stacks columns on mobile viewports
