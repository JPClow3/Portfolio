import React, { useMemo } from 'react';
import { useLanguage, useTheme } from '../context/AppContext';
import { portfolioData } from '../data';
import { FadeInOnScroll, TypingAnimation, GradientText } from './VisualComponents';

const Hero = () => {
    const { language } = useLanguage();
    const { hero } = portfolioData[language];
    const { theme } = useTheme();
    const gradientColors = useMemo(() => theme === 'dark'
            ? ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb923c", "#a3e635", "#38bdf8"]
            : ["#2563eb", "#4f46e5", "#7c3aed", "#db2777", "#ea580c", "#65a30d", "#2563eb"],
        [theme]);

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
            <div className="container mx-auto px-4 z-10">
                <FadeInOnScroll>
                    <h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-medium mb-4">{hero.greeting}</h2>
                </FadeInOnScroll>
                <TypingAnimation
                    text={hero.name}
                    className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tight"
                    gradientColors={gradientColors}
                    animationSpeed={6}
                />
                <FadeInOnScroll delay={400}>
                    <GradientText colors={gradientColors} animationSpeed={6} className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                        {hero.title}
                    </GradientText>
                </FadeInOnScroll>
                <FadeInOnScroll delay={600}>
                    <div className="mt-12 flex justify-center gap-4">
                        <a href="#contact" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                            {language === 'en' ? 'Contact Me' : 'Entre em Contato'}
                        </a>
                        <a href="https://github.com/JPClow3" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:scale-105">
                            GitHub
                        </a>
                    </div>
                </FadeInOnScroll>
            </div>
        </section>
    );
};

export default Hero;
