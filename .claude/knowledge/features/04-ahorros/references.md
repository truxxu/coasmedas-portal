# References - Ahorros Feature (04-ahorros)

**Feature**: 04-ahorros
**Last Updated**: 2025-12-19

---

## Design Resources

### UI/UX Design

- **Ahorros Page**: [Figma - Productos Ahorros](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=194-6)
  - Main products page for "Ahorros" (savings accounts)
  - Shows page structure with 3 main sections

---

## Design Analysis (from Figma)

The Ahorros page follows the authenticated layout template and contains:

### Page Header
- Back arrow + "Ahorros" title (Ubuntu Medium, 20px, black)
- Breadcrumb: "Inicio / Productos / Ahorros"
- "Ocultar saldos" toggle on the right

### Section 1: Product Carousel (NEW REUSABLE COMPONENT)

**Title**: "Resumen de Cuentas de Ahorro" (Ubuntu Bold, 20px, navy #194E8D)

A horizontally scrollable carousel displaying savings account cards:

#### Carousel Behavior
- First card is **selected by default** (blue border)
- Navigation arrows on left and right sides
- Dot indicators below cards (• • •)
- Horizontal scroll with overflow hidden
- Gap between cards: ~20px

#### Product Cards (3 visible in design)

**Card 1: Cuenta de Ahorros (SELECTED)**
- Title: "Cuenta de Ahorros" (Ubuntu Medium, 16px, black)
- Tipo de cuenta: Ahorros (Ubuntu Regular, 14px, black)
- Número de producto: ***4428 (Ubuntu Regular, 15px, black)
- Saldo Total label (Ubuntu Regular, 15px, black)
- Balance: $ 8.730.500 (Ubuntu Bold, 21px, navy #112E7F)
- Status: "Activo" (Ubuntu Regular, 15px, green #00A44C)
- **Border: Blue #194E8D (selected state)**

**Card 2: Ahorro Programado**
- Title: "Ahorro Programado"
- Tipo de cuenta: Ahorro Programado.
- Número de producto: ***1234
- Saldo Total: $ 2.500.000
- Status: "Activo" (green)
- Border: Gray #E4E6EA (unselected)

**Card 3: Ahorro Metas**
- Title: "Ahorro Metas"
- Tipo de cuenta: Ahorro
- Número de producto: ***9876
- Saldo Total: $ 1.200.000
- Status: "Bloqueado" (red)
- Border: Gray #E4E6EA (unselected)

### Section 2: Transaction History (EXISTING COMPONENT)
Reuses `TransactionHistoryCard` from feature 03-products.

- Title: "Consulta de Movimientos - Cuenta de Ahorros (***4428)"
- Subtitle: "Últimos movimientos registrados."
- Date range filter with "Aplicar" button
- Helper text: "El filtro de fecha solo permite un rango de los últimos 3 meses."
- **Shows transaction**: "Abono mensual, 20 Nov 2024, + $ 20.000" (green amount)

### Section 3: Download Reports (EXISTING COMPONENT)
Reuses `DownloadReportsCard` from feature 03-products.

- Title: "Descargar extractos"
- Description: "Selecciona el mes que deseas consultar para descargar tu extracto en formato PDF."
- Month dropdown: "Diciembre de 2025"

---

## Color Palette (from design)

| Color | Hex | Usage |
|-------|-----|-------|
| Navy Blue | `#194E8D` | Section titles, selected card border |
| Balance Blue | `#112E7F` | Balance amounts in cards |
| Active Green | `#00A44C` | "Activo" status |
| Blocked Red | `red` / `#FF0000` | "Bloqueado" status |
| Gray Text | `#6A717F` | Labels, subtitles |
| Light Gray | `#9AA1AD` | Helper text |
| Black | `#000000` | Body text, card titles |
| Border Gray | `#E4E6EA` | Unselected card borders, dividers |
| Background | `#F0F9FF` | Light blue page background |
| White | `#FFFFFF` | Card backgrounds |

---

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page Title | Ubuntu | 20px | Medium | Black |
| Section Title | Ubuntu | 20px | Bold | Navy #194E8D |
| Card Title | Ubuntu | 16px | Medium | Black |
| Card Type/Number | Ubuntu | 14-15px | Regular | Black |
| Balance Label | Ubuntu | 15px | Regular | Black |
| Balance Amount | Ubuntu | 21px | Bold | Navy #112E7F |
| Status Active | Ubuntu | 15px | Regular | Green #00A44C |
| Status Blocked | Ubuntu | 15px | Regular | Red |
| Transaction Title | Ubuntu | 18px | Medium | Black |
| Transaction Date | Ubuntu | 14px | Regular | Black |
| Transaction Amount | Ubuntu | - | - | Green (credit) |

---

## New Component: Product Carousel

### Component Overview

A **reusable carousel** component that displays product cards with horizontal scrolling. This component will be used across multiple product pages (Ahorros, Inversiones, etc.).

### ProductCarousel Props

```typescript
interface ProductCarouselProps {
  title: string;                    // "Resumen de Cuentas de Ahorro"
  products: SavingsProduct[];       // Array of products to display
  selectedProductId?: string;       // ID of selected product (first by default)
  onProductSelect: (product: SavingsProduct) => void;
  className?: string;
}

interface SavingsProduct {
  id: string;
  title: string;                    // "Cuenta de Ahorros"
  accountType: string;              // "Ahorros", "Ahorro Programado", etc.
  productNumber: string;            // "4428" (will be masked as ***4428)
  balance: number;                  // 8730500
  status: 'activo' | 'bloqueado' | 'inactivo';
}
```

### SavingsProductCard Props (Molecule)

```typescript
interface SavingsProductCardProps {
  product: SavingsProduct;
  isSelected?: boolean;             // Shows blue border when true
  onClick?: () => void;
  className?: string;
}
```

### Carousel Navigation

**Left/Right Arrows**:
- Circular button with gray background
- Chevron icon inside
- Size: 42px x 42px
- Position: Vertically centered on card row
- Shows/hides based on scroll position

**Dot Indicators**:
- Position: Below carousel cards, centered
- Active dot: Filled/solid
- Inactive dots: Outline/hollow
- Number of dots matches number of "pages" or cards

### Card Styling

```css
/* Base card */
.savings-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #E4E6EA;
  padding: 20px;
  min-width: 250px;
  cursor: pointer;
  transition: border-color 0.2s;
}

/* Selected state */
.savings-card--selected {
  border: 2px solid #194E8D;
}

/* Hover state (unselected) */
.savings-card:hover:not(.savings-card--selected) {
  border-color: #B1B1B1;
}
```

---

## Component Hierarchy (Atomic Design)

### Atoms (New)
- `CarouselArrow` - Navigation arrow button (left/right variants)
- `CarouselDots` - Dot indicators for pagination
- `StatusBadge` - "Activo" / "Bloqueado" status text (already exists as part of design system)

### Molecules (New)
- `SavingsProductCard` - Individual savings account card for carousel

### Organisms (New)
- `ProductCarousel` - Reusable carousel container with navigation

### Organisms (Existing - Reuse from 03-products)
- `TransactionHistoryCard` - Transaction list with date filter
- `DownloadReportsCard` - Monthly report download
- `ProductPageHeader` - Page header with back button and breadcrumbs (via molecules)

---

## File Structure

```
app/(authenticated)/productos/
├── ahorros/
│   └── page.tsx               # Ahorros page

src/
├── atoms/
│   ├── CarouselArrow.tsx      # NEW: Navigation arrow
│   ├── CarouselDots.tsx       # NEW: Pagination dots
│   └── index.ts               # Update exports
├── molecules/
│   ├── SavingsProductCard.tsx # NEW: Product card for carousel
│   └── index.ts               # Update exports
├── organisms/
│   ├── ProductCarousel.tsx    # NEW: Reusable carousel
│   └── index.ts               # Update exports
├── types/
│   └── savings.ts             # NEW: Savings-related types
└── mocks/
    └── ahorros.ts             # NEW: Mock data for Ahorros
```

---

## Page Layout Structure

### Ahorros Page (`/productos/ahorros`)

```tsx
// app/(authenticated)/productos/ahorros/page.tsx
'use client';

import { useState } from 'react';
import { ProductPageHeader } from '@/src/molecules';
import {
  ProductCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { SavingsProduct } from '@/src/types/savings';
import { mockSavingsProducts, mockTransactions, mockAvailableMonths } from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function AhorrosPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct>(mockSavingsProducts[0]);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedMonth, setSelectedMonth] = useState(mockAvailableMonths[0]?.value);

  const handleProductSelect = (product: SavingsProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product
  };

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions
    console.log('Filtering:', startDate, endDate);
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download
    console.log('Downloading report for:', selectedMonth);
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

      {/* Section 2: Transaction History (EXISTING) */}
      <TransactionHistoryCard
        title={`Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(selectedProduct.productNumber)})`}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Section 3: Download Reports (EXISTING) */}
      <DownloadReportsCard
        availableMonths={mockAvailableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Mock Data Examples

### Savings Products

```typescript
// src/mocks/ahorros.ts
import { SavingsProduct } from '@/src/types/savings';

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
```

### Transactions (with data)

```typescript
export const mockAhorrosTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-11-20',
    description: 'Abono mensual',
    amount: 20000,
    type: 'credit',
  },
];
```

---

## TypeScript Types

### File: `src/types/savings.ts`

```typescript
export type SavingsStatus = 'activo' | 'bloqueado' | 'inactivo';

