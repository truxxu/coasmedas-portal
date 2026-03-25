# Feature 10b - Transferencias: Desde Cupos Rotativos

## Overview

This feature implements the internal transfer flow for "Desde Cupos Rotativos" (From Revolving Credit Lines) within the Transferencias (Transfers) module. This flow allows users to transfer money from their revolving credit lines (cupos rotativos) to their active savings accounts.

## Figma Design References

| Step | Page Name                            | Figma Node | URL                                                                                              |
| ---- | ------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------ |
| 1    | Detalle (Cupo Selection)             | `810-128`  | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-128) |
| 2    | Confirmación (Transfer Confirmation) | `810-126`  | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-126) |
| 3    | SMS (Code Validation)                | `810-709`  | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-709) |
| 4    | Finalización (Response)              | `810-950`  | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-950) |

---

## Flow Structure

The transfer flow consists of 4 steps, displayed via a **Stepper** component:

```
1. Detalle → 2. Confirmación → 3. SMS → 4. Finalización
```

### Stepper States

- **Active Step**: Blue circle (`#007FFF`) with white number
- **Completed Step**: Blue circle (`#007FFF`) with white number, blue connecting line
- **Pending Step**: Gray circle (`#E4E6EA`) with gray number (`#808284`)
- **Connecting Lines**: Blue (`#007FFF`) for completed, Gray (`#E4E6EA`) for pending

---

## Step 1: Detalle (Cupo Rotativo Selection)

### Page Header

- **Back Button**: Arrow left icon
- **Title**: "Desde Cupos Rotativos" (20px, Ubuntu Medium, black)
- **Breadcrumbs**: `Inicio / Transferencias / Desde Cupos Rotativos`
- **Hide Balances Toggle**: Top right corner

### Main Content Card

- **Section Title**: "Transferencias de cupos rotativos a mis cuentas" (18px, Ubuntu Bold, `#1D4E8F`)
- **Description**: "Utiliza tus cupos rotativos para transferir a tus cuentas activas." (15px, Ubuntu Regular, black)

### Cupo Rotativo Selection

- **Label**: "Selecciona el cupo rotativo:" (14px, Ubuntu Regular, black)
- **Radio Button List**: Each item displays:
  - **Radio Button**: Blue when selected (`#007FFF`), gray border when unselected
  - **Product Name**: "Cupo Rotativo Personal" (18px, Ubuntu Bold, `#1D4E8F`)
  - **Available Amount**: "Disponible: $ 2.000.000 de $ 5.000.000" (14px, Ubuntu Regular, black)
  - **Border**: Light gray border around each option card

#### Sample Data

```
○ Cupo Rotativo Personal
  Disponible: $ 2.000.000 de $ 5.000.000

○ Cupo Rotativo Personal
  Disponible: $ 2.000.000 de $ 5.000.000
```

### Destination Account Selection

- **Label**: "¿A qué cuenta quieres abonar?" (14px, Ubuntu Regular, black)
- **Select Input**: Dropdown with account options
  - Format: "Cuenta de Ahorros (\*\*\*4428)"
  - Border: Gray (`#B1B1B1`)
  - Chevron: Down arrow icon

### Transfer Amount

- **Label**: "¿Qué valor deseas transferir?" (14px, Ubuntu Regular, black)
- **Amount Input**:
  - Currency symbol: "$" (21px, Ubuntu Bold, black) - Left aligned
  - Amount value: Right-aligned (21px, Ubuntu Bold, black)
  - Example: "1.000.000"
  - Underline separator: Gray (`#B1B1B1`)
- **Validation Error**: Below amount input (13px, Ubuntu Regular, `#FF0D00`, right-aligned)
  - Example: "El valor supera el cupo disponible."

### Captcha Section

- **Placeholder**: Gray box with centered text
- **Text**: "[Espacio para validación Captcha]" (16px, Ubuntu Regular, `#515151`)
- **Background**: Light gray
- **Border Top**: Gray separator line

### Footer Actions

- **Volver Link**: Left-aligned (14px, Ubuntu Medium, `#004266`)
- **Confirmar Button**: Primary blue button (`#007FFF`), right-aligned
  - Text: "Confirmar" (14px, Ubuntu Bold, white)
  - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
  - Border radius: 6px

---

## Step 2: Confirmación (Transfer Confirmation)

### Page Header

- Same as Step 1

### Main Content Card

- **Section Title**: "Confirmación de Pago" (18px, Ubuntu Bold, `#1D4E8F`)
- **Description**: "Por favor, verificar que los datos de la transacción sean correctos antes de continuar." (15px, Ubuntu Light, black)

