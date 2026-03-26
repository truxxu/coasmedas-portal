# Feature 10c - Transferencias: Recargar con PSE

## Overview

This feature implements the internal transfer flow for "Recargar con PSE" (Recharge with PSE) within the Transferencias (Transfers) module. This flow allows users to bring money from any external financial institution via PSE (Pagos Seguros en Línea) to their Coasmedas savings accounts.

## Figma Design References

| Step | Page Name                           | Figma Node     | URL                                                                                               |
| ---- | ----------------------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| 1    | Detalle (Recharge Details)          | `810-1074`     | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-1074) |
| 2    | Confirmación (Payment Confirmation) | `810-1076`     | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-1076) |
| 3    | PSE Loading                         | N/A (Existing) | Uses existing `PSELoadingCard` component                                                          |
| 4    | Finalización (Response)             | `810-1078`     | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=810-1078) |

---

## Flow Structure

The recharge flow consists of 4 steps, displayed via a **Stepper** component:

```
1. Detalle → 2. Confirmación → 3. SMS → 4. Finalización
```

**Note**: Step 3 is labeled "SMS" in the stepper for consistency with other flows, but this PSE flow actually redirects to the PSE external payment gateway instead of SMS verification.

### Stepper States

- **Active Step**: Blue circle (`#007FFF`) with white number
- **Completed Step**: Blue circle (`#007FFF`) with white number, blue connecting line
- **Pending Step**: Gray circle (`#E4E6EA`) with gray number (`#808284`)
- **Connecting Lines**: Blue (`#007FFF`) for completed, Gray (`#E4E6EA`) for pending

---

## Step 1: Detalle (Recharge Details)

### Page Header

- **Back Button**: Arrow left icon
- **Title**: "Recargar con PSE" (20px, Ubuntu Medium, black)
- **Breadcrumbs**: `Inicio / Transferencias / Recargar con PSE`
- **Hide Balances Toggle**: Top right corner

### Main Content Card

- **Section Title**: "Recargar mis cuentas con PSE" (18px, Ubuntu Bold, `#1D4E8F`)
- **Description**: "Trae dinero desde cualquier otra entidad financiera de forma fácil y segura." (15px, Ubuntu Regular, black)

### Destination Account Selection

- **Label**: "¿A qué producto quieres abonar?" (14px, Ubuntu Regular, black)
- **Select Input**: Dropdown with account options
  - Format: "Cuenta de Ahorros (\*\*\*4428) - Saldo: $ 8.730.500"
  - Border: Gray (`#B1B1B1`)
  - Chevron: Down arrow icon
  - Height: 44px
  - Border radius: 6px

### Recharge Amount

- **Label**: "¿Qué valor deseas recargar?" (14px, Ubuntu Regular, black)
- **Amount Input**:
  - Currency symbol: "$" (21px, Ubuntu Bold, black) - Left aligned
  - Amount value: Right-aligned (21px, Ubuntu Bold, black)
  - Placeholder/Initial value: "0"
  - Underline separator: Gray (`#B1B1B1`)

### Footer Actions

- **Volver Link**: Left-aligned (14px, Ubuntu Medium, `#004266`)
  - Cursor: pointer
- **Confirmar Button**: Disabled state until form is valid
  - Background: `#A6C4FF` (disabled) / `#007FFF` (enabled)
  - Text: "Confirmar" (14px, Ubuntu Bold, white)
  - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
  - Border radius: 6px
  - Padding: `9px 28px`

---

## Step 2: Confirmación (Payment Confirmation)

### Page Header

- Same as Step 1

### Main Content Card

- **Section Title**: "Confirmación de Pago" (18px, Ubuntu Bold, `#1D4E8F`)
- **Description**: "Por favor, verificar que los datos de la transacción sean correctos antes de continuar." (15px, Ubuntu Light, black)

### Confirmation Details

Two-column layout with label-value pairs:

| Label               | Value Example                  | Value Style                 |
| ------------------- | ------------------------------ | --------------------------- |
| Titular             | CAMILO ANDRÉS CRUZ             | 15px, Ubuntu Regular, black |
| Documento           | CC 1.***.***234                | 15px, Ubuntu Regular, black |
| Producto a Recargar | Cuenta de Ahorros (\*\*\*4428) | 15px, Ubuntu Regular, black |
| Valor a Recargar    | $ 500.000                      | 15px, Ubuntu Regular, black |
| Método              | PSE                            | 17px, Ubuntu Medium, black  |

- **Labels**: Left-aligned (15px, Ubuntu Light, black)
- **Values**: Right-aligned
- **Divider**: Horizontal line (`#E4E6EA`) between "Documento" and "Producto a Recargar" rows

### Footer Actions

