# References - Obligaciones Feature (05-obligaciones)

**Feature**: 05-obligaciones
**Last Updated**: 2025-12-19

---

## Design Resources

### UI/UX Design

- **Obligaciones Page**: [Figma - Productos Obligaciones](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=327-3)
  - Main products page for "Obligaciones" (loans/credits)
  - Shows page structure with 3 main sections
  - Uses carousel with loan-specific card design

---

## Design Analysis (from Figma)

The Obligaciones page follows the authenticated layout template and contains:

### Page Header
- Back arrow + "Obligaciones" title (Ubuntu Medium, 20px, black)
- Breadcrumb: "Inicio / Productos / Ahorros" (Note: breadcrumb shows "Ahorros" in design, should be "Obligaciones")
- "Ocultar saldos" toggle on the right

### Section 1: Product Carousel (EXTENDED CARD DESIGN)

**Title**: "Resumen de Cuentas de Ahorro" (Note: should likely be "Resumen de Obligaciones")

A horizontally scrollable carousel displaying loan/credit cards with **extended information**:

#### Carousel Behavior (Same as Ahorros)
- First card is **selected by default** (blue border, white background)
- Unselected cards have gray background (#F3F4F6)
- Navigation arrows on left and right sides
- Dot indicators below cards (• • •)
- Horizontal scroll with overflow hidden
- Gap between cards: ~20px

#### Product Cards - NEW EXTENDED DESIGN

**Card 1: Crédito de Libre Inversión (SELECTED)**
- **Title**: "Crédito de Libre Inversión" (Ubuntu Medium, 16px, black)
- **Product Number**: "Número de producto: ***5678" (Ubuntu Regular, 14px, black)
- **Balance Label**: "Saldo a la fecha" (Ubuntu Regular, 15px, black)
- **Balance Amount**: "$ 12.500.000" (Ubuntu Bold, 21px, navy #112E7F)
- **Status**: "Al día" (Ubuntu Regular, 15px, green #00A44C)
- **Divider**: 1px solid #E4E6EA
- **Additional Info Section** (below divider):
  - Valor desembolsado: `$ 20.000.000` (label gray #636363, value blue #004680)
  - Próximo pago: `30 Nov 2025` (label gray #636363, value black)
  - Valor próximo pago: `$ 850.000` (label gray #636363, value blue #004680)
- **Border**: 2px solid #194E8D (selected state)
- **Background**: White (selected)

**Card 2: Cupo Rotativo Personal (UNSELECTED)**
- **Title**: "Cupo Rotativo Personal"
- **Product Number**: "Número de producto: CR-***1010"
- **Balance Label**: "Saldo a la fecha"
- **Balance Amount**: "$ 3.000.000"
- **Status**: "Al día" (green)
- **Divider**: 1px solid #E4E6EA
- **Additional Info Section**:
  - Valor desembolsado: `$ 5.000.000`
  - Próximo pago: `20 Dic 2025`
  - Valor próximo pago: `$ 150.000`
- **Border**: 1px solid #E4E6EA (unselected)
- **Background**: #F3F4F6 (unselected)

### Section 2: Transaction History (EXISTING COMPONENT)
Reuses `TransactionHistoryCard` from feature 03-products.

- Title: "Consulta de Movimientos - Cuenta de Ahorros (***4428)"
- Subtitle: "Últimos movimientos registrados."
- Date range filter with "Aplicar" button
- Helper text: "El filtro de fecha solo permite un rango de los últimos 3 meses."
- Empty state: "No se encontraron movimientos en el período seleccionado."

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
| Value Blue | `#004680` | Disbursed amount, next payment value |
| Active Green | `#00A44C` | "Al día" status |
| Overdue Red | `#FF0000` | "En mora" status (if applicable) |
| Gray Text | `#6A717F` | Labels, subtitles |
| Detail Gray | `#636363` | Detail labels (Valor desembolsado, etc.) |
| Light Gray | `#9AA1AD` | Helper text |
| Black | `#000000` | Body text, card titles, dates |
| Border Gray | `#E4E6EA` | Unselected card borders, dividers |
| Card Background | `#F3F4F6` | Unselected card background |
| Background | `#F0F9FF` | Light blue page background |
| White | `#FFFFFF` | Selected card backgrounds |

---

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page Title | Ubuntu | 20px | Medium | Black |
| Section Title | Ubuntu | 20px | Bold | Navy #194E8D |
| Card Title | Ubuntu | 16px | Medium | Black |
| Product Number | Ubuntu | 14px | Regular | Black |
| Balance Label | Ubuntu | 15px | Regular | Black |
| Balance Amount | Ubuntu | 21px | Bold | Navy #112E7F |
| Status (Al día) | Ubuntu | 15px | Regular | Green #00A44C |
| Detail Label | Ubuntu | 14px | Regular | Gray #636363 |
| Detail Value (money) | Ubuntu | 14px | Medium | Blue #004680 |
| Detail Value (date) | Ubuntu | 14px | Medium | Black |

---

## New Component: ObligacionProductCard

### Component Overview

A **new molecule** component that extends the carousel card design with loan-specific information. This component shows additional fields for disbursed amount, next payment date, and next payment value.

### Key Differences from SavingsProductCard

| Feature | SavingsProductCard | ObligacionProductCard |
|---------|-------------------|----------------------|
| Account Type | Shows "Tipo de cuenta" | Not shown |
| Balance Label | "Saldo Total" | "Saldo a la fecha" |
| Status | "Activo" / "Bloqueado" | "Al día" / "En mora" |
| Additional Info | None | Valor desembolsado, Próximo pago, Valor próximo pago |
| Divider | None | Horizontal divider before additional info |

### ObligacionProductCard Props

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
  productPrefix?: string;           // "CR-" for some products
  currentBalance: number;           // 12500000 (saldo a la fecha)
  status: 'al_dia' | 'en_mora';
  disbursedAmount: number;          // 20000000 (valor desembolsado)
  nextPaymentDate: string;          // "2025-11-30" (próximo pago)
  nextPaymentAmount: number;        // 850000 (valor próximo pago)
}
```

### Card Layout Structure

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

### Card Styling

```css
/* Base card */
.obligacion-card {
  background: #F3F4F6;        /* Unselected */
  border-radius: 16px;
  border: 1px solid #E4E6EA;
  padding: 20px;
  min-width: 280px;           /* Slightly wider for extra content */
  cursor: pointer;
  transition: all 0.2s;
}

/* Selected state */
.obligacion-card--selected {
  background: white;
  border: 2px solid #194E8D;
}

/* Hover state (unselected) */
.obligacion-card:hover:not(.obligacion-card--selected) {
  border-color: #B1B1B1;
}

/* Internal divider */
.obligacion-card__divider {
  border-top: 1px solid #E4E6EA;
  margin: 12px 0;
}

/* Detail row */
.obligacion-card__detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.obligacion-card__detail-label {
  color: #636363;
  font-size: 14px;
}

.obligacion-card__detail-value--money {
  color: #004680;
  font-weight: 500;
  font-size: 14px;
}

.obligacion-card__detail-value--date {
  color: black;
  font-weight: 500;
  font-size: 14px;
}
```

---

## Component Hierarchy (Atomic Design)

### Atoms (Existing - Reuse)
- `CarouselArrow` - Navigation arrow button
- `CarouselDots` - Dot indicators for pagination
- `Divider` - Horizontal divider

### Molecules (New)
- `ObligacionProductCard` - Loan/credit card for carousel with extended info

### Organisms (Existing - Reuse)
- `ProductCarousel` - Reusable carousel container (needs to accept different card types)
- `TransactionHistoryCard` - Transaction list with date filter
- `DownloadReportsCard` - Monthly report download

---

## File Structure

```
app/(authenticated)/productos/
├── obligaciones/
│   └── page.tsx               # Obligaciones page

src/
├── molecules/
│   ├── ObligacionProductCard.tsx  # NEW: Loan card for carousel
│   └── index.ts                    # Update exports
├── types/
│   └── obligaciones.ts             # NEW: Obligation-related types
└── mocks/
    └── obligaciones.ts             # NEW: Mock data for Obligaciones
```

---

## Page Layout Structure

### Obligaciones Page (`/productos/obligaciones`)

```tsx
// app/(authenticated)/productos/obligaciones/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs } from '@/src/molecules';
import {
  ProductCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { ObligacionProductCard } from '@/src/molecules';
import { useWelcomeBar } from '@/src/contexts';
import { ObligacionProduct } from '@/src/types';
import { mockObligacionProducts, mockObligacionesTransactions, mockObligacionesAvailableMonths } from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function ObligacionesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [selectedProduct, setSelectedProduct] = useState<ObligacionProduct>(mockObligacionProducts[0]);
  const [transactions] = useState(mockObligacionesTransactions);
  const [selectedMonth, setSelectedMonth] = useState(mockObligacionesAvailableMonths[0]?.value);

  useEffect(() => {
    setWelcomeBar({
      title: 'Obligaciones',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // ... handlers

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Obligaciones']} />

      {/* Section 1: Product Carousel with ObligacionProductCard */}
      {/* Note: May need to create a generic carousel or extend ProductCarousel */}

      {/* Section 2: Transaction History */}
      <TransactionHistoryCard ... />

      {/* Section 3: Download Reports */}
      <DownloadReportsCard ... />
    </div>
  );
}
```

---

## Mock Data Examples

### Obligacion Products

```typescript
// src/mocks/obligaciones.ts
import { ObligacionProduct } from '@/src/types/obligaciones';

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
];
```

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
```

---

## Implementation Considerations

### Option 1: Separate Carousel Component
Create a new `ObligacionCarousel` organism that uses `ObligacionProductCard` instead of `SavingsProductCard`.

### Option 2: Generic Carousel with Render Prop
Modify `ProductCarousel` to accept a `renderCard` prop:

```typescript
interface GenericCarouselProps<T> {
  title: string;
  items: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
  renderCard: (item: T, isSelected: boolean) => ReactNode;
  className?: string;
}
```

### Recommended Approach
**Option 1** is simpler for now - create `ObligacionCarousel` that reuses the carousel logic but with the new card design. This keeps components focused and avoids over-abstraction.

---

## Integration with Existing Components

### Hide Balances
The `hideBalances` state from `UIContext` should mask monetary values in:
- `ObligacionProductCard` - Current balance, disbursed amount, next payment amount
- `TransactionHistoryCard` - Transaction amounts

```typescript
const { hideBalances } = useUIContext();
{hideBalances ? '$ ••••••' : formatCurrency(amount)}
```

### Transaction History Dynamic Title
Title updates based on selected product:
```typescript
title={`Consulta de Movimientos - ${selectedProduct.title} (${maskNumber(selectedProduct.productNumber, selectedProduct.productPrefix)})`}
```

---

## Sidebar Navigation

Obligaciones should be added to the Products accordion in the sidebar, positioned between Ahorros and Inversiones:

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

## Implementation Priority

### Phase 1: Types
1. Create `src/types/obligaciones.ts`
2. Update `src/types/index.ts`

### Phase 2: New Molecule
1. Create `ObligacionProductCard` molecule

### Phase 3: Carousel (Choose approach)
Option A: Create `ObligacionCarousel` organism
Option B: Generalize `ProductCarousel` with render prop

### Phase 4: Mock Data
1. Create `src/mocks/obligaciones.ts`
2. Update `src/mocks/index.ts`

### Phase 5: Obligaciones Page
1. Create `app/(authenticated)/productos/obligaciones/page.tsx`
2. Update Sidebar with new menu item

### Phase 6: Polish
1. Test responsive behavior
2. Test hide balances integration
3. Verify accessibility

---

## Differences from Ahorros Page

| Aspect | Ahorros | Obligaciones |
|--------|---------|--------------|
| Card Type | SavingsProductCard | ObligacionProductCard |
| Card Fields | Balance, Status | Balance, Status + Disbursed, Next Payment Date/Amount |
| Balance Label | "Saldo Total" | "Saldo a la fecha" |
| Status Values | activo/bloqueado | al_dia/en_mora |
| Additional Info | None | Valor desembolsado, Próximo pago, Valor próximo pago |
| Card Height | ~180px | ~240px (taller due to extra fields) |

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`
- **Feature 04-ahorros**: Provides `ProductCarousel`, `CarouselArrow`, `CarouselDots`, carousel utilities
- **Feature 06-inversiones**: May also use similar extended card patterns

---

## Notes

- All text in Spanish (Colombia locale)
- Currency formatting: Colombian Peso with thousand separators (e.g., `$ 12.500.000`)
- Date format: `dd MMM yyyy` (e.g., "30 Nov 2025")
- The Obligaciones card is taller than Ahorros card due to additional info section
- Product prefix (e.g., "CR-") appears before masked number for some products
- Status colors: Green for "Al día", Red for "En mora"

---

**Last Reviewed**: 2025-12-19
**Status**: Ready for Implementation
