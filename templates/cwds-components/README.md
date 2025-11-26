# CWDS Component Templates

> **⚠️ IMPORTANT: These are TEMPLATES, not npm packages!**
>
> CWDS components are **NOT available on npm**. They are TypeScript/React templates
> that you copy to your project and customize. This is different from Skapa components
> which are bundled with ingvar-kit.

> **Source of Truth**: Official IKEA Ingka Co-worker Design Components (Skapa + Figma)
> **JSON Specifications**: Extracted from 73 Skapa screenshots via OCR
> **Last Updated**: 2025-11-02

## 🆚 Skapa vs CWDS: Key Differences

| Feature | Skapa Components | CWDS Templates |
|---------|-----------------|----------------|
| **Availability** | ✅ Bundled in ingvar-kit | ❌ Templates only (copy to project) |
| **Installation** | `import { Button } from 'ingvar-kit/skapa'` | Copy files manually |
| **Count** | 64 components | 6 templates |
| **Use Case** | Customer-facing apps | Internal co-worker tools |
| **Customization** | Use as-is | Full source, modify freely |
| **Updates** | npm update | Manual re-copy |

## 🚀 Quick Installation

```bash
# Copy CWDS templates to your project
cp -r node_modules/ingvar-kit/templates/cwds-components/* src/components/cwds/

# Or use the CLI (interactive)
ingvar cwds install
```

## Overview

These React/TypeScript component templates implement the **Co-Worker Design System (CWDS)** specification extracted from:

1. **Official Skapa Design System** (73 screenshots → JSON specs)
2. **IKEA Figma designs** (Co-worker components)

**Important**: CWDS is a **design specification**, not an npm package. These templates provide two installation options:

1. **Recommended**: Install from npm package `@ingka/*` (if available)
2. **Fallback**: Use local templates (compose `@ingka/*` UI primitives)

## 📦 Installation Priority

```bash
# 1. First, try to install from official npm packages
npm install @ingka/global-header @ingka/navigation-menu

# 2. If not available, use ingvar CLI to install local templates
ingvar cwds install
```

**Why this approach?**

- ✅ Official npm packages are maintained by IKEA teams
- ✅ Automatic updates and bug fixes
- ✅ Consistent versioning across projects
- ✅ Local templates as reliable fallback

## 🎯 JSON Specifications

All CWDS components have been extracted to JSON format with complete specifications:

```
docs/guides/Skapa-json/subsystems/
├── Ingka-Co-Worker-Global-Header.json        # Fixed header (#003E72)
├── Ingka-Co-Worker-Navigation-Menu.json      # Left sidebar navigation
├── Ingka-Co-Worker-Bottom-Bar-Navigation.json # Mobile bottom nav
├── Ingka-Co-Worker-Profile.json              # User profile panel
├── Ingka-Co-Worker-App-Switcher.json         # App switching modal
└── Ingka-Co-Worker-Colours.json              # CWDS color palette
```

**Each JSON file contains:**

- Component anatomy & structure
- Variants & states
- Responsive specifications (S, M-XXL breakpoints)
- Accessibility requirements (WCAG AA, keyboard nav)
- Motion & interaction details
- Usage guidelines

## Available Components

### 1. Global Header

```tsx
import { GlobalHeader } from "./GlobalHeader";

<GlobalHeader
  appName="Warehouse Management"
  userName="Bill Lau"
  userRole="Reverse Flow Specialist"
  notificationCount={3}
  onMenuClick={() => {}}
  onSearchClick={() => {}}
/>;
```

### 2. Navigation Menu

```tsx
import { NavigationMenu } from "./NavigationMenu";

<NavigationMenu
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "orders", label: "Orders", href: "/orders" },
  ]}
  activeItemId="home"
/>;
```

### 3. App Switcher

```tsx
import { AppSwitcher } from "./AppSwitcher";

<AppSwitcher
  isOpen={true}
  apps={[
    { id: "wms", name: "Warehouse Management" },
    { id: "pos", name: "Point of Sale" },
  ]}
  onAppClick={(app) => console.log(app)}
/>;
```

### 4. Profile

```tsx
import { Profile } from "./Profile";

<Profile
  isOpen={true}
  userName="Bill Lau"
  userRole="Reverse Flow Specialist"
  onSignOut={() => {}}
/>;
```

### 5. Bottom Bar Navigation

```tsx
import { BottomBarNavigation } from "./BottomBarNavigation";

<BottomBarNavigation
  items={[
    { id: "home", label: "Home" },
    { id: "search", label: "Search" },
  ]}
  activeItemId="home"
/>;
```

## Installation

### Via Ingvar Kit (Recommended)

