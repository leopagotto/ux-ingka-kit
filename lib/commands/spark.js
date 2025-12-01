#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

const { banner } = require('../banner');
const { detectIntent } = require('../ai/natural-language-detector');
const { IKEA_DESIGN_TOKENS } = require('../ai/ikea-design-system');

/**
 * Get design system from config or prompt user
 * This checks .ux-ingkarc.json first (set by ux-ingka init)
 */
async function getDesignSystemConfig(options = {}) {
  // If design system passed via CLI, use that
  if (options.designSystem) {
    const designSystemInput = options.designSystem.toLowerCase();
    const allowedDesignSystems = ['ingka', 'cwds'];
    return allowedDesignSystems.includes(designSystemInput) ? designSystemInput : 'ingka';
  }

  // Try to read from config file (set by ux-ingka init)
  try {
    const configManager = require('../utils/config-manager');
    const designSystemConfig = configManager.get('design-system');

    if (designSystemConfig && designSystemConfig.enabled) {
      const type = designSystemConfig.type || 'ingka';
      console.log(chalk.green(`✅ Using configured design system: ${type === 'cwds' ? 'CWDS' : 'Ingka Skapa'}\n`));
      return type;
    }
  } catch (error) {
    // Config not found, continue to prompt
  }

  // No config found - prompt user (or suggest running init first)
  console.log(chalk.yellow('⚠️  No design system configured\n'));
  console.log(chalk.gray('💡 Tip: Run ') + chalk.cyan('ux-ingka init') + chalk.gray(' to set up your project with IKEA design system\n'));

  const { designSystem } = await inquirer.prompt([{
    type: 'list',
    name: 'designSystem',
    message: '🎨 Which IKEA design system do you want to use?',
    choices: [
      {
        name: '🛍️  Ingka Skapa - Customer-facing apps (e-commerce, public sites)',
        value: 'ingka',
        short: 'Ingka Skapa'
      },
      {
        name: '🏢 CWDS - Internal co-worker tools (admin panels, dashboards)',
        value: 'cwds',
        short: 'CWDS'
      }
    ],
    default: 'ingka'
  }]);

  return designSystem;
}

/**
 * Get app description and name (voice-friendly, happens AFTER setup)
 * @param {Object} options - CLI options
 * @param {string} designSystem - Pre-configured design system
 */
async function getAppRequirements(options = {}, designSystem = 'ingka') {
  const normalizedOptions = { ...options };
  const questions = [];

  // PHASE 1: Ask for app description (voice-friendly message, but still accepts text)
  if (!normalizedOptions.prompt) {
    console.log(chalk.blue('\n🎤 Voice Command Ready!\n'));
    console.log(chalk.gray('   💡 You can use voice-to-text on your device to describe your app'));
    console.log(chalk.gray('   💡 macOS: Press Fn key twice to enable dictation'));
    console.log(chalk.gray('   💡 Windows: Press Win + H for voice typing\n'));

    questions.push({
      type: 'input',
      name: 'prompt',
      message: '🎯 Describe the app you want to build (voice or text):',
      validate: (input) => input.length > 10 || 'Please provide a more detailed description (at least 10 characters)'
    });
  }

  // PHASE 2: Ask for app name
  if (!normalizedOptions.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: '📛 App name:',
      default: (answers) => generateAppName(answers.prompt || normalizedOptions.prompt),
      validate: (input) => /^[a-zA-Z0-9-_]+$/.test(input) || 'Name must contain only letters, numbers, hyphens, and underscores'
    });
  }

  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};

  return {
    prompt: normalizedOptions.prompt || answers.prompt,
    name: normalizedOptions.name || answers.name,
    directory: normalizedOptions.dir || './spark-apps',
    designSystem,
    install: normalizedOptions.install !== false,
    start: normalizedOptions.start !== false
  };
}

