# Feature: Obligaciones (05-obligaciones)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 05
**Last Updated**: 2025-12-20

---

## Overview

The **Obligaciones** (Obligations/Loans) feature provides authenticated users access to their loan and credit products through a horizontally scrollable carousel with an extended card design. Users can view multiple loan accounts with detailed payment information, select one to see its transaction history, and download monthly statements.

**Key Purpose**:
- View all loan/credit products in a scrollable carousel
- See detailed loan information including disbursed amount and next payment details
- Select a product to see its transaction history
- Filter and view transaction history for selected product
- Download monthly PDF reports/statements

**Key Differences from Ahorros**:
- Ahorros: Simple card with balance and status
- Obligaciones: Extended card with additional loan-specific info (disbursed amount, next payment date, next payment value)
- Different visual styling (gray background for unselected cards)
- Different status labels ("Al día" / "En mora" vs "Activo" / "Bloqueado")

---

## User Stories

### US-05.1: View Loan Products Carousel
**As an** authenticated user
**I want** to see all my loan/credit products in a carousel
**So that** I can quickly overview all my obligations

**Acceptance Criteria**:
- [ ] Page displays at `/productos/obligaciones`
- [ ] Carousel shows all user's loan/credit products
- [ ] First product is selected by default (white background, blue border)
- [ ] Unselected products have gray background (#F3F4F6)
- [ ] Navigation arrows appear on left and right sides
- [ ] Dot indicators show current position
- [ ] Horizontal scroll with snap-to-card behavior
- [ ] Responsive: 1 card on mobile, 2 on tablet, 3 on desktop

### US-05.2: Select Loan Product
**As an** authenticated user
**I want** to select a loan product from the carousel
**So that** I can view its transaction history and details

**Acceptance Criteria**:
- [ ] Clicking a card selects it (shows white background, blue border)
- [ ] Only one card can be selected at a time
- [ ] Previously selected card reverts to gray background
- [ ] Transaction history section updates with selected product's data
- [ ] Section title updates to show selected product number
- [ ] Selection persists during page session

### US-05.3: View Loan Product Card Information
**As an** authenticated user
**I want** to see detailed information on each loan product card
**So that** I can understand my loan status and upcoming payments

**Acceptance Criteria**:
- [ ] Card shows product title (e.g., "Crédito de Libre Inversión")
- [ ] Card shows masked product number with optional prefix (e.g., "CR-***1010")
- [ ] Card shows current balance as "Saldo a la fecha" (respects "Ocultar saldos" toggle)
- [ ] Card shows payment status: "Al día" (green) or "En mora" (red)
- [ ] Card shows horizontal divider separating main info from details
- [ ] Card shows "Valor desembolsado" (disbursed amount) in blue
- [ ] Card shows "Próximo pago" (next payment date)
- [ ] Card shows "Valor próximo pago" (next payment amount) in blue

### US-05.4: Transaction History for Selected Product
**As an** authenticated user
**I want** to filter and view transaction history for my selected loan product
**So that** I can track my payment activity

**Acceptance Criteria**:
- [ ] Transaction history updates when different product is selected
- [ ] Title dynamically shows selected product name and number
- [ ] Date range filter with start and end date inputs
- [ ] Maximum range limited to 3 months
- [ ] "Aplicar" button triggers filter
- [ ] Shows transactions matching filter
- [ ] Shows empty state when no transactions found

### US-05.5: Download Monthly Reports
**As an** authenticated user
**I want** to download monthly statements for my loan accounts
**So that** I can keep records of my payment activity

**Acceptance Criteria**:
- [ ] Month dropdown shows available months (last 12 months)
- [ ] Selecting month triggers PDF download
- [ ] Clear description of functionality

---

## Technical Approach

### Routes

| Path | Description |
|------|-------------|
| `/productos/obligaciones` | Obligaciones (Loans) product page |

### File Structure

```
app/(authenticated)/productos/
├── obligaciones/
│   └── page.tsx                   # Obligaciones page

src/
├── molecules/
│   ├── ObligacionProductCard.tsx  # NEW: Loan card for carousel
│   └── index.ts                   # Update exports
├── organisms/
│   ├── ObligacionCarousel.tsx     # NEW: Carousel for loan products
│   └── index.ts                   # Update exports
├── types/
│   └── obligaciones.ts            # NEW: Obligation-related types
└── mocks/
    └── obligaciones.ts            # NEW: Mock data for Obligaciones
```

### Dependencies on Previous Features

The following components will be **reused** from features 03-products and 04-ahorros:

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

### Sidebar Navigation Update

Add "Obligaciones" to the Products accordion menu:

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },  // NEW
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