### Confirmation Details

Two-column layout with label-value pairs:

| Label              | Value Example                  | Value Style                 |
| ------------------ | ------------------------------ | --------------------------- |
| Titular            | CAMILO ANDRÉS CRUZ             | 15px, Ubuntu Regular, black |
| Documento          | CC 1.***.***234                | 15px, Ubuntu Regular, black |
| Cupo Origen        | Cupo Rotativo Personal         | 15px, Ubuntu Regular, black |
| Cuenta Destino     | Cuenta de Ahorros (\*\*\*4428) | 15px, Ubuntu Regular, black |
| Valor a Transferir | $ 1.000.000                    | 17px, Ubuntu Medium, black  |

- **Labels**: Left-aligned (15px, Ubuntu Light, black)
- **Values**: Right-aligned
- **Divider**: Horizontal line (`#E4E6EA`) between "Documento" and "Cupo Origen" rows

### Footer Actions

- **Volver Link**: Left-aligned (14px, Ubuntu Medium, `#004266`)
- **Confirmar Pago Button**: Primary blue button (`#007FFF`), right-aligned
  - Text: "Confirmar Pago" (14px, Ubuntu Bold, white)
  - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
  - Border radius: 6px

---

## Step 3: SMS (Code Validation)

### Page Header

- Same as previous steps

### Main Content Card

- **Title**: "Código Enviado a tu Teléfono" (17px, Ubuntu Bold, `#1D4E8F`)
- **Description**: "Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar la transacción" (15px, Ubuntu Regular, black)

### Code Input

- **6-digit input fields**: Dashed underlines for each digit
- **Layout**: Horizontally centered, spaced inputs
- **Style**: Each digit slot has a dashed bottom border

### Resend Code Section

- **Text**: "¿No recibiste la clave?" (15px, Ubuntu Regular, black)
- **Link**: "Reenviar" (15px, Ubuntu Medium, `#1D4E8F`)
- **Layout**: Horizontally centered, inline text + link
- **Underline**: Below entire resend section

### Footer Actions

- **Volver Link**: Left-aligned (14px, Ubuntu Medium, `#004266`)
- **Pagar Button**: Primary blue button (`#007FFF`), right-aligned
  - Text: "Pagar" (14px, Ubuntu Bold, white)
  - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
  - Border radius: 6px

---

## Step 4: Finalización (Transaction Response)

### Page Header

- Same as previous steps
- **Note**: Stepper shows all 4 steps completed (blue)

### Success Indicator

- **Icon**: Green checkmark inside teal/green circle
  - Outer circle: Teal/green stroke (`#00AFA9`)
  - Checkmark: Green (`#00AFA9`)
- **Title**: "Transacción Exitosa" (22px, Ubuntu Bold, `#1D4E8F`)
- **Layout**: Centered above the details card

### Transaction Details Card

Two sections separated by a horizontal divider:

#### Section 1: Transfer Information

| Label             | Value Example                    | Value Style                |
| ----------------- | -------------------------------- | -------------------------- |
| Cuenta Origen     | Cuenta de Ahorros                | 15px, Ubuntu Medium, black |
| Cuenta Destino    | Cuenta de Ahorros (\*\*\*\*4522) | 15px, Ubuntu Medium, black |
| Valor Transferido | $ 1.000.000                      | 18px, Ubuntu Medium, black |
| Costo Transacción | $ 0                              | 15px, Ubuntu Medium, black |

#### Section 2: Transaction Metadata (after divider)

| Label                | Value Example           | Value Style                            |
| -------------------- | ----------------------- | -------------------------------------- |
| Fecha de Transacción | 1 de septiembre de 2025 | 15px, Ubuntu Medium, black             |
| Hora de Transacción  | 7:21 pm                 | 15px, Ubuntu Medium, black             |
| Número de Aprobación | 250606                  | 15px, Ubuntu Medium, black             |
| Descripción          | Transferencia Exitosa   | 15px, Ubuntu Medium, `#00A44C` (green) |

- **Labels**: Left-aligned (15px, Ubuntu Regular, black)
- **Values**: Right-aligned
- **Divider**: Horizontal line (`#E4E6EA`)

### Footer Actions (3 buttons)

1. **Imprimir/Guardar**: Secondary outline button (left)
   - Border: `#1D4E8F`
   - Text: "Imprimir/Guardar" (16px, Ubuntu Bold, `#1D4E8F`)
   - Background: White
   - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
   - Border radius: 6px

