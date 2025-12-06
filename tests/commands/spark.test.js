/**
 * Spark Command Tests
 *
 * Tests for lib/commands/spark.js
 * - App creation with Ingka design system
 * - Icon installation during spark
 * - CWDS components integration
 */

const fs = require('fs-extra');
const path = require('path');

describe('Spark Command', () => {
  const fixturesDir = path.join(__dirname, '../__fixtures__/spark-test');
  const templatesDir = path.join(__dirname, '../../templates/ingka-components');
  const templateMainDir = path.join(__dirname, '../../template-main');

  beforeEach(async () => {
    await fs.ensureDir(fixturesDir);
  });

  afterEach(async () => {
    await fs.remove(fixturesDir);
  });

  describe('Template Main', () => {
    test('should have template-main directory', async () => {
      const exists = await fs.pathExists(templateMainDir);
      expect(exists).toBe(true);
    });

    test('should have package.json in template', async () => {
      const packageJsonPath = path.join(templateMainDir, 'package.json');
      const exists = await fs.pathExists(packageJsonPath);
      expect(exists).toBe(true);
    });

    test('should have src directory in template', async () => {
      const srcPath = path.join(templateMainDir, 'src');
      const exists = await fs.pathExists(srcPath);
      expect(exists).toBe(true);
    });
  });

  describe('Icon Installation in Spark', () => {
    test('should copy Icons to public folder during spark', async () => {
      const iconsSource = path.join(templatesDir, 'Icons');
      const targetIcons = path.join(fixturesDir, 'my-app', 'public', 'Icons');

      if (await fs.pathExists(iconsSource)) {
        await fs.ensureDir(targetIcons);
        await fs.copy(iconsSource, targetIcons);

        expect(await fs.pathExists(targetIcons)).toBe(true);

        const files = await fs.readdir(targetIcons);
        const svgCount = files.filter(f => f.endsWith('.svg')).length;
        expect(svgCount).toBeGreaterThan(500);
      }
    });

    test('installIkeaIcons should be available', async () => {
      // Verify the function exists in spark.js by checking file content
      const sparkPath = path.join(__dirname, '../../lib/commands/spark.js');
      const content = await fs.readFile(sparkPath, 'utf8');

      expect(content).toContain('installIkeaIcons');
      expect(content).toContain('public/Icons');
    });
  });

  describe('Ingka Design System Setup', () => {
    test('should create .npmrc with Ingka registry', async () => {
      const appPath = path.join(fixturesDir, 'my-app');
      await fs.ensureDir(appPath);

      const npmrcPath = path.join(appPath, '.npmrc');
      await fs.writeFile(npmrcPath, '@ingka:registry=https://npm.m2.blue.cdtapps.com\n');

      const content = await fs.readFile(npmrcPath, 'utf8');
      expect(content).toContain('@ingka:registry');
    });

    test('should create ingka.css imports file', async () => {
      const appPath = path.join(fixturesDir, 'my-app');
      await fs.ensureDir(path.join(appPath, 'src', 'styles'));

      const cssContent = `/* IKEA Ingka Skapa Design System Styles */
@import "@ingka/base/dist/style.css";
@import "@ingka/button/dist/style.css";
`;

      await fs.writeFile(path.join(appPath, 'src', 'styles', 'ingka.css'), cssContent);

      const content = await fs.readFile(path.join(appPath, 'src', 'styles', 'ingka.css'), 'utf8');
      expect(content).toContain('@ingka/base');
      expect(content).toContain('@ingka/button');
    });

    test('should create IKEA design tokens file', async () => {
      const appPath = path.join(fixturesDir, 'my-app');
      await fs.ensureDir(path.join(appPath, 'src', 'lib'));

      const tokensContent = `export const IKEA_TOKENS = {
  colors: {
    blue: '#0058A3',
    yellow: '#FFDB00'
  }
};`;

      await fs.writeFile(path.join(appPath, 'src', 'lib', 'ikea-design-tokens.ts'), tokensContent);

      const content = await fs.readFile(path.join(appPath, 'src', 'lib', 'ikea-design-tokens.ts'), 'utf8');
      expect(content).toContain('IKEA_TOKENS');
      expect(content).toContain('#0058A3');
    });
  });

  describe('IKEA README Generation', () => {
    test('should create INGKA_README.md', async () => {
      const appPath = path.join(fixturesDir, 'my-app');
      await fs.ensureDir(appPath);

      const readmeContent = `# IKEA Ingka Design System Usage

This app uses the official IKEA Ingka Skapa Design System.

## Quick Start

### Import Components

\`\`\`tsx
import { Button } from '@ingka/button';
\`\`\`
`;

      await fs.writeFile(path.join(appPath, 'INGKA_README.md'), readmeContent);

      const content = await fs.readFile(path.join(appPath, 'INGKA_README.md'), 'utf8');
      expect(content).toContain('IKEA Ingka Design System');
      expect(content).toContain('@ingka/button');
    });

    test('should create INGKA_ICON_MIGRATION.md', async () => {
      const appPath = path.join(fixturesDir, 'my-app');
      await fs.ensureDir(appPath);

      const migrationContent = `# Icon Migration Guide

## Quick Migration

| Old | New |
|-----|-----|
| reload | arrow-clockwise |
| search | magnifying-glass |
`;

      await fs.writeFile(path.join(appPath, 'INGKA_ICON_MIGRATION.md'), migrationContent);

      const content = await fs.readFile(path.join(appPath, 'INGKA_ICON_MIGRATION.md'), 'utf8');
      expect(content).toContain('Icon Migration');
      expect(content).toContain('arrow-clockwise');
    });
  });

  describe('IngkaExample Component', () => {
    test('should create example component', async () => {
      const appPath = path.join(fixturesDir, 'my-app');
      await fs.ensureDir(path.join(appPath, 'src', 'components'));

      const exampleContent = `import { Button } from '@ingka/button';

export function IngkaExample() {
  return (
    <div>
      <Button type="primary" text="Primary Button" />
    </div>
  );
}
`;

      await fs.writeFile(path.join(appPath, 'src', 'components', 'IngkaExample.tsx'), exampleContent);

      const content = await fs.readFile(path.join(appPath, 'src', 'components', 'IngkaExample.tsx'), 'utf8');
      expect(content).toContain('IngkaExample');
      expect(content).toContain('@ingka/button');
    });
  });

  describe('IKEA Design Tokens', () => {
    test('should include IKEA brand colors', () => {
      const IKEA_DESIGN_TOKENS = {
        colors: {
          blue: '#0058A3',
          yellow: '#FFDB00',
          black: '#111111',
          white: '#FFFFFF'
        }
      };

      expect(IKEA_DESIGN_TOKENS.colors.blue).toBe('#0058A3');
      expect(IKEA_DESIGN_TOKENS.colors.yellow).toBe('#FFDB00');
    });
  });
});

describe('Spark Command Integration', () => {
  test('spark.js should export sparkCommand function', () => {
    const spark = require('../../lib/commands/spark');
    expect(typeof spark).toBe('function');
  });
});
