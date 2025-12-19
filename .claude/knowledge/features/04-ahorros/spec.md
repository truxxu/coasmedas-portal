# Feature: Ahorros (04-ahorros)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 04
**Last Updated**: 2025-12-19

---

## Overview

The **Ahorros** (Savings) feature provides authenticated users access to their savings products through a horizontally scrollable carousel. Users can view multiple savings accounts, select one to see its transaction history, and download monthly statements.

**Key Purpose**:
- View all savings products in a scrollable carousel
- Select a product to see its details and transactions
- Filter and view transaction history for selected product
- Download monthly PDF reports/statements

**Key Difference from Aportes**:
- Aportes: Single static product info card
- Ahorros: Multiple products in a selectable carousel (reusable component)

---

## User Stories

### US-04.1: View Savings Products Carousel
**As an** authenticated user
**I want** to see all my savings products in a carousel
**So that** I can quickly overview all my savings accounts

**Acceptance Criteria**:
- [ ] Page displays at `/productos/ahorros`
- [ ] Carousel shows all user's savings products
- [ ] First product is selected by default (blue border)
- [ ] Navigation arrows appear on left and right sides
- [ ] Dot indicators show current position
- [ ] Horizontal scroll with snap-to-card behavior
- [ ] Responsive: 1 card on mobile, 2 on tablet, 3 on desktop

### US-04.2: Select Savings Product
**As an** authenticated user
**I want** to select a savings product from the carousel
**So that** I can view its transaction history and details

**Acceptance Criteria**:
- [ ] Clicking a card selects it (shows blue border)
- [ ] Only one card can be selected at a time
- [ ] Transaction history section updates with selected product's data
- [ ] Section title updates to show selected product number
- [ ] Selection persists during page session

### US-04.3: View Savings Product Card Information
**As an** authenticated user
**I want** to see key information on each savings product card
**So that** I can quickly understand my account status

**Acceptance Criteria**:
- [ ] Card shows product title (e.g., "Cuenta de Ahorros")
- [ ] Card shows account type (e.g., "Tipo de cuenta: Ahorros")
- [ ] Card shows masked product number (e.g., "***4428")
- [ ] Card shows total balance (respects "Ocultar saldos" toggle)
- [ ] Card shows status: "Activo" (green) or "Bloqueado" (red)

### US-04.4: Transaction History for Selected Product
**As an** authenticated user
**I want** to filter and view transaction history for my selected savings product
**So that** I can track my account activity

**Acceptance Criteria**:
- [ ] Transaction history updates when different product is selected
- [ ] Title dynamically shows selected product number
- [ ] Date range filter with start and end date inputs
- [ ] Maximum range limited to 3 months
- [ ] "Aplicar" button triggers filter
- [ ] Shows transactions matching filter
- [ ] Shows empty state when no transactions found

### US-04.5: Download Monthly Reports
**As an** authenticated user
**I want** to download monthly statements for my savings accounts
**So that** I can keep records of my account activity

**Acceptance Criteria**:
- [ ] Month dropdown shows available months (last 12 months)
- [ ] Selecting month triggers PDF download
- [ ] Clear description of functionality

---

## Technical Approach

### Routes

| Path | Description |
|------|-------------|
| `/productos/ahorros` | Ahorros (Savings) product page |

### File Structure

```
app/(authenticated)/productos/
├── ahorros/
│   └── page.tsx               # Ahorros page

src/
├── atoms/
│   ├── CarouselArrow.tsx      # NEW: Navigation arrow button
│   ├── CarouselDots.tsx       # NEW: Pagination dot indicators
│   └── index.ts               # Update exports
├── molecules/
│   ├── SavingsProductCard.tsx # NEW: Product card for carousel
│   └── index.ts               # Update exports
├── organisms/
│   ├── ProductCarousel.tsx    # NEW: Reusable carousel component
│   └── index.ts               # Update exports
├── types/
│   └── savings.ts             # NEW: Savings-related types
└── mocks/
    └── ahorros.ts             # NEW: Mock data for Ahorros
```

