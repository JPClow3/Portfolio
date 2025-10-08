import React from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {FadeInOnScroll, Section} from './VisualComponents';
import MagicBento from './MagicBento';

const Skills = () => {
    const { language } = useLanguage();
    const { skills } = portfolioData[language];

    // Transforming the data to match the format expected by MagicBento
    const cardData = skills.categories.map(category => ({
        title: category.name,
        description: category.items.join(', '),
        label: category.icon.toUpperCase(),
        color: '#060010'
    }));

    return (
        <Section id="skills" title={skills.title}>
            <div className="flex flex-col items-center w-full px-4 space-y-12">
                {/* Skills Grid */}
                <MagicBento cardData={cardData}/>

                {/* Certifications Section */}
                {skills.certifications && skills.certifications.length > 0 && (
                    <FadeInOnScroll delay={300}>
                        <div className="w-full max-w-4xl mt-16">
                            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-800 dark:text-white">
                                {skills.certifications_title || 'Certifications'}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                {skills.certifications.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-105"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {cert}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeInOnScroll>
                )}
            </div>
        </Section>
    );
};

export default Skills;