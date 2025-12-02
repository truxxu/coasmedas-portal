# Step-by-Step Implementation Plan: Prehome Feature

**Feature**: 00-prehome (Landing Page)
**Total Estimated Time**: 3-4 days
**Created**: 2025-11-26
**Updated**: 2025-12-01 (Based on Figma MCP review)

---

## Design Analysis Summary

Based on Figma design review (`node-id=1668-229`), the prehome page consists of:

### Page Sections (Top to Bottom)
1. **Header** - Logo + "Vinculación Digital" + "Iniciar Sesión" buttons
2. **Hero Section** - Navy blue background with main headline and 3 CTAs
3. **Welcome Section** - "Hola, Bienvenido" + "Siempre cercanos" text
4. **Services Grid** - 4 service cards (Ahorros, Créditos, Inversiones, Pagos y Transferencias)
5. **News Section** - "Mantente Informado" with 3 news cards
6. **Info Section** - "Mantén tus datos actualizados" + "Recomendaciones de Seguridad"
7. **App Section** - "Lleva tu APP" with app store buttons and phone mockup
8. **Footer** - Links: "Atención al Usuario", "Descargar Instructivo", "Preguntas Frecuentes"

### Design Tokens
- **Primary Blue**: `#007FFF`
- **Navy Blue**: `#1D4E8F`
- **Text Black**: `#111827`
- **Gray High**: `#58585B`
- **Gray Low/Border**: `#E4E6EA`
- **Background Light Blue**: `#F0F9FF`
- **White**: `#FFFFFF`
- **Font**: Ubuntu (Bold, Medium, Regular)

### Key UI Elements
- Rounded buttons with shadows: `rounded-[6px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)]`
- Service cards with gray borders
- News cards with blue gradient headers
- Wave/curved section dividers

---

## Prerequisites

### Before You Start
- [x] Review Figma design via MCP
- [ ] Have design assets ready in `.claude/knowledge/features/00-prehome/attachments/designs/`
- [ ] Confirm development environment is running (`yarn dev`)
- [ ] Read [spec.md](./spec.md) for full feature requirements
- [ ] Read [references.md](./references.md) for design guidance

### Current State
- ✅ Next.js 16 project initialized
- ✅ Tailwind CSS v4 configured
- ✅ TypeScript configured
- ✅ Atomic Design directories created
- ✅ Logo asset available
- ✅ Basic components created (Button, Logo, Link, NavBar)
- ⏳ Need to update components to match new design

---

## Phase 1: Update Design Tokens & Theme (1 hour)

### Step 1.1: Update globals.css with Full Color Palette

**File**: `app/globals.css`

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;

  /* Coasmedas brand colors */
  --brand-primary: #007FFF;
  --brand-navy: #1D4E8F;
  --brand-border: #E4E6EA;
  --brand-text-black: #111827;
  --brand-gray-high: #58585B;
  --brand-light-blue: #F0F9FF;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-primary: var(--brand-primary);
  --color-brand-navy: var(--brand-navy);
  --color-brand-border: var(--brand-border);
  --color-brand-text-black: var(--brand-text-black);
  --color-brand-gray-high: var(--brand-gray-high);
  --color-brand-light-blue: var(--brand-light-blue);
  --font-sans: 'Ubuntu', var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### Step 1.2: Add Ubuntu Font

**File**: `app/layout.tsx`

Add Ubuntu font import from Google Fonts or local files.

---

## Phase 2: Atoms - Enhanced Components (2-3 hours)

### Step 2.1: Update Button Component

**File**: `src/atoms/Button.tsx`

Add new variants and sizes to match design:
- `cta` variant - Blue gradient with shadow for main CTAs
- `outline` variant - White background with border
- Update text to use Ubuntu Bold font

### Step 2.2: Create Card Component

**File**: `src/atoms/Card.tsx`

```typescript
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'news';
  className?: string;
}
```

### Step 2.3: Create SectionTitle Component

**File**: `src/atoms/SectionTitle.tsx`

For consistent section headings with navy blue color.

### Step 2.4: Create Icon Component (Optional)

**File**: `src/atoms/Icon.tsx`

If using custom icons for service cards.

---

## Phase 3: Molecules - Page Sections (4-5 hours)

### Step 3.1: Update NavBar

**File**: `src/molecules/NavBar.tsx`

