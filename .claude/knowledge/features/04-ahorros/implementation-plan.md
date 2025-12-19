# Step-by-Step Implementation Plan: Ahorros Feature (04-ahorros)

**Feature**: 04-ahorros (Savings Products Page)
**Total Estimated Time**: 2-3 days
**Created**: 2025-12-19

---

## Prerequisites

### Before You Start
- [x] Feature spec reviewed (spec.md)
- [x] Design references analyzed (references.md)
- [x] Figma design reviewed
- [ ] Development environment running (`npm run dev`)

### Current Project State

**Feature 03-products components are ALREADY IMPLEMENTED**:

| Component | Location | Status |
|-----------|----------|--------|
| `TransactionHistoryCard` | `src/organisms/` | Ready to reuse |
| `DownloadReportsCard` | `src/organisms/` | Ready to reuse |
| `AportesInfoCard` | `src/organisms/` | For reference |
| `Breadcrumbs` | `src/molecules/` | Ready to reuse |
| `DateRangeFilter` | `src/molecules/` | Ready to reuse |
| `SidebarSubItem` | `src/molecules/` | Ready to reuse |
| `BackButton` | `src/atoms/` | Ready to reuse |
| `DateInput` | `src/atoms/` | Ready to reuse |

**Existing Types and Utils**:
- `src/types/products.ts` - Transaction, MonthOption types
- `src/utils/dates.ts` - generateMonthOptions, formatDate
- `src/utils/formatCurrency.ts` - formatCurrency, maskCurrency, maskNumber
- `src/mocks/aportes.ts` - Mock data pattern reference

**Existing Routes**:
- `/productos` - Products index (redirects)
- `/productos/aportes` - Aportes page (implemented)

### What Needs to Be Created

| Type | Component | Purpose |
|------|-----------|---------|
| Atom | `CarouselArrow` | Navigation arrows |
| Atom | `CarouselDots` | Pagination dots |
| Molecule | `SavingsProductCard` | Product card for carousel |
| Organism | `ProductCarousel` | Reusable carousel |
| Type | `savings.ts` | Savings types |
| Util | `carousel.ts` | Carousel helpers |
| Mock | `ahorros.ts` | Ahorros mock data |
| Page | `ahorros/page.tsx` | Ahorros page |

---

## Phase 1: Types and Utilities (30 minutes)

### Step 1.1: Create Savings Types

**File**: `src/types/savings.ts`

```typescript
/**
 * Status of a savings product
 */
export type SavingsStatus = 'activo' | 'bloqueado' | 'inactivo';

/**
 * Savings product information for carousel display
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
 * Carousel scroll state
 */
export interface CarouselState {
  currentIndex: number;
  totalItems: number;
  visibleItems: number;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

/**
 * Callback type for product selection
 */
export type OnProductSelect = (product: SavingsProduct) => void;
```

### Step 1.2: Update Types Index

**File**: `src/types/index.ts` - Add export:

```typescript
export * from './savings';
```

### Step 1.3: Create Carousel Utilities

**File**: `src/utils/carousel.ts`

```typescript
/**
 * Calculate total pages for carousel pagination
 */
export function calculateTotalPages(totalItems: number, visibleItems: number): number {
  if (visibleItems <= 0) return 0;
  return Math.ceil(totalItems / visibleItems);
}

/**
 * Get current page index based on scroll position
 */
export function getCurrentPage(
  scrollLeft: number,
  cardWidth: number,
  gap: number
): number {
  const itemWidth = cardWidth + gap;
  if (itemWidth <= 0) return 0;
  return Math.round(scrollLeft / itemWidth);
}

/**
 * Calculate scroll position for a specific page
 */
export function getScrollPositionForPage(
  page: number,
  cardWidth: number,
  gap: number
): number {
  return page * (cardWidth + gap);
}

/**
 * Get number of visible items based on container width
 */
export function getVisibleItems(containerWidth: number): number {
  if (containerWidth < 640) return 1;      // Mobile
  if (containerWidth < 1024) return 2;     // Tablet
  return 3;                                 // Desktop
}
```

### Step 1.4: Update Utils Index

**File**: `src/utils/index.ts` - Add export:

```typescript
export * from './carousel';
```

