import React, {useEffect, useState} from 'react';
import {useLanguage, useTheme} from '../context/AppContext';
import {portfolioData} from '../data';
import {useNavigation} from '../hooks/useNavigation';
import {useScrollDetection} from '../hooks/useScrollDetection';
import {ThemeToggleButton} from './Icons';

const Header = ({onThemeOriginClick}) => {
    const {language, setLanguage} = useLanguage();
    const {theme} = useTheme();
    const {nav: navData} = portfolioData[language];
    const activeId = useNavigation(Object.keys(navData));
    const isScrolled = useScrollDetection(80);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <a
                                href="#hero"
                                className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-2 py-1"
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
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent ${activeId === item.id ? 'text-white bg-blue-500' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </nav>
                        <div className="flex items-center gap-2">
                            <ThemeToggleButton onClick={onThemeOriginClick} theme={theme}/>
                            <div className="relative ml-2 hidden sm:block">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-md py-1 px-2 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
                        onClick={() => setIsMenuOpen(false)}
                        aria-hidden="true"
                    />
                    {/* Menu Panel */}
                    <nav
                        className="fixed top-16 left-0 right-0 bottom-0 z-50 bg-white dark:bg-slate-900 md:hidden animate-slide-in-top overflow-y-auto"
                        aria-label="Mobile navigation"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map(item => (
                                <a
                                    key={item.name}
                                    href={`#${item.id}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeId === item.id ? 'text-white bg-blue-500' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    {item.name}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <label htmlFor="mobile-language-select"
                                       className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Language
                                </label>
                                <select
                                    id="mobile-language-select"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg py-3 px-4 text-base border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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