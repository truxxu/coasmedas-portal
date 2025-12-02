# Coasmedas Portal - Design System

**Version**: 1.0
**Last Updated**: 2025-12-02
**Based on**: Figma UI Kit (node-id: 1198:106)

---

## 🎨 Color Palette

### Interface Backgrounds
- **Sidebar Background**: `#1D4E8F` (Navy Blue)
- **Main Content Background**: `#F0F9FF` (Light Blue)
- **White**: `#FFFFFF`

### Primary Colors
- **Primary Navy**: `#1D4E8F` - Main brand color, buttons, headers
- **Primary Yellow**: `#FFC627` - Accent color, highlights

### Secondary Colors (Grays)
- **Gray High**: `#58585B` - Secondary text, icons
- **Gray Medium**: `#808284` - Disabled states, borders
- **Gray Low**: `#D1D2D4` - Light borders, dividers
- **Border Gray**: `#B1B1B1` - Input borders, separators
- **Text Black**: `#111827` - Primary text color

### Tertiary Colors (Product Accents)
- **Teal**: `#00AFA9` - Savings products
- **Green**: `#82BC00` - Success, positive actions
- **Pink/Red**: `#F6323E` - Warnings, important notices
- **Bright Red**: `#FF0D00` - Errors, critical alerts

### Status Colors
- **Success**: `#00AFA9` (Teal) or `#0AE577` (Green)
- **Warning**: `#FFC627` (Yellow) or `#FF3945` (Red-orange)
- **Error**: `#FF0D00` (Bright Red)
- **Info**: `#007FFF` (Blue)
- **Active**: `#82BC00` (Green)
- **Pending**: `#FFC627` (Yellow)
- **Blocked**: `#F6323E` (Pink/Red)
- **Inactive**: `#808284` (Gray)

### Blue Scale (for gradients and variations)
- Blue 50: `#E3F2FD`
- Blue 100: `#BBDEFB`
- Blue 200: `#90CAF9`
- Blue 300: `#64B5F6`
- Blue 400: `#42A5F5`
- Blue 500: `#2196F3`
- Blue 600: `#1E88E5`
- Blue 700: `#1976D2`
- Blue 800: `#1565C0`
- Blue 900: `#0D47A1`

---

## 📝 Typography

### Font Family
**Ubuntu** (Bold, Medium, Regular)
- Headings: Ubuntu Bold
- Subheadings: Ubuntu Medium
- Body text: Ubuntu Regular

### Type Scale
- **H1**: 32px / 2rem (Bold) - Page titles
- **H2**: 28px / 1.75rem (Bold) - Section headers
- **H3**: 24px / 1.5rem (Bold) - Subsection headers
- **H4**: 20px / 1.25rem (Bold) - Card titles
- **H5**: 18px / 1.125rem (Medium) - Small headers
- **H6**: 16px / 1rem (Medium) - Smallest headers
- **Body**: 16px / 1rem (Regular) - Paragraph text
- **Small**: 14px / 0.875rem (Regular) - Captions, notes
- **Tiny**: 12px / 0.75rem (Regular) - Labels, metadata

### Text Colors
- **Primary**: `#111827` (Text Black)
- **Secondary**: `#58585B` (Gray High)
- **Tertiary**: `#808284` (Gray Medium)
- **Link**: `#1D4E8F` (Navy) or `#007FFF` (Blue)
- **Link Hover**: Darker shade or underline
- **Disabled**: `#D1D2D4` (Gray Low)

---

## 🔘 Buttons

### Primary Button
- **Background**: `#007FFF` (Blue) or `#1D4E8F` (Navy)
- **Text**: `#FFFFFF` (White)
- **Border**: None
- **Border Radius**: `8px` (rounded-lg)
- **Padding**: `12px 24px` (py-3 px-6)
- **Font**: Ubuntu Medium, 16px
- **Hover**: Darker shade (opacity or color shift)
- **Active**: Even darker
- **Disabled**: `#D1D2D4` background, `#808284` text

### Secondary Button
- **Background**: Transparent or `#FFFFFF`
- **Text**: `#1D4E8F` (Navy)
- **Border**: `1px solid #1D4E8F`
- **Border Radius**: `8px`
- **Padding**: `12px 24px`
- **Hover**: Light background fill

