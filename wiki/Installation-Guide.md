# Installation Guide

> **Get UX Ingka Kit v6.8.5 up and running in < 30 seconds**

> **✨ NEW in v6.8.5:** Critical Spark bug fixed! All v6.8.4 features now working correctly. Complete rebranding from "leo" to "ingvar".

## 🎯 Prerequisites

Before installing UX Ingka Kit, ensure you have:

### Required

- ✅ **Node.js 16.0.0 or higher** - [Download here](https://nodejs.org/)
- ✅ **Git** - [Install guide](https://git-scm.com/downloads)
- ✅ **GitHub Account** - [Sign up](https://github.com/signup)

### Recommended

- ✅ **GitHub CLI (`gh`)** - [Install here](https://cli.github.com/)
- ✅ **VS Code** - [Download here](https://code.visualstudio.com/) - For real-time model selection display (v5.0.0)
- ✅ **GitHub Copilot** - [Get it here](https://github.com/features/copilot)

---

## 🚀 Installation Methods

### Method 1: Automatic Installation (Recommended)

**One command - complete setup with v6.8.5 features!**

```bash
INGVAR_AUTO_INIT=true npm install -g ux-ingka-kit@6.8.5
```

**What this does:**

- ✅ Installs UX Ingka Kit v6.8.5
- ✅ Auto-configures GitHub integration
- ✅ **Component System Strategy** ✨ (v6.8.0)
- ✅ **Critical Spark Bug Fix** 🐛 (v6.8.5)
- ✅ **Comprehensive Design Guidelines** ✨
- ✅ **Consistent CLI commands** ✨
- ✅ **Enables all 6 agents by default** ✨
- ✅ Creates documentation structure (`docs/specs/`)
- ✅ Installs issue templates (8 professional templates)
- ✅ Configures GitHub Actions workflows
- ✅ Sets up VS Code with Copilot instructions
- ✅ Configures standard labels (22+)
- ✅ Enables real-time model selection display

**⚡ Total time:** < 30 seconds

**Perfect for:**

- 🎯 New projects
- 🎯 Team onboarding
- 🎯 CI/CD automation
- 🎯 Quick prototypes

[📖 Learn more about automatic initialization](../docs/guides/AUTO_INITIALIZATION.md)

---

### Method 2: Global Installation (Traditional)

Install Ingvar globally to use across all projects:

```bash
npm install -g ux-ingka-kit@6.8.5
```

**Verify installation:**

```bash
ux-ingka --version
# Should show: 6.8.5 (or later)

ux-ingka --help
# Shows all available commands
```

**Benefits:**

- ✅ All 6 agents enabled by default ✨
- ✅ Available everywhere via `leo` command
- ✅ Easy to update
- ✅ Single installation for all projects
- ✅ Manual control over initialization

---

### Method 3: npx (One-Time Use)

Use Ingvar without installing:

```bash
npx ux-ingka-kit init
```

**When to use:**

- 🎯 Testing Ingvar before committing
- 🎯 One-time project setup
- 🎯 CI/CD pipelines

**Limitations:**

- ❌ Slower (downloads each time)
- ❌ No persistent configuration

---

### Method 3: From Source

For contributors or cutting-edge features:

```bash
# Clone the repository
git clone https://github.com/leopagotto/ux-ingka-kit.git
cd ux-ingka-kit

# Install dependencies
npm install

# Link globally
npm link

# Verify
ux-ingka --version
```

**When to use:**

- 🔧 Contributing to Ingvar development
- 🔧 Testing unreleased features
- 🔧 Customizing for your needs

---

## ⚙️ Setup GitHub CLI

Ingvar requires GitHub CLI for GitHub operations.

### Install GitHub CLI

**macOS:**

```bash
brew install gh
```

**Windows:**

```bash
winget install --id GitHub.cli
# or
choco install gh
```

**Linux:**

```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora
sudo dnf install gh

# Arch
sudo pacman -S github-cli
```

### Authenticate GitHub CLI

```bash
gh auth login
```

Follow the prompts:

1. Choose: **GitHub.com**
2. Protocol: **HTTPS** (recommended)
3. Authenticate: **Login with a web browser**
4. Copy the one-time code
5. Complete authentication in browser

**Required Scopes:**

```bash
# Ensure these scopes are enabled:
gh auth refresh -s repo -s project -s workflow
```

**Verify:**

```bash
gh auth status
# Should show: ✓ Logged in to github.com account USERNAME
```

---

## 🎬 First-Time Setup

### Initialize Ingvar in Your Project

```bash
# Navigate to your project
cd your-project

# Initialize Ingvar
ux-ingka init
```

### What Happens During `ux-ingka init`

1. **Welcome Banner** 🦁

   - Shows Ingvar ASCII art
   - Displays current version

2. **Prerequisites Check** ✅

   - Verifies Node.js version
   - Checks for GitHub CLI
   - Tests git installation

3. **GitHub Authentication** 🔐

   - Checks `gh auth status`
   - Prompts to authenticate if needed

4. **Documentation Setup** 📁

   - Creates `docs/` structure
   - Adds `docs/README.md`
   - Creates subdirectories (specs, guides, development, archive)

5. **GitHub Templates** 📋

   - Installs 8 issue templates
   - Creates PR template
   - Sets up `.github/` directory

6. **VS Code Integration** 🎨

   - Creates `.github/copilot-instructions.md`
   - Enables AI-powered workflow automation

7. **Multi-Agent Configuration** 🤖 (NEW!)

   - **All 6 agents are enabled by default:**
     - 🎨 **Frontend Agent** - UI/UX, components, styling, accessibility
     - ⚙️ **Backend Agent** - APIs, databases, authentication, security
     - 🚀 **DevOps Agent** - CI/CD, Docker, Kubernetes, monitoring
     - 🧪 **Testing Agent** - Unit/integration/E2E tests, TDD, coverage
     - 📚 **Documentation Agent** - README, API docs, guides, comments
     - 🎯 **Orchestrator Agent** - Task routing and coordination
   - Unselect any agents you don't need for your project
   - Can be customized later in `.ingvarrc.json`

8. **Labels Setup** 🏷️ (Optional)

   - Asks: "Would you like to configure GitHub labels?"
   - Creates 22+ standardized labels if yes

9. **Completion** 🎉
   - Shows success message
   - Displays next steps

---

## 🔍 Verification

### Check Installation

```bash
# Show version
ux-ingka --version

# Show all commands
ux-ingka --help

# Check GitHub auth
gh auth status

# Verify Node.js
node --version
```

### Test Commands

```bash
# Check project status
ux-ingka status

# System health check
ux-ingka health

# View documentation structure
ux-ingka docs
```

---

## 🤖 Multi-Agent Configuration

### Overview

UX Ingka Kit includes a powerful multi-agent system that routes tasks to specialized AI agents based on task type. **All 6 agents are enabled by default** - you can customize this during setup or later.

### Available Agents

| Agent                | Role               | Best For                                              | Enabled by Default |
| -------------------- | ------------------ | ----------------------------------------------------- | ------------------ |
| 🎯 **Orchestrator**  | Route & Coordinate | Task classification, multi-agent coordination         | ✅ Always          |
| 🎨 **Frontend**      | UI/UX Development  | Components, styling, accessibility, responsive design | ✅ Yes             |
| ⚙️ **Backend**       | API & Database     | REST APIs, database design, authentication, security  | ✅ Yes             |
| 🚀 **DevOps**        | Infrastructure     | Docker, CI/CD, monitoring, deployment                 | ✅ Yes             |
| 🧪 **Testing**       | Quality Assurance  | Unit tests, E2E tests, coverage, TDD                  | ✅ Yes             |
| 📚 **Documentation** | Technical Writing  | README, API docs, guides, code comments               | ✅ Yes             |

### Customizing Agents

#### Option 1: During Initialization

During `ux-ingka init`, you'll see a prompt like this:

```
🎯 Multi-Agent Configuration

All specialized agents are enabled by default. Unselect any you don't need.

Keep these agents enabled (unselect to disable):
  ◉ 🎨 Frontend Agent - UI/UX, components, styling, accessibility
  ◉ ⚙️ Backend Agent - APIs, databases, authentication, security
  ◉ 🚀 DevOps Agent - CI/CD, Docker, Kubernetes, monitoring
  ◉ 🧪 Testing Agent - Unit/integration/E2E tests, TDD, coverage
  ◉ 📚 Documentation Agent - README, API docs, guides, comments
```

Simply uncheck (spacebar) any agents you don't need:

```bash
# To disable an agent: press spacebar to uncheck
# To keep it: leave it checked
# When done: press Enter
```

#### Option 2: Edit `.ingvarrc.json` Later

```json
{
  "agents": {
    "orchestrator": {
      "enabled": true
    },
    "frontend": {
      "enabled": true
    },
    "backend": {
      "enabled": true
    },
    "devops": {
      "enabled": false // Disable if not needed
    },
    "testing": {
      "enabled": true
    },
    "documentation": {
      "enabled": true
    }
  }
}
```

### How It Works

1. **Task Detection** - Copilot/Cursor/Cline analyzes your request
2. **Agent Routing** - Orchestrator determines which agent(s) to use
3. **Specialized Handling** - Agent executes with domain expertise
4. **Quality Output** - Specialized instructions for each agent

### Examples

**"Add a login button"**
→ Routed to 🎨 Frontend Agent

**"Create a REST API for users"**
→ Routed to ⚙️ Backend Agent

**"Add OAuth authentication with login UI"**
→ Routed to ⚙️ Backend Agent (API) + 🎨 Frontend Agent (UI)

**"Write unit tests for auth service"**
→ Routed to 🧪 Testing Agent

**"Document the API endpoints"**
→ Routed to 📚 Documentation Agent

---

## 🐛 Troubleshooting

### Issue: Command not found

**Error:**

```
zsh: command not found: leo
```

**Solution:**

```bash
# Check if installed globally
npm list -g ux-ingka-kit

# If not, install again
npm install -g ux-ingka-kit

# Check npm global path
npm config get prefix
# Ensure this is in your PATH
```

---

### Issue: Permission denied (macOS/Linux)

**Error:**

```
EACCES: permission denied
```

**Solution:**

```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g ux-ingka-kit

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g ux-ingka-kit
```

---

### Issue: GitHub CLI not authenticated

**Error:**

```
gh: To authenticate, please run: gh auth login
```

**Solution:**

```bash
# Authenticate
gh auth login

# Ensure project scope
gh auth refresh -s repo -s project -s workflow

# Verify
gh auth status
```

---

### Issue: Node.js version too old

**Error:**

```
Error: Ingvar requires Node.js 16.0.0 or higher
```

**Solution:**

```bash
# Check current version
node --version

# Update Node.js
# Use nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

---

## 🔄 Updating Ingvar

### Update to Latest Version

```bash
# Check current version
ux-ingka --version

# Update globally
npm update -g ux-ingka-kit

# Verify new version
ux-ingka --version
```

### Update from Source

```bash
cd ux-ingka-kit
git pull origin main
npm install
npm link
```

---

## 🗑️ Uninstallation

### Remove Global Installation

```bash
npm uninstall -g ux-ingka-kit
```

### Clean Up Project Files

```bash
# Remove Ingvar-generated files (optional)
rm -rf .github/copilot-instructions.md
rm -rf .github/ISSUE_TEMPLATE/
rm -rf docs/

# Or keep them - they're useful!
```

---

## 📋 Post-Installation Checklist

After installation, verify everything works:

- [ ] `ux-ingka --version` shows correct version
- [ ] `gh auth status` shows authenticated
- [ ] `ux-ingka init` completes successfully
- [ ] `ux-ingka status` shows project info
- [ ] `ux-ingka health` passes all checks
- [ ] GitHub Copilot is enabled in VS Code

---

## 🎓 Next Steps

After installation:

1. **[Quick Start Tutorial](./Quick-Start)** - Create your first Ingvar project
2. **[Configuration](./Configuration)** - Customize Ingvar for your workflow
3. **[Commands Reference](./Commands-Reference)** - Learn all available commands
4. **[Automatic Issue Creation](./Automatic-Issue-Creation)** - Let Copilot handle issues

---

## 💬 Need Help?

- **Issues:** [Report installation problems](https://github.com/leopagotto/ux-ingka-kit/issues)
- **Discussions:** [Ask questions](https://github.com/leopagotto/ux-ingka-kit/discussions)
- **Troubleshooting:** [Common issues](./Troubleshooting)

---

**Last Updated:** October 19, 2025
**Tested On:** macOS 14, Windows 11, Ubuntu 22.04
**Node.js:** 16.x, 18.x, 20.x
