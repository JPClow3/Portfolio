# Testing Quick Reference

This guide provides quick commands for running tests in the portfolio project.

## 🚀 Quick Start

### Run All Tests
```bash
npm test
```
This runs both unit tests and E2E tests.

---

## 🧪 Unit Tests (Vitest)

### Basic Commands
```bash
# Run once and exit
npm run test:unit

# Watch mode (re-run on file changes)
npm run test:unit -- --watch

# Show coverage
npm run test:unit -- --coverage

# Show in browser UI
npm run test:unit -- --ui
```

### Test Files
- `tests/unit/accessibility.test.ts` - Accessibility utilities
- `tests/unit/i18n.test.ts` - Internationalization utilities

### What's Tested
- ✅ `prefersReducedMotion()` - Media query detection and caching
- ✅ `onReducedMotionChange()` - Event listener management
- ✅ `useTranslations()` - Translation retrieval
- ✅ `getLangFromUrl()` - Language detection from URL

---

## 🔍 E2E Tests (Playwright)

### Basic Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (visual test runner)
npm run test:e2e:ui

# Debug mode (step through tests)
npm run test:e2e:debug

# Run specific test file
npm run test:e2e -- tests/e2e/homepage.spec.ts

# Run specific test
npm run test:e2e -- --grep "hero section"
```

### Browser-Specific Tests
```bash
# Chrome only
npm run test:e2e -- --project=chromium

# Firefox only
npm run test:e2e -- --project=firefox

# Safari only
npm run test:e2e -- --project=webkit

# Mobile Chrome
npm run test:e2e -- --project="Mobile Chrome"

# Mobile Safari
npm run test:e2e -- --project="Mobile Safari"
```

### Test Reports
After running tests, open the HTML report:
```bash
npx playwright show-report
```

### Test Files
- `tests/e2e/homepage.spec.ts` - Homepage functionality (9 tests)
- `tests/e2e/blog.spec.ts` - Blog pages (4 tests)
- `tests/e2e/forms.spec.ts` - Form interactions (6 tests)

### What's Tested
- ✅ Page loads and structure
- ✅ Navigation functionality
- ✅ Mobile menu toggle
- ✅ Theme switching
- ✅ Link functionality
- ✅ Form validation
- ✅ Accessibility compliance
- ✅ Meta tags and SEO

---

## 📊 Test Status

### Unit Tests: 37/37 ✅
```
✓ Accessibility utilities (12 tests)
✓ i18n utilities (25 tests)
```

### E2E Tests: 19 Tests Ready
```
✓ Homepage (9 tests)
✓ Blog (4 tests)
✓ Forms (6 tests)
```

---

## 🔧 Common Issues & Solutions

### E2E Tests Fail to Start
**Problem**: "Connection timeout"
**Solution**: Ensure the dev server is running:
```bash
npm run build
npm start
# Then in another terminal:
npm run test:e2e
```

### Tests Hang in Watch Mode
**Solution**: Press `q` to quit watch mode
```bash
npm run test:unit -- --watch
# Press: q to quit
```

### View Playwright Report
```bash
# After tests run
npx playwright show-report
```

### Clear Test Cache
```bash
rm -rf .vitest-cache
rm -rf playwright-report
rm -rf test-results
```

---

## 📈 Best Practices

### Before Committing
```bash
npm test  # Run all tests
npm run build  # Verify build works
```

### During Development
```bash
npm run test:unit -- --watch  # Watch unit tests
```

### Before Deployment
```bash
# Run all tests
npm test

# Build for production
npm run build

# Start server to verify
npm start
```

---

## 🎯 Adding New Tests

### Add Unit Test
1. Create file in `tests/unit/`
2. Name it `*.test.ts` or `*.spec.ts`
3. Import test utilities from vitest
4. Run: `npm run test:unit`

### Add E2E Test
1. Create file in `tests/e2e/`
2. Name it `*.spec.ts`
3. Import from `@playwright/test`
4. Run: `npm run test:e2e`

### Example Unit Test
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../src/lib/my-file';

describe('My Function', () => {
  it('should return expected value', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Example E2E Test
```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/');
  const element = page.locator('h1');
  await expect(element).toBeVisible();
});
```

---

## 🌐 Continuous Integration

For CI/CD pipelines, use:
```bash
npm run test:unit          # Non-watch mode
npm run test:e2e          # Runs against built site
npm run build             # Verify build succeeds
```

No need for extra flags - scripts are configured for CI already.

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Last Updated**: March 3, 2026