async function getAppRequirements_OLD(options = {}) {
  const normalizedOptions = { ...options };
  const questions = [];

  if (!normalizedOptions.prompt) {
    questions.push({
      type: 'input',
      name: 'prompt',
      message: '🎯 Describe the app you want to build:',
      validate: (input) => input.length > 10 || 'Please provide a more detailed description (at least 10 characters)'
    });
  }

  if (!normalizedOptions.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: '📛 App name:',
      default: (answers) => generateAppName(answers.prompt || normalizedOptions.prompt),
      validate: (input) => /^[a-zA-Z0-9-_]+$/.test(input) || 'Name must contain only letters, numbers, hyphens, and underscores'
    });
  }

  if (!normalizedOptions.designSystem) {
    questions.push({
      type: 'list',
      name: 'designSystem',
      message: '� Which IKEA design system do you want to use?',
      choices: [
        {
          name: '🛍️  Ingka Skapa - Customer-facing apps (e-commerce, public sites)',
          value: 'ingka',
          short: 'Ingka Skapa'
        },
        {
          name: '🏢 CWDS - Internal co-worker tools (admin panels, dashboards)',
          value: 'cwds',
          short: 'CWDS'
        }
      ],
      default: 'ingka'
    });
  }

  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};

  const designSystemInput = (normalizedOptions.designSystem || answers.designSystem || 'ingka').toLowerCase();
  const allowedDesignSystems = ['ingka', 'cwds'];
  const designSystem = allowedDesignSystems.includes(designSystemInput) ? designSystemInput : 'ingka';

  return {
    prompt: normalizedOptions.prompt || answers.prompt,
    name: normalizedOptions.name || answers.name,
    directory: normalizedOptions.dir || './spark-apps',
    designSystem,
    install: normalizedOptions.install !== false,
    start: normalizedOptions.start !== false
  };
}

function generateAppName(prompt) {
  // Extract key words and create a name
  const words = prompt.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 3);

  return words.join('-') || 'spark-app';
}

