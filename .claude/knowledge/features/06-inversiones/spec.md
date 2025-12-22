# Feature: Inversiones (06-inversiones)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 06
**Last Updated**: 2025-12-22

---

## Overview

The **Inversiones** (Investments) feature provides authenticated users access to their CDAT (Certificado de Depósito de Ahorro a Término) investment products through a horizontally scrollable carousel with an extended card design. Users can view multiple investment accounts with detailed financial information, select one to see its transaction history, and download monthly statements.

**Key Purpose**:
- View all CDAT investment products in a scrollable carousel
- See detailed investment information including interest rate, term, and maturity date
- Select a product to see its transaction history
- Filter and view transaction history for selected product
- Download monthly PDF reports/statements

**Key Differences from Other Products**:
- **Ahorros**: Simple card with balance and status
- **Obligaciones**: Extended card with loan-specific info (disbursed amount, next payment)
- **Inversiones**: Extended card with investment-specific info (interest rate, term, creation/maturity dates)

---

## User Stories

### US-06.1: View Investment Products Carousel
**As an** authenticated user
**I want** to see all my CDAT investment products in a carousel
**So that** I can quickly overview all my investments

**Acceptance Criteria**:
- [ ] Page displays at `/productos/inversiones`
- [ ] Carousel shows all user's CDAT products
- [ ] First product is selected by default (white background, blue border)
- [ ] Unselected products have gray background (#E4E6EA)
- [ ] Navigation arrows appear on left and right sides
- [ ] Dot indicators show current position
- [ ] Horizontal scroll with snap-to-card behavior
- [ ] Responsive: 1 card on mobile, 2 on tablet, 3 on desktop

### US-06.2: Select Investment Product
**As an** authenticated user
**I want** to select an investment product from the carousel
**So that** I can view its transaction history and details

**Acceptance Criteria**:
- [ ] Clicking a card selects it (shows white background, blue border)
- [ ] Only one card can be selected at a time
- [ ] Previously selected card reverts to gray background
- [ ] Transaction history section updates with selected product's data
- [ ] Section title updates to show selected product name and number
- [ ] Selection persists during page session

### US-06.3: View Investment Product Card Information
**As an** authenticated user
**I want** to see detailed information on each investment product card
**So that** I can understand my investment status and terms

**Acceptance Criteria**:
- [ ] Card shows product title (e.g., "CDTA Tradicional")
- [ ] Card shows masked product number with prefix (e.g., "DTA-******123")
- [ ] Card shows amount label "Monto del CDAT"
- [ ] Card shows CDAT amount (respects "Ocultar saldos" toggle)
- [ ] Card shows status: "Activo" (green) or "Vencido" (red)
- [ ] Card shows horizontal divider separating main info from details
- [ ] Card shows "Tasa E.A." (effective annual interest rate)
- [ ] Card shows "Plazo" (term in days)
- [ ] Card shows "F. Creación" (creation date)
- [ ] Card shows "F. Vencimiento" (maturity date)

### US-06.4: Transaction History for Selected Product
**As an** authenticated user
**I want** to filter and view transaction history for my selected investment product
**So that** I can track my investment activity

**Acceptance Criteria**:
- [ ] Transaction history updates when different product is selected
- [ ] Title dynamically shows selected product name and number (CDAT-*****123 format)
- [ ] Date range filter with start and end date inputs
- [ ] Maximum range limited to 3 months
- [ ] "Aplicar" button triggers filter
- [ ] Shows transactions matching filter
- [ ] Shows empty state when no transactions found

### US-06.5: Download Monthly Reports
**As an** authenticated user
**I want** to download monthly statements for my investment accounts
**So that** I can keep records of my investment activity

**Acceptance Criteria**:
- [ ] Month dropdown shows available months (last 12 months)
- [ ] Selecting month triggers PDF download
- [ ] Clear description of functionality

---

## Technical Approach

### Routes

| Path | Description |
|------|-------------|
| `/productos/inversiones` | Inversiones (Investments) product page |

### File Structure

```
app/(authenticated)/productos/
├── inversiones/
│   └── page.tsx                   # Inversiones page

src/
├── molecules/
│   ├── InversionProductCard.tsx   # NEW: Investment card for carousel
│   └── index.ts                   # Update exports
├── organisms/
│   ├── InversionCarousel.tsx      # NEW: Carousel for investment products
│   └── index.ts                   # Update exports
├── types/
│   └── inversiones.ts             # NEW: Investment-related types
└── mocks/
    └── inversiones.ts             # NEW: Mock data for Inversiones
```

### Dependencies on Previous Features

The following components will be **reused** from previous features:

| Component | Source | Purpose |
|-----------|--------|---------|
| `TransactionHistoryCard` | 03-products | Transaction list with date filter |
| `DownloadReportsCard` | 03-products | Monthly report download |
| `Breadcrumbs` | 03-products | Breadcrumb navigation |
| `BackButton` | 03-products | Back navigation |
| `HideBalancesToggle` | existing | Balance visibility toggle |
| `CarouselArrow` | 04-ahorros | Carousel navigation arrows |
| `CarouselDots` | 04-ahorros | Carousel pagination dots |
| Carousel utilities | 04-ahorros | `calculateTotalPages`, `getVisibleItems` |

### Sidebar Navigation

Inversiones is already in the Products accordion in the sidebar:

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },  // Already exists
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

