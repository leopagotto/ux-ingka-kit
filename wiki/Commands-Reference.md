# Commands Reference

> **Complete reference for all UX Ingka Kit v6.8.5 commands**

## 🎯 Command Overview

| Command            | Purpose                                   | Interactive | Version |
| ------------------ | ----------------------------------------- | ----------- | ------- |
| `ux-ingka init`      | Initialize Ingvar in project              | ✅ Yes      | v1.0.0  |
| `ux-ingka agent`     | Manage specialized agents                 | ✅ Yes      | v4.0.0  |
| `ux-ingka github`    | Configure repository settings             | ✅ Yes      | v4.0.0  |
| `ux-ingka model`     | Manage AI model selection 🎉 NEW (v4.1.1) | ✅ Yes      | v4.1.1  |
| `ux-ingka ai`        | Manage AI assistants                      | ✅ Yes      | v3.0.0  |
| `ux-ingka issue`     | Create issue interactively                | ✅ Yes      | v1.0.0  |
| `ux-ingka labels`    | Configure GitHub labels                   | ✅ Yes      | v1.0.0  |
| `ux-ingka vscode`    | Setup VS Code integration                 | ✅ Yes      | v1.0.0  |
| `ux-ingka config`    | Manage configuration                      | ✅ Yes      | v2.6.0  |
| `ux-ingka status`    | Show project workflow status              | ❌ No       | v1.0.0  |
| `ux-ingka health`    | System health check                       | ❌ No       | v2.0.0  |
| `ux-ingka welcome`   | Show welcome banner                       | ❌ No       | v1.0.0  |
| `ux-ingka docs`      | Open documentation                        | ❌ No       | v1.0.0  |
| `ux-ingka --version` | Show version (6.8.5)                      | ❌ No       | v1.0.0  |
| `ux-ingka --help`    | Show help                                 | ❌ No       | v1.0.0  |

---

## 📋 Detailed Command Reference

### `ux-ingka init`

Initialize Ingvar Workflow in your project.

**Usage:**

```bash
ux-ingka init [options]
```

**What It Does:**

1. Shows welcome banner
2. Checks prerequisites (Node.js, git, GitHub CLI)
3. Verifies GitHub authentication
4. Creates documentation structure
5. Installs issue and PR templates
6. Sets up VS Code Copilot instructions
7. Optionally configures GitHub labels
8. Initializes real-time model selection (NEW in v4.1.1)

**Interactive Prompts:**

- Would you like to configure GitHub labels? (y/n)

**Options:**

```bash
ux-ingka init --skip-labels    # Skip label configuration
ux-ingka init --force          # Overwrite existing files
ux-ingka init --help           # Show help for init command
```

**Example:**

```bash
cd my-project
ux-ingka init
```

**Output Structure:**

```
your-project/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md
│   │   ├── feature-request.md
│   │   ├── documentation.md
│   │   ├── deployment-task.md
│   │   └── ... (8 total)
│   ├── copilot-instructions.md
│   └── pull_request_template.md
└── docs/
    ├── README.md
    ├── specs/
    ├── guides/
    ├── development/
    └── archive/
```

---

### `ux-ingka ai` 🎉 NEW in v3.0.0

Manage AI assistant configurations and instruction files.

**Usage:**

```bash
ux-ingka ai [subcommand] [args...]
```

**Subcommands:**

#### `ux-ingka ai list` (alias: `ux-ingka ai ls`)

List configured AI assistants with file paths and status.

```bash
ux-ingka ai list
```

**Example Output:**

```
📦 Configured AI Assistants:

  ✓ GitHub Copilot
    .github/copilot-instructions.md
  ✓ Cursor
    .cursorrules
  ✓ Cline
    .clinerules
  ⚠ Codeium
    .codeium/instructions.md (not generated)

  Primary AI: copilot
```

#### `ux-ingka ai add <ai-name>`

Add a new AI assistant and generate its instruction file.

```bash
ux-ingka ai add cursor      # Add Cursor (Claude-powered IDE)
ux-ingka ai add cline       # Add Cline (autonomous coding)
ux-ingka ai add codeium     # Add Codeium (free alternative)
```

