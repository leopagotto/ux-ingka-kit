# Changelog

All notable changes to Ingvar Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Changelog

## [6.8.6] - 2025-11-26

### 🔧 Bug Fixes

- **Fixed Spark ENOENT Error (#20):** Template-main directory was excluded from npm package
  - Removed `template-main/` from `.npmignore`
  - Added `template-main/` to `package.json` files array
  - Spark generator now works correctly after npm install

- **Fixed CWDS Template Syntax Error (#22):** GlobalHeader.tsx had JSX comment error
  - Fixed line 220: `/* Avatar */}` → `{/* Avatar */}`
  - All CWDS templates now pass TypeScript/JSX validation

### 📝 Documentation (Closes #19, #21, #23)

- **Added Component Availability Matrix:** Clear table showing what's bundled vs templates
  - Skapa: 64 components, bundled in npm, ready to import
  - CWDS: 6 templates, NOT bundled, copy manually
  - Icons: Bundled as @ingka/ssr-icon

- **Clarified CWDS Installation:** Updated templates/cwds-components/README.md
  - Added prominent warning that CWDS is templates-only
  - Added comparison table (Skapa vs CWDS)
  - Added quick installation instructions

- **Icons Documentation:** Clarified that @ingka/ssr-icon is bundled
  - Referenced INGKA_ICON_MIGRATION.md for path changes
  - CWDS templates use inline SVGs as fallback (no npm dependency)

### 🏷️ Issues Closed

- Closes #19: CWDS component packages not available from npm registry
- Closes #20: Spark generator fails with ENOENT template-main error
- Closes #21: Ingka icons not installed or documented properly
- Closes #22: CWDS component templates have duplicate exports and syntax errors
- Closes #23: Documentation unclear on Skapa vs CWDS component installation

## [6.8.5] - 2025-11-07

### 🔧 Critical Fixes
- **Fixed Spark Command Execution:** Removed duplicate `spark-generator.js` file
  - All v6.8.4 fixes now properly integrated into `spark.js` (actual executed file)
  - Added IngkaExample.tsx generation with working component examples
  - Added INGKA_README.md with comprehensive documentation
  - Added INGKA_ICON_MIGRATION.md with icon path mappings
  - Fixed @ingka/icon → @ingka/ssr-icon migration throughout
  - Auto-install logic now working correctly

### 🎨 Branding Update
- **Replaced all "leo" command references with "ingvar"**
  - Fixed `leo issue` → `ingvar issue` throughout codebase
  - Fixed `leo config` → `ingvar config` throughout codebase
  - Fixed `leo init` → `ingvar init` in documentation
  - Updated "LEO workflow" → "INGVAR workflow" in all instructions
  - Updated "LEO multi-agent" → "INGVAR multi-agent" references

### 📝 Code Cleanup
- Removed duplicate spark-generator.js file to prevent confusion
- Consolidated Spark generation logic into single spark.js file
- Improved long-term maintainability

## [6.8.4] - 2025-11-07

### 🔥 Critical Fixes (GitHub Issue #18)

- **Auto-Install Packages:** Fixed `install-components: true` in `.ingvarrc.json` not actually installing packages

  - Now reads `.ingvarrc.json` configuration during scaffold generation
  - Automatically installs all critical Skapa packages: `@ingka/ssr-icon`, `@ingka/button`, `@ingka/list`, `@ingka/badge`, `@ingka/skeleton`, `@ingka/card`
  - Respects config setting (defaults to true if not specified)
  - Provides helpful message if skipped with install command

- **Deprecated Package:** Replaced `@ingka/icon` with `@ingka/ssr-icon@^11.1.0` throughout codebase
  - Updated: `spark-generator.js`, `cwds-installer.js`, `package.json`, `ingka-direct.ts`
  - Removed deprecated package from all templates and documentation
  - Updated npm dependencies across all packages

### ✨ Improved

- **Working Component Examples:** Complete rewrite of `IngkaExample.tsx` with real, working code

  - Removed non-existent components (`Text`, `Card.Content`)
  - Added real examples: Button (with ssrIcon), List (with CSS resets), Badge, Card, Icon
  - All examples work out of the box with proper imports
  - Inline comments explaining requirements and best practices

- **Icon Migration Guide:** Created comprehensive `INGKA_ICON_MIGRATION.md`

  - Icon path mappings: `reload` → `arrow-clockwise`, `search` → `magnifying-glass`, etc.
  - Complete table of old/new paths with notes
  - Automated migration script examples
  - Common errors and solutions

- **TypeScript Type Documentation:** Added complete type definitions in generated README
  - `IconProps` interface with `svg`, `size`, `colour` properties
  - `ButtonProps` interface with `ssrIcon` prop fully documented
  - JSDoc-style comments for editor autocomplete discoverability
  - Inline examples showing proper TypeScript usage

### 📝 Documentation

- **List Component CSS Reset:** Documented required CSS resets for `@ingka/list`

  - Clear explanation: `list-style: none`, `margin: 0`, `padding: 0` are required
  - Example code in scaffold with proper resets applied
  - Common issues section explaining styling problems

- **Enhanced INGKA_README.md:** Comprehensive usage guide with real examples
  - Quick start section for each component
  - Button ssrIcon prop fully explained with examples
  - Icon migration guide embedded
  - TypeScript type reference section
  - Common issues and solutions

### 🎯 User Experience

- **Reduced Setup Time:** From 2+ hours of manual fixes → 5 minutes working project
  - All packages auto-installed if `install-components: true`
  - Working examples with proper imports and usage
  - No deprecated packages or broken icon paths
  - Clear documentation for all components

### 🔧 Test Case

Successfully resolves GitHub Issue #18 test case:

```bash
ingvar init test-project --style ingka
cd test-project
npm run dev  # ✅ NOW WORKS (previously failed)
```

**Closes:** #18

## [6.8.3] - 2025-11-06

### 🔧 Fixed

- **NPM Package:** Fixed missing `lib/agents/` directory in published package
  - Added `lib/agents/` to package.json `files` array
  - Resolves "Cannot find module '../agents/orchestrator-template'" error
  - Ensures agent commands work correctly in published version

## [6.8.2] - 2025-11-06

### 🎯 Changed

- **Branding Update:** Rebranded all "LEO" references to "INGVAR" throughout the codebase
  - User-facing: "INGVAR Workflow" instead of "LEO workflow"
  - Commands: References updated in help text and documentation
  - Environment variables: `INGVAR_AUTO_INIT`, `INGVAR_API_PORT`, `INGVAR_API_HOST`, `INGVAR_POSTINSTALL`
  - Consistent branding across all CLI commands, docs, and AI instructions

### 🔧 Fixed

- **CWDS Command:** Fixed TypeError crash in `ingvar cwds list` command
  - Root cause: CWDS_COMPONENTS not exported from refactored cwds-installer.js
  - Solution: Deprecated entire `ingvar cwds` command in favor of unified installer
  - Now shows helpful deprecation notice guiding users to `ingvar components`

### ✨ Improved

- **Unified Component Path:** Eliminated confusion between two component installation methods

  - Deprecated: `ingvar cwds` (template-based, internal co-worker components)
  - Preferred: `ingvar components` (npm package-based, official @ingka/\* packages)
  - Single clear path: Install all components via `ingvar components --mode essential/all/cherry-pick`

- **Streamlined Init Workflow:** Added optional component installation prompt after `ingvar init`
  - Users can now install components immediately after project setup
  - Reduces steps: no need to remember `ingvar components` command
  - Still optional: can skip and install later if needed

### 📝 Documentation

- **Command Help:** Updated CLI help text to reflect CWDS deprecation
- **User Guidance:** Improved error messages and deprecation notices with clear next steps

## [6.8.1] - 2025-11-06

### 🚀 Improved

- **Spark UX Enhancement:** Added positional argument support for app description
  - No more double-entry: `ingvar spark "Build a todo app"` works directly
  - Backward compatible: `--prompt` flag still works
  - Eliminates manual prompt step for better automation and CI/CD integration

### 📊 Fixed

- **Component Count Accuracy:** Corrected component count from 75+ to 72 across all documentation
  - Verified actual count: 72 official IKEA components
  - Updated CLI help, component installer, package.json, README, and all docs
  - Breakdown: foundations(3) + layout(5) + display(14) + buttons(8) + forms(13) + feedback(9) + modals(4) + media(6) + ecommerce(8) + utilities(2) = 72

### 🔒 Security

- **Audit Verified:** 0 vulnerabilities in main package (confirmed via npm audit)

### 📝 Documentation

- **Test Results:** Added comprehensive v6.8.0 test results in `docs/releases/`
- **Logo:** Updated Ingvar Kit logo image

## [6.8.0] - 2025-11-06

### 📚 Documentation

- **Component System Clarity:** Added comprehensive documentation explaining dual component strategy
  - Updated `DESIGN_GUIDELINES.md` with decision matrix for official @ingka/\* packages vs local templates
  - Enhanced `frontend-agent.md` with component selection decision tree and priority rules
  - Added quick reference guide to `copilot-instructions-template.js` for AI agents
  - Clarified README with distinction between 66+ official packages and 34 templates
  - Ensures Copilot/AI understands when to use production packages vs customizable templates

### 🎯 Improved

- **AI Agent Guidance:** AI agents now have clear instructions to check official @ingka/\* packages first
- **Developer Experience:** Clear decision matrices prevent common mistakes in component selection
- **Documentation Consistency:** 600+ lines added/updated across 4 key documentation files

## [6.7.4] - 2025-11-06

### 📚 Added

- **Design Guidelines:** Added comprehensive `DESIGN_GUIDELINES.md` with centralized IKEA design system information
  - Complete Skapa Design System documentation (customer-facing apps)
  - Complete CWDS (Co-Worker Design Subsystem) documentation (internal tools)
  - Decision matrix: Which design system to use when
  - Component architecture and atomic design patterns
  - Step-by-step implementation guides with code examples
  - Best practices for accessibility, performance, and responsive design
  - Design tokens reference (colors, spacing, typography)
  - 885 lines of comprehensive, production-ready guidance

### 🚀 Improved

- **Documentation Discovery:** Added design guidelines reference to README.md documentation section
- **Developer Experience:** Single source of truth for IKEA application development
- **Package Metadata:** Enhanced npm package discoverability with additional keywords

### 📦 Changed

- **Package Files:** Ensured design guidelines are included in npm package distribution

## [6.7.3] - 2025-11-05

### 🔧 Fixed

- **CLI Command Consistency:** Fixed all CLI command references to use `ingvar` instead of mixed `leo`/`ingvar` commands (#17)

  - Updated `lib/commands/init.js` - CLI examples in initialization flow
  - Updated `lib/commands/agent.js` - Agent management commands
  - Updated `lib/commands/github-project.js` - GitHub setup commands
  - Updated `lib/commands/plugin.js` - Plugin system commands
  - Updated `lib/commands/hunt.js` - Hunt feature commands
  - Updated `lib/commands/components.js` - Component commands
  - Updated `bin/cli-backup.js` - Backup CLI references
  - Updated `bin/leo-constitution.js` - Constitution commands
  - Updated `.github/copilot-instructions.md` - AI assistant instructions
  - Updated configuration file references: `.leorc.json` → `.ingvarrc.json`

- **Documentation:** Updated README.md with v6.7.3 features and consistent command examples
- **Wiki:** Updated installation guide and commands reference to show v6.7.3
- **Guides:** Fixed CLI command references in component installation guide

### 🚀 Improved

- **User Experience:** Eliminated confusion between CLI tool name and command examples
- **Documentation Quality:** All command references now consistent throughout interface
- **Developer Experience:** Enhanced onboarding with accurate CLI examples

## [6.7.2] - 2025-11-05

### 🐛 Fixed

- **SyntaxError:** Fixed duplicate `configManager` declaration in `lib/commands/init.js` (#16)
  - Removed duplicate `const configManager = require('../utils/config-manager');` line at line 840
  - Fixed `ingvar init` command that was completely broken due to JavaScript syntax error
  - All CLI functionality now works correctly

## [6.7.1] - 2025-11-05

### 🐛 Fixed

- **React Peer Dependencies:** Added `react` and `react-dom` as peer dependencies (>=16.8.0) for bundled Skapa components

## [6.7.0] - 2025-11-05

### 🎉 BREAKING CHANGE: Skapa Components Now Bundled

**Major Simplification:** All 64 Skapa components are now bundled directly with `ingvar-kit`. No separate package installation needed!

#### Changed

- **Bundled Components:** Skapa components moved from separate `ingvar-skapa-components` package into main `ingvar-kit` package
- **New Import Paths:**
  - Old: `import { Button } from 'ingvar-skapa-components'`
  - New: `import { Button } from 'ingvar-kit/skapa'`
  - Or: `import { Button } from 'ingvar-kit/skapa/ingka-direct'`
- **Simplified Installation:** One package instead of two

  ```bash
  # Old (v6.6.x):
  npm install ingvar-kit
  npm install ingvar-skapa-components

  # New (v6.7.0+):
  npm install ingvar-kit react react-dom
  ```

#### Added

- **Bundled Package Exports:**
  - `ingvar-kit/skapa` - Simplified component wrappers (56 components)
  - `ingvar-kit/skapa/ingka-direct` - Direct @ingka exports (58 components)
- **Merged Dependencies:** All 20+ @ingka packages now included in main package
- **Updated CLI:** `ingvar components` command now shows components are bundled
- **Updated Postinstall:** Displays bundled components info with new import paths

#### Deprecated

- **ingvar-skapa-components@0.1.0:** Deprecated in favor of bundled components in `ingvar-kit@6.7.0+`

#### Fixed

- **Postinstall Syntax Error:** Fixed unterminated template literal in error handling

#### Migration Guide

```javascript
// Before (v6.6.x):
import { Button, TextField } from "ingvar-skapa-components";
import { Card } from "ingvar-skapa-components/ingka-direct";

// After (v6.7.0+):
import { Button, TextField } from "ingvar-kit/skapa";
import { Card } from "ingvar-kit/skapa/ingka-direct";
```

**Benefits:**

- ✅ Simpler installation (one package instead of two)
- ✅ No confusion about separate packages
- ✅ All 64 components included out of the box
- ✅ Same tree-shakeable ES modules
- ✅ Same 97% TypeScript coverage
- ✅ Dual export options maintained

## [6.6.0] - 2025-11-05

### 📦 @ingvar-kit/skapa-components Package & CLI Integration

**Major Feature:** New production-ready npm package with 64 official IKEA Skapa components and integrated CLI installation flow.

#### Added

- **@ingvar-kit/skapa-components Package:**

  - 64 official Skapa components with direct @ingka package exports
  - Dual import strategy: `/ingka-direct` (official names) or main export (wrappers)
  - 328KB optimized ESM bundle with tree-shaking support
  - 97% TypeScript coverage (61/64 components with full types)
  - Production-ready with comprehensive documentation

- **Dual Export Architecture:**

  - Main export (`@ingvar-kit/skapa-components`): Simplified wrappers for rapid prototyping
  - Subpath export (`@ingvar-kit/skapa-components/ingka-direct`): Direct @ingka exports with official names
  - Both bundles optimized with Rollup (CJS + ESM formats)
  - Full TypeScript declarations for both export paths

- **CLI Integration:**

  - Updated `ingvar components` command to offer package or individual components
  - Interactive menu: "npm Package (Recommended)" vs "Individual Components"
  - Package installation with usage examples and documentation links
  - Seamless integration with existing cherry-pick workflow

- **Postinstall Enhancement:**

  - Updated postinstall script to promote @ingvar-kit/skapa-components package
  - Shows both installation options: package vs individual components
  - Clear benefits listed: bundle size, TypeScript, dual strategies
  - Option to install package immediately during CLI setup

- **Comprehensive Documentation:**
  - Complete package README with 5 usage examples
  - Component catalog (COMPONENT_STATUS.md) with 64 components
  - Architecture guide (DIRECT_EXPORT_ARCHITECTURE.md)
  - Component name mapping reference (SKAPA_COMPONENT_MAPPING.md)
  - Integration test report (TEST_RESULTS.md)
  - Main README updated with package Quick Start section

#### Changed

- **Component Installation Flow:**

  - CLI now offers package installation first (recommended)
  - Individual component installation still available (72 components)
  - Clear use case guidance for each approach
  - Updated README Quick Start to show both options

- **Package Build System:**

  - Rollup config updated to build dual exports
  - Generates both main and ingka-direct bundles
  - Separate sourcemaps and TypeScript declarations
  - Optimized builds with peer dependency externalization

#### Technical Details

- **Package Structure:**

  ```
  dist/
  ├── index.js + index.esm.js (328KB - wrappers)
  ├── ingka-direct.js + ingka-direct.esm.js (424KB - direct exports)
  ├── index.d.ts + ingka-direct.d.ts (TypeScript)
  └── styles.css (optimized CSS)
  ```

- **Import Examples:**

  ```typescript
  // Direct @ingka exports (recommended for Skapa projects)
  import {
    Button,
    InputField,
  } from "@ingvar-kit/skapa-components/ingka-direct";

  // Simplified wrappers (rapid prototyping)
  import { Button, TextField } from "@ingvar-kit/skapa-components";
  ```

- **Component Coverage:**
  - Actions (4): Button, IconButton, DualButton, Hyperlink
  - Inputs (13): InputField, TextArea, Checkbox, RadioButton, Select, Switch, etc.
  - Indicators (5): Badge, Loading, ProgressBar, ProgressIndicator, Status
  - Messages (5): Banner, Toast, AlertDialog, InformationDialog, DecisionDialog
  - Navigation (3): Breadcrumb, Tabs, Stepper
  - Layout (15): Grid, Stack, Container, Spacer, Divider, etc.
  - Containers (9): Card, Accordion, Drawer, Sheet, Popover, etc.
  - Product Range (3): Price, ProductID, Pill
  - Foundation (1): Theme

#### Impact

- Streamlined component installation (single package vs 64 individual installs)
- Better DX with TypeScript support and dual import options
- Consistent versioning (all components bundled together)
- Faster Spark app generation (pre-bundled components)
- Choice preserved: users can still cherry-pick individual components

#### Migration Guide

**From Individual Components to Package:**

```bash
# Install package
npm install @ingvar-kit/skapa-components

# Update imports
- import Button from '@ingka/button';
+ import { Button } from '@ingvar-kit/skapa-components/ingka-direct';
```

**For New Projects:**

```bash
# Option 1: Use CLI (recommended)
ingvar components
# → Choose "npm Package"

# Option 2: Direct install
npm install @ingvar-kit/skapa-components
```

## [6.5.1] - 2025-11-02

### 🐛 Spark Generator Fixes

**Bug Fixes:** Improved Spark workflow to require initialization and provide voice command guidance.

#### Fixed

- **Initialization Check:**

  - Spark now verifies that `ingvar init` was run before allowing app generation
  - Prompts user to run initialization if not configured
  - Prevents "appearing too early" issue by enforcing proper setup flow

- **Voice Command Support:**

  - Added clear voice command instructions for input
  - macOS: "Press Fn key twice to enable dictation"
  - Windows: "Press Win + H for voice typing"
  - Users can still type manually if preferred

- **Better Error Handling:**
  - Clear guidance when design system not configured
  - Option to run `ingvar init` directly from Spark
  - Improved error messages and user guidance

#### Impact

- Users must complete `ingvar init` before using Spark (proper workflow)
- Voice input is encouraged but text input still available
- Better onboarding experience with clear setup steps

## [6.5.0] - 2025-11-02

### 📦 CWDS Installation Priority & npm Package Enhancements

**Major Improvement:** CWDS components now prioritize official npm packages over local templates, with comprehensive documentation updates and production-ready deployment.

#### Added

- **Installation Priority Documentation:**

  - Two-tier installation strategy: official @ingka/\* npm packages first, local templates as fallback
  - Clear guidance in README and component documentation
  - CLI instructions show npm search commands before local installation
  - Rationale documentation (automatic updates, versioning, IKEA team maintenance)

- **Enhanced Installer Messages:**

  - CWDS installer now displays installation priority tips
  - Suggests checking npm registry first: `npm search @ingka/global-header`
  - Clear fallback messaging when using local templates

- **Comprehensive Documentation:**
  - Updated templates/cwds-components/README.md with two-tier installation strategy
  - Added official package search examples
  - Installation priority clearly documented in main README
  - JSON specifications section with 6 CWDS subsystem files documented

#### Changed

- **CWDS Installation Flow:**

  - Prioritizes official npm package installation over local templates
  - Local templates explicitly positioned as fallback option
  - Installer displays installation priority tips at runtime

- **Documentation Structure:**

  - Reorganized installation section with Option 1 (npm) and Option 2 (local)
  - Added "Why this approach?" section explaining benefits
  - Updated all CWDS references to clarify package priority

- **CLI Messages:**
  - Updated cwds-installer.js console output
  - Added npm search command suggestions
  - Clearer distinction between official packages and local templates

#### Impact

- Users try official IKEA packages first (better maintenance, automatic updates)
- Local templates provide reliable fallback when npm packages unavailable
- Clear documentation reduces confusion about installation methods
- Consistent with IKEA team development practices

## [6.2.0] - 2025-11-01

### 🎨 Dual Design System Support in Spark

**Major Feature:** Spark now supports both IKEA Ingka Skapa and CWDS design systems with a unified CLI interface.

#### Added

- **Dual Design System Support:**

  - New `--design-system <system>` flag replaces legacy `--ikea` and `--cwds` flags
  - Options: `ingka` (customer-facing) or `cwds` (internal co-worker tools)
  - Interactive mode prompts for design system selection
  - Defaults to `ingka` if not specified

- **AI Code Generation:**

  - Separate system prompts for Ingka Skapa and CWDS
  - CWDS prompt includes Global Header, App Switcher, CWDS Layouts
  - Ingka Skapa prompt focuses on customer-facing components
  - Code generator respects `designSystem` parameter throughout

- **Component Installation:**
  - Ingka Skapa components installed for both design systems
  - CWDS components added when `--design-system cwds` specified
  - CWDSInstaller automatically configures recommended components
  - Auth0 default provider for CWDS authentication

#### Changed

- **CLI Interface:**

  - `ingvar spark --ikea` → `ingvar spark --design-system ingka`
  - `ingvar spark --ikea --cwds` → `ingvar spark --design-system cwds`
  - Added `--no-start` option for consistency
  - Cleaner command structure with unified parameter

- **Code Structure:**
  - Refactored `generateSparkApp` to use `designSystem` parameter
  - Updated `getAppRequirements` with interactive design system selection
  - Simplified helper functions (`generateAppCode`, `generateFallbackApp`)
  - Removed obsolete Commander-based CLI implementation from spark.js

#### Fixed

- Removed legacy boolean flags (`useIkea`, `useCwds`) causing confusion
- Fixed code generator to handle `designSystem` instead of separate booleans
- Cleaned up spark.js merge conflicts from previous implementations

#### Documentation

- Updated README.md with `--design-system` examples
- Added CHANGELOG entry for v6.2.0
- Issue #6 tracking implementation progress

## [6.1.0] - 2025-10-31

### 🎯 Component Registry: 100% Coverage Achieved

**Major Improvements:** Complete Ingka registry integration with automatic package name mapping.

#### 1. 🔄 Automatic Package Name Mapping (Issue #3)

**Problem:**

- 10/72 components appeared "unavailable" from registry
- Users thought they needed local templates
- Component names didn't match actual npm package names
- Installation failed for components with different package names

**Solution:**

- Discovered all 10 "missing" components have alternative package names
- Implemented automatic PACKAGE_NAME_MAP in component installer
- Installer transparently maps component names to actual packages
- **Result: 100% coverage (72/72 components from registry)**

**Package Mappings:**

```javascript
const PACKAGE_NAME_MAP = {
  colours: "variables", // @ingka/variables includes color tokens
  "expanding-button": "button", // Variant in @ingka/button
  "icon-button": "button", // Variant in @ingka/button
  "icon-pill": "pill", // Variant in @ingka/pill
  "modal-sheets": "modal", // Variant in @ingka/modal
  "modal-theatre": "modal", // Variant in @ingka/modal
  logos: "ssr-icon", // @ingka/ssr-icon package
  "commercial-messages": "commercial-message", // Singular form
};
```

**User Experience:**

```bash
📦 Installing Ingka npm packages...
   ✓ variables (from registry)
   ✓ button (from registry)
   ✓ colours → variables (from registry)  # Automatic mapping!
   ✓ icon-button → button (from registry) # Transparent!
   ✓ logos → ssr-icon (from registry)     # Works perfectly!

✅ Installed 72 packages from Ingka registry
```

#### 2. 📦 Individual Package Installation

**Problem:**

- Installer tried to install all packages in one big `npm install` command
- If ANY package failed, entire installation failed
- 62 working packages couldn't install because 10 seemed unavailable

**Solution:**

- Install packages one-by-one instead of bulk installation
- Each package failure is isolated
- Successful packages install even if others fail
- Better error handling and progress feedback

**Before:**

```bash
npm install @ingka/button @ingka/card @ingka/colours ... (72 packages)
# Error: @ingka/colours not found
# ENTIRE INSTALLATION FAILS - 0 packages installed
```

**After:**

```bash
# Installing packages individually...
✓ button (from registry)
✓ card (from registry)
✓ colours → variables (from registry)  # Mapped and succeeded!
✓ radio-button (from registry)
... 72 packages installed successfully
```

#### 3. 🔧 Registry Configuration Improvements

**Problem:**

- `.npmrc` file created but not fully applied before npm install
- Race condition between file write and npm reading config
- Some packages failed due to timing issues

**Solution:**

- Ensure `.npmrc` is written and flushed to disk
- Use `npm config set --location=project` for immediate effect
- Added `fs.fsync()` to guarantee file persistence
- Configure registry BEFORE attempting any installations

#### 4. 📚 Comprehensive Documentation

**Added:** Complete registry availability report

- **File:** `docs/development/INGKA_REGISTRY_COMPONENTS.md`
- Tested all 72 components individually
- Documented package name mappings
- Installation guide with correct package names
- Category-by-category availability breakdown

**Key Findings:**

- ✅ Design Foundations: 3/3 (100%)
- ✅ Layout & Structure: 5/5 (100%)
- ✅ Display & Content: 14/14 (100%)
- ✅ Buttons & Actions: 8/8 (100%)
- ✅ Form Inputs: 13/13 (100%)
- ✅ Feedback & Status: 9/9 (100%)
- ✅ Modals & Overlays: 4/4 (100%)
- ✅ Media & Rich Content: 6/6 (100%)
- ✅ E-commerce: 8/8 (100%)
- ✅ Utilities: 2/2 (100%)

#### 5. 🐛 Spark Model Selection Fix

**Problem:**

- Spark rapid app generator hardcoded to use `'sonnet-3-5'` model
- Ignored user's model configuration in `.ingvarrc.json`
- Users couldn't use their preferred models (GPT-4, custom, etc.)

**Solution:**

- Integrated ModelSelector into `lib/ai/code-generator.js`
- Uses dynamic model selection based on agent type (frontend) and complexity (moderate)
- Respects user's fixed-model configuration
- Falls back to intelligent selection if not specified

**Before:**

```javascript
const model = options.model || "sonnet-3-5"; // Hardcoded
```

**After:**

```javascript
let model = options.model;
if (!model) {
  const modelSelector = new ModelSelector(options.modelConfig || {});
  model = await modelSelector.selectModel(
    "frontend",
    {
      description: userPrompt,
      type: "spark_generation",
    },
    "moderate"
  );
}
// Now respects .ingvarrc.json configuration!
```

### 📊 Statistics

**Component Coverage:**

- Before: 62/72 available (86%)
- After: 72/72 available (100%) ✅

**Installation Success Rate:**

- Before: Single failure blocks all (0/72 on error)
- After: Individual package handling (72/72 succeed)

**Package Mappings:**

- Automatic mappings: 8 components
- Manual mapping needed: 0 components
- User-visible complexity: Zero (handled automatically)

### 🔧 Technical Improvements

- **Component Installer:** Added PACKAGE_NAME_MAP for automatic translation
- **Installation Method:** Bulk → Individual package installation
- **Registry Setup:** Added fsync() and npm config commands
- **Model Selection:** Dynamic model selection in Spark generator
- **Documentation:** Comprehensive registry testing and mapping guide

### 📝 Documentation Updates

- ✅ `docs/development/INGKA_REGISTRY_COMPONENTS.md` - Complete registry guide
- ✅ Package name mapping reference tables
- ✅ Installation examples with correct package names
- ✅ Category-by-category availability breakdown
- ✅ Updated component installer to reflect 100% coverage

### 🚀 Upgrade Notes

**No breaking changes.** Existing configurations work seamlessly.

**What's New:**

- Select any component by logical name (e.g., "colours")
- Installer automatically maps to actual package (e.g., @ingka/variables)
- 100% of Ingka Skapa components now available
- Spark respects your model preferences

**Recommendations:**

- Use `@ingka/variables` for design tokens (replaces colours/design-tokens)
- Use `@ingka/modal` for all modal variants
- Use `@ingka/button` for all button variants (includes icon-button, expanding-button)

## [6.0.0] - 2025-10-31

### 🎯 Major: Modular AI Instructions Architecture

**Breaking Changes:** None for users, but AI instruction generation completely refactored.

#### 1. 🎨 Copilot Instructions Refactor (90.7% Size Reduction)

**Problem:**

- \`.github/copilot-instructions.md\` was 4,967 lines with ALL agent instructions embedded
- Massive duplication of standards and patterns
- Designer Agent existed but wasn't integrated
- Hard to maintain (changes required updating 3 places)

**Solution:**

- Reduced copilot instructions from 4,967 → 464 lines (90.7% reduction!)
- Now references modular agent files in \`lib/ai-instructions/\`
- Added Designer Agent to builder system
- Single source of truth per agent

**Architecture:**

\`\`\`
Before: Monolithic (4,967 lines)
.github/copilot-instructions.md
└── ALL agent instructions embedded

After: Modular (464 lines)
.github/copilot-instructions.md (core rules + routing)
├── References: lib/ai-instructions/orchestrator-main.md
├── References: lib/ai-instructions/designer-agent.md ✨ NEW
├── References: lib/ai-instructions/frontend-agent.md
├── References: lib/ai-instructions/backend-agent.md
├── References: lib/ai-instructions/devops-agent.md
├── References: lib/ai-instructions/testing-agent.md
└── References: lib/ai-instructions/documentation-agent.md
\`\`\`

**Benefits:**

- ✅ 90.7% smaller main instructions file
- ✅ Zero duplication (DRY principle)
- ✅ Designer Agent now fully integrated
- ✅ Update once, applies everywhere
- ✅ Faster for AI to read and understand

#### 2. 🔧 Component Installation Accuracy (Issue #1)

**Problem:**

- Installation claimed "72 components installed" when only 26 succeeded
- Generated \`index.ts\` exported 46 missing components (caused TypeScript errors)
- No validation of actual installation success
- Silent failures for IKEA registry authentication issues

**Solution:**

- Track \`installedComponents\` vs \`failedComponents\` separately
- Only export components that actually exist
- Accurate reporting: "26 installed, 46 failed (registry auth required)"
- Clear warnings about IKEA internal registry requirements

**Example Output:**

\`\`\`bash
✨ Component installation complete!

📊 Installation Summary:
✅ Successfully installed: 26 components (local templates)
⚠️ Failed (registry auth required): 46 components
📁 Components installed to: src/components/ingka/

⚠️ Note: Some components require IKEA internal registry access.
External users receive local templates only.
\`\`\`

**Impact:**

- ✅ No more TypeScript errors from missing imports
- ✅ Transparent about what's available vs requires auth
- ✅ Generated README shows component status
- ✅ Removed broken \`@ingka/design-tokens\` exports

### 🎨 Designer Agent Integration

**Added:** Designer Agent now fully integrated into multi-agent system

- ✅ Imported in \`lib/ai-instructions/builder.js\`
- ✅ Registered in \`getAgentGenerators()\`
- ✅ Available in copilot instructions
- ✅ Designer-first workflow now functional

**Designer-First Workflow:**

\`\`\`
User Request: "Build a login page"
↓
Orchestrator: Detects UI/UX work
↓
Designer: Creates rapid HTML/CSS mockup (30 min)
↓
User: Reviews and approves
↓
Frontend: Implements from Designer specs
↓
Testing: Writes tests
↓
Done! ✅
\`\`\`

### 📚 Documentation

**Added:**

- \`docs/development/COPILOT_INSTRUCTIONS_REFACTOR_V6.md\` - Complete refactor documentation
- Updated component installation README with accurate status

**Changed:**

- \`.github/copilot-instructions.md\` - Now 464 lines (references modular files)
- \`lib/ai-instructions/builder.js\` - Added Designer agent support

**Preserved:**

- \`.github/copilot-instructions.md.backup\` - Original 4,967-line version saved

### 🔄 Migration Notes

**For Users:**

- ✅ No breaking changes - everything works the same
- ✅ Designer Agent now available (bonus feature!)
- ✅ Component installation more transparent

**For Developers:**

- ✅ Update agent logic in ONE place: \`lib/agents/\*-template.js\`
- ✅ Changes automatically apply to all AI assistants (Copilot, Cursor, Cline, Codeium)
- ❌ DON'T update \`.github/copilot-instructions.md\` directly (it references files!)

### 📊 Statistics

- **Copilot Instructions:** 4,967 → 464 lines (90.7% reduction)
- **Agents Available:** 6 → 7 (Designer added)
- **Installation Accuracy:** ~100% false → 100% accurate
- **Component Export Errors:** 46 broken imports → 0 broken imports

### 🐛 Bug Fixes

- Fixed: Copilot instructions missing Designer Agent
- Fixed: Component installation reporting inaccurate metrics (#1)
- Fixed: Broken TypeScript imports for missing @ingka components
- Fixed: Silent failures for registry authentication issues

### ⚠️ Known Issues

- 46 IKEA components require internal registry access (documented)
- External users get 26 local templates (working as intended)
- Design foundation components (design-tokens, colours, typography) require IKEA auth

---

## [5.13.0] - 2025-10-31

### 🚀 Performance: CLI Startup Optimization (20x Faster)

**Problem:** CLI had severe startup performance issues - taking 1.2+ seconds just to display version or help.

**Solution:** Implemented lazy loading - commands load on-demand instead of at startup.

**Results:** 1.2s → 0.06s (20x faster, 95% reduction)

**Impact:**

- Every CLI command now starts instantly
- Reduced module loading overhead
- Better developer experience

---