### Text Button
- **Background**: Transparent
- **Text**: `#1D4E8F` (Navy) or `#007FFF` (Blue)
- **Border**: None
- **Underline**: On hover
- **Font**: Ubuntu Medium, 16px

### Icon Button
- **Size**: `40px × 40px` (square or circle)
- **Icon Size**: `20px × 20px`
- **Background**: Varies by context
- **Hover**: Background color change

### Button Sizes
- **Large**: `48px` height, `20px 32px` padding
- **Medium**: `40px` height, `12px 24px` padding (default)
- **Small**: `32px` height, `8px 16px` padding
- **Tiny**: `28px` height, `6px 12px` padding

### Button States
- **Default**: Normal appearance
- **Hover**: Subtle color change, cursor pointer
- **Active/Pressed**: Darker color
- **Disabled**: Gray colors, cursor not-allowed
- **Loading**: Show spinner, disable interaction

---

## 📋 Form Elements

### Text Input
- **Height**: `44px` (h-11)
- **Padding**: `12px` (px-3)
- **Border**: `1px solid #B1B1B1`
- **Border Radius**: `6px`
- **Font Size**: `16px`
- **Text Color**: `#111827` (Black)
- **Placeholder Color**: `#58585B` (Gray High)
- **Focus**: `2px solid #007FFF` border
- **Error**: `2px solid #FF0D00` border
- **Disabled**: `#F0F9FF` background, `#D1D2D4` border

### Select / Dropdown
- **Height**: `44px`
- **Padding**: `12px`
- **Border**: `1px solid #B1B1B1`
- **Border Radius**: `6px`
- **Caret**: Down arrow icon (chevron)
- **Placeholder**: `#58585B` (Gray High)
- **Selected**: `#111827` (Black)
- **Focus**: `2px solid #007FFF` border

### Textarea
- **Min Height**: `88px` (2 lines)
- **Padding**: `12px`
- **Border**: `1px solid #B1B1B1`
- **Border Radius**: `6px`
- **Resize**: Vertical only

### Checkbox
- **Size**: `16px × 16px`
- **Border**: `1px solid #B1B1B1`
- **Border Radius**: `2px`
- **Checked Background**: `#007FFF`
- **Checkmark**: White icon

### Radio Button
- **Size**: `16px × 16px`
- **Border**: `1px solid #B1B1B1`
- **Border Radius**: `50%` (circle)
- **Selected**: Inner circle `8px`, background `#007FFF`

### Toggle Switch
- **Width**: `48px`
- **Height**: `24px`
- **Border Radius**: `12px` (fully rounded)
- **Off**: `#D1D2D4` background
- **On**: `#007FFF` background
- **Knob**: `18px × 18px` white circle

### Label
- **Font Size**: `14px`
- **Font Weight**: Medium
- **Color**: `#111827`
- **Margin Bottom**: `8px`

### Error Message
- **Font Size**: `14px`
- **Color**: `#FF0D00`
- **Margin Top**: `4px`
- **Icon**: Optional error icon

---

## 🃏 Cards

### Standard Card
- **Background**: `#FFFFFF`
- **Border**: `1px solid #E4E6EA` or none
- **Border Radius**: `16px` (rounded-2xl)
- **Padding**: `24px` (p-6)
- **Shadow**: `0 2px 8px rgba(0,0,0,0.08)`
- **Hover**: Subtle shadow increase (optional)

### Featured Card (Dark)
- **Background**: `#1D4E8F` (Navy)
- **Text**: `#FFFFFF` (White)
- **Border Radius**: `16px`
- **Padding**: `24px`

### Module Card
- **Background**: `#FFFFFF`
- **Border**: `1px solid #E4E6EA`
- **Border Radius**: `16px`
- **Padding**: `20px`
- **Icon**: `32px × 32px` at top
- **Title**: H5 size
- **Description**: Small text

### Carousel Card
- **Background**: `#FFFFFF`
- **Border**: `1px solid #E4E6EA`
- **Border Radius**: `16px`
- **Padding**: `20px`
- **Number Label**: Top, small text
- **Balance**: Large, bold text

### Product Card (Credit Card Style)
- **Aspect Ratio**: 1.586:1 (credit card ratio)
- **Background**: Gradient or solid navy
- **Border Radius**: `16px`
- **Padding**: `20px`
- **Text**: White on dark backgrounds

---

