# References - Prehome (Landing Page)

**Feature**: 00-prehome
**Last Updated**: 2025-11-26

---

## Design Resources

### UI/UX Design
- **Figma Design**: [Prehome Design](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1668-229&t=FmTV0BLrEQnPNsA9-0)
  - Last updated: 2025-11-26
  - Owner: Design Team

### Design Assets (Local)
- **Prehome Layout**: `attachments/designs/prehome.svg`
  - Full page design/mockup
  - Size: 1.4MB
  - Format: SVG

- **Logo**: `attachments/designs/logo.svg`
  - Coasmedas logo
  - Format: SVG (scalable)
  - Usage: Header, footer, branding

---

## Technical Resources

### Next.js Documentation
- **App Router**: https://nextjs.org/docs/app
- **Image Optimization**: https://nextjs.org/docs/app/building-your-application/optimizing/images

### Tailwind CSS
- **Documentation**: https://tailwindcss.com/docs
- **Tailwind v4**: https://tailwindcss.com/blog/tailwindcss-v4

### Accessibility
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM**: https://webaim.org/resources/

---

## Related Features

- [Authentication Feature](../01-authentication/spec.md) - Login/register flows linked from prehome
- [Dashboard Feature](../02-dashboard/spec.md) - Post-login destination

---

## Implementation Notes

### Using Design Assets

**Logo Implementation**:
```typescript
// src/atoms/Logo.tsx
import Image from 'next/image';
import logoSvg from '@/public/logo.svg';

export function Logo() {
  return (
    <Image
      src={logoSvg}
      alt="Coasmedas"
      width={150}
      height={50}
      priority
    />
  );
}
```

**Asset Locations**:
- Copy `logo.svg` to `public/` directory for Next.js Image optimization
- Keep original in `attachments/designs/` for reference

---

## Notes

- All designs are in Spanish
- Responsive design required for mobile, tablet, desktop
- Logo should maintain aspect ratio across breakpoints
- SVG format ensures crisp display on all screen densities