# CWDS Component Tests

Comprehensive Jest test suite for all 5 CWDS (Co-worker Design System) React components.

## Test Files

| Component           | Test File                      | Tests | Coverage                                    |
| ------------------- | ------------------------------ | ----- | ------------------------------------------- |
| GlobalHeader        | `GlobalHeader.test.tsx`        | 35    | Props, events, accessibility, notifications |
| NavigationMenu      | `NavigationMenu.test.tsx`      | 15    | Navigation, nesting, interactions           |
| AppSwitcher         | `AppSwitcher.test.tsx`         | 18    | Modal behavior, app selection, keyboard nav |
| Profile             | `Profile.test.tsx`             | 17    | User info, actions, dropdown behavior       |
| BottomBarNavigation | `BottomBarNavigation.test.tsx` | 19    | Mobile nav, badges, active states           |

**Total: 104+ test cases**

## Running Tests

### Run all CWDS tests:

```bash
npm test -- --selectProjects=jsdom
```

### Run specific component:

```bash
npm test -- tests/cwds-components/GlobalHeader.test.tsx
```

### Run with coverage:

```bash
npm test -- --selectProjects=jsdom --coverage
```

### Watch mode (development):

```bash
npm test -- --selectProjects=jsdom --watch
```

## Test Coverage Areas

### 1. **TypeScript Interface Validation**

- Props type checking
- Required vs. optional props
- Interface completeness

### 2. **Rendering**

- Component mounting
- Conditional rendering
- Empty states
- Dynamic content

### 3. **User Interactions**

- Click handlers
- Callback invocation
- Event propagation
- Disabled states

### 4. **Accessibility (A11y)**

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management

### 5. **State Management**

- Active states
- Expanded/collapsed states
- Badge display logic
- Notification counts

## Test Structure

Each test file follows AAA pattern:

- **Arrange:** Setup props and state
- **Act:** Render component and trigger interactions
- **Assert:** Verify expected behavior

Example:

```typescript
it("should call onSearchClick when search icon is clicked", () => {
  // Arrange
  const onSearchClick = jest.fn();
  render(
    <GlobalHeader
      {...defaultProps}
      showSearch={true}
      onSearchClick={onSearchClick}
    />
  );

  // Act
  const searchButton = screen.getByRole("button", { name: /search/i });
  fireEvent.click(searchButton);

  // Assert
  expect(onSearchClick).toHaveBeenCalledTimes(1);
});
```

## Dependencies

```json
{
  "@testing-library/react": "^14.x",
  "@testing-library/jest-dom": "^6.x",
  "@types/jest": "^29.x",
  "@types/react": "^18.x",
  "ts-jest": "^29.x",
  "jest-environment-jsdom": "^29.x"
}
```

## Configuration

### `jest.config.js`

- Dual-project setup (node + jsdom)
- TypeScript/React transformation via ts-jest
- CSS module mocking
- Coverage collection from templates

### `tsconfig.json`

- JSX support (`jsx: "react"`)
- ES Module interop enabled
- DOM types included

### Mock Files

- `tests/__mocks__/styleMock.js` - CSS imports
- `tests/cwds-components/setup.ts` - jest-dom matchers

## Current Status

✅ **Test Infrastructure:** Complete and working
✅ **Test Files:** 5 comprehensive test suites created
⚠️ **Test Results:** ~57 passing, ~22 failing (expected)

**Note:** Some tests fail because template components are skeletal implementations. Tests serve as **specification contracts** for full component implementation.

## Next Steps

1. Implement missing component features to match test specs
2. Add interaction handlers (onClick, onClose, etc.)
3. Implement conditional rendering logic
4. Add ARIA attributes for accessibility
5. Achieve 80%+ test coverage

## Related

- **Issue #12:** Add CWDS component unit tests
- **Templates:** `templates/cwds-components/`
- **Documentation:** `docs/development/CWDS_TEST_SUMMARY.md`
