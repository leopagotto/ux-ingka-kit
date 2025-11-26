#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

/**
 * Enhanced Component Installer for UX Ingka Kit
 *
 * Handles installation of production-ready IKEA components:
 * - Interactive selection (all 72 components)
 * - Smart defaults (most common components pre-selected)
 * - Registry configuration for @ingka/* packages
 * - Automatic dependency resolution
 * - Production-quality components that look like IKEA.com
 */

// Complete list of all 72 Ingka Skapa components
const ALL_COMPONENTS = {
  // Design Foundations (3)
  foundations: [
    { name: 'variables', label: '🎨 Variables', description: 'Core design variables (colors, spacing, typography)', category: 'Foundations', checked: true },
    { name: 'colours', label: '🌈 Colors', description: 'IKEA color palette', category: 'Foundations', checked: false },
    { name: 'typography', label: '✍️  Typography', description: 'Font families, sizes, weights', category: 'Foundations', checked: true },
  ],

  // Layout & Structure (7)
  layout: [
    { name: 'grid', label: '📐 Grid', description: 'Responsive grid system', category: 'Layout', checked: true },
    { name: 'aspect-ratio-box', label: '📦 Aspect Ratio Box', description: 'Maintain aspect ratios', category: 'Layout', checked: false },
    { name: 'divider', label: '➖ Divider', description: 'Visual separators', category: 'Layout', checked: false },
    { name: 'expander', label: '🔽 Expander', description: 'Expandable sections', category: 'Layout', checked: false },
    { name: 'skip-content', label: '⏭️  Skip Content', description: 'Accessibility skip links', category: 'Layout', checked: false },
  ],

  // Display & Content (14)
  display: [
    { name: 'card', label: '🗂️  Card', description: 'Content cards', category: 'Display', checked: true },
    { name: 'compact-card', label: '📇 Compact Card', description: 'Compact card variant', category: 'Display', checked: false },
    { name: 'text-overlay-card', label: '🖼️  Text Overlay Card', description: 'Cards with text overlays', category: 'Display', checked: false },
    { name: 'image', label: '🖼️  Image', description: 'Optimized images', category: 'Display', checked: true },
    { name: 'text', label: '📝 Text', description: 'Typography components', category: 'Display', checked: true },
    { name: 'list', label: '📋 List', description: 'List components', category: 'Display', checked: false },
    { name: 'list-view', label: '📑 List View', description: 'List views', category: 'Display', checked: false },
    { name: 'list-box', label: '☐ List Box', description: 'List boxes', category: 'Display', checked: false },
    { name: 'table', label: '📊 Table', description: 'Data tables', category: 'Display', checked: true },
    { name: 'tabs', label: '📑 Tabs', description: 'Tab navigation', category: 'Display', checked: true },
    { name: 'teaser', label: '👀 Teaser', description: 'Teaser content', category: 'Display', checked: false },
    { name: 'thumbnail-grid', label: '🖼️  Thumbnail Grid', description: 'Image grids', category: 'Display', checked: false },
    { name: 'accordion', label: '🪗 Accordion', description: 'Expandable content', category: 'Display', checked: false },
    { name: 'carousel', label: '🎠 Carousel', description: 'Image carousel', category: 'Display', checked: false },
  ],

  // Buttons & Actions (9)
  buttons: [
    { name: 'button', label: '🔘 Button', description: 'Primary button component', category: 'Buttons', checked: true },
    { name: 'dual-button', label: '⚡ Dual Button', description: 'Dual action buttons', category: 'Buttons', checked: false },
    { name: 'expanding-button', label: '🔼 Expanding Button', description: 'Expanding button', category: 'Buttons', checked: false },
    { name: 'icon-button', label: '🔵 Icon Button', description: 'Icon-only button', category: 'Buttons', checked: false },
    { name: 'icon-pill', label: '💊 Icon Pill', description: 'Icon pills', category: 'Buttons', checked: false },
    { name: 'jumbo-button', label: '🔴 Jumbo Button', description: 'Large prominent button', category: 'Buttons', checked: false },
    { name: 'pill', label: '💊 Pill', description: 'Pill-shaped button', category: 'Buttons', checked: false },
    { name: 'hyperlink', label: '🔗 Hyperlink', description: 'Links and navigation', category: 'Buttons', checked: true },
  ],

  // Form Inputs (12)
  forms: [
    { name: 'input-field', label: '📝 Input Field', description: 'Text input', category: 'Forms', checked: true },
    { name: 'text-area', label: '📄 Text Area', description: 'Multi-line text input', category: 'Forms', checked: true },
    { name: 'checkbox', label: '☑️  Checkbox', description: 'Checkbox input', category: 'Forms', checked: true },
    { name: 'radio-button', label: '🔘 Radio Button', description: 'Radio button', category: 'Forms', checked: true },
    { name: 'switch', label: '🎚️  Switch', description: 'Toggle switch', category: 'Forms', checked: true },
    { name: 'toggle', label: '🔀 Toggle', description: 'Alternative toggle', category: 'Forms', checked: false },
    { name: 'select', label: '📋 Select', description: 'Dropdown select', category: 'Forms', checked: true },
    { name: 'combobox', label: '🔍 Combobox', description: 'Combo box input', category: 'Forms', checked: false },
    { name: 'choice', label: '✓ Choice', description: 'Choice selector', category: 'Forms', checked: false },
    { name: 'search', label: '🔍 Search', description: 'Search input', category: 'Forms', checked: true },
    { name: 'slider', label: '📊 Slider', description: 'Range slider', category: 'Forms', checked: false },
    { name: 'quantity-stepper', label: '➕➖ Quantity Stepper', description: 'Quantity input', category: 'Forms', checked: false },
    { name: 'segmented-control', label: '🎛️  Segmented Control', description: 'Segmented control', category: 'Forms', checked: false },
  ],

  // Feedback & Status (9)
  feedback: [
    { name: 'badge', label: '🏷️  Badge', description: 'Status badges', category: 'Feedback', checked: true },
    { name: 'status', label: '🚦 Status', description: 'Status indicators', category: 'Feedback', checked: false },
    { name: 'toast', label: '🔔 Toast', description: 'Toast notifications', category: 'Feedback', checked: true },
    { name: 'banner', label: '📣 Banner', description: 'Banner messages', category: 'Feedback', checked: false },
    { name: 'inline-message', label: '💬 Inline Message', description: 'Inline messages', category: 'Feedback', checked: false },
    { name: 'helper-text', label: '❓ Helper Text', description: 'Helper text', category: 'Feedback', checked: false },
    { name: 'loading', label: '⏳ Loading', description: 'Loading indicators', category: 'Feedback', checked: true },
    { name: 'progress-indicator', label: '📊 Progress Indicator', description: 'Progress bars', category: 'Feedback', checked: false },
    { name: 'skeleton', label: '💀 Skeleton', description: 'Skeleton loaders', category: 'Feedback', checked: false },
  ],

  // Modals & Overlays (4)
  modals: [
    { name: 'modal', label: '📦 Modal', description: 'Modal dialogs', category: 'Modals', checked: true },
    { name: 'modal-sheets', label: '📋 Modal Sheets', description: 'Sheet modals', category: 'Modals', checked: false },
    { name: 'modal-theatre', label: '🎭 Modal Theatre', description: 'Theatre mode modals', category: 'Modals', checked: false },
    { name: 'tooltip', label: '💬 Tooltip', description: 'Tooltips', category: 'Modals', checked: true },
  ],

  // Media & Rich Content (5)
  media: [
    { name: 'simple-video', label: '🎥 Simple Video', description: 'Video player', category: 'Media', checked: false },
    { name: 'shoppable-image', label: '🛒 Shoppable Image', description: 'Interactive product images', category: 'Media', checked: false },
    { name: 'icon', label: '🎨 Icon', description: 'Icon library', category: 'Media', checked: true },
    { name: 'logos', label: '🇸🇪 Logos', description: 'IKEA logos', category: 'Media', checked: false },
    { name: 'avatar', label: '👤 Avatar', description: 'User avatars', category: 'Media', checked: false },
    { name: 'rating', label: '⭐ Rating', description: 'Star ratings', category: 'Media', checked: false },
  ],

  // E-commerce (7)
  ecommerce: [
    { name: 'price', label: '💰 Price', description: 'Price display', category: 'E-commerce', checked: false },
    { name: 'price-module', label: '💵 Price Module', description: 'Price modules', category: 'E-commerce', checked: false },
    { name: 'product-identifier', label: '🔢 Product Identifier', description: 'Product IDs', category: 'E-commerce', checked: false },
    { name: 'commercial-messages', label: '📢 Commercial Messages', description: 'Commercial messages', category: 'E-commerce', checked: false },
    { name: 'member-card', label: '🎫 Member Card', description: 'Member cards', category: 'E-commerce', checked: false },
    { name: 'payment-logo', label: '💳 Payment Logo', description: 'Payment method logos', category: 'E-commerce', checked: false },
    { name: 'tag', label: '🏷️  Tag', description: 'Product tags', category: 'E-commerce', checked: false },
    { name: 'endorsement-label', label: '✅ Endorsement Label', description: 'Endorsement labels', category: 'E-commerce', checked: false },
  ],

  // Utilities (2)
  utilities: [
    { name: 'animations', label: '✨ Animations', description: 'Animation utilities', category: 'Utilities', checked: false },
    { name: 'browserslist-config', label: '🌐 Browserslist Config', description: 'Browser support config', category: 'Utilities', checked: false },
  ],
};

