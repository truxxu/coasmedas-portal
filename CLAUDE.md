# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portal Transaccional Coasmedas** - A Next.js 16 portal application using App Router, TypeScript, Tailwind CSS v4, and Atomic Design component architecture. The portal includes authentication, dashboard, product management (Aportes, Ahorros, Obligaciones, Inversiones, Protección), payments (own products, other associates, utility services), and internal transfers.

**Backend API**: This portal consumes the Coasmedas Banking API (REST). See API documentation in `.claude/knowledge/api/`

## Development Commands

### Running the Application

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Development Notes

- **Language**: Project uses Spanish (lang="es") for content
- **Node Version**: Requires Node.js >=18
- **Package Manager**: npm

## Architecture

### Next.js App Router (v16)

This project uses the **App Router** (not Pages Router):

- Routes are defined in `/app` directory using file-based routing
- `app/layout.tsx` provides root layout with metadata and fonts
- `app/page.tsx` maps to `/` route (Prehome landing page)
- **Route Groups**: `app/(authenticated)/` groups authenticated pages
- New public routes: create `app/[route-name]/page.tsx`
- New authenticated routes: create `app/(authenticated)/[route-name]/page.tsx`
- API routes: create in `app/api/[endpoint]/route.ts`

### Component Structure: Atomic Design Pattern

Components follow Atomic Design methodology in `/src`:

```
src/
├── atoms/       # Basic building blocks (Button, Input, Card, Toggle, etc.)
├── molecules/   # Simple combinations of atoms (NavBar, FormField, SidebarNavItem, etc.)
├── organisms/   # Complex sections (Sidebar, TopBar, LoginForm, etc.)
├── contexts/    # React contexts (UIContext, UserContext)
├── hooks/       # Custom hooks (useUI, useUser)
├── types/       # TypeScript type definitions
├── utils/       # Utility functions (formatCurrency, etc.)
└── mocks/       # Mock data for development
```

**Import Path**: Use `@/` alias for root imports:

```typescript
import { Button, Card } from "@/src/atoms";
import { SidebarNavItem } from "@/src/molecules";
import { Sidebar, TopBar } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { formatCurrency } from "@/src/utils";
import { Transaction } from "@/src/types";
```

### Styling with Tailwind CSS v4

- Global styles in `/app/globals.css`
- Uses new Tailwind v4 syntax: `@import "tailwindcss"`
- Brand colors defined as CSS variables (see Design System below)
- Custom brand classes: `bg-brand-navy`, `text-brand-primary`, etc.

### TypeScript Configuration

- **Path Alias**: `@/*` maps to root directory
- **Strict Mode**: Enabled
- **Target**: ES2017
- **JSX**: React 19 transform

### Current Project Structure

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Prehome (landing page)
├── login/page.tsx                # Login page
└── (authenticated)/              # Route group for authenticated pages
    ├── layout.tsx                # Authenticated layout (Sidebar, TopBar)
    ├── home/page.tsx             # Dashboard home
    ├── productos/                # Products feature
    │   ├── page.tsx              # Products index (redirects)
    │   ├── aportes/page.tsx      # Aportes product page
    │   ├── ahorros/page.tsx      # Ahorros product page
    │   ├── obligaciones/page.tsx # Obligaciones product page
    │   ├── inversiones/page.tsx  # Inversiones product page
    │   └── proteccion/page.tsx   # Protección product page
    ├── pagos/                    # Payments feature (09-pagos)
    │   ├── page.tsx              # Payments index
    │   ├── pagar-mis-productos/  # Pay my products
    │   │   ├── page.tsx          # Product selection
    │   │   ├── aportes/          # Aportes payment flow
    │   │   ├── obligaciones/     # Obligaciones payment flow
    │   │   ├── proteccion/       # Protection payment flow
    │   │   └── pago-unificado/   # Unified payment flow
    │   ├── otros-asociados/      # Pay other associates
    │   │   └── pago/             # Payment flow with beneficiary selection
    │   └── servicios-publicos/   # Utility payments
    │       ├── page.tsx          # Flow selection (register/pay)
    │       ├── inscribir/        # Utility registration flow
    │       └── pagar/            # Utility payment flow
    └── transferencias/           # Transfers feature (10-transferencias)
        └── internas/             # Internal transfers
            ├── page.tsx          # Transfer type selection
            ├── entre-mis-cuentas/# Between my accounts
            └── cuentas-mi-red/   # Network accounts (Coopcentral)
