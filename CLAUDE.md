# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portal Transaccional Coasmedas** - A Next.js 16 portal application using App Router, TypeScript, Tailwind CSS v4, and Atomic Design component architecture. The project is in active development with authentication, home dashboard, and product features being implemented.

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
    └── productos/                # Products feature
        ├── page.tsx              # Products index (redirects)
        ├── aportes/page.tsx      # Aportes product page (implemented)
        ├── ahorros/page.tsx      # Ahorros product page (04-ahorros feature)
        ├── obligaciones/page.tsx # Obligaciones product page (05-obligaciones feature)
        ├── inversiones/page.tsx  # Inversiones product page (06-inversiones feature)
        └── proteccion/page.tsx   # Protección product page (07-proteccion feature)
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
import { formatCurrency, maskCurrency } from '@/src/utils';

formatCurrency(890058)  // "$ 890.058"
maskCurrency()          // "$ ****"
```

### Hide Balances Pattern
```typescript
const { hideBalances } = useUIContext();
{hideBalances ? maskCurrency() : formatCurrency(amount)}
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
@.claude/documentation-policy.md
@.claude/design-system.md

## Backend API Documentation

@.claude/knowledge/api/README.md

## Features

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

---

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

### Molecules (src/molecules/)
- `SidebarNavItem` - Sidebar navigation item (supports expandable with children)
- `SidebarSubItem` - Sub-navigation item for sidebar accordion
- `HideBalancesToggle` - Toggle for hiding balances
- `TransactionItem` - Single transaction display
- `FormField` - Label + Input + Error combination
- `SelectField` - Label + Select + Error combination
- `PasswordField` - Password input with visibility toggle
- `UserAvatar` - Avatar with user name
- `UserDropdown` - User menu dropdown
- `QuickAccessCard` - Quick action cards
- `Breadcrumbs` - Breadcrumb navigation trail
- `DateRangeFilter` - Start/end date filter with apply button
- `SavingsProductCard` - Savings product card for carousel (04-ahorros)
- `ObligacionProductCard` - Loan product card with extended fields (05-obligaciones)
- `InversionProductCard` - Investment/CDAT product card with term details (06-inversiones)
- `ProteccionProductCard` - Insurance/protection product card without main balance (07-proteccion)
- `NavBar` - Top navigation bar
- `HeroBanner` - Hero section for landing pages
- `WelcomeSection` - Welcome message section
- `ServiceCard` - Service feature card
- `NewsCard` - News article card
- `InfoCard` - Information card
- `AppPromoSection` - App promotion section
- `Footer` - Page footer
- `CaptchaPlaceholder` - Captcha placeholder component

### Organisms (src/organisms/)
- `Sidebar` - Main navigation sidebar with product accordion
- `TopBar` - Top header bar
- `WelcomeBar` - Welcome message bar
- `SessionFooter` - Session info footer
- `LoginForm` - Complete login form
- `LoginCard` - Login card container
- `AccountSummaryCard` - Account balance card
- `RecentTransactions` - Transaction list
- `QuickAccessGrid` - Grid of quick actions
- `AportesInfoCard` - Aportes product information card
- `TransactionHistoryCard` - Transaction list with date filter (reusable)
- `DownloadReportsCard` - Monthly report download (reusable)
- `ProductCarousel` - Reusable carousel for savings products (04-ahorros)
- `ObligacionCarousel` - Carousel for loan/credit products (05-obligaciones)
- `InversionCarousel` - Carousel for investment/CDAT products (06-inversiones)
- `ProteccionCarousel` - Carousel for insurance/protection products (07-proteccion)
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
- `User` - User information
- `Account` - Account data
- `Transaction` - Transaction data
- `AportesProduct` - Aportes product data
- `ProductDetail` - Product detail (vigentes, enMora, fechaCubrimiento)
- `MonthOption` - Month dropdown option
- `DateRangeFilter` - Date range filter state
- `SavingsProduct` - Savings product data (04-ahorros)
- `SavingsStatus` - Savings status (activo/bloqueado/inactivo)
- `ObligacionProduct` - Loan/credit product data (05-obligaciones)
- `ObligacionStatus` - Loan status (al_dia/en_mora)
- `InversionProduct` - Investment/CDAT product data (06-inversiones)
- `InversionStatus` - Investment status (activo/vencido)
- `ProteccionProduct` - Insurance/protection product data (07-proteccion)
- `ProteccionStatus` - Protection status (activo/inactivo/cancelado)

