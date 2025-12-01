# ⚠️ DEPRECATED: @ux-ingka-kit/skapa-components

**This package has been deprecated as of November 5, 2025.**

## 🎉 Components Are Now Bundled with ux-ingka-kit!

Skapa components are now bundled directly with `ux-ingka-kit@6.7.1+`. No separate package installation needed!

---

## ⚡ Quick Migration

### Old Way (v6.6.x)

```bash
npm install ux-ingka-kit
npm install ux-ingka-skapa-components
```

```tsx
import { Button } from "ux-ingka-skapa-components";
import { Card } from "ux-ingka-skapa-components/ingka-direct";
```

### New Way (v6.7.1+)

```bash
npm install ux-ingka-kit react react-dom
```

```tsx
// Option 1: Simplified wrappers
import { Button, TextField } from "ux-ingka-kit/skapa";

// Option 2: Direct @ingka exports (Recommended)
import { Button, Card } from "ux-ingka-kit/skapa/ingka-direct";
```

---

## 📚 Full Documentation Below (For Reference)

The content below is preserved for historical reference. **Please use the bundled version in `ux-ingka-kit@6.7.1+` instead.**

---

# @ux-ingka-kit/skapa-components (DEPRECATED)

Production-ready React components implementing the IKEA Skapa Design System with **direct @ingka package integration**.

## 🎨 Features

- ✅ **64+ Components** - Complete UI component library with official Skapa components
- ✅ **Direct @ingka Exports** - Use official Skapa components with exact names (NEW!)
- ✅ **TypeScript** - Full type safety and IntelliSense (97% coverage)
- ✅ **Dual Import Options** - Choose between direct @ingka or simplified wrappers
- ✅ **Accessible** - WCAG 2.1 AA compliant
- ✅ **Tree-shakeable** - Import only what you need (328KB optimized bundle)
- ✅ **Design Tokens** - Official IKEA design system tokens
- ✅ **Production Ready** - Tested and verified

## 📦 Installation

```bash
npm install @ux-ingka-kit/skapa-components
```

**Peer dependencies:**

```bash
npm install react react-dom
```

## 🚀 Quick Start

### Option 1: Direct @ingka Exports (Recommended for Skapa Projects)

Use official Skapa component names for maximum compatibility:

```tsx
import {
  Button,
  Card,
  InputField,
  Switch,
} from "@ux-ingka-kit/skapa-components/ingka-direct";

function App() {
  const [checked, setChecked] = useState(false);

  return (
    <Card>
      <h1>Welcome to Skapa</h1>
      <InputField label="Email" type="email" placeholder="Enter your email" />
      <Switch
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        label="Subscribe to newsletter"
      />
      <Button variant="primary" size="medium">
        Add to cart
      </Button>
    </Card>
  );
}
```

### Option 2: Simplified Wrappers (Rapid Prototyping)

Use simplified component names with easier APIs:

```tsx
import { Button, TextField, Toggle } from "@ux-ingka-kit/skapa-components";

function App() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      <TextField
        label="Email"
        value={email}
        onChange={setEmail} // Direct value setter, not event
      />
      <Toggle
        checked={subscribed}
        onChange={setSubscribed} // Simplified API
      />
      <Button variant="primary">Submit</Button>
    </>
  );
}
```

### Component Name Mapping

| Wrapper Name     | Official Skapa Name | Package               |
| ---------------- | ------------------- | --------------------- |
| `TextField`      | `InputField`        | @ingka/input-field    |
| `Toggle`         | `Switch`            | @ingka/switch         |
| `Radio`          | `RadioButton`       | @ingka/radio-button   |
| `Alert`          | `InlineMessage`     | @ingka/inline-message |
| _(others match)_ | _(same name)_       | _(same name)_         |

## 📚 Components

> **NEW:** All components are now available with official Skapa names via direct @ingka exports!
> Import from `@ux-ingka-kit/skapa-components/ingka-direct` for maximum compatibility.

### 🎯 Direct @ingka Exports (64 Components)

