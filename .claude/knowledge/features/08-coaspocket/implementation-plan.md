# Step-by-Step Implementation Plan: Coaspocket Feature (08-coaspocket)

**Feature**: 08-coaspocket (Digital Pockets/Bolsillos Page)
**Total Estimated Time**: 1.5-2 days
**Created**: 2025-12-23

---

## Prerequisites

### Before You Start
- [x] Feature spec reviewed (spec.md)
- [x] Design references analyzed (references.md)
- [x] Figma design reviewed
- [ ] Development environment running (`npm run dev`)

### Current Project State

**Components from previous features are ALREADY IMPLEMENTED**:

| Component | Location | Status |
|-----------|----------|--------|
| `CarouselArrow` | `src/atoms/CarouselArrow.tsx` | Ready to reuse |
| `CarouselDots` | `src/atoms/CarouselDots.tsx` | Ready to reuse |
| `SavingsProductCard` | `src/molecules/SavingsProductCard.tsx` | Reference |
| `ProteccionProductCard` | `src/molecules/ProteccionProductCard.tsx` | Reference |
| `ProductCarousel` | `src/organisms/ProductCarousel.tsx` | Reference |
| `ProteccionCarousel` | `src/organisms/ProteccionCarousel.tsx` | Reference |
| `TransactionHistoryCard` | `src/organisms/TransactionHistoryCard.tsx` | Ready to reuse |
| `DownloadReportsCard` | `src/organisms/DownloadReportsCard.tsx` | Ready to reuse |
| `Breadcrumbs` | `src/molecules/Breadcrumbs.tsx` | Ready to reuse |

**Existing Utilities**:
- `src/utils/carousel.ts` - `calculateTotalPages`, `getVisibleItems`
- `src/utils/formatCurrency.ts` - `formatCurrency`, `maskCurrency`, `maskNumber`
- `src/utils/dates.ts` - `generateMonthOptions`, `formatDate`

**Existing Patterns**:
- Proteccion page at `app/(authenticated)/productos/proteccion/page.tsx`
- WelcomeBar context for page title/back button
- Sidebar already includes "Coaspocket" in productSubItems

### What Needs to Be Created

| Type | Component | Purpose |
|------|-----------|---------|
| Type | `coaspocket.ts` | CoaspocketProduct, CoaspocketStatus types |
| Atom | `InfoBox` | Informational message box with accent |
| Molecule | `CoaspocketProductCard` | Pocket card for carousel |
| Molecule | `CreatePocketCard` | Action card for creating new pocket |
| Organism | `CoaspocketCarousel` | Carousel with products + action card |
| Mock | `coaspocket.ts` | Mock data for pockets |
| Page | `coaspocket/page.tsx` | Coaspocket page |

---

## Key Unique Features of Coaspocket

**IMPORTANT**: Coaspocket has unique elements not present in other product pages:

| Aspect | Other Products | Coaspocket |
|--------|----------------|------------|
| Action Card | No | **"Crear Nuevo Bolsillo" card at end** |
| InfoBox | No | **Suggestion message below carousel** |
| Card Design | Extended details | **Simple: name + balance + status only** |
| Number Format | Various | **`No.***1234` format** |
| Status Values | 2-3 options | **2: activo/inactivo** |
| Card Height | ~180-250px | **~140px (simpler)** |

---

## Phase 1: Types (10 minutes)

### Step 1.1: Create Coaspocket Types

**File**: `src/types/coaspocket.ts`

```typescript
/**
 * Status of a digital pocket
 */
export type CoaspocketStatus = 'activo' | 'inactivo';

/**
 * Digital pocket product information for carousel display
 */
export interface CoaspocketProduct {
  id: string;
  title: string;                    // "Mi Bolsillo Viajes", "Ahorro Emergencia"
  pocketNumber: string;             // "1234" (will be masked as No.***1234)
  balance: number;                  // Current pocket balance
  status: CoaspocketStatus;
}

/**
 * Callback type for pocket product selection
 */
export type OnCoaspocketSelect = (product: CoaspocketProduct) => void;

/**
 * Callback for create new pocket action
 */
export type OnCreatePocket = () => void;
```

