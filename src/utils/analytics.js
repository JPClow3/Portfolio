/**
 * Google Analytics 4 event tracking utilities
 * Privacy-friendly: Only tracks interactions, no personal data
 */

// Google Analytics 4 Measurement ID (will be set via environment variable or config)
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || '';

// Check if analytics should be enabled (user consent required)
const isAnalyticsEnabled = () => {
    if (typeof window === 'undefined') return false;
    try {
        const consent = localStorage.getItem('analytics-consent');
        return consent === 'granted';
    } catch (e) {
        return false;
    }
};

// Initialize Google Analytics
export const initAnalytics = () => {
    if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || !isAnalyticsEnabled()) {
        return;
    }

    // Add gtag script if not already present
    if (!window.gtag) {
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=None;Secure'
            });
        `;
        document.head.appendChild(script2);
    }
};

// Track page view
export const trackPageView = (path) => {
    if (!isAnalyticsEnabled() || !window.gtag) return;
    
    try {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: path || window.location.pathname + window.location.search
        });
    } catch (e) {
        console.warn('Analytics tracking error:', e);
    }
};

// Track event
export const trackEvent = (eventName, eventParams = {}) => {
    if (!isAnalyticsEnabled() || !window.gtag) return;
    
    try {
        window.gtag('event', eventName, {
            ...eventParams,
            // Ensure no personal data is tracked
            anonymize_ip: true
        });
    } catch (e) {
        console.warn('Analytics tracking error:', e);
    }
};

// Track section view
export const trackSectionView = (sectionName) => {
    trackEvent('section_view', {
        section_name: sectionName
    });
};

// Track button click
export const trackButtonClick = (buttonName, location) => {
    trackEvent('button_click', {
        button_name: buttonName,
        location: location
    });
};

// Track form submission
export const trackFormSubmission = (formName, success) => {
    trackEvent('form_submission', {
        form_name: formName,
        success: success
    });
};

// Track resume download
export const trackResumeDownload = (language) => {
    trackEvent('resume_download', {
        resume_language: language
    });
};

// Track external link click
export const trackExternalLink = (linkUrl) => {
    trackEvent('external_link', {
        link_url: linkUrl
    });
};

