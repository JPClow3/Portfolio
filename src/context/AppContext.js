import React, {createContext, useContext, useEffect, useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin immediately on import
gsap.registerPlugin(ScrollTrigger);

export const AppContext = createContext();
export const LibsContext = createContext();
export const ThemeContext = createContext();
export const LanguageContext = createContext();
export const EffectsContext = createContext();

export function AppProvider({ children }) {
  const [libs, setLibs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
        if (stored === 'light' || stored === 'dark') return stored;
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    });
    const [language, setLanguage] = useState('en');
    const [enableCardAnimations, setEnableCardAnimations] = useState(() => localStorage.getItem('enableCardAnimations') !== 'false');
    const [enableCustomCursor, setEnableCustomCursor] = useState(() => localStorage.getItem('enableCustomCursor') !== 'false');
    const [enableHighContrastGrid, setEnableHighContrastGrid] = useState(() => localStorage.getItem('enableHighContrastGrid') === 'true');
    const [themeTransition, setThemeTransition] = useState(null); // {x,y,toggleTo}

    // Skill swap feature toggles
    const [skillSwapFast, setSkillSwapFast] = useState(() => localStorage.getItem('skillSwapFast') === 'true');
    const [skillSwapRandomOrder, setSkillSwapRandomOrder] = useState(() => localStorage.getItem('skillSwapRandomOrder') !== 'false'); // default true
    const [skillSwapControls, setSkillSwapControls] = useState(() => localStorage.getItem('skillSwapControls') !== 'false'); // default true
    const [skillSwapPulse, setSkillSwapPulse] = useState(() => localStorage.getItem('skillSwapPulse') !== 'false'); // default true
    const [skillSwapRandomEasing, setSkillSwapRandomEasing] = useState(() => localStorage.getItem('skillSwapRandomEasing') !== 'false'); // default true
    const [skillSwapBaseOffset, setSkillSwapBaseOffset] = useState(() => parseInt(localStorage.getItem('skillSwapBaseOffset') || '-90', 10));
    const [skillSwapVerticalOffset, setSkillSwapVerticalOffset] = useState(() => parseInt(localStorage.getItem('skillSwapVerticalOffset') || '34', 10));
    const [skillSwapMaxVisible, setSkillSwapMaxVisible] = useState(() => parseInt(localStorage.getItem('skillSwapMaxVisible') || '4', 10));
    const [skillSwapPauseOnHover, setSkillSwapPauseOnHover] = useState(() => localStorage.getItem('skillSwapPauseOnHover') !== 'false');
    const [gridAnimate, setGridAnimate] = useState(() => localStorage.getItem('gridAnimate') !== 'false');
    const [gridTint, setGridTint] = useState(() => localStorage.getItem('gridTint') === 'true');
    const [performanceMode, setPerformanceMode] = useState(() => localStorage.getItem('performanceMode') === 'true');

    const toggleTheme = () => setTheme(prev => {
        const next = prev === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') localStorage.setItem('theme', next);
        return next;
    });
    const toggleThemeWithOrigin = (coord) => {
        setThemeTransition({
            x: coord?.x ?? window.innerWidth / 2,
            y: coord?.y ?? window.innerHeight / 2,
            from: theme,
            to: theme === 'dark' ? 'light' : 'dark',
            ts: Date.now()
        });
        // Delay actual theme swap slightly so overlay renders first
        requestAnimationFrame(() => toggleTheme());
    };

    // Persist effects toggles
    useEffect(() => {
        localStorage.setItem('enableCardAnimations', String(enableCardAnimations));
    }, [enableCardAnimations]);
    useEffect(() => {
        localStorage.setItem('enableCustomCursor', String(enableCustomCursor));
    }, [enableCustomCursor]);
    useEffect(() => {
        localStorage.setItem('enableHighContrastGrid', String(enableHighContrastGrid));
    }, [enableHighContrastGrid]);
    useEffect(() => {
        localStorage.setItem('skillSwapFast', String(skillSwapFast));
    }, [skillSwapFast]);
    useEffect(() => {
        localStorage.setItem('skillSwapRandomOrder', String(skillSwapRandomOrder));
    }, [skillSwapRandomOrder]);
    useEffect(() => {
        localStorage.setItem('skillSwapControls', String(skillSwapControls));
    }, [skillSwapControls]);
    useEffect(() => {
        localStorage.setItem('skillSwapPulse', String(skillSwapPulse));
    }, [skillSwapPulse]);
    useEffect(() => {
        localStorage.setItem('skillSwapRandomEasing', String(skillSwapRandomEasing));
    }, [skillSwapRandomEasing]);
    useEffect(() => {
        localStorage.setItem('skillSwapBaseOffset', String(skillSwapBaseOffset));
    }, [skillSwapBaseOffset]);
    useEffect(() => {
        localStorage.setItem('skillSwapVerticalOffset', String(skillSwapVerticalOffset));
    }, [skillSwapVerticalOffset]);
    useEffect(() => {
        localStorage.setItem('skillSwapMaxVisible', String(skillSwapMaxVisible));
    }, [skillSwapMaxVisible]);
    useEffect(() => {
        localStorage.setItem('skillSwapPauseOnHover', String(skillSwapPauseOnHover));
    }, [skillSwapPauseOnHover]);
    useEffect(() => {
        localStorage.setItem('gridAnimate', String(gridAnimate));
    }, [gridAnimate]);
    useEffect(() => {
        localStorage.setItem('gridTint', String(gridTint));
    }, [gridTint]);
    useEffect(() => {
        localStorage.setItem('performanceMode', String(performanceMode));
    }, [performanceMode]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    }, [theme]);

    useEffect(() => {
        const isCoarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        const hasTouch = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
        const allowCustom = !isCoarse && !hasTouch; // allow on desktops / precision pointers
        if (enableCustomCursor && allowCustom) {
            document.body.classList.add('custom-cursor-enabled');
        } else {
            document.body.classList.remove('custom-cursor-enabled');
        }
    }, [enableCustomCursor]);

    useEffect(() => {
        if (enableHighContrastGrid) document.body.classList.add('high-contrast-dot-grid');
        else document.body.classList.remove('high-contrast-dot-grid');
    }, [enableHighContrastGrid]);

    useEffect(() => {
        if (gridTint) document.body.classList.add('grid-tint'); else document.body.classList.remove('grid-tint');
    }, [gridTint]);
    useEffect(() => {
        if (performanceMode) {
            // Auto tune for performance
            setGridAnimate(false);
            setSkillSwapPulse(false);
        }
    }, [performanceMode]);

    useEffect(() => {
        async function init() {
            setLoading(false);
        }

        init();
    }, []);

    const resetEffects = () => {
        setEnableCardAnimations(true);
        setEnableCustomCursor(true);
        setEnableHighContrastGrid(false);
        setSkillSwapFast(false);
        setSkillSwapRandomOrder(true);
        setSkillSwapControls(true);
        setSkillSwapPulse(true);
        setSkillSwapRandomEasing(true);
        setSkillSwapBaseOffset(-90);
        setSkillSwapVerticalOffset(34);
        setSkillSwapMaxVisible(4);
        setSkillSwapPauseOnHover(true);
        setGridAnimate(true);
        setGridTint(false);
        setPerformanceMode(false);
    };

    const appValue = {user, setUser, loading};
    const libsValue = {libs, setLibs, gsap, ScrollTrigger};
    const themeValue = {theme, setTheme, toggleTheme, toggleThemeWithOrigin, themeTransition};
    const languageValue = {language, setLanguage};
    const effectsValue = {
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
    };

    return (
        <AppContext.Provider value={appValue}>
            <LibsContext.Provider value={libsValue}>
                <ThemeContext.Provider value={themeValue}>
                    <LanguageContext.Provider value={languageValue}>
                        <EffectsContext.Provider value={effectsValue}>
                            {children}
                        </EffectsContext.Provider>
                    </LanguageContext.Provider>
                </ThemeContext.Provider>
            </LibsContext.Provider>
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppProvider');
    return ctx;
}

export function useLibs() {
    const ctx = useContext(LibsContext);
    if (!ctx) throw new Error('useLibs must be used within AppProvider');
    return ctx;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within AppProvider');
    return ctx;
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within AppProvider');
    return ctx;
}

export function useEffects() {
    const ctx = useContext(EffectsContext);
    if (!ctx) throw new Error('useEffects must be used within AppProvider');
    return ctx;
}

export default AppContext;
