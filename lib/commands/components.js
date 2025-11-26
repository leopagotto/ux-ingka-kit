#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { ComponentInstaller, ALL_COMPONENTS } = require('../components/component-installer');

/**
 * Components Command
 * Install pre-built IKEA Ingka Skapa design system components
 */

async function componentsCommand(options = {}) {
  console.log(chalk.blue.bold('\n🎨 UX Ingka Kit - Component Installer\n'));

  // Check if in project directory
  if (!fs.existsSync('package.json')) {
    console.error(chalk.red('❌ No package.json found. Please run this command in your project root.'));
    process.exit(1);
  }

  const action = options.action || await promptAction();

  switch (action) {
    case 'install':
      // Use new ComponentInstaller
      const installer = new ComponentInstaller();
      await installer.install(options);
      break;
    case 'list':
      await listComponents();
      break;
    case 'update':
      await updateComponents();
      break;
    default:
      console.error(chalk.red('❌ Invalid action'));
      process.exit(1);
  }
}

async function promptAction() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '📦 Install IKEA components to project', value: 'install' },
        { name: '📋 List available components (75 total)', value: 'list' },
        { name: '🔄 Update existing components', value: 'update' }
      ]
    }
  ]);

  return action;
}

async function installComponents(options = {}) {
  console.log(chalk.blue('📦 Installing IKEA Ingka Skapa components...\n'));

  // Detect framework
  const packageJson = await fs.readJson('package.json');
  const hasReact = packageJson.dependencies?.react || packageJson.devDependencies?.react;
  const hasVue = packageJson.dependencies?.vue || packageJson.devDependencies?.vue;

  if (!hasReact && !hasVue) {
    console.error(chalk.red('❌ No React or Vue detected in package.json'));
    console.log(chalk.yellow('💡 Install React first: npm install react react-dom'));
    process.exit(1);
  }

  // Use provided options or prompt
  let answers;

  if (options.nonInteractive) {
    // Non-interactive mode: use defaults from options
    answers = {
      components: options.components || ['button', 'card', 'input'],
      outputDir: options.outputDir || 'src/components/ingka',
      installDesignTokens: options.installDesignTokens !== false,
      installTailwindConfig: options.installTailwindConfig !== false
    };
  } else {
    // Interactive mode: prompt user
    answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'components',
        message: 'Select components to install:',
        choices: [
          new inquirer.Separator('=== BUTTONS ==='),
          { name: '🔘 Button (Primary, Secondary, Outline, Ghost)', value: 'button', checked: true },

          new inquirer.Separator('=== CARDS & DISPLAY ==='),
          { name: '🗂️  Card (Product cards, content cards)', value: 'card', checked: true },
          { name: '� Avatar (User avatars with fallback)', value: 'avatar', checked: false },

          new inquirer.Separator('=== FORM COMPONENTS ==='),
          { name: '�📝 Input (Text input with validation)', value: 'input', checked: true },
          { name: '📄 TextArea (Multi-line text input)', value: 'textarea', checked: false },
          { name: '☑️  Checkbox (Single and group selections)', value: 'checkbox', checked: false },
          { name: '🔘 RadioButton (Single selection from options)', value: 'radiobutton', checked: false },
          { name: '📋 Select (Dropdown selection)', value: 'select', checked: false },
          { name: '🎚️  Switch (Toggle on/off)', value: 'switch', checked: false },
          { name: '📊 Slider (Range selection)', value: 'slider', checked: false },

          new inquirer.Separator('=== FEEDBACK & STATUS ==='),
          { name: '🏷️  Badge (Status indicators, counts)', value: 'badge', checked: false },
          { name: '📣 Banner (Prominent messages)', value: 'banner', checked: false },
          { name: '🔔 Toast (Notifications)', value: 'toast', checked: false },
          { name: '⏳ Loading (Spinners, skeletons)', value: 'loading', checked: false },

          new inquirer.Separator('=== LAYOUT ==='),
          { name: '➖ Divider (Visual separators)', value: 'divider', checked: false },
          { name: '📑 Accordion (Expandable sections)', value: 'accordion', checked: false },

          new inquirer.Separator('=== NAVIGATION ==='),
          { name: '📑 Tabs (Tab navigation)', value: 'tabs', checked: false },

          new inquirer.Separator('=== OVERLAYS ==='),
          { name: '📦 Modal (Dialogs, popups)', value: 'modal', checked: false },
          { name: '💬 Tooltip (Contextual help)', value: 'tooltip', checked: false },

          new inquirer.Separator('=== QUICK OPTIONS ==='),
          { name: '✅ All Components (19 components)', value: 'all', checked: false },
          { name: '📝 Forms Package (Input, TextArea, Checkbox, Radio, Select, Switch, Slider)', value: 'forms', checked: false },
          { name: '📢 Feedback Package (Badge, Banner, Toast, Loading)', value: 'feedback', checked: false }
        ]
      },
      {
        type: 'input',
        name: 'outputDir',
        message: 'Where should components be installed?',
        default: options.outputDir || 'src/components/ingka',
        validate: (input) => input.length > 0
      },
      {
        type: 'confirm',
        name: 'installDesignTokens',
        message: 'Install design tokens (colors, spacing, typography)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'installTailwindConfig',
        message: 'Generate Tailwind config with IKEA colors?',
        default: true,
        when: (answers) => packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss
      }
    ]);
  }

  // Determine which components to install
  let componentsToInstall = answers.components;

  // Handle package selections
  if (componentsToInstall.includes('all')) {
    componentsToInstall = [
      'button', 'card', 'input', 'textarea', 'checkbox', 'radiobutton',
      'select', 'switch', 'slider', 'badge', 'banner', 'toast', 'loading',
      'divider', 'accordion', 'tabs', 'modal', 'tooltip', 'avatar'
    ];
  } else if (componentsToInstall.includes('forms')) {
    componentsToInstall = componentsToInstall.filter(c => c !== 'forms')
      .concat(['input', 'textarea', 'checkbox', 'radiobutton', 'select', 'switch', 'slider']);
  } else if (componentsToInstall.includes('feedback')) {
    componentsToInstall = componentsToInstall.filter(c => c !== 'feedback')
      .concat(['badge', 'banner', 'toast', 'loading']);
  }

  // Remove duplicates
  componentsToInstall = [...new Set(componentsToInstall)];

  const outputDir = path.join(process.cwd(), answers.outputDir);

  // Create output directory
  await fs.ensureDir(outputDir);

  // Get templates directory
  const templatesDir = path.join(__dirname, '../../templates/ingka-components');

  // Component name mapping (CLI name -> directory name)
  const componentMap = {
    'button': 'Button',
    'card': 'Card',
    'input': 'Input',
    'textarea': 'TextArea',
    'checkbox': 'Checkbox',
    'radiobutton': 'RadioButton',
    'select': 'Select',
    'switch': 'Switch',
    'slider': 'Slider',
    'badge': 'Badge',
    'banner': 'Banner',
    'toast': 'Toast',
    'loading': 'Loading',
    'divider': 'Divider',
    'accordion': 'Accordion',
    'tabs': 'Tabs',
    'modal': 'Modal',
    'tooltip': 'Tooltip',
    'avatar': 'Avatar'
  };

  // Install selected components
  let installed = [];
  for (const component of componentsToInstall) {
    const componentName = componentMap[component.toLowerCase()];
    if (!componentName) {
      console.log(chalk.yellow(`   ⚠ Unknown component: ${component}`));
      continue;
    }

    const sourcePath = path.join(templatesDir, componentName);
    const destPath = path.join(outputDir, componentName);

    if (fs.existsSync(sourcePath)) {
      await fs.copy(sourcePath, destPath);
      installed.push(componentName);
      console.log(chalk.green(`   ✓ ${componentName} installed`));
    } else {
      console.log(chalk.yellow(`   ⚠ ${componentName} not found in templates`));
    }
  }

  // Install design tokens
  if (answers.installDesignTokens) {
    const tokensSource = path.join(__dirname, '../ai/ikea-design-system.js');
    const tokensDest = path.join(outputDir, 'design-tokens.js');
    await fs.copy(tokensSource, tokensDest);
    console.log(chalk.green('   ✓ Design tokens installed'));
  }

  // Generate Tailwind config
  if (answers.installTailwindConfig) {
    await generateTailwindConfig();
    console.log(chalk.green('   ✓ Tailwind config generated'));
  }

  // Create index file for easy imports
  await createIndexFile(outputDir, installed);
  console.log(chalk.green('   ✓ Index file created'));

  // Success message
  console.log(chalk.green.bold('\n✅ IKEA components installed successfully!\n'));

  // Usage instructions
  console.log(chalk.blue('📖 Usage:\n'));
  console.log(chalk.gray('Import components in your React files:\n'));

  const relativeImport = answers.outputDir.replace('src/', '');
  console.log(chalk.cyan(`import { Button, Card, Input } from '${relativeImport}';`));
  console.log(chalk.cyan(`import { IKEA_COLORS, IKEA_SPACING } from '${relativeImport}/design-tokens';\n`));

  console.log(chalk.gray('Use in your components:\n'));
  console.log(chalk.cyan(`<Button variant="primary" size="medium">Add to Cart</Button>`));
  console.log(chalk.cyan(`<Card>\n  <Card.Header>Product Name</Card.Header>\n  <Card.Content>Description</Card.Content>\n</Card>\n`));

  // Next steps
  console.log(chalk.yellow('🚀 Next steps:\n'));
  console.log(chalk.gray('1. Import components in your pages'));
  console.log(chalk.gray('2. Customize components as needed (you own the code!)'));
  console.log(chalk.gray('3. Run: ux-ingka components update (to get latest versions)'));
  console.log(chalk.gray('4. Enable AI instructions: Add IKEA specs to .github/copilot-instructions.md\n'));
}

