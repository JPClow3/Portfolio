import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AppProvider} from './context/AppContext';
import {ToastProvider} from './components/Toaster';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ToastProvider>
            <AppProvider>
                <App/>
            </AppProvider>
        </ToastProvider>
    </React.StrictMode>
);

// Register service worker asynchronously to not block main thread
if ('serviceWorker' in navigator) {
    // Use requestIdleCallback if available, otherwise use setTimeout
    const registerSW = () => {
        navigator.serviceWorker.register('./sw.js').then(reg => {
            // Listen for updates
            const listen = (worker) => {
                if (!worker) return;
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                        window.dispatchEvent(new CustomEvent('sw-update-available', {detail: {worker}}));
                    }
                });
            };
            listen(reg.installing);
            reg.addEventListener('updatefound', () => listen(reg.installing));
            // Periodic update check every 10 minutes (defer to avoid blocking)
            // Interval runs for app lifetime - clearing on page unload is handled by browser
            setInterval(() => reg.update().catch(() => {}), 10 * 60 * 1000);
        }).catch(err => console.warn('SW registration failed', err));
    };

    // Defer service worker registration to avoid blocking initial load
    if ('requestIdleCallback' in window) {
        requestIdleCallback(registerSW, {timeout: 2000});
    } else {
        // Fallback: register after load event
        window.addEventListener('load', () => {
            setTimeout(registerSW, 100);
        });
    }
}
