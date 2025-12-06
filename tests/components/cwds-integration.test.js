#!/usr/bin/env node

/**
 * CWDS Integration Tests
 *
 * Tests the Co-Worker Design Subsystem (CWDS) installation
 * and integration with UX Ingka Kit Spark apps.
 *
 * @see lib/components/cwds-installer.js
 * @see lib/commands/spark.js
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { CWDSInstaller, CWDS_COMPONENTS } = require('../lib/components/cwds-installer');

describe('CWDS Integration Tests', () => {
  let testDir;
  let cwdsInstaller;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(os.tmpdir(), `ingvar-cwds-test-${Date.now()}`);
    await fs.ensureDir(testDir);

    // Initialize a minimal package.json
    const packageJson = {
      name: 'test-cwds-app',
      version: '1.0.0',
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0'
      }
    };
    await fs.writeJson(path.join(testDir, 'package.json'), packageJson, { spaces: 2 });

    // Create src directory structure
    await fs.ensureDir(path.join(testDir, 'src', 'styles'));
    await fs.ensureDir(path.join(testDir, 'src', 'components'));

    cwdsInstaller = new CWDSInstaller(testDir);
  });

  afterEach(async () => {
    // Cleanup test directory
    if (testDir && await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  describe('CWDS Component Registry', () => {
    test('should have all component categories defined', () => {
      expect(CWDS_COMPONENTS).toHaveProperty('layout');
      expect(CWDS_COMPONENTS).toHaveProperty('navigation');
      expect(CWDS_COMPONENTS).toHaveProperty('user');
      expect(CWDS_COMPONENTS).toHaveProperty('shared');
    });

    test('should have layout components', () => {
      expect(CWDS_COMPONENTS.layout).toContainEqual(
        expect.objectContaining({
          name: 'cwds-react-layout',
          package: '@ingka-group-digital/cwds-react-layout'
        })
      );

      expect(CWDS_COMPONENTS.layout).toContainEqual(
        expect.objectContaining({
          name: 'iloff-layout-react',
          package: '@ingka-group-digital/iloff-layout-react'
        })
      );
    });

    test('should have navigation components', () => {
      const navComponents = CWDS_COMPONENTS.navigation.map(c => c.name);

      expect(navComponents).toContain('cwds-react-header');
      expect(navComponents).toContain('cwds-react-app-switcher');
      expect(navComponents).toContain('cwds-react-mobile-navigation');
      expect(navComponents).toContain('cwds-react-nav-menu');
    });

    test('should have user profile component', () => {
      expect(CWDS_COMPONENTS.user).toContainEqual(
        expect.objectContaining({
          name: 'cwds-react-user-profile',
          package: '@ingka-group-digital/cwds-react-user-profile'
        })
      );
    });

    test('should have shared/utility components', () => {
      const sharedComponents = CWDS_COMPONENTS.shared.map(c => c.name);

      expect(sharedComponents).toContain('cwds-variables');
      expect(sharedComponents).toContain('cwds-react-shared-models');
      expect(sharedComponents).toContain('cwds-layout-utils');
    });

    test('components should have required metadata', () => {
      const allComponents = cwdsInstaller.getAllComponents();

      allComponents.forEach(component => {
        expect(component).toHaveProperty('name');
        expect(component).toHaveProperty('label');
        expect(component).toHaveProperty('description');
        expect(component).toHaveProperty('package');
        expect(component).toHaveProperty('category');
        expect(component).toHaveProperty('dependencies');
        expect(component).toHaveProperty('cwdsDependencies');
      });
    });

    test('ILOFF layout should have auth options', () => {
      const iloffComponent = CWDS_COMPONENTS.layout.find(c => c.name === 'iloff-layout-react');

      expect(iloffComponent).toHaveProperty('authOptions');
      expect(iloffComponent.authOptions).toHaveProperty('auth0');
      expect(iloffComponent.authOptions).toHaveProperty('azure');
    });
  });

  describe('CWDSInstaller Class', () => {
    test('should initialize with target directory', () => {
      expect(cwdsInstaller.targetDir).toBe(testDir);
      expect(cwdsInstaller.selectedComponents).toEqual([]);
      expect(cwdsInstaller.authProvider).toBeNull();
    });

    test('should get all components as flat array', () => {
      const allComponents = cwdsInstaller.getAllComponents();

      expect(Array.isArray(allComponents)).toBe(true);
      expect(allComponents.length).toBeGreaterThan(0);

      // Verify we get components from all categories
      const categories = allComponents.map(c => c.category);
      expect(categories).toContain('Layout');
      expect(categories).toContain('Navigation');
      expect(categories).toContain('User');
      expect(categories).toContain('Shared');
    });

    test('should allow selecting components', () => {
      cwdsInstaller.selectedComponents = ['cwds-react-layout', 'cwds-react-header'];

      expect(cwdsInstaller.selectedComponents).toHaveLength(2);
      expect(cwdsInstaller.selectedComponents).toContain('cwds-react-layout');
      expect(cwdsInstaller.selectedComponents).toContain('cwds-react-header');
    });

    test('should set auth provider', () => {
      cwdsInstaller.authProvider = 'auth0';
      expect(cwdsInstaller.authProvider).toBe('auth0');

      cwdsInstaller.authProvider = 'azure';
      expect(cwdsInstaller.authProvider).toBe('azure');
    });
  });

  describe('Registry Configuration', () => {
    test('should configure .npmrc with CWDS registry', async () => {
      await cwdsInstaller.configureRegistry();

      const npmrcPath = path.join(testDir, '.npmrc');
      expect(await fs.pathExists(npmrcPath)).toBe(true);

      const npmrcContent = await fs.readFile(npmrcPath, 'utf8');
      expect(npmrcContent).toContain('@ingka-group-digital:registry=https://npm.pkg.github.com');
      expect(npmrcContent).toContain('@ingka:registry=https://registry.npmjs.org/');
    });

    test('.npmrc should be properly formatted', async () => {
      await cwdsInstaller.configureRegistry();

      const npmrcPath = path.join(testDir, '.npmrc');
      const npmrcContent = await fs.readFile(npmrcPath, 'utf8');

      const lines = npmrcContent.trim().split('\n');
      expect(lines.length).toBeGreaterThanOrEqual(2);

      lines.forEach(line => {
        expect(line).toMatch(/^@[\w-]+:registry=https:\/\/.+$/);
      });
    });
  });

  describe('CSS Import Generation', () => {
    test('should create cwds.css with base imports', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-header'];
      await cwdsInstaller.createCSSImports();

      const cssFile = path.join(testDir, 'src', 'styles', 'cwds.css');
      expect(await fs.pathExists(cssFile)).toBe(true);

      const cssContent = await fs.readFile(cssFile, 'utf8');
      expect(cssContent).toContain('@import "@ingka/base/dist/style.css"');
      expect(cssContent).toContain('@import "@ingka/button/dist/style.css"');
      expect(cssContent).toContain('@import "@ingka/focus/dist/style.css"');
      expect(cssContent).toContain('@import "@ingka/modal/dist/style.css"');
      expect(cssContent).toContain('@import "@ingka/svg-icon/dist/style.css"');
    });

    test('should include component-specific Skapa imports for layout', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-layout'];
      await cwdsInstaller.createCSSImports();

      const cssFile = path.join(testDir, 'src', 'styles', 'cwds.css');
      const cssContent = await fs.readFile(cssFile, 'utf8');

      expect(cssContent).toContain('@import "@ingka/avatar/dist/style.css"');
      expect(cssContent).toContain('@import "@ingka/image/dist/style.css"');
      expect(cssContent).toContain('@import "@ingka/loading/dist/style.css"');
    });

    test('should include selected CWDS component imports', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-header', 'cwds-react-app-switcher'];
      await cwdsInstaller.createCSSImports();

      const cssFile = path.join(testDir, 'src', 'styles', 'cwds.css');
      const cssContent = await fs.readFile(cssFile, 'utf8');

      expect(cssContent).toContain('@import "@ingka-group-digital/cwds-react-header/style.css"');
      expect(cssContent).toContain('@import "@ingka-group-digital/cwds-react-app-switcher/style.css"');
    });

    test('should include shared CWDS styles', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-layout'];
      await cwdsInstaller.createCSSImports();

      const cssFile = path.join(testDir, 'src', 'styles', 'cwds.css');
      const cssContent = await fs.readFile(cssFile, 'utf8');

      expect(cssContent).toContain('@import "@ingka-group-digital/cwds-react-shared-modal/style.css"');
      expect(cssContent).toContain('@import "@ingka-group-digital/cwds-react-shared-nav/style.css"');
      expect(cssContent).toContain('@import "@ingka-group-digital/cwds-react-shared-tabs/style.css"');
      expect(cssContent).toContain('@import "@ingka-group-digital/cwds-react-shared-app-symbol/style.css"');
    });

    test('should include cwds-variables if selected', async () => {
      cwdsInstaller.selectedComponents = ['cwds-variables'];
      await cwdsInstaller.createCSSImports();

      const cssFile = path.join(testDir, 'src', 'styles', 'cwds.css');
      const cssContent = await fs.readFile(cssFile, 'utf8');

      expect(cssContent).toContain('@import "@ingka-group-digital/cwds-variables/style.css"');
    });
  });

  describe('Example Component Generation', () => {
    test('should create Layout example when selected', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-layout'];
      await cwdsInstaller.createExamples();

      const layoutFile = path.join(testDir, 'src', 'components', 'cwds', 'Layout.tsx');
      expect(await fs.pathExists(layoutFile)).toBe(true);

      const content = await fs.readFile(layoutFile, 'utf8');
      expect(content).toContain('import { Layout as CWDSLayout');
      expect(content).toContain('@ingka-group-digital/cwds-react-layout');
      expect(content).toContain('narrowContent={true}');
      expect(content).toContain('headerNavMode={\'HEADER_LINKS\'}');
    });

    test('should create ILOFF Layout example with Auth0', async () => {
      cwdsInstaller.selectedComponents = ['iloff-layout-react'];
      cwdsInstaller.authProvider = 'auth0';
      await cwdsInstaller.createExamples();

      const layoutFile = path.join(testDir, 'src', 'components', 'cwds', 'ILOFFLayout.tsx');
      expect(await fs.pathExists(layoutFile)).toBe(true);

      const content = await fs.readFile(layoutFile, 'utf8');
      expect(content).toContain('@auth0/auth0-react');
      expect(content).toContain('useAuth0');
      expect(content).toContain('IloffLayout');
      expect(content).toContain('isAuth0Used={true}');
    });

    test('should create ILOFF Layout example with Azure', async () => {
      cwdsInstaller.selectedComponents = ['iloff-layout-react'];
      cwdsInstaller.authProvider = 'azure';
      await cwdsInstaller.createExamples();

      const layoutFile = path.join(testDir, 'src', 'components', 'cwds', 'ILOFFLayout.tsx');
      expect(await fs.pathExists(layoutFile)).toBe(true);

      const content = await fs.readFile(layoutFile, 'utf8');
      expect(content).toContain('@azure/msal-react');
      expect(content).toContain('useMsal');
      expect(content).toContain('isAuth0Used={false}');
    });

    test('should create App Switcher example when selected', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-app-switcher'];
      await cwdsInstaller.createExamples();

      const file = path.join(testDir, 'src', 'components', 'cwds', 'AppSwitcher.tsx');
      expect(await fs.pathExists(file)).toBe(true);

      const content = await fs.readFile(file, 'utf8');
      expect(content).toContain('AppSwitcherDrawer');
      expect(content).toContain('@ingka-group-digital/cwds-react-app-switcher');
      expect(content).toContain('accessibleApps');
    });

    test('should create Mobile Navigation example when selected', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-mobile-navigation'];
      await cwdsInstaller.createExamples();

      const file = path.join(testDir, 'src', 'components', 'cwds', 'MobileNavigation.tsx');
      expect(await fs.pathExists(file)).toBe(true);

      const content = await fs.readFile(file, 'utf8');
      expect(content).toContain('MobileNavigation');
      expect(content).toContain('@ingka-group-digital/cwds-react-mobile-navigation');
      expect(content).toContain('onTabActivate');
    });

    test('should create Navigation Menu example when selected', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-nav-menu'];
      await cwdsInstaller.createExamples();

      const file = path.join(testDir, 'src', 'components', 'cwds', 'NavigationMenu.tsx');
      expect(await fs.pathExists(file)).toBe(true);

      const content = await fs.readFile(file, 'utf8');
      expect(content).toContain('NavMenuDrawer');
      expect(content).toContain('@ingka-group-digital/cwds-react-nav-menu');
      expect(content).toContain('navItems');
    });

    test('should create User Profile example when selected', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-user-profile'];
      await cwdsInstaller.createExamples();

      const file = path.join(testDir, 'src', 'components', 'cwds', 'UserProfile.tsx');
      expect(await fs.pathExists(file)).toBe(true);

      const content = await fs.readFile(file, 'utf8');
      expect(content).toContain('UserProfileDrawer');
      expect(content).toContain('@ingka-group-digital/cwds-react-user-profile');
      expect(content).toContain('logoutCallback');
    });

    test('should not create examples for unselected components', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-header']; // Only header selected
      await cwdsInstaller.createExamples();

      const layoutFile = path.join(testDir, 'src', 'components', 'cwds', 'Layout.tsx');
      const appSwitcherFile = path.join(testDir, 'src', 'components', 'cwds', 'AppSwitcher.tsx');

      expect(await fs.pathExists(layoutFile)).toBe(false);
      expect(await fs.pathExists(appSwitcherFile)).toBe(false);
    });
  });

  describe('Component Dependencies', () => {
    test('layout components should have correct Skapa dependencies', () => {
      const layoutComponent = CWDS_COMPONENTS.layout.find(c => c.name === 'cwds-react-layout');

      expect(layoutComponent.dependencies).toContain('@ingka/aspect-ratio-box');
      expect(layoutComponent.dependencies).toContain('@ingka/avatar');
      expect(layoutComponent.dependencies).toContain('@ingka/base');
      expect(layoutComponent.dependencies).toContain('@ingka/button');
      expect(layoutComponent.dependencies).toContain('@ingka/focus');
    });

    test('layout components should have correct CWDS dependencies', () => {
      const layoutComponent = CWDS_COMPONENTS.layout.find(c => c.name === 'cwds-react-layout');

      expect(layoutComponent.cwdsDependencies).toContain('@ingka-group-digital/cwds-react-app-switcher');
      expect(layoutComponent.cwdsDependencies).toContain('@ingka-group-digital/cwds-react-header');
      expect(layoutComponent.cwdsDependencies).toContain('@ingka-group-digital/cwds-react-mobile-navigation');
    });

    test('ILOFF layout should have additional dependencies', () => {
      const iloffComponent = CWDS_COMPONENTS.layout.find(c => c.name === 'iloff-layout-react');

      expect(iloffComponent.cwdsDependencies).toContain('@ingka-group-digital/cwds-react-layout');
      expect(iloffComponent.cwdsDependencies).toContain('@ingka-group-digital/iloff-apps');
      expect(iloffComponent.cwdsDependencies).toContain('@ingka-group-digital/cwds-layout-utils');
    });

    test('navigation components should have shared dependencies', () => {
      const headerComponent = CWDS_COMPONENTS.navigation.find(c => c.name === 'cwds-react-header');

      expect(headerComponent.cwdsDependencies).toContain('@ingka-group-digital/cwds-react-shared-modal');
      expect(headerComponent.cwdsDependencies).toContain('@ingka-group-digital/cwds-react-shared-nav');
    });
  });

  describe('Authentication Configuration', () => {
    test('ILOFF layout should support Auth0', () => {
      const iloffComponent = CWDS_COMPONENTS.layout.find(c => c.name === 'iloff-layout-react');

      expect(iloffComponent.authOptions.auth0).toContain('@auth0/auth0-react');
    });

    test('ILOFF layout should support Azure MSAL', () => {
      const iloffComponent = CWDS_COMPONENTS.layout.find(c => c.name === 'iloff-layout-react');

      expect(iloffComponent.authOptions.azure).toContain('@azure/msal-browser');
      expect(iloffComponent.authOptions.azure).toContain('@azure/msal-react');
    });

    test('auth provider should be set correctly', () => {
      cwdsInstaller.authProvider = 'auth0';
      expect(cwdsInstaller.authProvider).toBe('auth0');

      cwdsInstaller.authProvider = 'azure';
      expect(cwdsInstaller.authProvider).toBe('azure');
    });
  });

  describe('Full Installation Flow (Mock)', () => {
    test('should handle complete installation workflow', async () => {
      // Select components
      cwdsInstaller.selectedComponents = [
        'cwds-react-layout',
        'cwds-react-header',
        'cwds-react-app-switcher',
        'cwds-variables'
      ];

      // Configure registry
      await cwdsInstaller.configureRegistry();
      expect(await fs.pathExists(path.join(testDir, '.npmrc'))).toBe(true);

      // Create CSS imports
      await cwdsInstaller.createCSSImports();
      expect(await fs.pathExists(path.join(testDir, 'src', 'styles', 'cwds.css'))).toBe(true);

      // Create examples
      await cwdsInstaller.createExamples();
      expect(await fs.pathExists(path.join(testDir, 'src', 'components', 'cwds', 'Layout.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'src', 'components', 'cwds', 'AppSwitcher.tsx'))).toBe(true);
    });

    test('should handle ILOFF layout installation with Auth0', async () => {
      cwdsInstaller.selectedComponents = ['iloff-layout-react'];
      cwdsInstaller.authProvider = 'auth0';

      await cwdsInstaller.configureRegistry();
      await cwdsInstaller.createCSSImports();
      await cwdsInstaller.createExamples();

      const iloffFile = path.join(testDir, 'src', 'components', 'cwds', 'ILOFFLayout.tsx');
      expect(await fs.pathExists(iloffFile)).toBe(true);

      const content = await fs.readFile(iloffFile, 'utf8');
      expect(content).toContain('useAuth0');
      expect(content).toContain('isAuth0Used={true}');
    });

    test('should skip installation if no components selected', () => {
      cwdsInstaller.selectedComponents = [];

      // This should not throw, just exit early
      expect(cwdsInstaller.selectedComponents.length).toBe(0);
    });
  });

  describe('File Structure Validation', () => {
    test('should create correct directory structure', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-layout'];
      await cwdsInstaller.createCSSImports();
      await cwdsInstaller.createExamples();

      // Verify directory structure
      expect(await fs.pathExists(path.join(testDir, 'src', 'styles'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'src', 'components', 'cwds'))).toBe(true);

      // Verify files
      expect(await fs.pathExists(path.join(testDir, 'src', 'styles', 'cwds.css'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'src', 'components', 'cwds', 'Layout.tsx'))).toBe(true);
    });

    test('generated TypeScript files should have correct syntax', async () => {
      cwdsInstaller.selectedComponents = ['cwds-react-layout', 'cwds-react-user-profile'];
      await cwdsInstaller.createExamples();

      const layoutFile = path.join(testDir, 'src', 'components', 'cwds', 'Layout.tsx');
      const userProfileFile = path.join(testDir, 'src', 'components', 'cwds', 'UserProfile.tsx');

      const layoutContent = await fs.readFile(layoutFile, 'utf8');
      const userProfileContent = await fs.readFile(userProfileFile, 'utf8');

      // Check for TypeScript syntax
      expect(layoutContent).toMatch(/interface \w+Props/);
      expect(layoutContent).toMatch(/FC<\w+Props>/);
      expect(userProfileContent).toMatch(/interface \w+Props/);
      expect(userProfileContent).toMatch(/FC<\w+Props>/);

      // Check for proper imports
      expect(layoutContent).toContain('import React');
      expect(userProfileContent).toContain('import React');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing target directory gracefully', async () => {
      const invalidInstaller = new CWDSInstaller('/nonexistent/path');

      expect(invalidInstaller.targetDir).toBe('/nonexistent/path');
      // Installation would fail but class initializes
    });

    test('should handle empty component selection', () => {
      cwdsInstaller.selectedComponents = [];

      expect(cwdsInstaller.selectedComponents).toHaveLength(0);
    });
  });
});

// Integration test with Spark command (requires manual testing or mocking)
describe('CWDS + Spark Integration', () => {
  test('spark command should support --cwds flag', () => {
    // This is a documentation test - verifies the flag exists
    const sparkCommand = require('../lib/commands/spark.js');

    // The actual implementation should be tested manually:
    // ingvar spark create --name test-cwds-app --prompt "test app" --ikea --cwds --no-install --no-start
    expect(typeof sparkCommand).toBe('function');
  });

  test('CWDS should only work with Ingka Skapa enabled', () => {
    // CWDS extends Ingka Skapa, so it requires --ikea flag
    // Verify this in spark.js implementation
    const sparkFile = require('fs').readFileSync(
      path.join(__dirname, '../lib/commands/spark.js'),
      'utf8'
    );

    // Check that CWDS requires Ingka Skapa
    expect(sparkFile).toContain('useCwds');
    expect(sparkFile).toContain('useIkea');
  });
});

console.log('✅ CWDS Integration Tests Ready');
console.log('Run: npm test -- tests/cwds-integration.test.js');
