import React, {useEffect, useState} from 'react';

/**
 * Scroll progress indicator at the top of the page
 * Shows how far the user has scrolled
 */
const ScrollProgress = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, scrolled)));
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        // Initial calculation
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (scrollProgress === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 w-full h-1 bg-transparent z-[60] pointer-events-none"
            aria-hidden="true"
        >
            <div
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transition-all duration-150 ease-out shadow-lg shadow-purple-500/50"
                style={{width: `${scrollProgress}%`}}
            />
        </div>
    );
};

export default ScrollProgress;

