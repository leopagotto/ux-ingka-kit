#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');

// Only load banner utilities - these are lightweight
const { getBanner, welcomeMessage } = require('../lib/banner');
const { isFirstRun, markFirstRunComplete } = require('../lib/utils/first-run');

// Check if this is the first run and show welcome message
if (isFirstRun()) {
  console.log(welcomeMessage);
  markFirstRunComplete();
  console.log(chalk.gray('\n───────────────────────────────────────────────────────────────\n'));
}

program
  .name('ux-ingka')
  .description('UX Ingka Kit - CLI tool for setting up GitHub Projects workflow with spec-driven development following spec-driven development workflow')
  .version(packageJson.version);

// Get responsive banner
const banner = getBanner();

// PERFORMANCE OPTIMIZATION: Lazy load commands
// Commands are only loaded when actually invoked, reducing startup time from ~1.2s to <0.1s

// Init command - Set up complete workflow in current project
program
  .command('init')
  .description('Initialize UX Ingka workflow in current project')
  .option('-o, --org <organization>', 'GitHub organization name (optional for personal repos)')
  .option('-p, --project <number>', 'GitHub project number (optional)')
  .option('--skip-project', 'Skip GitHub Project setup entirely')
  .option('--skip-labels', 'Skip label setup')
  .option('--skip-vscode', 'Skip VS Code configuration')
  .option('--non-interactive', 'Run in non-interactive mode with defaults (for CI/CD or postinstall)')
  .action((options) => {
    console.log(banner);
    const initCommand = require('../lib/commands/init');
    initCommand(options);
  });

// Issue command - Create new issue with GitHub-native features (v4.1.0+)
program
  .command('issue')
  .alias('i')
  .description('Create a new issue with GitHub-native features (priorities, estimates, components)')
  .option('-t, --type <type>', 'Issue type (bug, enhancement, task, documentation)')
  .option('-T, --title <title>', 'Issue title')
  .option('-p, --priority <priority>', 'Priority (Critical, High, Medium, Low)')
  .option('-e, --estimate <points>', 'Story points (1, 2, 3, 5, 8, 13, 21)')
  .option('-c, --components <list>', 'Component labels (comma-separated: backend,frontend,database,devops,ux,documentation,api,infrastructure)')
  .option('-a, --assignee <username>', 'Assign to user')
  .option('--interactive', 'Use interactive mode (default: true)', true)
  .option('--no-interactive', 'Skip interactive prompts')
  .action((options) => {
    const issueCommand = require('../lib/commands/issue');
    issueCommand(options);
  });

// Labels command - Set up GitHub labels
program
  .command('labels')
  .alias('l')
  .description('Set up GitHub labels for workflow')
  .option('--clean', 'Remove default GitHub labels')
  .action((options) => {
    const labelsCommand = require('../lib/commands/labels');
    labelsCommand(options);
  });

// VS Code command - Set up VS Code configuration
program
  .command('vscode')
  .alias('vs')
  .description('Set up VS Code with Copilot instructions')
  .option('--global', 'Install globally (user settings)')
  .option('--project', 'Install for project only')
  .action((options) => {
    const vscodeCommand = require('../lib/commands/vscode');
    vscodeCommand(options);
  });

// Config command - Manage workflow configuration
program
  .command('config')
  .alias('cfg')
  .description('Manage workflow configuration settings')
  .allowUnknownOption()
  .action(() => {
    const args = process.argv.slice(3);
    const configCommand = require('../lib/commands/config');
    configCommand(args);
  });

// AI command - Generate GitHub Copilot instructions (v5.0.0+)
program
  .command('ai')
  .description('Generate GitHub Copilot instructions for repository')
  .option('--full', 'Generate complete instructions (all agents)')
  .option('--agent <name>', 'Generate instructions for specific agent (orchestrator, frontend, backend, devops, testing, documentation)')
  .option('--output <path>', 'Output path for generated instructions')
  .action((options) => {
    const aiCommand = require('../lib/commands/ai');
    aiCommand(options);
  });

// Agent command - Manage AI agents (v5.0.0+)
program
  .command('agent')
  .description('Manage AI agents (list, enable, disable)')
  .argument('[action]', 'Action: list, enable, disable')
  .argument('[name]', 'Agent name: orchestrator, frontend, backend, devops, testing, documentation')
  .action((action, name) => {
    const agentCommand = require('../lib/commands/agent');
    agentCommand(action, name);
  });

// GitHub command - GitHub operations
program
  .command('github')
  .alias('gh')
  .description('GitHub repository operations')
  .argument('[action]', 'Action to perform')
  .action((action) => {
    const githubCommand = require('../lib/commands/github');
    githubCommand(action);
  });

// GitHub Project command - Set up GitHub Projects
program
  .command('github-project')
  .alias('ghp')
  .description('Set up GitHub Projects workflow board')
  .option('-o, --org <organization>', 'GitHub organization name')
  .option('-n, --number <number>', 'Project number')
  .action((options) => {
    const githubProjectCommand = require('../lib/commands/github-project');
    githubProjectCommand(options);
  });

// Model command - Manage AI model selection (v5.0.0+)
program
  .command('model')
  .description('Manage AI model selection and testing')
  .argument('[action]', 'Action: list, status, test, select')
  .argument('[...args]', 'Additional arguments')
  .action((action, args) => {
    const modelCommand = require('../lib/commands/model');
    modelCommand(action, args);
  });

// Dashboard command - Real-time agent activity dashboard (v5.0.0+)
program
  .command('dashboard')
  .description('Launch real-time agent activity dashboard (v5.0.0)')
  .option('-p, --port <port>', 'Dashboard port (default: 3456)')
  .option('--no-open', 'Don\'t open browser automatically')
  .action((options) => {
    const DashboardCommands = require('../lib/commands/dashboard');
    DashboardCommands.start(options);
  });