#### Actions (4) ✅

- **Button** - Primary, secondary, tertiary variants
- **DualButton** - Combined button pairs
- **JumboButton** - Large prominent buttons
- **Pill** - Filter/tag buttons

#### Inputs & Controls (13) ✅

- **Checkbox** - Single or grouped checkboxes
- **Choice** - Choice selection
- **Combobox** - Searchable dropdown
- **InputField** - Text input (wrapper: `TextField`)
- **QuantityStepper** - Numeric stepper
- **RadioButton** - Radio groups (wrapper: `Radio`)
- **Search** - Search input
- **SegmentedControl** - Segmented picker
- **Select** - Dropdown selection
- **Slider** - Range input
- **Switch** - On/off toggle (wrapper: `Toggle`)
- **TextArea** - Multi-line text
- **Toggle** - Toggle button group

#### Indicators (5) ✅

- **Badge** - Status indicators
- **Loading** - Loading spinner
- **ProgressIndicator** - Progress bar
- **Skeleton** - Loading placeholders
- **Status** - Status indicators

#### Messages (5) ✅

- **Banner** - Persistent alerts
- **HelperText** - Helper text
- **InlineMessage** - Inline alerts (wrapper: `Alert`)
- **Modal** - Overlays (Sheet, Theatre, Prompt)
- **Toast** - Notifications

#### Navigation (3) ✅

- **Breadcrumb** - Hierarchical navigation
- **Hyperlink** - Text links
- **Tag** - Tags

#### Layout (15) ✅

- **Accordion** - Collapsible sections
- **Avatar** - Profile images
- **Card** - Content containers
- **CompactCard** - Compact variant
- **Image** - Optimized images
- **List** - Lists
- **MemberCard** - Member profiles
- **Rating** - Star ratings
- **ShoppableImage** - Product images
- **SimpleVideo** - Video player
- **Table** - Data tables
- **Tabs** - Content switching
- **Teaser** - Teaser content
- **Text** - Text display
- **TextOverlayCard** - Cards with overlay

#### Containers (9) ✅

- **AspectRatioBox** - Aspect ratio container
- **Carousel** - Image carousel
- **EndorsementLabel** - Endorsement badges
- **Expander** - Expandable sections
- **ListBox** - List box selection
- **ListView** - List view
- **PaymentLogo** - Payment logos
- **SkipContent** - Skip navigation
- **Tooltip** - Contextual hints

#### Product Range (3) ✅

- **Price** - Price display
- **PriceModule** - Advanced pricing
- **ProductIdentifier** - Product IDs

#### Foundation (1) ✅

- **Icon** - SVG icons

### 🔧 Custom Wrappers (via main export)

Additional simplified components from `@ux-ingka-kit/skapa-components`:

- **IconButton** - Icon-only button
- **DatePicker** - Calendar picker
- **NumberField** - Numeric input
- **Divider** - Section separators
- **Header**, **Footer** - Page layout
- **Pagination** - Page navigation
- **Menu**, **Drawer** - Navigation patterns

## 💡 Usage Examples

### Form with Validation

```tsx
import {
  Button,
  InputField,
  TextArea,
  Checkbox,
  Banner,
} from "@ux-ingka-kit/skapa-components/ingka-direct";

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    terms: false,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.terms) {
      setError("Please accept the terms and conditions");
      return;
    }
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Banner variant="error" text={error} dismissible />}

      <InputField
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <InputField
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <TextArea
        label="Message"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={5}
        required
      />

      <Checkbox
        label="I accept the terms and conditions"
        checked={form.terms}
        onChange={(e) => setForm({ ...form, terms: e.target.checked })}
      />

      <Button variant="primary" type="submit">
        Send Message
      </Button>
    </form>
  );
}
```

### Product Card Layout

