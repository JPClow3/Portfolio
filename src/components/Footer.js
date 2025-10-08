import React from 'react';
import {BUILD_VERSION} from '../version';

const Footer = () => {
    return (
        <footer
            className="bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 dark:from-dark-surface/80 dark:via-dark-bg/80 dark:to-indigo-950/80 border-t-2 border-blue-300 dark:border-indigo-700 relative z-40 shadow-lg shadow-blue-500/10 dark:shadow-purple-500/10">
            <div className="container mx-auto px-4 py-6 text-center text-slate-600 dark:text-slate-400 space-y-2">
                <p>&copy; {new Date().getFullYear()} João Paulo Gonçalves Santos. All Rights Reserved.</p>
                <p className="text-xs tracking-wide uppercase opacity-70">Build {BUILD_VERSION}</p>
            </div>
        </footer>
    );
};

export default Footer;
