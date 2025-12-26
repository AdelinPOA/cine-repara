# Testing Guide - Cine Repara

This document provides comprehensive guidance for writing and running tests in the Cine Repara project.

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Test Framework](#test-framework)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

Cine Repara uses a modern testing stack focused on:
- **Speed**: Vitest provides fast test execution with native ESM support
- **User-Centric**: React Testing Library encourages testing from the user's perspective
- **Type Safety**: Full TypeScript support throughout the test suite
- **Developer Experience**: Watch mode, UI dashboard, and detailed error messages

### Current Test Coverage
- **Test Suites**: 3
- **Total Tests**: 69
- **Pass Rate**: 100%
- **Components Tested**: Button, Auth Validations, Romanian Formatting Utils

## Quick Start

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm test -- --run

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Framework

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vitest | ^4.0.16 | Test runner and framework |
| @vitejs/plugin-react | ^5.1.2 | React support for Vitest |
| @testing-library/react | ^16.3.1 | React component testing utilities |
| @testing-library/jest-dom | ^6.9.1 | Custom DOM matchers |
| @testing-library/user-event | ^14.6.1 | User interaction simulation |
| jsdom | ^27.4.0 | DOM environment for tests |
| @vitest/ui | ^4.0.16 | Interactive test UI |

### Configuration

**`vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**`vitest.setup.ts`**:
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Writing Tests

### File Organization

Place test files next to the source files they test:

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx        ← Test file
├── lib/
│   ├── validations/
│   │   ├── auth.ts
│   │   └── auth.test.ts           ← Test file
│   └── utils/
│       ├── format.ts
│       └── format.test.ts         ← Test file
```

### Test Structure

Use `describe` blocks to group related tests:

```typescript
import { describe, it, expect } from 'vitest';

describe('ComponentName or FunctionName', () => {
  describe('specific feature or behavior', () => {
    it('does something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

### Component Testing

**Basic Component Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

**Testing User Interactions**:
```typescript
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

it('calls onClick handler when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  fireEvent.click(screen.getByText('Click'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Testing Component States**:
```typescript
it('shows loading state correctly', () => {
  render(<Button isLoading>Save</Button>);

  expect(screen.getByText('Se încarcă...')).toBeInTheDocument();
  expect(screen.queryByText('Save')).not.toBeInTheDocument();
});
```

### Function/Utility Testing

**Simple Function Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format';

describe('formatCurrency', () => {
  it('formats currency with decimals', () => {
    const result = formatCurrency(150);

    expect(result).toContain('150');
    expect(result).toContain('RON');
  });

  it('formats currency in compact mode', () => {
    const result = formatCurrency(150.75, { compact: true });

    expect(result).toBe('151 RON');
  });
});
```

### Validation Schema Testing

**Zod Schema Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { loginSchema } from './auth';

describe('loginSchema', () => {
  it('validates correct data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const result = loginSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'Password123',
    };

    const result = loginSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });
});
```

## Running Tests

### Watch Mode (Development)

```bash
npm test
```

- Watches for file changes
- Re-runs affected tests automatically
- Interactive mode with filtering options

### Single Run (CI/Production)

```bash
npm test -- --run
```

- Runs all tests once
- Exits with code 0 (success) or 1 (failure)
- Ideal for CI/CD pipelines

### UI Dashboard

```bash
npm run test:ui
```

- Opens interactive web UI
- Visual test results and coverage
- Detailed error messages and stack traces
- Accessible at http://localhost:51204 (or similar)

### Coverage Report

```bash
npm run test:coverage
```

- Generates HTML coverage report in `coverage/` directory
- Shows line, branch, function, and statement coverage
- Highlights untested code

**View coverage report**:
```bash
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

### Filtering Tests

```bash
# Run tests matching pattern
npm test -- Button

# Run specific test file
npm test -- Button.test.tsx

# Run tests in specific directory
npm test -- src/components
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad - Testing implementation details**:
```typescript
it('sets state to loading', () => {
  // Don't test internal state
  expect(component.state.isLoading).toBe(true);
});
```

✅ **Good - Testing user-visible behavior**:
```typescript
it('shows loading indicator when saving', () => {
  render(<Form />);
  fireEvent.click(screen.getByText('Save'));

  expect(screen.getByText('Se încarcă...')).toBeInTheDocument();
});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('formats date correctly', () => {
  // Arrange - Setup test data
  const date = new Date('2024-12-26');

  // Act - Execute the function
  const result = formatDate(date);

  // Assert - Verify the result
  expect(result).toContain('decembrie');
});
```

### 3. Use Descriptive Test Names

❌ **Bad**:
```typescript
it('works', () => { /* ... */ });
it('test 1', () => { /* ... */ });
```

✅ **Good**:
```typescript
it('formats Romanian phone number with spaces', () => { /* ... */ });
it('rejects passwords without uppercase letters', () => { /* ... */ });
```

### 4. Test Edge Cases

```typescript
describe('formatFileSize', () => {
  it('handles zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('handles exactly 1 KB', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('handles large files', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});
```

### 5. Mock External Dependencies

```typescript
import { vi } from 'vitest';

// Mock API calls
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' })),
}));

// Mock timers
vi.useFakeTimers();

// Mock random values
vi.spyOn(Math, 'random').mockReturnValue(0.5);
```

### 6. Clean Up After Tests

```typescript
import { afterEach } from 'vitest';

afterEach(() => {
  // Reset mocks
  vi.clearAllMocks();

  // Clean up DOM (automatic with vitest.setup.ts)
  // cleanup(); // Already configured
});
```

## Examples

### Complete Component Test Suite

```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByText('Se încarcă...')).toBeInTheDocument();
  });

  describe('variants', () => {
    it('applies primary variant by default', () => {
      render(<Button>Primary</Button>);
      expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');
    });

    it('applies danger variant', () => {
      render(<Button variant="danger">Delete</Button>);
      expect(screen.getByText('Delete')).toHaveClass('bg-red-600');
    });
  });

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>);
      expect(screen.getByText('Medium')).toHaveClass('h-11');
    });

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByText('Small')).toHaveClass('h-9');
    });
  });
});
```

### Complete Utility Test Suite

```typescript
// src/lib/utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPhoneNumber } from './format';

describe('Romanian Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('formats with 2 decimals by default', () => {
      expect(formatCurrency(150)).toContain('150');
      expect(formatCurrency(150)).toContain('RON');
    });

    it('formats in compact mode', () => {
      expect(formatCurrency(150.75, { compact: true })).toBe('151 RON');
    });

    it('respects custom decimal places', () => {
      const result = formatCurrency(150, { decimals: 0 });
      expect(result).toContain('150');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats Romanian mobile (07XX)', () => {
      expect(formatPhoneNumber('0712345678')).toBe('0712 345 678');
    });

    it('formats Romanian landline (02XX)', () => {
      expect(formatPhoneNumber('0212345678')).toBe('0212 345 678');
    });

    it('handles already formatted numbers', () => {
      expect(formatPhoneNumber('0712 345 678')).toBe('0712 345 678');
    });

    it('returns invalid numbers as-is', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });
});
```

## Troubleshooting

### Common Issues

**1. Import errors with `@/` alias**:
```bash
# Make sure vitest.config.ts has the alias configured
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

**2. DOM matchers not working**:
```bash
# Ensure vitest.setup.ts imports jest-dom
import '@testing-library/jest-dom';
```

**3. Tests hang or timeout**:
```bash
# Check for unresolved promises or missing async/await
# Increase timeout if needed
it('slow test', async () => {
  // ...
}, { timeout: 10000 }); // 10 seconds
```

**4. Coverage reports empty**:
```bash
# Install coverage provider
npm install -D @vitest/coverage-v8
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library - Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vitest UI](https://vitest.dev/guide/ui.html)

## Contributing

When adding new features:
1. Write tests for new components and functions
2. Maintain >70% coverage for critical code
3. Follow the existing test patterns
4. Run tests before committing: `npm test -- --run`
5. Update this guide if adding new test patterns

---

**Happy Testing!** 🧪
