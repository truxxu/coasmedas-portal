# Feature 10a - Transferencias: A Cuentas de mi Red

## Overview

This feature implements the internal transfer flow for "A Cuentas de mi Red" (To My Network Accounts) within the Transferencias (Transfers) module. This flow allows users to transfer money to previously registered accounts in their Coopcentral network.

## Figma Design References

| Step | Page Name | Figma Node | URL |
|------|-----------|------------|-----|
| 1 | Detalle (Registered Accounts) | `789-563` | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-563) |
| 2 | Confirmación (Transfer Details) | `789-787` | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-787) |
| 3 | SMS (Code Validation) | `789-898` | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-898) |
| 4 | Finalización (Response) | `789-1006` | [View Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=789-1006) |

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

## Step 1: Detalle (Registered Accounts List)

### Page Header
- **Back Button**: Arrow left icon
- **Title**: "A Cuentas de mi Red" (20px, Ubuntu Medium, black)
- **Breadcrumbs**: `Inicio / Transferencias / A Cuentas de mi Red`
- **Hide Balances Toggle**: Top right corner

### Main Content Card
- **Section Title**: "Transferencias a cuentas de mi Red Coopcentral" (18px, Ubuntu Bold, `#1D4E8F`)
- **Description**: "Transfiere a cuentas de asociados previamente inscritos en tu red." (15px, Ubuntu Regular, black)

### Registered Accounts List
Each account item displays:
- **Avatar**: Blue circle with user initials
- **Name**: Full name in uppercase (18px, Ubuntu Medium, `#1D4E8F`)
- **Product Count**: "X producto(s) disponible(s)" (14px, Ubuntu Regular, black)
- **Chevron**: Right arrow icon for navigation
- **Border**: Light gray bottom border between items

#### Sample Data
```
MARÍA FERNANDA GONZALEZ - 2 producto(s) disponible(s)
CARLOS ALBERTO PÉREZ - 1 producto(s) disponible(s)
JULIANA ANDREA BARRIOS - 1 producto(s) disponible(s)
```

### Info Note Box
- **Background**: Light blue (`#F0F9FF`)
- **Border**: Blue left border (`#007FFF`)
- **Text**: "Nota: Para transferir a un nuevo asociado, primero debes inscribir su cuenta en una de nuestras oficinas." (15px, `#1D4E8F`)

### Footer Actions
- **Volver Link**: "Volver" text link (14px, Ubuntu Medium, `#004266`)

---

## Step 2: Confirmación (Transfer Details Form)

### Page Header
- Same as Step 1

### Main Content Card
- **Section Title**: "Transferencias a [RECIPIENT_NAME]" (18px, Ubuntu Bold, `#1D4E8F`)
  - Example: "Transferencias a MARIA FERNANDA GONZALEZ"

### Form Fields

#### Source Account Select
- **Label**: "¿De cuál cuenta quieres transferir?" (15px, Ubuntu Regular, black)
- **Select Input**: Dropdown with account options
  - Format: "Cuenta de Ahorros - Saldo: $ X.XXX.XXX"
  - Example: "Cuenta de Ahorros - Saldo: $ 8.730.500"

#### Destination Product
- **Label**: "Selecciona el producto de destino:" (14px, Ubuntu Regular, black)
- **Selected Product Card**:
  - **Product Name**: "Cuenta de Ahorros (Ahorros ****4522)" (18px, Ubuntu Bold, `#1D4E8F`)
  - White background with light border

#### Transfer Amount
- **Label**: "Valor a Transferir" (14px, Ubuntu Regular, black)
- **Amount Input**:
  - Currency symbol: "$" (21px, Ubuntu Bold, black)
  - Amount value: Right-aligned (21px, Ubuntu Bold, black)
  - Example: "$ 350.000"
  - Underline separator

### Captcha Section
- **Placeholder**: Gray box with text "[Espacio para validación Captcha]"
- **Background**: Gray (`#F5F5F5`)

### Footer Actions
- **Volver Link**: Left-aligned (14px, Ubuntu Medium, `#004266`)
- **Confirmar Button**: Primary blue button (`#007FFF`), right-aligned
  - Text: "Confirmar" (14px, Ubuntu Bold, white)

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

### Resend Code Section
- **Text**: "¿No recibiste la clave?" (15px, Ubuntu Regular, black)
- **Link**: "Reenviar" (15px, Ubuntu Medium, `#1D4E8F`)
- **Underline**: Below resend section

### Footer Actions
- **Volver Link**: Left-aligned (14px, Ubuntu Medium, `#004266`)
- **Pagar Button**: Primary blue button (`#007FFF`), right-aligned
  - Text: "Pagar" (14px, Ubuntu Bold, white)

---

## Step 4: Finalización (Transaction Response)

### Page Header
- Same as previous steps

### Success Indicator
- **Icon**: Green checkmark inside teal/green circle
- **Title**: "Transacción Exitosa" (22px, Ubuntu Bold, `#1D4E8F`)

### Transaction Details Card
Two sections separated by a horizontal divider:

#### Section 1: Transfer Information
| Label | Value Example |
|-------|---------------|
| Cuenta Origen | Cuenta de Ahorros |
| Destinatario | MARIA FERNANDA GONZALEZ |
| Cuenta Destino | Cuenta de Ahorros (Ahorros ****4522) |
| Valor Transferido | $ 350.000 |
| Costo Transacción | $ 0 |

