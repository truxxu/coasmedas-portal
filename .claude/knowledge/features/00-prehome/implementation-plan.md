# Step-by-Step Implementation Plan: Prehome Feature

**Feature**: 00-prehome (Landing Page)
**Total Estimated Time**: 2 days
**Created**: 2025-11-26

---

## Prerequisites

### Before You Start
- [ ] Review Figma design: [Prehome Design](https://www.figma.com/design/VbXLRi0Ezy4HRRgzEPzcjo/Portal-transaccional_1?node-id=1409-340&t=wV8QeKEjFQ9tqGtr-4)
- [ ] Have design assets ready in `.claude/knowledge/features/00-prehome/attachments/designs/`
- [ ] Confirm development environment is running (`yarn dev`)
- [ ] Read [spec.md](./spec.md) for full feature requirements
- [ ] Read [references.md](./references.md) for design guidance

### Current State
- ✅ Next.js 16 project initialized
- ✅ Tailwind CSS v4 configured
- ✅ TypeScript configured
- ✅ Atomic Design directories created (empty)
- ✅ Logo asset available
- ⏳ Need to implement components

---

## Phase 1: Preparation & Assets (30 minutes)

### Step 1.1: Copy Design Assets
```bash
# Copy logo to public directory for Next.js optimization
cp .claude/knowledge/features/00-prehome/attachments/designs/logo.svg public/logo.svg

# Verify the file was copied
ls -lh public/logo.svg
```

**Expected Result**: `public/logo.svg` exists and is accessible

### Step 1.2: Review Design in Figma
- [ ] Open Figma design link
- [ ] Note color values (if not using default theme)
- [ ] Identify required sections (header, hero, features, footer)
- [ ] Screenshot or export any additional images needed
- [ ] Document content copy (headlines, descriptions)

### Step 1.3: Create Content Document (Optional)
Create a temporary file with Spanish content from design:
```bash
# Create temporary content file
touch .claude/knowledge/features/00-prehome/content.txt
```

Add content like:
```
HEADLINE: [Copy from Figma]
SUBHEADLINE: [Copy from Figma]
CTA PRIMARY: Ingresar
CTA SECONDARY: Registrarse
FEATURES: [List from Figma]
```

---

## Phase 2: Atoms - Basic Building Blocks (2-3 hours)

### Step 2.1: Create Button Component

**File**: `src/atoms/Button.tsx`

```bash
# Open editor
# Create src/atoms/Button.tsx
```

**Implementation**:
```typescript
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary: 'bg-foreground text-background hover:opacity-90',
    secondary: 'bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background',
    ghost: 'text-foreground hover:bg-foreground/10',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm rounded-md',
    md: 'h-11 px-6 text-base rounded-lg',
    lg: 'h-14 px-8 text-lg rounded-xl',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
```

**Test**:
- [ ] Component exports correctly
- [ ] TypeScript has no errors
- [ ] Accepts variant and size props

### Step 2.2: Create Logo Component

**File**: `src/atoms/Logo.tsx`

```typescript
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 150, height = 50 }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Coasmedas"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
```

**Test**:
- [ ] Logo renders without errors
- [ ] SVG loads from public/logo.svg
- [ ] Can customize width/height

### Step 2.3: Create Link Component

**File**: `src/atoms/Link.tsx`

```typescript
import NextLink from 'next/link';
import { AnchorHTMLAttributes, ReactNode } from 'react';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export function Link({
  href,
  children,
  className = '',
  external = false,
  ...props
}: LinkProps) {
  const baseStyles = 'text-foreground hover:opacity-70 transition-opacity';
  const classes = `${baseStyles} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} {...props}>
      {children}
    </NextLink>
  );
}
```

### Step 2.4: Update Atoms Index

**File**: `src/atoms/index.ts`

```typescript
export { Button } from './Button';
export { Logo } from './Logo';
export { Link } from './Link';
```

**Test**:
```bash
# Run TypeScript check
yarn tsc --noEmit

