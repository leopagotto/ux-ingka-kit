#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Co-Worker Design System (CWDS) Template Installer
 *
 * INSTALLATION PRIORITY:
 * 1. FIRST: Try to install official @ingka/* npm packages
 * 2. FALLBACK: Copy local React/TypeScript templates
 *
 * IMPORTANT: CWDS is a design specification, NOT an npm package ecosystem.
 * This installer provides local templates as fallback when official packages
 * aren't available. Templates use real @ingka/* UI primitives.
 *
 * @see https://www.figma.com/design/Zec1eGMCNeB0IkPMWs35qx/Ingka-Co-worker-Design-Components
 */

// Available CWDS Templates
// NOTE: Templates use inline SVG icons as fallbacks, no external icon package required
// If you have IKEA Artifactory access, you can optionally use @ingka/ssr-icon
const CWDS_TEMPLATES = [
  {
    name: 'GlobalHeader',
    file: 'GlobalHeader.tsx',
    description: 'Main navigation bar with menu, search, notifications, profile, app switcher',
    figmaNode: '301:142',
    dependencies: [], // No external deps - uses inline SVGs
    optionalDeps: ['@ingka/ssr-icon'] // Only with Artifactory access
  },
  {
    name: 'NavigationMenu',
    file: 'NavigationMenu.tsx',
    description: 'Side navigation menu with expandable items',
    figmaNode: '702:2930',
    dependencies: [], // No external deps - uses inline SVGs
    optionalDeps: ['@ingka/ssr-icon']
  },
  {
    name: 'AppSwitcher',
    file: 'AppSwitcher.tsx',
    description: 'Modal for switching between IKEA internal applications',
    figmaNode: '702:2931',
    dependencies: [] // No external deps - standalone component
  },
  {
    name: 'Profile',
    file: 'Profile.tsx',
    description: 'User profile dropdown with account info and sign out',
    figmaNode: '2941:96',
    dependencies: [] // No external deps - standalone component
  },
  {
    name: 'BottomBarNavigation',
    file: 'BottomBarNavigation.tsx',
    description: 'Mobile bottom navigation bar',
    figmaNode: '2941:97',
    dependencies: [], // No external deps - uses inline SVGs
    optionalDeps: ['@ingka/ssr-icon']
  }
];

/**
 * Install CWDS templates to target project
 * @param {string} targetDir - Target directory
 * @param {object} options - Installation options
 * @param {boolean} options.silent - Suppress console output
 * @param {string[]} options.components - Specific components to install (names)
 * @param {boolean} options.interactive - Show interactive component selection
 */
