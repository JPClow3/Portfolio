import React from 'react';
import { useLanguage } from '../context/AppContext';
import { portfolioData } from '../data';
import { FadeInOnScroll, Section } from './VisualComponents';

const About = () => {
    const { language } = useLanguage();
    const { summary, education } = portfolioData[language];
    return (
        <Section id="about" title={summary.title}>
            <div className="max-w-4xl mx-auto text-center">
                <FadeInOnScroll>
                    {/* 💡 CLASSE ADICIONADA AQUI */}
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-12">{summary.text}</p>
                </FadeInOnScroll>
                <FadeInOnScroll delay={200}>
                    <div
                        className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{education.title}</h3>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{education.degree}</p>
                        <p className="text-md text-slate-600 dark:text-slate-300">{education.institution}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{education.status}</p>
                    </div>
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default React.memo(About);
