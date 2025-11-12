import React, {Suspense, useCallback, useEffect, useState} from 'react';
import {useTheme} from './context/AppContext';
import {useKonamiCode} from './hooks/useKonamiCode';
import './index.css'; // Importando nosso CSS consolidado
import ErrorBoundary from './components/ErrorBoundary';
// Importando os componentes de seção
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Profile from './components/Profile';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Importando componentes visuais que o App usa diretamente
import {Confetti, CustomCursor, SectionSeparator} from './components/VisualComponents';
import {useToast} from './components/Toaster';

// Loading fallback component
const SectionLoader = () => (
    <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

function App() {
    const {theme, toggleThemeWithOrigin, themeTransition} = useTheme();
    const [showConfetti, setShowConfetti] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [waitingSW, setWaitingSW] = useState(null);
    const {push} = useToast();

    // Hook do Konami Code
    useKonamiCode(useCallback(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }, []));

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
        localStorage.setItem('theme', theme);
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
        // Optional: log SW messages (could later be turned into toasts)
        const onMessage = (e) => {
            if (e.data?.type === 'SW_ACTIVATED' && waitingSW) {
                // Already reloading via controllerchange
            }
        };
        navigator.serviceWorker?.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('sw-update-available', onUpdate);
            navigator.serviceWorker?.removeEventListener('controllerchange', onController);
            navigator.serviceWorker?.removeEventListener('message', onMessage);
        };
    }, [push, waitingSW]);

    return (
        <ErrorBoundary fallbackMessage="We're sorry, but something went wrong loading the portfolio.">
            <div
                className="relative z-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-dark-bg dark:via-dark-surface dark:to-indigo-950 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 overflow-x-hidden">
                <CustomCursor/>
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
            </div>
        </ErrorBoundary>
    );
}

export default App;