### Step 1.2: Update Types Index

**File**: `src/types/index.ts` - Add export:

```typescript
export * from './coaspocket';
```

---

## Phase 2: Atom - InfoBox (30-45 minutes)

### Step 2.1: Create InfoBox Atom

**File**: `src/atoms/InfoBox.tsx`

This is a NEW reusable component for displaying informational messages with a left accent border.

```typescript
import React from 'react';

interface InfoBoxProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function InfoBox({
  children,
  icon,
  className = '',
}: InfoBoxProps) {
  return (
    <div
      role="note"
      className={`
        bg-[#F0F9FF] border-l-4 border-[#007FFF]
        rounded-r-lg p-4 flex items-start gap-3
        ${className}
      `}
    >
      {icon && (
        <div className="flex-shrink-0 text-[#007FFF]">
          {icon}
        </div>
      )}
      <div className="text-[14px] text-black">
        {children}
      </div>
    </div>
  );
}
```

### Step 2.2: Update Atoms Index

**File**: `src/atoms/index.ts` - Add export:

```typescript
export { InfoBox } from './InfoBox';
```

---

## Phase 3: Molecules - Product Cards (1-1.5 hours)

### Step 3.1: Create CoaspocketProductCard

**File**: `src/molecules/CoaspocketProductCard.tsx`

This is a SIMPLER card design than other products - only shows name, number, balance, and status.

```typescript
'use client';

import { useUIContext } from '@/src/contexts';
import { CoaspocketProduct } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface CoaspocketProductCardProps {
  product: CoaspocketProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Mask pocket number with "No." prefix format
 * @example maskPocketNumber("1234") => "No.***1234"
 */
function maskPocketNumber(number: string): string {
  return `No.***${number}`;
}

export function CoaspocketProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: CoaspocketProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: 'text-[#00A44C]',
    inactivo: 'text-[#808284]',
  }[product.status];

  const statusLabel = {
    activo: 'Activo',
    inactivo: 'Inactivo',
  }[product.status];

  // Format pocket number with "No." prefix
  const displayPocketNumber = maskPocketNumber(product.pocketNumber);

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
        rounded-2xl p-5 cursor-pointer min-w-[250px]
        transition-all duration-200
        ${isSelected
          ? 'bg-white border-2 border-[#194E8D]'
          : 'bg-[#E4E6EA] border border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
        ${className}
      `}
    >
      {/* Title */}
      <h3 className="text-[16px] font-medium text-black mb-1">
        {product.title}
      </h3>

      {/* Pocket Number */}
      <p className="text-[14px] text-black mb-3">
        {displayPocketNumber}
      </p>

      {/* Balance */}
      <p className="text-[21px] font-bold text-[#194E8D] mb-1">
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

### Step 3.2: Create CreatePocketCard

**File**: `src/molecules/CreatePocketCard.tsx`

This is the ACTION card that appears at the end of the carousel.

```typescript
'use client';

interface CreatePocketCardProps {
  onClick: () => void;
  className?: string;
}

export function CreatePocketCard({
  onClick,
  className = '',
}: CreatePocketCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-2xl p-5 min-w-[250px] min-h-[140px]
        bg-[#E4E6EA] border border-[#E4E6EA]
        hover:border-[#B1B1B1] hover:bg-[#D8DADD]
        transition-all duration-200
        flex flex-col items-center justify-center gap-3
        cursor-pointer
        ${className}
      `}
    >
      {/* Plus Icon Circle */}
      <div className="w-12 h-12 rounded-full bg-[#194E8D] flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Label */}
      <span className="text-[16px] font-medium text-[#194E8D]">
        Crear Nuevo Bolsillo
      </span>
    </button>
  );
}
```

### Step 3.3: Update Molecules Index

**File**: `src/molecules/index.ts` - Add exports:

```typescript
export { CoaspocketProductCard } from './CoaspocketProductCard';
export { CreatePocketCard } from './CreatePocketCard';
```

---

## Phase 4: Organism - CoaspocketCarousel (1-1.5 hours)

### Step 4.1: Create CoaspocketCarousel

**File**: `src/organisms/CoaspocketCarousel.tsx`

This carousel includes the action card at the end, unlike other carousels.

```typescript
'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CarouselArrow, CarouselDots } from '@/src/atoms';
import { CoaspocketProductCard, CreatePocketCard } from '@/src/molecules';
import { CoaspocketProduct } from '@/src/types';
import { calculateTotalPages, getVisibleItems } from '@/src/utils';

