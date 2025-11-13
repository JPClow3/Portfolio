import React, {useState, useMemo} from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {FadeInOnScroll, Section} from './VisualComponents';
import MagicBento from './MagicBento';
import {
    SiJavascript, SiTypescript, SiPostgresql, SiMicrosoft, SiPowerautomate,
    SiPowerapps, SiMicrosoftpowerbi, SiRobotframework, SiPostman
} from 'react-icons/si';
import {FaReact, FaPython, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaGitAlt, FaGithub, FaBug, FaCode, FaDatabase, FaToolbox, FaLanguage} from 'react-icons/fa';

// Icon mapping for technologies
const getIconForTech = (tech) => {
    const techLower = tech.toLowerCase();
    if (techLower.includes('react')) return <FaReact className="w-6 h-6 text-blue-500" />;
    if (techLower.includes('python')) return <FaPython className="w-6 h-6 text-yellow-500" />;
    if (techLower.includes('node')) return <FaNodeJs className="w-6 h-6 text-green-600" />;
    if (techLower.includes('html')) return <FaHtml5 className="w-6 h-6 text-orange-500" />;
    if (techLower.includes('css')) return <FaCss3Alt className="w-6 h-6 text-blue-500" />;
    if (techLower.includes('javascript') && !techLower.includes('typescript')) return <FaJs className="w-6 h-6 text-yellow-400" />;
    if (techLower.includes('typescript')) return <SiTypescript className="w-6 h-6 text-blue-600" />;
    if (techLower.includes('git')) return <FaGitAlt className="w-6 h-6 text-red-500" />;
    if (techLower.includes('github')) return <FaGithub className="w-6 h-6 text-gray-800 dark:text-white" />;
    if (techLower.includes('sql') || techLower.includes('database')) return <FaDatabase className="w-6 h-6 text-blue-600" />;
    if (techLower.includes('power automate')) return <SiPowerautomate className="w-6 h-6 text-blue-600" />;
    if (techLower.includes('power apps')) return <SiPowerapps className="w-6 h-6 text-purple-600" />;
    if (techLower.includes('power bi')) return <SiMicrosoftpowerbi className="w-6 h-6 text-yellow-500" />;
    if (techLower.includes('robot')) return <SiRobotframework className="w-6 h-6 text-red-600" />;
    if (techLower.includes('postman')) return <SiPostman className="w-6 h-6 text-orange-500" />;
    if (techLower.includes('microsoft')) return <SiMicrosoft className="w-6 h-6 text-blue-600" />;
    return <FaCode className="w-6 h-6 text-gray-500" />;
};

// Category icon mapping
const getCategoryIcon = (iconName) => {
    switch(iconName.toLowerCase()) {
        case 'qa': return <FaBug className="w-5 h-5" />;
        case 'frontend': return <FaCode className="w-5 h-5" />;
        case 'tools': return <FaToolbox className="w-5 h-5" />;
        case 'languages': return <FaLanguage className="w-5 h-5" />;
        default: return <FaCode className="w-5 h-5" />;
    }
};

// Proficiency progress calculation
const getProficiencyProgress = (proficiency) => {
    const mapping = {
        'Beginner': 33,
        'Iniciante': 33,
        'Intermediate': 66,
        'Intermediário': 66,
        'Advanced': 90,
        'Avançado': 90,
        'Native/Advanced': 100,
        'Nativo/Avançado': 100,
        'Expert': 100
    };
    return mapping[proficiency] || 50;
};

const Skills = () => {
    const { language } = useLanguage();
    const { skills } = portfolioData[language];
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Transforming the data to match the format expected by MagicBento
    const cardData = useMemo(() => skills.categories.map(category => ({
        title: category.name,
        description: category.items.join(', '),
        label: category.icon.toUpperCase(),
        color: '#060010',
        proficiency: category.proficiency,
        items: category.items,
        icon: category.icon
    })), [skills.categories]);

    // Filter cards if category is selected
    const filteredCards = selectedCategory 
        ? cardData.filter(card => card.title === selectedCategory)
        : cardData;

    return (
        <Section id="skills" title={skills.title}>
            <div className="flex flex-col items-center w-full px-4 space-y-12">
                {/* Tagline */}
                {skills.tagline && (
                    <FadeInOnScroll delay={100}>
                        <p className="text-center text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                            {skills.tagline}
                        </p>
                    </FadeInOnScroll>
                )}

                {/* Category Filter */}
                <FadeInOnScroll delay={150}>
                    <div className="flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                !selectedCategory
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                            }`}
                        >
                            {language === 'en' ? 'All Skills' : 'Todas as Habilidades'}
                        </button>
                        {skills.categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                    selectedCategory === category.name
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                {getCategoryIcon(category.icon)}
                                {category.name}
                            </button>
                        ))}
                    </div>
                </FadeInOnScroll>

                {/* Skills Grid with enhanced data */}
                <div className="w-full">
                    <MagicBento 
                        cardData={filteredCards}
                        onCardHover={setHoveredCard}
                    />
                    
                    {/* Proficiency indicators for each card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-6xl mx-auto">
                        {filteredCards.map((card, index) => {
                            const progress = getProficiencyProgress(card.proficiency);
                            return (
                                <FadeInOnScroll key={index} delay={index * 50}>
                                    <div
                                        className={`p-4 rounded-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-blue-900/30 border-2 transition-all duration-300 ${
                                            hoveredCard === index
                                                ? 'border-purple-400 dark:border-purple-500 shadow-xl scale-105'
                                                : 'border-blue-200 dark:border-indigo-700'
                                        }`}
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-slate-800 dark:text-white">{card.title}</h4>
                                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                                {card.proficiency}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                                style={{width: `${progress}%`}}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {card.items.slice(0, 3).map((item, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-white/50 dark:bg-white/10 px-2 py-1 rounded-full text-slate-700 dark:text-slate-300"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                            {card.items.length > 3 && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    +{card.items.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </FadeInOnScroll>
                            );
                        })}
                    </div>
                </div>

                {/* Original Skills Grid (kept for compatibility) */}
                <MagicBento cardData={cardData}/>

                {/* Certifications Section */}
                {skills.certifications && skills.certifications.length > 0 && (
                    <FadeInOnScroll delay={300}>
                        <div className="w-full max-w-4xl mt-16">
                            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                                {skills.certifications_title || 'Certifications'}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                                {skills.certifications.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-blue-900/30 p-6 rounded-xl border-2 border-blue-200 dark:border-indigo-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 hover:scale-105"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-cyan-500 dark:to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-cyan-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                                    {cert}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeInOnScroll>
                )}
            </div>
        </Section>
    );
};

export default Skills;