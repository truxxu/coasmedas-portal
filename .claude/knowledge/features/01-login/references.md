# References - Login Feature

**Feature**: 01-login
**Last Updated**: 2025-12-02

---

## Design Resources

### UI/UX Design
- **Figma Login Design**: [Login Page](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1409-787&t=m9MCv7YKAd0nQVyS-0)
  - Node ID: 1409-787
  - File Key: zuAxL3sGgRg5IWt5OKQ70x
  - Last updated: 2025-12-02
  - Owner: Design Team

### Design System Reference
- **Prehome Design Tokens**: See [../00-prehome/references.md](../00-prehome/references.md) for shared brand colors and typography

---

## Visual Design Summary

### Layout
- Navy blue full-screen background (`#1D4E8F`)
- Centered white card with rounded corners (~24px radius)
- Card width: ~360px max-width
- Vertical layout: Logo ’ Header ’ Form ’ Actions ’ Footer

### Key Components
1. **Logo Section** - Coasmedas logo with tagline
2. **Header** - "Iniciar sesión" title + instructions
3. **Form Fields**:
   - Tipo de documento (dropdown)
   - Número de documento (text input)
   - Contraseña (password input)
4. **Terms & Conditions** - Checkbox acceptance text
5. **CAPTCHA Placeholder** - Gray box for validation
6. **Submit Button** - "Ingresar" button (disabled state shown)
7. **Forgot Password Link** - "¿Olvidaste tu contraseña?"
8. **App Promotion** - "Lleva a Coas en tu bolsillo" + store badges
9. **Help Section** - "¿Necesitas ayuda?" + contact link

### Color Palette
- **Primary Blue**: `#007FFF` - Active buttons, CTAs
- **Navy Blue**: `#1D4E8F` - Background, links
- **Text Black**: `#111827` - Headings
- **Gray High**: `#58585B` - Labels, secondary text
- **Gray Border**: `#B1B1B1` - Input borders
- **Light Gray BG**: `#E4E6EA` - CAPTCHA placeholder
- **Disabled Blue**: `#A6C4FF` - Disabled button background
- **White**: `#FFFFFF` - Card background

### Typography
- **Font**: Ubuntu (Regular 400, Medium 500, Bold 700)
- **Heading**: Ubuntu Bold, 20px, #111827
- **Labels**: Ubuntu Medium, 14.5px, #58585B
- **Input Text**: Ubuntu Regular, 16px, black
- **Button**: Ubuntu Bold, 14px
- **Links**: Ubuntu Medium, 14px, #1D4E8F

### Form Specifications
- **Input Height**: ~44px (touch-friendly)
- **Border Radius**: 6px
- **Border**: 1px solid #B1B1B1
- **Spacing**: Consistent vertical rhythm (~16-20px between fields)
- **Button**: Full-width, 6px radius, disabled state: #A6C4FF background

---

## Technical Resources

### Libraries
- **React Hook Form**: https://react-hook-form.com - Form state management
- **Yup**: https://github.com/jquense/yup - Validation schemas
- **Ubuntu Font**: Already integrated in project

### Design Patterns
- **Form Validation**: See `.claude/coding-standards.md` (Forms section)
- **Atomic Design**: Follow existing component hierarchy

---

## Related Features
- **Prehome** (00-prehome) - Contains "Iniciar Sesión" navigation link
- **Dashboard** (future) - Destination after successful login
- **Registration** (future) - Alternative auth flow
- **Forgot Password** (future) - Linked from login form

---

## Notes
- Design shows disabled button state (light blue)
- CAPTCHA integration placeholder shown
- No password visibility toggle shown in design
- App store badges included in footer section
- Form follows Spanish language conventions