```tsx
import {
  Card,
  Image,
  Badge,
  Price,
  Rating,
  Button,
  Pill,
} from "@ux-ingka-kit/skapa-components/ingka-direct";

function ProductCard({ product }) {
  return (
    <Card>
      <Image src={product.image} alt={product.name} aspectRatio="1:1" />

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {product.isNew && <Badge variant="success">New</Badge>}
        </div>

        <Rating value={product.rating} max={5} />

        <Price value={product.price} currency="USD" />

        <div className="flex gap-2">
          {product.tags.map((tag) => (
            <Pill key={tag} size="small">
              {tag}
            </Pill>
          ))}
        </div>

        <Button variant="primary" fullWidth>
          Add to cart
        </Button>
      </div>
    </Card>
  );
}
```

### Dashboard with Tabs

```tsx
import {
  Tabs,
  Card,
  Table,
  ProgressIndicator,
  Status,
  Avatar,
} from "@ux-ingka-kit/skapa-components/ingka-direct";

function Dashboard() {
  return (
    <div>
      <Tabs
        tabs={[
          {
            label: "Overview",
            content: (
              <Card>
                <h2>Project Progress</h2>
                <ProgressIndicator value={75} max={100} />
                <p>75% Complete</p>
              </Card>
            ),
          },
          {
            label: "Team",
            content: (
              <Table
                columns={["Name", "Role", "Status"]}
                data={[
                  [
                    <Avatar src="/user1.jpg" alt="User 1" />,
                    "Designer",
                    <Status variant="success">Active</Status>,
                  ],
                  // More rows...
                ]}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
```

### Interactive Modal

```tsx
import {
  Button,
  Modal,
  InputField,
  Toast,
} from "@ux-ingka-kit/skapa-components/ingka-direct";

function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [email, setEmail] = useState("");

  const handleSave = () => {
    setIsOpen(false);
    setShowToast(true);
    // Save logic
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Settings</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Update Email"
      >
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      {showToast && (
        <Toast
          text="Settings saved successfully!"
          isOpen={showToast}
          onCloseRequest={() => setShowToast(false)}
        />
      )}
    </>
  );
}
```

### Responsive Navigation

```tsx
import {
  Breadcrumb,
  Tab,
  Hyperlink,
  Drawer,
  Button,
} from "@ux-ingka-kit/skapa-components/ingka-direct";

function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Details", href: "/products/123" },
        ]}
      />

      {/* Mobile Menu */}
      <Button onClick={() => setDrawerOpen(true)}>Menu</Button>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="left"
      >
        <nav className="space-y-4">
          <Hyperlink href="/">Home</Hyperlink>
          <Hyperlink href="/products">Products</Hyperlink>
          <Hyperlink href="/about">About</Hyperlink>
        </nav>
      </Drawer>
    </nav>
  );
}
```

## 🎨 Design Tokens

```css
/* Automatically included when you import components */
import '@ux-ingka-kit/skapa-components/dist/styles.css';
```

**Available tokens:**

- Colors: `--color-ikea-blue`, `--color-neutral-*`, semantic colors
- Spacing: `--spacing-1` through `--spacing-32` (4px base unit)
- Typography: `--font-size-*`, `--font-weight-*`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Shadows: `--shadow-1` through `--shadow-5`
- Motion: `--duration-fast`, `--duration-normal`, etc.

## 🌙 Dark Mode

```tsx
// Toggle dark mode by setting data-theme attribute
document.documentElement.setAttribute("data-theme", "dark");
```

All components automatically adapt to dark mode.

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- Keyboard navigation support
- Screen reader optimized
- Focus management
- ARIA attributes
- Color contrast compliant
- Reduced motion support

## 📖 Documentation

**Component References:**

- [COMPONENT_STATUS.md](./COMPONENT_STATUS.md) - Complete list of 64 available components
- [DIRECT_EXPORT_ARCHITECTURE.md](./DIRECT_EXPORT_ARCHITECTURE.md) - Architecture guide
- [SKAPA_COMPONENT_MAPPING.md](./SKAPA_COMPONENT_MAPPING.md) - Component mapping reference
- [TEST_RESULTS.md](./TEST_RESULTS.md) - Integration test results

