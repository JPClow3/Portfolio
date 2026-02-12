/**
 * Utility functions for random number generation
 * 
 * NOTE: These functions use Math.random() which is NOT cryptographically secure.
 * They are intended ONLY for visual effects, animations, and UI purposes.
 * DO NOT use these functions for security-sensitive operations like:
 * - Session tokens
 * - API keys
 * - Cryptographic operations
 * - Authentication tokens
 * - Any security-related randomness
 * 
 * For security-sensitive operations, use crypto.getRandomValues() instead.
 */

/**
 * Generate a random number between 0 and 1 (non-inclusive of 1)
 * @returns {number} Random number between 0 and 1
 */
export function random() {
    return Math.random();
}

/**
 * Generate a random number between min (inclusive) and max (exclusive)
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random number between min and max
 */
export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min (inclusive) and max (inclusive)
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number} Random integer between min and max
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random boolean
 * @returns {boolean} Random boolean value
 */
export function randomBool() {
    return Math.random() >= 0.5;
}

