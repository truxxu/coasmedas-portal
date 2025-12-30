# Feature 09 - Pagos (Payments) - Visual References

**Feature**: Pagos (Payments)
**Figma Design**: [Pagar mis productos](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=618-2)
**Status**: In Development
**Focus**: Frontend Only

---

## Overview

The Pagos (Payments) feature provides users with a centralized hub to make payments for their various Coasmedas products and services. The feature is organized into three main categories accessible through an expandable accordion menu in the sidebar:

1. **Pagar mis productos** - Pay my products (STARTING POINT)
2. **Pago a otros asociado** - Payment to another member
3. **Pagar servicios públicos** - Pay public services

This document focuses on the **Pagar mis productos** page, which serves as the entry point for product payments.

---

## Page Structure

### Route
- **Path**: `/pagos/pagar-mis-productos`
- **Route Group**: `app/(authenticated)/pagos/pagar-mis-productos/page.tsx`
- **Layout**: Uses authenticated layout with Sidebar and TopBar

### Page Sections

1. **Header Section**
   - Back button (arrow left)
   - Page title: "Pagar mis productos"
   - Breadcrumbs navigation
   - Hide Balances toggle (top right)

2. **Content Section**
   - Section heading and description
   - 2x2 grid of payment option cards

3. **Footer Section**
   - Session information footer

---

## Visual Design Specifications

### Page Header

#### Back Button
- **Component**: `BackButton` (existing atom)
- **Position**: Top left of content area
- **Icon**: Left-pointing arrow
- **Color**: `#111827` (Text Black)

#### Page Title
- **Text**: "Pagar mis productos"
- **Font**: Ubuntu Medium
- **Size**: `20px` / `1.25rem`
- **Color**: `#111827` (Text Black)
- **Position**: Next to back button

#### Breadcrumbs
- **Component**: `Breadcrumbs` (existing molecule)
- **Pattern**: Inicio / Pagos / Pagar mis productos
- **Font**: Ubuntu Regular
- **Size**: `15px` / `0.9375rem`
- **Colors**:
  - Non-active: `#111827` (Text Black)
  - Active (last item): `#111827` (Text Black), Ubuntu Medium
- **Separator**: Forward slash `/`

#### Hide Balances Toggle
- **Component**: `HideBalancesToggle` (existing molecule)
- **Position**: Top right corner
- **Label**: "Ocultar saldos"
- **Font**: Ubuntu Medium, `14px`
- **Color**: `#374151` (Gray High)

---

### Main Content Section

#### Section Heading
- **Title**: "Pago mis productos"
- **Font**: Ubuntu Bold
- **Size**: `21px` / `1.3125rem`
- **Color**: `#1D4E8F` (Primary Navy)
- **Margin Bottom**: `12px` / `0.75rem`

#### Section Description
- **Text**: "¿Qué producto deseas pagar hoy?"
- **Font**: Ubuntu Regular
- **Size**: `15px` / `0.9375rem`
- **Color**: `#111827` (Text Black)
- **Margin Bottom**: `32px` / `2rem`

---

### Payment Option Cards

#### Grid Layout
- **Structure**: 2x2 grid (2 columns, 2 rows)
- **Gap**: `24px` / `1.5rem` (between cards)
- **Responsive**: Stack vertically on mobile (1 column)

---

#### Card 1: Pago Unificado (Featured Card)

**Position**: Top left (grid position 1)
**Type**: Featured/Primary card

**Visual Design**:
- **Background**: `#1D4E8F` (Primary Navy) - solid color
- **Border**: None
- **Border Radius**: `16px` / `1rem` (rounded-2xl)
- **Padding**: `24px` / `1.5rem`
- **Shadow**: `0 2px 8px rgba(0,0,0,0.08)`
- **Cursor**: `pointer`

**Content**:
- **Title**: "Pago Unificado"
  - Font: Ubuntu Medium
  - Size: `20px` / `1.25rem`
  - Color: `#007FFF` (Blue) or lighter blue shade
  - Margin Bottom: `12px`

- **Description**: "Paga todos tus productos pendientes en una sola transacción y mantente al día fácilmente."
  - Font: Ubuntu Regular
  - Size: `15px` / `0.9375rem`
  - Color: `#FFFFFF` (White)
  - Line Height: `1.5`
  - Max Lines: 3

**Hover State**:
- Slight shadow increase
- Subtle scale transform: `scale(1.02)`
- Transition: `all 300ms ease`

**Active State**:
- Darker background shade
- Shadow decrease

---

#### Card 2: Aportes

**Position**: Top right (grid position 2)
**Type**: Standard card

**Visual Design**:
- **Background**: `#FFFFFF` (White)
- **Border**: `1px solid #E4E6EA`
- **Border Radius**: `16px` / `1rem` (rounded-2xl)
- **Padding**: `24px` / `1.5rem`
- **Shadow**: `0 2px 8px rgba(0,0,0,0.08)`
- **Cursor**: `pointer`

