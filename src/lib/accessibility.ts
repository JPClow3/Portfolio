/**
 * Accessibility utilities for consistent handling of user preferences
 */

/**
 * Check if the user prefers reduced motion
 * Caches the result since this preference doesn't change during a session
 */
let cachedPrefersReducedMotion: boolean | null = null;

export function prefersReducedMotion(): boolean {
  // Return cached value if available (preference doesn't change during session)
  if (cachedPrefersReducedMotion !== null) {
    return cachedPrefersReducedMotion;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  cachedPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return cachedPrefersReducedMotion;
}

/**
 * Listen for changes to prefers-reduced-motion preference
 * Useful if user changes system accessibility settings during session (rare but possible)
 */
export function onReducedMotionChange(callback: (prefersReduced: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleChange = (e: MediaQueryListEvent) => {
    cachedPrefersReducedMotion = e.matches; // Update cache
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handleChange);

  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
}
