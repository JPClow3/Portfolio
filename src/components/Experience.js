import React, { useEffect, useRef } from 'react';
import { useLanguage, useLibs } from '../context/AppContext';
import { portfolioData } from '../data';
import { Section, SpotlightCard } from './VisualComponents';

const Experience = () => {
    const { language } = useLanguage();
    const { experience } = portfolioData[language];
    const { gsap } = useLibs();
    const timelineRef = useRef(null);

    useEffect(() => {
        if (!gsap || !timelineRef.current) return;

        // 💡 Adicionado 'let' para poder reatribuir dentro do cleanup
        let ctx = gsap.context(() => {
            const timeline = timelineRef.current;
            const line = timeline.querySelector('.timeline-line');
            const items = timeline.querySelectorAll('.timeline-item');

            gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
            gsap.to(line, {
                scaleY: 1,
                scrollTrigger: {
                    trigger: timeline,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: true,
                },
            });

            items.forEach(item => {
                gsap.from(item, {
                    opacity: 0,
                    y: 50,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });

                // 💡 CÓDIGO NOVO: Anima o ponto correspondente
                const dot = item.querySelector('.timeline-dot');
                if (dot) {
                    gsap.to(dot, {
                        scale: 1.5,
                        backgroundColor: '#3b82f6',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top center',
                            end: 'bottom center',
                            scrub: true,
                        }
                    });
                }
            });
        }, timelineRef); // 💡 escopo do contexto GSAP para melhor limpeza

        return () => ctx.revert(); // 💡 Limpeza do GSAP

    }, [gsap]);

    return (
        <Section id="experience" title={experience.title}>
            <div ref={timelineRef} className="relative max-w-3xl mx-auto">
                <div
                    className="timeline-line absolute left-4 sm:left-1/2 top-0 h-full w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                {experience.jobs.map((job, index) => (
                    <div key={index} className="timeline-item relative mb-12">
                        {/* 💡 CLASSE 'timeline-dot' ADICIONADA AQUI */}
                        <div
                            className="timeline-dot absolute left-4 sm:left-1/2 -translate-x-1/2 mt-1.5 w-4 h-4 bg-slate-400 dark:bg-slate-600 rounded-full border-4 border-white dark:border-slate-900 transition-colors duration-300"></div>
                        <div className={`sm:flex items-center ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                            <div className="sm:w-1/2 p-4">
                                <div className={`text-left ${index % 2 === 0 ? 'sm:text-left' : 'sm:text-right'}`}>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.period}</p>
                                </div>
                            </div>
                            <div className="sm:w-1/2 p-1">
                                <SpotlightCard className="ml-10 sm:ml-0">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.role}</h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">{job.company}</p>
                                    <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
                                        {job.tasks.map((task, i) => <li key={i}>{task}</li>)}
                                    </ul>
                                </SpotlightCard>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default React.memo(Experience);
