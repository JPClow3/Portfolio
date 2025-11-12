/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - The function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId = null;
    
    return function throttled(...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        
        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        } else {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            // Schedule call for remaining time
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func.apply(this, args);
                timeoutId = null;
            }, delay - timeSinceLastCall);
        }
    };
}