- **Volver Link**: Left-aligned (14px, Ubuntu Medium, `#004266`)
- **Confirmar Pago Button**: Primary blue button
  - Background: Gradient `linear-gradient(to right, #007FFF, #007FFF)`
  - Text: "Confirmar Pago" (14px, Ubuntu Bold, white)
  - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
  - Border radius: 6px
  - Padding: `9px 28px`

---

## Step 3: PSE Loading (Redirect)

### Behavior

After clicking "Confirmar Pago" in Step 2:

1. Display loading state with PSE redirect message
2. Redirect user to external PSE payment gateway
3. Upon return from PSE, proceed to Step 4 (Result)

### Component to Reuse

- Use existing `PSELoadingCard` component from the pagos feature
- Display message: "Redirigiendo al portal de PSE..."
- Show loading spinner

---

## Step 4: Finalización (Transaction Response)

### Page Header

- Same as previous steps
- **Note**: Stepper shows all 4 steps completed (blue)

### Success Indicator

- **Icon**: Green checkmark inside teal/green circle
  - Outer circle: Teal/green stroke (`#00AFA9`)
  - Checkmark: Green (`#00AFA9`)
  - Circle size: Approximately 60px diameter
- **Title**: "Transacción Exitosa" (22px, Ubuntu Bold, `#1D4E8F`)
- **Layout**: Centered above the details card

### Transaction Details Card

Two sections separated by a horizontal divider:

#### Section 1: Recharge Information

| Label                | Value Example                    | Value Style                |
| -------------------- | -------------------------------- | -------------------------- |
| Producto Recargado   | Cuenta de Ahorros (\*\*\*\*4428) | 15px, Ubuntu Medium, black |
| Valor Recargado      | $ 500.000                        | 15px, Ubuntu Medium, black |
| Método               | PSE                              | 18px, Ubuntu Medium, black |
| Costo de Transacción | $ 0                              | 15px, Ubuntu Medium, black |

#### Section 2: Transaction Metadata (after divider)

| Label                | Value Example           | Value Style                            |
| -------------------- | ----------------------- | -------------------------------------- |
| Fecha de Transacción | 1 de septiembre de 2025 | 15px, Ubuntu Medium, black             |
| Hora de Transacción  | 7:21 pm                 | 15px, Ubuntu Medium, black             |
| Número de Aprobación | 150606                  | 15px, Ubuntu Medium, black             |
| Descripción          | Recarga Exitosa         | 15px, Ubuntu Medium, `#00A44C` (green) |

- **Labels**: Left-aligned (15px, Ubuntu Regular, black)
- **Values**: Right-aligned
- **Divider**: Horizontal line (`#E4E6EA`)

### Footer Actions (3 buttons)

1. **Imprimir/Guardar**: Secondary outline button (left)
   - Border: `1px solid #1D4E8F`
   - Text: "Imprimir/Guardar" (16px, Ubuntu Bold, `#1D4E8F`)
   - Background: White
   - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
   - Border radius: 6px
   - Padding: `9px 28px`

2. **Realizar otra transacción**: Secondary outline button (center)
   - Border: `1px solid #1D4E8F`
   - Text: "Realizar otra transacción" (16px, Ubuntu Bold, `#1D4E8F`)
   - Background: White
   - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
   - Border radius: 6px
   - Padding: `9px 28px`

3. **Finalizar**: Primary blue button (right)
   - Background: `#007FFF`
   - Text: "Finalizar" (14px, Ubuntu Bold, white)
   - Shadow: `0px 2px 4px rgba(0,0,0,0.1)`
   - Border radius: 6px
   - Padding: `9px 28px`

---

## Color Palette

| Color Name          | Hex Code  | Usage                                       |
| ------------------- | --------- | ------------------------------------------- |
| Primary Navy        | `#1D4E8F` | Section titles, outline buttons border/text |
| Primary Blue        | `#007FFF` | Primary buttons, stepper active             |
| Disabled Blue       | `#A6C4FF` | Disabled button background                  |
| Success Green       | `#00A44C` | Success message text (Recarga Exitosa)      |
| Teal (Success Icon) | `#00AFA9` | Success checkmark circle                    |
| Text Black          | `#111827` | Primary text                                |
| Gray Medium         | `#808284` | Inactive stepper numbers                    |
| Gray Lines          | `#E4E6EA` | Borders, dividers, inactive stepper         |
| Gray Border         | `#B1B1B1` | Input borders, underlines                   |
| Light Blue BG       | `#F0F9FF` | Main content area background                |
| Link Dark           | `#004266` | "Volver" link                               |

---

## Typography

