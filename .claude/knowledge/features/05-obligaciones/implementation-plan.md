# Step-by-Step Implementation Plan: Obligaciones Feature (05-obligaciones)

**Feature**: 05-obligaciones (Loans/Credits Page)
**Total Estimated Time**: 1.5-2 days
**Created**: 2025-12-20

---

## Prerequisites

### Before You Start
- [x] Feature spec reviewed (spec.md)
- [x] Design references analyzed (references.md)
- [x] Figma design reviewed
- [ ] Development environment running (`npm run dev`)

### Current Project State

**Feature 04-ahorros components are ALREADY IMPLEMENTED**:

| Component | Location | Status |
|-----------|----------|--------|
| `CarouselArrow` | `src/atoms/CarouselArrow.tsx` | Ready to reuse |
| `CarouselDots` | `src/atoms/CarouselDots.tsx` | Ready to reuse |
| `SavingsProductCard` | `src/molecules/SavingsProductCard.tsx` | Reference for ObligacionProductCard |
| `ProductCarousel` | `src/organisms/ProductCarousel.tsx` | Reference for ObligacionCarousel |
| `TransactionHistoryCard` | `src/organisms/TransactionHistoryCard.tsx` | Ready to reuse |
| `DownloadReportsCard` | `src/organisms/DownloadReportsCard.tsx` | Ready to reuse |
| `Breadcrumbs` | `src/molecules/Breadcrumbs.tsx` | Ready to reuse |

**Existing Utilities**:
- `src/utils/carousel.ts` - `calculateTotalPages`, `getVisibleItems`
- `src/utils/formatCurrency.ts` - `formatCurrency`, `maskCurrency`, `maskNumber`
- `src/utils/dates.ts` - `generateMonthOptions`, `formatDate`

**Existing Patterns**:
- Ahorros page at `app/(authenticated)/productos/ahorros/page.tsx`
- WelcomeBar context for page title/back button
- Sidebar productSubItems array at `src/organisms/Sidebar.tsx:20-26`

### What Needs to Be Created

| Type | Component | Purpose |
|------|-----------|---------|
| Type | `obligaciones.ts` | ObligacionProduct, ObligacionStatus types |
| Molecule | `ObligacionProductCard` | Extended loan card for carousel |
| Organism | `ObligacionCarousel` | Carousel using ObligacionProductCard |
| Mock | `obligaciones.ts` | Mock data for loans |
| Page | `obligaciones/page.tsx` | Obligaciones page |
| Update | `Sidebar.tsx` | Add "Obligaciones" to menu |

---

## Phase 1: Types (15 minutes)

### Step 1.1: Create Obligaciones Types

**File**: `src/types/obligaciones.ts`

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

### Step 1.2: Update Types Index

**File**: `src/types/index.ts` - Add export:

```typescript
export * from './obligaciones';
```

---

## Phase 2: Molecule - ObligacionProductCard (1-2 hours)

### Step 2.1: Create ObligacionProductCard

**File**: `src/molecules/ObligacionProductCard.tsx`

This is the key new component. It extends the SavingsProductCard pattern with:
- Different background colors (gray unselected, white selected)
- Additional info section with divider
- Three monetary values that respect hideBalances
- Different status labels (Al día / En mora)

