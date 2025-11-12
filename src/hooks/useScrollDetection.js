import {useEffect, useState} from 'react';

/**
 * Hook to detect if user has scrolled past a threshold
 * @param {number} threshold - Scroll threshold in pixels (default: 50)
 * @returns {boolean} Whether the page has been scrolled past the threshold
 */
export function useScrollDetection(threshold = 50) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > threshold);
        };

        // Check initial scroll position
        handleScroll();
        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isScrolled;
}