---

## Component Specifications

### Molecules

#### InversionProductCard
Individual CDAT investment card for the carousel with extended information.

```typescript
interface InversionProductCardProps {
  product: InversionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

interface InversionProduct {
  id: string;
  title: string;                    // "CDTA Tradicional", "CDTA Plus"
  productNumber: string;            // "123" (will be masked as DTA-******123)
  productPrefix?: string;           // "DTA-" (default for investments)
  amount: number;                   // 25000000 (monto del CDAT)
  status: InversionStatus;          // 'activo' | 'vencido'
  interestRate: string;             // "12.5% E.A" (tasa E.A.)
  termDays: number;                 // 180 (plazo in days)
  creationDate: string;             // "2025-08-15" ISO date (F. Creación)
  maturityDate: string;             // "2025-02-11" ISO date (F. Vencimiento)
}

type InversionStatus = 'activo' | 'vencido';
```

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ CDTA Tradicional                                │
│ Número de producto: DTA-******123               │
│                                                 │
│ Monto del CDAT                                  │
│ $ 25.000.000                                    │
│ Activo                                          │
│ ─────────────────────────────────────────────── │
│ Tasa E.A.:                         12.5% E.A   │
│ Plazo:                             180 días    │
│ F. Creación:                       15 Ago 2025 │
│ F. Vencimiento:                    11 Feb 2025 │
└─────────────────────────────────────────────────┘
```

**Styling**:
- Width: `280px` minimum (same as ObligacionProductCard)
- Height: Auto (~250px due to 4 detail fields)
- Border radius: `16px`
- Padding: `20px`
- Cursor: `pointer`
- Transition: `all 0.2s ease`

**Selected State**:
- Background: `#FFFFFF` (white)
- Border: `2px solid #194E8D` (navy blue)

**Unselected State**:
- Background: `#E4E6EA` (light gray - slightly different from Obligaciones)
- Border: `1px solid #E4E6EA` (gray)
- Hover: Border `#B1B1B1`

**Internal Divider**:
- Position: Between status and investment details
- Style: `1px solid #E4E6EA`
- Margin: `12px 0`

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Ubuntu | 16px | Medium | Black |
| Product Number | Ubuntu | 14px | Regular | Black |
| "Monto del CDAT" label | Ubuntu | 15px | Regular | Black |
| Amount Value | Ubuntu | 21px | Bold | Blue #004680 |
| Status "Activo" | Ubuntu | 15px | Regular | Green #00A44C |
| Status "Vencido" | Ubuntu | 15px | Regular | Red #FF0000 |
| Detail Label | Ubuntu | 14px | Regular | Gray #636363 |
| Detail Value | Ubuntu | 14px | Medium | Black |

**Hide Balances Integration**:
```typescript
const { hideBalances } = useUIContext();

// Only one monetary value to mask (simpler than Obligaciones)
{hideBalances ? maskCurrency() : formatCurrency(product.amount)}
```

**Tailwind Classes**:
```css
/* Base card */
bg-[#E4E6EA] rounded-2xl p-5 cursor-pointer
transition-all duration-200
border border-[#E4E6EA]
hover:border-[#B1B1B1]
min-w-[280px]

/* Selected state */
bg-white border-2 border-[#194E8D]

/* Divider */
border-t border-[#E4E6EA] my-3

/* Detail row */
flex justify-between mb-1

/* Detail label */
text-[14px] text-[#636363]

/* Detail value */
text-[14px] font-medium text-black
```

---

### Organisms

#### InversionCarousel
Carousel component specifically for investment/CDAT product cards.

