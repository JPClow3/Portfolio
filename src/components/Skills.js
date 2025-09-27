import React from 'react';
import {useEffects, useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {AutoFadeSwap, Card, FadeInOnScroll, Section, SectionSeparator} from './VisualComponents';
import {SkillIcons} from './Icons';

const Skills = () => {
    const { language } = useLanguage();
    const { skills } = portfolioData[language];
    const {enableCardAnimations} = useEffects();

    const useAnimated = enableCardAnimations && skills.categories.length > 1;

    return (
        <Section id="skills" title={skills.title}>
            <div className="flex flex-col items-center w-full">
                {useAnimated ? (
                    <>
                        <SectionSeparator/>
                        <div
                            className="skill-swap-wrapper relative w-full max-w-xl flex justify-center items-start mb-20 pt-28 sm:pt-24"
                            style={{minHeight: 420}}>
                            <AutoFadeSwap width={360} height={300} delay={2300} randomize>
                                {skills.categories.map((category, index) => {
                                    const Icon = SkillIcons[category.icon];
                                    return (
                                        <Card key={index} customClass="skill-swap-card fade surface-panel">
                                            <div
                                                className="text-blue-500 dark:text-blue-400 mb-4 flex justify-center">{Icon &&
                                                <Icon/>}</div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">{category.name}</h3>
                                            <ul className="space-y-3 text-left">
                                                {category.items.map((item, i) => (
                                                    <li key={i}
                                                        className="flex items-center text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                                                        <svg className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0"
                                                             fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth="2"
                                                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    );
                                })}
                            </AutoFadeSwap>
                        </div>
                    </>
                ) : (
                    <div className="w-full max-w-5xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 px-4">
                        {skills.categories.map((category, index) => {
                            const Icon = SkillIcons[category.icon];
                            return (
                                <div key={index} className="card-swap-card-static skill-swap-card">
                                    <div className="text-blue-500 dark:text-blue-400 mb-3">{Icon && <Icon/>}</div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 text-center">{category.name}</h3>
                                    <ul className="space-y-2 text-left">
                                        {category.items.map((item, i) => (
                                            <li key={i}
                                                className="flex items-center text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                                                <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
                <FadeInOnScroll delay={400}>
                    <div className="text-center max-w-4xl px-4">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{skills.certifications_title}</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {skills.certifications.map((cert, index) => (
                                <div key={index} className="bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-700">{cert}</div>
                            ))}
                        </div>
                    </div>
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default Skills;
