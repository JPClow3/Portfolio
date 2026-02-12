import React, {createContext, useContext, useEffect, useState} from 'react';
// Tree-shake GSAP - import only core, ScrollTrigger will be lazy-loaded
import {gsap} from 'gsap';

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
    // Helper function to safely get localStorage value
    const getLocalStorageItem = (key, defaultValue) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                return localStorage.getItem(key);
            }
        } catch (e) {
            // localStorage may be disabled or unavailable
            console.warn(`Failed to read ${key} from localStorage:`, e);
        }
        return defaultValue;
    };

    const [enableCardAnimations, setEnableCardAnimations] = useState(() => getLocalStorageItem('enableCardAnimations', null) !== 'false');
    const [enableCustomCursor, setEnableCustomCursor] = useState(() => getLocalStorageItem('enableCustomCursor', null) !== 'false');
    const [enableHighContrastGrid, setEnableHighContrastGrid] = useState(() => getLocalStorageItem('enableHighContrastGrid', null) === 'true');
    const [themeTransition, setThemeTransition] = useState(null); // {x,y,toggleTo}

    // Skill swap feature toggles
    const [skillSwapFast, setSkillSwapFast] = useState(() => getLocalStorageItem('skillSwapFast', null) === 'true');
    const [skillSwapRandomOrder, setSkillSwapRandomOrder] = useState(() => getLocalStorageItem('skillSwapRandomOrder', null) !== 'false'); // default true
    const [skillSwapControls, setSkillSwapControls] = useState(() => getLocalStorageItem('skillSwapControls', null) !== 'false'); // default true
    const [skillSwapPulse, setSkillSwapPulse] = useState(() => getLocalStorageItem('skillSwapPulse', null) !== 'false'); // default true
    const [skillSwapRandomEasing, setSkillSwapRandomEasing] = useState(() => getLocalStorageItem('skillSwapRandomEasing', null) !== 'false'); // default true
    const [skillSwapBaseOffset, setSkillSwapBaseOffset] = useState(() => parseInt(getLocalStorageItem('skillSwapBaseOffset', '-90'), 10));
    const [skillSwapVerticalOffset, setSkillSwapVerticalOffset] = useState(() => parseInt(getLocalStorageItem('skillSwapVerticalOffset', '34'), 10));
    const [skillSwapMaxVisible, setSkillSwapMaxVisible] = useState(() => parseInt(getLocalStorageItem('skillSwapMaxVisible', '4'), 10));
    const [skillSwapPauseOnHover, setSkillSwapPauseOnHover] = useState(() => getLocalStorageItem('skillSwapPauseOnHover', null) !== 'false');
    const [gridAnimate, setGridAnimate] = useState(() => getLocalStorageItem('gridAnimate', null) !== 'false');
    const [gridTint, setGridTint] = useState(() => getLocalStorageItem('gridTint', null) === 'true');
    const [performanceMode, setPerformanceMode] = useState(() => getLocalStorageItem('performanceMode', null) === 'true');

    const toggleTheme = () => setTheme(prev => {
        const next = prev === 'dark' ? 'light' : 'dark';
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('theme', next);
            }
        } catch (e) {
            console.warn('Failed to save theme to localStorage:', e);
        }
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

    // Helper function to safely set localStorage value
    const setLocalStorageItem = (key, value) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, String(value));
            }
        } catch (e) {
            // localStorage may be disabled or unavailable
            console.warn(`Failed to save ${key} to localStorage:`, e);
        }
    };

    // Persist effects toggles
    useEffect(() => {
        setLocalStorageItem('enableCardAnimations', enableCardAnimations);
    }, [enableCardAnimations]);
    useEffect(() => {
        setLocalStorageItem('enableCustomCursor', enableCustomCursor);
    }, [enableCustomCursor]);
    useEffect(() => {
        setLocalStorageItem('enableHighContrastGrid', enableHighContrastGrid);
    }, [enableHighContrastGrid]);
    useEffect(() => {
        setLocalStorageItem('skillSwapFast', skillSwapFast);
    }, [skillSwapFast]);
    useEffect(() => {
        setLocalStorageItem('skillSwapRandomOrder', skillSwapRandomOrder);
    }, [skillSwapRandomOrder]);
    useEffect(() => {
        setLocalStorageItem('skillSwapControls', skillSwapControls);
    }, [skillSwapControls]);
    useEffect(() => {
        setLocalStorageItem('skillSwapPulse', skillSwapPulse);
    }, [skillSwapPulse]);
    useEffect(() => {
        setLocalStorageItem('skillSwapRandomEasing', skillSwapRandomEasing);
    }, [skillSwapRandomEasing]);
    useEffect(() => {
        setLocalStorageItem('skillSwapBaseOffset', skillSwapBaseOffset);
    }, [skillSwapBaseOffset]);
    useEffect(() => {
        setLocalStorageItem('skillSwapVerticalOffset', skillSwapVerticalOffset);
    }, [skillSwapVerticalOffset]);
    useEffect(() => {
        setLocalStorageItem('skillSwapMaxVisible', skillSwapMaxVisible);
    }, [skillSwapMaxVisible]);
    useEffect(() => {
        setLocalStorageItem('skillSwapPauseOnHover', skillSwapPauseOnHover);
    }, [skillSwapPauseOnHover]);
    useEffect(() => {
        setLocalStorageItem('gridAnimate', gridAnimate);
    }, [gridAnimate]);
    useEffect(() => {
        setLocalStorageItem('gridTint', gridTint);
    }, [gridTint]);
    useEffect(() => {
        setLocalStorageItem('performanceMode', performanceMode);
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
    // ScrollTrigger is lazy-loaded - provide helper to register it
    const libsValue = {
        libs,
        setLibs,
        gsap,
        registerScrollTrigger: async () => {
            // Lazy-load ScrollTrigger only when needed
            const {ScrollTrigger} = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);
            return ScrollTrigger;
        }
    };
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
