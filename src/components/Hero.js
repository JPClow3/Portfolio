import React from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {TypingAnimation} from './VisualComponents';
import LaserFlow from './LaserFlow';

const Hero = () => {
    const {language} = useLanguage();
    const {hero} = portfolioData[language];

    return (
        <section id="hero" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-[-1]" aria-hidden="true">
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
            </div>
        </section>
    );
};

export default Hero;