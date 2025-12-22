# References - Inversiones Feature (06-inversiones)

**Feature**: 06-inversiones
**Last Updated**: 2025-12-22

---

## Design Resources

### UI/UX Design

- **Inversiones Page**: [Figma - Productos Inversiones](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=353-3)
  - Main products page for "Inversiones" (investments/CDATs)
  - Shows page structure with 3 main sections
  - Uses carousel with investment-specific card design (CDAT products)

---

## Design Analysis (from Figma)

The Inversiones page follows the authenticated layout template and contains:

### Page Header
- Back arrow + "Inversiones" title (Ubuntu Medium, 20px, black)
- Breadcrumb: "Inicio / Productos / Inversiones"
- "Ocultar saldos" toggle on the right

### Section 1: Product Carousel (INVESTMENT-SPECIFIC CARD DESIGN)

**Title**: "Resumen de Inversiones" (Ubuntu Bold, 20px, navy #194E8D)

A horizontally scrollable carousel displaying CDAT (Certificado de Depósito de Ahorro a Término) investment cards with **investment-specific information**:

#### Carousel Behavior (Same as Ahorros/Obligaciones)
- First card is **selected by default** (blue border, white background)
- Unselected cards have gray background/border
- Navigation arrows on left and right sides
- Dot indicators below cards (• • •)
- Horizontal scroll with overflow hidden
- Gap between cards: ~20px

#### Product Cards - INVESTMENT-SPECIFIC DESIGN

**Card 1: CDTA Tradicional (SELECTED)**
- **Title**: "CDTA Tradicional" (Ubuntu Medium, 16px, black)
- **Product Number**: "Número de producto: DTA-******123" (Ubuntu Regular, 14px, black)
- **Amount Label**: "Monto del CDAT" (Ubuntu Regular, 15px, black)
- **Amount**: "$ 25.000.000" (Ubuntu Bold, 21px, blue #004680)
- **Status**: "Activo" (Ubuntu Regular, 15px, green #00A44C)
- **Divider**: 1px solid #E4E6EA
- **Investment Details Section** (below divider, two columns):
  - Left column (labels): Gray #636363
  - Right column (values): Black, Medium weight
  - Tasa E.A.: `12.5% E.A`
  - Plazo: `180 días`
  - F. Creación: `15 Ago 2025`
  - F. Vencimiento: `11 Feb 2025`
- **Border**: 2px solid #194E8D (selected state)
- **Background**: White (selected)

**Card 2: CDTA Plus (UNSELECTED)**
- **Title**: "CDTA Plus"
- **Product Number**: "Número de producto: DTA-*****456"
- **Amount Label**: "Monto del CDAT"
- **Amount**: "$ 50.000.000"
- **Status**: "Activo" (green)
- **Divider**: 1px solid #B1B1B1
- **Investment Details**:
  - Tasa E.A.: `13.0% E.A`
  - Plazo: `360 días`
  - F. Creación: `01 Oct 2025`
  - F. Vencimiento: `26 Sep 2025`
- **Border**: 1px solid #E4E6EA (unselected)
- **Background**: #E4E6EA (unselected - slightly gray)

### Section 2: Transaction History (EXISTING COMPONENT)
Reuses `TransactionHistoryCard` from feature 03-products.

- Title: "Consulta de Movimientos - CDAT Tradicional (CDAT-*****123)"
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
| Amount Blue | `#004680` | CDAT amount value |
| Active Green | `#00A44C` | "Activo" status |
| Gray Text | `#6A717F` | Labels, subtitles |
| Detail Gray | `#636363` | Detail labels (Tasa E.A., Plazo, etc.) |
| Light Gray | `#9AA1AD` | Helper text |
| Black | `#000000` | Body text, card titles, detail values |
| Border Gray | `#E4E6EA` | Unselected card borders, dividers |
| Divider Gray | `#B1B1B1` | Card internal divider (unselected) |
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
| Amount Label | Ubuntu | 15px | Regular | Black |
| Amount Value | Ubuntu | 21px | Bold | Blue #004680 |
| Status (Activo) | Ubuntu | 15px | Regular | Green #00A44C |
| Detail Label | Ubuntu | 14px | Regular | Gray #636363 |
| Detail Value | Ubuntu | 14px | Medium | Black |

---

## New Component: InversionProductCard

### Component Overview

A **new molecule** component that extends the carousel card design with investment-specific information. This component shows CDAT-specific fields for interest rate, term, creation date, and maturity date.

### Key Differences from Other Product Cards

| Feature | SavingsProductCard | ObligacionProductCard | InversionProductCard |
|---------|-------------------|----------------------|---------------------|
| Product Type | Savings accounts | Loans/Credits | CDATs/Investments |
| Amount Label | "Saldo Total" | "Saldo a la fecha" | "Monto del CDAT" |
| Product Prefix | None | Optional "CR-" | "DTA-" |
| Status Values | activo/bloqueado | al_dia/en_mora | activo/vencido |
| Additional Fields | None | Disbursed, Next Payment | Tasa E.A., Plazo, Dates |
| Detail Layout | None | Two columns | Two columns (label/value pairs) |
| Divider | None | Horizontal | Horizontal |
| Unselected BG | White | #F3F4F6 (gray) | #E4E6EA (gray) |

### InversionProductCard Props

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

### Card Layout Structure

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

### Card Styling

```css
/* Base card */
.inversion-card {
  background: #E4E6EA;        /* Unselected - slightly grayer than Obligaciones */
  border-radius: 16px;
  border: 1px solid #E4E6EA;
  padding: 20px;
  min-width: 280px;           /* Same width as ObligacionProductCard */
  cursor: pointer;
  transition: all 0.2s;
}

/* Selected state */
.inversion-card--selected {
  background: white;
  border: 2px solid #194E8D;
}

/* Hover state (unselected) */
.inversion-card:hover:not(.inversion-card--selected) {
  border-color: #B1B1B1;
}

/* Internal divider */
.inversion-card__divider {
  border-top: 1px solid #E4E6EA;
  margin: 12px 0;
}

/* Detail row */
.inversion-card__detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.inversion-card__detail-label {
  color: #636363;
  font-size: 14px;
}

.inversion-card__detail-value {
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
- `InversionProductCard` - Investment/CDAT card for carousel

### Organisms (New/Extended)
- `InversionCarousel` - Carousel specifically for investment products (similar to ObligacionCarousel)

### Organisms (Existing - Reuse)
- `TransactionHistoryCard` - Transaction list with date filter
- `DownloadReportsCard` - Monthly report download

---

## File Structure

```
app/(authenticated)/productos/
├── inversiones/
│   └── page.tsx               # Inversiones page

src/
├── molecules/
│   ├── InversionProductCard.tsx  # NEW: Investment card for carousel
│   └── index.ts                   # Update exports
├── organisms/
│   ├── InversionCarousel.tsx      # NEW: Carousel for investment products
│   └── index.ts                   # Update exports
├── types/
│   └── inversiones.ts             # NEW: Investment-related types
└── mocks/
    └── inversiones.ts             # NEW: Mock data for Inversiones
```

---

## Page Layout Structure

### Inversiones Page (`/productos/inversiones`)

```tsx
// app/(authenticated)/productos/inversiones/page.tsx
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
import { mockInversionProducts, mockInversionesTransactions, mockInversionesAvailableMonths } from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function InversionesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [selectedProduct, setSelectedProduct] = useState<InversionProduct>(mockInversionProducts[0]);
  const [transactions] = useState(mockInversionesTransactions);
  const [selectedMonth, setSelectedMonth] = useState(mockInversionesAvailableMonths[0]?.value);

  useEffect(() => {
    setWelcomeBar({
      title: 'Inversiones',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = `CDAT-${maskNumber(selectedProduct.productNumber)}`;
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  // ... handlers

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
        onMonthChange={setSelectedMonth}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

---

## Mock Data Examples

### Inversion Products

```typescript
// src/mocks/inversiones.ts
import { InversionProduct } from '@/src/types/inversiones';

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
];
```

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

---

## Implementation Considerations

### Reuse Existing Patterns
This feature follows the same patterns established in:
- **Feature 04-ahorros**: Carousel atoms (CarouselArrow, CarouselDots), carousel utilities
- **Feature 05-obligaciones**: Extended card design with divider and additional info section

### Key Implementation Points

1. **InversionProductCard** is similar to `ObligacionProductCard` but with:
   - Different amount label ("Monto del CDAT" vs "Saldo a la fecha")
   - Investment-specific detail fields (Tasa E.A., Plazo, Dates)
   - Status values: "activo" / "vencido" (instead of "al_dia" / "en_mora")
   - Only one monetary value to mask (amount) vs three in Obligaciones

2. **InversionCarousel** follows the same structure as `ObligacionCarousel`:
   - Reuses `CarouselArrow` and `CarouselDots` atoms
   - Reuses carousel utilities from `src/utils/carousel.ts`
   - Uses `InversionProductCard` instead of other card types

3. **Transaction History Title Format**:
   - Uses "CDAT-*****123" format for the product reference
   - Title pattern: "Consulta de Movimientos - CDTA Tradicional (CDAT-*****123)"

---

## Sidebar Navigation

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

## Comparison with Other Product Pages

| Aspect | Ahorros (04) | Obligaciones (05) | Inversiones (06) |
|--------|--------------|-------------------|------------------|
| Card Component | SavingsProductCard | ObligacionProductCard | InversionProductCard |
| Product Type | Savings accounts | Loans/Credits | CDATs |
| Amount Label | "Saldo Total" | "Saldo a la fecha" | "Monto del CDAT" |
| Amount Color | Navy #112E7F | Navy #112E7F | Blue #004680 |
| Product Prefix | None | Optional "CR-" | "DTA-" |
| Status Values | activo/bloqueado | al_dia/en_mora | activo/vencido |
| Has Divider | No | Yes | Yes |
| Detail Fields | None | 3 fields (disbursed, next payment) | 4 fields (rate, term, dates) |
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

- **Tasa E.A.** (Effective Annual Rate): The annual interest rate for the CDAT
- **Plazo** (Term): Duration of the investment in days
- **F. Creación** (Creation Date): When the CDAT was opened
- **F. Vencimiento** (Maturity Date): When the CDAT matures

### Display Formatting

```typescript
// Interest rate - display as-is from backend
interestRate: '12.5% E.A'

// Term - format with "días" suffix
termDays: 180  // Display as "180 días"

// Dates - format using formatDate utility
creationDate: '2025-08-15'  // Display as "15 Ago 2025"
maturityDate: '2025-02-11'  // Display as "11 Feb 2025"
```

---

## Implementation Priority

### Phase 1: Types
1. Create `src/types/inversiones.ts`
2. Update `src/types/index.ts`

### Phase 2: New Molecule
1. Create `InversionProductCard` molecule

### Phase 3: Carousel Organism
1. Create `InversionCarousel` organism (similar to ObligacionCarousel)

### Phase 4: Mock Data
1. Create `src/mocks/inversiones.ts`
2. Update `src/mocks/index.ts`

### Phase 5: Inversiones Page
1. Create `app/(authenticated)/productos/inversiones/page.tsx`
2. Wire up with mock data and existing components

### Phase 6: Polish
1. Test responsive behavior
2. Test hide balances integration
3. Verify accessibility

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`
- **Feature 04-ahorros**: Provides `CarouselArrow`, `CarouselDots`, carousel utilities
- **Feature 05-obligaciones**: Provides extended card pattern with divider and details

---

## Notes

- All text in Spanish (Colombia locale)
- Currency formatting: Colombian Peso with thousand separators (e.g., `$ 25.000.000`)
- Date format: `dd MMM yyyy` (e.g., "15 Ago 2025")
- Product numbers use "DTA-" prefix followed by masked number
- Transaction title uses "CDAT-" prefix (different from product number prefix)
- Interest rates displayed as strings from backend (e.g., "12.5% E.A")
- Term displayed in days with "días" suffix

---

**Last Reviewed**: 2025-12-22
**Status**: Ready for Implementation
