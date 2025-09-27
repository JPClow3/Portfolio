import React from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {Section, SectionSeparator} from './VisualComponents';
import {SkillIcons} from './Icons';
import {motion} from 'framer-motion';

const Skills = () => {
    const { language } = useLanguage();
    const { skills } = portfolioData[language];

    // Animation variants for the container of the skill cards
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Animation variants for each individual skill card
    const cardVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <Section id="skills" title={skills.title}>
            <div className="flex flex-col items-center w-full px-4">
                <SectionSeparator/>

                {/* Animated Grid for Skill Cards */}
                <motion.div
                    className="w-full max-w-6xl grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.2}} // Trigger animation when 20% of the container is visible
                >
                    {skills.categories.map((category, index) => {
                        const Icon = SkillIcons[category.icon];
                        return (
                            <motion.div
                                key={index}
                                className="skill-card" // New class for styling
                                variants={cardVariants}
                            >
                                <div className="skill-card-content">
                                    <div className="text-blue-500 dark:text-blue-400 mb-4 h-12 w-12 mx-auto">
                                        {Icon && <Icon/>}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">{category.name}</h3>
                                    <ul className="space-y-3 text-left">
                                        {category.items.map((item, i) => (
                                            <li key={i}
                                                className="flex items-center text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                                                <svg className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" fill="none"
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
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Certifications Section with Animation */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, amount: 0.5}}
                    transition={{delay: 0.2, duration: 0.6}}
                    className="text-center max-w-4xl"
                >
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{skills.certifications_title}</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.certifications.map((cert, index) => (
                            <div key={index} className="certification-chip">{cert}</div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </Section>
    );
};

export default Skills;