export interface SavingsProduct {
  id: string;
  title: string;
  accountType: string;
  productNumber: string;
  balance: number;
  status: SavingsStatus;
}

export interface CarouselState {
  currentIndex: number;
  totalItems: number;
  visibleItems: number;
}
```

---

## Carousel Implementation Notes

### Scroll Behavior
- Use CSS `overflow-x: auto` with `scroll-snap-type: x mandatory`
- Each card has `scroll-snap-align: start`
- JavaScript to control arrow navigation and dot indicators

### Selection Logic
- First product selected by default on page load
- Clicking a card selects it (blue border)
- Transaction history updates to show selected product's transactions

### Responsive Behavior

| Breakpoint | Visible Cards | Behavior |
|------------|---------------|----------|
| Mobile (<640px) | 1 | Full width card, swipe to navigate |
| Tablet (640-1023px) | 2 | Two cards visible |
| Desktop (>=1024px) | 3 | Three cards visible |

### Accessibility
- Arrow buttons have aria-labels: "Ver productos anteriores", "Ver productos siguientes"
- Dots have aria-label: "Ir a página X"
- Cards are focusable with keyboard navigation
- Selected card has aria-selected="true"

---

## Integration with Existing Components

### Hide Balances
The `hideBalances` state from `UIContext` should mask balance values in:
- `SavingsProductCard` - Balance amount
- `TransactionHistoryCard` - Transaction amounts

```typescript
const { hideBalances } = useUIContext();
{hideBalances ? '$ ••••••' : formatCurrency(balance)}
```

### Transaction History Dynamic Title
Title updates based on selected product:
```typescript
title={`Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(selectedProduct.productNumber)})`}
```

---

## Implementation Priority

### Phase 1: Types and Mock Data
1. Create `src/types/savings.ts`
2. Create `src/mocks/ahorros.ts`

### Phase 2: Carousel Atoms
1. Create `CarouselArrow` atom
2. Create `CarouselDots` atom

### Phase 3: Carousel Components
1. Create `SavingsProductCard` molecule
2. Create `ProductCarousel` organism

### Phase 4: Ahorros Page
1. Create `app/(authenticated)/productos/ahorros/page.tsx`
2. Wire up with existing components
3. Connect selection logic

### Phase 5: Polish
1. Add responsive styles
2. Add scroll animations
3. Test keyboard navigation

---

## Differences from Aportes Page

| Aspect | Aportes | Ahorros |
|--------|---------|---------|
| Section 1 | Static info card (AportesInfoCard) | Carousel with multiple cards |
| Product Selection | Single product | Multiple products, selectable |
| Transaction Title | Fixed | Dynamic (based on selection) |
| Section 2 | TransactionHistoryCard | TransactionHistoryCard (same) |
| Section 3 | DownloadReportsCard | DownloadReportsCard (same) |

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`, `ProductPageHeader`
- **Feature 05-inversiones**: Will also use `ProductCarousel` component
- **Feature 02-home**: Uses shared authenticated layout

---

## Notes

- All text in Spanish (Colombia locale)
- Currency formatting: Colombian Peso with thousand separators (e.g., `$ 8.730.500`)
- The carousel is the main new component; Sections 2 and 3 are existing
- Selection state affects transaction history display
- First product is always selected on page load

---

**Last Reviewed**: 2025-12-19
**Status**: Ready for Implementation