### Utils (src/utils/)
- `formatCurrency(amount)` - Format as Colombian Peso
- `maskCurrency()` - Returns masked currency string ("$ ****")
- `maskNumber(number)` - Mask account/product numbers ("***4428")
- `generateInitials(name)` - Get initials from name
- `formatDate(date)` - Format date for display (Spanish locale)
- `generateMonthOptions(count)` - Generate month options for dropdowns
- `isValidDateRange(start, end, maxMonths)` - Validate date range

### Mocks (src/mocks/)
- `mockAportesData` - Aportes product mock data
- `mockTransactions` - Transaction list mock data
- `mockAvailableMonths` - Available months for reports
- `mockSavingsProducts` - Savings products for carousel (04-ahorros)
- `mockAhorrosTransactions` - Savings transactions
- `mockObligacionProducts` - Loan products for carousel (05-obligaciones)
- `mockObligacionTransactions` - Loan transactions
- `mockInversionProducts` - Investment products for carousel (06-inversiones)
- `mockInversionesTransactions` - Investment transactions
- `mockProteccionProducts` - Insurance/protection products for carousel (07-proteccion)
- `mockProteccionTransactions` - Protection transactions

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

## Feature 04-ahorros: New Components

The Ahorros feature introduces these new reusable components:

### New Atoms (to be created)
- `CarouselArrow` - Navigation arrow button (left/right)
- `CarouselDots` - Pagination dot indicators

### New Molecules (to be created)
- `SavingsProductCard` - Product card for carousel display

### New Organisms (to be created)
- `ProductCarousel` - Reusable horizontal carousel (will be used by Inversiones, Coaspocket)

### New Types (to be created)
- `SavingsProduct` - Savings product data structure
- `SavingsStatus` - Product status (activo/bloqueado/inactivo)
- `CarouselState` - Carousel scroll state

### New Utils (to be created)
- `calculateTotalPages()` - Carousel pagination helper
- `getVisibleItems()` - Responsive visible items calculator

---

## Feature 05-obligaciones: New Components

The Obligaciones (Loans/Credits) feature introduces these new components:

### New Molecules (to be created)
- `ObligacionProductCard` - Extended product card for loan display with:
  - Title, product type, masked product number with prefix (e.g., "CR-***1010")
  - Disbursed amount ("Monto desembolsado")
  - Total balance ("Saldo Total")
  - Next payment date and amount section
  - Status: "Al día" (green) or "En mora" (red)
  - Gray background when unselected, white when selected

### New Organisms (to be created)
- `ObligacionCarousel` - Carousel specifically for loan products (similar to ProductCarousel but uses ObligacionProductCard)

### New Types (to be created)
- `ObligacionProduct` - Loan product data structure with extended fields:
  - `id`, `title`, `productType`, `productNumber`, `productPrefix`
  - `disbursedAmount`, `totalBalance`
  - `nextPaymentDate`, `nextPaymentAmount`
  - `status` (al_dia/en_mora)
- `ObligacionStatus` - Loan status type ('al_dia' | 'en_mora')

### Key Differences from Ahorros
| Aspect | Ahorros | Obligaciones |
|--------|---------|--------------|
| Card Background | White (unselected), Blue border (selected) | Gray #F5F5F5 (unselected), White (selected) |
| Status Values | activo/bloqueado/inactivo | al_dia/en_mora |
| Card Fields | Balance only | Disbursed amount + Balance + Next payment |
| Product Prefix | None | "CR-" prefix before masked number |