---

## Phase 2: Carousel Atoms (1-2 hours)

### Step 2.1: Create CarouselArrow Atom

**File**: `src/atoms/CarouselArrow.tsx`

```typescript
'use client';

import { ChevronIcon } from './ChevronIcon';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function CarouselArrow({
  direction,
  onClick,
  disabled = false,
  className = '',
}: CarouselArrowProps) {
  const ariaLabel = direction === 'left'
    ? 'Ver productos anteriores'
    : 'Ver productos siguientes';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`
        w-[42px] h-[42px] rounded-full bg-white
        border border-[#E4E6EA] shadow-sm
        flex items-center justify-center
        hover:bg-[#F0F9FF] transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <ChevronIcon
        direction={direction}
        className="w-4 h-4 text-[#6A717F]"
      />
    </button>
  );
}
```

### Step 2.2: Create CarouselDots Atom

**File**: `src/atoms/CarouselDots.tsx`

```typescript
'use client';

interface CarouselDotsProps {
  totalDots: number;
  activeDot: number;
  onDotClick?: (index: number) => void;
  className?: string;
}

export function CarouselDots({
  totalDots,
  activeDot,
  onDotClick,
  className = '',
}: CarouselDotsProps) {
  if (totalDots <= 1) return null;

  return (
    <div
      role="tablist"
      aria-label="Páginas del carrusel"
      className={`flex items-center justify-center gap-2 mt-4 ${className}`}
    >
      {Array.from({ length: totalDots }, (_, index) => (
        <button
          key={index}
          role="tab"
          aria-selected={index === activeDot}
          aria-label={`Ir a página ${index + 1}`}
          onClick={() => onDotClick?.(index)}
          className={`
            w-2 h-2 rounded-full transition-colors cursor-pointer
            ${index === activeDot
              ? 'bg-[#194E8D]'
              : 'border border-[#E4E6EA] bg-white hover:border-[#B1B1B1]'
            }
          `}
        />
      ))}
    </div>
  );
}
```

### Step 2.3: Update Atoms Index

**File**: `src/atoms/index.ts` - Add exports:

```typescript
export { CarouselArrow } from './CarouselArrow';
export { CarouselDots } from './CarouselDots';
```

---

## Phase 3: SavingsProductCard Molecule (1-2 hours)

### Step 3.1: Create SavingsProductCard

**File**: `src/molecules/SavingsProductCard.tsx`

```typescript
'use client';

import { useUIContext } from '@/src/contexts';
import { SavingsProduct } from '@/src/types';
import { formatCurrency, maskCurrency, maskNumber } from '@/src/utils';

interface SavingsProductCardProps {
  product: SavingsProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SavingsProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: SavingsProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: 'text-[#00A44C]',
    bloqueado: 'text-red-600',
    inactivo: 'text-gray-500',
  }[product.status];

  const statusLabel = {
    activo: 'Activo',
    bloqueado: 'Bloqueado',
    inactivo: 'Inactivo',
  }[product.status];

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        bg-white rounded-2xl p-5 cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'border-2 border-[#194E8D]'
          : 'border border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
        ${className}
      `}
    >
      {/* Title */}
      <h3 className="text-[16px] font-medium text-black mb-1">
        {product.title}
      </h3>

      {/* Account Type */}
      <p className="text-[14px] text-black">
        Tipo de cuenta: {product.accountType}
      </p>

      {/* Product Number */}
      <p className="text-[15px] text-black mb-3">
        Número de producto: {maskNumber(product.productNumber)}
      </p>

      {/* Balance Section */}
      <p className="text-[15px] text-black">Saldo Total</p>
      <p className="text-[21px] font-bold text-[#112E7F]">
        {hideBalances ? maskCurrency() : formatCurrency(product.balance)}
      </p>

      {/* Status */}
      <p className={`text-[15px] ${statusColor}`}>
        {statusLabel}
      </p>
    </div>
  );
}
```

### Step 3.2: Update Molecules Index

**File**: `src/molecules/index.ts` - Add export:

```typescript
export { SavingsProductCard } from './SavingsProductCard';
```

---

## Phase 4: ProductCarousel Organism (2-3 hours)