# Run ESLint
yarn lint
```

**Expected**: No errors

---

## Phase 3: Molecules - Component Combinations (2-3 hours)

### Step 3.1: Create NavBar Component

**File**: `src/molecules/NavBar.tsx`

```typescript
import { Button } from '@/src/atoms';
import { Logo } from '@/src/atoms';

export function NavBar() {
  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 md:px-8">
      <div className="flex items-center">
        <Logo />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" href="/register" className="hidden sm:inline-flex">
          Registrarse
        </Button>
        <Button variant="primary" href="/login">
          Ingresar
        </Button>
      </div>
    </nav>
  );
}
```

**Test**:
- [ ] Logo displays
- [ ] Buttons are visible
- [ ] Responsive (register button hides on mobile)

### Step 3.2: Create HeroSection Component

**File**: `src/molecules/HeroSection.tsx`

```typescript
import { Button } from '@/src/atoms';

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
        Bienvenido a Coasmedas
      </h1>

      <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
        Tu portal de servicios bancarios. Gestiona tus cuentas, realiza transferencias y más.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="primary" size="lg" href="/login">
          Ingresar
        </Button>
        <Button variant="secondary" size="lg" href="/register">
          Crear Cuenta
        </Button>
      </div>
    </section>
  );
}
```

**Note**: Replace placeholder text with actual copy from Figma design.

**Test**:
- [ ] Headline renders correctly
- [ ] CTAs are visible
- [ ] Responsive layout (stacks on mobile)

### Step 3.3: Create FeatureCard Component

**File**: `src/molecules/FeatureCard.tsx`

```typescript
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border border-foreground/10 hover:border-foreground/30 transition-colors">
      {icon && (
        <div className="mb-4 text-foreground">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-foreground/70">
        {description}
      </p>
    </div>
  );
}
```

**Test**:
- [ ] Card renders with title and description
- [ ] Optional icon displays
- [ ] Hover effect works

### Step 3.4: Create Footer Component

**File**: `src/molecules/Footer.tsx`

```typescript
import { Link } from '@/src/atoms';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-6 py-8 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          © {currentYear} Coasmedas. Todos los derechos reservados.
        </p>

        <div className="flex gap-6">
          <Link href="/privacy" className="text-sm text-foreground/60 hover:text-foreground">
            Privacidad
          </Link>
          <Link href="/terms" className="text-sm text-foreground/60 hover:text-foreground">
            Términos
          </Link>
          <Link href="/contact" className="text-sm text-foreground/60 hover:text-foreground">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

**Test**:
- [ ] Copyright year is current
- [ ] Links render
- [ ] Responsive layout

### Step 3.5: Update Molecules Index

**File**: `src/molecules/index.ts`

```typescript
export { NavBar } from './NavBar';
export { HeroSection } from './HeroSection';
export { FeatureCard } from './FeatureCard';
export { Footer } from './Footer';
```

**Test**:
```bash
yarn tsc --noEmit
yarn lint
```

---

## Phase 4: Organisms - Complex Sections (1-2 hours)

### Step 4.1: Create PrehomeHeader

**File**: `src/organisms/PrehomeHeader.tsx`

```typescript
import { NavBar } from '@/src/molecules';

export function PrehomeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-foreground/10">
      <div className="max-w-7xl mx-auto">
        <NavBar />
      </div>
    </header>
  );
}
```

**Test**:
- [ ] Header is sticky
- [ ] Backdrop blur works
- [ ] Border displays correctly

### Step 4.2: Create PrehomeHero

**File**: `src/organisms/PrehomeHero.tsx`

```typescript
import { HeroSection } from '@/src/molecules';

export function PrehomeHero() {
  return (
    <div className="w-full bg-gradient-to-b from-background to-foreground/5">
      <div className="max-w-7xl mx-auto">
        <HeroSection />
      </div>
    </div>
  );
}
```

**Test**:
- [ ] Gradient background displays
- [ ] Content is centered

### Step 4.3: Create PrehomeFeaturesGrid

**File**: `src/organisms/PrehomeFeaturesGrid.tsx`

