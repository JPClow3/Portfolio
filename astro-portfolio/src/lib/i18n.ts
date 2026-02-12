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
    'nav.resume': 'Resume',

    // Hero
    'hero.greeting': "Hello, I'm",
    'hero.name': 'João Paulo Santos',
    'hero.title': 'Front-End Developer & QA Automation Engineer',
    'hero.tagline': 'I specialize in creating exceptional digital experiences. Transforming complex ideas into elegant and efficient code.',
    'hero.availability': 'Available for Projects',
    'hero.cta.work': 'View My Work',
    'hero.cta.contact': 'Get in Touch',
    'hero.cta.github': 'My GitHub',
    'hero.cta.resume': 'Download Resume',

    // Profile
    'profile.title': 'My Profile',
    'profile.status': 'Available for new opportunities',
    'profile.contactText': 'LinkedIn',

    // Summary
    'summary.title': 'About Me',
    'summary.text': 'Software Engineering student passionate about front-end development and AI applications. I build interactive web experiences with React and TypeScript, and explore creative AI projects including game development and strategic tools. Currently seeking opportunities to grow as a developer.',

    // Experience
    'experience.title': 'Professional Experience',
    'experience.present': 'Present',

    // Education
    'education.title': 'Education',
    'education.institution': 'University of Rio Verde',
    'education.degree': 'Software Engineering',
    'education.status': '4th Semester \u2022 Expected Graduation: 2028',

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
    'blog.title': 'Latest Posts',
    'blog.readMore': 'Read More',
    'blog.allPosts': 'View All Posts',
    'blog.subtitle': 'Thoughts on development, automation, and building for the web',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.backToTop': 'Back to top',
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
    'nav.resume': 'Currículo',

    // Hero
    'hero.greeting': 'Olá, eu sou',
    'hero.name': 'João Paulo Santos',
    'hero.title': 'Desenvolvedor Front-End & Engenheiro de Automação QA',
    'hero.tagline': 'Especializado em criar experiências digitais excepcionais. Transformando ideias complexas em código elegante e eficiente.',
    'hero.availability': 'Disponível para Projetos',
    'hero.cta.work': 'Ver Meus Trabalhos',
    'hero.cta.contact': 'Entre em Contato',
    'hero.cta.github': 'Meu GitHub',
    'hero.cta.resume': 'Baixar Currículo',

    // Profile
    'profile.title': 'Meu Perfil',
    'profile.status': 'Disponível para novas oportunidades',
    'profile.contactText': 'LinkedIn',

    // Summary
    'summary.title': 'Sobre Mim',
    'summary.text': 'Estudante de Engenharia de Software apaixonado por desenvolvimento front-end e aplicações de IA. Construo experiências web interativas com React e TypeScript, e exploro projetos criativos de IA incluindo desenvolvimento de jogos e ferramentas estratégicas. Atualmente buscando oportunidades para crescer como desenvolvedor.',

    // Experience
    'experience.title': 'Experiência Profissional',
    'experience.present': 'Presente',

    // Education
    'education.title': 'Formação',
    'education.institution': 'Universidade de Rio Verde',
    'education.degree': 'Engenharia de Software',
    'education.status': '4º Semestre \u2022 Previsão de Conclusão: 2028',

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
    'blog.title': 'Últimos Posts',
    'blog.readMore': 'Leia Mais',
    'blog.allPosts': 'Ver Todos os Posts',
    'blog.subtitle': 'Reflexões sobre desenvolvimento, automação e construção para a web',

    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Algo deu errado',
    'common.backToTop': 'Voltar ao topo',
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