```typescript
interface InversionCarouselProps {
  title: string;                                    // "Resumen de Inversiones"
  products: InversionProduct[];                     // Array of investment products
  selectedProductId?: string;                       // ID of selected product
  onProductSelect: (product: InversionProduct) => void;
  className?: string;
}
```

**Implementation Notes**:
- Reuses `CarouselArrow` and `CarouselDots` atoms from 04-ahorros
- Reuses carousel utilities (`calculateTotalPages`, `getVisibleItems`)
- Uses `InversionProductCard` instead of `SavingsProductCard` or `ObligacionProductCard`
- Same scroll behavior, responsive breakpoints, and accessibility features as other carousels

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Resumen de Inversiones                                                       │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (←)  [Card 1 - selected]  [Card 2 - unselected]  (→)                  │ │
│ │       (white bg)           (gray bg)                                    │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                              • • •                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Styling**:
- Container: `bg-white rounded-2xl p-6`
- Title: `text-[20px] font-bold text-[#194E8D] mb-4`
- Cards container: `flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide`
- Gap between cards: `20px` (gap-5)

**Responsive Behavior**:
| Breakpoint | Visible Cards | Card Width |
|------------|---------------|------------|
| Mobile (<640px) | 1 | 100% - padding |
| Tablet (640-1023px) | 2 | ~48% |
| Desktop (>=1024px) | 3 | ~32% |

---

## TypeScript Types

### File: `src/types/inversiones.ts`

```typescript
/**
 * Status of an investment product (CDAT)
 */
export type InversionStatus = 'activo' | 'vencido';

/**
 * Investment/CDAT product information for carousel display
 */
export interface InversionProduct {
  id: string;
  title: string;
  productNumber: string;
  productPrefix?: string;           // e.g., "DTA-" for CDATs
  amount: number;                   // Monto del CDAT
  status: InversionStatus;
  interestRate: string;             // Tasa E.A. (e.g., "12.5% E.A")
  termDays: number;                 // Plazo in days (e.g., 180)
  creationDate: string;             // F. Creación (ISO date)
  maturityDate: string;             // F. Vencimiento (ISO date)
}

/**
 * Callback type for investment product selection
 */
export type OnInversionSelect = (product: InversionProduct) => void;
```

### Update: `src/types/index.ts`

```typescript
// Add export
export * from './inversiones';
```

---

## Utility Functions

### Product Number Formatting

Use the existing `maskNumber` function with prefix support:

```typescript
/**
 * Mask product number with prefix for display
 * @example maskNumber("123", "DTA-") => "DTA-******123"
 */
import { maskNumber } from '@/src/utils';

// In InversionProductCard:
const displayProductNumber = product.productPrefix
  ? `${product.productPrefix}${maskNumber(product.productNumber)}`
  : maskNumber(product.productNumber);
```

### Term Days Formatting

```typescript
/**
 * Format term days for display
 * @example formatTermDays(180) => "180 días"
 */
export function formatTermDays(days: number): string {
  return `${days} días`;
}
```

### Date Formatting

Use the existing `formatDate` utility:

```typescript
import { formatDate } from '@/src/utils';

// Display dates
formatDate(product.creationDate)  // "15 Ago 2025"
formatDate(product.maturityDate)  // "11 Feb 2025"
```

---

## Mock Data

### File: `src/mocks/inversiones.ts`