**Design System Documentation:**

- [Skapa Design System Guide](../../docs/ai-agents/skapa-design-system/)
- [Design Patterns](../../docs/ai-agents/skapa-design-system/09-DESIGN-PATTERNS.md)
- [Foundations](../../docs/ai-agents/skapa-design-system/10-FOUNDATIONS-EXTENDED.md)

## 📊 Package Stats

- **Total Components:** 64 (from @ingka packages) + 7 custom wrappers
- **Bundle Size:** 328KB (optimized ESM)
- **TypeScript Coverage:** 97% (61/64 with full types)
- **@ingka Packages:** 66 installed
- **Build Time:** ~3s
- **Tree-shakeable:** Yes

## 🏗️ Architecture

This package provides **two import paths**:

### 1. Direct @ingka Exports (`/ingka-direct`)

- **Source:** `src/ingka-direct.ts`
- **Purpose:** Direct re-exports of official @ingka packages
- **Naming:** Official Skapa component names
- **Use Case:** Maximum Skapa compatibility, migrating from Skapa

### 2. Custom Wrappers (main export)

- **Source:** `src/index.ts`
- **Purpose:** Simplified APIs around @ingka components
- **Naming:** Friendly wrapper names (TextField, Toggle, etc.)
- **Use Case:** Rapid prototyping, simpler APIs

**Both approaches are supported and maintained.**

## 🤖 Copilot Integration

This package is designed to work seamlessly with GitHub Copilot and AI assistants:

- Auto-suggest appropriate components based on context
- Complete component props with TypeScript IntelliSense
- Generate pattern implementations from the Skapa design system
- Follow official IKEA design guidelines

**For AI Assistants:** See `.github/copilot-instructions.md` for integration guidelines.

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/leopagotto/ux-ingka-kit.git
cd ingvar-kit/packages/skapa-components

# Install dependencies
npm install

# Build the package
npm run build

# Verify build
node verify-build.mjs

# Run tests
npm test
```

## 🔄 Migration Guide

### From Skapa (@ingka packages)

If you're migrating from direct @ingka package usage:

```tsx
// Before (direct @ingka)
import Button from "@ingka/button";
import InputField from "@ingka/input-field";
import Switch from "@ingka/switch";

// After (ux-ingka-kit/skapa-components)
import {
  Button,
  InputField,
  Switch,
} from "@ux-ingka-kit/skapa-components/ingka-direct";
```

**Benefits:**

- ✅ Single package installation (66 @ingka packages → 1 install)
- ✅ Consistent versioning
- ✅ Tree-shaking enabled
- ✅ TypeScript types included

### From Other UI Libraries

If migrating from Radix, shadcn/ui, or similar:

```tsx
// Before
import { Button } from "@radix-ui/react-button";

// After
import { Button } from "@ux-ingka-kit/skapa-components/ingka-direct";
// or simplified wrapper:
import { Button } from "@ux-ingka-kit/skapa-components";
```

## 📝 Contributing

We welcome contributions! Please see:

- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines
- [GitHub Issues](https://github.com/leopagotto/ux-ingka-kit/issues) - Report bugs or request features

## 📄 License

MIT © UX Ingka Kit Contributors

## 🔗 Links

- **GitHub:** [leopagotto/ux-ingka-kit](https://github.com/leopagotto/ux-ingka-kit)
- **Issues:** [Report bugs or request features](https://github.com/leopagotto/ux-ingka-kit/issues)
- **IKEA Skapa:** [Official Design System](https://skapa.ikea.net)
- **NPM:** [@ux-ingka-kit/skapa-components](https://www.npmjs.com/package/@ux-ingka-kit/skapa-components)

## 🙏 Acknowledgments

- **IKEA Skapa Team** - For the incredible design system
- **@ingka Package Maintainers** - For the official React components
- **UX Ingka Kit Contributors** - For building this integration

---

**Built with ❤️ using IKEA's Skapa Design System**

_Version 0.1.0 - November 2025_