## 🚀 Installation

### Option 1: Official npm Packages (Recommended)

**Try official IKEA packages first:**

```bash
# Check if official packages exist
npm search @ingka/global-header
npm search @ingka/navigation-menu
npm search @ingka/app-switcher

# Install available packages
npm install @ingka/global-header
npm install @ingka/navigation-menu
```

### Option 2: Local Templates (Fallback)

**If npm packages aren't available, use Ingvar CLI:**

```bash
# Interactive selection (choose components you need)
ingvar cwds install

# Or install all components automatically
ingvar cwds install --auto

# List available components
ingvar cwds list
```

**What this does:**

### Manual Installation

If you need to add these templates to an existing project:

```bash
# Copy templates to your project
cp -r templates/cwds-components/* src/components/cwds/

# Install required @ingka/* dependencies
npm install @ingka/button @ingka/card @ingka/input @ingka/ssr-icon @ingka/avatar @ingka/modal
```

## Design System Compliance

These components follow **100% of the CWDS specification** extracted from Skapa:

### Color System

- **Primary**: #003E72 (Global Header - non-negotiable)
- **Secondary**: #0051BA (Links, accents)
- **States**: Danger (#D20000), Success (#007C3D), Warning (#FF8C00)

### Responsive Breakpoints

- **S** (0-599px): Bottom Bar Navigation
- **M-XXL** (600px+): Navigation Menu + Global Header

### Accessibility (WCAG AA)

- ✅ 4.5:1 contrast ratio minimum
- ✅ Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- ✅ ARIA landmarks & labels
- ✅ Focus management
- ✅ 44x44px touch targets (mobile)

### Layout & Spacing

- **8px base grid** (same as Skapa)
- Fixed header positioning
- Sticky profile card + language selector

## Design Tokens

Design tokens are extracted from the Figma file and available in:

- `styles/cwds-tokens.css` - CSS custom properties

Import the tokens in your app:

```tsx
import "./components/cwds/styles/cwds-tokens.css";
```

## Customization

These templates provide a base implementation matching the CWDS specification. You can customize them for your specific needs:

1. **Replace placeholder icons** with actual `@ingka/ssr-icon` components (note: icon paths changed in v11.1.0)
2. **Add real `@ingka/*` components** instead of styled divs/buttons
3. **Adjust colors and spacing** to match your brand requirements
4. **Add additional props** for your use cases

## Real @ingka/\* Packages

According to npm registry search, these are the actual available `@ingka/*` packages:

- `@ingka/button`
- `@ingka/card`
- `@ingka/input`
- `@ingka/modal`
- `@ingka/grid`
- `@ingka/base`
- `@ingka/avatar`
- ... (60+ UI primitives)

**Note**: There are NO `@ingka-group-digital/cwds-*` packages. CWDS is a design pattern that you implement by composing the above primitives.

## Figma Reference

View the original designs in Figma:

- [Global Header](https://www.figma.com/design/Zec1eGMCNeB0IkPMWs35qx?node-id=301-142)
- [Navigation Menu](https://www.figma.com/design/Zec1eGMCNeB0IkPMWs35qx?node-id=702-2930)
- [App Switcher](https://www.figma.com/design/Zec1eGMCNeB0IkPMWs35qx?node-id=702-2931)
- [Profile](https://www.figma.com/design/Zec1eGMCNeB0IkPMWs35qx?node-id=2941-96)
- [Bottom Bar](https://www.figma.com/design/Zec1eGMCNeB0IkPMWs35qx?node-id=2941-97)

## Documentation

For complete specifications and implementation guidance:

### JSON Specifications (Machine-Readable)

- `docs/guides/Skapa-json/subsystems/` - All 6 CWDS component specs
- `docs/guides/Skapa-json/index.json` - Master index with metadata

### Implementation Guides (Human-Readable)

- `lib/ai-instructions/frontend-agent-ingka.instructions.md` - 421 lines of CWDS documentation
- `docs/guides/CWDS_QUICK_REFERENCE.md` - Fast implementation guide
- `docs/development/CWDS_INSTRUCTIONS_UPDATE.md` - Update documentation
- `docs/guides/SKAPA_JSON_TEST_RESULTS.md` - Validation test results

### Design References

- `docs/guides/CWDS_FIGMA_SPECS.md` - Original Figma specifications (legacy)
- Skapa Design System: https://skapa.ikea.com/subsystems/ingka-co-worker

## Support

For issues with these templates or the CWDS specification extraction:

- GitHub Issues: https://github.com/leopagotto/ingvar-kit/issues
- Label: `cwds`

## License

These templates are provided as reference implementations. Adjust according to your organization's requirements and licensing.