```

## Tech Stack

- **Next.js**: 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: ^5
- **Tailwind CSS**: ^4
- **ESLint**: ^9 with Next.js configuration
- **react-hook-form**: Form handling
- **yup**: Schema validation

## Important Patterns

### Component Creation

- Follow Atomic Design hierarchy (atoms → molecules → organisms)
- Export all components from `index.ts` in each directory
- Use TypeScript interfaces for all props

### State Management

- **UIContext**: UI state (hideBalances, sidebarExpanded, mobileSidebarOpen)
- **UserContext**: User authentication state
- Access via hooks: `useUIContext()`, `useUserContext()`

### Currency & Number Formatting

```typescript
import { formatCurrency, maskCurrency } from "@/src/utils";

formatCurrency(890058); // "$ 890.058"
maskCurrency(); // "$ ****"
```

### Hide Balances Pattern

```typescript
const { hideBalances } = useUIContext();
{
  hideBalances ? maskCurrency() : formatCurrency(amount);
}
```

### Adding New Features

1. Create feature documentation in `.claude/knowledge/features/{feature-name}/`
2. Create types in `src/types/`
3. Create utility functions in `src/utils/`
4. Build atoms → molecules → organisms
5. Create page in `app/(authenticated)/`
6. Update index exports in each directory

---

## Additional Guidelines

@.claude/coding-standards.md
@.claude/workflows.md

<!-- @.claude/documentation-policy.md -->

@.claude/design-system.md

<!-- ## Backend API Documentation

@.claude/knowledge/api/README.md -->

<!-- ## Features

### Prehome Landing Page (Feature 00)
@.claude/knowledge/features/00-prehome/spec.md
@.claude/knowledge/features/00-prehome/references.md
@.claude/knowledge/features/00-prehome/implementation-plan.md

### Products - Aportes (Feature 03)
@.claude/knowledge/features/03-products/spec.md
@.claude/knowledge/features/03-products/references.md
@.claude/knowledge/features/03-products/implementation-plan.md

### Products - Ahorros (Feature 04)
@.claude/knowledge/features/04-ahorros/spec.md
@.claude/knowledge/features/04-ahorros/references.md
@.claude/knowledge/features/04-ahorros/implementation-plan.md

### Products - Obligaciones (Feature 05)
@.claude/knowledge/features/05-obligaciones/spec.md
@.claude/knowledge/features/05-obligaciones/references.md
@.claude/knowledge/features/05-obligaciones/implementation-plan.md

### Products - Inversiones (Feature 06)
@.claude/knowledge/features/06-inversiones/spec.md
@.claude/knowledge/features/06-inversiones/references.md
@.claude/knowledge/features/06-inversiones/implementation-plan.md

### Products - Protección (Feature 07)
@.claude/knowledge/features/07-proteccion/spec.md
@.claude/knowledge/features/07-proteccion/references.md
@.claude/knowledge/features/07-proteccion/implementation-plan.md

--- -->

## Existing Components Reference

### Atoms (src/atoms/)

- `Button` - Primary, secondary, outline, cta variants
- `Card` - default, bordered, news variants
- `Input` - Form text input with error state
- `Select` - Dropdown with options
- `Label` - Form labels
- `ErrorMessage` - Form error display
- `Toggle` - Switch toggle component
- `Avatar` - User avatar with initials
- `Divider` - Horizontal divider (light/dark)
- `ChevronIcon` - Directional chevron (left/right/up/down)
- `Logo` - Coasmedas logo
- `Link` - Styled link component
- `SectionTitle` - Section headings
- `DateInput` - Date picker input with calendar icon
- `BackButton` - Back navigation arrow button
- `AppStoreButton` - App Store download button
- `GooglePlayButton` - Google Play download button
- `CarouselArrow` - Navigation arrow button for carousels (left/right)
- `CarouselDots` - Pagination dot indicators for carousels
- `Checkbox` - Checkbox input with label support
- `CodeInput` - Single digit input for SMS/OTP codes
- `CurrencyInput` - Currency input with formatting
- `ErrorIcon` - Error state icon (red X)
- `SuccessIcon` - Success state icon (green checkmark)
- `InfoBox` - Information box with icon and text
- `StepperCircle` - Circular step indicator for stepper
- `StepperConnector` - Connector line between stepper steps

### Molecules (src/molecules/)

#### Navigation & Layout
- `SidebarNavItem` - Sidebar navigation item (supports expandable with children)
- `SidebarSubItem` - Sub-navigation item for sidebar accordion
- `NavBar` - Top navigation bar
- `Breadcrumbs` - Breadcrumb navigation trail
- `HideBalancesToggle` - Toggle for hiding balances
- `UserAvatar` - Avatar with user name
- `UserDropdown` - User menu dropdown

#### Form Components
- `FormField` - Label + Input + Error combination
- `SelectField` - Label + Select + Error combination
- `PasswordField` - Password input with visibility toggle
- `DateRangeFilter` - Start/end date filter with apply button
- `CaptchaPlaceholder` - Captcha placeholder component
- `CodeInputGroup` - Group of CodeInput fields for SMS/OTP verification
- `TransferAmountInput` - Amount input with source account balance display

#### Product Cards (for carousels)
- `SavingsProductCard` - Savings product card for carousel
- `ObligacionProductCard` - Loan product card with extended fields
- `InversionProductCard` - Investment/CDAT product card with term details
- `ProteccionProductCard` - Insurance/protection product card without main balance

#### Payment Components
- `PaymentOptionCard` - Selectable payment option card
- `PaymentSummaryRow` - Row displaying payment detail (label + value)
- `PaymentTypeButton` - Button for selecting payment type (PSE/cuenta)
- `AportesPaymentDetailRow` - Detailed payment row for aportes
- `ObligacionPaymentCard` - Loan payment selection card
- `ProtectionPaymentCard` - Insurance payment selection card
- `PayableProductCard` - Card for selecting products to pay
- `ConfirmationRow` - Row for confirmation screens (label + value)

#### Transfer Components
- `DestinationProductCard` - Card for selecting destination account
- `RegisteredAccountItem` - Item in registered accounts list
- `InfoNoteBox` - Information note with icon

#### Transaction & Display
- `TransactionItem` - Single transaction display
- `QuickAccessCard` - Quick action cards
- `FlowOptionCard` - Option card for flow selection
- `BeneficiaryListItem` - Beneficiary item in selection list
- `Stepper` - Multi-step progress indicator

#### Prehome/Landing
- `HeroBanner` - Hero section for landing pages
- `WelcomeSection` - Welcome message section
- `ServiceCard` - Service feature card
- `NewsCard` - News article card
- `InfoCard` - Information card
- `AppPromoSection` - App promotion section
- `Footer` - Page footer

### Organisms (src/organisms/)

#### Layout & Navigation
- `Sidebar` - Main navigation sidebar with product accordion
- `TopBar` - Top header bar
- `WelcomeBar` - Welcome message bar
- `SessionFooter` - Session info footer

#### Authentication
- `LoginForm` - Complete login form
- `LoginCard` - Login card container

#### Dashboard
- `AccountSummaryCard` - Account balance card
- `RecentTransactions` - Transaction list
- `QuickAccessGrid` - Grid of quick actions

#### Product Pages
- `AportesInfoCard` - Aportes product information card
- `TransactionHistoryCard` - Transaction list with date filter (reusable)
- `DownloadReportsCard` - Monthly report download (reusable)
- `ProductCarousel` - Reusable carousel for savings products
- `ObligacionCarousel` - Carousel for loan/credit products
- `InversionCarousel` - Carousel for investment/CDAT products
- `ProteccionCarousel` - Carousel for insurance/protection products

#### Payment Flow Components
- `PaymentOptionsGrid` - Grid of payment options (pagar mis productos)
- `PaymentDetailsCard` - Payment details form card
- `PaymentConfirmationCard` - Payment confirmation display
- `CodeInputCard` - SMS/OTP code input card
- `TransactionResultCard` - Generic transaction result (success/error)
- `PSELoadingCard` - PSE redirect loading state

#### Aportes Payment
- `AportesDetailsCard` - Aportes payment details
- `AportesConfirmationCard` - Aportes payment confirmation
- `AportesTransactionResultCard` - Aportes payment result

#### Obligaciones Payment
- `ObligacionDetailsCard` - Loan payment details
- `ObligacionConfirmationCard` - Loan payment confirmation
- `ObligacionResultCard` - Loan payment result

#### Protection Payment
- `ProtectionPaymentDetailsCard` - Insurance payment details
- `ProtectionPaymentConfirmationCard` - Insurance payment confirmation
- `ProtectionPaymentResultCard` - Insurance payment result

#### Otros Asociados Payment
- `BeneficiarySelectionCard` - Beneficiary selection for other associates
- `OtrosAsociadosDetailsCard` - Other associates payment details
- `OtrosAsociadosConfirmationCard` - Other associates confirmation
- `OtrosAsociadosResultCard` - Other associates payment result

#### Utility Services
- `FlowSelectionCard` - Flow selection (register/pay utility)
- `UtilityRegistrationForm` - Utility service registration form
- `UtilityConfirmationCard` - Utility registration confirmation
- `UtilityRegistrationResultCard` - Utility registration result
- `UtilityPaymentDetailsForm` - Utility payment details form
- `UtilityPaymentConfirmationCard` - Utility payment confirmation
- `UtilityPaymentResultCard` - Utility payment result

#### Transfers
- `InternasFlowGrid` - Internal transfer type selection grid
- `TransferDetailsCard` - Transfer details form
- `TransferConfirmationCard` - Transfer confirmation display
- `TransferResultCard` - Transfer result display
- `NetworkTransferForm` - Network transfer (Coopcentral) form
- `RegisteredAccountsList` - List of registered accounts
- `NetworkTransferResultCard` - Network transfer result

#### Prehome/Landing
- `PrehomeHeader` - Prehome page header
- `PrehomeHero` - Prehome hero section
- `PrehomeWelcome` - Prehome welcome section
- `PrehomeServices` - Prehome services grid
- `PrehomeNews` - Prehome news section
- `PrehomeInfo` - Prehome info section
- `PrehomeApp` - Prehome app promotion
- `PrehomeFooter` - Prehome footer

### Contexts (src/contexts/)

- `UIContext` - hideBalances, sidebarExpanded, mobileSidebarOpen
- `UserContext` - User authentication state
- `WelcomeBarContext` - Welcome bar visibility state

### Types (src/types/)

#### Core Types
- `User` - User information
- `Account` - Account data
- `Transaction` - Transaction data
- `ProductType` - Union type for all product types
- `ProductDetail` - Product detail (vigentes, enMora, fechaCubrimiento)
- `MonthOption` - Month dropdown option
- `DateRangeFilter` - Date range filter state

#### Product Types
- `AportesProduct` - Aportes product data
- `SavingsProduct` - Savings product data
- `SavingsStatus` - Savings status (activo/bloqueado/inactivo)
- `ObligacionProduct` - Loan/credit product data
- `ObligacionStatus` - Loan status (al_dia/en_mora)
- `InversionProduct` - Investment/CDAT product data
- `InversionStatus` - Investment status (activo/vencido)
- `ProteccionProduct` - Insurance/protection product data
- `ProteccionStatus` - Protection status (activo/inactivo/cancelado)

#### Payment Types (src/types/payment.ts)
- `PaymentOption` - Payment option configuration
- `PaymentMethod` - Payment method (pse/cuenta)
- `PaymentState` - Current payment flow state

#### Stepper Types (src/types/stepper.ts)
- `StepperStep` - Individual step configuration
- `StepStatus` - Step status (pending/active/completed)

#### Aportes Payment (src/types/aportes-payment.ts)
- `AportesPaymentData` - Aportes payment form data
- `AportesPaymentConfirmation` - Confirmation data

#### Obligacion Payment (src/types/obligacion-payment.ts)
- `ObligacionPaymentData` - Loan payment form data
- `ObligacionPaymentState` - Loan payment flow state

#### Otros Asociados Payment (src/types/otros-asociados-payment.ts)
- `Beneficiary` - Beneficiary data
- `OtrosAsociadosPaymentData` - Payment to other associates data

#### Utility Types (src/types/utility-registration.ts, utility-payment.ts)
- `UtilityService` - Utility service data
- `UtilityRegistrationData` - Utility registration form data
- `UtilityPaymentData` - Utility payment form data

#### Protection Payment (src/types/protection-payment.ts)
- `ProtectionPaymentData` - Insurance payment data
- `ProtectionPaymentState` - Insurance payment flow state

#### Transfer Types (src/types/transfer.ts, networkTransfer.ts)
- `TransferData` - Internal transfer data
- `TransferConfirmation` - Transfer confirmation data
- `NetworkTransferData` - Network (Coopcentral) transfer data
- `RegisteredAccount` - Registered external account

### Utils (src/utils/)

- `formatCurrency(amount)` - Format as Colombian Peso
- `maskCurrency()` - Returns masked currency string ("$ \*\*\*\*")
- `maskNumber(number)` - Mask account/product numbers ("\*\*\*4428")
- `generateInitials(name)` - Get initials from name
- `formatDate(date)` - Format date for display (Spanish locale)
- `generateMonthOptions(count)` - Generate month options for dropdowns
- `isValidDateRange(start, end, maxMonths)` - Validate date range

### Mocks (src/mocks/)

#### Product Mocks
- `mockAportesData` - Aportes product mock data
- `mockTransactions` - Transaction list mock data
- `mockAvailableMonths` - Available months for reports
- `mockSavingsProducts` - Savings products for carousel
- `mockAhorrosTransactions` - Savings transactions
- `mockObligacionProducts` - Loan products for carousel
- `mockObligacionTransactions` - Loan transactions
- `mockInversionProducts` - Investment products for carousel
- `mockInversionesTransactions` - Investment transactions
- `mockProteccionProducts` - Insurance/protection products for carousel
- `mockProteccionTransactions` - Protection transactions

#### Payment Mocks
- `mockPaymentOptions` - Payment options for pagar mis productos
- `mockAportesPaymentData` - Aportes payment mock data
- `mockObligacionPaymentData` - Loan payment mock data
- `mockOtrosAsociadosPaymentData` - Other associates payment mock data
- `mockProtectionPaymentData` - Insurance payment mock data

#### Utility Mocks
- `mockUtilityRegistrationData` - Utility registration mock data
- `mockUtilityPaymentData` - Utility payment mock data

#### Transfer Mocks
- `mockTransferData` - Internal transfer mock data
- `mockNetworkTransferData` - Network transfer mock data

---

## Product Pages Pattern

Product pages follow a consistent structure with reusable components:

### Page Structure

```tsx
// app/(authenticated)/productos/{product}/page.tsx
<div className="space-y-6">
  {/* Header: BackButton + Title + Breadcrumbs + HideBalancesToggle */}
  <ProductPageHeader title="..." breadcrumbs={[...]} />

  {/* Section 1: Product-specific info card or carousel */}
  <ProductInfoCard /> // or <ProductCarousel />

  {/* Section 2: Transaction History (reusable) */}
  <TransactionHistoryCard title="..." transactions={...} onFilter={...} />

  {/* Section 3: Download Reports (reusable) */}
  <DownloadReportsCard availableMonths={...} onDownload={...} />