### Dependencies on Feature 03-products

The following components from feature 03-products will be **reused**:

| Component | Purpose |
|-----------|---------|
| `ProductPageHeader` | Page header with back button, title, breadcrumbs |
| `TransactionHistoryCard` | Transaction list with date filter |
| `DownloadReportsCard` | Monthly report download |
| `DateRangeFilter` | Date filter molecule |
| `Breadcrumbs` | Breadcrumb navigation |

---

## Component Specifications

### Atoms

#### CarouselArrow
Navigation arrow button for carousel (left/right variants).

```typescript
interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
```

**Styling**:
- Size: `42px x 42px`
- Background: White with shadow
- Border: `1px solid #E4E6EA`
- Border radius: `50%` (circle)
- Icon: Chevron left/right, `16px`, gray `#6A717F`
- Hover: Background `#F0F9FF`
- Disabled: Opacity `0.5`, cursor `not-allowed`
- Position: Vertically centered relative to cards

**Tailwind Classes**:
```css
w-[42px] h-[42px] rounded-full bg-white border border-[#E4E6EA]
shadow-sm flex items-center justify-center
hover:bg-[#F0F9FF] disabled:opacity-50 disabled:cursor-not-allowed
transition-colors
```

#### CarouselDots
Pagination dot indicators for carousel.

```typescript
interface CarouselDotsProps {
  totalDots: number;
  activeDot: number;
  onDotClick?: (index: number) => void;
  className?: string;
}
```

**Styling**:
- Dot size: `8px x 8px`
- Gap between dots: `8px`
- Active dot: Filled `#194E8D`
- Inactive dot: Outline `#E4E6EA`
- Border radius: `50%` (circle)
- Container: Centered below carousel

**Tailwind Classes**:
```css
/* Container */
flex items-center justify-center gap-2 mt-4

/* Dot - inactive */
w-2 h-2 rounded-full border border-[#E4E6EA] bg-white cursor-pointer

/* Dot - active */
w-2 h-2 rounded-full bg-[#194E8D] cursor-pointer
```

---

### Molecules

#### SavingsProductCard
Individual savings account card for the carousel.

```typescript
interface SavingsProductCardProps {
  product: SavingsProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

interface SavingsProduct {
  id: string;
  title: string;           // "Cuenta de Ahorros"
  accountType: string;     // "Ahorros", "Ahorro Programado"
  productNumber: string;   // "4428" (raw, will be masked)
  balance: number;         // 8730500
  status: SavingsStatus;   // 'activo' | 'bloqueado' | 'inactivo'
}

type SavingsStatus = 'activo' | 'bloqueado' | 'inactivo';
```

**Layout**:
```
┌─────────────────────────────────────┐
│ Cuenta de Ahorros                   │
│ Tipo de cuenta: Ahorros             │
│ Número de producto: ***4428         │
│                                     │
│ Saldo Total                         │
│ $ 8.730.500                         │
│ Activo                              │
└─────────────────────────────────────┘
```

**Styling**:
- Width: `250px` minimum, flexible
- Height: Auto
- Background: White
- Border: `1px solid #E4E6EA` (unselected) / `2px solid #194E8D` (selected)
- Border radius: `16px`
- Padding: `20px`
- Cursor: `pointer`
- Hover (unselected): Border `#B1B1B1`
- Transition: `border-color 0.2s ease`

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Ubuntu | 16px | Medium | Black |
| Account Type | Ubuntu | 14px | Regular | Black |
| Product Number | Ubuntu | 15px | Regular | Black |
| "Saldo Total" label | Ubuntu | 15px | Regular | Black |
| Balance | Ubuntu | 21px | Bold | Navy #112E7F |
| Status "Activo" | Ubuntu | 15px | Regular | Green #00A44C |
| Status "Bloqueado" | Ubuntu | 15px | Regular | Red #FF0000 |

