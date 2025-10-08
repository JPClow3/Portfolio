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
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <LaserFlow/>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-0"></div>


            <div className="relative z-10 p-4 max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
                    {hero.name}
                </h1>
                <div className="h-16 sm:h-20 flex items-center justify-center px-4">
                    <TypingAnimation
                        text={hero.title}
                        className="text-xl sm:text-2xl md:text-4xl text-slate-200 drop-shadow-md"
                        gradientColors={['#a7f3d0', '#bfdbfe', '#a7f3d0']}
                        animationSpeed={8}
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;