import React from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {FadeInOnScroll, Section} from './VisualComponents';
import {ExternalLinkIcon} from './Icons';
import StarBorder from './StarBorder';

const Projects = () => {
    const {language} = useLanguage();
    const {projects} = portfolioData[language];
    return (
        <Section id="projects" title={projects.title}>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
                {projects.items.map((project, index) => (
                    <FadeInOnScroll key={index} delay={index * 150}>
                        <StarBorder
                            as="a"
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group h-full hover:scale-[1.02] transition-transform duration-300"
                            color="rgba(59, 130, 246, 0.6)"
                            speed="8s"
                        >
                            <div className="p-6 md:p-8 flex flex-col h-full">
                                {/* Project Title - Fixed height */}
                                <div className="min-h-[4rem] mb-4">
                                    <h3 className="text-xl md:text-2xl font-bold text-white flex items-start gap-2 leading-tight">
                                        <span className="break-words flex-1">{project.name}</span>
                                        <ExternalLinkIcon/>
                                    </h3>
                                </div>

                                {/* Project Description - Fixed height with line clamp */}
                                <div className="flex-grow mb-6 min-h-[8rem]">
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed line-clamp-6">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Tech Stack - Fixed at bottom */}
                                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-700/50">
                                    {project.tech.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors whitespace-nowrap"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </StarBorder>
                    </FadeInOnScroll>
                ))}
            </div>
        </Section>
    );
};

export default Projects;