**Hide Balances Integration**:
```typescript
const { hideBalances } = useUIContext();
{hideBalances ? '$ ••••••' : formatCurrency(product.balance)}
```

---

### Organisms

#### ProductCarousel
Reusable horizontal carousel component for displaying product cards.

```typescript
interface ProductCarouselProps {
  title: string;                              // "Resumen de Cuentas de Ahorro"
  products: SavingsProduct[];                 // Array of products
  selectedProductId?: string;                 // ID of selected product
  onProductSelect: (product: SavingsProduct) => void;
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Resumen de Cuentas de Ahorro                                                │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (←)  [Card 1]  [Card 2]  [Card 3]  (→)                                │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                              • • •                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Implementation Details**:

1. **Scroll Container**:
   - Use `overflow-x: auto` with `scroll-snap-type: x mandatory`
   - Hide scrollbar with CSS
   - Each card has `scroll-snap-align: start`

2. **Navigation Arrows**:
   - Left arrow: Scroll one card width left
   - Right arrow: Scroll one card width right
   - Hide left arrow at start, hide right arrow at end
   - Use `scrollBy()` with smooth behavior

3. **Dot Indicators**:
   - Calculate total "pages" based on visible cards
   - Track current page via scroll position
   - Click dot to scroll to that page

4. **Responsive Behavior**:
   | Breakpoint | Visible Cards | Card Width |
   |------------|---------------|------------|
   | Mobile (<640px) | 1 | 100% - padding |
   | Tablet (640-1023px) | 2 | ~48% |
   | Desktop (>=1024px) | 3 | ~32% |

**Styling**:
- Container: White background, rounded-2xl, padding 24px
- Title: Ubuntu Bold, 20px, navy #194E8D
- Cards container: Flex, gap-5, overflow-x-auto
- Gap between cards: `20px`

**Tailwind Classes**:
```css
/* Outer container */
bg-white rounded-2xl p-6

/* Title */
text-[20px] font-bold text-[#194E8D] mb-4

/* Carousel wrapper */
relative

/* Cards container */
flex gap-5 overflow-x-auto scroll-snap-x-mandatory scrollbar-hide

/* Individual card wrapper */
flex-shrink-0 scroll-snap-align-start
/* Width varies by breakpoint */
w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
```

**Scroll Behavior Hook**:
```typescript
// Custom hook for carousel scroll management
function useCarouselScroll(containerRef: RefObject<HTMLDivElement>) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const scrollLeft = () => { /* ... */ };
  const scrollRight = () => { /* ... */ };
  const scrollToPage = (page: number) => { /* ... */ };

  return { canScrollLeft, canScrollRight, currentPage, scrollLeft, scrollRight, scrollToPage };
}
```

---

## TypeScript Types

### File: `src/types/savings.ts`

```typescript
/**
 * Status of a savings product
 */
export type SavingsStatus = 'activo' | 'bloqueado' | 'inactivo';

/**
 * Savings product information
 */
export interface SavingsProduct {
  id: string;
  title: string;
  accountType: string;
  productNumber: string;
  balance: number;
  status: SavingsStatus;
}

/**
 * Carousel state for tracking scroll position
 */