```typescript
import { InversionProduct } from '@/src/types/inversiones';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock CDAT investment products for carousel
 */
export const mockInversionProducts: InversionProduct[] = [
  {
    id: '1',
    title: 'CDTA Tradicional',
    productNumber: '123',
    productPrefix: 'DTA-',
    amount: 25000000,
    status: 'activo',
    interestRate: '12.5% E.A',
    termDays: 180,
    creationDate: '2025-08-15',
    maturityDate: '2025-02-11',
  },
  {
    id: '2',
    title: 'CDTA Plus',
    productNumber: '456',
    productPrefix: 'DTA-',
    amount: 50000000,
    status: 'activo',
    interestRate: '13.0% E.A',
    termDays: 360,
    creationDate: '2025-10-01',
    maturityDate: '2025-09-26',
  },
  {
    id: '3',
    title: 'CDTA Flexible',
    productNumber: '789',
    productPrefix: 'DTA-',
    amount: 15000000,
    status: 'vencido',
    interestRate: '11.0% E.A',
    termDays: 90,
    creationDate: '2025-06-01',
    maturityDate: '2025-08-30',
  },
];

/**
 * Mock transactions for investment accounts
 */
export const mockInversionesTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-08-15',
    description: 'Apertura CDAT',
    amount: 25000000,
    type: 'debit',
  },
  {
    id: '2',
    date: '2024-11-15',
    description: 'Liquidación intereses',
    amount: 937500,
    type: 'credit',
  },
];

/**
 * Available months for report download
 */
export const mockInversionesAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Update: `src/mocks/index.ts`

```typescript
export * from './inversiones';
// ... other exports
```

---

## Page Implementation

### File: `app/(authenticated)/productos/inversiones/page.tsx`

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  InversionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { InversionProduct } from '@/src/types';
import {
  mockInversionProducts,
  mockInversionesTransactions,
  mockInversionesAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function InversionesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<InversionProduct>(
    mockInversionProducts[0]
  );
  const [transactions] = useState(mockInversionesTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockInversionesAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Inversiones',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  // Note: Transaction title uses CDAT- prefix, not DTA-
  const transactionTitle = useMemo(() => {
    const maskedNumber = `CDAT-${maskNumber(selectedProduct.productNumber)}`;
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: InversionProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product from API
    console.log('Selected product:', product.id);
  };

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering:', { startDate, endDate, productId: selectedProduct.id });
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    console.log('Selected month:', month);
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download from API
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Inversiones']} />

      {/* Section 1: Product Carousel */}
      <InversionCarousel
        title="Resumen de Inversiones"
        products={mockInversionProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
      />

      {/* Section 2: Transaction History */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Section 3: Download Reports */}
      <DownloadReportsCard
        availableMonths={mockInversionesAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Responsive Design

### Carousel Responsive Behavior

| Breakpoint | Visible Cards | Arrow Position | Dots |
|------------|---------------|----------------|------|
| Mobile (<640px) | 1 | Hidden (swipe) | Show |
| Tablet (640-1023px) | 2 | Show | Show |
| Desktop (>=1024px) | 3 | Show | Show |

### Card Responsive Adjustments

- On mobile, single card should be comfortably viewable
- Cards maintain minimum width of `280px`
- Scroll snapping ensures cards don't get cut off
- Cards are slightly taller than Obligaciones due to 4 detail fields

### Tailwind Responsive Classes

```css
/* Card wrapper within carousel */
.inversion-card-wrapper {
  /* Mobile: full width */
  @apply w-full;

  /* Tablet: 2 cards */
  @apply sm:w-[calc(50%-10px)];

  /* Desktop: 3 cards */
  @apply lg:w-[calc(33.333%-14px)];
}

/* Minimum width for readability */
.inversion-card {
  @apply min-w-[280px];
}
```

---

## Accessibility Requirements

### Carousel Accessibility

Follows same patterns as previous carousel implementations:

- **Arrows**:
  - `aria-label="Ver productos anteriores"` (left)
  - `aria-label="Ver productos siguientes"` (right)
  - `aria-disabled` when cannot scroll further

- **Dots**:
  - `role="tablist"` on container
  - `role="tab"` on each dot
  - `aria-selected="true"` on active dot
  - `aria-label="Ir a página X"` on each dot

- **Cards**:
  - `role="option"` (within listbox)
  - `aria-selected="true"` on selected card
  - `tabindex="0"` for keyboard navigation
  - `aria-label` with product summary including status

- **Keyboard Navigation**:
  - Arrow keys to navigate between cards
  - Enter/Space to select card
  - Tab to move to arrows

### Status Announcements

For screen readers, the status should be clearly communicated:

```typescript
const statusAnnouncement = product.status === 'activo'
  ? 'Estado: Activo'
  : 'Estado: Vencido';
```

### Color Contrast

All text colors meet WCAG AA standards:
- Green status (#00A44C) on white/gray background
- Red status (#FF0000) on white/gray background
- Blue amount (#004680) on white/gray background
- Gray labels (#636363) on white/gray background

---

## Integration with Existing Context

### Hide Balances (UIContext)

```typescript
import { useUIContext } from '@/src/contexts';
import { formatCurrency, maskCurrency } from '@/src/utils';

// In InversionProductCard
const { hideBalances } = useUIContext();

// Mask the CDAT amount (only one monetary value unlike Obligaciones)
<span className="text-[21px] font-bold text-[#004680]">
  {hideBalances ? maskCurrency() : formatCurrency(product.amount)}