async function listComponents() {
  console.log(chalk.blue.bold('📋 Available IKEA Ingka Skapa Components (75 Total):\n'));

  // Use the full component list from ComponentInstaller
  const allComponents = Object.values(ALL_COMPONENTS).flat();

  // Group by category
  const categories = {};
  allComponents.forEach(comp => {
    if (!categories[comp.category]) {
      categories[comp.category] = [];
    }
    categories[comp.category].push(comp);
  });

  // Display by category
  for (const [category, components] of Object.entries(categories)) {
    console.log(chalk.yellow.bold(`\n${category} (${components.length}):`));

    for (const comp of components) {
      const checkmark = comp.checked ? chalk.green('✓') : chalk.gray('○');
      console.log(`  ${checkmark} ${comp.label}`);
      console.log(chalk.gray(`    ${comp.description}`));
    }
  }

  console.log(chalk.cyan('\n\n💡 To install components:'));
  console.log(chalk.white('   ux-ingka components'));
  console.log(chalk.gray('\n   Checkmarks (✓) indicate recommended components\n'));

  console.log(chalk.blue.bold('\n📦 Installation:\n'));
  console.log(chalk.gray('Install all: ') + chalk.cyan('ux-ingka components install --components all'));
  console.log(chalk.gray('Install specific: ') + chalk.cyan('ux-ingka components install --components button,card,input'));
  console.log(chalk.gray('Install forms: ') + chalk.cyan('ux-ingka components install --components forms'));
  console.log(chalk.gray('Install feedback: ') + chalk.cyan('ux-ingka components install --components feedback'));
  console.log(chalk.gray('Interactive: ') + chalk.cyan('ux-ingka components install\n'));

  console.log(chalk.blue.bold('🎨 Quick Packages:\n'));
  console.log(chalk.gray('  • ') + chalk.cyan('forms') + chalk.gray(' - Input, TextArea, Checkbox, Radio, Select, Switch, Slider'));
  console.log(chalk.gray('  • ') + chalk.cyan('feedback') + chalk.gray(' - Badge, Banner, Toast, Loading'));
  console.log(chalk.gray('  • ') + chalk.cyan('all') + chalk.gray(' - All 19 components\n'));
}