2. **Realizar otra transacción**: Secondary outline button (center)
   - Border: `#1D4E8F`
   - Text: "Realizar otra transacción" (16px, Ubuntu Bold, `#1D4E8F`)
   - Background: White
   - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
   - Border radius: 6px

3. **Finalizar**: Primary blue button (right)
   - Background: `#007FFF`
   - Text: "Finalizar" (14px, Ubuntu Bold, white)
   - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
   - Border radius: 6px

---

## Color Palette

| Color Name          | Hex Code  | Usage                                           |
| ------------------- | --------- | ----------------------------------------------- |
| Primary Navy        | `#1D4E8F` | Section titles, product names, outline buttons  |
| Primary Blue        | `#007FFF` | Primary buttons, stepper active, radio selected |
| Success Green       | `#00A44C` | Success message text                            |
| Teal (Success Icon) | `#00AFA9` | Success checkmark circle                        |
| Error Red           | `#FF0D00` | Validation error messages                       |
| Text Black          | `#111827` | Primary text                                    |
| Gray Medium         | `#808284` | Inactive stepper numbers                        |
| Gray Lines          | `#E4E6EA` | Borders, dividers, inactive stepper             |
| Gray Border         | `#B1B1B1` | Input borders, underlines                       |
| Light Blue BG       | `#F0F9FF` | Main content area background                    |
| Link Dark           | `#004266` | "Volver" link                                   |
| Gray Text           | `#515151` | Captcha placeholder text                        |

---

## Typography

| Element         | Font   | Size    | Weight  |
| --------------- | ------ | ------- | ------- |
| Page Title      | Ubuntu | 20px    | Medium  |
| Section Title   | Ubuntu | 18px    | Bold    |
| Card Title      | Ubuntu | 17-18px | Bold    |
| Success Title   | Ubuntu | 22px    | Bold    |
| Body Text       | Ubuntu | 15px    | Regular |
| Body Text Light | Ubuntu | 15px    | Light   |
| Labels          | Ubuntu | 14px    | Regular |
| Product Name    | Ubuntu | 18px    | Bold    |
| Amount Large    | Ubuntu | 21px    | Bold    |
| Amount Medium   | Ubuntu | 17-18px | Medium  |
| Button Text     | Ubuntu | 14-16px | Bold    |
| Link Text       | Ubuntu | 14-15px | Medium  |
| Error Text      | Ubuntu | 13px    | Regular |
| Small Text      | Ubuntu | 12px    | Regular |

---

## Component Mapping

### Existing Components to Reuse

#### Atoms

- `BackButton` - Back navigation arrow
- `Button` - Primary and secondary variants
- `Card` - Container cards
- `Select` - Dropdown for account selection
- `CurrencyInput` - Currency formatted input
- `ErrorMessage` - Validation error display
- `Divider` - Horizontal separator
- `SuccessIcon` - Green checkmark icon
- `CodeInput` - Single digit input for SMS code

#### Molecules

- `Breadcrumbs` - Navigation trail
- `HideBalancesToggle` - Balance visibility toggle
- `Stepper` - 4-step progress indicator
- `CodeInputGroup` - 6-digit code input group
- `ConfirmationRow` - Label-value pair for confirmations
- `CaptchaPlaceholder` - Captcha placeholder component

#### Organisms

- `CodeInputCard` - SMS code verification card
- `TransferResultCard` - Success/error result display (may need adaptation)

### New Components to Create

#### Atoms

- None required

#### Molecules

- `CupoRotativoCard` - Selectable cupo rotativo card with radio button, name, and available amount

#### Organisms

- `CupoRotativoSelectionCard` - Form card with cupo selection, destination dropdown, amount input, and captcha
- `CupoRotativoConfirmationCard` - Confirmation details card specific to cupo rotativo transfers
- `CupoRotativoResultCard` - Transaction result card (or extend existing TransferResultCard)

---

## Page Routes

```
/transferencias/internas/desde-cupos-rotativos                → Step 1: Cupo Selection & Details
/transferencias/internas/desde-cupos-rotativos/confirmacion   → Step 2: Confirmation
/transferencias/internas/desde-cupos-rotativos/sms            → Step 3: SMS Verification
/transferencias/internas/desde-cupos-rotativos/resultado      → Step 4: Transaction Result
```

---

## State Management

### Transfer Flow State