---

## Component Specifications

### Molecules

#### ObligacionProductCard
Individual loan/credit card for the carousel with extended information.

```typescript
interface ObligacionProductCardProps {
  product: ObligacionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

interface ObligacionProduct {
  id: string;
  title: string;                    // "Crédito de Libre Inversión"
  productNumber: string;            // "5678" (will be masked as ***5678)
  productPrefix?: string;           // "CR-" for some products like "Cupo Rotativo"
  currentBalance: number;           // 12500000 (saldo a la fecha)
  status: ObligacionStatus;         // 'al_dia' | 'en_mora'
  disbursedAmount: number;          // 20000000 (valor desembolsado)
  nextPaymentDate: string;          // "2025-11-30" ISO date (próximo pago)
  nextPaymentAmount: number;        // 850000 (valor próximo pago)
}

type ObligacionStatus = 'al_dia' | 'en_mora';
```

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Crédito de Libre Inversión                      │
│ Número de producto: ***5678                     │
│                                                 │
│ Saldo a la fecha                                │
│ $ 12.500.000                                    │
│ Al día                                          │
│ ─────────────────────────────────────────────── │
│ Valor desembolsado:          $ 20.000.000       │
│ Próximo pago:                30 Nov 2025        │
│ Valor próximo pago:          $ 850.000          │
└─────────────────────────────────────────────────┘
```

**Styling**:
- Width: `280px` minimum (wider than SavingsProductCard for extra content)
- Height: Auto (~240px due to extra fields)
- Border radius: `16px`
- Padding: `20px`
- Cursor: `pointer`
- Transition: `all 0.2s ease`

**Selected State**:
- Background: `#FFFFFF` (white)
- Border: `2px solid #194E8D` (navy blue)

**Unselected State**:
- Background: `#F3F4F6` (light gray)
- Border: `1px solid #E4E6EA` (gray)
- Hover: Border `#B1B1B1`

**Internal Divider**:
- Position: Between status and additional info
- Style: `1px solid #E4E6EA`
- Margin: `12px 0`

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Ubuntu | 16px | Medium | Black |
| Product Number | Ubuntu | 14px | Regular | Black |
| "Saldo a la fecha" label | Ubuntu | 15px | Regular | Black |
| Balance Amount | Ubuntu | 21px | Bold | Navy #112E7F |
| Status "Al día" | Ubuntu | 15px | Regular | Green #00A44C |
| Status "En mora" | Ubuntu | 15px | Regular | Red #FF0000 |
| Detail Label | Ubuntu | 14px | Regular | Gray #636363 |
| Detail Value (money) | Ubuntu | 14px | Medium | Blue #004680 |
| Detail Value (date) | Ubuntu | 14px | Medium | Black |

**Hide Balances Integration**:
```typescript
const { hideBalances } = useUIContext();

// Mask all monetary values
{hideBalances ? maskCurrency() : formatCurrency(product.currentBalance)}
{hideBalances ? maskCurrency() : formatCurrency(product.disbursedAmount)}
{hideBalances ? maskCurrency() : formatCurrency(product.nextPaymentAmount)}
```

**Tailwind Classes**:
```css
/* Base card */
bg-[#F3F4F6] rounded-2xl p-5 cursor-pointer
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

/* Detail value - money */
text-[14px] font-medium text-[#004680]

/* Detail value - date */
text-[14px] font-medium text-black
```

---

### Organisms

#### ObligacionCarousel
Carousel component specifically for loan/credit product cards.

```typescript
interface ObligacionCarouselProps {
  title: string;                                    // "Resumen de Obligaciones"
  products: ObligacionProduct[];                    // Array of loan products
  selectedProductId?: string;                       // ID of selected product
  onProductSelect: (product: ObligacionProduct) => void;
  className?: string;
}
```

**Implementation Notes**:
- Reuses `CarouselArrow` and `CarouselDots` atoms from 04-ahorros
- Reuses carousel utilities (`calculateTotalPages`, `getVisibleItems`)
- Uses `ObligacionProductCard` instead of `SavingsProductCard`
- Same scroll behavior, responsive breakpoints, and accessibility features as `ProductCarousel`

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Resumen de Obligaciones                                                      │
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