</div>
```

### Reusable Components Across Product Pages

- `TransactionHistoryCard` - Transaction list with date filter
- `DownloadReportsCard` - Monthly PDF report download
- `Breadcrumbs` - Navigation breadcrumbs
- `BackButton` - Back navigation
- `HideBalancesToggle` - Balance visibility toggle

### Product-Specific Components

- **Aportes**: `AportesInfoCard` - Static info card with plan details
- **Ahorros**: `ProductCarousel` + `SavingsProductCard` - Selectable product carousel
- **Obligaciones**: `ObligacionCarousel` + `ObligacionProductCard` - Loan/credit product carousel with extended card design
- **Inversiones**: `InversionCarousel` + `InversionProductCard` - Investment/CDAT product carousel with term details
- **Protección**: `ProteccionCarousel` + `ProteccionProductCard` - Insurance/protection product carousel without main balance field

---

## Pagos (Payments) Feature Pattern

The Pagos feature implements multiple payment flows with a consistent multi-step pattern.

### Payment Flow Structure

All payment flows follow a similar step pattern:

```
1. Product/Beneficiary Selection → 2. Payment Details → 3. Confirmation → 4. Verification (SMS/PSE) → 5. Result
```

### Available Payment Flows

| Flow | Route | Description |
|------|-------|-------------|
| Pagar mis productos | `/pagos/pagar-mis-productos` | Pay own products (Aportes, Obligaciones, Protección) |
| Pago Unificado | `/pagos/pagar-mis-productos/pago-unificado` | Pay multiple products at once |
| Otros Asociados | `/pagos/otros-asociados` | Pay to other associates |
| Servicios Públicos | `/pagos/servicios-publicos` | Register and pay utility services |

### Payment Methods

- **PSE** - Redirect to external PSE payment gateway
- **Cuenta** - Pay from savings account (requires SMS verification)

### Page Structure Example

```tsx
// app/(authenticated)/pagos/pagar-mis-productos/aportes/page.tsx
<div className="space-y-6">
  {/* Header with back button and breadcrumbs */}
  <div className="flex items-center justify-between">
    <BackButton onClick={handleBack} />
    <Breadcrumbs items={breadcrumbItems} />
  </div>

  {/* Stepper showing current step */}
  <Stepper steps={steps} currentStep={currentStep} />

  {/* Step-specific content card */}
  <AportesDetailsCard onSubmit={handleSubmit} />