```typescript
'use client';

import { useUIContext } from '@/src/contexts';
import { ObligacionProduct } from '@/src/types';
import { formatCurrency, maskCurrency, maskNumber, formatDate } from '@/src/utils';

interface ObligacionProductCardProps {
  product: ObligacionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ObligacionProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: ObligacionProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    al_dia: 'text-[#00A44C]',
    en_mora: 'text-red-600',
  }[product.status];

  const statusLabel = {
    al_dia: 'Al día',
    en_mora: 'En mora',
  }[product.status];

  // Format product number with optional prefix
  const displayProductNumber = product.productPrefix
    ? `${product.productPrefix}${maskNumber(product.productNumber)}`
    : maskNumber(product.productNumber);

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
        rounded-2xl p-5 cursor-pointer min-w-[280px]
        transition-all duration-200
        ${isSelected
          ? 'bg-white border-2 border-[#194E8D]'
          : 'bg-[#F3F4F6] border border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
        ${className}
      `}
    >
      {/* Title */}
      <h3 className="text-[16px] font-medium text-black mb-1">
        {product.title}
      </h3>

      {/* Product Number */}
      <p className="text-[14px] text-black mb-3">
        Número de producto: {displayProductNumber}
      </p>

      {/* Balance Section */}
      <p className="text-[15px] text-black">Saldo a la fecha</p>
      <p className="text-[21px] font-bold text-[#112E7F]">
        {hideBalances ? maskCurrency() : formatCurrency(product.currentBalance)}
      </p>

      {/* Status */}
      <p className={`text-[15px] ${statusColor}`}>
        {statusLabel}
      </p>

      {/* Divider */}
      <div className="border-t border-[#E4E6EA] my-3" />

      {/* Additional Info Section */}
      <div className="space-y-1">
        {/* Valor desembolsado */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Valor desembolsado:</span>
          <span className="text-[14px] font-medium text-[#004680]">
            {hideBalances ? maskCurrency() : formatCurrency(product.disbursedAmount)}
          </span>
        </div>

        {/* Próximo pago */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Próximo pago:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.nextPaymentDate)}
          </span>
        </div>

        {/* Valor próximo pago */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Valor próximo pago:</span>
          <span className="text-[14px] font-medium text-[#004680]">
            {hideBalances ? maskCurrency() : formatCurrency(product.nextPaymentAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Step 2.2: Update Molecules Index

**File**: `src/molecules/index.ts` - Add export:

```typescript
export { ObligacionProductCard } from './ObligacionProductCard';
```

---

## Phase 3: Organism - ObligacionCarousel (1-1.5 hours)

### Step 3.1: Create ObligacionCarousel

**File**: `src/organisms/ObligacionCarousel.tsx`

This follows the same pattern as `ProductCarousel` but uses `ObligacionProductCard`.

```typescript
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CarouselArrow, CarouselDots } from '@/src/atoms';
import { ObligacionProductCard } from '@/src/molecules';
import { ObligacionProduct } from '@/src/types';
import { calculateTotalPages, getVisibleItems } from '@/src/utils';

interface ObligacionCarouselProps {
  title: string;
  products: ObligacionProduct[];
  selectedProductId?: string;
  onProductSelect: (product: ObligacionProduct) => void;
  className?: string;
}

export function ObligacionCarousel({
  title,
  products,
  selectedProductId,
  onProductSelect,
  className = '',
}: ObligacionCarouselProps) {
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
              <ObligacionProductCard
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

### Step 3.2: Update Organisms Index

**File**: `src/organisms/index.ts` - Add export:

```typescript
export { ObligacionCarousel } from './ObligacionCarousel';
```

---

## Phase 4: Mock Data (15 minutes)

### Step 4.1: Create Obligaciones Mock Data

**File**: `src/mocks/obligaciones.ts`

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

### Step 4.2: Update Mocks Index

**File**: `src/mocks/index.ts` - Add export:

```typescript
export * from './obligaciones';
```

---

## Phase 5: Sidebar Update (10 minutes)

### Step 5.1: Add Obligaciones to Sidebar Menu

**File**: `src/organisms/Sidebar.tsx`

Locate the `productSubItems` array (around line 20-26) and add "Obligaciones":

**Current**:
```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

**Updated**:
```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },
];
```

---

## Phase 6: Page Assembly (30-45 minutes)

### Step 6.1: Create Obligaciones Page

**File**: `app/(authenticated)/productos/obligaciones/page.tsx`

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  ObligacionCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { ObligacionProduct } from '@/src/types';
import {
  mockObligacionProducts,
  mockObligacionesTransactions,
  mockObligacionesAvailableMonths,
} from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function ObligacionesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<ObligacionProduct>(
    mockObligacionProducts[0]
  );
  const [transactions] = useState(mockObligacionesTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockObligacionesAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Obligaciones',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = selectedProduct.productPrefix
      ? `${selectedProduct.productPrefix}${maskNumber(selectedProduct.productNumber)}`
      : maskNumber(selectedProduct.productNumber);
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: ObligacionProduct) => {
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
      <Breadcrumbs items={['Inicio', 'Productos', 'Obligaciones']} />

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
        onMonthChange={handleMonthChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Phase 7: Polish and Testing (30-45 minutes)

### Step 7.1: Verify All Index Exports

Check all index.ts files have the new exports:

- [ ] `src/types/index.ts` - obligaciones export
- [ ] `src/molecules/index.ts` - ObligacionProductCard export
- [ ] `src/organisms/index.ts` - ObligacionCarousel export
- [ ] `src/mocks/index.ts` - obligaciones export

### Step 7.2: Testing Checklist

**Functional Tests**:
- [ ] Page loads at `/productos/obligaciones`
- [ ] First card is selected by default (white bg, blue border)
- [ ] Unselected cards have gray background (#F3F4F6)
- [ ] Clicking card changes selection
- [ ] Transaction title updates on selection with correct prefix
- [ ] Arrow buttons scroll carousel
- [ ] Dots indicate current page
- [ ] Hide balances toggle masks ALL three monetary values
- [ ] Sidebar shows "Obligaciones" as active

**Visual Tests**:
- [ ] "Al día" status displays in green (#00A44C)
- [ ] "En mora" status displays in red
- [ ] Divider visible between status and additional info
- [ ] Monetary values (disbursed, next payment) in blue (#004680)
- [ ] Date values in black
- [ ] Detail labels in gray (#636363)
- [ ] Cards are wider than Ahorros cards (min-w-[280px])

**Responsive Tests**:
- [ ] Mobile: 1 card visible, swipe works
- [ ] Tablet: 2 cards visible, arrows work
- [ ] Desktop: 3 cards visible, arrows work

**Accessibility Tests**:
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] ARIA labels present on cards
- [ ] Focus states visible

---

## File Checklist Summary

### New Files to Create

| File | Phase | Priority |
|------|-------|----------|
| `src/types/obligaciones.ts` | 1 | High |
| `src/molecules/ObligacionProductCard.tsx` | 2 | High |
| `src/organisms/ObligacionCarousel.tsx` | 3 | High |
| `src/mocks/obligaciones.ts` | 4 | High |
| `app/(authenticated)/productos/obligaciones/page.tsx` | 6 | High |

### Files to Update

| File | Changes | Phase |
|------|---------|-------|
| `src/types/index.ts` | Add obligaciones export | 1 |
| `src/molecules/index.ts` | Add ObligacionProductCard export | 2 |
| `src/organisms/index.ts` | Add ObligacionCarousel export | 3 |
| `src/mocks/index.ts` | Add obligaciones export | 4 |
| `src/organisms/Sidebar.tsx` | Add "Obligaciones" to productSubItems | 5 |

---

## Time Estimates

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Types | 15 min |
| Phase 2 | ObligacionProductCard | 1-2 hrs |
| Phase 3 | ObligacionCarousel | 1-1.5 hrs |
| Phase 4 | Mock Data | 15 min |
| Phase 5 | Sidebar Update | 10 min |
| Phase 6 | Page Assembly | 30-45 min |
| Phase 7 | Polish & Testing | 30-45 min |
| **Total** | | **~4-6 hrs (1.5-2 days)** |

---

## Dependencies Graph

```
Phase 1: Types (obligaciones.ts)
    ↓
Phase 2: ObligacionProductCard (uses Types)
    ↓
Phase 3: ObligacionCarousel (uses ObligacionProductCard + existing atoms)
    ↓
Phase 4: Mock Data (uses Types)
    ↓
Phase 5: Sidebar Update (independent)
    ↓
Phase 6: Page (uses everything above)
    ↓
Phase 7: Polish & Testing
```

---

## Key Differences from Ahorros Implementation

| Aspect | Ahorros | Obligaciones |
|--------|---------|--------------|
| Card Component | `SavingsProductCard` | `ObligacionProductCard` |
| Carousel Component | `ProductCarousel` | `ObligacionCarousel` |
| Card Min Width | 250px | 280px (wider) |
| Card Background (unselected) | `#F3F4F6` | `#F3F4F6` (same) |
| Balance Label | "Saldo Total" | "Saldo a la fecha" |
| Status Values | activo/bloqueado/inactivo | al_dia/en_mora |
| Has Account Type | Yes | No |
| Has Divider | No | Yes |
| Additional Fields | None | 3 fields below divider |
| Product Prefix | No | Optional (e.g., "CR-") |

---

## Code Reuse Strategy

### Components Reused Without Changes
- `CarouselArrow` - Navigation arrows
- `CarouselDots` - Pagination dots
- `TransactionHistoryCard` - Transaction list
- `DownloadReportsCard` - Report download
- `Breadcrumbs` - Navigation breadcrumbs

### Utilities Reused
- `calculateTotalPages()` - Carousel pagination
- `getVisibleItems()` - Responsive card count
- `formatCurrency()` - Currency formatting
- `maskCurrency()` - Balance masking
- `maskNumber()` - Product number masking
- `formatDate()` - Date formatting
- `generateMonthOptions()` - Month dropdown options

### Patterns Followed
- WelcomeBar context for page title
- UIContext for hideBalances
- Carousel scroll behavior
- Card selection state management

---

## Future Considerations

### Generic Carousel Refactoring

After implementing both `ProductCarousel` (Ahorros) and `ObligacionCarousel`, if more product carousels are needed, consider refactoring to a generic carousel:

```typescript
interface GenericCarouselProps<T extends { id: string }> {
  title: string;
  items: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
  renderCard: (item: T, isSelected: boolean) => ReactNode;
}
```

This would allow a single carousel component to work with any card type via render prop pattern.

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design References**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=327-3)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`
- **Feature 04-ahorros**: `.claude/knowledge/features/04-ahorros/` (reference implementation)

---

**Last Updated**: 2025-12-20
**Status**: Ready for Implementation