**Available AIs:**

- `copilot` - GitHub Copilot
- `cursor` - Cursor (Claude)
- `cline` - Cline (Claude-Dev)
- `codeium` - Codeium (free)

**What It Does:**

1. Validates AI name
2. Generates ~40KB instruction file
3. Updates `.ingvarrc.json` configuration
4. Sets as primary if it's the first AI

**Example Output:**

```
✓ Added Cursor
  Generated: .cursorrules
```

#### `ux-ingka ai remove <ai-name>` (alias: `ux-ingka ai rm`)

Remove an AI assistant and delete its instruction file.

```bash
ux-ingka ai remove cursor
ux-ingka ai rm cursor
```

**What It Does:**

1. Deletes instruction file
2. Removes from configuration
3. Updates primary AI if needed

#### `ux-ingka ai sync`

Regenerate all AI instruction files for configured assistants.

```bash
ux-ingka ai sync
```

**When to Use:**

- After upgrading UX Ingka Kit
- After modifying workflow standards
- To update all AI files at once

**Example Output:**

```
🔄 Syncing AI instruction files...

🚀 Generating AI instruction files...
  ✓ .github/copilot-instructions.md
  ✓ .cursorrules
  ✓ .clinerules
  ✓ .codeium/instructions.md

📊 Summary:
  ✓ Success: 4
```

#### `ux-ingka ai diff <ai1> <ai2>` (coming soon)

Compare two AI configurations (planned feature).

```bash
ux-ingka ai diff copilot cursor
```

**Examples:**

```bash
# List what's configured
ux-ingka ai list

# Add Cursor for complex refactoring
ux-ingka ai add cursor

# Add Codeium as free alternative
ux-ingka ai add codeium

# Update all instruction files
ux-ingka ai sync

# Remove an AI you no longer use
ux-ingka ai remove cline
```

**Configuration:**
AI settings are stored in `.ingvarrc.json`:

```json
{
  "ai-assistants": {
    "enabled": ["copilot", "cursor"],
    "primary": "copilot",
    "sync-on-update": true
  }
}
```

**See Also:**

- [Multi-AI Support Guide](./Multi-AI-Support)
- [Migration Guide v2.x → v3.0.0](../docs/MIGRATION_V3.md)

---

### `ux-ingka agent` 🎉 NEW in v4.0.0

Manage specialized AI agents for multi-agent orchestration.

**Usage:**

```bash
ux-ingka agent <subcommand> [agent] [options]
```

**Subcommands:**

#### `ux-ingka agent list`

Show all agents and their current status.

**Usage:**

```bash
ux-ingka agent list
```

**Output:**

```
🎯 Ingvar Multi-Agent System

Project Type: fullstack

🎛️  Orchestrator Agent ✓ ENABLED
   Routes tasks to specialized agents
   Status: Always active (core routing layer)

🎨  Frontend Agent ✓ ENABLED
   UI/UX, components, styling, accessibility, responsive design

⚙️   Backend Agent ○ DISABLED
   APIs, databases, authentication, security, performance

Total: 2 agents enabled
```

#### `ux-ingka agent enable <agent>`

Enable a specialized agent.

**Usage:**

```bash
ux-ingka agent enable frontend
ux-ingka agent enable backend
ux-ingka agent enable devops
ux-ingka agent enable testing
ux-ingka agent enable documentation
```

**Example:**

```bash
ux-ingka agent enable frontend
# Output:
# ✔ frontend agent enabled
# ? Regenerate AI instruction files with new agent? (Y/n)
```

**Options:**

- `--no-sync` - Skip AI file regeneration prompt

#### `ux-ingka agent disable <agent>`

Disable a specialized agent.

**Usage:**

```bash
ux-ingka agent disable devops
```

**Note:** Cannot disable the Orchestrator agent (core routing layer).

#### `ux-ingka agent info <agent>`

Show detailed information about a specific agent.

**Usage:**

```bash
ux-ingka agent info frontend
ux-ingka agent info orchestrator
```

**Output:**