```typescript
import { FeatureCard } from '@/src/molecules';

export function PrehomeFeaturesGrid() {
  // TODO: Replace with actual features from Figma design
  const features = [
    {
      title: 'Seguro y Confiable',
      description: 'Tu información está protegida con los más altos estándares de seguridad.',
    },
    {
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva diseñada para facilitar tus transacciones diarias.',
    },
    {
      title: 'Disponible 24/7',
      description: 'Accede a tus servicios bancarios en cualquier momento y lugar.',
    },
  ];

  return (
    <section className="w-full px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          ¿Por qué elegir Coasmedas?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Note**: Update features array with actual content from Figma.

**Test**:
- [ ] Grid displays (3 columns on desktop, 1 on mobile)
- [ ] Cards render correctly
- [ ] Section title displays

### Step 4.4: Create PrehomeFooter

**File**: `src/organisms/PrehomeFooter.tsx`

```typescript
import { Footer } from '@/src/molecules';

export function PrehomeFooter() {
  return (
    <div className="w-full bg-foreground/5">
      <Footer />
    </div>
  );
}
```

**Test**:
- [ ] Footer renders
- [ ] Background color displays

### Step 4.5: Update Organisms Index

**File**: `src/organisms/index.ts`

```typescript
export { PrehomeHeader } from './PrehomeHeader';
export { PrehomeHero } from './PrehomeHero';
export { PrehomeFeaturesGrid } from './PrehomeFeaturesGrid';
export { PrehomeFooter } from './PrehomeFooter';
```

**Test**:
```bash
yarn tsc --noEmit
yarn lint
```

---

## Phase 5: Page Assembly (30 minutes)

### Step 5.1: Update Root Page

**File**: `app/page.tsx`

Replace entire content with:

```typescript
import {
  PrehomeHeader,
  PrehomeHero,
  PrehomeFeaturesGrid,
  PrehomeFooter,
} from '@/src/organisms';

export default function PrehomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PrehomeHeader />
      <PrehomeHero />
      <PrehomeFeaturesGrid />
      <PrehomeFooter />
    </main>
  );
}
```

**Test**:
```bash
# Start dev server if not running
yarn dev

# Visit http://localhost:3000
```

**Expected**:
- [ ] Page loads without errors
- [ ] All sections display
- [ ] No console warnings/errors

---

## Phase 6: Content Refinement (1-2 hours)

### Step 6.1: Update with Actual Content from Figma

For each component, replace placeholder text with actual design content:

1. **HeroSection.tsx**:
   - [ ] Update headline text
   - [ ] Update subheadline text
   - [ ] Verify CTA button text

2. **PrehomeFeaturesGrid.tsx**:
   - [ ] Update section title
   - [ ] Replace features array with actual features
   - [ ] Add icons if specified in design

3. **Footer.tsx**:
   - [ ] Update footer links (if different)
   - [ ] Add any additional footer content

### Step 6.2: Add Missing Design Elements

Check Figma for:
- [ ] Additional images
- [ ] Icons for features
- [ ] Background patterns
- [ ] Brand colors (update if needed)

### Step 6.3: Fine-tune Styling

Match Figma design:
- [ ] Spacing (padding, margins)
- [ ] Font sizes
- [ ] Colors (if custom beyond theme)
- [ ] Border radius
- [ ] Shadows (if any)

---

## Phase 7: Responsive Design (1-2 hours)

### Step 7.1: Test on Different Breakpoints

Test using browser dev tools:

**Mobile (375px)**:
- [ ] Header is compact
- [ ] Hero text is readable
- [ ] Buttons stack vertically
- [ ] Feature cards stack
- [ ] Footer is readable

**Tablet (768px)**:
- [ ] Layout adapts appropriately
- [ ] Navigation is accessible
- [ ] Content is well-spaced

**Desktop (1280px+)**:
- [ ] Max-width containers work
- [ ] Grid layouts display properly
- [ ] No excessive whitespace

### Step 7.2: Fix Responsive Issues

Common issues:
- [ ] Text too large/small on mobile
- [ ] Buttons too wide/narrow
- [ ] Insufficient padding on mobile
- [ ] Grid not responsive

Use Tailwind responsive prefixes:
```tsx
className="text-base md:text-lg lg:text-xl"
className="px-4 md:px-6 lg:px-8"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## Phase 8: Accessibility (1 hour)

