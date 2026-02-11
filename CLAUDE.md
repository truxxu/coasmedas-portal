# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portal Transaccional Coasmedas** - A Next.js 16 portal application using App Router, TypeScript, Tailwind CSS v4, and Atomic Design component architecture. The portal includes authentication (JWT + middleware), dashboard, product management (Aportes, Ahorros, Obligaciones, Inversiones, Protección), payments (own products, unified payments, other associates, utility services), and transfers (internal between accounts, rotating credit, PSE recharge, network/Coopcentral, other banks, account registration).

**Backend API**: This portal consumes the Coasmedas Banking API (REST) via axios. See API documentation in `.claude/knowledge/api/`

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

### Authentication Middleware

The app uses JWT-based authentication via `middleware.ts`:

- **Token storage**: `auth-token` cookie (HTTP-only)
- **Token validation**: Parses JWT, checks `exp` claim for expiration
- **Public routes**: `/`, `/login`, `/register`, `/forgot-password`
- **Protected routes**: All other routes redirect to `/login` if token is missing/expired
- **Session timeout**: Configurable via `NEXT_PUBLIC_INACTIVITY_TIMEOUT` env var (default 3600s)

### Component Structure: Atomic Design Pattern

Components follow Atomic Design methodology in `/src`:

```
src/
├── atoms/       # Basic building blocks (Button, Input, Card, Toggle, etc.)
├── molecules/   # Simple combinations of atoms (NavBar, FormField, SidebarNavItem, etc.)
├── organisms/   # Complex sections (Sidebar, TopBar, LoginForm, etc.)
├── contexts/    # React contexts (UIContext, UserContext, WelcomeBarContext)
├── hooks/       # Custom hooks (useUI, useUser, useSMSCodeVerification, usePSERedirect)
├── types/       # TypeScript type definitions
├── schemas/     # Yup validation schemas (loginSchema, accountRegistrationSchema)
├── constants/   # Constants (documentTypes)
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
import { loginSchema } from "@/src/schemas/loginSchema";
import { DOCUMENT_TYPES } from "@/src/constants/documentTypes";
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
├── middleware.ts                 # JWT auth middleware
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
    ├── pagos/                    # Payments feature
    │   ├── page.tsx              # Payments index
    │   ├── pagar-mis-productos/  # Pay my products
    │   │   ├── page.tsx          # Product selection
    │   │   ├── aportes/          # Aportes: page → confirmacion → verificacion → pse-redirect → resultado
    │   │   ├── obligaciones/     # Obligaciones: page → confirmacion → codigo-sms → pse → resultado
    │   │   ├── proteccion/       # Protection: page → confirmacion → codigo-sms → pse → respuesta
    │   │   └── pago-unificado/   # Unified: page → confirmacion → verificacion → pse → resultado
    │   ├── otros-asociados/      # Pay other associates
    │   │   ├── page.tsx          # Beneficiary selection
    │   │   └── pago/             # Flow: page → confirmacion → sms → pse → resultado
    │   └── servicios-publicos/   # Utility payments
    │       ├── page.tsx          # Flow selection (register/pay)
    │       ├── inscribir/        # Registration: page → confirmacion → resultado
    │       └── pagar/            # Payment: detalle → confirmacion → codigo-sms → pse → respuesta
    └── transferencias/           # Transfers feature
        ├── internas/             # Internal transfers
        │   ├── page.tsx          # Transfer type selection
        │   ├── entre-mis-cuentas/    # Between own accounts: page → confirmacion → sms → resultado
        │   ├── desde-cupos-rotativos/# From rotating credit: page → confirmacion → sms → resultado
        │   └── recargar-pse/         # PSE recharge: page → confirmacion → pse → resultado
        ├── cuentas-mi-red/       # Network accounts (Coopcentral): page → detalle → confirmacion → verificacion → resultado
        ├── otros-bancos/         # Other banks: page → confirmacion → sms → resultado
        └── inscribir-cuentas/    # Register external accounts: page
```

## Tech Stack

- **Next.js**: ^16.0.8 (App Router)
- **React**: 19.2.0
- **TypeScript**: ^5
- **Tailwind CSS**: ^4
- **ESLint**: ^9 with Next.js configuration
- **react-hook-form**: Form handling
- **@hookform/resolvers**: Form validation resolvers
- **yup**: Schema validation
- **axios**: HTTP client for API calls
- **bcryptjs**: Cryptographic hashing

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
@.claude/design-system.md

## API Key Documentation

