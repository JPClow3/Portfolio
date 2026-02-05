export const languages = {
  en: 'English',
  pt: 'Português',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.profile': 'Profile',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': "Hello, I'm",
    'hero.name': 'João Paulo Gonçalves Santos',
    'hero.title': 'Software Engineering Student | Front-End Developer',
    'hero.tagline': 'Transforming ideas into innovative digital solutions',
    'hero.cta.work': 'View My Work',
    'hero.cta.contact': 'Get in Touch',

    // Profile
    'profile.title': 'My Profile',
    'profile.status': 'Available for new opportunities',
    'profile.contactText': 'LinkedIn',

    // Summary
    'summary.title': 'Summary',
    'summary.text': 'Proactive Software Engineering student with hands-on experience in low-code development, a strong foundation in software quality principles, and a growing passion for front-end technologies. Skilled in Agile methodologies and modern web development. Eager to apply my diverse skills in a dynamic software engineering role to contribute to robust and innovative solutions.',

    // Experience
    'experience.title': 'Professional Experience',
    'experience.present': 'Present',

    // Education
    'education.title': 'Education',
    'education.institution': 'University of Rio Verde',
    'education.degree': 'Software Engineering',
    'education.status': 'Currently in the 4th Semester (Expected Graduation: Aug 2028)',

    // Projects
    'projects.title': 'Projects',
    'projects.viewAll': 'View All Projects',
    'projects.viewProject': 'View Project',
    'projects.viewCode': 'View Code',

    // Skills
    'skills.title': 'Skills & Certifications',
    'skills.tagline': 'Building modern solutions with passion and precision',
    'skills.certifications': 'Certifications',

    // Contact
    'contact.title': 'Get In Touch',
    'contact.subtitle': "Have a question or want to work together? Feel free to reach out!",
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Phone',
    'contact.info.location': 'Location',

    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Read More',
    'blog.allPosts': 'All Posts',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
  },
  pt: {
    // Navigation
    'nav.about': 'Sobre',
    'nav.profile': 'Perfil',
    'nav.experience': 'Experiência',
    'nav.projects': 'Projetos',
    'nav.skills': 'Habilidades',
    'nav.blog': 'Blog',
    'nav.contact': 'Contato',

    // Hero
    'hero.greeting': 'Olá, eu sou',
    'hero.name': 'João Paulo Gonçalves Santos',
    'hero.title': 'Estudante de Engenharia de Software | Desenvolvedor Front-End',
    'hero.tagline': 'Transformando ideias em soluções digitais inovadoras',
    'hero.cta.work': 'Ver Meus Trabalhos',
    'hero.cta.contact': 'Entre em Contato',

    // Profile
    'profile.title': 'Meu Perfil',
    'profile.status': 'Disponível para novas oportunidades',
    'profile.contactText': 'LinkedIn',

    // Summary
    'summary.title': 'Resumo',
    'summary.text': 'Estudante proativo de Engenharia de Software com experiência prática em desenvolvimento low-code, uma base sólida em princípios de qualidade de software e uma paixão crescente por tecnologias front-end. Habilidoso em metodologias Ágeis e desenvolvimento web moderno. Ansioso para aplicar minhas diversas habilidades em uma função dinâmica de engenharia de software para contribuir com soluções robustas e inovadoras.',

    // Experience
    'experience.title': 'Experiência Profissional',
    'experience.present': 'Presente',

    // Education
    'education.title': 'Formação',
    'education.institution': 'Universidade de Rio Verde',
    'education.degree': 'Engenharia de Software',
    'education.status': 'Cursando o 4º Semestre (Previsão de Conclusão: Ago 2028)',

    // Projects
    'projects.title': 'Projetos',
    'projects.viewAll': 'Ver Todos os Projetos',
    'projects.viewProject': 'Ver Projeto',
    'projects.viewCode': 'Ver Código',

    // Skills
    'skills.title': 'Habilidades & Certificações',
    'skills.tagline': 'Construindo soluções modernas com paixão e precisão',
    'skills.certifications': 'Certificações',

    // Contact
    'contact.title': 'Entre em Contato',
    'contact.subtitle': 'Tem uma pergunta ou quer trabalhar junto? Fique à vontade para entrar em contato!',
    'contact.form.name': 'Nome',
    'contact.form.email': 'Email',
    'contact.form.message': 'Mensagem',
    'contact.form.send': 'Enviar Mensagem',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Telefone',
    'contact.info.location': 'Localização',

    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Leia Mais',
    'blog.allPosts': 'Todos os Posts',

    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Algo deu errado',
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui.en): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}