export interface CarouselState {
  currentIndex: number;
  totalItems: number;
  visibleItems: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

/**
 * Props for product selection callback
 */
export type OnProductSelect = (product: SavingsProduct) => void;
```

### Update: `src/types/index.ts`

```typescript
// Add export
export * from './savings';
```

---

## Utility Functions

### File: `src/utils/carousel.ts` (NEW)

```typescript
/**
 * Calculate total pages based on total items and visible items
 */
export function calculateTotalPages(totalItems: number, visibleItems: number): number {
  return Math.ceil(totalItems / visibleItems);
}

/**
 * Get current page based on scroll position
 */
export function getCurrentPage(scrollLeft: number, cardWidth: number, gap: number): number {
  const itemWidth = cardWidth + gap;
  return Math.round(scrollLeft / itemWidth);
}

/**
 * Get scroll position for a specific page
 */
export function getScrollPositionForPage(page: number, cardWidth: number, gap: number): number {
  return page * (cardWidth + gap);
}
```

---

## Mock Data

### File: `src/mocks/ahorros.ts`

```typescript
import { SavingsProduct } from '@/src/types/savings';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock savings products for carousel
 */
export const mockSavingsProducts: SavingsProduct[] = [
  {
    id: '1',
    title: 'Cuenta de Ahorros',
    accountType: 'Ahorros',
    productNumber: '4428',
    balance: 8730500,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Ahorro Programado',
    accountType: 'Ahorro Programado',
    productNumber: '1234',
    balance: 2500000,
    status: 'activo',
  },
  {
    id: '3',
    title: 'Ahorro Metas',
    accountType: 'Ahorro',
    productNumber: '9876',
    balance: 1200000,
    status: 'bloqueado',
  },
];

/**
 * Mock transactions for selected savings product
 */
export const mockAhorrosTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-20',
    description: 'Abono mensual',
    amount: 20000,
    type: 'credit',
  },
  {
    id: '2',
    date: '2024-11-15',
    description: 'Transferencia recibida',
    amount: 150000,
    type: 'credit',
  },
  {
    id: '3',
    date: '2024-11-10',
    description: 'Retiro cajero',
    amount: 50000,
    type: 'debit',
  },
];

/**
 * Available months for report download
 */
export const mockAhorrosAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Update: `src/mocks/index.ts`

```typescript
export * from './ahorros';
// ... other exports
```

---

## Page Implementation

