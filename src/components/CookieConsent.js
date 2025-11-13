import React, {useState, useEffect} from 'react';
import {useLanguage} from '../context/AppContext';
import {initAnalytics} from '../utils/analytics';

const CookieConsent = () => {
    const {language} = useLanguage();
    const [showBanner, setShowBanner] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if consent has been given
        try {
            const consent = localStorage.getItem('analytics-consent');
            if (!consent) {
                // Show banner after a short delay
                const timer = setTimeout(() => {
                    setShowBanner(true);
                    setTimeout(() => setIsVisible(true), 100);
                }, 2000);
                return () => clearTimeout(timer);
            } else if (consent === 'granted') {
                // Initialize analytics if consent was already granted
                initAnalytics();
            }
        } catch (e) {
            console.warn('Failed to check cookie consent:', e);
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem('analytics-consent', 'granted');
            setShowBanner(false);
            initAnalytics();
        } catch (e) {
            console.warn('Failed to save cookie consent:', e);
        }
    };

    const handleDecline = () => {
        try {
            localStorage.setItem('analytics-consent', 'denied');
            setShowBanner(false);
        } catch (e) {
            console.warn('Failed to save cookie consent:', e);
        }
    };

    if (!showBanner) return null;

    const texts = {
        en: {
            title: 'Cookie Consent',
            message: 'This website uses cookies to analyze site usage and improve user experience. Your data is never shared with third parties.',
            accept: 'Accept',
            decline: 'Decline'
        },
        pt: {
            title: 'Consentimento de Cookies',
            message: 'Este site usa cookies para analisar o uso do site e melhorar a experiência do usuário. Seus dados nunca são compartilhados com terceiros.',
            accept: 'Aceitar',
            decline: 'Recusar'
        }
    };

    const t = texts[language] || texts.en;

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[10001] bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-dark-surface dark:via-dark-bg dark:to-indigo-950 border-t-2 border-blue-300 dark:border-indigo-700 shadow-lg transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-modal="false"
        >
            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 id="cookie-consent-title" className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                            {t.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {t.message}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDecline}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            {t.decline}
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            {t.accept}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;

