# UX Ingka Kit Test Suite

## Test Organization

Tests are organized into logical categories:

```
tests/
├── __mocks__/           # Jest mocks for external dependencies
├── __fixtures__/        # Test fixtures and temporary test data
├── commands/            # CLI command tests
│   ├── init.test.js         # ux-ingka init command
│   ├── component-installer.test.js  # Component installation
│   └── spark.test.js        # Spark app generator
├── components/          # Component-related tests
│   ├── cwds-integration.test.js    # CWDS integration
│   └── skapa-json-validation.test.js # Skapa JSON validation
├── core/                # Core functionality tests
│   ├── api-server.test.js    # API server tests
│   ├── config-manager.test.js # Configuration management
│   ├── spec-manager.test.js   # Specification manager
│   ├── task-manager.test.js   # Task manager
│   ├── workflow-modes.test.js # Workflow modes
│   ├── model-selection/       # AI model selection
│   │   ├── cost-tracker.test.js
│   │   ├── model-selector.test.js
│   │   └── strategies.test.js
│   └── ...
├── github/              # GitHub integration tests
│   ├── github-api.test.js    # GitHub API interactions
│   ├── github-auth.test.js   # GitHub authentication
│   └── github.e2e.test.js    # End-to-end GitHub tests
├── ui/                  # UI component tests
│   └── cwds-components/       # CWDS React components
│       ├── GlobalHeader.test.tsx
│       ├── NavigationMenu.test.tsx
│       └── ...
└── utils/               # Utility function tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/commands/init.test.js

# Run tests matching a pattern
npm test -- --testPathPattern="commands"

# Run tests in watch mode
npm test -- --watch
```

## Test Categories

### Commands (`tests/commands/`)
Tests for CLI commands like `init`, `spark`, and `components`.

- **init.test.js**: Tests repository detection, GitHub auth, non-interactive mode
- **component-installer.test.js**: Tests icon installation, component selection, registry config
- **spark.test.js**: Tests app generation with Ingka design system

### Core (`tests/core/`)
Tests for core library functionality.

- **config-manager.test.js**: Configuration file handling
- **spec-manager.test.js**: Specification workflow
- **model-selection/**: AI model selection strategies

### GitHub (`tests/github/`)
Tests for GitHub integration.

- **github-api.test.js**: API interactions with GitHub
- **github-auth.test.js**: Authentication flows
- **github.e2e.test.js**: End-to-end GitHub workflow tests

### UI (`tests/ui/`)
Tests for React components.

- **cwds-components/**: CWDS component tests (GlobalHeader, NavigationMenu, etc.)

## Writing New Tests

1. Place tests in the appropriate category folder
2. Use `.test.js` or `.test.ts` extension
3. Follow the naming convention: `[feature-name].test.js`
4. Include descriptive test names with `describe` and `it` blocks

Example:
```javascript
describe('Feature Name', () => {
  describe('Sub-feature', () => {
    test('should do something specific', () => {
      // Arrange
      const input = { ... };

      // Act
      const result = myFunction(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Fixtures

Test fixtures are stored in `__fixtures__/` and automatically cleaned up after tests.

```javascript
const fixturesDir = path.join(__dirname, '../__fixtures__/my-test');

beforeEach(async () => {
  await fs.ensureDir(fixturesDir);
});

afterEach(async () => {
  await fs.remove(fixturesDir);
});
```