async function updateComponents() {
  console.log(chalk.blue('🔄 Updating IKEA components...\n'));

  // Find installed components
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'componentsDir',
      message: 'Where are components currently installed?',
      default: 'src/components/ingka'
    },
    {
      type: 'confirm',
      name: 'confirmUpdate',
      message: chalk.yellow('⚠️  This will overwrite existing components. Continue?'),
      default: false
    }
  ]);

  if (!answers.confirmUpdate) {
    console.log(chalk.yellow('Update cancelled.'));
    return;
  }

  const componentsDir = path.join(process.cwd(), answers.componentsDir);

  if (!fs.existsSync(componentsDir)) {
    console.error(chalk.red(`❌ Components directory not found: ${componentsDir}`));
    process.exit(1);
  }

  // Find which components exist
  const existingComponents = await fs.readdir(componentsDir);
  const templatesDir = path.join(__dirname, '../../templates/ingka-components');

  let updated = [];
  for (const component of existingComponents) {
    const sourcePath = path.join(templatesDir, component);
    const destPath = path.join(componentsDir, component);

    if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
      await fs.copy(sourcePath, destPath, { overwrite: true });
      updated.push(component);
      console.log(chalk.green(`   ✓ ${component} updated`));
    }
  }

  console.log(chalk.green.bold(`\n✅ Updated ${updated.length} components!\n`));
}

async function createIndexFile(outputDir, components) {
  const indexContent = `/**
 * IKEA Ingka Skapa Design System Components
 *
 * Auto-generated by UX Ingka Kit
 * https://github.com/leopagotto/ux-ingka-kit
 */

${components.map(comp => `export { default as ${comp} } from './${comp}/${comp}';`).join('\n')}

// Design tokens
export * from './design-tokens';
`;

  await fs.writeFile(path.join(outputDir, 'index.js'), indexContent);
}

async function generateTailwindConfig() {
  const { generateIkeaTailwindConfig } = require('../ai/ikea-design-system');
  const config = generateIkeaTailwindConfig();

  const configPath = path.join(process.cwd(), 'tailwind.config.js');

  if (fs.existsSync(configPath)) {
    console.log(chalk.yellow('   ⚠️  tailwind.config.js already exists. Backing up to tailwind.config.backup.js'));
    await fs.copy(configPath, 'tailwind.config.backup.js');
  }

  const configContent = `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(config, null, 2)};
`;

  await fs.writeFile(configPath, configContent);
}

module.exports = componentsCommand;