### File: `app/(authenticated)/productos/ahorros/page.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { ProductPageHeader } from '@/src/molecules';
import {
  ProductCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { SavingsProduct } from '@/src/types/savings';
import {
  mockSavingsProducts,
  mockAhorrosTransactions,
  mockAhorrosAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function AhorrosPage() {
  // Selected product state - first product selected by default
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct>(
    mockSavingsProducts[0]
  );

  // Transactions for the selected product
  const [transactions, setTransactions] = useState(mockAhorrosTransactions);

  // Selected month for reports
  const [selectedMonth, setSelectedMonth] = useState(
    mockAhorrosAvailableMonths[0]?.value
  );

  // Dynamic title based on selected product
  const transactionTitle = useMemo(() => {
    return `Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(selectedProduct.productNumber)})`;
  }, [selectedProduct.productNumber]);

  /**
   * Handle product selection from carousel
   */
  const handleProductSelect = (product: SavingsProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product from API
    console.log('Selected product:', product.id);
  };

  /**
   * Handle transaction date filter
   */
  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions for selected product
    console.log('Filtering transactions:', { startDate, endDate, productId: selectedProduct.id });
  };

  /**
   * Handle report download
   */
  const handleDownload = () => {
    // TODO: Trigger PDF download from API
    console.log('Downloading report:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ProductPageHeader
        title="Ahorros"
        backHref="/home"
        breadcrumbs={['Inicio', 'Productos', 'Ahorros']}
      />

      {/* Section 1: Product Carousel (NEW) */}
      <ProductCarousel
        title="Resumen de Cuentas de Ahorro"
        products={mockSavingsProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
      />

      {/* Section 2: Transaction History (EXISTING from 03-products) */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Section 3: Download Reports (EXISTING from 03-products) */}
      <DownloadReportsCard
        availableMonths={mockAhorrosAvailableMonths}
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

### Card Width Calculation

```typescript
// Calculate card width based on viewport
const getCardWidth = (containerWidth: number, visibleCards: number, gap: number) => {
  return (containerWidth - (gap * (visibleCards - 1))) / visibleCards;
};
```

### Responsive Tailwind Classes

```css
/* Card container */
.carousel-card {
  /* Mobile: full width */
  @apply w-full;

  /* Tablet: 2 cards */
  @apply sm:w-[calc(50%-10px)];

  /* Desktop: 3 cards */
  @apply lg:w-[calc(33.333%-14px)];
}

/* Hide arrows on mobile, show on larger screens */
.carousel-arrow {
  @apply hidden sm:flex;
}
```

---

## Accessibility Requirements

### Carousel Accessibility

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
  - `role="button"` (clickable)
  - `aria-selected="true"` on selected card
  - `tabindex="0"` for keyboard navigation
  - `aria-label` with product summary

- **Keyboard Navigation**:
  - Arrow keys to navigate between cards
  - Enter/Space to select card
  - Tab to move to arrows

### Example Accessible Markup

```tsx
<div role="region" aria-label="Resumen de Cuentas de Ahorro">
  <h2 id="carousel-title">Resumen de Cuentas de Ahorro</h2>

  <button aria-label="Ver productos anteriores" aria-disabled={!canScrollLeft}>
    <ChevronLeftIcon />
  </button>

  <div role="listbox" aria-labelledby="carousel-title">
    {products.map((product) => (
      <div
        key={product.id}
        role="option"
        aria-selected={product.id === selectedProductId}
        tabIndex={0}
        onClick={() => onProductSelect(product)}
        onKeyDown={(e) => e.key === 'Enter' && onProductSelect(product)}
      >
        {/* Card content */}
      </div>
    ))}
  </div>

  <button aria-label="Ver productos siguientes" aria-disabled={!canScrollRight}>
    <ChevronRightIcon />
  </button>

  <div role="tablist" aria-label="Páginas del carrusel">
    {dots.map((_, index) => (
      <button
        key={index}
        role="tab"
        aria-selected={index === currentPage}
        aria-label={`Ir a página ${index + 1}`}
        onClick={() => scrollToPage(index)}
      />
    ))}
  </div>
</div>
```

---

## Integration with Existing Context

### Hide Balances (UIContext)

```typescript
import { useUIContext } from '@/src/contexts';
import { formatCurrency, maskCurrency } from '@/src/utils';

// In SavingsProductCard
const { hideBalances } = useUIContext();

// Display balance
<span className="text-[21px] font-bold text-[#112E7F]">
  {hideBalances ? maskCurrency() : formatCurrency(product.balance)}
</span>
```

### Sidebar Active State

The sidebar should highlight "Ahorros" when on `/productos/ahorros`:

```typescript
// In Sidebar.tsx - already handled by pathname check
const pathname = usePathname();
const isAhorrosActive = pathname === '/productos/ahorros';
```

---

## Implementation Checklist

### Phase 1: Types and Utilities
- [ ] Create `src/types/savings.ts`
- [ ] Create `src/utils/carousel.ts`
- [ ] Update `src/types/index.ts` exports
- [ ] Update `src/utils/index.ts` exports

### Phase 2: Carousel Atoms
- [ ] Create `CarouselArrow` atom
- [ ] Create `CarouselDots` atom
- [ ] Update `src/atoms/index.ts` exports
- [ ] Style atoms per design specifications

### Phase 3: Carousel Molecules
- [ ] Create `SavingsProductCard` molecule
- [ ] Integrate with `useUIContext` for hideBalances
- [ ] Add status color logic (Activo/Bloqueado)
- [ ] Update `src/molecules/index.ts` exports

### Phase 4: Carousel Organism
- [ ] Create `ProductCarousel` organism
- [ ] Implement scroll behavior (snap, smooth)
- [ ] Implement navigation arrows logic
- [ ] Implement dot pagination
- [ ] Add responsive breakpoint handling
- [ ] Update `src/organisms/index.ts` exports

### Phase 5: Mock Data
- [ ] Create `src/mocks/ahorros.ts`
- [ ] Update `src/mocks/index.ts` exports

### Phase 6: Page Assembly
- [ ] Create `app/(authenticated)/productos/ahorros/page.tsx`
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
- [ ] Verify hideBalances integration

---

## Testing Checklist

### Functional Testing
- [ ] First product is selected by default
- [ ] Clicking a card selects it (blue border)
- [ ] Only one card selected at a time
- [ ] Transaction history title updates on selection
- [ ] Left arrow scrolls carousel left
- [ ] Right arrow scrolls carousel right
- [ ] Dots indicate current position
- [ ] Clicking dot navigates to page
- [ ] Arrows hide/disable at scroll boundaries
- [ ] Date filter works correctly
- [ ] Month dropdown shows 12 months
- [ ] "Ocultar saldos" masks all balances

### Responsive Testing
- [ ] Mobile: 1 card visible, swipe works
- [ ] Tablet: 2 cards visible, arrows work
- [ ] Desktop: 3 cards visible, arrows work
- [ ] Cards don't overflow container
- [ ] Gap between cards is consistent

### Accessibility Testing
- [ ] Keyboard navigation through carousel
- [ ] Arrow keys move between cards
- [ ] Enter/Space selects card
- [ ] Tab moves to navigation arrows
- [ ] Screen reader announces card content
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast passes WCAG AA

### Integration Testing
- [ ] Page loads at `/productos/ahorros`
- [ ] Sidebar shows "Ahorros" as active
- [ ] Back button navigates to `/home`
- [ ] Breadcrumbs display correctly
- [ ] Reused components work correctly

---

## Performance Considerations

### Carousel Optimization

1. **Virtualization** (if many products):
   - Consider virtualizing cards if > 10 products
   - Only render visible + buffer cards

2. **Scroll Performance**:
   - Use CSS `scroll-snap` instead of JS-based snapping
   - Use `transform` for arrow animations
   - Debounce scroll event handlers

3. **Image Optimization**:
   - If cards have images, use lazy loading
   - Use appropriate image sizes per breakpoint

### Code Splitting

```typescript
// Lazy load carousel for better initial load
const ProductCarousel = dynamic(
  () => import('@/src/organisms/ProductCarousel'),
  { loading: () => <CarouselSkeleton /> }
);
```

---

## API Integration (Future)

When connecting to the backend API:

| Endpoint | Purpose | When Called |
|----------|---------|-------------|
| `GET /balances?type=ahorros` | Fetch savings products | Page load |
| `GET /movements?productId={id}` | Fetch transactions | Product selection |
| `GET /reports/{productId}/{month}` | Download PDF | Month selection |

See `.claude/knowledge/api/README.md` for full API documentation.

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`, `ProductPageHeader`
- **Feature 05-inversiones**: Will also use `ProductCarousel` component
- **Feature 02-home**: Uses shared authenticated layout

---

## Reusability Notes

The `ProductCarousel` component is designed to be **reusable** for:

1. **Inversiones page** - Investment products carousel
2. **Coaspocket page** - Digital wallet products carousel
3. **Future product pages** - Any multi-product display

To use with different product types, the component accepts a generic product interface:

```typescript
// Generic carousel that works with any product type
interface ProductCarouselProps<T> {
  title: string;
  products: T[];
  selectedProductId?: string;
  onProductSelect: (product: T) => void;
  renderCard: (product: T, isSelected: boolean) => ReactNode;
}
```

---

## References

- [references.md](./references.md) - Design analysis and Figma links
- [Design System](/.claude/design-system.md) - Color palette, typography
- [Coding Standards](/.claude/coding-standards.md) - Code style guidelines
- [Feature 03-products](../03-products/spec.md) - Reusable components

---

**Feature Owner**: Development Team
**Design Reference**: [Figma - Productos Ahorros](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=194-6)
**Estimated Effort**: 2-3 days
**Dependencies**: Feature 03-products (TransactionHistoryCard, DownloadReportsCard, ProductPageHeader)
