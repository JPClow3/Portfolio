import React from 'react';
import { useLanguage } from '../context/AppContext';
import { portfolioData } from '../data';
import { FadeInOnScroll, Section } from './VisualComponents';
import { GithubIcon, LinkedInIcon, MailIcon, PhoneIcon } from './Icons';

const Contact = () => {
    const { language } = useLanguage();
    const { contact } = portfolioData[language];
    const contactItems = [
        { icon: <MailIcon />, text: contact.email, href: `mailto:${contact.email}` },
        { icon: <PhoneIcon />, text: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
        { icon: <GithubIcon />, text: "github.com/JPClow3", href: "https://github.com/JPClow3", target: "_blank" },
        {
            icon: <LinkedInIcon />,
            text: contact.linkedin,
            href: "https://www.linkedin.com/in/joaopaulosantosgo/",
            target: "_blank"
        },
    ];
    return (
        <Section id="contact" title={contact.title}>
            <div className="max-w-2xl mx-auto text-center">
                <div className="space-y-6">
                    {contactItems.map((item, index) => (
                        <FadeInOnScroll key={index} delay={index * 150}>
                            <a href={item.href} target={item.target || '_self'}
                               rel={item.target ? 'noopener noreferrer' : ''}
                               className="inline-flex items-center text-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 group">
                                <span
                                    className="mr-4 bg-slate-100 dark:bg-slate-800 p-3 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                                    {item.icon}
                                </span>
                                <span>{item.text}</span>
                            </a>
                        </FadeInOnScroll>
                    ))}
                </div>
                <FadeInOnScroll delay={450}>
                    <p className="mt-12 text-slate-500 dark:text-slate-400">{contact.location}</p>
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default React.memo(Contact);