### Step 8.1: Semantic HTML Audit

Check:
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] `<nav>` for navigation
- [ ] `<main>` for main content
- [ ] `<section>` for major sections
- [ ] `<footer>` for footer

### Step 8.2: Add ARIA Labels

Where needed:
```tsx
<button aria-label="Cerrar menú">×</button>
<nav aria-label="Navegación principal">...</nav>
```

### Step 8.3: Keyboard Navigation

Test:
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Logical tab order
- [ ] Enter/Space activates buttons

### Step 8.4: Alt Text for Images

```tsx
<Image src="/logo.svg" alt="Coasmedas - Portal Bancario" ... />
```

### Step 8.5: Color Contrast

Check using browser dev tools or online tool:
- [ ] Text on background has sufficient contrast (4.5:1 minimum)
- [ ] Button text readable
- [ ] Link text visible

---

## Phase 9: Dark Mode (30 minutes)

### Step 9.1: Test Dark Mode

Toggle system dark mode and verify:
- [ ] Colors invert correctly (using CSS variables)
- [ ] Logo is visible
- [ ] Text is readable
- [ ] Borders are visible
- [ ] Buttons look correct

### Step 9.2: Fix Dark Mode Issues

If needed, add dark mode specific styles:
```tsx
className="bg-white dark:bg-black"
className="text-black dark:text-white"
```

**Note**: Since we're using `--background` and `--foreground` CSS variables, most components should adapt automatically.

---

## Phase 10: Performance Optimization (1 hour)

### Step 10.1: Run Lighthouse Audit

```bash
# Build production version
yarn build

# Start production server
yarn start
```

Open Chrome DevTools → Lighthouse → Run audit

**Target Scores**:
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 90
- [ ] SEO: > 90

### Step 10.2: Optimize Images

If Lighthouse flags:
- [ ] Use Next.js Image component (already done for logo)
- [ ] Compress images
- [ ] Use appropriate formats (WebP, SVG)

### Step 10.3: Lazy Load Below-Fold Content

For performance:
```tsx
import dynamic from 'next/dynamic';

const PrehomeFeaturesGrid = dynamic(() =>
  import('@/src/organisms').then(mod => ({ default: mod.PrehomeFeaturesGrid }))
);
```

### Step 10.4: Add Metadata

**File**: `app/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coasmedas - Portal Bancario',
  description: 'Portal de servicios bancarios de Coasmedas. Gestiona tus cuentas, realiza transferencias y más.',
};

export default function PrehomePage() {
  // ...
}
```

---

## Phase 11: Testing (1-2 hours)

### Step 11.1: Manual Testing

**Desktop Browsers**:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Mobile Browsers**:
- [ ] iOS Safari
- [ ] Android Chrome

### Step 11.2: Functional Testing

- [ ] All links work (even if pages don't exist yet)
- [ ] Buttons navigate correctly
- [ ] No 404 errors in console
- [ ] No React warnings

### Step 11.3: Build Verification

```bash
# Clean build
rm -rf .next
yarn build

# Check for build errors
# Should complete successfully
```

Expected output: `✓ Compiled successfully`

### Step 11.4: TypeScript Check

```bash
yarn tsc --noEmit
```

Expected: No errors

### Step 11.5: ESLint Check

```bash
yarn lint
```

Expected: No errors or only warnings

---

## Phase 12: Documentation & Cleanup (30 minutes)

### Step 12.1: Update Feature Status

**File**: `.claude/knowledge/features/00-prehome/spec.md`

Update status from "Planning" to "In Progress" or "Complete":
```markdown
**Status**: Complete
```

### Step 12.2: Check Off Acceptance Criteria

In `spec.md`, mark completed items:
```markdown
- [x] Page loads at root URL `/`
- [x] Responsive design (mobile, tablet, desktop)
- [x] Follows Figma design specifications
...
```

### Step 12.3: Document Any Deviations

If you deviated from the design:
- [ ] Document in spec.md under "Implementation Notes"
- [ ] Note reasons for changes
- [ ] Flag for design review if needed

### Step 12.4: Clean Up Temporary Files

```bash
# Remove any temporary content files
rm -f .claude/knowledge/features/00-prehome/content.txt

# Remove any test files
```

### Step 12.5: Commit Changes

```bash
# Stage all changes
git add .

# Review changes
git status

# Commit (will be done by user or in separate step)
```

---

## Completion Checklist

### Functional Requirements
- [ ] Page renders at `/` route
- [ ] "Ingresar" button navigates to `/login` (route may not exist yet)
- [ ] "Registrarse" button navigates to `/register` (route may not exist yet)
- [ ] All links work correctly
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] Matches Figma design specifications