- **API Reference**: `/docs/CONSOLIDATED_API_REFERENCE.md` - Single source of truth for all endpoints
- **API Gaps**: `/docs/api-gaps.md` - Endpoints needing backend clarification
- **Migration Notes**: `/docs/api-migration-notes.md` - Web-specific considerations
- **Implementation Status**: `/docs/IMPLEMENTATION_STATUS.md` - Track endpoint implementation progress

Always reference the consolidated API docs when implementing new endpoints.

## API Layer Conventions

### Types (`/types/api/`)

- One file per domain matching consolidated reference
- Request types: `[Action][Resource]Request` (e.g., `CreateUserRequest`)
- Response types: `[Resource]` or `[Resource]Response` (e.g., `User`, `PaginatedUsersResponse`)

### Services (`/services/`)

- One file per domain: `[domain].service.ts`
- Follow patterns in `/services/_template.ts`
- All functions must include JSDoc with `@endpoint` and `@status` tags
- Functions return unwrapped data, not AxiosResponse
- Update `/docs/IMPLEMENTATION_STATUS.md` after implementing endpoints

### Endpoint Status Tags

- ✅ Used in mobile (priority implementation)
- 🆕 Available but not used in mobile
- ⚠️ Needs verification with backend team

### Error Handling

- Use error classes from `/lib/api/errors.ts`
- `AuthError` for 401/403
- `ValidationError` for 400 with field errors
- `ApiError` for other API errors
- `NetworkError` for connection failures

## Adding a New Endpoint

1. Check `/docs/CONSOLIDATED_API_REFERENCE.md` for endpoint details
2. Add types to `/types/api/[domain].ts`
3. Add service function to `/services/[domain].service.ts`
4. Mark complete in `/docs/IMPLEMENTATION_STATUS.md`

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
- `CupoRotativoCard` - Rotating credit product card

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
- `AccountTypeRadioGroup` - Radio group for account type selection
- `HolderTypeRadioGroup` - Radio group for holder type selection
- `BankBadge` - Bank identification badge

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
- `AuthHydrator` - Authentication hydration wrapper

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

#### Transfers - Internal

- `InternasFlowGrid` - Internal transfer type selection grid
- `TransferDetailsCard` - Transfer details form
- `TransferConfirmationCard` - Transfer confirmation display
- `TransferResultCard` - Transfer result display

#### Transfers - Network (Coopcentral)

- `NetworkTransferForm` - Network transfer (Coopcentral) form
- `RegisteredAccountsList` - List of registered accounts
- `NetworkTransferConfirmationCard` - Network transfer confirmation
- `NetworkTransferResultCard` - Network transfer result

#### Transfers - External (Other Banks)

- `ExternalTransferDetailsCard` - External transfer details
- `ExternalTransferConfirmationCard` - External transfer confirmation
- `ExternalTransferResultCard` - External transfer result

#### Cupo Rotativo (Rotating Credit)

- `CupoRotativoDetailsCard` - Rotating credit transfer details
- `CupoRotativoConfirmationCard` - Rotating credit confirmation
- `CupoRotativoResultCard` - Rotating credit result

#### PSE Recharge

- `PSERechargeDetailsCard` - PSE recharge details
- `PSERechargeConfirmationCard` - PSE recharge confirmation
- `PSERechargeResultCard` - PSE recharge result

#### Account Registration

- `AccountRegistrationForm` - Account registration form
- `InscribedAccountCard` - Inscribed account card display
- `InscribedAccountsList` - List of inscribed accounts
- `AccountSuccessModal` - Success modal for account operations
- `AccountDeleteConfirmModal` - Confirmation modal for account deletion

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

### Hooks (src/hooks/)

- `useUser` - Custom hook for user context access
- `useUI` - Custom hook for UI context access
- `useSMSCodeVerification` - SMS/OTP code verification logic
- `usePSERedirect` - PSE payment redirect logic

### Schemas (src/schemas/)

- `loginSchema` - Login form validation schema (yup)
- `accountRegistrationSchema` - Account registration form validation schema (yup)

### Constants (src/constants/)

- `DOCUMENT_TYPES` - Document type constants array
- `DocumentType` - Document type union type

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

#### Cupo Rotativo Transfer Types (src/types/cupoRotativoTransfer.ts)

- Rotating credit transfer data and state types

#### PSE Recharge Types (src/types/pseRecharge.ts)

- PSE recharge data and state types

#### External Transfer Types (src/types/externalTransfer.ts)

- External (other banks) transfer data and state types

