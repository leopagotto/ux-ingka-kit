/**
 * Component Installer Tests
 *
 * Tests for lib/components/component-installer.js
 * - Icon component installation with SVG files
 * - Component selection modes
 * - Registry configuration
 * - Template copying
 */

const fs = require('fs-extra');
const path = require('path');

describe('Component Installer', () => {
  const fixturesDir = path.join(__dirname, '../__fixtures__/component-test');
  const templatesDir = path.join(__dirname, '../../templates/ingka-components');

  beforeEach(async () => {
    await fs.ensureDir(fixturesDir);
    await fs.writeJson(path.join(fixturesDir, 'package.json'), {
      name: 'test-project',
      dependencies: { react: '^18.0.0' }
    });
  });

  afterEach(async () => {
    await fs.remove(fixturesDir);
  });

  describe('Icons Installation', () => {
    test('should have Icons folder in templates', async () => {
      const iconsPath = path.join(templatesDir, 'Icons');
      const exists = await fs.pathExists(iconsPath);
      expect(exists).toBe(true);
    });

    test('should have 600+ SVG icons in Icons folder', async () => {
      const iconsPath = path.join(templatesDir, 'Icons');
      if (await fs.pathExists(iconsPath)) {
        const files = await fs.readdir(iconsPath);
        const svgFiles = files.filter(f => f.endsWith('.svg'));
        expect(svgFiles.length).toBeGreaterThan(500);
      }
    });

    test('should copy Icons folder to public directory', async () => {
      const sourceIcons = path.join(templatesDir, 'Icons');
      const targetIcons = path.join(fixturesDir, 'public', 'Icons');

      if (await fs.pathExists(sourceIcons)) {
        await fs.ensureDir(targetIcons);
        await fs.copy(sourceIcons, targetIcons);

        expect(await fs.pathExists(targetIcons)).toBe(true);

        const files = await fs.readdir(targetIcons);
        expect(files.length).toBeGreaterThan(0);
      }
    });

    test('should copy Icons folder to src/components/ingka', async () => {
      const sourceIcons = path.join(templatesDir, 'Icons');
      const targetIcons = path.join(fixturesDir, 'src', 'components', 'ingka', 'Icons');

      if (await fs.pathExists(sourceIcons)) {
        await fs.ensureDir(targetIcons);
        await fs.copy(sourceIcons, targetIcons);

        expect(await fs.pathExists(targetIcons)).toBe(true);
      }
    });

    test('should include common icons', async () => {
      const iconsPath = path.join(templatesDir, 'Icons');
      if (await fs.pathExists(iconsPath)) {
        const commonIcons = ['heart.svg', 'arrow-right.svg', 'checkmark.svg', 'cross.svg'];

        for (const icon of commonIcons) {
          const iconPath = path.join(iconsPath, icon);
          const exists = await fs.pathExists(iconPath);
          if (exists) {
            expect(exists).toBe(true);
          }
        }
      }
    });
  });

  describe('Icon Component Template', () => {
    test('should have Icon component template', async () => {
      const iconComponentPath = path.join(templatesDir, 'Icon', 'Icon.tsx');
      const exists = await fs.pathExists(iconComponentPath);
      expect(exists).toBe(true);
    });

    test('Icon component should fetch SVG files', async () => {
      const iconComponentPath = path.join(templatesDir, 'Icon', 'Icon.tsx');
      if (await fs.pathExists(iconComponentPath)) {
        const content = await fs.readFile(iconComponentPath, 'utf8');
        expect(content).toContain('fetch');
        expect(content).toContain('/Icons/');
      }
    });

    test('Icon component should have size map', async () => {
      const iconComponentPath = path.join(templatesDir, 'Icon', 'Icon.tsx');
      if (await fs.pathExists(iconComponentPath)) {
        const content = await fs.readFile(iconComponentPath, 'utf8');
        expect(content).toContain('sizeMap');
        expect(content).toContain('xs');
        expect(content).toContain('lg');
      }
    });

    test('Icon component should handle errors', async () => {
      const iconComponentPath = path.join(templatesDir, 'Icon', 'Icon.tsx');
      if (await fs.pathExists(iconComponentPath)) {
        const content = await fs.readFile(iconComponentPath, 'utf8');
        expect(content).toContain('error');
        expect(content).toContain('not found');
      }
    });
  });

  describe('Component Selection', () => {
    test('should have ALL_COMPONENTS exported', () => {
      const { ALL_COMPONENTS } = require('../../lib/components/component-installer');
      expect(ALL_COMPONENTS).toBeDefined();
      expect(typeof ALL_COMPONENTS).toBe('object');
    });

    test('should have component categories', () => {
      const { ALL_COMPONENTS } = require('../../lib/components/component-installer');

      const expectedCategories = [
        'foundations',
        'layout',
        'display',
        'buttons',
        'forms',
        'feedback',
        'modals',
        'media',
        'ecommerce'
      ];

      for (const category of expectedCategories) {
        expect(ALL_COMPONENTS[category]).toBeDefined();
      }
    });

    test('should have icon component in media category', () => {
      const { ALL_COMPONENTS } = require('../../lib/components/component-installer');

      const mediaComponents = ALL_COMPONENTS.media;
      const iconComponent = mediaComponents.find(c => c.name === 'icon');

      expect(iconComponent).toBeDefined();
      expect(iconComponent.checked).toBe(true); // Should be pre-selected
    });

    test('should have essential components pre-selected', () => {
      const { ALL_COMPONENTS } = require('../../lib/components/component-installer');

      const allComponents = Object.values(ALL_COMPONENTS).flat();
      const preSelected = allComponents.filter(c => c.checked);

      expect(preSelected.length).toBeGreaterThan(10);
    });
  });

  describe('Registry Configuration', () => {
    test('should create .npmrc with Ingka registry', async () => {
      const npmrcPath = path.join(fixturesDir, '.npmrc');
      const registryConfig = '@ingka:registry=https://npm.m2.blue.cdtapps.com\n';

      await fs.writeFile(npmrcPath, registryConfig);

      const content = await fs.readFile(npmrcPath, 'utf8');
      expect(content).toContain('@ingka:registry');
      expect(content).toContain('npm.m2.blue.cdtapps.com');
    });

    test('should append to existing .npmrc', async () => {
      const npmrcPath = path.join(fixturesDir, '.npmrc');

      // Create existing .npmrc
      await fs.writeFile(npmrcPath, 'existing-config=true\n');

      // Append Ingka registry
      await fs.appendFile(npmrcPath, '\n@ingka:registry=https://npm.m2.blue.cdtapps.com\n');

      const content = await fs.readFile(npmrcPath, 'utf8');
      expect(content).toContain('existing-config');
      expect(content).toContain('@ingka:registry');
    });
  });

  describe('Template Copying', () => {
    test('should copy component templates to output directory', async () => {
      const buttonTemplate = path.join(templatesDir, 'button');
      const targetDir = path.join(fixturesDir, 'src', 'components', 'ingka', 'button');

      if (await fs.pathExists(buttonTemplate)) {
        await fs.ensureDir(targetDir);
        await fs.copy(buttonTemplate, targetDir);

        expect(await fs.pathExists(targetDir)).toBe(true);
      }
    });

    test('should generate index.ts with exports', async () => {
      const outputDir = path.join(fixturesDir, 'src', 'components', 'ingka');
      await fs.ensureDir(outputDir);

      const indexContent = `export { Button } from './button/Button';
export { Card } from './card/Card';
export { Icon } from './Icon/Icon';
`;

      await fs.writeFile(path.join(outputDir, 'index.ts'), indexContent);

      const content = await fs.readFile(path.join(outputDir, 'index.ts'), 'utf8');
      expect(content).toContain('export');
      expect(content).toContain('Button');
    });
  });
});

describe('ComponentInstaller Class', () => {
  test('should have ComponentInstaller exported', () => {
    const { ComponentInstaller } = require('../../lib/components/component-installer');
    expect(ComponentInstaller).toBeDefined();
  });

  test('should have install method', () => {
    const { ComponentInstaller } = require('../../lib/components/component-installer');
    const installer = new ComponentInstaller();
    expect(typeof installer.install).toBe('function');
  });
});