</div>
```

### Verification Patterns

- **SMS Code**: 6-digit code input via `CodeInputCard`
- **PSE Redirect**: Loading state via `PSELoadingCard`, then redirect

### Result States

All result cards support:
- Success state (green icon, success message)
- Error state (red icon, error message, retry option)
- Transaction details display

---

## Transferencias (Transfers) Feature Pattern

The Transferencias feature handles internal transfers between accounts.

### Transfer Types

| Type | Route | Description |
|------|-------|-------------|
| Entre mis cuentas | `/transferencias/internas/entre-mis-cuentas` | Between own accounts |
| Cuentas mi red | `/transferencias/internas/cuentas-mi-red` | To Coopcentral network accounts |

### Transfer Flow Structure

```
1. Type Selection → 2. Transfer Details → 3. Confirmation → 4. SMS Verification → 5. Result
```

### Page Structure Example

```tsx
// app/(authenticated)/transferencias/internas/entre-mis-cuentas/page.tsx
<div className="space-y-6">
  <div className="flex items-center justify-between">
    <BackButton onClick={handleBack} />
    <Breadcrumbs items={breadcrumbItems} />
  </div>

  <Stepper steps={steps} currentStep={currentStep} />

  <TransferDetailsCard
    sourceAccounts={sourceAccounts}
    destinationAccounts={destinationAccounts}
    onSubmit={handleSubmit}
  />
</div>
```

### Key Components

- `InternasFlowGrid` - Grid for selecting transfer type
- `TransferDetailsCard` - Source/destination account selection with amount
- `TransferConfirmationCard` - Review transfer details
- `TransferResultCard` - Success/error result display

---

## Reusable Flow Patterns

### Stepper Pattern

All multi-step flows use the `Stepper` component:

```tsx
const steps: StepperStep[] = [
  { id: 1, label: 'Detalle', status: 'completed' },
  { id: 2, label: 'Confirmación', status: 'active' },
  { id: 3, label: 'Verificación', status: 'pending' },
  { id: 4, label: 'Resultado', status: 'pending' },
];

<Stepper steps={steps} currentStep={2} />
```

### Confirmation Card Pattern

All confirmation cards display:
- Summary rows with label/value pairs
- Payment method selection (when applicable)
- Terms acceptance checkbox
- Continue/Cancel buttons

### Result Card Pattern

All result cards display:
- Success/Error icon
- Transaction ID (on success)
- Transaction details summary
- Action buttons (download receipt, return to home)

---

- do not run the app by yourself, nor build it nor run automated tests. Also, do not make commits