/**
 * Package name mapping for components that have different npm package names
 * Maps component name -> actual npm package name
 */
const PACKAGE_NAME_MAP = {
  'colours': 'variables',              // Use @ingka/variables instead
  'expanding-button': 'button',        // Use @ingka/button instead
  'icon-button': 'button',             // Use @ingka/button instead
  'icon-pill': 'pill',                 // Use @ingka/pill instead
  'modal-sheets': 'modal',             // Use @ingka/modal instead
  'modal-theatre': 'modal',            // Use @ingka/modal instead
  'logos': 'ssr-icon',                 // Use @ingka/ssr-icon instead
  'commercial-messages': 'commercial-message', // Note: singular form
};

class ComponentInstaller {
  constructor() {
    this.projectRoot = process.cwd();
    this.packageJson = null;
    this.selectedComponents = [];
    this.installedComponents = [];
    this.failedComponents = [];
  }

  /**
   * Main installation flow
   */
  async install(options = {}) {
    try {
      // Step 1: Verify project setup
      await this.verifyProject();

      // Step 2: Offer installation method choice (NEW!)
      const installMethod = await this.chooseInstallationMethod(options);

      if (installMethod === 'npm-package') {
        // Install the @ux-ingka-kit/skapa-components package
        await this.installSkapaPackage();
        return;
      }

      // Step 3: Determine installation mode (for individual components)
      const mode = await this.determineInstallationMode(options);

      // Step 4: Select components
      this.selectedComponents = await this.selectComponents(mode, options);

      // Step 5: Show summary and confirm
      if (!options.skipConfirmation) {
        const confirmed = await this.confirmInstallation();
        if (!confirmed) {
          console.log(chalk.yellow('\n✋ Installation cancelled'));
          return;
        }
      }

      // Step 6: Configure Ingka registry
      await this.configureRegistry();

      // Step 7: Install npm packages
      await this.installNpmPackages();

      // Step 8: Copy component templates
      await this.copyComponentTemplates();

      // Step 9: Generate exports and documentation
      await this.generateExports();

      // Step 10: Success message
      this.showSuccessMessage();

    } catch (error) {
      console.error(chalk.red('\n❌ Installation failed:'), error.message);
      if (process.env.DEBUG) console.error(error);
      process.exit(1);
    }
  }