| Element               | Font   | Size    | Weight         |
| --------------------- | ------ | ------- | -------------- |
| Page Title            | Ubuntu | 20px    | Medium         |
| Section Title         | Ubuntu | 18px    | Bold           |
| Card Title            | Ubuntu | 17-18px | Bold           |
| Success Title         | Ubuntu | 22px    | Bold           |
| Body Text             | Ubuntu | 15px    | Regular        |
| Body Text Light       | Ubuntu | 15px    | Light          |
| Labels                | Ubuntu | 14px    | Regular        |
| Amount Large          | Ubuntu | 21px    | Bold           |
| Amount Medium         | Ubuntu | 17-18px | Medium         |
| Button Text Primary   | Ubuntu | 14px    | Bold           |
| Button Text Secondary | Ubuntu | 16px    | Bold           |
| Link Text             | Ubuntu | 14px    | Medium         |
| Breadcrumbs           | Ubuntu | 15px    | Regular/Medium |

---

## Component Mapping

### Existing Components to Reuse

#### Atoms

- `BackButton` - Back navigation arrow
- `Button` - Primary and secondary variants
- `Card` - Container cards
- `Select` - Dropdown for account selection
- `CurrencyInput` - Currency formatted input
- `Divider` - Horizontal separator
- `SuccessIcon` - Green checkmark icon

#### Molecules

- `Breadcrumbs` - Navigation trail
- `HideBalancesToggle` - Balance visibility toggle
- `Stepper` - 4-step progress indicator
- `ConfirmationRow` - Label-value pair for confirmations
- `PaymentSummaryRow` - Similar to ConfirmationRow, can be reused

#### Organisms

- `PSELoadingCard` - PSE redirect loading state (from pagos feature)
- `TransferResultCard` - Success/error result display (may need adaptation or create new)

### New Components to Create

#### Molecules

- None required (can reuse existing)

#### Organisms

- `PSERechargeDetailsCard` - Form card with destination account dropdown and amount input
- `PSERechargeConfirmationCard` - Confirmation details card for PSE recharge
- `PSERechargeResultCard` - Transaction result card specific to PSE recharge (or extend existing TransferResultCard)

---

## Page Routes

```
/transferencias/internas/recargar-pse                → Step 1: Recharge Details
/transferencias/internas/recargar-pse/confirmacion   → Step 2: Confirmation
/transferencias/internas/recargar-pse/pse            → Step 3: PSE Loading/Redirect
/transferencias/internas/recargar-pse/resultado      → Step 4: Transaction Result
```

---

## State Management

### Transfer Flow State

```typescript
interface PSERechargeState {
  currentStep: 1 | 2 | 3 | 4;
  destinationAccountId: string | null;
  amount: number;
  transactionResult: PSERechargeResult | null;
  isLoading: boolean;
  error: string | null;
}

interface DestinationAccount {
  id: string;
  name: string; // e.g., "Cuenta de Ahorros"
  maskedNumber: string; // e.g., "***4428"
  balance: number; // e.g., 8730500
  accountType: string;
}

interface PSERechargeResult {
  status: "success" | "error";
  productRecharged: string; // e.g., "Cuenta de Ahorros (****4428)"
  amountRecharged: number; // e.g., 500000
  method: string; // "PSE"
  transactionCost: number; // e.g., 0
  transactionDate: string; // e.g., "1 de septiembre de 2025"
  transactionTime: string; // e.g., "7:21 pm"
  approvalNumber: string; // e.g., "150606"
  description: string; // e.g., "Recarga Exitosa"
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

### Step 1: Recharge Details

- **Destination Account**: Required - must select from dropdown
- **Amount**:
  - Required
  - Must be > 0
  - Minimum/maximum limits may apply (to be defined by business rules)
  - Error message: "Por favor ingresa un valor válido."

### Button States

- **Confirmar Button**: Disabled (`#A6C4FF`) when:
  - No account selected
  - Amount is 0 or empty
- **Confirmar Button**: Enabled (`#007FFF`) when:
  - Account is selected
  - Amount is > 0

---

## Mock Data Structure

```typescript
// Mock destination accounts with balance
export const mockPSERechargeAccounts: DestinationAccount[] = [
  {
    id: "1",
    name: "Cuenta de Ahorros",
    maskedNumber: "***4428",
    balance: 8730500,
    accountType: "Ahorros",
  },
  {
    id: "2",
    name: "Cuenta de Ahorros",
    maskedNumber: "***5512",
    balance: 1250000,
    accountType: "Ahorros",
  },
];

// Mock user data
export const mockPSERechargeUserData = {
  holderName: "CAMILO ANDRÉS CRUZ",
  documentNumber: "CC 1.***.***234",
};

// Mock successful result
export const mockPSERechargeResult: PSERechargeResult = {
  status: "success",
  productRecharged: "Cuenta de Ahorros (****4428)",
  amountRecharged: 500000,
  method: "PSE",
  transactionCost: 0,
  transactionDate: "1 de septiembre de 2025",
  transactionTime: "7:21 pm",
  approvalNumber: "150606",
  description: "Recarga Exitosa",
};
```

