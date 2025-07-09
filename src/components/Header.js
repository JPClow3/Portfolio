import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage, useTheme } from '../context/AppContext';
import { portfolioData } from '../data';
import { GradientText, StarBorder } from './VisualComponents';
import { MoonIcon, SunIcon } from './Icons';

const MenuIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const CloseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const { nav } = portfolioData[language];
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    const navLinks = Object.keys(nav).map(key => ({ href: `#${key}`, text: nav[key] }));
    const gradientColors = useMemo(() => theme === 'dark'
            ? ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb923c", "#a3e635", "#38bdf8"]
            : ["#2563eb", "#4f46e5", "#7c3aed", "#db2777", "#ea580c", "#65a30d", "#2563eb"],
        [theme]);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm' : 'bg-transparent'}`}>
            <StarBorder as="div" className="w-full" thickness={isScrolled ? 1 : 0} speed="8s" data-scrolled={isScrolled}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <a href="#hero" className="text-xl font-bold text-slate-800 dark:text-white" onClick={() => setIsMenuOpen(false)}>
                            <GradientText colors={gradientColors} animationSpeed={5}>
                                <span className="hidden sm:inline">João Paulo G. Santos</span>
                                <span className="sm:hidden">JP</span>
                            </GradientText>
                        </a>
                        <nav className="hidden md:flex items-center space-x-6">
                            {navLinks.map(link => (
                                <a key={link.href}
                                   href={link.href}
                                    // 💡 CLASSE ADICIONADA AQUI
                                   className="animated-nav-link text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">
                                    {link.text}
                                </a>
                            ))}
                        </nav>
                        <div className="hidden md:flex items-center space-x-4">
                            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300" aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}>
                                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                            </button>
                            <div className="flex items-center space-x-2 text-sm font-medium">
                                <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded-md transition-colors ${language === 'en' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} aria-label="Switch to English">EN</button>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <button onClick={() => setLanguage('pt')} className={`px-2 py-1 rounded-md transition-colors ${language === 'pt' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} aria-label="Mudar para Português">PT</button>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-600 dark:text-slate-300" aria-label="Abrir menu de navegação">
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </StarBorder>
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center">
                    <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-4 p-2 rounded-md text-slate-600 dark:text-slate-300" aria-label="Fechar menu de navegação">
                        <CloseIcon />
                    </button>
                    <nav className="flex flex-col items-center space-y-8">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-2xl text-slate-800 dark:text-slate-100 font-semibold">{link.text}</a>
                        ))}
                    </nav>
                    <div className="mt-12 flex items-center space-x-6">
                        <button onClick={toggleTheme} className="p-3 rounded-full text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700" aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}>
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <div className="flex items-center space-x-2 text-lg font-medium">
                            <button onClick={() => { setLanguage('en'); setIsMenuOpen(false); }} className={`px-3 py-1 rounded-md ${language === 'en' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} aria-label="Switch to English">EN</button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <button onClick={() => { setLanguage('pt'); setIsMenuOpen(false); }} className={`px-3 py-1 rounded-md ${language === 'pt' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} aria-label="Mudar para Português">PT</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default React.memo(Header);
