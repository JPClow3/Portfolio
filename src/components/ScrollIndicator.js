import React, {useEffect, useState} from 'react';

/**
 * Scroll indicator component that shows a subtle animation to encourage scrolling
 * Appears at the bottom of hero section
 */
const ScrollIndicator = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Hide scroll indicator after user scrolls past 200px
            setIsVisible(window.scrollY < 200);
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className="absolute bottom-8 left-1/2 z-10"
            style={{ transform: 'translateX(-50%)' }}
            aria-hidden="true"
        >
            <a
                href="#about"
                className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-2 animate-bounce-subtle"
                aria-label="Scroll to about section"
            >
                <span className="text-xs sm:text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                    Scroll
                </span>
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </a>
        </div>
    );
};

export default ScrollIndicator;

