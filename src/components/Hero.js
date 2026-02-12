import React, {lazy, Suspense} from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {TypingAnimation} from './VisualComponents';
import ScrollIndicator from './ScrollIndicator';
import {trackButtonClick, trackResumeDownload} from '../utils/analytics';

// Lazy load LaserFlow to reduce initial bundle size (Three.js is heavy)
const LaserFlow = lazy(() => import('./LaserFlow'));

const Hero = () => {
    const {language} = useLanguage();
    const {hero} = portfolioData[language];

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-[-1]" aria-hidden="true">
                <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-blue-900/50 to-indigo-900/40"/>}>
                    <LaserFlow
                        wispDensity={1.8}
                        fogIntensity={0.75}
                        flowSpeed={0.45}
                        wispSpeed={20}
                        wispIntensity={7.0}
                        flowStrength={0.5}
                        fogScale={0.22}
                        color="#a855f7"
                        decay={1.4}
                        verticalSizing={2.8}
                        horizontalSizing={0.75}
                        falloffStart={1.4}
                        fogFallSpeed={0.7}
                        mouseTiltStrength={0.02}
                    />
                </Suspense>
            </div>
            {/* Enhanced overlay with gradient for better text visibility */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/40 via-blue-900/50 to-indigo-900/40 dark:from-black/50 dark:via-blue-950/60 dark:to-purple-950/50 z-0"></div>


            <div className="relative z-10 p-4 max-w-4xl mx-auto">
                {/* Enhanced name with gradient text and stronger shadows for mobile readability */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 dark:from-cyan-400 dark:via-blue-300 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8),0_4px_8px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.4)] filter brightness-125">
                    {hero.name}
                </h1>
                <div className="h-16 sm:h-20 flex items-center justify-center px-4">
                    <TypingAnimation
                        text={hero.title}
                        className="text-xl sm:text-2xl md:text-4xl text-blue-100 dark:text-slate-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8),0_4px_8px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.4)]"
                        gradientColors={['#67e8f9', '#a78bfa', '#67e8f9']}
                        animationSpeed={8}
                    />
                </div>
                {/* Tagline */}
                {hero.tagline && (
                    <p className="text-lg sm:text-xl md:text-2xl text-blue-100/90 dark:text-slate-300/90 mt-4 max-w-2xl mx-auto px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        {hero.tagline}
                    </p>
                )}
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 px-4">
                    <a
                        href="#projects"
                        onClick={() => trackButtonClick('view_work', 'hero')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        aria-label={hero.cta?.viewWork || 'View My Work'}
                    >
                        {hero.cta?.viewWork || 'View My Work'}
                    </a>
                    <a
                        href="#contact"
                        onClick={() => trackButtonClick('get_in_touch', 'hero')}
                        className="px-6 py-3 bg-white/10 dark:bg-slate-800/50 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/50 text-white font-semibold rounded-lg border-2 border-white/30 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        aria-label={hero.cta?.getInTouch || 'Get in Touch'}
                    >
                        {hero.cta?.getInTouch || 'Get in Touch'}
                    </a>
                </div>
                {/* Resume Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6 px-4">
                    <a
                        href="/resumes/Curriculo-EN.pdf"
                        download
                        onClick={() => trackResumeDownload('EN')}
                        className="px-5 py-2.5 text-sm bg-white/10 dark:bg-slate-800/50 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/50 text-white font-medium rounded-lg border border-white/30 dark:border-slate-600 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        aria-label="Download CV in English"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {language === 'en' ? 'Download CV (EN)' : 'Baixar CV (EN)'}
                    </a>
                    <a
                        href="/resumes/Curriculo-PT.pdf"
                        download
                        onClick={() => trackResumeDownload('PT')}
                        className="px-5 py-2.5 text-sm bg-white/10 dark:bg-slate-800/50 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700/50 text-white font-medium rounded-lg border border-white/30 dark:border-slate-600 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                        aria-label="Baixar CV em Português"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {language === 'en' ? 'Download CV (PT)' : 'Baixar CV (PT)'}
                    </a>
                </div>
            </div>
            {/* Scroll indicator */}
            <ScrollIndicator />
        </section>
    );
};

export default Hero;