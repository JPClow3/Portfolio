import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from './context/AppContext';
import {useKonamiCode} from './hooks/useKonamiCode';
import './index.css'; // Importando nosso CSS consolidado
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
import {Confetti, CustomCursor, DotGrid, SectionSeparator} from './components/VisualComponents';
import {useToast} from './components/Toaster';


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
                    if (worker) worker.postMessage('SKIP_WAITING');
                }
            });
        };
        window.addEventListener('sw-update-available', onUpdate);
        // reload after activation
        const onController = () => {
            window.location.reload();
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
        <div
            className="relative z-0 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 overflow-x-hidden">
            <DotGrid/>
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
            <Header onThemeOriginClick={(e) => toggleThemeWithOrigin({x: e.clientX, y: e.clientY})}/>
            <main className="relative z-10">
                <Hero/>
                <SectionSeparator/>
                <About/>
                <SectionSeparator/>
                <Profile/>
                <SectionSeparator/>
                <Experience/>
                <SectionSeparator/>
                <Projects/>
                <SectionSeparator/>
                <Skills/>
                <SectionSeparator/>
                <Contact/>
            </main>
            <Footer/>
        </div>
    );
}

export default App;
