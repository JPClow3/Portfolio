import React, {useState} from 'react';
import {useLanguage} from '../context/AppContext';
import {portfolioData} from '../data';
import {FadeInOnScroll, Section} from './VisualComponents';
import {GithubIcon, LinkedInIcon, MailIcon, PhoneIcon} from './Icons';
import ContactForm from './ContactForm';
import {useToast} from './Toaster';

const Contact = () => {
    const {language} = useLanguage();
    const {contact} = portfolioData[language];
    const {push} = useToast();
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(contact.email);
            setCopiedEmail(true);
            push(language === 'en' ? 'Email copied to clipboard!' : 'E-mail copiado para a área de transferência!', {
                type: 'success'
            });
            setTimeout(() => setCopiedEmail(false), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
            push(language === 'en' ? 'Failed to copy email' : 'Falha ao copiar e-mail', {
                type: 'error'
            });
        }
    };

    const handleFormSubmit = async (formData) => {
        // Backend integration point - this should connect to your form handler
        // For now, log it
        console.log('Form data submitted:', formData);
        // You would typically make an API call here:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        // if (!response.ok) throw new Error('Failed to submit');
    };

    const contactItems = [
        {icon: <MailIcon/>, text: contact.email, href: `mailto:${contact.email}`, label: 'Email', canCopy: true},
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
                                rel={item.target ? 'noopener noreferrer' : undefined}
                                className="flex items-center p-4 md:p-6 text-left bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-blue-900/30 rounded-xl border-2 border-blue-200 dark:border-indigo-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50 dark:hover:from-indigo-900/40 dark:hover:via-purple-900/30 dark:hover:to-blue-900/40 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-bg relative"
                                aria-label={`Contact via ${item.label} - ${item.href.startsWith('mailto:') ? 'Opens email client' : item.href.startsWith('tel:') ? 'Opens phone dialer' : 'Opens in new tab'}`}
                                title={item.href.startsWith('mailto:') ? 'Click to send an email' : item.href.startsWith('tel:') ? 'Click to call' : 'Opens in new tab'}
                            >
                                <span
                                    className="flex-shrink-0 mr-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-indigo-800 dark:to-purple-800 p-3 md:p-4 rounded-full group-hover:from-purple-200 group-hover:to-blue-200 dark:group-hover:from-purple-700 dark:group-hover:to-blue-700 transition-all duration-300 shadow-md group-hover:shadow-lg">
                                    {item.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-2">
                                        {item.label}
                                        {item.href.startsWith('mailto:') && (
                                            <span className="text-xs opacity-60" aria-hidden="true">📧</span>
                                        )}
                                        {item.href.startsWith('tel:') && (
                                            <span className="text-xs opacity-60" aria-hidden="true">📞</span>
                                        )}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-cyan-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all truncate">
                                            {item.text}
                                        </p>
                                        {item.canCopy && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleCopyEmail();
                                                }}
                                                className="p-1.5 rounded-md text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                aria-label={language === 'en' ? 'Copy email to clipboard' : 'Copiar e-mail para área de transferência'}
                                                title={language === 'en' ? 'Copy email' : 'Copiar e-mail'}
                                            >
                                                {copiedEmail ? (
                                                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <svg
                                    className="flex-shrink-0 w-5 h-5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
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

                {/* Contact Form */}
                <FadeInOnScroll delay={500}>
                    <div className="mt-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {language === 'en' ? 'Send Me a Message' : 'Envie-me uma Mensagem'}
                        </h3>
                        <ContactForm onSubmit={handleFormSubmit} />
                    </div>
                </FadeInOnScroll>
            </div>
        </Section>
    );
};

export default Contact;