</span>
```

### Sidebar Active State

The sidebar should highlight "Inversiones" when on `/productos/inversiones`:

```typescript
// In Sidebar.tsx - handled by pathname check
const pathname = usePathname();
const isInversionesActive = pathname === '/productos/inversiones';
```

---

## Implementation Checklist

### Phase 1: Types
- [ ] Create `src/types/inversiones.ts`
- [ ] Update `src/types/index.ts` exports

### Phase 2: Molecule - InversionProductCard
- [ ] Create `src/molecules/InversionProductCard.tsx`
- [ ] Implement selected/unselected visual states
- [ ] Add divider and investment details section
- [ ] Integrate with `useUIContext` for hideBalances
- [ ] Add status color logic (Activo/Vencido)
- [ ] Format term days with "días" suffix
- [ ] Format dates using `formatDate` utility
- [ ] Update `src/molecules/index.ts` exports

### Phase 3: Organism - InversionCarousel
- [ ] Create `src/organisms/InversionCarousel.tsx`
- [ ] Reuse `CarouselArrow` and `CarouselDots` from atoms
- [ ] Reuse carousel utilities from `src/utils/carousel.ts`
- [ ] Implement scroll behavior (snap, smooth)
- [ ] Implement navigation arrows logic
- [ ] Implement dot pagination
- [ ] Add responsive breakpoint handling
- [ ] Update `src/organisms/index.ts` exports

### Phase 4: Mock Data
- [ ] Create `src/mocks/inversiones.ts`
- [ ] Update `src/mocks/index.ts` exports

### Phase 5: Page Assembly
- [ ] Create `app/(authenticated)/productos/inversiones/page.tsx`
- [ ] Wire up carousel with mock data
- [ ] Reuse `TransactionHistoryCard` from 03-products
- [ ] Reuse `DownloadReportsCard` from 03-products
- [ ] Connect selection logic to transaction history title
- [ ] Use correct prefix format (CDAT- for transaction title)

### Phase 6: Polish
- [ ] Add responsive styles for all breakpoints
- [ ] Add hover/focus states
- [ ] Add loading state for carousel
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify hideBalances integration

---

## Testing Checklist

### Functional Testing
- [ ] Page loads at `/productos/inversiones`
- [ ] First product is selected by default (white bg, blue border)
- [ ] Unselected products have gray background (#E4E6EA)
- [ ] Clicking a card selects it
- [ ] Only one card selected at a time
- [ ] Transaction history title updates on selection
- [ ] Title uses CDAT- prefix format (not DTA-)
- [ ] Left arrow scrolls carousel left
- [ ] Right arrow scrolls carousel right
- [ ] Dots indicate current position
- [ ] Clicking dot navigates to page
- [ ] Arrows hide/disable at scroll boundaries
- [ ] Date filter works correctly
- [ ] Month dropdown shows 12 months
- [ ] "Ocultar saldos" masks the CDAT amount

### Visual Testing
- [ ] Selected card: White background, blue border
- [ ] Unselected card: Gray background (#E4E6EA), gray border
- [ ] "Activo" status displays in green
- [ ] "Vencido" status displays in red
- [ ] Divider visible between status and investment details
- [ ] Amount value in blue (#004680)
- [ ] Detail labels in gray (#636363)
- [ ] Detail values in black (dates, rate, term)
- [ ] Interest rate displayed as received (e.g., "12.5% E.A")
- [ ] Term displayed with "días" suffix (e.g., "180 días")
- [ ] Dates formatted correctly (e.g., "15 Ago 2025")

### Responsive Testing
- [ ] Mobile: 1 card visible, swipe works
- [ ] Tablet: 2 cards visible, arrows work
- [ ] Desktop: 3 cards visible, arrows work
- [ ] Cards maintain minimum width (280px)
- [ ] Cards don't overflow container
- [ ] Gap between cards is consistent (20px)

### Accessibility Testing
- [ ] Keyboard navigation through carousel
- [ ] Arrow keys move between cards
- [ ] Enter/Space selects card
- [ ] Tab moves to navigation arrows
- [ ] Screen reader announces card content including status
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast passes WCAG AA

### Integration Testing
- [ ] Page loads at `/productos/inversiones`
- [ ] Sidebar shows "Inversiones" as active
- [ ] Back button navigates to `/home`
- [ ] Breadcrumbs display correctly ("Inicio / Productos / Inversiones")
- [ ] Reused components (TransactionHistoryCard, DownloadReportsCard) work correctly

---

## Performance Considerations

### Carousel Optimization

1. **Reuse Existing Carousel Logic**:
   - Leverage carousel utilities from 04-ahorros
   - Same scroll behavior and performance optimizations

2. **Card Rendering**:
   - Cards have 4 detail fields (slightly more than Obligaciones' 3)
   - No images to lazy load
   - CSS transitions for smooth selection changes

3. **Hide Balances Performance**:
   - Only one monetary value per card needs masking (simpler than Obligaciones)
   - No memoization needed

---

## API Integration (Future)

When connecting to the backend API:

| Endpoint | Purpose | When Called |
|----------|---------|-------------|
| `GET /balances?type=inversiones` | Fetch CDAT products | Page load |
| `GET /movements?productId={id}` | Fetch transactions | Product selection |
| `GET /reports/{productId}/{month}` | Download PDF | Month selection |

See `.claude/knowledge/api/README.md` for full API documentation.

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`, `Breadcrumbs`, `BackButton`
- **Feature 04-ahorros**: Provides `CarouselArrow`, `CarouselDots`, carousel utilities
- **Feature 05-obligaciones**: Similar extended card pattern (reference implementation)
- **Feature 02-home**: Uses shared authenticated layout

