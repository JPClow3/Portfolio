export const languages = {
  en: 'English',
  pt: 'Português',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    // Navigation
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.process': 'Process',
    'nav.company': 'Company',
    'nav.startProject': 'Start a project',

    // Experience
    'experience.present': 'Present',

    // Projects
    'projects.title': 'Projects & case studies',
    'projects.viewProject': 'View Project',
    'projects.featured': 'Featured',
    'projects.previewAlt': 'preview',
    'projects.emptyTitle': 'No Projects Yet',
    'projects.emptyDesc': 'New case studies are being documented and will appear here soon.',
    // Home
    'home.capabilities': 'Capabilities',
    'home.live': 'Live ↗',
    'home.problem': 'Problem',
    'home.constraint': 'Constraint',
    'home.decision': 'Decision',
    'home.outcome': 'Outcome',
    'project.inDevelopment': 'In development',
    'project.research': 'Research',
    'project.prototype': 'Prototype',
    'project.privateSource': 'Private source',
    'project.archived': 'Archived',
    'project.caseStudy': 'Case Study',
    'project.breadcrumbHome': 'Home',
    'project.backToProjects': 'Back to projects',
    'project.repository': 'Repository',
    'project.live': 'Live product',
    'project.role': 'Role:',
    'project.highlights': 'Highlights',
    'project.decisionLog': 'Decision log',
    'project.metrics': 'Project metrics',
    'palette.trigger': 'Quick navigation',
    'palette.title': 'Quick navigation',
    'palette.placeholder': 'Search pages, projects, and links…',
    'palette.empty': 'No matching command.',
    'palette.hint': 'Navigate with arrows · Open with Enter · Close with Esc',

    // Contact
    'contact.title': 'Start a project',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.placeholderName': 'Your full name',
    'contact.form.company': 'Company',
    'contact.form.optional': '(optional)',
    'contact.form.placeholderCompany': 'Company or institution',
    'contact.form.service': 'What do you need?',
    'contact.form.serviceUnsure': 'Not sure yet',
    'contact.form.unavailable': 'The form is temporarily unavailable. Email joao@jpclow.dev and we will reply with next steps.',
    'contact.form.placeholderEmail': 'you@company.com',
    'contact.form.placeholderMessage': 'What are you building or fixing? Include goals, timeline, and existing systems.',
    'contact.success': 'Thanks — your message is in. We will reply with next steps soon.',
    'contact.error': 'Something went wrong. Please try again or email joao@jpclow.dev directly.',
    'contact.error.network': 'Network error while sending. Please check your connection and try again.',
    'contact.turnstile.required': 'Please complete the security check before sending.',
    'contact.turnstile.failed': 'Security check failed. Please refresh the check and try again.',
    'contact.validation.nameRequired': 'Please enter your name',
    'contact.validation.emailRequired': 'Please enter your email',
    'contact.validation.emailInvalid': 'Please enter a valid email address',
    'contact.validation.messageRequired': 'Please enter a message',
    'contact.validation.messageMin': 'Message should be at least 10 characters',
    'contact.validation.fix': 'Please fix the highlighted fields and try again.',

    // Blog
    'blog.title': 'Engineering notes',
    'blog.readMore': 'Read More',
    'blog.allPosts': 'View All Posts',
    'blog.copyCode': 'Copy',
    'blog.copied': 'Copied!',
    'blog.fallbackNotice': 'This article is currently available only in English.',
    'blog.emptyTitle': 'No Posts Yet',
    'blog.emptyDesc': 'No articles have been published in this language yet. Check back soon.',
    'blog.backToHome': 'Back to Home',
    'blog.updatedAt': 'Updated:',

    // 404 Error
    'error404.title': '404 - Page Not Found',
    'error404.heading': 'Page Not Found',
    'error404.message': 'This page moved or never existed. These are the best places to continue.',
    'error404.backHome': 'Back to Home',

    // 500 Error
    'error500.title': '500 - Server Error',
    'error500.heading': 'Internal Server Error',
    'error500.message': 'Something went wrong on our side. Please reload, or come back in a moment.',
    'error500.backHome': 'Back to Home',
    'error500.reload': 'Reload Page',

    // Footer
    'footer.aboutText': 'Software engineering studio building web platforms, APIs, automation, and data & AI products for companies and institutions.',
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.location': 'Rio Verde, GO · Brazil · Remote worldwide',
    'footer.connect': 'Connect',
    'footer.rights': 'All rights reserved.',

    // Common
    'common.backToTop': 'Back to top',
    'common.copyEmail': 'Copy email address',
    'common.copied': 'Copied',
    'common.skipToContent': 'Skip to main content',
  },
  pt: {
    // Navigation
    'nav.blog': 'Blog',
    'nav.contact': 'Contato',
    'nav.services': 'Serviços',
    'nav.work': 'Cases',
    'nav.process': 'Processo',
    'nav.company': 'Empresa',
    'nav.startProject': 'Iniciar projeto',

    // Experience
    'experience.present': 'Presente',

    // Projects
    'projects.title': 'Projetos e cases',
    'projects.viewProject': 'Ver Projeto',
    'projects.featured': 'Destaque',
    'projects.previewAlt': 'prévia',
    'projects.emptyTitle': 'Nenhum Projeto Ainda',
    'projects.emptyDesc': 'Novos cases estão sendo documentados e aparecerão aqui em breve.',
    // Home
    'home.capabilities': 'Capacidades',
    'home.live': 'Ao vivo ↗',
    'home.problem': 'Problema',
    'home.constraint': 'Restrição',
    'home.decision': 'Decisão',
    'home.outcome': 'Resultado',
    'project.inDevelopment': 'Em desenvolvimento',
    'project.research': 'Pesquisa',
    'project.prototype': 'Protótipo',
    'project.privateSource': 'Código privado',
    'project.archived': 'Arquivado',
    'project.caseStudy': 'Estudo de caso',
    'project.breadcrumbHome': 'Início',
    'project.backToProjects': 'Voltar aos projetos',
    'project.repository': 'Repositório',
    'project.live': 'Produto ao vivo',
    'project.role': 'Papel:',
    'project.highlights': 'Destaques',
    'project.decisionLog': 'Registro de decisões',
    'project.metrics': 'Métricas do projeto',
    'palette.trigger': 'Navegação rápida',
    'palette.title': 'Navegação rápida',
    'palette.placeholder': 'Busque páginas, projetos e links…',
    'palette.empty': 'Nenhum comando encontrado.',
    'palette.hint': 'Navegue com as setas · Abra com Enter · Feche com Esc',

    // Contact
    'contact.title': 'Iniciar um projeto',
    'contact.form.name': 'Nome',
    'contact.form.email': 'Email',
    'contact.form.message': 'Mensagem',
    'contact.form.send': 'Enviar Mensagem',
    'contact.form.sending': 'Enviando...',
    'contact.form.placeholderName': 'Seu nome completo',
    'contact.form.company': 'Empresa',
    'contact.form.optional': '(opcional)',
    'contact.form.placeholderCompany': 'Empresa ou instituição',
    'contact.form.service': 'Do que você precisa?',
    'contact.form.serviceUnsure': 'Ainda não sei',
    'contact.form.unavailable': 'O formulário está temporariamente indisponível. Envie um email para joao@jpclow.dev e responderemos com os próximos passos.',
    'contact.form.placeholderEmail': 'voce@empresa.com',
    'contact.form.placeholderMessage': 'O que você quer construir ou resolver? Inclua objetivos, prazo e sistemas existentes.',
    'contact.success': 'Obrigado — recebemos sua mensagem. Responderemos em breve com os próximos passos.',
    'contact.error': 'Algo deu errado. Tente novamente ou envie um email para joao@jpclow.dev.',
    'contact.error.network': 'Erro de rede ao enviar. Verifique sua conexão e tente novamente.',
    'contact.turnstile.required': 'Conclua a verificação de segurança antes de enviar.',
    'contact.turnstile.failed': 'A verificação de segurança falhou. Atualize a verificação e tente novamente.',
    'contact.validation.nameRequired': 'Por favor, digite seu nome',
    'contact.validation.emailRequired': 'Por favor, digite seu email',
    'contact.validation.emailInvalid': 'Por favor, digite um email válido',
    'contact.validation.messageRequired': 'Por favor, digite uma mensagem',
    'contact.validation.messageMin': 'A mensagem deve ter pelo menos 10 caracteres',
    'contact.validation.fix': 'Corrija os campos destacados e tente novamente.',

    // Blog
    'blog.title': 'Notas de engenharia',
    'blog.readMore': 'Leia Mais',
    'blog.allPosts': 'Ver Todos os Posts',
    'blog.copyCode': 'Copiar',
    'blog.copied': 'Copiado!',
    'blog.fallbackNotice': 'Este artigo está disponível apenas em inglês.',
    'blog.emptyTitle': 'Nenhum Post Ainda',
    'blog.emptyDesc': 'Ainda não há artigos publicados neste idioma. Volte em breve.',
    'blog.backToHome': 'Voltar ao Início',
    'blog.updatedAt': 'Atualizado em:',

    // 404 Error
    'error404.title': '404 - Página Não Encontrada',
    'error404.heading': 'Página Não Encontrada',
    'error404.message': 'Esta página mudou de lugar ou nunca existiu. Estes são os melhores caminhos para continuar.',
    'error404.backHome': 'Voltar ao Início',

    // 500 Error
    'error500.title': '500 - Erro no Servidor',
    'error500.heading': 'Erro Interno do Servidor',
    'error500.message': 'Algo deu errado do nosso lado. Recarregue a página ou volte em instantes.',
    'error500.backHome': 'Voltar ao Início',
    'error500.reload': 'Recarregar Página',

    // Footer
    'footer.aboutText': 'Estúdio de engenharia de software que desenvolve plataformas web, APIs, automação e produtos de dados e IA para empresas e instituições.',
    'footer.services': 'Serviços',
    'footer.company': 'Empresa',
    'footer.location': 'Rio Verde, GO · Brasil · Remoto para o mundo',
    'footer.connect': 'Conectar',
    'footer.rights': 'Todos os direitos reservados.',

    // Common
    'common.backToTop': 'Voltar ao topo',
    'common.copyEmail': 'Copiar endereço de email',
    'common.copied': 'Copiado',
    'common.skipToContent': 'Ir para o conteúdo principal',
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