### Step 4.1: Create ProductCarousel

**File**: `src/organisms/ProductCarousel.tsx`

```typescript
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CarouselArrow, CarouselDots } from '@/src/atoms';
import { SavingsProductCard } from '@/src/molecules';
import { SavingsProduct } from '@/src/types';
import { calculateTotalPages, getVisibleItems } from '@/src/utils';

interface ProductCarouselProps {
  title: string;
  products: SavingsProduct[];
  selectedProductId?: string;
  onProductSelect: (product: SavingsProduct) => void;
  className?: string;
}

export function ProductCarousel({
  title,
  products,
  selectedProductId,
  onProductSelect,
  className = '',
}: ProductCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const totalPages = calculateTotalPages(products.length, visibleItems);

  // Update visible items on resize
  useEffect(() => {
    const updateVisibleItems = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleItems(getVisibleItems(width));
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  // Update scroll state
  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate current page
    const cardWidth = clientWidth / visibleItems;
    const page = Math.round(scrollLeft / cardWidth);
    setCurrentPage(Math.min(page, totalPages - 1));
  }, [visibleItems, totalPages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollState);
    updateScrollState();

    return () => container.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  // Scroll handlers
  const scrollToPage = (page: number) => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.clientWidth / visibleItems;
    const gap = 20; // gap-5 = 20px
    containerRef.current.scrollTo({
      left: page * (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  const scrollLeft = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  const scrollRight = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      {/* Title */}
      <h2 className="text-[20px] font-bold text-[#194E8D] mb-4">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow - Hidden on mobile */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="left"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          />
        </div>

        {/* Cards Container */}
        <div
          ref={containerRef}
          role="listbox"
          aria-label={title}
          className="
            flex gap-5 overflow-x-auto scroll-smooth
            snap-x snap-mandatory scrollbar-hide
            px-1 py-1
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-shrink-0 snap-start
                w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
              "
            >
              <SavingsProductCard
                product={product}
                isSelected={product.id === selectedProductId}
                onClick={() => onProductSelect(product)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow - Hidden on mobile */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="right"
            onClick={scrollRight}
            disabled={!canScrollRight}
          />
        </div>
      </div>

      {/* Dot Indicators */}
      <CarouselDots
        totalDots={totalPages}
        activeDot={currentPage}
        onDotClick={scrollToPage}
      />
    </div>
  );
}
```

### Step 4.2: Update Organisms Index

**File**: `src/organisms/index.ts` - Add export:

```typescript
export { ProductCarousel } from './ProductCarousel';
```

---

## Phase 5: Mock Data (15 minutes)

### Step 5.1: Create Ahorros Mock Data

**File**: `src/mocks/ahorros.ts`

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
 * Mock transactions for savings accounts
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

### Step 5.2: Update Mocks Index

**File**: `src/mocks/index.ts` - Add export:

```typescript
export * from './ahorros';
```

---

## Phase 6: Ahorros Page (1 hour)

### Step 6.1: Create Ahorros Page

**File**: `app/(authenticated)/productos/ahorros/page.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { BackButton } from '@/src/atoms';
import { Breadcrumbs, HideBalancesToggle } from '@/src/molecules';
import {
  ProductCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { SavingsProduct } from '@/src/types';
import {
  mockSavingsProducts,
  mockAhorrosTransactions,
  mockAhorrosAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function AhorrosPage() {
  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct>(
    mockSavingsProducts[0]
  );
  const [transactions] = useState(mockAhorrosTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockAhorrosAvailableMonths[0]?.value
  );

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    return `Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(selectedProduct.productNumber)})`;
  }, [selectedProduct.productNumber]);

  const handleProductSelect = (product: SavingsProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product
  };

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering:', { startDate, endDate, productId: selectedProduct.id });
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download
    console.log('Downloading:', { month: selectedMonth, productId: selectedProduct.id });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BackButton href="/home" />
            <h1 className="text-[20px] font-medium text-black">Ahorros</h1>
          </div>
          <Breadcrumbs items={['Inicio', 'Productos', 'Ahorros']} />
        </div>
        <HideBalancesToggle />
      </div>

      {/* Section 1: Product Carousel */}
      <ProductCarousel
        title="Resumen de Cuentas de Ahorro"
        products={mockSavingsProducts}
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

## Phase 7: Polish and Testing (1-2 hours)

### Step 7.1: Add Scrollbar Hide CSS

**File**: `app/globals.css` - Add if not present:

```css
/* Hide scrollbar for carousel */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### Step 7.2: Verify All Index Exports