---

## Feature 06-inversiones: New Components

The Inversiones (Investments/CDAT) feature introduces these new components:

### New Molecules (to be created)
- `InversionProductCard` - Investment/CDAT product card for carousel with:
  - Title: "CDAT" (Certificado de Depósito de Ahorro a Término)
  - Masked product number with prefix (e.g., "DTA-***1234")
  - Investment amount ("Monto" in blue #004680)
  - Interest rate percentage (e.g., "7.5%")
  - Term in days (e.g., "360 días")
  - Creation and maturity dates
  - Status: "Activo" (green) or "Vencido" (red)
  - Gray background #E4E6EA (unselected), white (selected)

### New Organisms (to be created)
- `InversionCarousel` - Carousel specifically for investment products (similar to ObligacionCarousel but uses InversionProductCard)

### New Types (to be created)
- `InversionProduct` - Investment product data structure with:
  - `id`, `title`, `productNumber`, `productPrefix`
  - `amount` (monto)
  - `interestRate` (tasa de interés)
  - `termDays` (plazo en días)
  - `creationDate`, `maturityDate`
  - `status` (activo/vencido)
- `InversionStatus` - Investment status type ('activo' | 'vencido')

### Key Differences from Obligaciones
| Aspect | Obligaciones | Inversiones |
|--------|--------------|-------------|
| Card Background (unselected) | Gray #F3F4F6 | Gray #E4E6EA |
| Status Values | al_dia/en_mora | activo/vencido |
| Card Fields | Balance + Disbursed + Next Payment | Amount + Rate + Term + Dates |
| Product Prefix | "CR-" | "DTA-" |
| Transaction Title Prefix | Product title | "CDAT-" prefix |
| Monetary Values to Mask | 3 (balance, disbursed, next payment) | 1 (amount only) |

---

## Feature 07-proteccion: New Components

The Protección (Insurance/Protection) feature introduces these new components:

### New Molecules (to be created)
- `ProteccionProductCard` - Insurance/protection product card for carousel with:
  - Title: Policy/insurance name (e.g., "Seguro de Vida")
  - Masked product number with "No" prefix (e.g., "No******65-9")
  - **NO main balance field** (unique among all product cards)
  - Status: "Activo" (green), "Inactivo" (gray), or "Cancelado" (red)
  - Pago Mínimo (minimum payment) in navy blue #194E8D
  - Fecha Límite de Pago (payment deadline)
  - Pago Total Anual (total annual payment) in navy blue #194E8D
  - Gray background #E4E6EA (unselected), white (selected)

### New Organisms (to be created)
- `ProteccionCarousel` - Carousel specifically for insurance products (similar to InversionCarousel but uses ProteccionProductCard)

### New Types (to be created)
- `ProteccionProduct` - Insurance product data structure with:
  - `id`, `title`, `productNumber`
  - `status` (activo/inactivo/cancelado)
  - `minimumPayment` (pago mínimo)
  - `paymentDeadline` (fecha límite de pago)
  - `annualPayment` (pago total anual)
- `ProteccionStatus` - Protection status type ('activo' | 'inactivo' | 'cancelado')

### Key Differences from Other Product Cards
| Aspect | Inversiones | Protección |
|--------|-------------|------------|
| Card Background (unselected) | Gray #E4E6EA | Gray #E4E6EA |
| Status Values | activo/vencido | activo/inactivo/cancelado |
| Card Fields | Amount + Rate + Term + Dates | **No balance** + Min Payment + Deadline + Annual Payment |
| Product Prefix | "DTA-" | "No" (followed by masked number) |
| Transaction Title Prefix | "CDAT-" | Product title |
| Monetary Values to Mask | 1 (amount) | 2 (minimumPayment, annualPayment) |
| Section Title | "Resumen de Inversiones" | "Resumen de Pólizas y Seguros" |

---

- do not run the app by yourself, nor build it nor run automated tests. Also, do not make commits