async function installCWDSTemplates(targetDir, options = {}) {
  const silent = options.silent || false;
  let selectedTemplates = CWDS_TEMPLATES;

  // Interactive component selection
  if (options.interactive && !silent) {
    const { components } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'components',
        message: 'Select CWDS components to install:',
        choices: CWDS_TEMPLATES.map(t => ({
          name: `${t.name} - ${t.description}`,
          value: t.name,
          checked: true // All selected by default
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one component.';
          }
          return true;
        }
      }
    ]);

    selectedTemplates = CWDS_TEMPLATES.filter(t => components.includes(t.name));
  }
  // Specific components provided programmatically
  else if (options.components && Array.isArray(options.components)) {
    selectedTemplates = CWDS_TEMPLATES.filter(t =>
      options.components.includes(t.name) || options.components.includes(t.file)
    );
  }

  try {
    if (!silent) {
      console.log(chalk.cyan('\n📦 Installing CWDS Component Templates\n'));
      console.log(chalk.blue('💡 Installation Priority:'));
      console.log(chalk.gray('   1. FIRST: Try official @ingka/* npm packages (recommended)'));
      console.log(chalk.gray('   2. FALLBACK: Use local templates (what we\'re doing now)\n'));
      console.log(chalk.yellow('⚠️  Tip: Check npm registry first:'));
      console.log(chalk.gray('   npm search @ingka/global-header\n'));

      if (selectedTemplates.length < CWDS_TEMPLATES.length) {
        console.log(chalk.gray(`   Installing ${selectedTemplates.length} of ${CWDS_TEMPLATES.length} available components\n`));
      }
    }

    // Determine source and target directories
    const templatesSource = path.join(__dirname, '../../templates/cwds-components');
    const componentsTarget = path.join(targetDir, 'src/components/cwds');

    // Check if source templates exist
    if (!await fs.pathExists(templatesSource)) {
      throw new Error(`CWDS templates not found at: ${templatesSource}`);
    }

    // Create target directory
    await fs.ensureDir(componentsTarget);

    // Copy selected template files
    if (!silent) {
      console.log(chalk.cyan('📋 Copying CWDS component templates...\n'));
    }

    let copiedCount = 0;

    for (const template of selectedTemplates) {
      const sourcePath = path.join(templatesSource, template.file);
      const targetPath = path.join(componentsTarget, template.file);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
        if (!silent) {
          console.log(chalk.green(`   ✓ ${template.name}`));
          console.log(chalk.gray(`     ${template.description}`));
        }
        copiedCount++;
      } else {
        if (!silent) {
          console.log(chalk.yellow(`   ⚠ ${template.name} - Template not found`));
        }
      }
    }

    // Copy supporting files
    if (!silent) {
      console.log(chalk.cyan('\n📄 Copying supporting files...\n'));
    }

    // Copy styles directory
    const stylesSource = path.join(templatesSource, 'styles');
    const stylesTarget = path.join(componentsTarget, 'styles');
    if (await fs.pathExists(stylesSource)) {
      await fs.copy(stylesSource, stylesTarget);
      if (!silent) {
        console.log(chalk.green('   ✓ Design tokens (styles/cwds-tokens.css)'));
      }
    }

    // Copy README
    const readmeSource = path.join(templatesSource, 'README.md');
    const readmeTarget = path.join(componentsTarget, 'README.md');
    if (await fs.pathExists(readmeSource)) {
      await fs.copy(readmeSource, readmeTarget);
      if (!silent) {
        console.log(chalk.green('   ✓ Documentation (README.md)'));
      }
    }

    // Generate index.ts with only selected components
    const indexContent = selectedTemplates.map(t =>
      `export { ${t.name}, type ${t.name}Props } from './${t.file.replace('.tsx', '')}';`
    ).join('\n');

    const indexTarget = path.join(componentsTarget, 'index.ts');
    await fs.writeFile(indexTarget, indexContent);
    if (!silent) {
      console.log(chalk.green('   ✓ Barrel exports (index.ts)'));
    }

    // Collect unique dependencies and optional dependencies from selected templates
    const allDependencies = new Set();
    const allOptionalDeps = new Set();
    selectedTemplates.forEach(template => {
      template.dependencies.forEach(dep => allDependencies.add(dep));
      if (template.optionalDeps) {
        template.optionalDeps.forEach(dep => allOptionalDeps.add(dep));
      }
    });

    if (!silent) {
      // Only show dependencies if there are required ones
      if (allDependencies.size > 0) {
        console.log(chalk.cyan('\n📦 Required dependencies:\n'));
        console.log(chalk.gray('   Run this command to install them:\n'));
        console.log(chalk.white(`   npm install ${Array.from(allDependencies).join(' ')}\n`));
      } else {
        console.log(chalk.green('\n✅ No external dependencies required!'));
        console.log(chalk.gray('   Components use inline SVG icons and work out of the box.\n'));
      }

      // Show optional dependencies (IKEA Artifactory)
      if (allOptionalDeps.size > 0) {
        console.log(chalk.cyan('📦 Optional (requires IKEA Artifactory access):'));
        console.log(chalk.gray(`   ${Array.from(allOptionalDeps).join(', ')}`));
        console.log(chalk.gray('   For official IKEA icons, configure your .npmrc for Artifactory.\n'));
      }

      console.log(chalk.green(`\n✨ Success! Copied ${copiedCount} CWDS component template${copiedCount > 1 ? 's' : ''}\n`));
      console.log(chalk.cyan('📍 Templates location:'));
      console.log(chalk.gray(`   ${componentsTarget}\n`));

      console.log(chalk.cyan('📖 Usage:'));
      console.log(chalk.gray('   import { GlobalHeader } from \'./components/cwds\';'));
      console.log(chalk.gray('   <GlobalHeader appName="My App" />\n'));

      console.log(chalk.cyan('🔗 Design Source:'));
      console.log(chalk.gray('   https://www.figma.com/design/Zec1eGMCNeB0IkPMWs35qx/Ingka-Co-worker-Design-Components\n'));
    }

    return {
      success: true,
      copiedCount,
      targetDir: componentsTarget,
      dependencies: Array.from(allDependencies),
      components: selectedTemplates.map(t => t.name)
    };

  } catch (error) {
    if (!silent) {
      console.error(chalk.red(`\n❌ Error installing CWDS templates: ${error.message}\n`));
    }
    throw error;
  }
}/**
 * Display CWDS templates information
 */
