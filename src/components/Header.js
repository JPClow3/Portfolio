import React, {useEffect, useMemo, useState} from 'react';
import {useLanguage, useTheme} from '../context/AppContext';
import {portfolioData} from '../data';
import {GradientText, StarBorder} from './VisualComponents';
import {MoonIcon, SunIcon} from './Icons';

const Header = () => {
    const {theme, toggleTheme} = useTheme();
    const {language, setLanguage} = useLanguage();
    const {nav} = portfolioData[language];
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = Object.keys(nav).map(key => ({href: `#${key}`, text: nav[key]}));
    const gradientColors = useMemo(() => theme === 'dark'
            ? ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb923c", "#a3e635", "#38bdf8"]
            : ["#2563eb", "#4f46e5", "#7c3aed", "#db2777", "#ea580c", "#65a30d", "#2563eb"],
        [theme]);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm' : 'bg-transparent'}`}>
            <StarBorder as="div" className="w-full" thickness={isScrolled ? 1 : 0} speed="8s"
                        data-scrolled={isScrolled}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <a href="#hero" className="text-xl font-bold text-slate-800 dark:text-white">
                            <GradientText colors={gradientColors} animationSpeed={5}>
                                <span className="hidden sm:inline">João Paulo G. Santos</span>
                                <span className="sm:hidden">JP</span>
                            </GradientText>
                        </a>
                        <nav className="hidden md:flex items-center space-x-6">
                            {navLinks.map(link => (<a key={link.href} href={link.href}
                                                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">{link.text}</a>))}
                        </nav>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
                                aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
                            >
                                {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
                            </button>
                            <div className="flex items-center space-x-2 text-sm font-medium">
                                <button onClick={() => setLanguage('en')}
                                        className={`px-2 py-1 rounded-md transition-colors ${language === 'en' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>EN
                                </button>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <button onClick={() => setLanguage('pt')}
                                        className={`px-2 py-1 rounded-md transition-colors ${language === 'pt' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>PT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </StarBorder>
        </header>
    );
};

export default Header;