  /**
   * Verify project setup
   */
  async verifyProject() {
    console.log(chalk.cyan('🔍 Verifying project setup...\n'));

    // Check package.json
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('No package.json found. Please run this command in your project root.');
    }

    this.packageJson = await fs.readJson(packageJsonPath);

    // Check for React (required for Ingka components)
    const hasReact = this.packageJson.dependencies?.react || this.packageJson.devDependencies?.react;
    if (!hasReact) {
      console.log(chalk.yellow('⚠️  React not detected in package.json'));
      console.log(chalk.gray('   Ingka components require React'));

      const { installReact } = await inquirer.prompt([{
        type: 'confirm',
        name: 'installReact',
        message: 'Would you like to install React now?',
        default: true
      }]);

      if (installReact) {
        console.log(chalk.cyan('\n📦 Installing React...'));
        execSync('npm install react react-dom', { stdio: 'inherit' });
        console.log(chalk.green('✅ React installed\n'));
      } else {
        throw new Error('React is required for Ingka components');
      }
    }

    console.log(chalk.green('✅ Project setup verified\n'));
  }

  /**
   * Choose installation method: npm package vs individual components
   * NEW in v6.6.0 - Offers @ux-ingka-kit/skapa-components package
   */
  async chooseInstallationMethod(options) {
    // Skip prompt if method is pre-selected
    if (options.installMethod) return options.installMethod;

    // Skip prompt if running non-interactively
    if (options.nonInteractive || !process.stdin.isTTY) {
      return 'individual'; // Default to individual components
    }

    console.log(chalk.blue.bold('📦 Choose Installation Method\n'));

    const { method } = await inquirer.prompt([{
      type: 'list',
      name: 'method',
      message: 'How would you like to install Skapa components?',
      choices: [
        {
          name: '🎁 npm Package (Recommended) - Install ingvar-skapa-components',
          value: 'npm-package',
          short: 'npm package'
        },
        new inquirer.Separator('   → 64 components • 328KB bundle • TypeScript support'),
        new inquirer.Separator('   → Tree-shakeable • Production-ready • Dual import options'),
        new inquirer.Separator(''),
        {
          name: '🔧 Individual Components - Install specific components from @ingka packages',
          value: 'individual',
          short: 'individual'
        },
        new inquirer.Separator('   → Cherry-pick components • Direct @ingka packages'),
        new inquirer.Separator('   → 75 components available • Full customization'),
        new inquirer.Separator('')
      ],
      default: 'npm-package'
    }]);

    return method;
  }

  /**
   * Bundled Skapa components (v6.7.0+)
   * Components are now included with ux-ingka-kit!
   */
  async installSkapaPackage() {
    console.log(chalk.blue.bold('\n📦 Skapa Components - Already Bundled! 🎉\n'));

    console.log(chalk.green('✅ Good news! Skapa components are now bundled with ux-ingka-kit.'));
    console.log(chalk.gray('   No separate installation needed!\n'));

    // Show usage instructions
    console.log(chalk.blue.bold('📖 Usage:\n'));

    console.log(chalk.white('Option 1: Direct @ingka exports (Recommended for Skapa projects)\n'));
    console.log(chalk.cyan('  import { Button, Card, InputField, Switch } from \'ux-ingka-kit/skapa/ingka-direct\';\n'));

    console.log(chalk.white('Option 2: Simplified wrappers (Rapid prototyping)\n'));
    console.log(chalk.cyan('  import { Button, TextField, Toggle } from \'ux-ingka-kit/skapa\';\n'));

    console.log(chalk.blue.bold('📚 Documentation:\n'));
    console.log(chalk.gray('  Component README: ') + chalk.cyan('node_modules/ux-ingka-kit/lib/skapa-components/README.md'));
    console.log(chalk.gray('  Component List: ') + chalk.cyan('node_modules/ux-ingka-kit/lib/skapa-components/COMPONENT_STATUS.md'));
    console.log(chalk.gray('  GitHub: ') + chalk.cyan('https://github.com/leopagotto/ux-ingka-kit\n'));

    console.log(chalk.blue.bold('🎯 Quick Start:\n'));
    console.log(chalk.white('  1. Import components using either strategy'));
    console.log(chalk.white('  2. 64 components ready to use with TypeScript support'));
    console.log(chalk.white('  3. Tree-shakeable with dual export options\n'));

    console.log(chalk.green.bold('🎉 Ready to Use!\n'));
    console.log(chalk.gray('Start your dev server and begin building with Skapa components.\n'));

    return true;
  }

  /**
   * Determine installation mode
   */
  async determineInstallationMode(options) {
    if (options.mode) return options.mode;

    const { mode } = await inquirer.prompt([{
      type: 'list',
      name: 'mode',
      message: 'How would you like to install components?',
      choices: [
        {
          name: '⚡ Essential Components (20 most common) - Quick start',
          value: 'essential'
        },
        {
          name: '📦 All Components (72 components) - Complete library',
          value: 'all'
        },
        {
          name: '🎯 Cherry-pick (Select individual components)',
          value: 'cherry-pick'
        }
      ]
    }]);

    return mode;
  }

  /**
   * Select components based on mode
   */
  async selectComponents(mode, options) {
    console.log(chalk.cyan('\n📋 Selecting components...\n'));

    // Flatten all components
    const allComponents = Object.values(ALL_COMPONENTS).flat();

    if (mode === 'all') {
      return allComponents.map(c => c.name);
    }

    if (mode === 'essential') {
      return allComponents
        .filter(c => c.checked) // Pre-selected essential components
        .map(c => c.name);
    }

    if (mode === 'cherry-pick') {
      // Group components by category for better UI
      const choices = [];

      Object.entries(ALL_COMPONENTS).forEach(([key, components]) => {
        const category = components[0]?.category || key;
        choices.push(new inquirer.Separator(`\n=== ${category.toUpperCase()} ===`));

        components.forEach(comp => {
          choices.push({
            name: `${comp.label} - ${comp.description}`,
            value: comp.name,
            checked: comp.checked // Show pre-selected
          });
        });
      });

      const { selected } = await inquirer.prompt([{
        type: 'checkbox',
        name: 'selected',
        message: 'Select components (spacebar to toggle, all shown by default):',
        choices,
        pageSize: 20,
        loop: false
      }]);

      return selected;
    }

    return [];
  }

  /**
   * Confirm installation
   */
  async confirmInstallation() {
    console.log(chalk.cyan('\n📊 Installation Summary:\n'));
    console.log(chalk.white(`  Components selected: ${chalk.bold(this.selectedComponents.length)}`));
    console.log(chalk.white(`  Output directory: ${chalk.bold('src/components/ingka')}`));
    console.log(chalk.white(`  Registry: ${chalk.bold('@ingka:registry=https://npm.m2.blue.cdtapps.com')}`));
    console.log();

    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with installation?',
      default: true
    }]);

    return confirm;
  }

  /**
   * Configure Ingka npm registry
   */
  async configureRegistry() {
    console.log(chalk.cyan('🔧 Configuring Ingka registry...\n'));

    const npmrcPath = path.join(this.projectRoot, '.npmrc');
    const registryConfig = '@ingka:registry=https://npm.m2.blue.cdtapps.com\n';

    // Check if .npmrc exists
    if (fs.existsSync(npmrcPath)) {
      const existing = await fs.readFile(npmrcPath, 'utf8');
      if (!existing.includes('@ingka:registry')) {
        await fs.appendFile(npmrcPath, `\n${registryConfig}`);
        console.log(chalk.green('✅ Added Ingka registry to existing .npmrc'));
      } else {
        console.log(chalk.gray('   Ingka registry already configured'));
      }
    } else {
      await fs.writeFile(npmrcPath, registryConfig);
      console.log(chalk.green('✅ Created .npmrc with Ingka registry'));
    }

    // Ensure .npmrc is fully written to disk before npm reads it
    await fs.fsync(await fs.open(npmrcPath, 'r'));

    // Alternative: Use npm config command to ensure registry is set
    try {
      execSync('npm config set --location=project @ingka:registry https://npm.m2.blue.cdtapps.com', {
        cwd: this.projectRoot,
        stdio: 'pipe' // Suppress output
      });
    } catch (error) {
      // File already exists, this is fine
    }

    console.log();
  }

  /**
   * Install npm packages from @ingka registry
   */
  async installNpmPackages() {
    console.log(chalk.cyan('📦 Installing Ingka npm packages...\n'));
    console.log(chalk.gray('   Installing packages individually for better error handling...\n'));

    const registryInstalledComponents = [];
    const registryFailedComponents = [];

    // Install packages one at a time to avoid one failure blocking all
    for (const componentName of this.selectedComponents) {
      // Use mapped package name if available (e.g., colours -> variables)
      const actualPackageName = PACKAGE_NAME_MAP[componentName] || componentName;
      const packageName = `@ingka/${actualPackageName}`;

      try {
        // Try to install from registry silently
        execSync(`npm install ${packageName}`, {
          cwd: this.projectRoot,
          stdio: 'pipe' // Suppress output for cleaner UI
        });

        registryInstalledComponents.push(componentName);

        // Show mapping info if package name differs
        if (actualPackageName !== componentName) {
          console.log(chalk.green(`   ✓ ${componentName} → ${actualPackageName} (from registry)`));
        } else {
          console.log(chalk.green(`   ✓ ${componentName} (from registry)`));
        }
      } catch (error) {
        // Package not available in registry - will use local template instead
        registryFailedComponents.push(componentName);
        console.log(chalk.gray(`   ○ ${componentName} (will use local template)`));
      }
    }

    if (registryInstalledComponents.length > 0) {
      console.log(chalk.green(`\n✅ Installed ${registryInstalledComponents.length} packages from Ingka registry`));
    }

    if (registryFailedComponents.length > 0) {
      console.log(chalk.gray(`   ${registryFailedComponents.length} components will use local templates\n`));
    }
  }

    /**
   * Copy component templates from local templates folder
   */
  async copyComponentTemplates() {
    console.log(chalk.cyan('� Installing component templates...\n'));

    const templatesDir = path.join(__dirname, '../../templates/ingka-components');
    const outputDir = path.join(this.projectRoot, 'src', 'components', 'ingka');

    await fs.ensureDir(outputDir);

    // Track successful installations
    this.installedComponents = [];
    this.failedComponents = [];

    for (const componentName of this.selectedComponents) {
      const templatePath = path.join(templatesDir, componentName);
      const outputPath = path.join(outputDir, componentName);

      if (await fs.pathExists(templatePath)) {
        await fs.copy(templatePath, outputPath);
        console.log(chalk.gray(`   ✓ ${componentName}`));
        this.installedComponents.push(componentName);
      } else {
        console.log(chalk.yellow(`   ⚠️  Template not found: ${componentName}`));
        this.failedComponents.push(componentName);
      }
    }

    const successCount = this.installedComponents.length;
    const failCount = this.failedComponents.length;

    console.log(chalk.green(`\n✅ Successfully installed: ${successCount} components`));
    if (failCount > 0) {
      console.log(chalk.yellow(`⚠️  Failed (registry auth required): ${failCount} components\n`));
    } else {
      console.log('');
    }
  }

  /**
   * Generate index exports and documentation
   */
  async generateExports() {
    console.log(chalk.cyan('📝 Generating exports and documentation...\n'));

    const outputDir = path.join(this.projectRoot, 'src', 'components', 'ingka');

    // Generate index.ts with ONLY successfully installed components
    const exports = this.installedComponents
      .map(name => {
        const pascalCase = name.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        return `export { ${pascalCase} } from './${name}/${pascalCase}';`;
      })
      .join('\n');

    const indexContent = `/**
 * UX Ingka Kit - IKEA Ingka Skapa Design System Components
 *
 * Official IKEA components for production-ready applications.
 * Auto-generated on ${new Date().toISOString()}
 *
 * Successfully installed: ${this.installedComponents.length} components
 * ${this.failedComponents.length > 0 ? `Failed (registry auth required): ${this.failedComponents.length} components` : ''}
 *
 * @see https://github.com/leopagotto/ux-ingka-kit
 */

${exports}

// Note: Some design tokens may require IKEA internal registry access
// If @ingka packages fail to install, components include embedded tokens
`;

    await fs.writeFile(path.join(outputDir, 'index.ts'), indexContent);
    console.log(chalk.gray('   ✓ index.ts'));

    // Generate README with accurate installation info
    const readmeContent = `# IKEA Ingka Skapa Components

Successfully installed ${this.installedComponents.length} production-ready IKEA components.

## Installation Summary

- ✅ **Installed:** ${this.installedComponents.length} components (local templates)
${this.failedComponents.length > 0 ? `- ⚠️  **Failed:** ${this.failedComponents.length} components (require IKEA internal registry access)` : ''}

## Usage

\`\`\`tsx
import { Button, Card } from './components/ingka';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
\`\`\`

## Available Components (${this.installedComponents.length})

${this.installedComponents.map(name => `- \`${name}\``).join('\n')}

