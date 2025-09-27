import React, {useMemo} from 'react';
import {useEffects, useLanguage, useTheme} from '../context/AppContext';
import {GradientText, StarBorder} from './VisualComponents';
import {MoonIcon, SunIcon} from './Icons';
import {useScrollDetection} from '../hooks/useScrollDetection';
import {useNavigation} from '../hooks/useNavigation';
import {useToast} from './Toaster';

const Header = ({onThemeOriginClick}) => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const {
        enableDotGrid,
        setEnableDotGrid,
        enableCardAnimations,
        setEnableCardAnimations,
        enableCustomCursor,
        setEnableCustomCursor,
        enableHighContrastGrid,
        setEnableHighContrastGrid,
        skillSwapFast,
        setSkillSwapFast,
        skillSwapRandomOrder,
        setSkillSwapRandomOrder,
        skillSwapControls,
        setSkillSwapControls,
        skillSwapPulse,
        setSkillSwapPulse,
        skillSwapRandomEasing,
        setSkillSwapRandomEasing,
        skillSwapBaseOffset,
        setSkillSwapBaseOffset,
        skillSwapVerticalOffset,
        setSkillSwapVerticalOffset,
        skillSwapMaxVisible,
        setSkillSwapMaxVisible,
        skillSwapPauseOnHover,
        setSkillSwapPauseOnHover,
        gridAnimate,
        setGridAnimate,
        gridTint,
        setGridTint,
        performanceMode,
        setPerformanceMode,
        resetEffects
    } = useEffects();
    const {push} = useToast();
    const isScrolled = useScrollDetection();
    const navLinks = useNavigation();
    const [open, setOpen] = React.useState(false);

    const handleThemeClick = (e) => {
        if (onThemeOriginClick) onThemeOriginClick(e); else toggleTheme();
    };

    const gradientColors = useMemo(() => theme === 'dark'
            ? ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb923c", "#a3e635", "#38bdf8"]
            : ["#2563eb", "#4f46e5", "#7c3aed", "#db2777", "#ea580c", "#65a30d", "#2563eb"],
        [theme]);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm' : 'bg-transparent'}`}>
            <StarBorder as="div" className="w-full allow-overflow" thickness={isScrolled ? 1 : 0} speed="8s"
                        data-scrolled={isScrolled}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <a href="#hero" className="text-xl font-bold text-slate-800 dark:text-white">
                            <GradientText colors={gradientColors} animationSpeed={5}>
                                <span className="hidden sm:inline">João Paulo G. Santos</span>
                                <span className="sm:hidden">JP</span>
                            </GradientText>
                        </a>
                        <nav className="hidden md:flex items-center space-x-6">
                            {navLinks.map(link => (
                                <a key={link.href} href={link.href}
                                   className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">
                                    {link.text}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="quick-settings-wrapper hidden sm:block">
                                <button
                                    onClick={() => setOpen(o => !o)}
                                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    aria-haspopup="dialog"
                                    aria-expanded={open}
                                    aria-label="Interface settings"
                                >⚙️
                                </button>
                                {open && (
                                    <div className="quick-settings-panel" role="dialog" aria-label="Interface settings">
                                        <h4 className="text-slate-700 dark:text-slate-300">Interface</h4>
                                        <label className="text-slate-600 dark:text-slate-300">Cursor
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={enableCustomCursor}
                                                   onChange={e => {
                                                       setEnableCustomCursor(e.target.checked);
                                                       push(e.target.checked ? 'Custom cursor enabled' : 'Custom cursor disabled', {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Dot Grid
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={enableDotGrid}
                                                   onChange={e => {
                                                       setEnableDotGrid(e.target.checked);
                                                       push(`Dot grid ${e.target.checked ? 'on' : 'off'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Card Anim.
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={enableCardAnimations}
                                                   onChange={e => {
                                                       setEnableCardAnimations(e.target.checked);
                                                       push(`Card animations ${e.target.checked ? 'on' : 'off'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">High Contrast Grid
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={enableHighContrastGrid}
                                                   onChange={e => {
                                                       setEnableHighContrastGrid(e.target.checked);
                                                       push(`Grid contrast ${e.target.checked ? 'high' : 'normal'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Performance
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={performanceMode}
                                                   onChange={e => {
                                                       setPerformanceMode(e.target.checked);
                                                       push(`Performance mode ${e.target.checked ? 'enabled' : 'disabled'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <h4 className="text-slate-700 dark:text-slate-300 mt-3">Skill Deck</h4>
                                        <label className="text-slate-600 dark:text-slate-300">Fast Cycle
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={skillSwapFast}
                                                   onChange={e => {
                                                       setSkillSwapFast(e.target.checked);
                                                       push(`Skill cycle speed: ${e.target.checked ? 'fast' : 'normal'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Random Order
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={skillSwapRandomOrder}
                                                   onChange={e => {
                                                       setSkillSwapRandomOrder(e.target.checked);
                                                       push(`Skill order ${e.target.checked ? 'random' : 'sequential'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Controls
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={skillSwapControls}
                                                   onChange={e => {
                                                       setSkillSwapControls(e.target.checked);
                                                       push(`Skill controls ${e.target.checked ? 'visible' : 'hidden'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Pause Hover
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={skillSwapPauseOnHover}
                                                   onChange={e => {
                                                       setSkillSwapPauseOnHover(e.target.checked);
                                                       push(`Hover pause ${e.target.checked ? 'on' : 'off'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Pulse
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={skillSwapPulse}
                                                   onChange={e => {
                                                       setSkillSwapPulse(e.target.checked);
                                                       push(`Front card pulse ${e.target.checked ? 'on' : 'off'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Random Easing
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={skillSwapRandomEasing}
                                                   onChange={e => {
                                                       setSkillSwapRandomEasing(e.target.checked);
                                                       push(`Easing ${e.target.checked ? 'random' : 'uniform'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <div
                                            className="mt-2 mb-1 text-[11px] uppercase tracking-wide font-semibold opacity-70 text-slate-500 dark:text-slate-400">Deck
                                            Layout
                                        </div>
                                        <label className="qs-range-row">Base Offset<span
                                            className="ml-auto tabular-nums text-xs">{skillSwapBaseOffset}</span>
                                            <input type="range" min="-140" max="40" step="5" value={skillSwapBaseOffset}
                                                   onChange={e => setSkillSwapBaseOffset(parseInt(e.target.value))}
                                                   className="qs-range"/>
                                        </label>
                                        <label className="qs-range-row">Vertical Gap<span
                                            className="ml-auto tabular-nums text-xs">{skillSwapVerticalOffset}</span>
                                            <input type="range" min="20" max="70" step="2"
                                                   value={skillSwapVerticalOffset}
                                                   onChange={e => setSkillSwapVerticalOffset(parseInt(e.target.value))}
                                                   className="qs-range"/>
                                        </label>
                                        <label className="qs-range-row">Max Visible<span
                                            className="ml-auto tabular-nums text-xs">{skillSwapMaxVisible}</span>
                                            <input type="range" min="2" max="6" step="1" value={skillSwapMaxVisible}
                                                   onChange={e => setSkillSwapMaxVisible(parseInt(e.target.value))}
                                                   className="qs-range"/>
                                        </label>
                                        <h4 className="text-slate-700 dark:text-slate-300 mt-3">Grid</h4>
                                        <label className="text-slate-600 dark:text-slate-300">Animate
                                            <input type="checkbox" className="quick-settings-toggle"
                                                   checked={gridAnimate}
                                                   onChange={e => {
                                                       setGridAnimate(e.target.checked);
                                                       push(`Grid animation ${e.target.checked ? 'on' : 'off'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <label className="text-slate-600 dark:text-slate-300">Tint
                                            <input type="checkbox" className="quick-settings-toggle" checked={gridTint}
                                                   onChange={e => {
                                                       setGridTint(e.target.checked);
                                                       push(`Grid tint ${e.target.checked ? 'on' : 'off'}`, {type: 'info'});
                                                   }}/>
                                        </label>
                                        <div className="mt-3">
                                            <button type="button" onClick={() => {
                                                resetEffects();
                                                push('Effects reset', {type: 'info'});
                                            }}
                                                    className="w-full text-xs font-semibold py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors">Reset
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleThemeClick}
                                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
                                aria-label={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
                            >
                                {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
                            </button>
                            <div className="flex items-center space-x-2 text-sm font-medium">
                                <button onClick={() => setLanguage('en')}
                                        className={`px-2 py-1 rounded-md transition-colors ${language === 'en' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                    EN
                                </button>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <button onClick={() => setLanguage('pt')}
                                        className={`px-2 py-1 rounded-md transition-colors ${language === 'pt' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                    PT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </StarBorder>
        </header>
    );
};

export default Header;
