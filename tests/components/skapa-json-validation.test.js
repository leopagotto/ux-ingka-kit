/**
 * Skapa JSON Extraction Validation Tests
 * Verifies that all extracted JSON specification files are valid and contain expected data
 */

const fs = require('fs-extra');
const path = require('path');

const SKAPA_JSON_DIR = path.join(__dirname, '../docs/guides/Skapa-json');

describe('Skapa JSON Extraction', () => {
  let allFiles = [];
  let componentFiles = [];
  let foundationFiles = [];
  let subsystemFiles = [];

  beforeAll(async () => {
    allFiles = fs
      .readdirSync(SKAPA_JSON_DIR, { recursive: true })
      .filter(f => f.endsWith('.json') && !f.includes('index.json'));

    componentFiles = allFiles.filter(f => f.startsWith('components/'));
    foundationFiles = allFiles.filter(f => f.startsWith('foundations/'));
    subsystemFiles = allFiles.filter(f => f.startsWith('subsystems/'));
  });

  describe('File Inventory', () => {
    test('should extract 62+ component files', () => {
      expect(componentFiles.length).toBeGreaterThanOrEqual(60);
    });

    test('should extract 20+ foundation files', () => {
      expect(foundationFiles.length).toBeGreaterThanOrEqual(20);
    });

    test('should extract 6+ subsystem files', () => {
      expect(subsystemFiles.length).toBeGreaterThanOrEqual(6);
    });

    test('should have master index.json', () => {
      const indexPath = path.join(SKAPA_JSON_DIR, 'index.json');
      expect(fs.existsSync(indexPath)).toBe(true);
    });
  });

  describe('JSON Validity', () => {
    test('all JSON files should be valid', () => {
      const errors = [];

      allFiles.forEach(file => {
        try {
          const fullPath = path.join(SKAPA_JSON_DIR, file);
          const content = fs.readFileSync(fullPath, 'utf8');
          JSON.parse(content);
        } catch (e) {
          errors.push(`${file}: ${e.message}`);
        }
      });

      expect(errors).toHaveLength(0);
    });

    test('master index should be valid JSON', () => {
      const indexPath = path.join(SKAPA_JSON_DIR, 'index.json');
      const content = fs.readFileSync(indexPath, 'utf8');
      const index = JSON.parse(content);

      expect(index).toHaveProperty('components');
      expect(index).toHaveProperty('foundations');
      expect(index).toHaveProperty('subsystems');
    });
  });

  describe('Component Spec Structure', () => {
    test('components should have required fields', () => {
      const buttonPath = path.join(SKAPA_JSON_DIR, 'components/Button.json');
      const data = JSON.parse(fs.readFileSync(buttonPath, 'utf8'));

      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('category');
      expect(data).toHaveProperty('source');
      expect(data).toHaveProperty('extractedAt');
      expect(data).toHaveProperty('extractionMethod');
    });

    test('components should have variants and states', () => {
      const buttonPath = path.join(SKAPA_JSON_DIR, 'components/Button.json');
      const data = JSON.parse(fs.readFileSync(buttonPath, 'utf8'));

      expect(Array.isArray(data.variants)).toBe(true);
      expect(Array.isArray(data.states)).toBe(true);
      expect(data.variants.length).toBeGreaterThan(0);
    });

    test('components should have extracted content', () => {
      const buttonPath = path.join(SKAPA_JSON_DIR, 'components/Button.json');
      const data = JSON.parse(fs.readFileSync(buttonPath, 'utf8'));

      // Should have either structured data or raw text content
      expect(
        data.content?.rawText ||
        data.description ||
        data.anatomy ||
        data.usage
      ).toBeTruthy();
    });
  });

  describe('Foundation Spec Structure', () => {
    test('foundations should have tokens', () => {
      const spacingPath = path.join(SKAPA_JSON_DIR, 'foundations/Spacing.json');
      const data = JSON.parse(fs.readFileSync(spacingPath, 'utf8'));

      expect(data).toHaveProperty('name');
      expect(Array.isArray(data.tokens) || Array.isArray(data.values)).toBe(true);
    });

    test('color foundations should have tokens with values', () => {
      const files = fs.readdirSync(path.join(SKAPA_JSON_DIR, 'foundations'));
      const colorFile = files.find(f => f.toLowerCase().includes('colour') || f.toLowerCase().includes('color'));

      if (colorFile) {
        const data = JSON.parse(
          fs.readFileSync(path.join(SKAPA_JSON_DIR, 'foundations', colorFile), 'utf8')
        );

        if (data.tokens && data.tokens.length > 0) {
          expect(data.tokens[0]).toHaveProperty('name');
          expect(data.tokens[0]).toHaveProperty('value');
        }
      }
    });
  });

  describe('Subsystem Spec Structure', () => {
    test('subsystems should be categorized as ingka-co-worker', () => {
      const profilePath = path.join(SKAPA_JSON_DIR, 'subsystems/Ingka-Co-Worker-Profile.json');
      const data = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

      expect(data.name).toMatch(/Co-Worker|Ingka/i);
    });

    test('subsystems should have variants', () => {
      const profilePath = path.join(SKAPA_JSON_DIR, 'subsystems/Ingka-Co-Worker-Profile.json');
      const data = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

      expect(Array.isArray(data.variants) || Array.isArray(data.states)).toBe(true);
    });
  });

  describe('Index Metadata', () => {
    test('index should list all components', () => {
      const indexPath = path.join(SKAPA_JSON_DIR, 'index.json');
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

      expect(index.components.count).toBeGreaterThanOrEqual(60);
      expect(Array.isArray(index.components.files)).toBe(true);
      expect(index.components.files.length).toBeGreaterThanOrEqual(60);
    });

    test('index should list all foundations', () => {
      const indexPath = path.join(SKAPA_JSON_DIR, 'index.json');
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

      expect(index.foundations.count).toBeGreaterThanOrEqual(20);
      expect(Array.isArray(index.foundations.files)).toBe(true);
    });

    test('index should list all subsystems', () => {
      const indexPath = path.join(SKAPA_JSON_DIR, 'index.json');
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

      expect(index.subsystems.count).toBeGreaterThanOrEqual(6);
      expect(Array.isArray(index.subsystems.files)).toBe(true);
    });

    test('index should have generation metadata', () => {
      const indexPath = path.join(SKAPA_JSON_DIR, 'index.json');
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

      expect(index).toHaveProperty('generated');
      expect(index).toHaveProperty('version');
      expect(index).toHaveProperty('extractionMethod');
    });
  });

  describe('OCR Content Quality', () => {
    test('extracted content should contain meaningful text', () => {
      const buttonPath = path.join(SKAPA_JSON_DIR, 'components/Button.json');
      const data = JSON.parse(fs.readFileSync(buttonPath, 'utf8'));

      // Check for presence of design documentation keywords
      const contentText = data.content?.rawText || data.description || '';
      expect(contentText.length).toBeGreaterThan(100);
      expect(contentText.toLowerCase()).toMatch(/(button|variant|state|usage)/i);
    });

    test('spacing foundation should have numeric values', () => {
      const spacingPath = path.join(SKAPA_JSON_DIR, 'foundations/Spacing.json');
      const data = JSON.parse(fs.readFileSync(spacingPath, 'utf8'));

      if (data.tokens && data.tokens.length > 0) {
        const token = data.tokens[0];
        // Should have a numeric or px value
        expect(token.value || token.name).toMatch(/\d+/);
      }
    });
  });
});
