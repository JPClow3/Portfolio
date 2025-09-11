import {createContext, useContext} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Registra o plugin do GSAP uma única vez
gsap.registerPlugin(ScrollTrigger);

// --- CONTEXTOS ---
export const ThemeContext = createContext();
export const LanguageContext = createContext();
export const LibsContext = createContext(); // Passa o GSAP diretamente

// --- HOOKS DE ACESSO ---
export const useTheme = () => useContext(ThemeContext);
export const useLanguage = () => useContext(LanguageContext);
export const useLibs = () => useContext(LibsContext);