- Logo on left
- "Vinculación Digital" button (secondary/outline)
- "Iniciar Sesión" button (primary)
- Proper spacing and shadow

### Step 3.2: Create HeroBanner

**File**: `src/molecules/HeroBanner.tsx`

Navy blue background with:
- Main headline: "Tus metas, nuestro compromiso."
- Subheadline: "La plataforma digital para gestionar tus finanzas..."
- Three CTAs: "Abre tu CDT Digital", "Solicita tu Crédito", "Conoce nuestros productos"
- Decorative elements/CTAs for "Abre tu CDAT Digital" and "Solicita tu Crédito Digital"

### Step 3.3: Create WelcomeSection

**File**: `src/molecules/WelcomeSection.tsx`

- "Hola, Bienvenido a tu portal transaccional" (navy)
- "Siempre cercanos" (blue)
- Wave/curved background transition

### Step 3.4: Create ServiceCard

**File**: `src/molecules/ServiceCard.tsx`

```typescript
interface ServiceCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
}
```

Service cards with:
- Checkbox icon in top-left corner
- Title in bold
- Description in gray
- Border styling

### Step 3.5: Create NewsCard

**File**: `src/molecules/NewsCard.tsx`

```typescript
interface NewsCardProps {
  title: string;
  headline: string;
  description: string;
  link: string;
}
```

News cards with:
- Blue gradient header with "Noticia 1" etc.
- White body with title, description
- "Leer más" link

### Step 3.6: Create InfoCard

**File**: `src/molecules/InfoCard.tsx`

For "Mantén tus datos actualizados" and "Recomendaciones de Seguridad" sections.

### Step 3.7: Create AppPromoSection

**File**: `src/molecules/AppPromoSection.tsx`

Navy background with:
- "Lleva tu APP morem ipsum" headline
- Description text
- App Store and Google Play buttons
- Phone mockup image

### Step 3.8: Update Footer

**File**: `src/molecules/Footer.tsx`

Simple footer with:
- "Atención al Usuario"
- "Descargar Instructivo"
- "Preguntas Frecuentes"

---

## Phase 4: Organisms - Page Assembly (2-3 hours)

### Step 4.1: Update PrehomeHeader

**File**: `src/organisms/PrehomeHeader.tsx`

White background, border-bottom, contains updated NavBar.

### Step 4.2: Create PrehomeHero

**File**: `src/organisms/PrehomeHero.tsx`

Combines HeroBanner with proper styling and wave transitions.

### Step 4.3: Create PrehomeWelcome

**File**: `src/organisms/PrehomeWelcome.tsx`

Welcome section with wave background.

### Step 4.4: Create PrehomeServices

**File**: `src/organisms/PrehomeServices.tsx`

Grid of 4 ServiceCards:
1. Ahorros - "Planea tu futuro con nuestras opciones de ahorro flexibles y rentables."
2. Créditos - "Impulso tus proyectos con créditos a tu medida y tasas preferenciales."
3. Inversiones - "Haz crecer tu dinero con portafolios de inversión segura y diversificados."
4. Pagos y Transferencias - "Realiza tus pagos y transferencias de forma rápida y segura."

### Step 4.5: Create PrehomeNews

**File**: `src/organisms/PrehomeNews.tsx`

"Mantente Informado" section with 3 NewsCards.

### Step 4.6: Create PrehomeInfo

**File**: `src/organisms/PrehomeInfo.tsx`

Two-column layout:
- Left: "Mantén tus datos actualizados" with CTA
- Right: "Recomendaciones de Seguridad" list

### Step 4.7: Create PrehomeApp

**File**: `src/organisms/PrehomeApp.tsx`

Navy section with app promotion and phone mockup.

### Step 4.8: Update PrehomeFooter

**File**: `src/organisms/PrehomeFooter.tsx`

Navy background with centered links.

---

## Phase 5: Page Assembly (1 hour)

### Step 5.1: Update Root Page

**File**: `app/page.tsx`

```typescript
import {
  PrehomeHeader,
  PrehomeHero,
  PrehomeWelcome,
  PrehomeServices,
  PrehomeNews,
  PrehomeInfo,
  PrehomeApp,
  PrehomeFooter,
} from '@/src/organisms';

export default function PrehomePage() {
  return (
    <main className="min-h-screen bg-white">
      <PrehomeHeader />
      <PrehomeHero />
      <PrehomeWelcome />
      <PrehomeServices />
      <PrehomeNews />
      <PrehomeInfo />
      <PrehomeApp />
      <PrehomeFooter />
    </main>
  );
}
```

