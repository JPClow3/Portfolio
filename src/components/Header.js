import React, {useEffect, useState} from 'react';
import {useLanguage, useTheme} from '../context/AppContext';
import {portfolioData} from '../data';
import {useNavigation} from '../hooks/useNavigation';
import {useScrollDetection} from '../hooks/useScrollDetection';
import {useFocusTrap} from '../hooks/useFocusTrap';
import {ThemeToggleButton} from './Icons';

const Header = ({onThemeOriginClick}) => {
    const {language, setLanguage} = useLanguage();
    const {theme, themeTransition} = useTheme();
    const {nav: navData} = portfolioData[language];
    const activeId = useNavigation(Object.keys(navData));
    const isScrolled = useScrollDetection(80);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useFocusTrap(isMenuOpen);
    const isTransitioning = themeTransition !== null;

    const navLinks = Object.entries(navData).map(([key, name]) => ({id: key, name}));

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isMenuOpen]);

    // Handle resize - close mobile menu if screen becomes desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <>
            {/* Skip to main content link for accessibility */}
            <a
                href="#about"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
            >
                Skip to main content
            </a>

            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-gradient-to-r from-indigo-50/95 via-blue-50/95 to-purple-50/95 dark:from-dark-surface/95 dark:via-dark-bg/95 dark:to-indigo-950/95 backdrop-blur-md shadow-lg shadow-blue-500/10 dark:shadow-purple-500/10' : 'bg-transparent'}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <a
                                href="#hero"
                                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 dark:hover:from-purple-400 dark:hover:to-cyan-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-2 py-1"
                            >
                                JP
                            </a>
                        </div>
                        {/* Desktop Menu */}
                        <nav className="hidden md:block" aria-label="Main navigation">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navLinks.map(item => (
                                    <a
                                        key={item.name}
                                        href={`#${item.id}`}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent ${activeId === item.id ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50'}`}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </nav>
                        <div className="flex items-center gap-2">
                            <ThemeToggleButton onClick={onThemeOriginClick} theme={theme} isTransitioning={isTransitioning}/>
                            {/* Language selector - visible on mobile in menu, visible on desktop */}
                            <div className="relative ml-2">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 text-slate-800 dark:text-white rounded-md py-1 px-2 border-2 border-indigo-200 dark:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hidden sm:block"
                                    aria-label="Select language"
                                >
                                    <option value="en">EN</option>
                                    <option value="pt">PT</option>
                                </select>
                            </div>
                            {/* Mobile Menu Button */}
                            <div className="ml-2 md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                                    aria-expanded={isMenuOpen}
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        {isMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M4 6h16M4 12h16M4 18h16"/>
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Panel - Improved UX */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm md:hidden animate-fade-in"
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />
                    {/* Menu Panel */}
                    <nav
                        ref={menuRef}
                        id="mobile-menu"
                        className="fixed top-16 left-0 right-0 bottom-0 z-50 bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 dark:from-dark-surface dark:via-dark-bg dark:to-indigo-950 md:hidden animate-slide-in-top overflow-y-auto"
                        aria-label="Mobile navigation"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map(item => (
                                <a
                                    key={item.name}
                                    href={`#${item.id}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${activeId === item.id ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50'}`}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div
                                className="pt-4 border-t-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-indigo-700 dark:to-purple-700">
                                <label htmlFor="mobile-language-select"
                                       className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Language
                                </label>
                                <select
                                    id="mobile-language-select"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 text-slate-800 dark:text-white rounded-lg py-3 px-4 text-base border-2 border-indigo-200 dark:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="en">English</option>
                                    <option value="pt">Português</option>
                                </select>
                            </div>
                        </div>
                    </nav>
                </>
            )}
        </>
    );
};

export default Header;

