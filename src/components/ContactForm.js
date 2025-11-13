import React, {useState} from 'react';
import {useLanguage} from '../context/AppContext';
import {validateForm} from '../utils/formValidation';
import {useToast} from './Toaster';
import {trackFormSubmission} from '../utils/analytics';

const ContactForm = ({onSubmit}) => {
    const {language} = useLanguage();
    const {push} = useToast();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validation = validateForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        try {
            // Call the onSubmit handler passed as prop (backend integration)
            if (onSubmit) {
                await onSubmit(formData);
            } else {
                // Fallback: just log or show success
                console.log('Form submitted:', formData);
                push(language === 'en' ? 'Message sent successfully!' : 'Mensagem enviada com sucesso!', {
                    type: 'success'
                });
            }
            
            // Track successful form submission
            trackFormSubmission('contact', true);
            
            // Reset form
            setFormData({name: '', email: '', message: ''});
            setErrors({});
        } catch (error) {
            console.error('Form submission error:', error);
            // Track failed form submission
            trackFormSubmission('contact', false);
            push(language === 'en' ? 'Failed to send message. Please try again.' : 'Falha ao enviar mensagem. Tente novamente.', {
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formLabels = {
        en: {
            name: 'Name',
            email: 'Email',
            message: 'Message',
            submit: 'Send Message',
            sending: 'Sending...',
            required: 'Required'
        },
        pt: {
            name: 'Nome',
            email: 'E-mail',
            message: 'Mensagem',
            submit: 'Enviar Mensagem',
            sending: 'Enviando...',
            required: 'Obrigatório'
        }
    };

    const labels = formLabels[language] || formLabels.en;

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {labels.name} <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.name
                            ? 'border-red-500 dark:border-red-600'
                            : 'border-blue-200 dark:border-indigo-700 focus:border-purple-500 dark:focus:border-purple-400'
                    } bg-white dark:bg-slate-800 text-slate-800 dark:text-white`}
                    placeholder={labels.name}
                    required
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {labels.email} <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.email
                            ? 'border-red-500 dark:border-red-600'
                            : 'border-blue-200 dark:border-indigo-700 focus:border-purple-500 dark:focus:border-purple-400'
                    } bg-white dark:bg-slate-800 text-slate-800 dark:text-white`}
                    placeholder={labels.email}
                    required
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {labels.message} <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                        errors.message
                            ? 'border-red-500 dark:border-red-600'
                            : 'border-blue-200 dark:border-indigo-700 focus:border-purple-500 dark:focus:border-purple-400'
                    } bg-white dark:bg-slate-800 text-slate-800 dark:text-white`}
                    placeholder={labels.message}
                    required
                />
                {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isSubmitting ? labels.sending : labels.submit}
            </button>
        </form>
    );
};

export default ContactForm;