```typescript
interface CupoRotativoTransferState {
  currentStep: 1 | 2 | 3 | 4;
  selectedCupoId: string | null;
  destinationAccountId: string | null;
  amount: number;
  otpCode: string;
  transactionResult: CupoRotativoTransferResult | null;
  isLoading: boolean;
  error: string | null;
}

interface CupoRotativo {
  id: string;
  name: string; // e.g., "Cupo Rotativo Personal"
  availableAmount: number; // Available credit
  totalAmount: number; // Total credit limit
}

interface DestinationAccount {
  id: string;
  name: string; // e.g., "Cuenta de Ahorros"
  maskedNumber: string; // e.g., "***4428"
  accountType: string;
}

interface CupoRotativoTransferResult {
  status: "success" | "error";
  sourceAccount: string;
  destinationAccount: string;
  amountTransferred: number;
  transactionCost: number;
  transactionDate: string;
  transactionTime: string;
  approvalNumber: string;
  description: string;
}
```

### User Data for Confirmation

```typescript
interface UserConfirmationData {
  holderName: string; // e.g., "CAMILO ANDRÉS CRUZ"
  documentNumber: string; // e.g., "CC 1.***.***234" (masked)
}
```

---

## Validation Rules

### Step 1: Cupo Selection & Details

- **Cupo Rotativo**: Required - must select one option
- **Destination Account**: Required - must select from dropdown
- **Amount**:
  - Required
  - Must be > 0
  - Must not exceed selected cupo's available amount
  - Error message: "El valor supera el cupo disponible."
- **Captcha**: Required (placeholder for now)

### Step 3: SMS Verification

- **OTP Code**: Required, exactly 6 digits

---

## Mock Data Structure

```typescript
// Mock cupos rotativos
export const mockCuposRotativos: CupoRotativo[] = [
  {
    id: "1",
    name: "Cupo Rotativo Personal",
    availableAmount: 2000000,
    totalAmount: 5000000,
  },
  {
    id: "2",
    name: "Cupo Rotativo Personal",
    availableAmount: 2000000,
    totalAmount: 5000000,
  },
];

// Mock destination accounts (reuse existing)
export const mockDestinationAccounts: DestinationAccount[] = [
  {
    id: "1",
    name: "Cuenta de Ahorros",
    maskedNumber: "***4428",
    accountType: "Ahorros",
  },
];

// Mock user data
export const mockUserData = {
  holderName: "CAMILO ANDRÉS CRUZ",
  documentNumber: "CC 1.***.***234",
};

// Mock successful result
export const mockCupoRotativoResult: CupoRotativoTransferResult = {
  status: "success",
  sourceAccount: "Cuenta de Ahorros",
  destinationAccount: "Cuenta de Ahorros (****4522)",
  amountTransferred: 1000000,
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "250606",
  description: "Transferencia Exitosa",
};
```

---

## Accessibility Considerations

- Stepper should announce current step to screen readers
- Radio button group should have proper `role="radiogroup"` and labels
- Form inputs should have proper labels and aria attributes
- Error messages should be associated with inputs via `aria-describedby`
- Focus should move to relevant elements when navigating between steps
- Success/error states should be announced via `aria-live` regions
- All interactive elements should have visible focus states

---

## Error States

### Validation Errors (Step 1)

- Amount exceeds available: "El valor supera el cupo disponible."
- No cupo selected: "Por favor selecciona un cupo rotativo."
- No destination selected: "Por favor selecciona una cuenta destino."
- Invalid amount: "Por favor ingresa un valor válido."

### Transaction Errors (Step 4)

- Failed transaction displays:
  - Red error icon instead of green success icon
  - Title: "Transacción Fallida" or similar
  - Description field shows error reason
  - Only "Realizar otra transacción" and "Finalizar" buttons shown

---

## Related Features

This flow is part of the larger Transferencias module:

### Internas (Internal Transfers)

- **Entre mis cuentas** - Between own accounts (Feature 10)
- **A cuentas de mi red** - To network accounts (Feature 10a)
- **Desde cupos rotativos** - From revolving credit (this feature - 10b)
- **Recargar con PSE** - PSE recharge (planned)

---

## Implementation Notes

1. **Enable Flow Option**: Update `InternasFlowGrid.tsx` to enable the "desde-cupos-rotativos" flow option (currently `enabled: false`)

2. **Reuse TRANSFER_STEPS**: The existing `TRANSFER_STEPS` constant from `mockTransferData.ts` can be reused as the stepper labels are identical

3. **Session Storage**: Follow existing pattern of using sessionStorage to pass data between steps

4. **Route Handler**: Add route handling in `/transferencias/internas/page.tsx` for the new flow

5. **Component Similarities**: The SMS verification (Step 3) and Result (Step 4) pages are very similar to existing flows and can potentially reuse/extend existing components