interface CoaspocketCarouselProps {
  title: string;
  products: CoaspocketProduct[];
  selectedProductId?: string;
  onProductSelect: (product: CoaspocketProduct) => void;
  onCreatePocket: () => void;
  className?: string;
}

export function CoaspocketCarousel({
  title,
  products,
  selectedProductId,
  onProductSelect,
  onCreatePocket,
  className = '',
}: CoaspocketCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Total items includes products + 1 for create action card
  const totalItems = products.length + 1;
  const totalPages = calculateTotalPages(totalItems, visibleItems);

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
          {/* Product Cards */}
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-shrink-0 snap-start
                w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
              "
            >
              <CoaspocketProductCard
                product={product}
                isSelected={product.id === selectedProductId}
                onClick={() => onProductSelect(product)}
              />
            </div>
          ))}

          {/* Create New Pocket Action Card - Always at End */}
          <div
            className="
              flex-shrink-0 snap-start
              w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
            "
          >
            <CreatePocketCard onClick={onCreatePocket} />
          </div>
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
export { CoaspocketCarousel } from './CoaspocketCarousel';
```

---

## Phase 5: Mock Data (10 minutes)

### Step 5.1: Create Coaspocket Mock Data

**File**: `src/mocks/coaspocket.ts`

```typescript
import { CoaspocketProduct } from '@/src/types/coaspocket';
import { Transaction, MonthOption } from '@/src/types/products';
import { generateMonthOptions } from '@/src/utils/dates';

/**
 * Mock digital pocket products for carousel
 */
export const mockCoaspocketProducts: CoaspocketProduct[] = [
  {
    id: '1',
    title: 'Mi Bolsillo Viajes',
    pocketNumber: '1234',
    balance: 1500000,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Ahorro Emergencia',
    pocketNumber: '5678',
    balance: 3200000,
    status: 'activo',
  },
  {
    id: '3',
    title: 'Fondo Navidad',
    pocketNumber: '9012',
    balance: 850000,
    status: 'inactivo',
  },
];

/**
 * Mock transactions for pocket accounts
 */
export const mockCoaspocketTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-15',
    description: 'Transferencia a Bolsillo Viajes',
    amount: 200000,
    type: 'credit',
  },
  {
    id: '2',
    date: '2024-11-01',
    description: 'Transferencia a Bolsillo Viajes',
    amount: 150000,
    type: 'credit',
  },
  {
    id: '3',
    date: '2024-10-20',
    description: 'Retiro para gastos viaje',
    amount: 300000,
    type: 'debit',
  },
];

/**
 * Available months for report download
 */