**Content**:
- **Title**: "Aportes"
  - Font: Ubuntu Medium
  - Size: `20px` / `1.25rem`
  - Color: `#1D4E8F` (Primary Navy)
  - Margin Bottom: `12px`

- **Description**: "Paga tus aportes sociales y solidaridad."
  - Font: Ubuntu Regular
  - Size: `15px` / `0.9375rem`
  - Color: `#111827` (Text Black)
  - Line Height: `1.5`

**Hover State**:
- Border color: `#1D4E8F`
- Background: `#F0F9FF` (Light Blue)
- Slight shadow increase
- Transition: `all 300ms ease`

**Active State**:
- Border color: `#007FFF`
- Background: `#E3F2FD`

---

#### Card 3: Obligaciones

**Position**: Bottom left (grid position 3)
**Type**: Standard card

**Visual Design**:
- **Background**: `#FFFFFF` (White)
- **Border**: `1px solid #E4E6EA`
- **Border Radius**: `16px` / `1rem` (rounded-2xl)
- **Padding**: `24px` / `1.5rem`
- **Shadow**: `0 2px 8px rgba(0,0,0,0.08)`
- **Cursor**: `pointer`

**Content**:
- **Title**: "Obligaciones"
  - Font: Ubuntu Medium
  - Size: `20px` / `1.25rem`
  - Color: `#1D4E8F` (Primary Navy)
  - Margin Bottom: `12px`

- **Description**: "Paga tus créditos, tarjetas y otros compromisos."
  - Font: Ubuntu Regular
  - Size: `15px` / `0.9375rem`
  - Color: `#111827` (Text Black)
  - Line Height: `1.5`

**Hover State**:
- Border color: `#1D4E8F`
- Background: `#F0F9FF` (Light Blue)
- Slight shadow increase
- Transition: `all 300ms ease`

**Active State**:
- Border color: `#007FFF`
- Background: `#E3F2FD`

---

#### Card 4: Protección

**Position**: Bottom right (grid position 4)
**Type**: Standard card

**Visual Design**:
- **Background**: `#FFFFFF` (White)
- **Border**: `1px solid #E4E6EA`
- **Border Radius**: `16px` / `1rem` (rounded-2xl)
- **Padding**: `24px` / `1.5rem`
- **Shadow**: `0 2px 8px rgba(0,0,0,0.08)`
- **Cursor**: `pointer`

**Content**:
- **Title**: "Protección"
  - Font: Ubuntu Medium
  - Size: `20px` / `1.25rem`
  - Color: `#1D4E8F` (Primary Navy)
  - Margin Bottom: `12px`

- **Description**: "Paga tus seguros y pólizas para estar siempre cubierto."
  - Font: Ubuntu Regular
  - Size: `15px` / `0.9375rem`
  - Color: `#111827` (Text Black)
  - Line Height: `1.5`

**Hover State**:
- Border color: `#1D4E8F`
- Background: `#F0F9FF` (Light Blue)
- Slight shadow increase
- Transition: `all 300ms ease`

**Active State**:
- Border color: `#007FFF`
- Background: `#E3F2FD`

---

## Sidebar Navigation

### Pagos Menu Item

The "Pagos" menu item in the sidebar should be **expandable** (accordion style) with three sub-items:

#### Parent Item
- **Text**: "Pagos"
- **Icon**: Payment/wallet icon (to be defined)
- **State**: Expandable (has chevron down/up icon)
- **Font**: Ubuntu Bold, `15px`
- **Color**: `#FFFFFF` (White)

#### Sub-Items (when expanded)
1. **Pagar mis productos**
   - **Active**: Yes (current page)
   - **Background**: `#007FFF` (Blue) or lighter highlight
   - **Font**: Ubuntu Medium, `14px`
   - **Color**: `#FFFFFF` (White)

2. **Pago a otros asociado**
   - **Active**: No
   - **Font**: Ubuntu Regular, `14px`
   - **Color**: `#FFFFFF` (White)
   - **Hover**: `rgba(255,255,255,0.1)` background

3. **Pagar servicios públicos**
   - **Active**: No
   - **Font**: Ubuntu Regular, `14px`
   - **Color**: `#FFFFFF` (White)
   - **Hover**: `rgba(255,255,255,0.1)` background

---

## Component Architecture

### New Components Required

#### Molecules
- **`PaymentOptionCard`** - Reusable payment option card with two variants:
  - `featured`: Navy background (Pago Unificado)
  - `standard`: White background with border (Aportes, Obligaciones, Protección)

#### Organisms
- **`PaymentOptionsGrid`** - Grid container for payment option cards

