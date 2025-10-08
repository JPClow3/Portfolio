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
                                className="flex items-center p-4 md:p-6 text-left bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                                aria-label={`Contact via ${item.label}`}
                            >
                                <span
                                    className="flex-shrink-0 mr-4 bg-slate-200 dark:bg-slate-700 p-3 md:p-4 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                                    {item.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
                                    <p className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                        {item.text}
                                    </p>
                                </div>
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300"
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
                        className="mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/30 text-center">
                        <div className="flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-2" fill="none"
                                 stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Location</p>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{contact.location}</p>
                    </div>
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default Contact;
