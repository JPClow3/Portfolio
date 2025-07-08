import React from 'react';
import { useLanguage } from '../context/AppContext';
import { portfolioData } from '../data';
import { Section, FadeInOnScroll } from './VisualComponents';
import { ExternalLinkIcon } from './Icons';

const Projects = () => {
    const { language } = useLanguage();
    const { projects } = portfolioData[language];
    return (
        <Section id="projects" title={projects.title}>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {projects.items.map((project, index) => (
                    <FadeInOnScroll key={index} delay={index * 150}>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="block group h-full">
                            <div className="bg-white dark:bg-slate-800/80 p-8 rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700 flex flex-col h-full backdrop-blur-sm">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
                                    {project.name}
                                    <ExternalLinkIcon />
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 flex-grow mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tech.map((tech, i) => (
                                        <span key={i} className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    </FadeInOnScroll>
                ))}
            </div>
        </Section>
    );
};

export default Projects;