### Technical Requirements
- [ ] Uses Atomic Design component structure
- [ ] Components in appropriate directories (atoms/, molecules/, organisms/)
- [ ] TypeScript types for all props
- [ ] Follows coding standards (`.claude/coding-standards.md`)
- [ ] No accessibility warnings
- [ ] No console errors
- [ ] Passes ESLint validation
- [ ] Passes TypeScript compilation

### Performance Requirements
- [ ] Lighthouse score: Performance > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No layout shifts (CLS = 0)

### Content Requirements
- [ ] All text in Spanish
- [ ] Correct spelling and grammar
- [ ] Brand-consistent messaging
- [ ] Clear call-to-action

---

## Common Issues & Solutions

### Issue: Logo not displaying
**Solution**: Verify logo.svg is in public/ directory and path is correct in Logo component

### Issue: Tailwind classes not working
**Solution**:
- Check tailwind.config is properly configured
- Verify classes are not purged
- Restart dev server

### Issue: Build fails
**Solution**:
- Check for TypeScript errors: `yarn tsc --noEmit`
- Check for ESLint errors: `yarn lint`
- Clear .next folder and rebuild

### Issue: Layout shifts on load
**Solution**:
- Add explicit width/height to images
- Use CSS aspect-ratio or fixed dimensions

### Issue: Dark mode not working
**Solution**:
- Verify CSS variables are defined in globals.css
- Check theme configuration in tailwind.config
- Use theme variables instead of hardcoded colors

---

## Next Steps After Completion

1. **Create Authentication Feature** (Feature 01-auth)
   - Login page (`/login`)
   - Registration page (`/register`)
   - Connected from prehome CTAs

2. **Update Links**
   - Once auth pages exist, verify navigation works
   - Test full user flow

3. **Add Analytics** (if required)
   - Track CTA clicks
   - Monitor page performance

4. **A/B Testing** (future)
   - Test different headlines
   - Optimize conversion

---

## Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Phase 1: Preparation | 30 min | | |
| Phase 2: Atoms | 2-3 hrs | | |
| Phase 3: Molecules | 2-3 hrs | | |
| Phase 4: Organisms | 1-2 hrs | | |
| Phase 5: Page Assembly | 30 min | | |
| Phase 6: Content | 1-2 hrs | | |
| Phase 7: Responsive | 1-2 hrs | | |
| Phase 8: Accessibility | 1 hr | | |
| Phase 9: Dark Mode | 30 min | | |
| Phase 10: Performance | 1 hr | | |
| Phase 11: Testing | 1-2 hrs | | |
| Phase 12: Documentation | 30 min | | |
| **Total** | **~16 hrs (2 days)** | | |

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Design Resources**: [references.md](./references.md)
- **Figma Design**: [Link](https://www.figma.com/design/VbXLRi0Ezy4HRRgzEPzcjo/Portal-transaccional_1?node-id=1409-340&t=wV8QeKEjFQ9tqGtr-4)
- **Coding Standards**: `.claude/coding-standards.md`
- **Workflows**: `.claude/workflows.md`

---

**Ready to implement?** Start with Phase 1 and work through each step sequentially. Mark items as complete as you go. Good luck! 🚀