#### Account Registration Types (src/types/accountRegistration.ts)

- Account registration form data and inscribed account types

### Utils (src/utils/)

- `formatCurrency(amount)` - Format as Colombian Peso
- `maskCurrency()` - Returns masked currency string ("$ \*\*\*\*")
- `maskNumber(number)` - Mask account/product numbers ("\*\*\*4428")
- `generateInitials(name)` - Get initials from name
- `formatDate(date)` - Format date for display (Spanish locale)
- `generateMonthOptions(count)` - Generate month options for dropdowns
- `isValidDateRange(start, end, maxMonths)` - Validate date range
- `carousel.ts` - Carousel utility functions

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
- `mockExternalTransferData` - External (other banks) transfer mock data
- `mockCupoRotativoData` - Rotating credit transfer mock data
- `mockPSERechargeData` - PSE recharge mock data
- `mockAccountRegistrationData` - Account registration mock data

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

All payment flows follow a similar step pattern with dedicated pages per step:

```
1. Product/Beneficiary Selection → 2. Payment Details → 3. Confirmation → 4. Verification (SMS or PSE) → 5. Result
```

Each step is its own route (e.g., `.../aportes/confirmacion/`, `.../aportes/verificacion/`, `.../aportes/resultado/`).

### Available Payment Flows

| Flow                | Route                                       | Description                                          |
| ------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Pagar mis productos | `/pagos/pagar-mis-productos`                | Pay own products (Aportes, Obligaciones, Protección) |
| Pago Unificado      | `/pagos/pagar-mis-productos/pago-unificado` | Pay multiple products at once                        |
| Otros Asociados     | `/pagos/otros-asociados`                    | Pay to other associates                              |
| Servicios Públicos  | `/pagos/servicios-publicos`                 | Register and pay utility services                    |

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

The Transferencias feature handles multiple transfer types between accounts.

### Transfer Types

| Type                  | Route                                            | Verification | Description                     |
| --------------------- | ------------------------------------------------ | ------------ | ------------------------------- |
| Entre mis cuentas     | `/transferencias/internas/entre-mis-cuentas`     | SMS          | Between own accounts            |
| Desde cupos rotativos | `/transferencias/internas/desde-cupos-rotativos` | SMS          | From rotating credit lines      |
| Recargar PSE          | `/transferencias/internas/recargar-pse`          | PSE          | Top-up via PSE gateway          |
| Cuentas mi red        | `/transferencias/cuentas-mi-red`                 | SMS          | To Coopcentral network accounts |
| Otros bancos          | `/transferencias/otros-bancos`                   | SMS          | Inter-bank transfers (ACH)      |
| Inscribir cuentas     | `/transferencias/inscribir-cuentas`              | -            | Register external accounts      |

### Transfer Flow Structure

```
1. Type Selection → 2. Transfer Details → 3. Confirmation → 4. Verification (SMS or PSE) → 5. Result
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
- `TransferDetailsCard` / `CupoRotativoDetailsCard` / `PSERechargeDetailsCard` / `ExternalTransferDetailsCard` - Details forms per transfer type
- `TransferConfirmationCard` / `NetworkTransferConfirmationCard` / `CupoRotativoConfirmationCard` / `PSERechargeConfirmationCard` / `ExternalTransferConfirmationCard` - Confirmation cards per type
- `TransferResultCard` / `NetworkTransferResultCard` / `CupoRotativoResultCard` / `PSERechargeResultCard` / `ExternalTransferResultCard` - Result cards per type
- `AccountRegistrationForm` / `InscribedAccountsList` - Account registration management

---

## Reusable Flow Patterns

### Stepper Pattern

All multi-step flows use the `Stepper` component:

```tsx
const steps: StepperStep[] = [
  { id: 1, label: "Detalle", status: "completed" },
  { id: 2, label: "Confirmación", status: "active" },
  { id: 3, label: "Verificación", status: "pending" },
  { id: 4, label: "Resultado", status: "pending" },
];

<Stepper steps={steps} currentStep={2} />;
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

## Environment Configuration

Environment variables (see `.env.example`):

- `NEXT_PUBLIC_API_BASE_URL` - Public API base URL (client-side)
- `API_BASE_URL` - Server-side API base URL
- `API_ALLOW_SELF_SIGNED` - Allow self-signed certs (dev only)
- `NEXT_PUBLIC_INACTIVITY_TIMEOUT` - Session inactivity timeout in seconds (default: 3600)

---

- do not run the app by yourself, nor build it nor run automated tests. Also, do not make commits