export const mockCoaspocketAvailableMonths: MonthOption[] = generateMonthOptions(12);
```

### Step 5.2: Update Mocks Index

**File**: `src/mocks/index.ts` - Add export:

```typescript
export * from './coaspocket';
```

---

## Phase 6: Page Assembly (45 minutes - 1 hour)

### Step 6.1: Create Coaspocket Page

**File**: `app/(authenticated)/productos/coaspocket/page.tsx`

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { InfoBox } from '@/src/atoms';
import { Breadcrumbs } from '@/src/molecules';
import {
  CoaspocketCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { CoaspocketProduct } from '@/src/types';
import {
  mockCoaspocketProducts,
  mockCoaspocketTransactions,
  mockCoaspocketAvailableMonths,
} from '@/src/mocks';

/**
 * Mask pocket number with "No." prefix format
 */
function maskPocketNumber(number: string): string {
  return `No.***${number}`;
}

export default function CoaspocketPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // First product selected by default
  const [selectedProduct, setSelectedProduct] = useState<CoaspocketProduct>(
    mockCoaspocketProducts[0]
  );
  const [transactions] = useState(mockCoaspocketTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockCoaspocketAvailableMonths[0]?.value || ''
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: 'Coaspocket',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic transaction title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = maskPocketNumber(selectedProduct.pocketNumber);
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: CoaspocketProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product from API
    console.log('Selected product:', product.id);
  };

  const handleCreatePocket = () => {
    // TODO: Open create pocket modal/flow
    console.log('Create new pocket clicked');
    alert('Funcionalidad de crear bolsillo en desarrollo');
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
      <Breadcrumbs items={['Inicio', 'Productos', 'Coaspocket']} />

      {/* Section 1: Product Carousel with Create Action */}
      <CoaspocketCarousel
        title="Mis Bolsillos Digitales"
        products={mockCoaspocketProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
        onCreatePocket={handleCreatePocket}
      />

      {/* Section 2: Suggestion InfoBox */}
      <InfoBox>
        <strong>Sugerencia:</strong> Crea bolsillos para organizar tus metas de ahorro.
        Puedes tener hasta 10 bolsillos activos simultáneamente.
      </InfoBox>

      {/* Section 3: Transaction History */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Section 4: Download Reports */}
      <DownloadReportsCard
        availableMonths={mockCoaspocketAvailableMonths}
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

- [ ] `src/types/index.ts` - coaspocket export
- [ ] `src/atoms/index.ts` - InfoBox export
- [ ] `src/molecules/index.ts` - CoaspocketProductCard, CreatePocketCard exports
- [ ] `src/organisms/index.ts` - CoaspocketCarousel export
- [ ] `src/mocks/index.ts` - coaspocket export

### Step 7.2: Testing Checklist

**Functional Tests**:
- [ ] Page loads at `/productos/coaspocket`
- [ ] First card is selected by default (white bg, blue border)
- [ ] Unselected cards have gray background (#E4E6EA)
- [ ] Clicking card changes selection
- [ ] Transaction title updates on selection
- [ ] Title uses "No.***XXXX" format
- [ ] "Crear Nuevo Bolsillo" action card appears at end of carousel
- [ ] Clicking create card triggers action (modal/alert)
- [ ] Arrow buttons scroll carousel (including to action card)
- [ ] Dots indicate current page (count includes action card)
- [ ] Hide balances toggle masks the balance value
- [ ] Sidebar shows "Coaspocket" as active
- [ ] InfoBox displays below carousel

**Visual Tests**:
- [ ] "Activo" status displays in green (#00A44C)
- [ ] "Inactivo" status displays in gray (#808284)
- [ ] Balance value in navy blue (#194E8D)
- [ ] Create action card has navy blue plus icon circle
- [ ] Create action card has navy blue "Crear Nuevo Bolsillo" text
- [ ] InfoBox has light blue background (#F0F9FF)
- [ ] InfoBox has blue left border (#007FFF)
- [ ] Cards are shorter/simpler than other product cards

**Responsive Tests**:
- [ ] Mobile: 1 card visible, swipe works
- [ ] Tablet: 2 cards visible, arrows work
- [ ] Desktop: 3 cards visible, arrows work
- [ ] Create action card scrolls into view properly

**Accessibility Tests**:
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] ARIA labels present on cards
- [ ] Focus states visible
- [ ] Create action card is focusable and activatable
- [ ] InfoBox has `role="note"`

---

## File Checklist Summary

### New Files to Create

| File | Phase | Priority |
|------|-------|----------|
| `src/types/coaspocket.ts` | 1 | High |
| `src/atoms/InfoBox.tsx` | 2 | High |
| `src/molecules/CoaspocketProductCard.tsx` | 3 | High |
| `src/molecules/CreatePocketCard.tsx` | 3 | High |
| `src/organisms/CoaspocketCarousel.tsx` | 4 | High |
| `src/mocks/coaspocket.ts` | 5 | High |
| `app/(authenticated)/productos/coaspocket/page.tsx` | 6 | High |

### Files to Update

| File | Changes | Phase |
|------|---------|-------|
| `src/types/index.ts` | Add coaspocket export | 1 |
| `src/atoms/index.ts` | Add InfoBox export | 2 |
| `src/molecules/index.ts` | Add CoaspocketProductCard, CreatePocketCard exports | 3 |
| `src/organisms/index.ts` | Add CoaspocketCarousel export | 4 |
| `src/mocks/index.ts` | Add coaspocket export | 5 |

---

## Time Estimates

| Phase | Description | Time |
|-------|-------------|------|
| Phase 1 | Types | 10 min |
| Phase 2 | InfoBox Atom | 30-45 min |
| Phase 3 | Product Cards (2) | 1-1.5 hrs |
| Phase 4 | CoaspocketCarousel | 1-1.5 hrs |
| Phase 5 | Mock Data | 10 min |
| Phase 6 | Page Assembly | 45 min - 1 hr |
| Phase 7 | Polish & Testing | 30-45 min |
| **Total** | | **~4.5-6 hrs (1.5-2 days)** |

---

## Dependencies Graph

```
Phase 1: Types (coaspocket.ts)
    ↓
