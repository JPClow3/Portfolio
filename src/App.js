import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from './context/AppContext';
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


function App() {
    const { theme, toggleTheme } = useTheme();
    // A variável 'language' foi removida pois não é usada aqui
    const [showConfetti, setShowConfetti] = useState(false);

    // Hook do Konami Code
    useKonamiCode(useCallback(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }, []));

    // Efeito para carregar o tema salvo
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme !== theme) {
            // A lógica aqui pode ser aprimorada se um setTheme estivesse disponível,
            // mas para o escopo atual, manter as dependências corretas é o principal.
        }
    }, [theme, toggleTheme]);

    // Efeito para aplicar a classe 'dark'
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);


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
