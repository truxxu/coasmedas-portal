# Feature: Prehome (Landing Page)

**Status**: Planning
**Priority**: Must Have
**Feature Number**: 00 (Initial landing page)
**Last Updated**: 2025-11-26

---

## Overview

The **Prehome** is the initial landing page of the Coasmedas Portal, displayed to unauthenticated users before login. It serves as the entry point to the banking portal, providing access to authentication (login/register) and basic information about the service.

**Key Purpose**:
- First impression for users
- Access to login and registration
- Marketing/information about Coasmedas services
- Responsive design for desktop and mobile

---

## UI Design

**Figma Design**: [Prehome Design](https://www.figma.com/design/VbXLRi0Ezy4HRRgzEPzcjo/Portal-transaccional_1?node-id=1409-340&t=wV8QeKEjFQ9tqGtr-4)

**Design Assets**:
- Prehome layout: `./attachments/designs/prehome.svg`
- Logo: `./attachments/designs/logo.svg`

See [references.md](./references.md) for all design resources and implementation guidance.

---

## User Stories

### US-00.1: Landing Page Access
**As a** potential user
**I want** to see an attractive landing page when I visit the portal
**So that** I understand what services are available and can access login/registration

**Acceptance Criteria**:
- [ ] Page loads at root URL `/`
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Follows Figma design specifications
- [ ] Uses Tailwind CSS v4 theme system
- [ ] Spanish language content
- [ ] Accessible (WCAG 2.1 Level AA)

### US-00.2: Login Access
**As a** registered user
**I want** to access the login form from the prehome
**So that** I can authenticate and access my account

**Acceptance Criteria**:
- [ ] Visible "Ingresar" / "Iniciar Sesión" button/link
- [ ] Clicking navigates to login page or opens login modal
- [ ] Clear visual hierarchy for primary CTA
- [ ] Works on all device sizes

### US-00.3: Registration Access
**As a** new user
**I want** to access the registration form from the prehome
**So that** I can create a new account

**Acceptance Criteria**:
- [ ] Visible "Registrarse" / "Crear Cuenta" button/link
- [ ] Clicking navigates to registration page or opens registration modal
- [ ] Secondary CTA styling (less prominent than login)
- [ ] Works on all device sizes

### US-00.4: Information Display
**As a** potential user
**I want** to see information about Coasmedas services
**So that** I can understand what the portal offers

**Acceptance Criteria**:
- [ ] Clear value proposition
- [ ] Service highlights (if applicable)
- [ ] Trust indicators (security, licensing, etc.)
- [ ] Contact information or help link

---

## Technical Approach

### Route
- **Path**: `/` (root)
- **File**: `app/page.tsx`
- **Type**: Public route (no authentication required)

### Components (Atomic Design)

#### Atoms
- `Button` - Primary/secondary CTA buttons
- `Logo` - Coasmedas logo component
- `Icon` - UI icons (security, mobile, etc.)
- `Link` - Navigation links

#### Molecules
- `NavBar` - Top navigation with login/register links
- `HeroSection` - Main hero/banner area
- `FeatureCard` - Service highlight cards
- `Footer` - Page footer

#### Organisms
- `PrehomeHeader` - Complete header with nav and logo
- `PrehomeHero` - Hero section with CTAs
- `PrehomeFeaturesGrid` - Grid of service features
- `PrehomeFooter` - Complete footer

### Page Structure
```tsx
// app/page.tsx
export default function PrehomePage() {
  return (
    <>
      <PrehomeHeader />
      <PrehomeHero />
      <PrehomeFeaturesGrid />
      <PrehomeFooter />
    </>
  );
}
```

### Styling
- Use Tailwind CSS v4
- Follow theme variables from `app/globals.css`
- Responsive breakpoints: mobile-first
- Dark mode support via `prefers-color-scheme`

### Navigation
- **Login**: Navigate to `/login` or open modal
- **Register**: Navigate to `/register` or open modal
- **Links**: Smooth scroll to sections (if one-page design)

### Performance
- Static page (no dynamic data)
- Image optimization with Next.js Image component
- SVG logo/icons for crispness
- Lazy load below-fold content if heavy

---

## Dependencies

### Frontend
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript

### Future Integration
- Will link to authentication pages/modals (Feature 01-auth)
- May include contact form (future feature)

---

## Acceptance Criteria

### Functional
- [ ] Page renders at `/` route
- [ ] "Ingresar" button navigates to `/login`
- [ ] "Registrarse" button navigates to `/register`
- [ ] All links work correctly
- [ ] Page is fully responsive (mobile, tablet, desktop)
- [ ] Matches Figma design specifications

### Technical
- [ ] Uses Atomic Design component structure
- [ ] Components in appropriate directories (atoms/, molecules/, organisms/)
- [ ] TypeScript types for all props
- [ ] Follows coding standards (`.claude/coding-standards.md`)
- [ ] No accessibility warnings
- [ ] No console errors
- [ ] Passes ESLint validation

### Performance
- [ ] Lighthouse score: Performance > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No layout shifts (CLS = 0)

### Content
- [ ] All text in Spanish
- [ ] Correct spelling and grammar
- [ ] Brand-consistent messaging
- [ ] Clear call-to-action

---

## Implementation Plan

### Phase 1: Component Structure (0.5 day)
**Deliverables**:
- Create atomic components (Button, Logo, Icon, Link)
- Create molecule components (NavBar, HeroSection, Footer)
- Export from index files

**Files**:
- `src/atoms/Button.tsx`
- `src/atoms/Logo.tsx`
- `src/atoms/Icon.tsx`
- `src/atoms/Link.tsx`
- `src/atoms/index.ts`
- `src/molecules/NavBar.tsx`
- `src/molecules/HeroSection.tsx`
- `src/molecules/Footer.tsx`
- `src/molecules/index.ts`

### Phase 2: Page Layout (0.5 day)
**Deliverables**:
- Create organism components
- Assemble page layout
- Implement responsive design

**Files**:
- `src/organisms/PrehomeHeader.tsx`
- `src/organisms/PrehomeHero.tsx`
- `src/organisms/PrehomeFooter.tsx`
- `src/organisms/index.ts`
- `app/page.tsx` (update from placeholder)

### Phase 3: Content & Styling (0.5 day)
**Deliverables**:
- Add actual content (copy from design)
- Implement Tailwind styling per design
- Add images/SVG assets (copy logo.svg to public/)
- Responsive refinements

**Files**:
- `public/logo.svg` (copy from attachments/designs/logo.svg)
- `public/` (other images as needed)
- Update component files with content

### Phase 4: Polish & Testing (0.5 day)
**Deliverables**:
- Accessibility improvements
- Performance optimization
- Cross-browser testing
- Dark mode testing

**Tasks**:
- Run Lighthouse audit
- Fix accessibility issues
- Test on mobile devices
- Verify all navigation links

**Total Estimated Time**: 2 days

---

## Design Specifications

### Colors
From Tailwind theme (`app/globals.css`):
- Background: `--background` (light: #ffffff, dark: #0a0a0a)
- Foreground: `--foreground` (light: #171717, dark: #ededed)
- Additional colors: Define as needed following Coasmedas brand

### Typography
- Font Sans: `--font-geist-sans` (Geist Sans)
- Font Mono: `--font-geist-mono` (Geist Mono)
- Headings: Font Sans, various weights
- Body: Font Sans, regular weight

### Responsive Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Layout
- Mobile-first approach
- Max width container: 1280px (xl)
- Padding: Consistent spacing scale
- Grid: CSS Grid or Flexbox

---

## Content Guidelines

### Tone & Voice
- Professional yet approachable
- Clear and concise
- Trust-building
- Spanish language (Colombia)

### Required Sections
1. **Header/Navigation**
   - Logo
   - "Ingresar" button
   - "Registrarse" link

2. **Hero Section**
   - Main headline
   - Subheadline/value proposition
   - Primary CTA: "Ingresar"
   - Secondary CTA: "Registrarse"

3. **Features/Benefits** (if applicable)
   - Service highlights
   - Trust indicators
   - Security messaging

4. **Footer**
   - Copyright
   - Legal links (if applicable)
   - Contact information
   - Social media (if applicable)

---

## Accessibility Requirements

- Semantic HTML5 elements
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast (WCAG AA)
- Focus indicators visible
- Screen reader friendly

---

## Security Considerations

- No sensitive data on public page
- HTTPS required (production)
- No inline scripts (CSP compliance)
- Rate limiting on API calls (if any)

---

## Testing Checklist

### Manual Testing
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet (iPad, Android)
- [ ] Dark mode appearance
- [ ] Light mode appearance
- [ ] Keyboard navigation
- [ ] Screen reader (NVDA/VoiceOver)

### Automated Testing
- [ ] ESLint passes
- [ ] TypeScript compilation successful
- [ ] Build succeeds (`yarn build`)
- [ ] No React warnings in console
- [ ] Lighthouse audit scores

---

## Known Limitations / Future Enhancements

### Current Scope (MVP)
- Static content only
- Basic navigation to auth pages
- No dynamic features

### Future Enhancements (Out of Scope)
- Marketing content CMS integration
- Contact form
- Live chat widget
- Animated hero section
- Testimonials/reviews
- Multi-language support
- A/B testing capabilities

---

## Related Features

- **Feature 01-auth**: Authentication (login/register) - linked from prehome CTAs
- **Feature 02-dashboard**: Post-login dashboard - destination after successful login

---

## References

See [references.md](./references.md) for:
- Figma design link
- Design assets
- External resources

---

## Implementation Notes

### When Implementing
1. Start with atoms (Button, Logo, etc.)
2. Build up to molecules (NavBar, HeroSection)
3. Assemble organisms (PrehomeHeader, etc.)
4. Compose page in `app/page.tsx`
5. Test responsiveness at each step

### Component Export Pattern
```typescript
// src/atoms/index.ts
export { Button } from './Button';
export { Logo } from './Logo';
export { Icon } from './Icon';
export { Link } from './Link';
```

### Logo Component Implementation
```typescript
// src/atoms/Logo.tsx
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Coasmedas"
      width={150}
      height={50}
      className={className}
      priority
    />
  );
}
```

**Note**: Copy `logo.svg` from `.claude/knowledge/features/00-prehome/attachments/designs/logo.svg` to `public/logo.svg` for Next.js Image optimization.

### Usage in Page
```typescript
// app/page.tsx
import { PrehomeHeader, PrehomeHero, PrehomeFooter } from '@/src/organisms';

export default function PrehomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PrehomeHeader />
      <PrehomeHero />
      <PrehomeFooter />
    </main>
  );
}
```

---

**Feature Owner**: Development Team
**Design Reference**: Figma (see references.md)
**Estimated Effort**: 2 days
**Dependencies**: None (first feature)
