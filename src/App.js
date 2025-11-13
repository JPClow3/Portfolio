import React, {lazy, Suspense, useCallback, useEffect, useRef, useState} from 'react';
import {useTheme, useLanguage} from './context/AppContext';
import {useKonamiCode} from './hooks/useKonamiCode';
import './index.css'; // Importando nosso CSS consolidado
import ErrorBoundary from './components/ErrorBoundary';
import {SEOHead} from './components/SEOHead';
import {SectionSkeleton} from './components/LoadingSkeleton';
// Critical above-the-fold components loaded immediately
import Header from './components/Header';
import Hero from './components/Hero';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
// Importando componentes visuais que o App usa diretamente
import {Confetti, CustomCursor, SectionSeparator} from './components/VisualComponents';
import {useToast} from './components/Toaster';
import CookieConsent from './components/CookieConsent';
import {initAnalytics} from './utils/analytics';
// Below-the-fold components lazy loaded to reduce initial bundle size
const About = lazy(() => import('./components/About'));
const Profile = lazy(() => import('./components/Profile'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Loading fallback component
const SectionLoader = SectionSkeleton;

function App() {
    const {theme, toggleThemeWithOrigin, themeTransition} = useTheme();
    const {language} = useLanguage();
    const [showConfetti, setShowConfetti] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [waitingSW, setWaitingSW] = useState(null);
    const {push} = useToast();
    const confettiTimeoutRef = useRef(null);

    // Hook do Konami Code
    useKonamiCode(useCallback(() => {
        setShowConfetti(true);
        // Clear any existing timeout
        if (confettiTimeoutRef.current) {
            clearTimeout(confettiTimeoutRef.current);
        }
        confettiTimeoutRef.current = setTimeout(() => {
            setShowConfetti(false);
            confettiTimeoutRef.current = null;
        }, 5000);
    }, []));

    // Cleanup confetti timeout on unmount
    useEffect(() => {
        return () => {
            if (confettiTimeoutRef.current) {
                clearTimeout(confettiTimeoutRef.current);
                confettiTimeoutRef.current = null;
            }
        };
    }, []);

    // Initialize analytics if consent given
    useEffect(() => {
        try {
            const consent = localStorage.getItem('analytics-consent');
            if (consent === 'granted') {
                initAnalytics();
            }
        } catch (e) {
            // Analytics initialization failed
        }
    }, []);

    // Gerenciar o ciclo de vida da sobreposição de transição de tema
    useEffect(() => {
        if (themeTransition) {
            setOverlayVisible(true);
            const t = setTimeout(() => setOverlayVisible(false), 700);
            return () => clearTimeout(t);
        }
    }, [themeTransition]);

    // Efeito para aplicar a classe 'dark'
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('theme', theme);
            }
        } catch (e) {
            // localStorage may be disabled or unavailable
            console.warn('Failed to save theme to localStorage:', e);
        }
    }, [theme]);

    // Listen for custom SW update event dispatched from index.js
    useEffect(() => {
        const onUpdate = (e) => {
            const worker = e.detail.worker;
            setWaitingSW(worker);
            push('New version available', {
                type: 'info',
                actionLabel: 'Reload',
                onAction: () => {
                    if (worker) {
                        // User confirmed reload, set waiting state and skip waiting
                        setWaitingSW(worker);
                        worker.postMessage('SKIP_WAITING');
                        // Reload will happen on controllerchange event
                    }
                }
            });
        };
        window.addEventListener('sw-update-available', onUpdate);
        // reload after activation - but only if user has already clicked reload button
        const onController = () => {
            // Only reload if user has explicitly requested it via the toast action
            // This prevents unexpected reloads that lose user's scroll position
            if (waitingSW) {
                // User already clicked reload, so proceed with reload
                window.location.reload();
            }
        };
        navigator.serviceWorker?.addEventListener('controllerchange', onController);
        return () => {
            window.removeEventListener('sw-update-available', onUpdate);
            navigator.serviceWorker?.removeEventListener('controllerchange', onController);
        };
    }, [push, waitingSW]);

    return (
        <ErrorBoundary fallbackMessage="We're sorry, but something went wrong loading the portfolio.">
            <SEOHead language={language} />
            <div
                className="relative z-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-dark-bg dark:via-dark-surface dark:to-indigo-950 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 overflow-x-hidden">
                <CustomCursor/>
                <ScrollProgress/>
                {showConfetti && <Confetti/>}
                {overlayVisible && themeTransition && (
                    <div
                        className={`theme-transition-overlay ${themeTransition.to}`}
                        style={{
                            '--tx': `${themeTransition.x}px`,
                            '--ty': `${themeTransition.y}px`
                        }}
                        aria-hidden="true"
                    />
                )}
                <Suspense fallback={<div className="h-16"/>}>
                    <Header onThemeOriginClick={(e) => toggleThemeWithOrigin({x: e.clientX, y: e.clientY})}/>
                </Suspense>
                <main className="relative z-10">
                    <ErrorBoundary fallbackMessage="Unable to load the Hero section.">
                        <Suspense fallback={<SectionLoader/>}>
                            <Hero/>
                        </Suspense>
                    </ErrorBoundary>

                    <ErrorBoundary fallbackMessage="Unable to load the About section.">
                        <Suspense fallback={<SectionLoader/>}>
                            <About/>
                        </Suspense>
                    </ErrorBoundary>

                    <SectionSeparator/>

                    <ErrorBoundary fallbackMessage="Unable to load the Profile section.">
                        <Suspense fallback={<SectionLoader/>}>
                            <Profile/>
                        </Suspense>
                    </ErrorBoundary>

                    <SectionSeparator/>

                    <ErrorBoundary fallbackMessage="Unable to load the Experience section.">
                        <Suspense fallback={<SectionLoader/>}>
                            <Experience/>
                        </Suspense>
                    </ErrorBoundary>

                    <SectionSeparator/>

                    <ErrorBoundary fallbackMessage="Unable to load the Projects section.">
                        <Suspense fallback={<SectionLoader/>}>
                            <Projects/>
                        </Suspense>
                    </ErrorBoundary>

                    <SectionSeparator/>

                    <ErrorBoundary fallbackMessage="Unable to load the Skills section.">
                        <Suspense fallback={<SectionLoader/>}>
                            <Skills/>
                        </Suspense>
                    </ErrorBoundary>

                    <SectionSeparator/>

                    <ErrorBoundary fallbackMessage="Unable to load the Contact section.">
                        <Suspense fallback={<SectionLoader/>}>
                            <Contact/>
                        </Suspense>
                    </ErrorBoundary>
                </main>
                <Suspense fallback={null}>
                    <Footer/>
                </Suspense>
                <BackToTop />
                <CookieConsent />
            </div>
        </ErrorBoundary>
    );
}

export default App;