async function generateSparkApp(config) {
  const { prompt, name, directory, designSystem, install, start } = config;
  const useIngka = designSystem === 'ingka' || designSystem === 'cwds';
  const useCwds = designSystem === 'cwds';

  console.log(chalk.blue('🔧 Setting up Spark app...\n'));

  if (useCwds) {
    console.log(chalk.yellow('� Using IKEA CWDS (extends Ingka Skapa for co-worker tools)'));
  } else if (useIngka) {
    console.log(chalk.yellow('🇸🇪 Using IKEA Ingka Skapa Design System (customer-facing)'));
  }

  // 1. Copy template
  const templatePath = path.join(__dirname, '../../template-main');
  const appPath = path.join(process.cwd(), directory, name);

  console.log(`📁 Creating app directory: ${chalk.cyan(appPath)}`);
  await fs.ensureDir(appPath);
  await fs.copy(templatePath, appPath);

  // 2. Update package.json
  console.log('📦 Updating package.json...');
  const packageJsonPath = path.join(appPath, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = name;
  packageJson.description = `Generated by Ingvar Spark: ${prompt}`;
  if (useCwds) {
    packageJson.description += ' (IKEA Ingka Skapa + CWDS)';
  } else if (useIngka) {
    packageJson.description += ' (IKEA Ingka Skapa Design System)';
  }
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  // 3. Apply IKEA Ingka Skapa design system if requested
  if (useIngka) {
    await applyIngkaSkapaDesignSystem(appPath);

    // 3b. Add CWDS components if requested (extends Ingka Skapa)
    if (useCwds) {
      await applyCWDSDesignSystem(appPath);
    }
  }

  // 4. Generate AI code
  console.log(chalk.yellow('🤖 Generating app code with AI...\n'));

  const appCode = await generateAppCode(prompt, name, designSystem);

  // 5. Write generated files
  await writeGeneratedFiles(appPath, appCode);

  // 6. Install dependencies
  if (install) {
    console.log(chalk.blue('📥 Installing dependencies...\n'));
    try {
      execSync('npm install', { cwd: appPath, stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.yellow('⚠️  Manual install required: cd ' + appPath + ' && npm install'));
    }
  }

  // 7. Success message
  console.log(chalk.green('\n🎉 Spark app created successfully!\n'));

  console.log(chalk.cyan('📍 Location:'), appPath);
  if (useCwds) {
    console.log(chalk.yellow('� Design System:'), 'IKEA Ingka Skapa + CWDS');
    console.log(chalk.blue('🎨 Components:'), '75+ Ingka Skapa + CWDS co-worker suite');
    console.log(chalk.gray('   • Global Header, App Switcher, CWDS Layouts'));
  } else if (useIngka) {
    console.log(chalk.yellow('🇸🇪 Design System:'), 'IKEA Ingka Skapa');
    console.log(chalk.blue('🎨 Colors:'), 'IKEA Blue (#0051BA) & Yellow (#FFDB00)');
  }
  console.log(chalk.cyan('🚀 Next steps:'));
  console.log(`  cd ${path.relative(process.cwd(), appPath)}`);
  if (!install) console.log('  npm install');
  console.log('  npm run dev');

  // 8. Start dev server
  if (start && install) {
    console.log(chalk.blue('\n🌟 Starting development server...\n'));
    try {
      execSync('npm run dev', { cwd: appPath, stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.yellow('⚠️  Start manually: cd ' + appPath + ' && npm run dev'));
    }
  }
}

async function generateAppCode(prompt, appName, designSystem = 'ingka') {
  const { generateSparkApp } = require('../ai/code-generator');

  return generateSparkApp(prompt, appName, { designSystem });
}

function parseAIResponse(response) {
  // Parse the AI response to extract different files
  const files = {};

  // Simple parsing - look for file markers
  const filePattern = /```(?:tsx?|typescript|jsx?)?\s*\/\/ ([\w\/.-]+)\n([\s\S]*?)```/g;
  let match;

  while ((match = filePattern.exec(response)) !== null) {
    const filePath = match[1];
    const content = match[2].trim();
    files[filePath] = content;
  }

  // If no files found, treat entire response as App.tsx
  if (Object.keys(files).length === 0) {
    files['App.tsx'] = response.replace(/```[^`]*```/g, '').trim();
  }

  return files;
}

function generateFallbackApp(prompt, appName, designSystem = 'ingka') {
  const useIngka = designSystem === 'ingka' || designSystem === 'cwds';
  const ikeaClasses = useIngka ? {
    background: 'bg-white',
    primary: 'bg-[#0046be]',
    accent: 'bg-[#fdc935]',
    text: 'text-[#0046be]',
    card: 'bg-white border-gray-200 shadow-sm rounded-lg',
    button: 'bg-[#0046be] hover:bg-[#003399] text-white rounded-lg px-6 py-3 font-medium transition-colors'
  } : {
    background: 'bg-background',
    primary: 'bg-primary',
    accent: 'bg-accent',
    text: 'text-foreground',
    card: '',
    button: ''
  };

  return {
    'App.tsx': `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function App() {
  return (
    <div className="min-h-screen ${ikeaClasses.background} p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight ${ikeaClasses.text}">
            ${appName}
          </h1>
          <p className="text-xl text-gray-600">
            ${prompt}
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Generated by Ingvar Spark</Badge>
            ${useIngka ? '<Badge className="bg-[#fdc935] text-[#0046be] hover:bg-[#e6b82f]">IKEA Design</Badge>' : ''}
          </div>
        </header>

        <Card className="${ikeaClasses.card}">
          <CardHeader>
            <CardTitle className="${ikeaClasses.text}">🚀 Your App is Ready!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">This is your generated Spark app${useIngka ? ' with IKEA\'s Swedish minimalist design' : ''}. Start building amazing things!</p>
            <Button className="${ikeaClasses.button}">Get Started</Button>
          </CardContent>
        </Card>

  ${useIngka ? `
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="${ikeaClasses.card}">
            <CardHeader>
              <CardTitle className="${ikeaClasses.text}">🇸🇪 Swedish Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Built with IKEA's minimalist design principles - clean, functional, and accessible.</p>
            </CardContent>
          </Card>

          <Card className="${ikeaClasses.card}">
            <CardHeader>
              <CardTitle className="${ikeaClasses.text}">🎨 Brand Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded ${ikeaClasses.primary}"></div>
                <span className="text-sm text-gray-600">Swedish Blue (#0046be)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded ${ikeaClasses.accent}"></div>
                <span className="text-sm text-gray-600">Swedish Yellow (#fdc935)</span>
              </div>
            </CardContent>
          </Card>
        </div>
        ` : ''}
      </div>
    </div>
  );
}

export default App;`
  };
}

async function writeGeneratedFiles(appPath, files) {
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(appPath, 'src', filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf8');
    console.log(chalk.green('✅'), `Generated ${filePath}`);
  }
}

async function applyIngkaSkapaDesignSystem(appPath) {
  console.log(chalk.yellow('\n🇸🇪 Installing IKEA Ingka Skapa Design System...\n'));

  try {
    // 1. Configure Ingka registry
    console.log(chalk.gray('📦 Configuring Ingka registry...'));
    const npmrcPath = path.join(appPath, '.npmrc');
    const npmrcContent = '@ingka:registry=https://npm.m2.blue.cdtapps.com\n';
    await fs.writeFile(npmrcPath, npmrcContent, 'utf8');
    console.log(chalk.green('✅'), 'Configured Ingka registry');

    // 2. Read .ux-ingkarc.json to check install-components setting
    const configManager = require('../utils/config-manager');
    const designSystemConfig = configManager.get('design-system') || {};
    const shouldInstallComponents = designSystemConfig['install-components'] !== false; // Default: true

    // 3. Install IKEA components using the component installer
    if (shouldInstallComponents) {
      // Save current directory
      const originalCwd = process.cwd();

      // Change to app directory for component installation
      process.chdir(appPath);

      const componentsCommand = require('./components');

      // Install essential IKEA Ingka Skapa components for Spark apps
      await componentsCommand({
        action: 'install',
        components: [
          'button', 'card', 'input-field', 'text', 'grid',
          'loading', 'badge', 'modal', 'tabs', 'checkbox', 'select'
        ],
        outputDir: 'src/components/ingka',
        installDesignTokens: true,
        installTailwindConfig: false,
        nonInteractive: true
      });

      // Change back to original directory
      process.chdir(originalCwd);

      console.log(chalk.green('✅'), 'Installed IKEA Ingka Skapa components');
    } else {
      console.log(chalk.gray('📦 Skipping component installation (install-components: false in .ux-ingkarc.json)'));
      console.log(chalk.yellow('   Install manually with:'), chalk.cyan('ux-ingka components install\n'));
    }

    // 4. Create example component showcasing Ingka usage
    // FIX for GitHub issue #18: Use real, working components with proper imports
    const exampleComponent = `import { Button } from '@ingka/button';
import { Card } from '@ingka/card';
import { List } from '@ingka/list';
import { Badge } from '@ingka/badge';
import { Icon } from '@ingka/ssr-icon';

/**
 * Example component using official IKEA Ingka components
 * Generated by UX Ingka Kit
 *
 * IMPORTANT: Icon Paths Changed in @ingka/ssr-icon v11.1.0+
 * - Old: 'reload' → New: 'arrow-clockwise'
 * - Old: 'search' → New: 'magnifying-glass'
 * See INGKA_ICON_MIGRATION.md for complete mapping
 */
export function IngkaExample() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>IKEA Ingka Design System Examples</h1>
      <p>Official Skapa components working out of the box</p>

      {/* Button Examples */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Button type="primary" text="Primary Button" />
          <Button type="secondary" text="Secondary Button" />
          <Button type="primary" text="With Icon" ssrIcon={{
            svg: 'arrow-clockwise',  // NOTE: Updated icon path for ssr-icon
            size: '24px'
          }} />
        </div>
      </section>

      {/* List Example with CSS Reset */}
      <section style={{ marginTop: '2rem' }}>
        <h2>List</h2>
        {/* IMPORTANT: @ingka/list requires CSS reset */}
        <List
          style={{
            listStyle: 'none',  // Required
            margin: 0,          // Required
            padding: 0          // Required
          }}
        >
          <List.Item>First item</List.Item>
          <List.Item>Second item</List.Item>
          <List.Item>Third item</List.Item>
        </List>
      </section>

      {/* Card Example */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Card</h2>
        <Card style={{ padding: '1.5rem' }}>
          <h3>Card Title</h3>
          <p>This is a working example of the @ingka/card component.</p>
          <Button type="secondary" text="Learn More" />
        </Card>
      </section>

      {/* Badge Examples */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Badges</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge text="New" variant="info" />
          <Badge text="Limited" variant="warning" />
          <Badge text="Popular" variant="success" />
        </div>
      </section>

      {/* Icon Examples */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Icons (@ingka/ssr-icon)</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Icon svg="arrow-clockwise" size="24px" colour="#111" />
          <Icon svg="magnifying-glass" size="24px" colour="#111" />
          <Icon svg="heart" size="24px" colour="#111" />
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Note: Icon paths changed in v11.1.0+ (reload → arrow-clockwise, etc.)
        </p>
      </section>
    </div>
  );
}
`;

    const examplePath = path.join(appPath, 'src', 'components', 'IngkaExample.tsx');
    await fs.ensureDir(path.dirname(examplePath));
    await fs.writeFile(examplePath, exampleComponent, 'utf8');
    console.log(chalk.green('✅'), 'Created Ingka example component');

    // 5. Create IKEA design tokens file for reference
    const tokensPath = path.join(appPath, 'src', 'lib', 'ikea-design-tokens.ts');
    await fs.ensureDir(path.dirname(tokensPath));
    await fs.writeFile(tokensPath, `// IKEA Ingka Skapa Design System Tokens
// Generated by Ingvar Spark

export const IKEA_TOKENS = ${JSON.stringify(IKEA_DESIGN_TOKENS, null, 2)};

// Usage examples:
// className="bg-ikea-blue text-white"
// className="bg-ikea-yellow text-ikea-blue"
// className="bg-ikea-gray-50 border border-ikea-gray-200"
`, 'utf8');
    console.log(chalk.green('✅'), 'Created IKEA design tokens reference');

    // 6. Create CSS imports file for IKEA components
    const cssImportsPath = path.join(appPath, 'src', 'styles', 'ingka.css');
    await fs.ensureDir(path.dirname(cssImportsPath));
    await fs.writeFile(cssImportsPath, `/* IKEA Ingka Skapa Design System Styles */
/* Auto-generated by Ingvar Spark */

/* Base Styles */
@import "@ingka/base/dist/style.css";

/* Component Styles */
@import "@ingka/button/dist/style.css";
@import "@ingka/card/dist/style.css";
@import "@ingka/input-field/dist/style.css";
@import "@ingka/text/dist/style.css";
@import "@ingka/grid/dist/style.css";
@import "@ingka/loading/dist/style.css";
@import "@ingka/badge/dist/style.css";
@import "@ingka/modal/dist/style.css";
@import "@ingka/tabs/dist/style.css";
@import "@ingka/checkbox/dist/style.css";
@import "@ingka/select/dist/style.css";

/* Design Tokens */
@import "@ingka/focus/dist/style.css";
@import "@ingka/svg-icon/dist/style.css";
`, 'utf8');
    console.log(chalk.green('✅'), 'Created IKEA CSS imports file');

    // 7. Update main CSS to import IKEA styles
    const mainCSSPath = path.join(appPath, 'src', 'index.css');
    if (await fs.pathExists(mainCSSPath)) {
      const currentCSS = await fs.readFile(mainCSSPath, 'utf8');
      if (!currentCSS.includes('./styles/ingka.css')) {
        const updatedCSS = `@import './styles/ingka.css';\n\n${currentCSS}`;
        await fs.writeFile(mainCSSPath, updatedCSS, 'utf8');
        console.log(chalk.green('✅'), 'Updated index.css to import IKEA styles');
      }
    }

    // 8. Create comprehensive INGKA_README.md
    const ingkaReadme = `# IKEA Ingka Design System Usage

This app uses the official IKEA Ingka Skapa Design System.

## Quick Start

### Import Components

\`\`\`tsx
import { Button } from '@ingka/button';
import { Card } from '@ingka/card';
import { List } from '@ingka/list';
import { Badge } from '@ingka/badge';
import { Icon } from '@ingka/ssr-icon';
\`\`\`

### Working Example

See \`src/components/IngkaExample.tsx\` for working usage examples.

## Common Issues

### List Component CSS Reset

The \`@ingka/list\` component requires CSS reset:

\`\`\`tsx
<List style={{ listStyle: 'none', margin: 0, padding: 0 }}>
  <List.Item>Item 1</List.Item>
</List>
\`\`\`

### Icon Migration (@ingka/icon → @ingka/ssr-icon)

Icon paths changed in v11.1.0+. See \`INGKA_ICON_MIGRATION.md\` for complete mapping.

**Quick Reference:**
- \`reload\` → \`arrow-clockwise\`
- \`search\` → \`magnifying-glass\`
- \`close\` → \`xmark\`
- \`menu\` → \`bars\`

## Documentation

- [Ingka Skapa Documentation](https://npm.m2.blue.cdtapps.com)
- [Icon Library](https://npm.m2.blue.cdtapps.com/@ingka/ssr-icon)
`;

    const readmePath = path.join(appPath, 'INGKA_README.md');
    await fs.writeFile(readmePath, ingkaReadme, 'utf8');
    console.log(chalk.green('✅'), 'Created INGKA_README.md');

    // 9. Create INGKA_ICON_MIGRATION.md
    const iconMigrationGuide = `# Icon Migration Guide: @ingka/icon → @ingka/ssr-icon

## Overview

IKEA has migrated from \`@ingka/icon\` (deprecated) to \`@ingka/ssr-icon\` v11.1.0+.
Many icon paths have changed.

## Quick Migration

### 1. Update Package

\`\`\`bash
npm uninstall @ingka/icon
npm install @ingka/ssr-icon@^11.1.0
\`\`\`

### 2. Update Imports

\`\`\`tsx
// Old
import { Icon } from '@ingka/icon';

// New
import { Icon } from '@ingka/ssr-icon';
\`\`\`

### 3. Update Icon Paths

| Old (\`@ingka/icon\`)   | New (\`@ingka/ssr-icon\`)       |
|---------------------|-----------------------------|
| \`reload\`          | \`arrow-clockwise\`         |
| \`search\`          | \`magnifying-glass\`        |
| \`close\`           | \`xmark\`                   |
| \`menu\`            | \`bars\`                    |
| \`cart\`            | \`cart-shopping\`           |
| \`settings\`        | \`gear\`                    |

See \`src/components/IngkaExample.tsx\` for working examples.
`;

    const migrationPath = path.join(appPath, 'INGKA_ICON_MIGRATION.md');
    await fs.writeFile(migrationPath, iconMigrationGuide, 'utf8');
    console.log(chalk.green('✅'), 'Created icon migration guide');

    console.log(chalk.green('\n✅ IKEA Ingka Skapa Design System installed successfully!\n'));
    console.log(chalk.blue('ℹ️  You can now import IKEA components:'));
    console.log(chalk.gray('   import { Button } from \'@ingka/button\';'));
    console.log(chalk.gray('   import { Card } from \'@ingka/card\';'));
    console.log(chalk.gray('   import { Icon } from \'@ingka/ssr-icon\';'));
    console.log(chalk.gray('   import { IKEA_DESIGN_TOKENS } from \'./lib/ikea-design-tokens\';\n'));
    console.log(chalk.gray('📖 See INGKA_README.md and INGKA_ICON_MIGRATION.md for details\n'));

  } catch (error) {
    console.log(chalk.yellow('⚠️  Warning: Could not apply all IKEA design system changes'));
    console.log(chalk.gray(`Error: ${error.message}`));
    console.log(chalk.gray('\nYou can install IKEA components manually with:'));
    console.log(chalk.cyan('   ux-ingka components install\n'));
  }
}

async function applyCWDSDesignSystem(appPath) {
  console.log(chalk.yellow('\n🏢 Installing IKEA CWDS (extends Ingka Skapa)...\n'));

  try {
    // Install CWDS components using the CWDS installer
    const { CWDSInstaller } = require('../components/cwds-installer');
    const cwdsInstaller = new CWDSInstaller(appPath);

    // Auto-select recommended CWDS components for Spark apps
    cwdsInstaller.selectedComponents = [
      'cwds-react-layout',
      'iloff-layout-react',
      'cwds-react-header',
      'cwds-react-app-switcher',
      'cwds-react-mobile-navigation',
      'cwds-react-nav-menu',
      'cwds-react-user-profile',
      'cwds-variables'
    ];
    cwdsInstaller.authProvider = 'auth0'; // Default to Auth0

    await cwdsInstaller.install();

    console.log(chalk.green('\n✅ IKEA CWDS installed successfully!\n'));
    console.log(chalk.blue('ℹ️  You can now import CWDS components:'));
    console.log(chalk.gray('   import { CWDSLayout } from \'@ingka-group-digital/cwds-react-layout\';'));
    console.log(chalk.gray('   import { GlobalHeader } from \'@ingka-group-digital/cwds-react-header\';'));
    console.log(chalk.gray('   import { AppSwitcher } from \'@ingka-group-digital/cwds-react-app-switcher\';\n'));

  } catch (error) {
    console.log(chalk.yellow('⚠️  Warning: Could not apply all CWDS changes'));
    console.log(chalk.gray(`Error: ${error.message}`));
    console.log(chalk.gray('\nYou can install CWDS components manually with:'));
    console.log(chalk.cyan('   ux-ingka cwds install\n'));
  }
}

/**
 * Export Spark function (called from CLI)
 */
module.exports = async function spark(options = {}) {
  console.clear();
  console.log(banner);

  console.log(chalk.cyan('🚀 Ingvar Spark - Rapid App Generator with IKEA Ingka Skapa\n'));

  // Check if ux-ingka init has been run
  try {
    const configManager = require('../utils/config-manager');
    const designSystemConfig = configManager.get('design-system');

    if (!designSystemConfig || !designSystemConfig.enabled) {
      console.log(chalk.yellow('⚠️  Spark requires project initialization first!\n'));
      console.log(chalk.blue('ℹ️  Run this command to set up your project:\n'));
      console.log(chalk.cyan('   ux-ingka init\n'));
      console.log(chalk.gray('   This will configure:'));
      console.log(chalk.gray('   • IKEA design system (Ingka Skapa or CWDS)'));
      console.log(chalk.gray('   • Project structure and dependencies'));
      console.log(chalk.gray('   • VS Code integration'));
      console.log(chalk.gray('   • GitHub workflow (optional)\n'));

      const { shouldInit } = await inquirer.prompt([{
        type: 'confirm',
        name: 'shouldInit',
        message: 'Would you like to run ux-ingka init now?',
        default: true
      }]);

      if (shouldInit) {
        const initCommand = require('./init');
        await initCommand({ nonInteractive: false });
        console.log(chalk.green('\n✅ Initialization complete! Now running Spark...\n'));
      } else {
        console.log(chalk.yellow('\n❌ Spark cancelled. Run "ux-ingka init" when ready.\n'));
        process.exit(0);
      }
    }
  } catch (error) {
    console.log(chalk.yellow('⚠️  Warning: Could not verify project initialization'));
    console.log(chalk.gray('Continuing with Spark generation...\n'));
  }

  console.log(chalk.blue('ℹ️  Generate React apps with IKEA components:\n'));
  console.log(chalk.gray('   • Ingka Skapa (72 components) - Customer-facing apps'));
  console.log(chalk.gray('   • Optional: Add CWDS (10+ components) for internal tools\n'));

  try {
    // PHASE 1: Get design system from config (set by ux-ingka init)
    const designSystem = await getDesignSystemConfig(options);

    // PHASE 2: Get app description and name (voice-friendly, after setup)
    const config = await getAppRequirements(options, designSystem);

    // PHASE 3: Generate the Spark app
    await generateSparkApp(config);

  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message);
    console.log(chalk.gray('\nIf the problem persists, try:'));
    console.log(chalk.cyan('   ux-ingka spark --help'));
    process.exit(1);
  }
};
