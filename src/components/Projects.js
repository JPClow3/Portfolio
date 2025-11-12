import React, {useState} from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {FadeInOnScroll, Section} from './VisualComponents';
import {ExternalLinkIcon} from './Icons';

const Projects = () => {
    const {language} = useLanguage();
    const {projects} = portfolioData[language];
    const [loadingLinks, setLoadingLinks] = useState({});

    const handleLinkClick = (projectLink, projectIndex) => {
        setLoadingLinks(prev => ({...prev, [projectIndex]: true}));
        // The link will navigate naturally, but we show loading state
        // Reset loading state after a delay in case navigation doesn't happen
        setTimeout(() => {
            setLoadingLinks(prev => ({...prev, [projectIndex]: false}));
        }, 3000);
    };

    return (
        <Section id="projects" title={projects.title}>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto auto-rows-fr">
                {projects.items.map((project, index) => {
                    const isLoading = loadingLinks[index];
                    return (
                        <FadeInOnScroll key={index} delay={index * 100}>
                            <div
                                className="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/10 dark:from-white/5 dark:to-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full group hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                                {/* Gradient overlay on hover */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300 pointer-events-none"/>

                                <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
                                    {/* Project Title */}
                                    <div className="mb-4">
                                        <h3 className="text-xl md:text-2xl font-bold text-white flex items-start gap-2 leading-tight">
                                            <span className="break-words flex-1">{project.name}</span>
                                        </h3>
                                    </div>

                                    {/* Project Description - Flexible height */}
                                    <div className="flex-grow mb-6">
                                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Tech Stack - Fixed at bottom */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                                        {project.tech.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="bg-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors whitespace-nowrap"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* External link with loading indicator */}
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => handleLinkClick(project.link, index)}
                                        className="absolute top-6 right-6 md:top-8 md:right-8 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group/link z-20 disabled:opacity-50"
                                        aria-label={`${project.name} - Opens in new tab`}
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <ExternalLinkIcon className="w-5 h-5"/>
                                        )}
                                        <span
                                            className="text-xs opacity-0 group-hover/link:opacity-100 transition-opacity whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded">
                                            {isLoading ? 'Loading...' : 'New tab'}
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </FadeInOnScroll>
                    );
                })}
            </div>
        </Section>
    );
};

export default Projects;