Phase 2: InfoBox Atom (standalone)
    ↓
Phase 3: CoaspocketProductCard + CreatePocketCard (uses Types)
    ↓
Phase 4: CoaspocketCarousel (uses Molecules + existing atoms)
    ↓
Phase 5: Mock Data (uses Types)
    ↓
Phase 6: Page (uses InfoBox + Carousel + existing organisms)
    ↓
Phase 7: Polish & Testing
```

---

## Key Differences from Other Product Implementations

| Aspect | Other Products | Coaspocket |
|--------|----------------|------------|
| Carousel Content | Products only | **Products + Action Card** |
| Card Complexity | Extended details | **Simple: title + number + balance + status** |
| InfoBox | No | **Yes (suggestion message)** |
| Number Format | Various | **`No.***XXXX`** |
| Card Height | ~180-250px | **~140px** |
| Status Count | 2-3 | **2 (activo/inactivo)** |
| New Atoms | No | **Yes (InfoBox)** |
| New Action UI | No | **Yes (CreatePocketCard)** |

---

## Code Reuse Strategy

### Components Reused Without Changes
- `CarouselArrow` - Navigation arrows
- `CarouselDots` - Pagination dots
- `TransactionHistoryCard` - Transaction list
- `DownloadReportsCard` - Report download
- `Breadcrumbs` - Navigation breadcrumbs

### Utilities Reused
- `calculateTotalPages()` - Carousel pagination (note: +1 for action card)
- `getVisibleItems()` - Responsive card count
- `formatCurrency()` - Currency formatting
- `maskCurrency()` - Balance masking
- `generateMonthOptions()` - Month dropdown options

### Patterns Followed
- WelcomeBar context for page title
- UIContext for hideBalances
- Carousel scroll behavior
- Card selection state management

---

## Sidebar Navigation Note

Like Inversiones and Proteccion, there is **no sidebar update needed** because "Coaspocket" is already included in the sidebar productSubItems array:

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },  // Already exists!
];
```

---

## Future Enhancements (Out of Scope)

The following features are not part of this initial implementation:

1. **Create Pocket Flow**: Full modal/form for creating new pockets
2. **Edit Pocket**: Ability to rename or modify pocket settings
3. **Delete Pocket**: Ability to close/delete a pocket
4. **Transfer Between Pockets**: Move money between pockets
5. **Pocket Goals**: Set savings goals for each pocket
6. **Auto-Save Rules**: Automatic transfers to pockets

These can be added in future iterations.

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design References**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=TBD)
- **Design System**: `.claude/design-system.md`
- **Coding Standards**: `.claude/coding-standards.md`
- **Feature 07-proteccion**: `.claude/knowledge/features/07-proteccion/` (reference implementation)

---

**Last Updated**: 2025-12-23
**Status**: Ready for Implementation
