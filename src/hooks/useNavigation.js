import {useEffect, useState} from 'react';

/**
 * Hook to track the currently active navigation section based on scroll position
 * @param {string[]} sectionIds - Array of section IDs to track
 * @returns {string} The currently active section ID
 */
export function useNavigation(sectionIds = []) {
    const [activeId, setActiveId] = useState(sectionIds[0] || 'hero');

    useEffect(() => {
        if (sectionIds.length === 0) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100; // Offset for header height

            // Find the section currently in view
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const section = document.getElementById(sectionIds[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    if (scrollPosition >= sectionTop) {
                        setActiveId(sectionIds[i]);
                        return;
                    }
                }
            }

            // If scrolled to top, set first section as active
            if (window.scrollY < 50) {
                setActiveId(sectionIds[0]);
            }
        };

        // Check on mount and scroll
        handleScroll();
        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sectionIds]);

    return activeId;
}