### Existing Components to Use
- `BackButton` (atom)
- `Breadcrumbs` (molecule)
- `HideBalancesToggle` (molecule)
- `SidebarNavItem` (molecule) - with expandable/accordion functionality
- `SidebarSubItem` (molecule) - for sub-navigation items
- `Sidebar` (organism) - update to include Pagos accordion
- `TopBar` (organism)
- `SessionFooter` (organism)

---

## Responsive Design

### Desktop (≥1024px)
- 2x2 grid layout for payment cards
- Full sidebar visible
- Standard spacing and padding

### Tablet (640px - 1023px)
- 2x2 grid layout (may be tighter spacing)
- Collapsible sidebar
- Adjusted card sizes

### Mobile (<640px)
- Single column layout (cards stack vertically)
- Mobile sidebar (drawer/overlay)
- Full-width cards
- Reduced padding

---

## Interaction Patterns

### Payment Option Cards

#### Click Behavior
- Each card is clickable and navigates to its respective payment flow
- Click target: Entire card surface
- Visual feedback: Active state on click

#### Navigation Routes (to be defined later)
- **Pago Unificado**: TBD
- **Aportes**: TBD
- **Obligaciones**: TBD
- **Protección**: TBD

### Sidebar Accordion

#### Behavior
- Click "Pagos" to expand/collapse sub-items
- Chevron icon rotates 180° on toggle
- Smooth expand/collapse animation (300ms)
- Only one section expanded at a time (optional)

---

## Accessibility

### Keyboard Navigation
- All payment cards must be keyboard accessible (Tab navigation)
- Focus states clearly visible (2px blue outline)
- Enter/Space to activate card

### ARIA Labels
- Cards: `aria-label="Pagar [product-name]"`
- Accordion: `aria-expanded="true/false"`
- Current page: `aria-current="page"` on breadcrumb and sidebar item

### Screen Reader Support
- Descriptive labels for all interactive elements
- Breadcrumb navigation properly announced
- Card descriptions read on focus

---

## Color Palette Reference

### Primary Colors
- **Primary Navy**: `#1D4E8F` - Featured card background, titles
- **Primary Blue**: `#007FFF` - Active states, featured card title
- **Light Blue**: `#F0F9FF` - Main content background, hover states

### Grays & Neutrals
- **Text Black**: `#111827` - Primary text
- **Gray High**: `#374151` - Secondary text
- **Border Gray**: `#E4E6EA` - Card borders
- **White**: `#FFFFFF` - Card backgrounds, sidebar text

---

## Typography Reference

### Fonts Used
- **Ubuntu Bold**: Section headings, sidebar items
- **Ubuntu Medium**: Card titles, page title, labels
- **Ubuntu Regular**: Descriptions, breadcrumbs, body text

### Font Sizes
- `21px` - Section heading
- `20px` - Page title, card titles
- `15px` - Descriptions, breadcrumbs
- `14px` - Hide balances label, sidebar sub-items

---

## Spacing & Layout

### Content Container
- **Max Width**: `1200px` (or as per design system)
- **Padding**: `24px` / `1.5rem` (horizontal and vertical)
- **Background**: `#F0F9FF` (Light Blue)

### Card Grid
- **Columns**: 2 (desktop), 1 (mobile)
- **Gap**: `24px` / `1.5rem`
- **Card Min Height**: `180px` (approximately)

### Section Spacing
- Header to Content: `24px`
- Heading to Description: `12px`
- Description to Cards: `32px`

---

## Animation & Transitions

### Card Hover
- **Duration**: `300ms`
- **Easing**: `ease`
- **Properties**: `background-color`, `border-color`, `box-shadow`, `transform`

### Sidebar Accordion
- **Duration**: `300ms`
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Properties**: `height`, `transform` (chevron rotation)

---

## Future Considerations

### Payment Flows (to be defined)
- Pago Unificado flow
- Aportes payment flow
- Obligaciones payment flow
- Protección payment flow

### Additional Pagos Pages
- Pago a otros asociado
- Pagar servicios públicos

### Enhanced Features
- Recent payments section
- Scheduled payments
- Payment history integration
- Quick access to frequently paid products

---

## Notes

- This page uses **common authenticated template elements** (Sidebar, TopBar, SessionFooter, Breadcrumbs, HideBalancesToggle)
- Payment option cards are **navigation cards** - they don't perform payments directly, but navigate to payment flows
- The **Pago Unificado** card is visually distinct (featured design) to highlight it as the primary/recommended option
- Card interactions should provide clear visual feedback (hover, active states)
- Ensure all interactive elements are keyboard accessible and screen reader friendly
- Payment flows will be defined in separate specification documents

---

**Last Updated**: 2025-12-30
**Designer**: Figma UI Kit
**Figma Node**: 618:2
**Status**: Ready for Implementation