### File: `src/types/obligaciones.ts`

```typescript
/**
 * Status of an obligation/loan product
 */
export type ObligacionStatus = 'al_dia' | 'en_mora';

/**
 * Obligation/loan product information for carousel display
 */
export interface ObligacionProduct {
  id: string;
  title: string;
  productNumber: string;
  productPrefix?: string;           // e.g., "CR-" for Cupo Rotativo
  currentBalance: number;           // Saldo a la fecha
  status: ObligacionStatus;
  disbursedAmount: number;          // Valor desembolsado
  nextPaymentDate: string;          // Próximo pago (ISO date)
  nextPaymentAmount: number;        // Valor próximo pago
}

/**
 * Callback type for obligation product selection
 */
export type OnObligacionSelect = (product: ObligacionProduct) => void;
```

### Update: `src/types/index.ts`

```typescript
// Add export
export * from './obligaciones';
```

---

## Utility Functions

### Extend maskNumber for Product Prefix

The existing `maskNumber` function should handle the optional product prefix:

```typescript
/**
 * Mask account/product number with optional prefix
 * @example maskNumber("5678") => "***5678"
 * @example maskNumber("1010", "CR-") => "CR-***1010"
 */
export function maskNumber(number: string, prefix?: string, visibleDigits = 4): string {
  if (number.length <= visibleDigits) {
    return prefix ? `${prefix}${number}` : number;
  }
  const masked = `***${number.slice(-visibleDigits)}`;
  return prefix ? `${prefix}${masked}` : masked;
}
```

---

## Mock Data

### File: `src/mocks/obligaciones.ts`