## 📊 Lists & Tables

### Transaction List Item
- **Height**: `auto` (min `64px`)
- **Padding**: `16px`
- **Border Bottom**: `1px solid #E4E6EA`
- **Icon/Avatar**: `40px × 40px` on left
- **Title**: 16px, bold
- **Subtitle**: 14px, gray
- **Amount**: Right-aligned, bold
- **Positive Amount**: Green color
- **Negative Amount**: Red color

### Selection List Item
- **Height**: `70px`
- **Padding**: `16px`
- **Border**: `1px solid #E4E6EA`
- **Border Radius**: `8px`
- **Margin Bottom**: `12px`
- **Chevron**: Right side
- **Hover**: Background `#F0F9FF`

---

## 🏷️ Status Labels & Badges

### Status Badge
- **Padding**: `4px 12px`
- **Border Radius**: `12px` (fully rounded)
- **Font Size**: `12px`
- **Font Weight**: Medium

#### Status Types
- **Active** (Activo): `#82BC00` background, white text
- **Pending** (Pendiente): `#FFC627` background, black text
- **Blocked** (Bloqueada): `#F6323E` background, white text
- **Inactive** (Inactivo): `#808284` background, white text
- **In Process** (En proceso): `#007FFF` background, white text
- **Requested** (Solicitado): `#00AFA9` background, white text

---

## 🚨 Alerts & Notifications

### Alert Box
- **Padding**: `16px`
- **Border Radius**: `8px`
- **Border**: `1px solid` (varies by type)
- **Icon**: Optional, left side
- **Close Button**: Optional, right side

#### Alert Types
- **Success**: `#82BC00` background (light), `#82BC00` border, `#1D4E8F` text
- **Info**: `#E3F2FD` background, `#2196F3` border, `#1D4E8F` text
- **Warning**: `#FFF8E1` background, `#FFC627` border, `#1D4E8F` text
- **Error**: `#FFEBEE` background, `#FF0D00` border, `#FF0D00` text

---

## 🪟 Modals

### Modal Container
- **Max Width**: `400px` (small), `600px` (medium), `800px` (large)
- **Background**: `#FFFFFF`
- **Border Radius**: `16px`
- **Padding**: `32px`
- **Shadow**: `0 8px 32px rgba(0,0,0,0.24)`
- **Backdrop**: Black with 40% opacity

### Modal Header
- **Title**: H3 or H4 size
- **Close Button**: Top right, X icon
- **Border Bottom**: `1px solid #E4E6EA` (optional)
- **Padding Bottom**: `16px`

### Modal Body
- **Padding**: `24px 0`
- **Content**: Varies by modal type

### Modal Footer
- **Border Top**: `1px solid #E4E6EA` (optional)
- **Padding Top**: `16px`
- **Buttons**: Right-aligned, gap between them
- **Button Order**: Cancel (secondary) + Action (primary)

### Modal Types
- **Action Modal**: Standard with title, content, actions
- **Confirmation Modal**: Icon + title + message + actions
- **Success Modal**: Success icon + message + single button
- **Error Modal**: Error icon + message + single button

---

## 📈 Progress & Loading

### Progress Bar
- **Height**: `10px`
- **Border Radius**: `5px` (fully rounded)
- **Background**: `#E4E6EA` (track)
- **Fill**: `#007FFF` or gradient (progress)
- **Labels**: Above or below, 14px

### Loading Spinner
- **Size**: `48px × 48px` (medium)
- **Color**: `#007FFF` (primary)
- **Animation**: Rotate 360deg, 1s linear infinite

### Skeleton Loader
- **Background**: `#E4E6EA`
- **Animation**: Shimmer effect
- **Border Radius**: Match content shape

---

## 🧭 Navigation

### Sidebar
- **Width**: `268px`
- **Background**: `#1D4E8F` (Navy)
- **Text**: `#FFFFFF` (White)
- **Padding**: `20px`

#### Menu Item
- **Height**: `40px`
- **Padding**: `8px 16px`
- **Border Radius**: `8px`
- **Icon**: `20px × 20px`, left side
- **Text**: 16px, medium
- **Hover**: `rgba(255,255,255,0.1)` background
- **Active**: `#007FFF` background
- **Chevron**: Right side for expandable items

