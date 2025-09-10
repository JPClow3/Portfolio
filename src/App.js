import React, {useCallback, useEffect, useState} from 'react';
import {LanguageContext, LibsContext, ThemeContext, useLibs} from './context/AppContext';
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


function App() {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');
    const [showConfetti, setShowConfetti] = useState(false);
    const libs = useLibs(); // Pega o valor do GSAP do nosso contexto

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
            <ThemeContext.Provider value={{theme, toggleTheme}}>
                <LanguageContext.Provider value={{language, setLanguage}}>
                    <div
                        className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
                        <DotGrid/>
                        <CustomCursor/>
                        {showConfetti && <Confetti/>}

                        <Header/>
                        <main>
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
                </LanguageContext.Provider>
            </ThemeContext.Provider>
        </LibsContext.Provider>
    );
}

export default App;