```
🎨  Frontend Agent

Description:
  UI/UX development specialist

Status:
  ✓ ENABLED

Responsibilities:
  • Component-first architecture (atomic design)
  • Accessibility (WCAG 2.1 AA compliance)
  • Responsive design (mobile-first)
  • Performance optimization
  • SEO best practices

Routing Triggers:
  • Keywords: component, UI, style, design, responsive, button, form
  • Files: *.jsx, *.tsx, *.vue, *.css, *.scss
```

#### `ux-ingka agent sync`

Regenerate AI instruction files with current agent configuration.

**Usage:**

```bash
ux-ingka agent sync
```

**When to Use:**

- After manually editing `.ingvarrc.json`
- After enabling/disabling agents (if you skipped auto-sync)
- After updating UX Ingka Kit version

**Available Agents:**

- 🎛️ **Orchestrator** - Core routing layer (always enabled)
- 🎨 **Frontend** - UI/UX, components, styling, accessibility
- ⚙️ **Backend** - APIs, databases, authentication, security
- 🚀 **DevOps** - CI/CD, Docker, Kubernetes, deployment
- 🧪 **Testing** - Unit/integration/E2E tests, TDD
- 📚 **Documentation** - README, API docs, guides, tutorials

**Configuration:**

Agents are configured in `.ingvarrc.json`:

```json
{
  "project-type": "fullstack",
  "agents": {
    "frontend": { "enabled": true },
    "backend": { "enabled": true },
    "devops": { "enabled": false },
    "testing": { "enabled": true },
    "documentation": { "enabled": false }
  }
}
```

**See Also:**

