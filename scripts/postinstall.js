#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');

// Read version from package.json
const getVersion = () => {
  try {
    const packageJson = require(path.join(__dirname, '../package.json'));
    return packageJson.version;
  } catch (error) {
    return '2.6.2'; // Fallback version
  }
};

// Helper function to center text within box (67 chars wide inside border)
const centerInBox = (text) => {
  const boxWidth = 67;
  const strippedLength = text.replace(/\u001b\[[0-9;]*m/g, '').length; // Remove ANSI codes
  const totalPadding = boxWidth - strippedLength;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
};

// Determine if this is a global or local install
const isGlobalInstall = () => {
  const npmPrefix = process.env.npm_config_prefix || '';
  const localPath = process.env.npm_config_local_prefix || '';
  return npmPrefix && localPath && npmPrefix !== localPath;
};

// Check if we're in a git repository
const isGitRepo = () => {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Check if UX Ingka is already initialized
const isUxIngkaInitialized = () => {
  return fs.existsSync('.github/ISSUE_TEMPLATE') ||
         fs.existsSync('docs/specs') ||
         fs.existsSync('.github/copilot-instructions.md');
};

const version = getVersion();

// Golden gradient ASCII art for UX INGKA KIT
const uxIngkaLine1 = '  ' + chalk.hex('#FFD700')('██╗███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗         ██╗  ██╗██╗████████╗') + '  ';
const uxIngkaLine2 = '  ' + chalk.hex('#FFC700')('██║████╗  ██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗        ██║ ██╔╝██║╚══██╔══╝') + '  ';
const uxIngkaLine3 = '  ' + chalk.hex('#FFB700')('██║██╔██╗ ██║██║  ███╗██║   ██║███████║██████╔╝        █████╔╝ ██║   ██║   ') + '  ';
const uxIngkaLine4 = '  ' + chalk.hex('#FFA500')('██║██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║██╔══██╗        ██╔═██╗ ██║   ██║   ') + '  ';
const uxIngkaLine5 = '  ' + chalk.hex('#FF9500')('██║██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║██║  ██║███████╗██║  ██╗██║   ██║   ') + '  ';
const uxIngkaLine6 = '  ' + chalk.hex('#FF8C00')('╚═╝╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ') + '  ';

const simpleMessage = `
${chalk.hex('#FFD700')('╔═══════════════════════════════════════════════════════════════════════════════╗')}
${chalk.hex('#FFD700')('║')}${centerInBox('')}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}\$\{uxIngkaLine1}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}\$\{uxIngkaLine2}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}\$\{uxIngkaLine3}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}\$\{uxIngkaLine4}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}\$\{uxIngkaLine5}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}\$\{uxIngkaLine6}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}${centerInBox('')}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}${centerInBox(chalk.hex('#FFD700')('💪 AI-Powered Workflow Automation with IKEA Design System 🇸🇪'))}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}${centerInBox(chalk.gray(`Version ${version}`))}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('║')}${centerInBox(chalk.gray('Made with ❤️ by F&CS XD Team'))}${chalk.hex('#FFD700')('║')}
${chalk.hex('#FFD700')('╚═══════════════════════════════════════════════════════════════════════════════╝')}

${chalk.green.bold('✨ Installation Complete! ✨')}

${chalk.white('Transform your development workflow with spec-driven development:')}
  ${chalk.hex('#FFD700')('•')} Multi-agent system (6 specialized agents, all enabled by default)
  ${chalk.hex('#FF9500')('•')} Multi-AI support (Copilot, Cursor, Cline, Codeium)
  ${chalk.hex('#FFD700')('•')} Spec-driven development methodology
  ${chalk.hex('#FF9500')('•')} Automated GitHub Projects integration
  ${chalk.hex('#FFD700')('•')} Comprehensive issue & PR templates
  ${chalk.hex('#FF9500')('•')} Smart label management
  ${chalk.hex('#FFD700')('•')} AI-optimized workflow instructions

${chalk.hex('#FFD700')('─────────────────────────────────────────────────────────────────────')}

${chalk.hex('#FFD700').bold('🚀 Quick Start:')}

  ${chalk.white.bold('1.')} ${chalk.hex('#FF9500')('ux-ingka --version')}        ${chalk.gray('→ Verify installation')}
  ${chalk.white.bold('2.')} ${chalk.hex('#FF9500')('ux-ingka welcome')}          ${chalk.gray('→ View complete guide')}
  ${chalk.white.bold('3.')} ${chalk.hex('#FF9500')('cd your-project')}      ${chalk.gray('→ Navigate to project')}
  ${chalk.white.bold('4.')} ${chalk.hex('#FF9500')('ux-ingka init')}            ${chalk.gray('→ Initialize workflow')}

${chalk.hex('#FFD700')('─────────────────────────────────────────────────────────────────────')}

${chalk.gray('📚 Documentation:')} ${chalk.blue.underline('https://github.com/leopagotto/ux-ingka-kit')}
`;

// Wrap in async IIFE to handle top-level await
(async () => {
  try {
    // Always show installation message
    console.log(simpleMessage);

    const isGlobal = isGlobalInstall();
    const inGitRepo = isGitRepo();
    const alreadyInitialized = isUxIngkaInitialized();

  // Create a marker file to indicate successful installation
  const homeDir = require('os').homedir();
  const configDir = path.join(homeDir, '.ux-ingka-workflow');

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const installFile = path.join(configDir, '.last-install');
  fs.writeFileSync(installFile, JSON.stringify({
    version: version,
    installedAt: new Date().toISOString(),
    installType: isGlobal ? 'global' : 'local'
  }, null, 2));

  // Check for auto-initialization flag
  const shouldAutoInit = process.env.UX_INGKA_AUTO_INIT === 'true';

  // Handle local install in a git repository
  if (!isGlobal && inGitRepo && !alreadyInitialized) {
    if (shouldAutoInit) {
      // Auto-initialize with non-interactive mode
      console.log(chalk.cyan.bold('\n🚀 Auto-initializing UX Ingka Kit...\n'));
      console.log(chalk.gray('This will set up:'));
      console.log(chalk.gray('  • Documentation structure (docs/specs/)'));
      console.log(chalk.gray('  • Issue & PR templates'));
      console.log(chalk.gray('  • GitHub Actions workflows'));
      console.log(chalk.gray('  • VS Code configuration'));
      console.log(chalk.gray('  • AI assistant instructions (Copilot by default)'));
      console.log(chalk.gray('  • GitHub labels\n'));

      try {
        // Run ux-ingka init with non-interactive mode
        const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');
        execSync(`node "${cliPath}" init --non-interactive --skip-project`, {
          stdio: 'inherit',
          env: { ...process.env, UX_INGKA_POSTINSTALL: 'true' }
        });

        console.log(chalk.green('\n✅ UX Ingka Kit initialized successfully!\n'));
        console.log(chalk.gray('Run ') + chalk.cyan('npx ux-ingka status') + chalk.gray(' to check your workflow\n'));
      } catch (error) {
        console.log(chalk.yellow('\n⚠️  Auto-initialization encountered an issue'));
        console.log(chalk.gray('You can manually initialize by running: ') + chalk.cyan('npx ux-ingka init\n'));
      }
    } else {
      // Show initialization prompt
      console.log(chalk.cyan.bold('\n🎯 Quick Setup Available!\n'));
      console.log(chalk.white('You installed UX Ingka Kit locally in a git repository.'));
      console.log(chalk.white('The workflow can be initialized automatically!\n'));
      console.log(chalk.gray('This will set up:'));
      console.log(chalk.gray('  • Documentation structure (docs/specs/)'));
      console.log(chalk.gray('  • Issue & PR templates'));
      console.log(chalk.gray('  • GitHub Actions workflows'));
      console.log(chalk.gray('  • VS Code configuration'));
      console.log(chalk.gray('  • AI assistant instructions (Copilot, Cursor, Cline, Codeium)'));
      console.log(chalk.gray('  • GitHub labels\n'));

      console.log(chalk.yellow('Options:\n'));
      console.log(chalk.cyan('  1.') + chalk.white(' Initialize now: ') + chalk.cyan.bold('npx ux-ingka init'));
      console.log(chalk.cyan('  2.') + chalk.white(' Auto-initialize on install: ') + chalk.cyan.bold('UX_INGKA_AUTO_INIT=true npm install'));
      console.log(chalk.cyan('  3.') + chalk.white(' Initialize later in your project directory\n'));

      console.log(chalk.gray('💡 Tip: Add UX_INGKA_AUTO_INIT=true to your .npmrc or package.json scripts for automatic setup\n'));
    }
  } else if (!isGlobal && inGitRepo && alreadyInitialized) {
    console.log(chalk.green('\n✅ UX Ingka Kit already initialized in this project!\n'));
    console.log(chalk.gray('Run ') + chalk.cyan('npx ux-ingka status') + chalk.gray(' to check your workflow\n'));
  } else if (isGlobal) {
    // Global install - show standard message (already shown above)
  } else if (!inGitRepo) {
    console.log(chalk.yellow('\n⚠️  Not in a git repository'));
    console.log(chalk.gray('Navigate to your project and run: ') + chalk.cyan('ux-ingka init\n'));
  }

  // ===== NEW: Offer component installation =====
  await offerComponentInstallation(isGlobal, inGitRepo);

  } catch (error) {
    // Silently fail if there are issues (e.g., during npm publish)
    console.error(chalk.yellow('Note: Could not complete post-install setup, but the CLI should still work.'));
  }
})(); // End async IIFE

/**
 * Check if package.json exists in current directory
 */
function hasPackageJson() {
  try {
    return fs.existsSync(path.join(process.cwd(), 'package.json'));
  } catch {
    return false;
  }
}

/**
 * Offer to install IKEA components
 */
async function offerComponentInstallation(isGlobal, inGitRepo) {
  // Only offer components for local installs in projects with package.json
  if (isGlobal || !hasPackageJson()) {
    return;
  }

  try {
    console.log(chalk.gray('─'.repeat(80)));
    console.log();
    console.log(chalk.hex('#FFD700').bold('📦 IKEA Skapa Components - Bundled with Ingvar Kit! 🎉'));
    console.log();
    console.log(chalk.green('  ✅ Good news! 64 Skapa components are now included with ingvar-kit.'));
    console.log(chalk.gray('     No separate installation needed!\n'));

    console.log(chalk.hex('#FFD700').bold('  📖 How to Use:\n'));
    console.log(chalk.white('  Option 1: Direct @ingka exports (Recommended)'));
    console.log(chalk.cyan('    import { Button, Card } from \'ingvar-kit/skapa/ingka-direct\';\n'));
    console.log(chalk.white('  Option 2: Simplified wrappers'));
    console.log(chalk.cyan('    import { Button, TextField } from \'ingvar-kit/skapa\';\n'));

    console.log(chalk.hex('#FFD700').bold('  🚀 Features:'));
    console.log(chalk.gray('    • 64 production-ready components'));
    console.log(chalk.gray('    • Tree-shakeable ES modules'));
    console.log(chalk.gray('    • 97% TypeScript coverage'));
    console.log(chalk.gray('    • Dual export options\n'));

    // Check if running non-interactively
    if (process.env.LEO_AUTO_INIT === 'true' || !process.stdin.isTTY) {
      console.log(chalk.yellow('  ℹ️  Run'), chalk.cyan('ingvar components'), chalk.yellow('for component installation options\n'));
      console.log(chalk.gray('─'.repeat(80)));
      return;
    }

    console.log(chalk.hex('#FFD700').bold('  📚 Documentation:'));
    console.log(chalk.gray('    • Component list: node_modules/ingvar-kit/lib/skapa-components/COMPONENT_STATUS.md'));
    console.log(chalk.gray('    • Full guide: https://github.com/leopagotto/ingvar-kit\n'));

    console.log(chalk.green.bold('  Ready to use! Start building with Skapa components. 🚀\n'));
    console.log(chalk.gray('─'.repeat(80)));

  } catch (error) {
    // If component info display fails, don't crash postinstall
    console.log(chalk.yellow('\n  ⚠️  Component info display skipped'));
    console.log(chalk.gray(`  Run ${chalk.cyan('ingvar components')} for more info
`));
    console.log(chalk.gray('─'.repeat(80)));
    if (process.env.DEBUG) console.error(error);
  }
}

