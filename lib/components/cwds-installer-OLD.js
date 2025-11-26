#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

/**
 * Co-Worker Design Subsystem (CWDS) Installer
 *
 * Installs IKEA Co-Worker Design System components for internal applications.
 * These components are designed for co-worker-facing tools and applications.
 *
 * @see https://skapa.ikea.com/subsystems/cwds
 */

// CWDS Component Registry
const CWDS_COMPONENTS = {
  // Core Layout Components
  layout: [
    {
      name: 'cwds-react-layout',
      label: '📐 CWDS Layout',
      description: 'Main layout wrapper with header, navigation, and content areas',
      package: '@ingka-group-digital/cwds-react-layout',
      category: 'Layout',
      checked: true,
      dependencies: [
        '@ingka/aspect-ratio-box',
        '@ingka/avatar',
        '@ingka/base',
        '@ingka/button',
        '@ingka/focus',
        '@ingka/image',
        '@ingka/loading',
        '@ingka/modal',
        '@ingka/svg-icon',
        'focus-visible'
      ],
      cwdsDependencies: [
        '@ingka-group-digital/cwds-react-app-switcher',
        '@ingka-group-digital/cwds-react-header',
        '@ingka-group-digital/cwds-react-mobile-navigation',
        '@ingka-group-digital/cwds-react-nav-menu',
        '@ingka-group-digital/cwds-react-user-profile',
        '@ingka-group-digital/cwds-react-shared-app-symbol',
        '@ingka-group-digital/cwds-react-shared-modal',
        '@ingka-group-digital/cwds-react-shared-nav',
        '@ingka-group-digital/cwds-react-shared-tabs'
      ]
    },
    {
      name: 'iloff-layout-react',
      label: '🏢 ILOFF Layout',
      description: 'CWDS Layout with ILOFF apps integration (App Switcher with ILOFF apps)',
      package: '@ingka-group-digital/iloff-layout-react',
      category: 'Layout',
      checked: true,
      dependencies: [
        '@ingka/aspect-ratio-box',
        '@ingka/avatar',
        '@ingka/base',
        '@ingka/button',
        '@ingka/focus',
        '@ingka/image',
        '@ingka/loading',
        '@ingka/modal',
        '@ingka/svg-icon',
        'focus-visible'
      ],
      cwdsDependencies: [
        '@ingka-group-digital/cwds-react-layout',
        '@ingka-group-digital/cwds-layout-utils',
        '@ingka-group-digital/iloff-apps',
        '@ingka-group-digital/cwds-react-shared-models'
      ],
      authOptions: {
        auth0: ['@auth0/auth0-react'],
        azure: ['@azure/msal-browser', '@azure/msal-react']
      }
    }
  ],

  // Navigation Components
  navigation: [
    {
      name: 'cwds-react-header',
      label: '🎯 Global Header',
      description: 'Co-worker application header with branding and navigation',
      package: '@ingka-group-digital/cwds-react-header',
      category: 'Navigation',
      checked: true,
      dependencies: [
        '@ingka/base',
        '@ingka/button',
        '@ingka/focus',
        '@ingka/modal',
        '@ingka/svg-icon',
        'focus-visible'
      ],
      cwdsDependencies: [
        '@ingka-group-digital/cwds-react-shared-modal',
        '@ingka-group-digital/cwds-react-shared-nav'
      ]
    },
    {
      name: 'cwds-react-app-switcher',
      label: '🔄 App Switcher',
      description: 'Switches between different co-worker applications',
      package: '@ingka-group-digital/cwds-react-app-switcher',
      category: 'Navigation',
      checked: true,
      dependencies: [
        '@ingka/base',
        '@ingka/button',
        '@ingka/focus',
        '@ingka/modal',
        '@ingka/svg-icon',
        'focus-visible'
      ],
      cwdsDependencies: [
        '@ingka-group-digital/cwds-react-shared-modal',
        '@ingka-group-digital/cwds-react-shared-nav'
      ]
    },
    {
      name: 'cwds-react-mobile-navigation',
      label: '📱 Bottom Navigation',
      description: 'Mobile bottom navigation bar for touch interfaces',
      package: '@ingka-group-digital/cwds-react-mobile-navigation',
      category: 'Navigation',
      checked: true,
      dependencies: [
        '@ingka/focus',
        '@ingka/svg-icon',
        'focus-visible'
      ],
      cwdsDependencies: [
        '@ingka-group-digital/cwds-react-shared-tabs'
      ]
    },
    {
      name: 'cwds-react-nav-menu',
      label: '☰ Navigation Menu',
      description: 'Drawer-based navigation menu for co-worker apps',
      package: '@ingka-group-digital/cwds-react-nav-menu',
      category: 'Navigation',
      checked: true,
      dependencies: [
        '@ingka/base',
        '@ingka/button',
        '@ingka/focus',
        '@ingka/modal',
        '@ingka/svg-icon',
        'focus-visible'
      ],
      cwdsDependencies: [
        '@ingka-group-digital/cwds-react-shared-modal',
        '@ingka-group-digital/cwds-react-shared-nav'
      ]
    }
  ],

  // User Components
  user: [
    {
      name: 'cwds-react-user-profile',
      label: '👤 User Profile',
      description: 'User profile drawer with settings and logout',
      package: '@ingka-group-digital/cwds-react-user-profile',
      category: 'User',
      checked: true,
      dependencies: [
        '@ingka/aspect-ratio-box',
        '@ingka/avatar',
        '@ingka/base',
        '@ingka/button',
        '@ingka/focus',
        '@ingka/image',
        '@ingka/modal',
        '@ingka/svg-icon',
        'focus-visible'
      ],
      cwdsDependencies: [
        '@ingka-group-digital/cwds-react-shared-modal'
      ]
    }
  ],

  // Shared/Utility Components
  shared: [
    {
      name: 'cwds-variables',
      label: '🎨 CWDS Variables',
      description: 'Co-worker design system CSS variables',
      package: '@ingka-group-digital/cwds-variables',
      category: 'Shared',
      checked: true,
      dependencies: [],
      cwdsDependencies: []
    },
    {
      name: 'cwds-react-shared-models',
      label: '📦 Shared Models',
      description: 'TypeScript models and interfaces',
      package: '@ingka-group-digital/cwds-react-shared-models',
      category: 'Shared',
      checked: false,
      dependencies: [],
      cwdsDependencies: []
    },
    {
      name: 'cwds-layout-utils',
      label: '🛠️  Layout Utils',
      description: 'Utility functions for layout components',
      package: '@ingka-group-digital/cwds-layout-utils',
      category: 'Shared',
      checked: false,
      dependencies: [],
      cwdsDependencies: []
    }
  ]
};