---

## Accessibility Considerations

- Stepper should announce current step to screen readers
- Dropdown select should have proper `aria-label` and keyboard navigation
- Form inputs should have proper labels and aria attributes
- Amount input should announce currency symbol context
- Error messages should be associated with inputs via `aria-describedby`
- Focus should move to relevant elements when navigating between steps
- Success/error states should be announced via `aria-live` regions
- All interactive elements should have visible focus states
- Buttons should have appropriate `aria-disabled` state when disabled

---

## Error States

### Validation Errors (Step 1)

- No account selected: "Por favor selecciona una cuenta destino."
- Invalid amount (0 or empty): "Por favor ingresa un valor válido."
- Amount below minimum: "El valor mínimo de recarga es $ X."
- Amount above maximum: "El valor máximo de recarga es $ X."

### PSE Errors (Step 3/4)

- PSE timeout: Display error message and allow retry
- PSE payment declined: Show error result screen with reason
- PSE connection error: Display error and allow retry

### Transaction Errors (Step 4)

- Failed transaction displays:
  - Red error icon instead of green success icon
  - Title: "Transacción Fallida" or similar
  - Description field shows error reason (e.g., "Pago rechazado por el banco")
  - Only "Realizar otra transacción" and "Finalizar" buttons shown

---

## Related Features

This flow is part of the larger Transferencias module:

### Internas (Internal Transfers)

- **Entre mis cuentas** - Between own accounts (Feature 10)
- **A cuentas de mi red** - To network accounts (Feature 10a)
- **Desde cupos rotativos** - From revolving credit (Feature 10b)
- **Recargar con PSE** - PSE recharge (this feature - 10c)

---

## Implementation Notes

1. **Enable Flow Option**: Update `InternasFlowGrid.tsx` to add/enable the "recargar-pse" flow option

2. **Stepper Labels**: Use existing `TRANSFER_STEPS` pattern with labels: Detalle, Confirmación, SMS, Finalización (Note: "SMS" label kept for consistency even though this flow uses PSE)

3. **Session Storage**: Follow existing pattern of using sessionStorage to pass data between steps

4. **Route Handler**: Add route handling in `/transferencias/internas/page.tsx` for the new flow:

   ```typescript
   else if (flowId === "recargar-pse") {
     router.push("/transferencias/internas/recargar-pse");
   }
   ```

5. **PSE Integration**: The PSE loading step should:
   - Show loading state
   - Simulate redirect to PSE (in development)
   - Handle callback/return from PSE with transaction status

6. **Account Selection Format**: The dropdown should display accounts in format:
   `"Cuenta de Ahorros (***4428) - Saldo: $ 8.730.500"`

7. **Result Card Similarities**: The Result page (Step 4) is similar to other transfer result pages and can potentially reuse/extend existing `TransferResultCard` component with PSE-specific fields

8. **Types File**: Create `src/types/pse-recharge.ts` for TypeScript interfaces

9. **Mocks File**: Create or extend `src/mocks/mockPSERechargeData.ts` for mock data

---

## Key Differences from Other Transfer Flows

| Aspect          | Other Flows (10, 10a, 10b) | PSE Recharge (10c)                  |
| --------------- | -------------------------- | ----------------------------------- |
| Verification    | SMS code verification      | PSE external redirect               |
| Source          | Internal accounts/cupos    | External bank via PSE               |
| Method shown    | N/A or internal            | "PSE"                               |
| Step 3 behavior | Enter SMS code             | Loading + PSE redirect              |
| Account balance | Debited from source        | N/A (external source)               |
| Result labels   | Cuenta Origen/Destino      | Producto Recargado, Valor Recargado |

---

## Button State Summary

### Step 1 (Detalle)

| Condition                         | Confirmar Button     |
| --------------------------------- | -------------------- |
| No account selected OR amount = 0 | Disabled (`#A6C4FF`) |
| Account selected AND amount > 0   | Enabled (`#007FFF`)  |

### Step 2 (Confirmación)

| Condition | Confirmar Pago Button |
| --------- | --------------------- |
| Always    | Enabled (`#007FFF`)   |

### Step 4 (Finalización)

| Button                    | Style             | Action                 |
| ------------------------- | ----------------- | ---------------------- |
| Imprimir/Guardar          | Secondary outline | Download/Print receipt |
| Realizar otra transacción | Secondary outline | Navigate to Step 1     |
| Finalizar                 | Primary blue      | Navigate to /home      |