- [Multi-Agent System Guide](../docs/guides/multi-agent-system.md)
- [Migration Guide v3.x → v4.0.0](../docs/guides/multi-agent-system.md#migration-from-v3x)

---

### `ux-ingka github` 🎉 NEW in v4.0.0

Configure GitHub repository settings with Ingvar recommended best practices.

**Usage:**

```bash
ux-ingka github <subcommand> [options]
```

**Subcommands:**

#### `ux-ingka github status`

Show current GitHub repository settings.

**Usage:**

```bash
ux-ingka github status
```

**Output:**

```
📊 GitHub Repository Settings

Repository: leopagotto/ux-ingka-kit
URL: https://github.com/leopagotto/ux-ingka-kit

⚙️  Repository Settings:

  Visibility:          PUBLIC
  Default branch:      main

Features:

  Issues:              ✓ Enabled
  Projects:            ✓ Enabled
  Wiki:                ✓ Enabled
  Discussions:         ○ Disabled

Merge Settings:

  Delete branch on merge: ○ Disabled
  Allow merge commits: ✓ Enabled
  Allow squash merge:  ✓ Enabled
  Allow rebase merge:  ✓ Enabled
```

#### `ux-ingka github setup`

Configure repository with recommended settings.

**Usage:**

```bash
ux-ingka github setup          # Interactive (asks for confirmation)
ux-ingka github setup --yes    # Non-interactive (applies without asking)
```

**Recommended Settings:**

- ✅ **Issues enabled** - For issue tracking
- ✅ **Projects enabled** - For project boards
- ✅ **Wiki enabled** - For documentation
- ✅ **Discussions enabled** - For community
- ✅ **Delete branch on merge** - Keep repository clean
- ✅ **All merge types** - Flexibility in workflows

**Interactive Flow:**

1. Shows current settings
2. Shows recommended settings
3. Calculates differences
4. Asks for confirmation
5. Applies changes safely

**Safety Features:**

- ✅ Shows all changes before applying
- ✅ Requires confirmation (unless `--yes` flag)
- ✅ Never deletes data without explicit permission
- ✅ Reports settings requiring manual configuration

**Example:**

```bash
ux-ingka github setup

# Output:
# ⚙️  GitHub Repository Settings Setup
#
# 📊 Current Settings:
#   Delete branch on merge: ○ Disabled
#
# ✨ Recommended Settings (UX Ingka Kit):
#   Delete branch on merge: ✓ Enabled (keep repo clean)
#
# ⚠️  1 setting(s) need to be updated:
#
# ? Apply recommended settings? (Y/n)
```

**Options:**

- `-y, --yes` - Skip confirmation prompt

**Requirements:**

- GitHub CLI installed (`gh`)
- Repository admin permissions
- Authenticated with GitHub

**See Also:**

- [GitHub Settings Best Practices](./GitHub-Settings)

---

### `ux-ingka model` 🎉 NEW in v4.1.1

Manage AI model selection for intelligent task routing and cost optimization.

**Usage:**

```bash
ux-ingka model <subcommand> [options]
```

**Subcommands:**

#### `ux-ingka model status`

Show current model selection configuration and usage.

**Usage:**

```bash
ux-ingka model status
```

**Output Shows:**

- Feature enabled/disabled status
- Current strategy (auto, manual, etc.)
- Budget configurations (daily, monthly, per-agent)
- Current usage vs. budgets
- Available AI providers
- API key configuration status

#### `ux-ingka model list`

List all available AI models.

**Usage:**

```bash
ux-ingka model list
```

#### `ux-ingka model enable`

Enable model selection feature.

**Usage:**

```bash
ux-ingka model enable
```

#### `ux-ingka model disable`

Disable model selection feature.

**Usage:**

```bash
ux-ingka model disable
```

#### `ux-ingka model budget`

Configure usage budgets.

**Usage:**

```bash
ux-ingka model budget [options]
```

**Options:**

- `--daily <amount>` - Set daily budget (default: $5)
- `--monthly <amount>` - Set monthly budget (default: $50)
- `--per-agent <amount>` - Set per-agent budget (default: $10)

#### `ux-ingka model usage`

Check current model usage statistics.

**Usage:**

```bash
ux-ingka model usage
```

#### `ux-ingka model reset`

Reset usage counters (admin only).

**Usage:**

```bash
ux-ingka model reset
```

#### `ux-ingka model test`

Test model selection for a specific agent and complexity.

**Usage:**

```bash
ux-ingka model test <agent> [complexity]
```

**Arguments:**

- `agent` - Agent name (designer, frontend, backend, testing, documentation, devops)
- `complexity` - Task complexity (simple, moderate, complex)

**Features:**

- Automatic model selection based on agent type
- Complexity-aware routing (simple tasks use cheap models, complex use powerful)
- Real-time status display in VS Code (100ms latency)
- Event emission for tracking changes
- File-based status monitoring
- Cost-conscious routing
- Usage tracking against budgets

**Real-Time Display:**

When agents execute, watch the VS Code status bar automatically update:

```
⊘ Ingvar Ready                    (idle)
↻ 🎨 designer → Claude-S       (designer working)
✓ 🎨 designer complete         (designer done)
↻ 💻 frontend → Claude-S       (frontend working)
↻ 🔧 backend → Claude-Opus     (backend - upgraded for complexity!)
↻ 📚 documentation → GPT-3.5    (docs - most cost-efficient)
```

**Configuration:**

Model selection settings are in `.ingvarrc.json`:

```json
{
  "model-selection": {
    "enabled": true,
    "strategy": "auto",
    "budgets": {
      "daily": 5.0,
      "monthly": 50.0,
      "per-agent": 10.0
    }
  }
}
```

**See Also:**

- [Real-Time Model Selection Guide](../docs/REALTIME_MODEL_SELECTION_IN_VSCODE.md)
- [Model Selection Quick Start](../docs/REALTIME_MODEL_SELECTION_QUICK_START.md)
- [Cost Tracking Documentation](../docs/guides/model-selection.md)

---

### `ux-ingka issue`

Create a GitHub issue interactively.

**Usage:**

```bash
ux-ingka issue
```

**Interactive Flow:**

1. **Select Issue Type**

   - Bug
   - Feature
   - Enhancement
   - Documentation
   - Refactoring
   - Testing
   - Deployment
   - Integration

2. **Enter Title**

   - Clear, concise summary

3. **Select Component** (if applicable)

   - Frontend, Backend, Database, DevOps, etc.

4. **Set Priority**

   - P0 (Critical)
   - P1 (High)
   - P2 (Medium)
   - P3 (Low)

5. **Enter Description**

   - Detailed explanation
   - Opens default editor (vim/nano/code)

6. **Review & Confirm**
   - Preview issue before creation
   - Edit or submit

**Example:**

```bash
ux-ingka issue
# Follow prompts...
# → Issue #42 created: "Add dark mode support"
```

**Tips:**

- Use clear, descriptive titles
- Include acceptance criteria in description
- Add relevant labels automatically
- Reference related issues with #number

---

### `ux-ingka labels`

Configure GitHub repository labels.

**Usage:**

```bash
ux-ingka labels [options]
```

**What It Does:**

1. Checks existing labels
2. Shows preview of labels to create
3. Creates 22+ standardized labels:
   - **Priorities:** P0, P1, P2, P3
   - **Types:** bug, feature, enhancement, documentation, etc.
   - **Status:** in-progress, ready-to-merge, blocked
   - **Components:** frontend, backend, api, database, etc.

**Options:**

```bash
ux-ingka labels --force        # Overwrite existing labels
ux-ingka labels --dry-run      # Preview without creating
ux-ingka labels --help         # Show help
```

**Label Categories:**

**Priority Labels (4):**

- 🔴 P0 - Critical (production down, security)
- 🟠 P1 - High (major features, significant bugs)
- 🟡 P2 - Medium (standard features, minor bugs)
- 🟢 P3 - Low (nice-to-have, polish)

**Type Labels (8):**

- 🐛 bug
- ✨ feature
- 🔧 enhancement
- 📚 documentation
- ♻️ refactoring
- 🚀 deployment
- 🔗 integration
- 🧪 testing

**Status Labels (4):**

- 🚧 in-progress
- 👀 needs-review
- ✅ ready-to-merge
- 🚫 blocked

**Component Labels (6+):**

- 💻 frontend
- ⚙️ backend
- 🗄️ database
- 🔧 devops
- 🎨 design
- 📡 api

**Example:**

```bash
ux-ingka labels
# Creates all 22+ labels with colors and descriptions
```

---

### `ux-ingka vscode`

Setup VS Code integration with Copilot instructions.

**Usage:**

```bash
ux-ingka vscode
```

**What It Does:**

1. Creates `.github/copilot-instructions.md`
2. Configures Copilot behavior for your project
3. Enables automatic issue creation
4. Sets up project management workflows

**Instructions Include:**

- Automatic issue creation rules
- GitHub Projects integration
- Status management workflows
- Spec-driven development guidelines
- Component-first best practices
- SEO optimization guidelines
- Performance best practices

**Example:**

```bash
ux-ingka vscode
# ✓ Created .github/copilot-instructions.md
# ✓ Copilot will now follow Ingvar workflow
```

**Verify:**

1. Open project in VS Code
2. Open Copilot Chat
3. Describe work: "We need to add user authentication"
4. Copilot should automatically create issue

---

### `ux-ingka status`

Show current project workflow status.

**Usage:**

```bash
ux-ingka status
```

**Displays:**

- Project name and description
- Current branch
- Last commit
- Open issues count
- GitHub Projects status
- Ingvar configuration status

**Example Output:**

```
🦁 Ingvar Workflow Status

Project: my-awesome-app
Branch: main
Last Commit: feat: add dark mode (3 hours ago)

GitHub Status:
  ✓ Authenticated as: username
  ✓ Repository: owner/my-awesome-app
  ✓ Open Issues: 5
  ✓ Projects: 2 active

Ingvar Configuration:
  ✓ Documentation structure
  ✓ Issue templates (8)
  ✓ Labels configured (22)
  ✓ VS Code integration
  ✓ Copilot instructions

All systems operational! 🚀
```

---

### `ux-ingka health`

Run system health check.

**Usage:**

```bash
ux-ingka health
```

**Checks:**

1. ✅ Node.js version (≥16.0.0)
2. ✅ npm installation
3. ✅ Git installation
4. ✅ GitHub CLI (`gh`) installation
5. ✅ GitHub authentication status
6. ✅ GitHub CLI scopes (repo, project, workflow)
7. ✅ Ingvar installation version
8. ✅ Project git repository

**Example Output:**

```
🔍 Ingvar Health Check

System Requirements:
  ✓ Node.js v20.10.0 (✓ ≥16.0.0)
  ✓ npm v10.2.3
  ✓ git v2.42.0
  ✓ GitHub CLI v2.40.0

GitHub:
  ✓ Authenticated as: username
  ✓ Scopes: repo, project, workflow
  ✓ API access: OK

Ingvar:
  ✓ Version: 2.3.0
  ✓ Installation: global

Project:
  ✓ Git repository
  ✓ Remote: github.com/owner/repo
  ✓ Branch: main

All checks passed! ✅
```

---

### `ux-ingka welcome`

Display Ingvar welcome banner.

**Usage:**

```bash
ux-ingka welcome
```

**Shows:**

- ASCII art logo
- Current version
- Quick start info
- Helpful commands

---

### `ux-ingka docs`

Open documentation.

**Usage:**

```bash
ux-ingka docs [topic]
```

**Topics:**

```bash
ux-ingka docs                  # Open main docs
ux-ingka docs guides           # Open guides folder
ux-ingka docs specs            # Open specs folder
ux-ingka docs readme           # Open README
```

---

### Global Options

Available for all commands:

```bash
--help, -h        # Show help for command
--version, -v     # Show Ingvar version
--verbose         # Verbose output
--quiet, -q       # Suppress output
--no-color        # Disable colors
```

**Examples:**

```bash
ux-ingka init --help
ux-ingka status --verbose
ux-ingka labels --quiet
```

---

## 🔄 Command Chaining

Some commands can be chained:

```bash
# Initialize and configure labels
ux-ingka init && ux-ingka labels

# Health check before status
ux-ingka health && ux-ingka status

# Full setup
ux-ingka init && ux-ingka labels && ux-ingka vscode
```

---

## 🎓 Common Workflows

### New Project Setup

```bash
cd new-project
ux-ingka init              # Initialize Ingvar
ux-ingka labels            # Configure labels
# Start coding - Copilot handles the rest!
```

### Add Ingvar to Existing Project

```bash
cd existing-project
ux-ingka init --skip-labels  # Keep existing labels
ux-ingka vscode             # Add Copilot instructions
```

### Create Issue Manually

```bash
ux-ingka issue
# Follow prompts to create structured issue
```

### Check Everything is OK

```bash
ux-ingka health    # System check
ux-ingka status    # Project status
```

---

## 💡 Tips & Tricks

### 1. Skip Interactive Prompts

```bash
# Use gh CLI directly for non-interactive
gh issue create --title "..." --body "..." --label "bug,p1"
```

### 2. Alias Commands

```bash
# Add to ~/.bashrc or ~/.zshrc
alias li="ux-ingka init"
alias ls="ux-ingka status"
alias lh="ux-ingka health"
```

### 3. CI/CD Usage

```bash
# Use npx for one-time setup in CI
npx ux-ingka-kit init --skip-labels --force
```

### 4. Quick Health Check

```bash
ux-ingka health | grep "✓"    # Show only passed checks
ux-ingka health | grep "✗"    # Show only failed checks
```

---

## 🐛 Troubleshooting Commands

### Command Not Found

```bash
# Check if installed
npm list -g ux-ingka-kit

# Reinstall
npm install -g ux-ingka-kit
```

### Permission Errors

```bash
# Check npm prefix
npm config get prefix

# Fix permissions (macOS/Linux)
sudo chown -R $USER $(npm config get prefix)
```

### GitHub Auth Issues

```bash
# Check status
gh auth status

# Refresh with scopes
gh auth refresh -s repo -s project -s workflow
```

---

## 📚 Additional Resources

- [Quick Start Tutorial](./Quick-Start)
- [Configuration Guide](./Configuration)
- [Troubleshooting](./Troubleshooting)
- [FAQ](./FAQ)

---

**Last Updated:** October 19, 2025
**Commands Version:** 2.3.0