### Header Bar
- **Height**: `64px`
- **Background**: `#FFFFFF`
- **Border Bottom**: `1px solid #E4E6EA`
- **Padding**: `0 24px`
- **Logo**: Left side
- **Actions**: Right side (profile, notifications, etc.)

---

## 🔄 Stepper

### Stepper Container
- **Horizontal Layout**: Flex row
- **Connector Line**: `140px` wide, `1px` height
- **Color**: `#E4E6EA` (inactive), `#007FFF` (active)

### Step Item
- **Circle**: `40px × 40px`
- **Border**: `2px solid #E4E6EA` (inactive)
- **Background**: `#007FFF` (active), `#FFFFFF` (inactive)
- **Icon/Number**: Centered, white (active), gray (inactive)
- **Label**: Below, 14px, centered
- **Completed**: Checkmark icon, `#007FFF` background

### Step States
- **Pending**: Gray circle, gray text
- **Active**: Blue circle, blue text, bold
- **Completed**: Blue circle with checkmark, blue text

---

## 🎯 Icons

### Icon Sizes
- **Tiny**: `16px × 16px`
- **Small**: `20px × 20px`
- **Medium**: `24px × 24px` (default)
- **Large**: `32px × 32px`
- **XLarge**: `48px × 48px`

### Icon Colors
- **Primary**: `#1D4E8F` (Navy)
- **Secondary**: `#58585B` (Gray)
- **Accent**: `#007FFF` (Blue)
- **On Dark**: `#FFFFFF` (White)

---

## 🖼️ Images & Media

### Avatar
- **Sizes**: `32px`, `40px`, `48px`, `64px`
- **Border Radius**: `50%` (circle)
- **Background**: `#1D4E8F` with white initials
- **Border**: Optional `2px solid #E4E6EA`

### Logo
- **Primary**: Full color Coasmedas logo
- **Monochrome**: White version for dark backgrounds
- **Min Size**: `120px` width
- **Formats**: SVG preferred

---

## 📐 Spacing Scale

### Base Unit: 4px

- **xs**: `4px` (0.25rem)
- **sm**: `8px` (0.5rem)
- **md**: `12px` (0.75rem)
- **base**: `16px` (1rem)
- **lg**: `20px` (1.25rem)
- **xl**: `24px` (1.5rem)
- **2xl**: `32px` (2rem)
- **3xl**: `40px` (2.5rem)
- **4xl**: `48px` (3rem)

---

## 🎭 Shadows

- **sm**: `0 1px 2px rgba(0,0,0,0.05)`
- **base**: `0 2px 4px rgba(0,0,0,0.08)`
- **md**: `0 4px 8px rgba(0,0,0,0.1)`
- **lg**: `0 8px 16px rgba(0,0,0,0.12)`
- **xl**: `0 12px 24px rgba(0,0,0,0.15)`
- **2xl**: `0 24px 48px rgba(0,0,0,0.2)`

---

## 📱 Responsive Breakpoints

- **mobile**: `< 640px`
- **tablet**: `640px - 1023px`
- **desktop**: `≥ 1024px`
- **wide**: `≥ 1280px`

---

## ♿ Accessibility

### Contrast Ratios
- **Normal Text**: Minimum 4.5:1
- **Large Text** (18px+): Minimum 3:1
- **UI Components**: Minimum 3:1

### Focus States
- **Outline**: `2px solid #007FFF`
- **Offset**: `2px`
- **Visible**: Always on keyboard navigation

### ARIA Labels
- Use semantic HTML
- Add aria-label for icon-only buttons
- Use aria-describedby for error messages

---

## 🎨 Animation Guidelines

### Duration
- **Fast**: `150ms` - Hover, active states
- **Base**: `300ms` - Most transitions
- **Slow**: `500ms` - Modal open/close

### Easing
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Deceleration**: `cubic-bezier(0, 0, 0.2, 1)`
- **Acceleration**: `cubic-bezier(0.4, 0, 1, 1)`

---

## 🔗 References

- **Figma UI Kit**: [Link](https://www.figma.com/design/zuAxL3sGgRg5IWt5OKQ70x/Portal_C_CERP?node-id=1198-106)
- **Color Palette**: See Figma "Paleta de Colores"
- **Typography**: Ubuntu font family
- **Components**: See individual component frames in Figma

---

**Last Reviewed**: 2025-12-02
**Status**: Active
