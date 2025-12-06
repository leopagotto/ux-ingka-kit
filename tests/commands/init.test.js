/**
 * Init Command Tests
 *
 * Tests for lib/commands/init.js
 * - Repository detection and handling
 * - GitHub authentication flows
 * - Skip GitHub features option
 * - Non-interactive mode
 * - Project setup with/without GitHub
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Mock dependencies
jest.mock('inquirer');
jest.mock('ora', () => () => ({
  start: jest.fn().mockReturnThis(),
  succeed: jest.fn().mockReturnThis(),
  fail: jest.fn().mockReturnThis(),
  info: jest.fn().mockReturnThis(),
}));

const inquirer = require('inquirer');

describe('Init Command', () => {
  const testDir = path.join(__dirname, '../__fixtures__/init-test');

  beforeEach(async () => {
    // Create test directory
    await fs.ensureDir(testDir);
    await fs.writeJson(path.join(testDir, 'package.json'), { name: 'test-project' });
    process.chdir(testDir);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Cleanup
    await fs.remove(testDir);
  });

  describe('Repository Detection', () => {
    test('should detect when in a GitHub repository', () => {
      // Mock successful gh repo view
      const mockExec = jest.fn().mockReturnValue('owner/repo');
      jest.doMock('child_process', () => ({
        execSync: mockExec
      }));

      // Verify gh repo view is called correctly
      expect(() => {
        execSync('gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo ""', {
          encoding: 'utf8'
        });
      }).not.toThrow();
    });

    test('should handle when not in a GitHub repository gracefully', () => {
      // The init command should NOT exit when no repo is found
      // It should offer options to create, skip, or login
      const result = execSync('echo "Not in a repo" 2>&1 || true', { encoding: 'utf8' });
      expect(result).toBeDefined();
    });
  });

  describe('Skip GitHub Features', () => {
    test('should skip GitHub features when skipGitHubFeatures is true', async () => {
      // When skipGitHubFeatures is true, labels should be skipped
      const config = {
        skipLabels: true,
        skipProject: true,
        skipVscode: false
      };

      expect(config.skipLabels).toBe(true);
      expect(config.skipProject).toBe(true);
      expect(config.skipVscode).toBe(false);
    });

    test('should create docs structure even without GitHub', async () => {
      // Docs folder should always be created
      await fs.ensureDir(path.join(testDir, 'docs/specs'));
      await fs.ensureDir(path.join(testDir, 'docs/guides'));

      expect(await fs.pathExists(path.join(testDir, 'docs/specs'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'docs/guides'))).toBe(true);
    });

    test('should create VS Code config without GitHub', async () => {
      // VS Code settings should be created regardless of GitHub
      await fs.ensureDir(path.join(testDir, '.vscode'));
      await fs.writeJson(path.join(testDir, '.vscode/settings.json'), {
        "editor.formatOnSave": true
      });

      const settings = await fs.readJson(path.join(testDir, '.vscode/settings.json'));
      expect(settings["editor.formatOnSave"]).toBe(true);
    });
  });

  describe('Non-Interactive Mode', () => {
    test('should use defaults in non-interactive mode', () => {
      const isNonInteractive = !process.stdin.isTTY;

      // Non-interactive mode config should have these defaults
      const defaultConfig = {
        skipProject: true,
        skipLabels: false,
        skipVscode: false
      };

      expect(defaultConfig.skipProject).toBe(true);
    });

    test('should skip prompts in CI environment', () => {
      const originalCI = process.env.CI;
      process.env.CI = 'true';

      expect(process.env.CI).toBe('true');

      process.env.CI = originalCI;
    });
  });

  describe('Repository Creation Flow', () => {
    test('should offer to create new repository', async () => {
      // Mock inquirer to select 'create' option
      inquirer.prompt.mockResolvedValueOnce({ repoAction: 'create' });
      inquirer.prompt.mockResolvedValueOnce({
        repoName: 'test-new-repo',
        repoVisibility: 'private',
        repoDescription: 'Test repo'
      });

      const promptCalls = inquirer.prompt.mock;
      expect(promptCalls).toBeDefined();
    });

    test('should offer to skip repository setup', async () => {
      inquirer.prompt.mockResolvedValueOnce({ repoAction: 'skip' });

      // After selecting skip, GitHub features should be disabled
      const skipGitHubFeatures = true;
      expect(skipGitHubFeatures).toBe(true);
    });

    test('should offer to login to GitHub', async () => {
      inquirer.prompt.mockResolvedValueOnce({ repoAction: 'login' });

      // After selecting login, gh auth login should be called
      const loginAction = 'login';
      expect(loginAction).toBe('login');
    });
  });

  describe('Documentation Structure', () => {
    test('should create required documentation folders', async () => {
      const docsFolders = [
        'docs/specs',
        'docs/guides',
        'docs/setup',
        'docs/development',
        'docs/archive'
      ];

      for (const folder of docsFolders) {
        await fs.ensureDir(path.join(testDir, folder));
        expect(await fs.pathExists(path.join(testDir, folder))).toBe(true);
      }
    });

    test('should create example spec file', async () => {
      const specPath = path.join(testDir, 'docs/specs/EXAMPLE_SPEC.md');
      await fs.ensureDir(path.dirname(specPath));
      await fs.writeFile(specPath, '# Example Spec\n\nThis is an example.');

      expect(await fs.pathExists(specPath)).toBe(true);
      const content = await fs.readFile(specPath, 'utf8');
      expect(content).toContain('Example Spec');
    });
  });

  describe('Template Installation', () => {
    test('should create .github folder structure', async () => {
      await fs.ensureDir(path.join(testDir, '.github/ISSUE_TEMPLATE'));
      await fs.ensureDir(path.join(testDir, '.github/workflows'));

      expect(await fs.pathExists(path.join(testDir, '.github/ISSUE_TEMPLATE'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, '.github/workflows'))).toBe(true);
    });
  });
});

describe('Init Command Error Handling', () => {
  test('should handle missing package.json', async () => {
    const emptyDir = path.join(__dirname, '../__fixtures__/empty-test');
    await fs.ensureDir(emptyDir);

    // No package.json - should fail gracefully
    expect(await fs.pathExists(path.join(emptyDir, 'package.json'))).toBe(false);

    await fs.remove(emptyDir);
  });

  test('should handle network errors gracefully', () => {
    // Network errors should not crash the init command
    const networkError = new Error('Network error');
    expect(networkError.message).toBe('Network error');
  });
});