```typescript
import { ObligacionProduct } from '@/src/types/obligaciones';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock loan/credit products for carousel
 */
export const mockObligacionProducts: ObligacionProduct[] = [
  {
    id: '1',
    title: 'Crédito de Libre Inversión',
    productNumber: '5678',
    currentBalance: 12500000,
    status: 'al_dia',
    disbursedAmount: 20000000,
    nextPaymentDate: '2025-11-30',
    nextPaymentAmount: 850000,
  },
  {
    id: '2',
    title: 'Cupo Rotativo Personal',
    productNumber: '1010',
    productPrefix: 'CR-',
    currentBalance: 3000000,
    status: 'al_dia',
    disbursedAmount: 5000000,
    nextPaymentDate: '2025-12-20',
    nextPaymentAmount: 150000,
  },
  {
    id: '3',
    title: 'Crédito de Vivienda',
    productNumber: '2233',
    currentBalance: 85000000,
    status: 'en_mora',
    disbursedAmount: 120000000,
    nextPaymentDate: '2025-11-15',
    nextPaymentAmount: 1250000,
  },
];

/**
 * Mock transactions for loan accounts
 */
export const mockObligacionesTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-25',
    description: 'Pago cuota mensual',
    amount: 850000,
    type: 'DEBITO',
  },
  {
    id: '2',
    date: '2024-10-25',
    description: 'Pago cuota mensual',
    amount: 850000,
    type: 'DEBITO',
  },
  {
    id: '3',
    date: '2024-09-25',
    description: 'Pago cuota mensual',
    amount: 850000,
    type: 'DEBITO',
  },
];

/**
 * Available months for report download
 */
export const mockObligacionesAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Update: `src/mocks/index.ts`

```typescript
export * from './obligaciones';
// ... other exports
```

---

## Page Implementation

### File: `app/(authenticated)/productos/obligaciones/page.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle } from '@/src/molecules';
import {
  ObligacionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { ObligacionProduct } from '@/src/types';
import {
  mockObligacionProducts,
  mockObligacionesTransactions,
  mockObligacionesAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function ObligacionesPage() {
  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<ObligacionProduct>(
    mockObligacionProducts[0]
  );
  const [transactions] = useState(mockObligacionesTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockObligacionesAvailableMonths[0]?.value
  );

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = maskNumber(
      selectedProduct.productNumber,
      selectedProduct.productPrefix
    );
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: ObligacionProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product from API
  };

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering:', { startDate, endDate, productId: selectedProduct.id });
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download from API
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BackButton href="/home" />
            <h1 className="text-[20px] font-medium text-black">Obligaciones</h1>
          </div>
          <Breadcrumbs items={['Inicio', 'Productos', 'Obligaciones']} />
        </div>
        <HideBalancesToggle />
      </div>

      {/* Section 1: Product Carousel */}
      <ObligacionCarousel
        title="Resumen de Obligaciones"
        products={mockObligacionProducts}
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
        availableMonths={mockObligacionesAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
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

Since `ObligacionProductCard` is taller due to additional info:
- On mobile, single card should be comfortably viewable
- Cards maintain minimum width of `280px`
- Scroll snapping ensures cards don't get cut off

### Tailwind Responsive Classes

```css
/* Card wrapper within carousel */
.obligacion-card-wrapper {
  /* Mobile: full width */
  @apply w-full;

  /* Tablet: 2 cards */
  @apply sm:w-[calc(50%-10px)];

  /* Desktop: 3 cards */
  @apply lg:w-[calc(33.333%-14px)];
}

/* Minimum width for readability */
.obligacion-card {
  @apply min-w-[280px];
}
```

---

## Accessibility Requirements

### Carousel Accessibility

Follows same patterns as 04-ahorros carousel:

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
const statusAnnouncement = product.status === 'al_dia'
  ? 'Estado: Al día'
  : 'Estado: En mora - requiere atención';
```

### Color Contrast

All text colors meet WCAG AA standards:
- Green status (#00A44C) on white/gray background
- Red status (#FF0000) on white/gray background
- Blue values (#004680) on white/gray background
- Gray labels (#636363) on white/gray background

---

## Integration with Existing Context

### Hide Balances (UIContext)

```typescript
import { useUIContext } from '@/src/contexts';
import { formatCurrency, maskCurrency } from '@/src/utils';

// In ObligacionProductCard
const { hideBalances } = useUIContext();

// Mask ALL monetary values
<span className="text-[21px] font-bold text-[#112E7F]">
  {hideBalances ? maskCurrency() : formatCurrency(product.currentBalance)}
</span>

<span className="text-[14px] font-medium text-[#004680]">
  {hideBalances ? maskCurrency() : formatCurrency(product.disbursedAmount)}
</span>

<span className="text-[14px] font-medium text-[#004680]">
  {hideBalances ? maskCurrency() : formatCurrency(product.nextPaymentAmount)}
</span>
```

### Sidebar Active State

The sidebar should highlight "Obligaciones" when on `/productos/obligaciones`:

```typescript
// In Sidebar.tsx - handled by pathname check
const pathname = usePathname();
const isObligacionesActive = pathname === '/productos/obligaciones';
```

---

## Implementation Checklist

### Phase 1: Types
- [ ] Create `src/types/obligaciones.ts`
- [ ] Update `src/types/index.ts` exports

### Phase 2: Molecule - ObligacionProductCard
- [ ] Create `src/molecules/ObligacionProductCard.tsx`
- [ ] Implement selected/unselected visual states
- [ ] Add divider and additional info section
- [ ] Integrate with `useUIContext` for hideBalances
- [ ] Add status color logic (Al día/En mora)
- [ ] Update `src/molecules/index.ts` exports

### Phase 3: Organism - ObligacionCarousel
- [ ] Create `src/organisms/ObligacionCarousel.tsx`
- [ ] Reuse `CarouselArrow` and `CarouselDots` from atoms
- [ ] Reuse carousel utilities from `src/utils/carousel.ts`
- [ ] Implement scroll behavior (snap, smooth)
- [ ] Implement navigation arrows logic
- [ ] Implement dot pagination
- [ ] Add responsive breakpoint handling
- [ ] Update `src/organisms/index.ts` exports

### Phase 4: Mock Data
- [ ] Create `src/mocks/obligaciones.ts`
- [ ] Update `src/mocks/index.ts` exports

### Phase 5: Sidebar Update
- [ ] Add "Obligaciones" to sidebar product sub-items
- [ ] Position between "Ahorros" and "Inversiones"

### Phase 6: Page Assembly
- [ ] Create `app/(authenticated)/productos/obligaciones/page.tsx`
- [ ] Wire up carousel with mock data
- [ ] Reuse `TransactionHistoryCard` from 03-products
- [ ] Reuse `DownloadReportsCard` from 03-products
- [ ] Connect selection logic to transaction history title

### Phase 7: Polish
- [ ] Add responsive styles for all breakpoints
- [ ] Add hover/focus states
- [ ] Add loading state for carousel
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify hideBalances integration for all monetary values

---

## Testing Checklist

### Functional Testing
- [ ] Page loads at `/productos/obligaciones`
- [ ] First product is selected by default (white bg, blue border)
- [ ] Unselected products have gray background
- [ ] Clicking a card selects it
- [ ] Only one card selected at a time
- [ ] Transaction history title updates on selection
- [ ] Left arrow scrolls carousel left
- [ ] Right arrow scrolls carousel right
- [ ] Dots indicate current position
- [ ] Clicking dot navigates to page
- [ ] Arrows hide/disable at scroll boundaries
- [ ] Date filter works correctly
- [ ] Month dropdown shows 12 months
- [ ] "Ocultar saldos" masks ALL monetary values (balance, disbursed, next payment)

### Visual Testing
- [ ] Selected card: White background, blue border
- [ ] Unselected card: Gray background (#F3F4F6), gray border
- [ ] "Al día" status displays in green
- [ ] "En mora" status displays in red
- [ ] Divider visible between status and additional info
- [ ] Monetary values in blue (#004680)
- [ ] Date values in black
- [ ] Detail labels in gray (#636363)

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
- [ ] Page loads at `/productos/obligaciones`
- [ ] Sidebar shows "Obligaciones" as active
- [ ] Back button navigates to `/home`
- [ ] Breadcrumbs display correctly ("Inicio / Productos / Obligaciones")
- [ ] Reused components (TransactionHistoryCard, DownloadReportsCard) work correctly

---

## Performance Considerations

### Carousel Optimization

1. **Reuse Existing Carousel Logic**:
   - Leverage carousel utilities from 04-ahorros
   - Same scroll behavior and performance optimizations

2. **Card Rendering**:
   - Cards are slightly taller, but still lightweight
   - No images to lazy load
   - CSS transitions for smooth selection changes

3. **Hide Balances Performance**:
   - Three monetary values per card need masking
   - Use memoization if performance becomes an issue

---

## API Integration (Future)

When connecting to the backend API:

| Endpoint | Purpose | When Called |
|----------|---------|-------------|
| `GET /balances?type=obligaciones` | Fetch loan products | Page load |
| `GET /movements?productId={id}` | Fetch transactions | Product selection |
| `GET /reports/{productId}/{month}` | Download PDF | Month selection |

See `.claude/knowledge/api/README.md` for full API documentation.

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`, `Breadcrumbs`, `BackButton`
- **Feature 04-ahorros**: Provides `CarouselArrow`, `CarouselDots`, carousel utilities
- **Feature 02-home**: Uses shared authenticated layout

---

## Comparison with Ahorros Feature

| Aspect | Ahorros (04) | Obligaciones (05) |
|--------|--------------|-------------------|
| Card Component | `SavingsProductCard` | `ObligacionProductCard` |
| Card Height | ~180px | ~240px (taller) |
| Card Min Width | 250px | 280px (wider) |
| Balance Label | "Saldo Total" | "Saldo a la fecha" |
| Status Values | activo/bloqueado/inactivo | al_dia/en_mora |
| Additional Fields | None | Valor desembolsado, Próximo pago, Valor próximo pago |
| Divider | None | Horizontal divider before details |
| Unselected Background | White | Gray (#F3F4F6) |
| Product Prefix | None | Optional (e.g., "CR-") |

---

## Reusability Notes

### ObligacionCarousel vs ProductCarousel

Two approaches were considered:

1. **Separate Carousel (Chosen)**: Create `ObligacionCarousel` that uses `ObligacionProductCard`
   - Pros: Simpler, focused, no breaking changes
   - Cons: Some code duplication

2. **Generic Carousel with Render Prop**: Modify `ProductCarousel` to accept `renderCard` prop
   - Pros: More DRY
   - Cons: Breaking change, more complex

The separate carousel approach is recommended for this implementation to maintain simplicity.

### Future Generic Carousel

If more product types need carousels, consider refactoring to:

```typescript
interface GenericCarouselProps<T extends { id: string }> {
  title: string;
  items: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
  renderCard: (item: T, isSelected: boolean) => ReactNode;
}
```

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [Design System](/.claude/design-system.md) - Color palette, typography
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines
- [Feature 03-products](../03-products/spec.md) - Reusable components
- [Feature 04-ahorros](../04-ahorros/spec.md) - Carousel components and utilities

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - Productos Obligaciones](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=327-3)
**Estimated Effort**: 1.5-2 days
**Dependencies**: Feature 03-products, Feature 04-ahorros
