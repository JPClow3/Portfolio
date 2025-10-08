import React from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {FadeInOnScroll, Section} from './VisualComponents';

const About = () => {
    const {language} = useLanguage();
    const {summary, education} = portfolioData[language];
    return (
        <Section id="about" title={summary.title}>
            <div className="max-w-4xl mx-auto text-center">
                <FadeInOnScroll>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-12">{summary.text}</p>
                </FadeInOnScroll>
                <FadeInOnScroll delay={200}>
                    <div
                        className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-blue-900/30 p-8 rounded-xl border-2 border-blue-200 dark:border-indigo-700 shadow-lg shadow-blue-500/10 dark:shadow-purple-500/10 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-purple-500/20 transition-all duration-300">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">{education.title}</h3>
                        <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{education.degree}</p>
                        <p className="text-md text-slate-700 dark:text-slate-300">{education.institution}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{education.status}</p>
                    </div>
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default About;
