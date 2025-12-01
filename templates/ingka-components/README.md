# IKEA Ingka Skapa Component Templates

> **Official IKEA Design System Components for React**

This directory contains production-ready React components built with the **IKEA Ingka Skapa Design System**. Each component follows IKEA's design principles and accessibility standards (WCAG 2.1 AA).

## 📦 Installation

First, set up the IKEA Ingka Skapa registry:

```bash
# Set registry for @ingka scope (one-time setup)
npm set --location project @ingka:registry="https://npm.m2.blue.cdtapps.com"

# Install required design system packages
npm i @ingka/design-tokens @ingka/colours @ingka/typography
```

## 🎨 Design System Overview

### Foundation Packages

- **`@ingka/design-tokens`** - Spacing, elevation, border radius, shadows
- **`@ingka/colours`** - Official IKEA color palette
- **`@ingka/typography`** - Noto Sans typeface system
- **`@ingka/grid`** - Responsive 8px grid system
- **`@ingka/animations`** - Motion design utilities

### Component Categories

1. **Layout & Structure**

   - `@ingka/grid` - Responsive grid system
   - `@ingka/aspect-ratio-box` - Maintain aspect ratios
   - `@ingka/divider` - Visual separators

2. **Buttons & Actions**

   - `@ingka/button` - Primary button component
   - `@ingka/dual-button` - Dual action buttons
   - `@ingka/icon-button` - Icon-only buttons
   - `@ingka/pill` - Pill-shaped buttons

3. **Form Controls**

   - `@ingka/input-field` - Text inputs
   - `@ingka/checkbox` - Checkbox inputs
   - `@ingka/radio-button` - Radio buttons
   - `@ingka/select` - Dropdown selects
   - `@ingka/switch` - Toggle switches

4. **Display & Content**

   - `@ingka/card` - Content cards
   - `@ingka/text` - Typography components
   - `@ingka/image` - Optimized images
   - `@ingka/badge` - Status badges

5. **Feedback & Status**

   - `@ingka/toast` - Toast notifications
   - `@ingka/banner` - Banner messages
   - `@ingka/loading` - Loading indicators
   - `@ingka/progress-indicator` - Progress bars

6. **Modals & Overlays**
   - `@ingka/modal-prompt` - Prompt modals
   - `@ingka/modal-sheets` - Sheet modals
   - `@ingka/tooltip` - Tooltips

## 🚀 Usage

Each component template in this directory provides:

- ✅ **TypeScript definitions** - Full type safety
- ✅ **IKEA design tokens** - Consistent spacing, colors, typography
- ✅ **Accessibility features** - WCAG 2.1 AA compliant
- ✅ **Responsive design** - Mobile-first approach
- ✅ **Dark mode support** - Automatic theme adaptation
- ✅ **Usage examples** - Code snippets and patterns

## 📁 Component Structure

```
templates/ingka-components/
├── Button/
│   ├── Button.tsx          # Main component
│   ├── Button.types.ts     # TypeScript definitions
│   ├── Button.stories.tsx  # Storybook stories
│   ├── Button.test.tsx     # Jest tests
│   └── README.md           # Component documentation
├── Card/
│   ├── Card.tsx
│   ├── Card.types.ts
│   └── README.md
└── ...
```

## 🎯 Key Principles

### 1. **8px Grid System**

All spacing uses multiples of 8px (8, 16, 24, 32, 40, 48):

```tsx
import { tokens } from "@ingka/design-tokens";

const spacing = {
  xs: tokens.spacing.xs, // 8px
  sm: tokens.spacing.sm, // 16px
  md: tokens.spacing.md, // 24px
  lg: tokens.spacing.lg, // 32px
  xl: tokens.spacing.xl, // 48px
};
```

### 2. **IKEA Color Palette**

Use official IKEA colors consistently:

```tsx
import { colors } from "@ingka/colours";

const theme = {
  primary: colors.blue.primary, // #0051BA (IKEA Blue)
  secondary: colors.yellow.primary, // #FFDA1A (IKEA Yellow)
  text: colors.neutral.black, // #000000
  background: colors.neutral.white, // #FFFFFF
};
```

### 3. **Accessibility First**

Every component includes:

- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast compliance
- Screen reader optimization
- Focus management

### 4. **Responsive Design**

Mobile-first breakpoints:

```tsx
const breakpoints = {
  mobile: "320px", // Small phones
  tablet: "768px", // Tablets
  laptop: "1024px", // Laptops
  desktop: "1440px", // Desktop monitors
};
```

## 📚 Full IKEA Documentation

**Complete PDF specifications are available on GitHub:**

👉 **[IKEA Component PDFs (83 files)](https://github.com/leopagotto/ux-ingka-kit/tree/main/docs/guides/Skapa-components)**
👉 **[IKEA Foundation PDFs (23 files)](https://github.com/leopagotto/ux-ingka-kit/tree/main/docs/guides/Skapa-foundations)**

These include:

## 🔗 Related Resources

- **[IKEA Design System Guide](../../docs/guides/INGKA_DESIGN_SYSTEM.md)**
- **[Component PDFs](../../docs/guides/Skapa-components/)**
- **[Foundation PDFs](../../docs/guides/Skapa-foundations/)**
- **[AI Agent Instructions](../../lib/ai-instructions/frontend-agent-ingka.instructions.md)**

---

**🇸🇪 Built with IKEA Ingka Skapa Design System for professional, accessible, and consistent user interfaces.**
