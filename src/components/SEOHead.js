import {useEffect} from 'react';

/**
 * SEO Head component for dynamic meta tags
 * Updates Open Graph, Twitter Cards, JSON-LD structured data, and HTML lang attribute
 */
export const SEOHead = ({language = 'en', data}) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    // Default values
    const defaults = {
        en: {
            title: 'JP Santos | Portfolio - Software Engineering Student | Front-End Developer',
            description: 'Portfolio of João Paulo Gonçalves Santos - Software Engineering Student and Front-End Developer. Explore my projects, skills, and experience.',
            image: `${baseUrl}/favicon.ico`,
            name: 'João Paulo Gonçalves Santos',
            jobTitle: 'Software Engineering Student | Front-End Developer'
        },
        pt: {
            title: 'JP Santos | Portfólio - Estudante de Engenharia de Software | Desenvolvedor Front-End',
            description: 'Portfólio de João Paulo Gonçalves Santos - Estudante de Engenharia de Software e Desenvolvedor Front-End. Explore meus projetos, habilidades e experiência.',
            image: `${baseUrl}/favicon.ico`,
            name: 'João Paulo Gonçalves Santos',
            jobTitle: 'Estudante de Engenharia de Software | Desenvolvedor Front-End'
        }
    };

    const content = defaults[language] || defaults.en;

    useEffect(() => {
        // Update HTML lang attribute
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }

        // Function to update or create meta tag
        const updateMetaTag = (property, content, attribute = 'property') => {
            if (typeof document === 'undefined') return;
            
            let element = document.querySelector(`meta[${attribute}="${property}"]`);
            
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, property);
                document.head.appendChild(element);
            }
            
            element.setAttribute('content', content || '');
        };

        // Function to update or create link tag
        const updateLinkTag = (rel, href) => {
            if (typeof document === 'undefined') return;
            
            let element = document.querySelector(`link[rel="${rel}"]`);
            
            if (!element) {
                element = document.createElement('link');
                element.setAttribute('rel', rel);
                document.head.appendChild(element);
            }
            
            element.setAttribute('href', href || '');
        };

        // Update title
        if (typeof document !== 'undefined') {
            document.title = content.title;
        }

        // Update base meta description
        updateMetaTag('description', content.description, 'name');

        // Open Graph tags
        updateMetaTag('og:title', content.title);
        updateMetaTag('og:description', content.description);
        updateMetaTag('og:image', content.image);
        updateMetaTag('og:url', currentUrl);
        updateMetaTag('og:type', 'website');
        updateMetaTag('og:site_name', 'JP Santos Portfolio');
        updateMetaTag('og:locale', language === 'pt' ? 'pt_BR' : 'en_US');

        // Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image', 'name');
        updateMetaTag('twitter:title', content.title, 'name');
        updateMetaTag('twitter:description', content.description, 'name');
        updateMetaTag('twitter:image', content.image, 'name');

        // Canonical URL
        updateLinkTag('canonical', currentUrl);

        // JSON-LD structured data (Person schema)
        let jsonLd = document.querySelector('script[type="application/ld+json"]');
        if (!jsonLd) {
            jsonLd = document.createElement('script');
            jsonLd.setAttribute('type', 'application/ld+json');
            document.head.appendChild(jsonLd);
        }

        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            'name': content.name,
            'jobTitle': content.jobTitle,
            'url': baseUrl,
            'sameAs': [
                'https://github.com/JPClow3',
                'https://www.linkedin.com/in/joaopaulosantosgo'
            ],
            'email': 'joaopaulo.grv4@gmail.com',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'Rio Verde',
                'addressRegion': 'GO',
                'addressCountry': 'BR'
            }
        };

        jsonLd.textContent = JSON.stringify(structuredData);

    }, [language, content, baseUrl, currentUrl]);

    return null;
};

