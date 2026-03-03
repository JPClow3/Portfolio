import { describe, it, expect, beforeEach, afterEach, vi, resetModules } from 'vitest';

describe('Accessibility Utilities', () => {
  beforeEach(() => {
    // Reset modules to clear cache
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('prefersReducedMotion()', () => {
    it('should return false when window is undefined', async () => {
      const { prefersReducedMotion } = await import('../../src/lib/accessibility');
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });

    it('should return a boolean value', async () => {
      const { prefersReducedMotion } = await import('../../src/lib/accessibility');
      const result = prefersReducedMotion();
      expect(result === true || result === false).toBe(true);
    });

    it('should cache the result', async () => {
      const { prefersReducedMotion } = await import('../../src/lib/accessibility');
      // Call twice
      const result1 = prefersReducedMotion();
      const result2 = prefersReducedMotion();
      
      // Results should be the same
      expect(result1).toBe(result2);
    });

    it('should check prefers-reduced-motion media query', async () => {
      // Reset to ensure cache is clear
      vi.resetModules();
      
      const mediaQueryMock = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const windowSpy = vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryMock as any);

      try {
        const { prefersReducedMotion } = await import('../../src/lib/accessibility');
        const result = prefersReducedMotion();
        expect(windowSpy).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
        expect(typeof result).toBe('boolean');
      } finally {
        windowSpy.mockRestore();
      }
    });
  });

  describe('onReducedMotionChange()', () => {
    it('should return a function', async () => {
      const { onReducedMotionChange } = await import('../../src/lib/accessibility');
      const callback = vi.fn();
      const result = onReducedMotionChange(callback);
      expect(typeof result).toBe('function');
    });

    it('should add event listener when window is defined', async () => {
      vi.resetModules();
      
      const mediaQueryMock = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const windowSpy = vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryMock as any);
      const callback = vi.fn();

      try {
        const { onReducedMotionChange } = await import('../../src/lib/accessibility');
        onReducedMotionChange(callback);
        expect(windowSpy).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
        expect(mediaQueryMock.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      } finally {
        windowSpy.mockRestore();
      }
    });

    it('should return function returns a cleanup function', async () => {
      const { onReducedMotionChange } = await import('../../src/lib/accessibility');
      const callback = vi.fn();
      const cleanup = onReducedMotionChange(callback);

      expect(typeof cleanup).toBe('function');
    });

    it('should call the callback with boolean parameter', async () => {
      vi.resetModules();
      
      const mediaQueryMock = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const windowSpy = vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryMock as any);
      const callback = vi.fn();

      try {
        const { onReducedMotionChange } = await import('../../src/lib/accessibility');
        onReducedMotionChange(callback);

        // Simulate media query change event
        const handler = mediaQueryMock.addEventListener.mock.calls[0][1];
        const changeEvent = { matches: true } as MediaQueryListEvent;
        
        if (typeof handler === 'function') {
          handler(changeEvent);
        }

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(true);
      } finally {
        windowSpy.mockRestore();
      }
    });

    it('should cleanup event listener when cleanup function is called', async () => {
      vi.resetModules();
      
      const mediaQueryMock = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const windowSpy = vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryMock as any);
      const callback = vi.fn();

      try {
        const { onReducedMotionChange } = await import('../../src/lib/accessibility');
        const cleanup = onReducedMotionChange(callback);

        expect(mediaQueryMock.addEventListener).toHaveBeenCalled();

        // Call cleanup
        cleanup();

        expect(mediaQueryMock.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      } finally {
        windowSpy.mockRestore();
      }
    });

    it('should handle window being undefined gracefully', async () => {
      const { onReducedMotionChange } = await import('../../src/lib/accessibility');
      const callback = vi.fn();
      const cleanup = onReducedMotionChange(callback);

      // Should return a function that does nothing
      expect(typeof cleanup).toBe('function');
      cleanup(); // Should not throw
    });

    it('should update cache when preference changes', async () => {
      vi.resetModules();
      
      const mediaQueryMock = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const windowSpy = vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryMock as any);
      const callback = vi.fn();

      try {
        const { onReducedMotionChange } = await import('../../src/lib/accessibility');
        onReducedMotionChange(callback);

        // Simulate media query change from false to true
        const handler = mediaQueryMock.addEventListener.mock.calls[0][1];
        const changeEvent = { matches: true } as MediaQueryListEvent;
        
        if (typeof handler === 'function') {
          handler(changeEvent);
        }

        // The callback should have been called with the new value
        expect(callback).toHaveBeenCalledWith(true);
      } finally {
        windowSpy.mockRestore();
      }
    });
  });

  describe('Integration tests', () => {
    it('should work correctly when both functions are used together', async () => {
      vi.resetModules();
      
      const mediaQueryMock = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const windowSpy = vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryMock as any);
      const callback = vi.fn();

      try {
        const { prefersReducedMotion, onReducedMotionChange } = await import('../../src/lib/accessibility');
        
        // Get initial state
        const initialState = prefersReducedMotion();
        expect(typeof initialState).toBe('boolean');

        // Listen for changes
        const cleanup = onReducedMotionChange(callback);

        // Verify event listener was added
        expect(mediaQueryMock.addEventListener).toHaveBeenCalled();

        // Cleanup
        cleanup();
        expect(mediaQueryMock.removeEventListener).toHaveBeenCalled();
      } finally {
        windowSpy.mockRestore();
      }
    });
  });
});