---

## Phase 6: Assets & Images (1-2 hours)

### Step 6.1: Download/Export Figma Assets

Using Figma MCP or manual export:
- Wave/curve SVG backgrounds
- App Store / Google Play badges
- Phone mockup image
- Service icons (if custom)
- News card header images

### Step 6.2: Organize Assets

```
public/
├── logo.svg
├── images/
│   ├── hero-wave.svg
│   ├── phone-mockup.png
│   ├── app-store.svg
│   └── google-play.svg
```

---

## Phase 7: Content Integration (1-2 hours)

### Step 7.1: Spanish Content

Replace all placeholder text with actual content from Figma:

**Hero:**
- "Tus metas, nuestro compromiso."
- "La plataforma digital para gestionar tus finanzas y alcanzar tus sueños con seguridad y confianza."

**Welcome:**
- "Hola, Bienvenido a tu portal transaccional"
- "Siempre cercanos"

**Services:**
- Ahorros, Créditos, Inversiones, Pagos y Transferencias

**News:**
- "Mantente Informado"
- News card content

**Info:**
- "Mantén tus datos actualizados"
- "Recomendaciones de Seguridad"

**App:**
- "Lleva tu APP morem ipsum"

**Footer:**
- "Atención al Usuario", "Descargar Instructivo", "Preguntas Frecuentes"

---

## Phase 8: Responsive Design (2-3 hours)

### Step 8.1: Mobile Layout (375px)

- Stack header buttons
- Full-width hero
- Stack service cards (1 column)
- Stack news cards (1 column)
- Stack info sections
- Adjust app section layout

### Step 8.2: Tablet Layout (768px)

- 2-column service grid
- 2-column news grid
- Side-by-side info sections

### Step 8.3: Desktop Layout (1280px)

- Full 4-column service grid
- 3-column news grid
- Original design layout

---

## Phase 9: Polish & Testing (2-3 hours)

### Step 9.1: Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast

### Step 9.2: Performance

- Image optimization
- Lazy loading
- Lighthouse audit

### Step 9.3: Browser Testing

- Chrome, Firefox, Safari, Edge
- iOS Safari, Android Chrome

---

## Updated Time Tracking

| Phase | Estimated | Notes |
|-------|-----------|-------|
| Phase 1: Design Tokens | 1 hr | |
| Phase 2: Atoms | 2-3 hrs | |
| Phase 3: Molecules | 4-5 hrs | |
| Phase 4: Organisms | 2-3 hrs | |
| Phase 5: Page Assembly | 1 hr | |
| Phase 6: Assets | 1-2 hrs | |
| Phase 7: Content | 1-2 hrs | |
| Phase 8: Responsive | 2-3 hrs | |
| Phase 9: Polish | 2-3 hrs | |
| **Total** | **~20-25 hrs (3-4 days)** | |

---

## Component Checklist

### Atoms
- [ ] Button (updated with cta, outline variants)
- [ ] Logo (existing)
- [ ] Link (existing)
- [ ] Card
- [ ] SectionTitle

### Molecules
- [ ] NavBar (updated)
- [ ] HeroBanner
- [ ] WelcomeSection
- [ ] ServiceCard
- [ ] NewsCard
- [ ] InfoCard
- [ ] AppPromoSection
- [ ] Footer (updated)

### Organisms
- [ ] PrehomeHeader (updated)
- [ ] PrehomeHero
- [ ] PrehomeWelcome
- [ ] PrehomeServices
- [ ] PrehomeNews
- [ ] PrehomeInfo
- [ ] PrehomeApp
- [ ] PrehomeFooter (updated)

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design Resources**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1668-229)
- **Coding Standards**: `.claude/coding-standards.md`
- **Workflows**: `.claude/workflows.md`

---

**Key Changes from Original Plan:**
1. More sections identified (8 vs 4 originally)
2. More complex component hierarchy
3. Additional design tokens needed
4. Ubuntu font requirement
5. Wave/curved backgrounds
6. News cards with gradient headers
7. App promotion section
8. Estimated time increased to 3-4 days