#### Section 2: Transaction Metadata
| Label | Value Example |
|-------|---------------|
| Fecha de Transacción | 1 de septiembre de 2025 |
| Hora de Transacción | 7:21 pm |
| Número de Aprobación | 450606 |
| Descripción | Transferencia Exitosa (green text `#00A44C`) |

### Footer Actions (3 buttons)
1. **Imprimir/Guardar**: Secondary outline button
   - Border: `#1D4E8F`
   - Text: "Imprimir/Guardar" (16px, Ubuntu Bold, `#1D4E8F`)
2. **Realizar otra transacción**: Secondary outline button
   - Border: `#1D4E8F`
   - Text: "Realizar otra transacción" (16px, Ubuntu Bold, `#1D4E8F`)
3. **Finalizar**: Primary blue button (`#007FFF`)
   - Text: "Finalizar" (14px, Ubuntu Bold, white)

---

## Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Navy | `#1D4E8F` | Section titles, links, product names |
| Primary Blue | `#007FFF` | Buttons, stepper active, links |
| Success Green | `#00A44C` | Success message text |
| Teal (Success Icon) | `#00AFA9` | Success checkmark circle |
| Text Black | `#111827` | Primary text |
| Gray Medium | `#808284` | Inactive stepper numbers |
| Gray Lines | `#E4E6EA` | Borders, dividers, inactive stepper |
| Gray Border | `#B1B1B1` | Input borders |
| Light Blue BG | `#F0F9FF` | Info note background, main content area |
| Link Dark | `#004266` | "Volver" link |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page Title | Ubuntu | 20px | Medium |
| Section Title | Ubuntu | 18px | Bold |
| Card Title | Ubuntu | 17-18px | Bold |
| Success Title | Ubuntu | 22px | Bold |
| Body Text | Ubuntu | 15px | Regular |
| Labels | Ubuntu | 14px | Regular |
| Button Text | Ubuntu | 14-16px | Bold |
| Link Text | Ubuntu | 14-15px | Medium |
| Small Text | Ubuntu | 12px | Regular |

---

## Component Mapping

### Existing Components to Reuse
- `BackButton` - Back navigation arrow
- `Breadcrumbs` - Navigation trail
- `HideBalancesToggle` - Balance visibility toggle
- `Button` - Primary and secondary variants
- `Card` - Container cards
- `Select` - Dropdown for account selection
- `Input` - Amount input field
- `Avatar` - User initials display
- `ChevronIcon` - Right arrow for list items
- `Divider` - Horizontal separator
- `Link` - Text links ("Volver", "Reenviar")

### New Components to Create

#### Atoms
- `StepperCircle` - Individual step indicator (active/completed/pending states)
- `OTPInput` - Single digit input for SMS code

#### Molecules
- `Stepper` - Horizontal stepper with 4 steps and connecting lines
- `RegisteredAccountItem` - List item for network accounts (avatar, name, product count, chevron)
- `TransferAmountInput` - Currency input with $ symbol and formatted amount
- `InfoNoteBox` - Blue-bordered info note component
- `TransactionDetailRow` - Label-value pair for transaction details
- `OTPInputGroup` - 6-digit code input group

#### Organisms
- `RegisteredAccountsList` - List of registered network accounts
- `TransferDetailsForm` - Form with source/destination/amount fields
- `SMSVerificationCard` - Code input with resend option
- `TransactionReceiptCard` - Success message with transaction details

---

## Page Routes

```
/transferencias/internas/cuentas-mi-red              → Step 1: Account Selection
/transferencias/internas/cuentas-mi-red/detalle      → Step 2: Transfer Details
/transferencias/internas/cuentas-mi-red/verificacion → Step 3: SMS Verification
/transferencias/internas/cuentas-mi-red/resultado    → Step 4: Transaction Result
```

---

## State Management

### Transfer Flow State
```typescript
interface TransferFlowState {
  currentStep: 1 | 2 | 3 | 4;
  selectedRecipient: RegisteredAccount | null;
  sourceAccount: UserAccount | null;
  destinationProduct: Product | null;
  amount: number;
  otpCode: string;
  transactionResult: TransactionResult | null;
}

interface RegisteredAccount {
  id: string;
  name: string;
  productCount: number;
  products: Product[];
}

interface Product {
  id: string;
  type: 'ahorros' | 'corriente';
  maskedNumber: string; // e.g., "****4522"
  name: string;
}

interface TransactionResult {
  success: boolean;
  approvalNumber: string;
  transactionDate: string;
  transactionTime: string;
  description: string;
}
```

---

## Validation Rules

### Step 2: Transfer Details
- Source account: Required
- Destination product: Required
- Amount: Required, must be > 0, must not exceed source account balance
- Captcha: Required (placeholder for now)

### Step 3: SMS Verification
- OTP Code: Required, exactly 6 digits

---

## Accessibility Considerations

- Stepper should announce current step to screen readers
- Form inputs should have proper labels and aria attributes
- Error messages should be associated with inputs
- Focus should move to relevant elements when navigating between steps
- Success/error states should be announced

---

## Related Features

This flow is part of the larger Transferencias module:

### Internas (Internal Transfers)
- **Entre mis cuentas** - Between own accounts
- **A cuentas de mi red** - To network accounts (this feature)
- **Desde cupos rotativos** - From revolving credit
- **Recargar con PSE** - PSE recharge

### Future Categories
- Externas (External Transfers)
- Programadas (Scheduled Transfers)
