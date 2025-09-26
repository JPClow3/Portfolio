import React, { useCallback, useEffect } from 'react';
// 1. Importe os hooks de contexto que serão usados
import { useTheme, useLanguage } from './context/AppContext';
import { useKonamiCode } from './hooks/useKonamiCode';
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
import { Confetti, CustomCursor, DotGrid, SectionSeparator } from './components/VisualComponents';
import { useState } from 'react';


function App() {
    // 2. Obtenha o tema e o idioma diretamente do contexto
    const { theme, toggleTheme } = useTheme();
    const { setLanguage } = useLanguage();
    const [showConfetti, setShowConfetti] = useState(false);

    // Hook do Konami Code
    useKonamiCode(useCallback(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }, []));

    // 3. Efeitos para gerenciar o tema e o idioma
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme !== theme) {
            toggleTheme(); // Usa a função do contexto para sincronizar o estado
        }
    }, []); // Executa apenas uma vez na montagem

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);


    // 4. Remova os Providers, pois eles agora estão em index.js
    return (
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
    );
}

export default App;