// Plugin command - Manage plugins
program
  .command('plugin')
  .description('Manage UX Ingka plugins')
  .argument('[action]', 'Action: list, generate')
  .argument('[...args]', 'Additional arguments')
  .action((action, args) => {
    const PluginCommands = require('../lib/commands/plugin');
    if (action === 'list') {
      PluginCommands.list();
    } else if (action === 'generate') {
      PluginCommands.generate(args);
    } else {
      console.log(chalk.yellow('Unknown action. Available: list, generate'));
    }
  });

// Organize Docs command - Organize markdown files
program
  .command('organize-docs')
  .alias('org')
  .description('Organize documentation files into proper structure')
  .option('--validate', 'Only validate organization (dry run)')
  .option('--fix', 'Fix organization issues')
  .action((options) => {
    const { organizeDocs, validateDocs } = require('../lib/commands/organize-docs');
    if (options.validate) {
      validateDocs();
    } else {
      organizeDocs(options);
    }
  });

// Components command - Install IKEA components (v5.12.0+)
program
  .command('components')
  .alias('comp')
  .description('Install IKEA Ingka Skapa Design System components')
  .option('-m, --mode <mode>', 'Installation mode: essential, all, cherry-pick')
  .action((options) => {
    const componentsCommand = require('../lib/commands/components');
    componentsCommand(options);
  });

// CWDS command - DEPRECATED in favor of unified 'ux-ingka components' (v6.1.0+)
program
  .command('cwds')
  .description('[DEPRECATED] Use "ux-ingka components" instead')
  .argument('[action]', 'Action: install, list')
  .option('--auto', 'Auto-install recommended components (non-interactive)')
  .action((action, options) => {
    const cwdsCommand = require('../lib/commands/cwds');
    cwdsCommand(action, options);
  });

// Spark command - AI-powered app generator (v5.4.0+)
program
  .command('spark [prompt]')
  .description('Generate React apps with IKEA design systems (Ingka Skapa or CWDS)')
  .option('-p, --prompt <prompt>', 'Natural language prompt describing the app')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --dir <directory>', 'Output directory', './spark-apps')
  .option(
    '--design-system <system>',
    'Design system: ingka (customer-facing) or cwds (internal co-worker tools)',
    'ingka'
  )
  .option('--no-install', 'Skip npm install after generation')
  .option('--no-start', 'Skip starting dev server after generation')
  .action((promptArg, options) => {
    // If prompt provided as argument, use it (overrides --prompt option)
    if (promptArg) {
      options.prompt = promptArg;
    }
    const sparkCommand = require('../lib/commands/spark');
    sparkCommand(options);
  });

// Spec command - Manage specifications
program
  .command('spec')
  .description('Manage project specifications')
  .argument('[action]', 'Action: new, list, view, edit')
  .argument('[...args]', 'Additional arguments')
  .action((action, args) => {
    const specCommand = require('../lib/commands/spec');
    specCommand(action, args);
  });

// Screenshot to JSON command - Convert Skapa screenshots to JSON (v6.3.0+)
program
  .command('screenshot-to-json [action]')
  .alias('ss2json')
  .description('Convert Skapa design system screenshots to JSON specifications')
  .option('-i, --input <dir>', 'Input directory with screenshots')
  .option('-o, --output <dir>', 'Output directory for JSON files')
  .option('-k, --api-key <key>', 'OpenAI API key')
  .option('-m, --model <model>', 'OpenAI model to use', 'gpt-4o')
  .option('--ocr-only', 'Use OCR fallback only (no AI vision API)')
  .option('--dry-run', 'Show what would be processed')
  .action((action, options) => {
    const screenshotCommand = require('../lib/commands/screenshot-to-json');
    if (action === 'list' || action === 'test') {
      screenshotCommand.parse(['node', 'ux-ingka', action, ...process.argv.slice(4)]);
    } else {
      screenshotCommand.parse(['node', 'ux-ingka', 'screenshot-to-json', ...process.argv.slice(3)]);
    }
  });

// Health command - Check system health
program
  .command('health')
  .description('Check UX Ingka Kit system health')
  .action(() => {
    const healthCommand = require('../lib/commands/health');
    healthCommand();
  });

// Team command - Team management
program
  .command('team')
  .description('Manage team workflows and collaboration')
  .argument('[action]', 'Action: init, status, assign')
  .argument('[...args]', 'Additional arguments')
  .action((action, args) => {
    const teamCommand = require('../lib/commands/team');
    teamCommand(action, args);
  });

// PDF to JSON command - Convert design specs (v6.2.0+)
program
  .command('pdf-to-json')
  .alias('p2j')
  .description('Convert Skapa PDF specifications to JSON format')
  .argument('[action]', 'Action: convert, list, install-deps')
  .option('-d, --dir <directory>', 'Specific directory to convert')
  .option('-o, --output <directory>', 'Output directory', 'docs/guides/Skapa-json')
  .option('-v, --verbose', 'Verbose output')
  .action((action, options) => {
    const pdfToJsonCommand = require('../lib/commands/pdf-to-json');

    if (!action || action === 'convert') {
      pdfToJsonCommand.parse(['node', 'cli', 'convert', ...Object.entries(options).flatMap(([k, v]) => [`--${k}`, v])]);
    } else if (action === 'list') {
      pdfToJsonCommand.parse(['node', 'cli', 'list']);
    } else if (action === 'install-deps') {
      pdfToJsonCommand.parse(['node', 'cli', 'install-deps']);
    }
  });

// Parse command-line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log(banner);
  program.outputHelp();
}
