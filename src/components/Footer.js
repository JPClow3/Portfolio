import React from 'react';

const Footer = () => (
    <footer className="bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} João Paulo Gonçalves Santos. All Rights Reserved.</p>
        </div>
    </footer>
);

export default React.memo(Footer);