---

## Comparison with Other Product Pages

| Aspect | Ahorros (04) | Obligaciones (05) | Inversiones (06) |
|--------|--------------|-------------------|------------------|
| Card Component | `SavingsProductCard` | `ObligacionProductCard` | `InversionProductCard` |
| Product Type | Savings accounts | Loans/Credits | CDATs |
| Amount Label | "Saldo Total" | "Saldo a la fecha" | "Monto del CDAT" |
| Amount Color | Navy #112E7F | Navy #112E7F | Blue #004680 |
| Product Prefix | None | Optional "CR-" | "DTA-" |
| Transaction Prefix | None | Product prefix | "CDAT-" |
| Status Values | activo/bloqueado | al_dia/en_mora | activo/vencido |
| Has Divider | No | Yes | Yes |
| Detail Fields | None | 3 (disbursed, next payment) | 4 (rate, term, dates) |
| Monetary Values | 1 (balance) | 3 (balance, disbursed, next) | 1 (amount) |
| Card Min Width | 250px | 280px | 280px |
| Unselected BG | White | #F3F4F6 | #E4E6EA |

---

## Investment-Specific Details

### Detail Fields Structure

```
┌────────────────────────────────────────────┐
│ Tasa E.A.:                    12.5% E.A   │
│ Plazo:                        180 días    │
│ F. Creación:                  15 Ago 2025 │
│ F. Vencimiento:               11 Feb 2025 │
└────────────────────────────────────────────┘
```

- **Tasa E.A.** (Effective Annual Rate): The annual interest rate for the CDAT - displayed as-is from backend
- **Plazo** (Term): Duration of the investment in days - formatted with "días" suffix
- **F. Creación** (Creation Date): When the CDAT was opened - formatted as "dd MMM yyyy"
- **F. Vencimiento** (Maturity Date): When the CDAT matures - formatted as "dd MMM yyyy"

### Display Formatting

```typescript
// Interest rate - display as-is from backend
product.interestRate  // "12.5% E.A"

// Term - format with "días" suffix
`${product.termDays} días`  // "180 días"

// Dates - format using formatDate utility
formatDate(product.creationDate)  // "15 Ago 2025"
formatDate(product.maturityDate)  // "11 Feb 2025"
```

### Product Number vs Transaction Title Prefixes

Important distinction:
- **Product number display**: Uses "DTA-" prefix (e.g., "DTA-******123")
- **Transaction title**: Uses "CDAT-" prefix (e.g., "CDAT-*****123")

```typescript
// Product card display
`DTA-${maskNumber(product.productNumber)}`  // "DTA-******123"

// Transaction history title
`CDAT-${maskNumber(product.productNumber)}`  // "CDAT-*****123"
```

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [Design System](/.claude/design-system.md) - Color palette, typography
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines
- [Feature 03-products](../03-products/spec.md) - Reusable components
- [Feature 04-ahorros](../04-ahorros/spec.md) - Carousel atoms and utilities
- [Feature 05-obligaciones](../05-obligaciones/spec.md) - Extended card pattern reference

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - Productos Inversiones](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=353-3)
**Estimated Effort**: 1-1.5 days
**Dependencies**: Feature 03-products, Feature 04-ahorros
