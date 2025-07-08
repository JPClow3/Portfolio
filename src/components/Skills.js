import React from 'react';
import { useLanguage } from '../context/AppContext';
import { portfolioData } from '../data';
import { Section, FadeInOnScroll, CardSwap } from './VisualComponents';
import { SkillIcons } from './Icons';

const Skills = () => {
    const { language } = useLanguage();
    const { skills } = portfolioData[language];

    return (
        <Section id="skills" title={skills.title}>
            <div className="flex flex-col items-center">
                <div className="h-[400px] w-full max-w-xl flex justify-center items-center relative mb-16" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)' }}>
                    <CardSwap width={350} height={280}>
                        {skills.categories.map((category, index) => {
                            const Icon = SkillIcons[category.icon];
                            return (
                                <CardSwap.Card key={index} customClass="skill-swap-card">
                                    <div className="text-blue-500 dark:text-blue-400 mb-4">{Icon && <Icon />}</div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">{category.name}</h3>
                                    <ul className="space-y-3 text-left">
                                        {category.items.map((item, i) => (
                                            <li key={i} className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                                                <svg className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardSwap.Card>
                            );
                        })}
                    </CardSwap>
                </div>
                <FadeInOnScroll delay={400}>
                    <div className="text-center">
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
