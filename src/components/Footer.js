import React from 'react';
import {BUILD_VERSION} from '../version';
import {GithubIcon, LinkedInIcon, MailIcon} from './Icons';
import GitHubContributions from './GitHubContributions';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const socialLinks = [
        {
            icon: <LinkedInIcon className="w-5 h-5" />,
            href: "https://www.linkedin.com/in/joaopaulosantosgo/",
            label: "LinkedIn"
        },
        {
            icon: <GithubIcon className="w-5 h-5" />,
            href: "https://github.com/JPClow3",
            label: "GitHub"
        },
        {
            icon: <MailIcon className="w-5 h-5" />,
            href: "mailto:joaopaulo.goncalves.santos@outlook.com",
            label: "Email"
        }
    ];

    return (
        <footer
            className="bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 dark:from-dark-surface/80 dark:via-dark-bg/80 dark:to-indigo-950/80 border-t-2 border-blue-300 dark:border-indigo-700 relative z-40 shadow-lg shadow-blue-500/10 dark:shadow-purple-500/10">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* GitHub Contributions Widget */}
                <div className="max-w-4xl mx-auto">
                    <GitHubContributions username="JPClow3" limit={5} />
                </div>
                
                <div className="text-center space-y-4">
                {/* Social Links */}
                <div className="flex justify-center items-center gap-4">
                    {socialLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : '_self'}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="p-2 rounded-full bg-white/50 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 dark:hover:from-cyan-500 dark:hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                            aria-label={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
                
                {/* Copyright */}
                <div className="space-y-2">
                    <p className="text-slate-700 dark:text-slate-300">
                        &copy; {currentYear} João Paulo Gonçalves Santos. All Rights Reserved.
                    </p>
                    <p className="text-xs tracking-wide uppercase opacity-70 text-slate-600 dark:text-slate-400">
                        Build {BUILD_VERSION}
                    </p>
                </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
