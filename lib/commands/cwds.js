#!/usr/bin/env node

const chalk = require('chalk');
const ora = require('ora');
const { CWDSInstaller } = require('../components/cwds-installer');

/**
 * CWDS Command - Install Co-Worker Design Subsystem components
 *
 * Usage:
 *   ux-ingka cwds install           # Interactive installation
 *   ux-ingka cwds install --auto    # Auto-install recommended components
 *   ux-ingka cwds list              # List available components
 */

async function cwdsCommand(action = 'install', options = {}) {
  // DEPRECATED: This command is deprecated in favor of 'ux-ingka components'
  console.log(chalk.yellow('\n⚠️  The "ux-ingka cwds" command is deprecated.\n'));
  console.log(chalk.cyan('Use the unified component installer instead:\n'));
  console.log(chalk.white('  ux-ingka components --mode essential   ') + chalk.gray('# Install 23 essential components'));
  console.log(chalk.white('  ux-ingka components --mode all         ') + chalk.gray('# Install all 72 components'));
  console.log(chalk.white('  ux-ingka components --mode cherry-pick ') + chalk.gray('# Choose components interactively'));
  console.log(chalk.cyan('\nBenefits of the unified installer:'));
  console.log(chalk.gray('  ✓ Uses official @ingka/* npm packages'));
  console.log(chalk.gray('  ✓ Automatic registry configuration'));
  console.log(chalk.gray('  ✓ Better error handling'));
  console.log(chalk.gray('  ✓ Includes both Skapa and CWDS components'));
  console.log(chalk.gray('\n📚 Documentation: https://skapa.ikea.com\n'));
}

module.exports = cwdsCommand;