class CWDSInstaller {
  constructor(targetDir = process.cwd()) {
    this.targetDir = targetDir;
    this.selectedComponents = [];
    this.authProvider = null; // 'auth0' or 'azure'
  }

  /**
   * Get all CWDS components as flat array
   */
  getAllComponents() {
    const allComponents = [];
    Object.values(CWDS_COMPONENTS).forEach(category => {
      allComponents.push(...category);
    });
    return allComponents;
  }

  /**
   * Interactive component selection
   */
  async selectComponents() {
    console.log(chalk.cyan.bold('\n🏢 Co-Worker Design Subsystem (CWDS) Installation\n'));
    console.log(chalk.gray('Select components for internal co-worker applications\n'));

    const allComponents = this.getAllComponents();

    // Group components by category for display
    const choices = [];
    const categories = Object.keys(CWDS_COMPONENTS);

    categories.forEach(categoryKey => {
      const components = CWDS_COMPONENTS[categoryKey];
      if (components.length > 0) {
        choices.push(new inquirer.Separator(chalk.yellow(`\n${components[0].category}:`)));
        components.forEach(comp => {
          choices.push({
            name: `${comp.label} - ${comp.description}`,
            value: comp.name,
            checked: comp.checked
          });
        });
      }
    });

    const { selectedComponents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedComponents',
        message: 'Select CWDS components to install:',
        choices,
        pageSize: 20,
        validate: (answer) => {
          if (answer.length === 0) {
            return 'You must select at least one component';
          }
          return true;
        }
      }
    ]);

    this.selectedComponents = selectedComponents;

    // Check if ILOFF Layout is selected - ask for auth provider
    if (selectedComponents.includes('iloff-layout-react')) {
      const { authProvider } = await inquirer.prompt([
        {
          type: 'list',
          name: 'authProvider',
          message: 'ILOFF Layout requires authentication. Select provider:',
          choices: [
            { name: 'Auth0 (recommended)', value: 'auth0' },
            { name: 'Azure MSAL', value: 'azure' }
          ],
          default: 'auth0'
        }
      ]);
      this.authProvider = authProvider;
    }

    return this.selectedComponents;
  }

  /**
   * Install all selected components
   */
  async install() {
    if (this.selectedComponents.length === 0) {
      console.log(chalk.yellow('No components selected for installation'));
      return;
    }

    console.log(chalk.cyan.bold('\n📦 Installing CWDS Components\n'));

    // Step 1: Configure npm registry
    await this.configureRegistry();

    // Step 2: Install Skapa base dependencies (required by CWDS)
    await this.installSkapaDependencies();

    // Step 3: Install selected CWDS packages
    await this.installCWDSPackages();

    // Step 4: Install auth provider if needed
    if (this.authProvider) {
      await this.installAuthProvider();
    }

    // Step 5: Create CSS import file
    await this.createCSSImports();

    // Step 6: Create example components
    await this.createExamples();

    console.log(chalk.green.bold('\n✅ CWDS Installation Complete!\n'));
    this.printNextSteps();
  }

  /**
   * Configure npm registry for @ingka-group-digital packages
   */
  async configureRegistry() {
    const spinner = require('ora')('Configuring CWDS registry...').start();

    try {
      const npmrcPath = path.join(this.targetDir, '.npmrc');
      const npmrcContent = `@ingka-group-digital:registry=https://npm.pkg.github.com\n@ingka:registry=https://registry.npmjs.org/\n`;

      await fs.writeFile(npmrcPath, npmrcContent, 'utf8');

      // Force sync to disk
      const fd = await fs.open(npmrcPath, 'r+');
      await fd.sync();
      await fd.close();

      // Set registry via npm config
      execSync('npm config set --location=project @ingka-group-digital:registry https://npm.pkg.github.com', {
        cwd: this.targetDir,
        stdio: 'pipe'
      });

      spinner.succeed('CWDS registry configured');
    } catch (error) {
      spinner.fail('Failed to configure CWDS registry');
      console.log(chalk.yellow('\n⚠️  Manual registry configuration required'));
      console.log(chalk.gray('Add to .npmrc: @ingka-group-digital:registry=https://npm.pkg.github.com\n'));
    }
  }

  /**
   * Install Skapa base dependencies required by CWDS
   */
  async installSkapaDependencies() {
    console.log(chalk.cyan('\n📦 Installing Skapa base dependencies...\n'));

    // Collect all unique Skapa dependencies
    const skapaDeps = new Set();
    const allComponents = this.getAllComponents();

    this.selectedComponents.forEach(compName => {
      const component = allComponents.find(c => c.name === compName);
      if (component && component.dependencies) {
        component.dependencies.forEach(dep => skapaDeps.add(dep));
      }
    });

    // Install Skapa dependencies one by one
    for (const dep of skapaDeps) {
      try {
        const depName = dep.startsWith('@') ? dep : `${dep}`;
        process.stdout.write(chalk.gray(`  Installing ${depName}... `));
        execSync(`npm install ${depName}`, {
          cwd: this.targetDir,
          stdio: 'pipe'
        });
        console.log(chalk.green('✓'));
      } catch (error) {
        console.log(chalk.gray('○ (skipped)'));
      }
    }
  }

  /**
   * Check if user is authenticated with IKEA registry
   */
  async checkRegistryAuthentication() {
    console.log(chalk.cyan('\n🔐 Checking IKEA registry authentication...\n'));

    try {
      // Check if registry is configured
      const registryConfig = execSync(
        'npm config get @ingka-group-digital:registry',
        { encoding: 'utf-8' }
      ).trim();

      if (!registryConfig || registryConfig === 'undefined') {
        console.log(chalk.yellow('⚠️  IKEA private registry not configured.\n'));
        console.log(chalk.white('Please configure the registry:'));
        console.log(chalk.gray('  npm config set @ingka-group-digital:registry https://npm.m2.blue.cdtapps.com/\n'));
        return false;
      }

      // Try to check authentication by viewing a package
      process.stdout.write(chalk.gray('  Checking authentication... '));
      execSync(
        'npm view @ingka-group-digital/cwds-react-header version',
        { stdio: 'pipe', encoding: 'utf-8' }
      );
      console.log(chalk.green('✓ Authenticated'));
      return true;

    } catch (error) {
      console.log(chalk.red('✗ Not authenticated\n'));

      console.log(chalk.yellow('⚠️  You need to authenticate with IKEA SSO.\n'));
      console.log(chalk.white('Run this command to authenticate:'));
      console.log(chalk.cyan('  npm login --registry=https://npm.m2.blue.cdtapps.com/ --scope=@ingka-group-digital\n'));

      console.log(chalk.gray('This will open your browser for SSO authentication.'));
      console.log(chalk.gray('After authentication, re-run: ux-ingka init\n'));

      console.log(chalk.white('📚 Full setup guide:'));
      console.log(chalk.gray('  docs/setup/INGKA_REGISTRY_SETUP.md\n'));

      return false;
    }
  }

  /**
   * Install CWDS packages
   */
  async installCWDSPackages() {
    // Check authentication before attempting installation
    const isAuthenticated = await this.checkRegistryAuthentication();
    if (!isAuthenticated) {
      console.log(chalk.red('❌ Cannot proceed without authentication.\n'));
      console.log(chalk.yellow('Please authenticate and try again.'));
      process.exit(1);
    }

    console.log(chalk.cyan('\n📦 Installing CWDS packages...\n'));

    const allComponents = this.getAllComponents();
    const installedPackages = new Set();

    for (const compName of this.selectedComponents) {
      const component = allComponents.find(c => c.name === compName);
      if (!component) continue;

      // Install main package
      if (!installedPackages.has(component.package)) {
        try {
          process.stdout.write(chalk.gray(`  ${component.label}... `));
          execSync(`npm install ${component.package}`, {
            cwd: this.targetDir,
            stdio: 'pipe'
          });
          installedPackages.add(component.package);
          console.log(chalk.green('✓'));
        } catch (error) {
          console.log(chalk.red('✗'));
          console.log(chalk.yellow(`    Warning: Failed to install ${component.package}`));
        }
      }

      // Install CWDS dependencies
      if (component.cwdsDependencies) {
        for (const dep of component.cwdsDependencies) {
          if (!installedPackages.has(dep)) {
            try {
              process.stdout.write(chalk.gray(`    → ${dep}... `));
              execSync(`npm install ${dep}`, {
                cwd: this.targetDir,
                stdio: 'pipe'
              });
              installedPackages.add(dep);
              console.log(chalk.green('✓'));
            } catch (error) {
              console.log(chalk.gray('○'));
            }
          }
        }
      }
    }
  }

  /**
   * Install authentication provider dependencies
   */
  async installAuthProvider() {
    if (!this.authProvider) return;

    console.log(chalk.cyan(`\n🔐 Installing ${this.authProvider === 'auth0' ? 'Auth0' : 'Azure MSAL'} dependencies...\n`));

    const iloffComponent = this.getAllComponents().find(c => c.name === 'iloff-layout-react');
    if (!iloffComponent || !iloffComponent.authOptions) return;

    const authDeps = iloffComponent.authOptions[this.authProvider];
    if (!authDeps) return;

    for (const dep of authDeps) {
      try {
        process.stdout.write(chalk.gray(`  ${dep}... `));
        execSync(`npm install ${dep}`, {
          cwd: this.targetDir,
          stdio: 'pipe'
        });
        console.log(chalk.green('✓'));
      } catch (error) {
        console.log(chalk.red('✗'));
      }
    }
  }

  /**
   * Create CSS import file with all required styles
   */
  async createCSSImports() {
    console.log(chalk.cyan('\n📝 Creating CSS imports...\n'));

    const stylesDir = path.join(this.targetDir, 'src', 'styles');
    await fs.ensureDir(stylesDir);

    let cssContent = `/* CWDS (Co-Worker Design Subsystem) Styles */
/* Auto-generated by UX Ingka Kit */

/* Skapa Base Styles */
@import "@ingka/base/dist/style.css";
@import "@ingka/button/dist/style.css";
@import "@ingka/focus/dist/style.css";
@import "@ingka/modal/dist/style.css";
@import "@ingka/svg-icon/dist/style.css";
`;

    // Add component-specific Skapa imports
    if (this.selectedComponents.some(c => ['cwds-react-layout', 'iloff-layout-react', 'cwds-react-user-profile'].includes(c))) {
      cssContent += `@import "@ingka/avatar/dist/style.css";
@import "@ingka/image/dist/style.css";
@import "@ingka/loading/dist/style.css";
`;
    }

    cssContent += `
/* CWDS Component Styles */
`;

    // Add CWDS component imports based on selection
    const allComponents = this.getAllComponents();
    this.selectedComponents.forEach(compName => {
      const component = allComponents.find(c => c.name === compName);
      if (component) {
        cssContent += `@import "${component.package}/style.css";\n`;
      }
    });

    // Add shared CWDS styles
    cssContent += `
/* CWDS Shared Styles */
@import "@ingka-group-digital/cwds-react-shared-modal/style.css";
@import "@ingka-group-digital/cwds-react-shared-nav/style.css";
@import "@ingka-group-digital/cwds-react-shared-tabs/style.css";
@import "@ingka-group-digital/cwds-react-shared-app-symbol/style.css";
`;

    if (this.selectedComponents.includes('cwds-variables')) {
      cssContent += `@import "@ingka-group-digital/cwds-variables/style.css";\n`;
    }

    const cssFile = path.join(stylesDir, 'cwds.css');
    await fs.writeFile(cssFile, cssContent, 'utf8');

    console.log(chalk.green('  ✓ Created src/styles/cwds.css'));
  }

  /**
   * Create example component files
   */
  async createExamples() {
    console.log(chalk.cyan('\n📝 Creating example components...\n'));

    const examplesDir = path.join(this.targetDir, 'src', 'components', 'cwds');
    await fs.ensureDir(examplesDir);

    // Create Layout example if selected
    if (this.selectedComponents.includes('cwds-react-layout')) {
      await this.createLayoutExample(examplesDir);
    }

    // Create ILOFF Layout example if selected
    if (this.selectedComponents.includes('iloff-layout-react')) {
      await this.createILOFFLayoutExample(examplesDir);
    }

    // Create App Switcher example if selected
    if (this.selectedComponents.includes('cwds-react-app-switcher')) {
      await this.createAppSwitcherExample(examplesDir);
    }

    // Create Mobile Navigation example if selected
    if (this.selectedComponents.includes('cwds-react-mobile-navigation')) {
      await this.createMobileNavigationExample(examplesDir);
    }

    // Create Navigation Menu example if selected
    if (this.selectedComponents.includes('cwds-react-nav-menu')) {
      await this.createNavMenuExample(examplesDir);
    }

    // Create User Profile example if selected
    if (this.selectedComponents.includes('cwds-react-user-profile')) {
      await this.createUserProfileExample(examplesDir);
    }
  }

  async createLayoutExample(dir) {
    const content = `import React, { FC, useCallback } from 'react';
import { Layout as CWDSLayout, LayoutProps as CWDSLayoutProps } from '@ingka-group-digital/cwds-react-layout';
import { useRouter } from 'next/router'; // Or your routing solution

interface LayoutProps {
  accessibleApps: any[];
  children: React.ReactNode;
  user: any;
  logout: () => void;
}

export const Layout: FC<LayoutProps> = ({ accessibleApps, children, user, logout }) => {
  const router = useRouter();

  const handleLocationChange = useCallback<NonNullable<CWDSLayoutProps['onRedirectChange']>>(
    async (href, target, event) => {
      event.preventDefault();
      await router.push(href);
    },
    [router]
  );

  const handleSeeAllApps = useCallback<NonNullable<CWDSLayoutProps['onSeeAllAppsClick']>>(
    async (event) => {
      event.preventDefault();
      await router.push('/apps'); // Adjust to your apps page
    },
    [router]
  );

  const handleHomeClick = useCallback<NonNullable<CWDSLayoutProps['onHomeClick']>>(
    async (event) => {
      event.preventDefault();
      await router.push('/');
    },
    [router]
  );

  return (
    <CWDSLayout
      narrowContent={true}
      accessibleApps={accessibleApps}
      headerNavMode={'HEADER_LINKS'}
      onRedirectChange={handleLocationChange}
      user={user}
      logoutCallback={logout}
      onSeeAllAppsClick={handleSeeAllApps}
      onHomeClick={handleHomeClick}
      isShowingBottomNav={false}
      isSeeAllAppsShown={true}
    >
      {children}
    </CWDSLayout>
  );
};
`;

    await fs.writeFile(path.join(dir, 'Layout.tsx'), content, 'utf8');
    console.log(chalk.green('  ✓ Created Layout.tsx'));
  }

  async createILOFFLayoutExample(dir) {
    const authImport = this.authProvider === 'auth0'
      ? `import { useAuth0 } from '@auth0/auth0-react';`
      : `import { useMsal } from '@azure/msal-react';`;

    const content = `import React, { FC, useCallback } from 'react';
import { IloffLayout, IloffLayoutProps } from '@ingka-group-digital/iloff-layout-react';
${authImport}
import { useRouter } from 'next/router'; // Or your routing solution

interface LayoutProps {
  children: React.ReactNode;
}

export const CoWorkerLayout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  ${this.authProvider === 'auth0' ? 'const { user, logout } = useAuth0();' : 'const { instance, accounts } = useMsal();'}

  const handleLocationChange = useCallback<NonNullable<IloffLayoutProps['onRedirectChange']>>(
    async (href, target, event) => {
      event.preventDefault();
      await router.push(href);
    },
    [router]
  );

  const handleSeeAllApps = useCallback<NonNullable<IloffLayoutProps['onSeeAllAppsClick']>>(
    async (event) => {
      event.preventDefault();
      await router.push('https://iloff.ingka.com'); // ILOFF URL
    },
    [router]
  );

  const handleHomeClick = useCallback<NonNullable<IloffLayoutProps['onHomeClick']>>(
    async (event) => {
      event.preventDefault();
      await router.push('/');
    },
    [router]
  );

  return (
    <IloffLayout
      narrowContent={true}
      headerNavMode={'HEADER_LINKS'}
      onRedirectChange={handleLocationChange}
      onSeeAllAppsClick={handleSeeAllApps}
      onHomeClick={handleHomeClick}
      isShowingBottomNav={false}
      isSeeAllAppsShown={true}
      envName="test" // Change to "prod" for production
      iloffBaseUrl="https://test.iloff.ingka.com"
      isAuth0Used={${this.authProvider === 'auth0'}}
    >
      {children}
    </IloffLayout>
  );
};
`;

    await fs.writeFile(path.join(dir, 'ILOFFLayout.tsx'), content, 'utf8');
    console.log(chalk.green('  ✓ Created ILOFFLayout.tsx'));
  }

  async createAppSwitcherExample(dir) {
    const content = `import React, { FC, useState, useCallback } from 'react';
import { AppSwitcherDrawer, AppSwitcherDrawerProps } from '@ingka-group-digital/cwds-react-app-switcher';
import { useRouter } from 'next/router';

interface AppSwitcherProps {
  accessibleApps: any[];
}

export const AppSwitcher: FC<AppSwitcherProps> = ({ accessibleApps }) => {
  const router = useRouter();
  const [visibleAppSwitcher, setVisibleAppSwitcher] = useState(false);

  const handleLocationChange = useCallback<NonNullable<AppSwitcherDrawerProps['onRedirectChange']>>(
    async (href, target, event) => {
      event.preventDefault();
      await router.push(href);
    },
    [router]
  );

  const handleSeeAllApps = useCallback<NonNullable<AppSwitcherDrawerProps['onSeeAllAppsClick']>>(
    async (event) => {
      event.preventDefault();
      await router.push('/apps');
    },
    [router]
  );

  const handleHomeClick = useCallback<NonNullable<AppSwitcherDrawerProps['onHomeClick']>>(
    async (event) => {
      event.preventDefault();
      await router.push('/');
    },
    [router]
  );

  return (
    <AppSwitcherDrawer
      visible={visibleAppSwitcher}
      accessibleApps={accessibleApps}
      isSeeAllAppsShown={true}
      dir="ltr"
      appSwitcherLabels={{
        title: 'Apps',
        goToHome: 'Go to Home',
        seeAllApps: 'See All Apps'
      }}
      onHomeClick={handleHomeClick}
      onSeeAllAppsClick={handleSeeAllApps}
      onRedirectChange={handleLocationChange}
      onAppSwitcherClose={() => setVisibleAppSwitcher(false)}
    />
  );
};
`;

    await fs.writeFile(path.join(dir, 'AppSwitcher.tsx'), content, 'utf8');
    console.log(chalk.green('  ✓ Created AppSwitcher.tsx'));
  }

  async createMobileNavigationExample(dir) {
    const content = `import React, { FC, useCallback } from 'react';
import { MobileNavigation, MobileNavigationProps } from '@ingka-group-digital/cwds-react-mobile-navigation';
import { useRouter } from 'next/router';

interface MobileNavProps {
  navItems: any[];
  dir?: 'ltr' | 'rtl';
}

export const BottomNavigation: FC<MobileNavProps> = ({ navItems, dir = 'ltr' }) => {
  const router = useRouter();

  const handleLocationChange = useCallback<NonNullable<MobileNavigationProps['onRedirectChange']>>(
    async (href, target, event) => {
      event.preventDefault();
      await router.push(href);
    },
    [router]
  );

  const onTabActivate = useCallback<NonNullable<MobileNavigationProps['onTabActivate']>>(
    async (tabId) => {
      console.log('Tab activated:', tabId);
    },
    []
  );

  return (
    <MobileNavigation
      navItems={navItems}
      dir={dir}
      onRedirectChange={handleLocationChange}
      onTabActivate={onTabActivate}
    />
  );
};
`;

    await fs.writeFile(path.join(dir, 'MobileNavigation.tsx'), content, 'utf8');
    console.log(chalk.green('  ✓ Created MobileNavigation.tsx'));
  }

  async createNavMenuExample(dir) {
    const content = `import React, { FC, useState, useCallback } from 'react';
import { NavMenuDrawer, NavMenuDrawerProps } from '@ingka-group-digital/cwds-react-nav-menu';
import { useRouter } from 'next/router';

interface NavMenuProps {
  navItems: any[];
  title: string;
  dir?: 'ltr' | 'rtl';
  prefix?: string;
}

export const NavigationMenu: FC<NavMenuProps> = ({ navItems, title, dir = 'ltr', prefix }) => {
  const router = useRouter();
  const [visibleNavMenu, setVisibleNavMenu] = useState(false);

  const handleLocationChange = useCallback<NonNullable<NavMenuDrawerProps['onRedirectChange']>>(
    async (href, target, event) => {
      event.preventDefault();
      await router.push(href);
    },
    [router]
  );

  return (
    <NavMenuDrawer
      navItems={navItems}
      title={title}
      visible={visibleNavMenu}
      prefix={prefix}
      onRedirectChange={handleLocationChange}
      dir={dir}
      onNavMenuClose={() => setVisibleNavMenu(false)}
    />
  );
};
`;

    await fs.writeFile(path.join(dir, 'NavigationMenu.tsx'), content, 'utf8');
    console.log(chalk.green('  ✓ Created NavigationMenu.tsx'));
  }

  async createUserProfileExample(dir) {
    const content = `import React, { FC, useState, useCallback } from 'react';
import { UserProfileDrawer, UserProfileDrawerProps } from '@ingka-group-digital/cwds-react-user-profile';
import { Button } from '@ingka/button';

interface UserProfileProps {
  user: any;
  logout: () => void;
  prefix?: string;
  dir?: 'ltr' | 'rtl';
}

export const UserProfile: FC<UserProfileProps> = ({ user, logout, prefix, dir = 'ltr' }) => {
  const [visibleUserProfile, setVisibleUserProfile] = useState(false);

  const languagePicker = (
    <Button type="secondary" iconPosition="trailing" size="small">
      English
    </Button>
  );

  const sections = [
    {
      title: 'Personal Information',
      description: 'Your profile details',
      template: (
        <div style={{ padding: '16px' }}>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
        </div>
      ),
    },
    {
      title: 'Settings',
      description: 'Application settings',
      template: (
        <div style={{ padding: '16px' }}>
          <p>Configure your preferences here</p>
        </div>
      ),
    },
  ];

  return (
    <UserProfileDrawer
      user={user}
      sections={sections}
      languagePicker={languagePicker}
      logoutCallback={logout}
      visible={visibleUserProfile}
      prefix={prefix}
      dir={dir}
      userProfileSectionListMode="LARGE"
      onUserProfileClose={() => setVisibleUserProfile(false)}
      userProfileLabels={{ signOut: 'Sign Out' }}
    />
  );
};
`;

    await fs.writeFile(path.join(dir, 'UserProfile.tsx'), content, 'utf8');
    console.log(chalk.green('  ✓ Created UserProfile.tsx'));
  }

  /**
   * Print next steps after installation
   */
  printNextSteps() {
    console.log(chalk.cyan.bold('📚 Next Steps:\n'));

    console.log(chalk.yellow('1. Import CWDS styles in your app:'));
    console.log(chalk.gray('   import \'./styles/cwds.css\';\n'));

    console.log(chalk.yellow('2. Import focus-visible polyfill:'));
    console.log(chalk.gray('   import \'focus-visible\';\n'));

    if (this.authProvider) {
      console.log(chalk.yellow('3. Configure authentication:'));
      if (this.authProvider === 'auth0') {
        console.log(chalk.gray('   - Set up Auth0Provider with your credentials'));
        console.log(chalk.gray('   - See: src/components/cwds/ILOFFLayout.tsx\n'));
      } else {
        console.log(chalk.gray('   - Set up MsalProvider with your Azure config'));
        console.log(chalk.gray('   - See: src/components/cwds/ILOFFLayout.tsx\n'));
      }
    }

    console.log(chalk.yellow('4. Use CWDS components:'));
    console.log(chalk.gray('   - Check example components in src/components/cwds/\n'));

    console.log(chalk.yellow('5. GitHub Package Registry Authentication:'));
    console.log(chalk.gray('   If installation failed, authenticate with GitHub:'));
    console.log(chalk.gray('   npm login --registry=https://npm.pkg.github.com\n'));

    console.log(chalk.cyan('📖 Documentation:'));
    console.log(chalk.gray('   https://skapa.ikea.com/subsystems/cwds\n'));
  }
}

module.exports = { CWDSInstaller, CWDS_COMPONENTS };
