import React from 'react';
import {BUILD_VERSION} from '../version';

const Footer = () => (
    <footer className="bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 relative z-40">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <p>&copy; {new Date().getFullYear()} João Paulo Gonçalves Santos. All Rights Reserved.</p>
            <p className="text-xs tracking-wide uppercase opacity-70">Build {BUILD_VERSION}</p>
        </div>
    </footer>
);

export default Footer;