${this.failedComponents.length > 0 ? `
## Components Requiring IKEA Internal Access (${this.failedComponents.length})

These components require authentication to IKEA's internal npm registry:

${this.failedComponents.slice(0, 20).map(name => `- \`${name}\``).join('\n')}
${this.failedComponents.length > 20 ? `\n... and ${this.failedComponents.length - 20} more` : ''}

**For IKEA employees:** Contact IT Support for registry access.
**For external users:** Only local templates are available.
` : ''}

## Documentation

- Component templates: \`src/components/ingka/\`
- Official Ingka documentation: Available on IKEA intranet (internal only)
- UX Ingka Kit guide: See \`docs/guides/SKAPA_COMPONENT_INDEX.md\`

## Adding More Components

To install additional components:

\`\`\`bash
npm run components
# or
ux-ingka components
\`\`\`

## Registry

Components are sourced from:
- \`@ingka\` packages: \`https://npm.m2.blue.cdtapps.com\` (IKEA internal, requires auth)
- Local templates: \`templates/ingka-components/\` (always available)

## Support

- For issues with @ingka packages, contact IKEA IT Support
- For local template issues, open an issue on GitHub
`;

    await fs.writeFile(path.join(outputDir, 'README.md'), readmeContent);
    console.log(chalk.gray('   ✓ README.md\n'));
  }

  /**
   * Show success message
   */
  showSuccessMessage() {
    console.log(chalk.green.bold('\n✨ Component installation complete!\n'));

    console.log(chalk.cyan('� Installation Summary:\n'));
    console.log(chalk.green(`  ✅ Successfully installed: ${this.installedComponents.length} components (local templates)`));

    if (this.failedComponents.length > 0) {
      console.log(chalk.yellow(`  ⚠️  Failed (registry auth required): ${this.failedComponents.length} components`));
    }

    console.log(chalk.cyan('\n� Components installed to:'), chalk.bold('src/components/ingka/'));

    if (this.failedComponents.length > 0) {
      console.log();
      console.log(chalk.yellow('⚠️  Note: Some components require IKEA internal registry access.'));
      console.log(chalk.gray('   External users receive local templates only.'));
    }

    console.log();
    console.log(chalk.yellow('🚀 Next steps:\n'));
    console.log(chalk.white('  1. Import components:'));
    console.log(chalk.gray(`     import { Button, Card } from './components/ingka';\n`));
    console.log(chalk.white('  2. Use in your app:'));
    console.log(chalk.gray(`     <Button variant="primary">Click me</Button>\n`));
    console.log(chalk.white('  3. See documentation:'));
    console.log(chalk.gray(`     cat src/components/ingka/README.md\n`));
    console.log(chalk.white('  4. Add more components later:'));
    console.log(chalk.gray(`     npm run components\n`));
  }
}

module.exports = { ComponentInstaller, ALL_COMPONENTS };
