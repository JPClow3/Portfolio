import React from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {FadeInOnScroll, Section} from './VisualComponents';
import {GithubIcon, LinkedInIcon, MailIcon, PhoneIcon} from './Icons';

const Contact = () => {
    const {language} = useLanguage();
    const {contact} = portfolioData[language];
    const contactItems = [
        {icon: <MailIcon/>, text: contact.email, href: `mailto:${contact.email}`, label: 'Email'},
        {icon: <PhoneIcon/>, text: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}`, label: 'Phone'},
        {
            icon: <GithubIcon/>,
            text: "github.com/JPClow3",
            href: "https://github.com/JPClow3",
            target: "_blank",
            label: 'GitHub'
        },
        {
            icon: <LinkedInIcon/>,
            text: contact.linkedin,
            href: "https://www.linkedin.com/in/joaopaulosantosgo/",
            target: "_blank",
            label: 'LinkedIn'
        },
    ];
    return (
        <Section id="contact" title={contact.title}>
            <div className="max-w-3xl mx-auto">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    {contactItems.map((item, index) => (
                        <FadeInOnScroll key={index} delay={index * 100}>
                            <a
                                href={item.href}
                                target={item.target || '_self'}
                                rel={item.target ? 'noopener noreferrer' : ''}
                                className="flex items-center p-4 md:p-6 text-left bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-blue-900/30 rounded-xl border-2 border-blue-200 dark:border-indigo-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50 dark:hover:from-indigo-900/40 dark:hover:via-purple-900/30 dark:hover:to-blue-900/40 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg"
                                aria-label={`Contact via ${item.label}`}
                            >
                                <span
                                    className="flex-shrink-0 mr-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-indigo-800 dark:to-purple-800 p-3 md:p-4 rounded-full group-hover:from-purple-200 group-hover:to-blue-200 dark:group-hover:from-purple-700 dark:group-hover:to-blue-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                                    {item.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{item.label}</p>
                                    <p className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-cyan-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all truncate">
                                        {item.text}
                                    </p>
                                </div>
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5l7 7-7 7"/>
                                </svg>
                            </a>
                        </FadeInOnScroll>
                    ))}
                </div>
                <FadeInOnScroll delay={400}>
                    <div
                        className="mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-xl border-2 border-blue-300 dark:border-blue-800 text-center shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20">
                        <div className="flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-blue-600 dark:text-cyan-400 mr-2" fill="none"
                                 stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">Location</p>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{contact.location}</p>
                    </div>
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default Contact;
