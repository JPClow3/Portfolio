import React, {useEffect, useState} from 'react';

/**
 * Back to top button that appears when user scrolls down
 */
const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling 400px
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        handleScroll(); // Check initial state
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 text-white rounded-full shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg group"
            aria-label="Scroll to top"
        >
            <svg
                className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    );
};

export default BackToTop;