Check all index.ts files have the new exports:

- [ ] `src/atoms/index.ts` - CarouselArrow, CarouselDots
- [ ] `src/molecules/index.ts` - SavingsProductCard
- [ ] `src/organisms/index.ts` - ProductCarousel
- [ ] `src/types/index.ts` - savings exports
- [ ] `src/utils/index.ts` - carousel exports
- [ ] `src/mocks/index.ts` - ahorros exports

### Step 7.3: Testing Checklist

**Functional Tests**:
- [ ] Page loads at `/productos/ahorros`
- [ ] First card is selected by default
- [ ] Clicking card changes selection
- [ ] Transaction title updates on selection
- [ ] Arrow buttons scroll carousel
- [ ] Dots indicate current page
- [ ] Hide balances toggle works
- [ ] Date filter is functional
- [ ] Month dropdown shows options

**Responsive Tests**:
- [ ] Mobile (1 card): Swipe navigation works
- [ ] Tablet (2 cards): Arrows visible, work correctly
- [ ] Desktop (3 cards): All cards visible initially

**Accessibility Tests**:
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] ARIA labels present
- [ ] Focus states visible

---

## File Checklist Summary

### New Files to Create

| File | Phase |
|------|-------|
| `src/types/savings.ts` | 1 |
| `src/utils/carousel.ts` | 1 |
| `src/atoms/CarouselArrow.tsx` | 2 |
| `src/atoms/CarouselDots.tsx` | 2 |
| `src/molecules/SavingsProductCard.tsx` | 3 |
| `src/organisms/ProductCarousel.tsx` | 4 |
| `src/mocks/ahorros.ts` | 5 |
| `app/(authenticated)/productos/ahorros/page.tsx` | 6 |

### Files to Update

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add savings export |
| `src/utils/index.ts` | Add carousel export |
| `src/atoms/index.ts` | Add CarouselArrow, CarouselDots |
| `src/molecules/index.ts` | Add SavingsProductCard |
| `src/organisms/index.ts` | Add ProductCarousel |
| `src/mocks/index.ts` | Add ahorros export |
| `app/globals.css` | Add scrollbar-hide (if needed) |

---

## Time Estimates

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Types and Utilities | 30 min |
| Phase 2 | Carousel Atoms | 1-2 hrs |
| Phase 3 | SavingsProductCard | 1-2 hrs |
| Phase 4 | ProductCarousel | 2-3 hrs |
| Phase 5 | Mock Data | 15 min |
| Phase 6 | Ahorros Page | 1 hr |
| Phase 7 | Polish & Testing | 1-2 hrs |
| **Total** | | **~8-12 hrs (2-3 days)** |

---

## Dependencies Graph

```
Phase 1: Types & Utils
    ↓
Phase 2: CarouselArrow, CarouselDots (atoms)
    ↓
Phase 3: SavingsProductCard (molecule) ← uses Types
    ↓
Phase 4: ProductCarousel (organism) ← uses Atoms + Molecule
    ↓
Phase 5: Mock Data ← uses Types
    ↓
Phase 6: Ahorros Page ← uses all above + existing components
    ↓
Phase 7: Polish & Testing
```

---

## Reusability Notes

The `ProductCarousel` component created in this feature will be **reusable** for:

- `/productos/inversiones` - Investment products
- `/productos/coaspocket` - Digital wallet products
- Any future multi-product display pages

To reuse with different card designs, consider refactoring to accept a `renderCard` prop:

```typescript
interface GenericCarouselProps<T> {
  title: string;
  items: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
  renderCard: (item: T, isSelected: boolean) => ReactNode;
}
```

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design References**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=194-6)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`
- **Feature 03-products**: `.claude/knowledge/features/03-products/` (reusable components)

---

**Last Updated**: 2025-12-19
**Status**: Ready for Implementation