function displayTemplatesInfo() {
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║         CWDS Component Templates                          ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝\n'));

  console.log(chalk.green('✅ Components work out of the box - no external dependencies required!\n'));
  console.log(chalk.gray('Templates use inline SVG icons and self-contained styles.\n'));

  console.log(chalk.cyan('Available Templates:\n'));

  CWDS_TEMPLATES.forEach((template, index) => {
    console.log(chalk.white(`${index + 1}. ${chalk.bold(template.name)}`));
    console.log(chalk.gray(`   ${template.description}`));
    console.log(chalk.gray(`   Figma: ${template.figmaNode}`));
    if (template.optionalDeps && template.optionalDeps.length > 0) {
      console.log(chalk.gray(`   Optional (Artifactory): ${template.optionalDeps.join(', ')}`));
    }
    console.log('');
  });

  console.log(chalk.cyan('Documentation:'));
  console.log(chalk.gray('  • README.md - Usage examples and integration guide'));
  console.log(chalk.gray('  • CWDS_FIGMA_SPECS.md - Extracted Figma specifications'));
  console.log(chalk.gray('  • cwds-tokens.css - Design tokens (colors, spacing)\n'));
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'info' || command === '--info' || command === '-i') {
    displayTemplatesInfo();
    return;
  }

  if (command === '--help' || command === '-h') {
    console.log(chalk.cyan('\nCWDS Template Installer\n'));
    console.log(chalk.white('Usage:'));
    console.log(chalk.gray('  cwds-installer [target-directory] [options]'));
    console.log(chalk.gray('  cwds-installer info              Show available templates'));
    console.log(chalk.gray('  cwds-installer --help            Show this help\n'));
    console.log(chalk.white('Options:'));
    console.log(chalk.gray('  --interactive, -i                Select specific components to install'));
    console.log(chalk.gray('  --components <names>             Install specific components (comma-separated)\n'));
    console.log(chalk.white('Examples:'));
    console.log(chalk.gray('  cwds-installer .                 Install all components to current directory'));
    console.log(chalk.gray('  cwds-installer . --interactive   Choose components interactively'));
    console.log(chalk.gray('  cwds-installer . --components GlobalHeader,Profile'));
    console.log(chalk.gray('  cwds-installer /path/to/app      Install to specific directory'));
    console.log(chalk.gray('  cwds-installer info              List available templates\n'));
    return;
  }

  // Parse arguments
  const targetDir = args.find(arg => !arg.startsWith('--')) || process.cwd();
  const interactive = args.includes('--interactive') || args.includes('-i');
  const componentsIndex = args.indexOf('--components');
  const specificComponents = componentsIndex !== -1 && args[componentsIndex + 1]
    ? args[componentsIndex + 1].split(',').map(c => c.trim())
    : null;

  await installCWDSTemplates(targetDir, {
    interactive,
    components: specificComponents
  });
}

// Export for programmatic use
module.exports = {
  installCWDSTemplates,
  displayTemplatesInfo,
  CWDS_TEMPLATES
};

// CLI execution
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('\n❌ Fatal error:'), error.message);
    process.exit(1);
  });
}
