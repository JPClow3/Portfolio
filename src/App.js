import React, { useCallback, useEffect, useState, Suspense } from 'react'; // 1. Importar o Suspense do React
import { LanguageContext, LibsContext, ThemeContext, useLibs } from './context/AppContext';
import { useKonamiCode } from './hooks/useKonamiCode';
import './index.css';

// Componentes visuais que são usados imediatamente e podem ser importados diretamente
import { Confetti, CustomCursor, DotGrid, SectionSeparator } from './components/VisualComponents';

// 2. Usar React.lazy para importar os componentes de seção principal
//    Isso cria "chunks" de código que serão carregados sob demanda.
const Header = React.lazy(() => import('./components/Header'));
const Hero = React.lazy(() => import('./components/Hero'));
const About = React.lazy(() => import('./components/About'));
const Profile = React.lazy(() => import('./components/Profile'));
const Experience = React.lazy(() => import('./components/Experience'));
const Projects = React.lazy(() => import('./components/Projects'));
const Skills = React.lazy(() => import('./components/Skills'));
const Contact = React.lazy(() => import('./components/Contact'));
const Footer = React.lazy(() => import('./components/Footer'));


function App() {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');
    const [showConfetti, setShowConfetti] = useState(false);
    const libs = useLibs();

    // Hook do Konami Code
    useKonamiCode(useCallback(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }, []));

    // Efeito para carregar o tema salvo e aplicar a classe 'dark'
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <LibsContext.Provider value={libs}>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <LanguageContext.Provider value={{ language, setLanguage }}>
                    {/* 3. Envolver toda a aplicação com o componente Suspense. */}
                    {/* Ele mostrará o 'fallback' enquanto os componentes "lazy" estão a ser carregados. */}
                    <Suspense fallback={
                        <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-lg">
                            Loading Portfolio...
                        </div>
                    }>
                        <div
                            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">

                            {/* Estes componentes não são lazy, então carregam imediatamente */}
                            <DotGrid />
                            <CustomCursor />
                            {showConfetti && <Confetti />}

                            {/* Os componentes lazy serão renderizados aqui quando carregados */}
                            <Header />
                            <main>
                                <Hero />
                                <SectionSeparator />
                                <About />
                                <SectionSeparator />
                                <Profile />
                                <SectionSeparator />
                                <Experience />
                                <SectionSeparator />
                                <Projects />
                                <SectionSeparator />
                                <Skills />
                                <SectionSeparator />
                                <Contact />
                            </main>
                            <Footer />
                        </div>
                    </Suspense>
                </LanguageContext.Provider>
            </ThemeContext.Provider>
        </LibsContext.Provider>
    );
}

export default App;
