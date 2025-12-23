# References - Coaspocket Feature (08-coaspocket)

**Feature**: 08-coaspocket
**Last Updated**: 2025-12-23

---

## Design Resources

### UI/UX Design

- **Coaspocket Page**: [Figma - Productos Coaspocket](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=365-3)
  - Main products page for "Coaspocket" (digital pockets/bolsillos)
  - Shows page structure with 3 main sections
  - Uses carousel with pocket cards + action card for creating new pockets

---

## Design Analysis (from Figma)

The Coaspocket page follows the authenticated layout template and contains:

### Page Header
- Back arrow + "Coaspocket" title (Ubuntu Medium, 20px, black)
- Breadcrumb: "Inicio / Productos / Coaspocket"
- "Ocultar saldos" toggle on the right

### Section 1: Product Carousel - "Mis Bolsillos Coas"

**Title**: "Mis Bolsillos Coas" (Ubuntu Bold, 20px, navy #194E8D)

A horizontally scrollable carousel displaying pocket cards with a special action card:

#### Carousel Behavior (Same as other product carousels)
- First pocket card is **selected by default** (blue border, white background)
- Unselected cards have gray background
- Navigation arrows on left and right sides
- Dot indicators below cards (• • •)
- Horizontal scroll with overflow hidden
- Gap between cards: ~20px

#### Pocket Cards

**Card 1: Vacaciones (SELECTED)**
- **Title**: "Vacaciones" (Ubuntu Medium, 16px, black)
- **Pocket Number**: "Número de bolsillo: ***1234" (Ubuntu Regular, 14px, black)
- **Balance Label**: "Saldo" (Ubuntu Regular, 15px, black)
- **Balance Amount**: "$ 1.500.000" (Ubuntu Bold, 21px, navy #004680)
- **Status**: "Activo" (Ubuntu Regular, 15px, green #00A44C)
- **Border**: 2px solid #194E8D (selected state)
- **Background**: White (selected)

**Card 2: Imprevistos (UNSELECTED)**
- **Title**: "Imprevistos"
- **Pocket Number**: "Número de bolsillo: ***5678"
- **Balance Label**: "Saldo"
- **Balance Amount**: "$ 500.000"
- **Status**: "Activo" (green)
- **Border**: 1px solid #E4E6EA (unselected)
- **Background**: Light gray (unselected)

#### NEW COMPONENT: Create Pocket Action Card

**"Crear Nuevo Bolsillo" Card**
- **Visual Style**: Dashed border, lighter background
- **Icon**: Plus (+) icon centered or at top
- **Text**: "Crear Nuevo Bolsillo" (Ubuntu Medium, 14-16px)
- **Border**: 2px dashed #B1B1B1 or #D1D2D4
- **Background**: #F5F5F5 or transparent
- **Behavior**: Clickable, navigates to pocket creation flow (TBD)
- **Position**: Last card in carousel

### Section 2: Transaction History (EXISTING + NEW INFO BOX)

Reuses `TransactionHistoryCard` from feature 03-products, with a **new info box component**.

- Title: "Consulta de Movimientos - Arreglos para la Casa (***4567)"
- Subtitle: "Últimos movimientos registrados."
- Date range filter with "Aplicar" button
- Helper text: "El filtro de fecha solo permite un rango de los últimos 3 meses."
- Empty state: "No se encontraron movimientos en el período seleccionado."

#### NEW COMPONENT: Suggestion Info Box

A blue informational box below the transaction list:

- **Background**: `#F0F9FF` (light blue)
- **Border**: `1px solid #007FFF` (blue)
- **Border Radius**: `8px`
- **Padding**: `16px`
- **Icon**: Info icon (optional, left side)
- **Label**: "Sugerencia:" (Ubuntu Bold, 14px, navy #1D4E8F)
- **Text**: "Para agregar o retirar dinero de tus bolsillos, ve a la sección de Transferencias Internas y selecciona 'Entre mis cuentas'." (Ubuntu Regular, 14px, navy #1D4E8F)

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
| Balance Blue | `#004680` | Balance amounts in cards |
| Active Green | `#00A44C` | "Activo" status |
| Info Box Blue | `#007FFF` | Info box border |
| Info Box BG | `#F0F9FF` | Info box background |
| Info Text | `#1D4E8F` | Info box text color |
| Gray Text | `#6A717F` | Labels, subtitles |
| Light Gray | `#9AA1AD` | Helper text |
| Black | `#000000` | Body text, card titles |
| Border Gray | `#E4E6EA` | Unselected card borders, dividers |
| Dashed Border | `#B1B1B1` | Create pocket card border |
| Background | `#F0F9FF` | Light blue page background |
| White | `#FFFFFF` | Selected card backgrounds |

---

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page Title | Ubuntu | 20px | Medium | Black |
| Section Title | Ubuntu | 20px | Bold | Navy #194E8D |
| Card Title | Ubuntu | 16px | Medium | Black |
| Pocket Number | Ubuntu | 14px | Regular | Black |
| Balance Label | Ubuntu | 15px | Regular | Black |
| Balance Amount | Ubuntu | 21px | Bold | Blue #004680 |
| Status (Activo) | Ubuntu | 15px | Regular | Green #00A44C |
| Create Card Text | Ubuntu | 14-16px | Medium | Gray #636363 |
| Info Label | Ubuntu | 14px | Bold | Navy #1D4E8F |
| Info Text | Ubuntu | 14px | Regular | Navy #1D4E8F |

---

## New Components Required

### 1. CoaspocketProductCard (Molecule)

Individual pocket card for the carousel.

```typescript
interface CoaspocketProductCardProps {
  product: CoaspocketProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

interface CoaspocketProduct {
  id: string;
  title: string;                    // "Vacaciones", "Imprevistos"
  pocketNumber: string;             // "1234" (will be masked as ***1234)
  balance: number;                  // 1500000
  status: CoaspocketStatus;         // 'activo' | 'inactivo'
}

type CoaspocketStatus = 'activo' | 'inactivo';
```

### 2. CreatePocketCard (Molecule)

Action card for creating new pockets.

```typescript
interface CreatePocketCardProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
```

**Styling**:
- Dashed border: `border-2 border-dashed border-[#B1B1B1]`
- Background: `bg-[#F5F5F5]` or `bg-transparent`
- Plus icon: Centered, gray color
- Text: "Crear Nuevo Bolsillo"
- Hover: Background slightly darker or border color change
- Same dimensions as pocket cards for carousel alignment

### 3. InfoBox / SuggestionBox (Atom or Molecule)

Informational message box component.

```typescript
interface InfoBoxProps {
  label?: string;                   // "Sugerencia:"
  message: string;
  variant?: 'info' | 'warning' | 'success';
  className?: string;
}
```

**Styling (Info variant)**:
- Background: `bg-[#F0F9FF]`
- Border: `border border-[#007FFF] rounded-lg`
- Padding: `p-4`
- Icon: Optional info icon
- Text color: `text-[#1D4E8F]`

### 4. CoaspocketCarousel (Organism)

Carousel for pocket cards including the create action card.

```typescript
interface CoaspocketCarouselProps {
  title: string;                              // "Mis Bolsillos Coas"
  products: CoaspocketProduct[];
  selectedProductId?: string;
  onProductSelect: (product: CoaspocketProduct) => void;
  onCreatePocket?: () => void;                // Handler for create button
  className?: string;
}
```

---

## Component Hierarchy (Atomic Design)

### Atoms (New)
- `InfoBox` - Blue informational/suggestion box (could also be a molecule)

### Atoms (Existing - Reuse)
- `CarouselArrow` - Navigation arrow button
- `CarouselDots` - Dot indicators for pagination

### Molecules (New)
- `CoaspocketProductCard` - Pocket card for carousel (similar to SavingsProductCard)
- `CreatePocketCard` - Action card with plus icon to create new pocket

### Organisms (New)
- `CoaspocketCarousel` - Carousel including pocket cards + create card

### Organisms (Existing - Reuse)
- `TransactionHistoryCard` - Transaction list with date filter
- `DownloadReportsCard` - Monthly report download

---

## File Structure

```
app/(authenticated)/productos/
├── coaspocket/
│   └── page.tsx                   # Coaspocket page

src/
├── atoms/
│   ├── InfoBox.tsx                # NEW: Info/suggestion message box
│   └── index.ts                   # Update exports
├── molecules/
│   ├── CoaspocketProductCard.tsx  # NEW: Pocket card for carousel
│   ├── CreatePocketCard.tsx       # NEW: Create pocket action card
│   └── index.ts                   # Update exports
├── organisms/
│   ├── CoaspocketCarousel.tsx     # NEW: Carousel with pocket cards + create
│   └── index.ts                   # Update exports
├── types/
│   └── coaspocket.ts              # NEW: Coaspocket-related types
└── mocks/
    └── coaspocket.ts              # NEW: Mock data for Coaspocket
```

---

## Page Layout Structure

### Coaspocket Page (`/productos/coaspocket`)

```tsx
// app/(authenticated)/productos/coaspocket/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Breadcrumbs, InfoBox } from '@/src/molecules';
import {
  CoaspocketCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from '@/src/organisms';
import { useWelcomeBar } from '@/src/contexts';
import { CoaspocketProduct } from '@/src/types';
import { mockCoaspocketProducts, mockCoaspocketTransactions, mockCoaspocketAvailableMonths } from '@/src/mocks';
import { maskNumber } from '@/src/utils';

export default function CoaspocketPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [selectedProduct, setSelectedProduct] = useState<CoaspocketProduct>(mockCoaspocketProducts[0]);
  const [transactions] = useState(mockCoaspocketTransactions);
  const [selectedMonth, setSelectedMonth] = useState(mockCoaspocketAvailableMonths[0]?.value);

  useEffect(() => {
    setWelcomeBar({
      title: 'Coaspocket',
      backHref: '/home',
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Dynamic title based on selected product
  const transactionTitle = useMemo(() => {
    const maskedNumber = maskNumber(selectedProduct.pocketNumber);
    return `Consulta de Movimientos - ${selectedProduct.title} (${maskedNumber})`;
  }, [selectedProduct]);

  const handleCreatePocket = () => {
    // TODO: Navigate to pocket creation flow or open modal
    console.log('Create new pocket');
  };

  // ... handlers

  return (
    <div className="space-y-6">
      <Breadcrumbs items={['Inicio', 'Productos', 'Coaspocket']} />

      {/* Section 1: Product Carousel with Create Pocket */}
      <CoaspocketCarousel
        title="Mis Bolsillos Coas"
        products={mockCoaspocketProducts}
        selectedProductId={selectedProduct.id}
        onProductSelect={handleProductSelect}
        onCreatePocket={handleCreatePocket}
      />

      {/* Section 2: Transaction History with Info Box */}
      <TransactionHistoryCard
        title={transactionTitle}
        subtitle="Últimos movimientos registrados."
        transactions={transactions}
        onFilter={handleFilter}
      />

      {/* Info Box - Below transaction history */}
      <InfoBox
        label="Sugerencia:"
        message="Para agregar o retirar dinero de tus bolsillos, ve a la sección de Transferencias Internas y selecciona 'Entre mis cuentas'."
      />

      {/* Section 3: Download Reports */}
      <DownloadReportsCard
        availableMonths={mockCoaspocketAvailableMonths}
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

### Coaspocket Products

```typescript
// src/mocks/coaspocket.ts
import { CoaspocketProduct } from '@/src/types/coaspocket';

export const mockCoaspocketProducts: CoaspocketProduct[] = [
  {
    id: '1',
    title: 'Vacaciones',
    pocketNumber: '1234',
    balance: 1500000,
    status: 'activo',
  },
  {
    id: '2',
    title: 'Imprevistos',
    pocketNumber: '5678',
    balance: 500000,
    status: 'activo',
  },
  {
    id: '3',
    title: 'Arreglos para la Casa',
    pocketNumber: '4567',
    balance: 2000000,
    status: 'activo',
  },
];
```

---

## TypeScript Types

### File: `src/types/coaspocket.ts`

```typescript
/**
 * Status of a Coaspocket product (pocket/bolsillo)
 */
export type CoaspocketStatus = 'activo' | 'inactivo';

/**
 * Coaspocket product information for carousel display
 */
export interface CoaspocketProduct {
  id: string;
  title: string;
  pocketNumber: string;
  balance: number;
  status: CoaspocketStatus;
}

/**
 * Callback type for coaspocket product selection
 */
export type OnCoaspocketSelect = (product: CoaspocketProduct) => void;
```

---

## Comparison with Other Product Pages

| Aspect | Ahorros (04) | Obligaciones (05) | Inversiones (06) | Proteccion (07) | Coaspocket (08) |
|--------|--------------|-------------------|------------------|-----------------|-----------------|
| Card Component | SavingsProductCard | ObligacionProductCard | InversionProductCard | ProteccionProductCard | CoaspocketProductCard |
| Product Type | Savings | Loans | CDATs | Insurance | Digital Pockets |
| Balance Label | "Saldo Total" | "Saldo a la fecha" | "Monto del CDAT" | "Valor protegido" | "Saldo" |
| Balance Color | Navy #112E7F | Navy #112E7F | Blue #004680 | Blue #004680 | Blue #004680 |
| Status Values | activo/bloqueado | al_dia/en_mora | activo/vencido | vigente/vencida | activo/inactivo |
| Has Divider | No | Yes | Yes | Yes | No |
| Extra Detail Fields | None | 3 (loan details) | 4 (investment details) | 3 (policy details) | None |
| **Special Feature** | - | - | - | - | Create Pocket Card |
| **Info Box** | No | No | No | No | Yes (suggestion) |

---

## Unique Coaspocket Elements

### 1. Create Pocket Action Card
- Positioned as last item in carousel
- Dashed border style differentiates from product cards
- Plus icon indicates action
- Clicking triggers pocket creation flow (TBD)

### 2. Suggestion Info Box
- Blue-themed informational message
- Positioned after transaction history section
- Guides users to internal transfers feature
- Reusable component for other pages

---

## Implementation Considerations

### Create Pocket Card Position
The "Crear Nuevo Bolsillo" card should be:
- The last item in the carousel
- Always visible (not filtered out)
- Same height as pocket cards for visual alignment
- Not selectable (different from pocket cards)

### Info Box Placement Options
Two possible implementations:
1. **Inside TransactionHistoryCard**: Add prop to TransactionHistoryCard for infoBox content
2. **Separate component below**: Keep InfoBox as separate component after TransactionHistoryCard

Recommendation: Option 2 (separate component) for better reusability and separation of concerns.

### Pocket Creation Flow
The `onCreatePocket` handler should:
- Navigate to a pocket creation page, OR
- Open a modal for quick pocket creation

Details TBD - for now, implement as console.log placeholder.

---

## Sidebar Navigation

Coaspocket should already be in the Products accordion in the sidebar:

```typescript
const productSubItems = [
  { label: 'Aportes', href: '/productos/aportes' },
  { label: 'Ahorros', href: '/productos/ahorros' },
  { label: 'Obligaciones', href: '/productos/obligaciones' },
  { label: 'Inversiones', href: '/productos/inversiones' },
  { label: 'Protección', href: '/productos/proteccion' },
  { label: 'Coaspocket', href: '/productos/coaspocket' },  // Already exists
];
```

---

## Implementation Priority

### Phase 1: Types
1. Create `src/types/coaspocket.ts`
2. Update `src/types/index.ts`

### Phase 2: New Atoms/Molecules
1. Create `InfoBox` atom/molecule
2. Create `CoaspocketProductCard` molecule
3. Create `CreatePocketCard` molecule

### Phase 3: Carousel Organism
1. Create `CoaspocketCarousel` organism (includes CreatePocketCard)

### Phase 4: Mock Data
1. Create `src/mocks/coaspocket.ts`
2. Update `src/mocks/index.ts`

### Phase 5: Coaspocket Page
1. Create `app/(authenticated)/productos/coaspocket/page.tsx`
2. Wire up with mock data and existing components
3. Add InfoBox below TransactionHistoryCard

### Phase 6: Polish
1. Test responsive behavior
2. Test hide balances integration
3. Verify accessibility

---

## Related Features

- **Feature 03-products**: Provides `TransactionHistoryCard`, `DownloadReportsCard`
- **Feature 04-ahorros**: Provides `CarouselArrow`, `CarouselDots`, carousel utilities, similar card design
- **Feature 07-proteccion**: Reference for recent carousel implementation

---

## Notes

- All text in Spanish (Colombia locale)
- Currency formatting: Colombian Peso with thousand separators (e.g., `$ 1.500.000`)
- Pocket numbers use simple masking: `***XXXX` format
- Create pocket functionality is TBD - implement placeholder for now
- Info box is a new reusable component that may be used on other pages
- Coaspocket cards are simpler than Obligaciones/Inversiones (no divider, no extra detail fields)

---

**Last Reviewed**: 2025-12-23
**Status**: Ready for Implementation
