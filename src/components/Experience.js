import React, {useEffect, useRef} from 'react';
import {useLanguage, useLibs} from '../context/AppContext';
import {portfolioData} from '../data';
import {Section, SpotlightCard} from './VisualComponents';

const Experience = () => {
    const {language} = useLanguage();
    const {experience} = portfolioData[language];
    const {gsap} = useLibs();
    const timelineRef = useRef(null);

    useEffect(() => {
        if (!gsap || !timelineRef.current) return;

        const timeline = timelineRef.current;
        const line = timeline.querySelector('.timeline-line');
        const items = timeline.querySelectorAll('.timeline-item');

        gsap.set(line, {scaleY: 0, transformOrigin: 'top center'});
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: timeline,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
            },
        });
        tl.to(line, {scaleY: 1});

        items.forEach((item) => {
            gsap.from(item, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });
    }, [gsap]);

    return (
        <Section id="experience" title={experience.title}>
            <div ref={timelineRef} className="relative max-w-4xl mx-auto py-8">
                {/* Timeline line - simplified for mobile */}
                <div
                    className="timeline-line absolute top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 dark:from-blue-400 dark:via-blue-500 dark:to-blue-400 left-4 md:left-1/2 md:-translate-x-1/2 opacity-30"></div>

                <div className="space-y-8 md:space-y-12">
                    {experience.jobs.map((job, index) => (
                        <div key={index} className="timeline-item relative">
                            {/* Timeline dot */}
                            <div
                                className="absolute left-[9px] md:left-1/2 top-2 w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full border-4 border-white dark:border-slate-900 z-10 md:-translate-x-1/2 shadow-lg">
                                <div
                                    className="absolute inset-0 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping opacity-75"></div>
                            </div>

                            {/* Content card - simplified mobile layout */}
                            <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 md:gap-8 md:items-start">
                                {/* Period on the left for desktop, top for mobile */}
                                <div
                                    className={`mb-2 md:mb-0 ${index % 2 === 0 ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left'}`}>
                                    <span
                                        className="inline-block px-3 py-1 text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800">
                                        {job.period}
                                    </span>
                                </div>

                                {/* Job details */}
                                <div className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}>
                                    <SpotlightCard className="w-full">
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-2">{job.role}</h3>
                                        <p className="text-base md:text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">{job.company}</p>
                                        <ul className="space-y-2 text-sm md:text-base text-slate-600 dark:text-slate-300">
                                            {job.tasks.map((task, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span
                                                        className="text-blue-500 dark:text-blue-400 mr-2 mt-1 flex-shrink-0">▹</span>
                                                    <span>{task}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </SpotlightCard>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Experience;
