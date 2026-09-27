import type { Lang } from '@/lib/i18n';
import type { IconName } from '@/components/common/icon-names';

/**
 * Company (B2B) copy for the JPCLOW studio pages.
 * Structured content lives here instead of flat i18n keys so sections can map over it.
 * Project references use content-collection slugs; case study URLs are built from them.
 */

export interface ProjectRef {
  slug: string;
  title: string;
}

const PROJECTS = {
  motoTrack: { slug: 'moto-track', title: 'Moto Track' },
  agrohub: { slug: 'agrohub', title: 'AgroHub UniRV' },
  inova: { slug: 'inova-rio-verde', title: 'Inova Rio Verde' },
  lorebound: { slug: 'lorebound', title: 'Lorebound' },
  climagro: { slug: 'climagro', title: 'ClimAgro' },
  throughline: { slug: 'throughline', title: 'Throughline' },
  dbs: { slug: 'dbs-telecom', title: 'DBS Telecom' },
  farmFin: { slug: 'farm-fin', title: 'Farm-Fin' },
  fatec: { slug: 'fatec', title: 'FATEC' },
  hefesto: { slug: 'hefesto', title: 'Hefesto' },
  signalLedger: { slug: 'signal-ledger', title: 'Signal Ledger' },
} as const satisfies Record<string, ProjectRef>;

export interface Service {
  id: string;
  icon: IconName;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  stack: string[];
  proof: ProjectRef[];
}

export interface ProcessStep {
  title: string;
  duration: string;
  description: string;
  outputs: string[];
}

export interface Standard {
  icon: IconName;
  title: string;
  description: string;
}

export interface Sector {
  title: string;
  description: string;
  proof: ProjectRef[];
}

export interface EngagementModel {
  title: string;
  bestFor: string;
  description: string;
  points: string[];
  featured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Principle {
  title: string;
  description: string;
}

export interface StudioCopy {
  brand: { name: string; descriptor: string; location: string };
  hero: {
    eyebrow: string;
    lines: [string, string, string];
    lead: string;
    founderAttribution: string;
    primaryCta: string;
    secondaryCta: string;
    scrollHint: string;
    stats: { live: string; cases: string; languages: string; timezone: string };
  };
  marquee: { label: string; words: string[] };
  sections: {
    services: { eyebrow: string; title: string; lead: string; cta: string };
    work: { eyebrow: string; title: string; lead: string; cta: string };
    process: { eyebrow: string; title: string; lead: string };
    engineering: { eyebrow: string; title: string; lead: string };
    sectors: { eyebrow: string; title: string; lead: string };
    engagement: { eyebrow: string; title: string; lead: string; cta: string };
    faq: { eyebrow: string; title: string };
    cta: { eyebrow: string; title: string; lead: string; primary: string; secondary: string };
  };
  labels: {
    deliverables: string;
    stack: string;
    provenIn: string;
    outputs: string;
    bestFor: string;
    recommended: string;
    layers: string;
    learnMore: string;
    viewCase: string;
    sector: string;
    step: string;
  };
  services: Service[];
  process: ProcessStep[];
  standards: Standard[];
  architecture: { layer: string; items: string[] }[];
  sectors: Sector[];
  engagement: EngagementModel[];
  faq: FaqItem[];
  about: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    storyTitle: string;
    story: string[];
    principlesTitle: string;
    principles: Principle[];
    founderEyebrow: string;
    founderRole: string;
    founderBio: string;
    backgroundTitle: string;
  };
  servicesPage: { heroEyebrow: string; heroTitle: string; heroLead: string };
  contactPage: {
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    nextTitle: string;
    next: { title: string; description: string }[];
    directTitle: string;
    formTitle: string;
  };
}

const en: StudioCopy = {
  brand: {
    name: 'JPCLOW',
    descriptor: 'Software engineering studio',
    location: 'Rio Verde, GO · Brazil',
  },
  hero: {
    eyebrow: 'Software engineering studio · Brazil → Worldwide',
    lines: ['We build the', 'software your', 'operation runs on.'],
    lead: 'Custom web platforms, APIs, workflow automation, and data & AI products — designed, engineered, and shipped end to end, from discovery to production.',
    founderAttribution: 'Founded by João Paulo Santos',
    primaryCta: 'Start a project',
    secondaryCta: 'See our work',
    scrollHint: 'Scroll',
    stats: {
      live: 'Live platforms and products',
      cases: 'Project write-ups',
      languages: 'Bilingual delivery',
      timezone: 'Overlap with US & EU hours',
    },
  },
  marquee: {
    label: 'Capabilities',
    words: ['Web platforms', 'APIs', 'Automation', 'Data', 'Geospatial', 'Applied AI', 'Cloud', 'DevOps'],
  },
  sections: {
    services: {
      eyebrow: 'Services',
      title: 'Engineering for the systems that matter to your business.',
      lead: 'One team from architecture to deployment. We take on the hard parts — data models, integrations, reliability — so your product ships and keeps working.',
      cta: 'Explore services',
    },
    work: {
      eyebrow: 'Selected work',
      title: 'Software built for real operations.',
      lead: 'Platforms for agribusiness, education, innovation ecosystems, and operations teams — each with a documented problem, decision, and outcome.',
      cta: 'Explore all projects',
    },
    process: {
      eyebrow: 'Process',
      title: 'A delivery process you can see every week.',
      lead: 'No black boxes. Scope is explicit, decisions are written down, and working software lands on a staging URL from the first sprint.',
    },
    engineering: {
      eyebrow: 'Under the hood',
      title: 'Engineering standards, not afterthoughts.',
      lead: 'The quality bar that ships with every project — the same one this website is built on.',
    },
    sectors: {
      eyebrow: 'Sectors',
      title: 'Domains we already know.',
      lead: 'Context shortens projects. These are the domains we have built for — live platforms, research, and prototypes, each with its status stated on the case study.',
    },
    engagement: {
      eyebrow: 'Engagement',
      title: 'Pick the model that fits the stage you are in.',
      lead: 'Every engagement starts with a short discovery call and a written proposal.',
      cta: 'Discuss this model',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions companies usually ask.',
    },
    cta: {
      eyebrow: 'Next step',
      title: 'Have a system to build or a process to fix?',
      lead: 'Tell us about the problem. You get a first technical read, a suggested path, and next steps.',
      primary: 'Start a project',
      secondary: 'Email us',
    },
  },
  labels: {
    deliverables: 'Deliverables',
    stack: 'Stack',
    provenIn: 'Related work',
    outputs: 'Outputs',
    bestFor: 'Best for',
    recommended: 'Recommended',
    layers: 'Reference architecture',
    learnMore: 'Learn more',
    viewCase: 'View case study',
    sector: 'Sector',
    step: 'Step',
  },
  services: [
    {
      id: 'platforms',
      icon: 'layers',
      title: 'Custom web platforms',
      summary: 'SaaS products, portals, and internal tools built for real operational load.',
      description: 'From multi-tenant SaaS to institutional portals and back-office tools: fast, accessible, maintainable web platforms with a data model designed for how your business actually works.',
      deliverables: ['SaaS & multi-tenant apps', 'Institutional portals', 'Internal tools & back-offices', 'PWAs with offline support'],
      stack: ['Django', 'SvelteKit', 'React', 'Astro', 'Tailwind CSS'],
      proof: [PROJECTS.motoTrack, PROJECTS.agrohub, PROJECTS.fatec],
    },
    {
      id: 'apis',
      icon: 'plug',
      title: 'APIs & integrations',
      summary: 'Clean contracts between your systems, with guarded failure modes.',
      description: 'REST APIs, backends-for-frontends, webhooks, and integrations with payment and business systems — with authentication, rate limiting, and audit trails designed in from the start.',
      deliverables: ['REST APIs & BFFs', 'Payment & business-system integrations', 'Webhooks & event pipelines', 'Auth, rate limiting, audit trails'],
      stack: ['TypeScript', 'Python', 'Cloudflare Workers', 'Stripe', 'Supabase'],
      proof: [PROJECTS.motoTrack, PROJECTS.fatec, PROJECTS.dbs],
    },
    {
      id: 'automation',
      icon: 'workflow',
      title: 'Workflow automation',
      summary: 'Replace spreadsheets and manual hand-offs with pipelines that run themselves.',
      description: 'We map the manual process, then replace it with scheduled jobs, validated imports, and reporting that is generated instead of assembled — so your team stops copy-pasting between systems.',
      deliverables: ['Process automation', 'Scheduled jobs & ETL', 'Reporting & reconciliation workflows', 'Notifications & alerts'],
      stack: ['Python', 'Django', 'PostgreSQL', 'Celery', 'HTMX'],
      proof: [PROJECTS.fatec, PROJECTS.climagro, PROJECTS.farmFin],
    },
    {
      id: 'data',
      icon: 'database',
      title: 'Data, geospatial & ML',
      summary: 'Turn weather, map, and operational data into decisions.',
      description: 'Geospatial applications, risk and forecasting models, and dashboards grounded in your domain — built on reliable pipelines instead of one-off notebooks.',
      deliverables: ['Geospatial apps (Mapbox, deck.gl)', 'Forecasting & risk models', 'Dashboards & KPIs', 'Data pipelines on Postgres'],
      stack: ['Python', 'XGBoost', 'deck.gl', 'MapTiler', 'Neon Postgres'],
      proof: [PROJECTS.climagro, PROJECTS.inova, PROJECTS.hefesto],
    },
    {
      id: 'ai',
      icon: 'sparkles',
      title: 'Applied AI',
      summary: 'LLM features that improve a real task — not a generic chatbot.',
      description: 'AI features with retrieval, memory, usage metering, and fallbacks. We design for cost, evidence, and failure from day one, so the feature is still useful when a model or source misbehaves.',
      deliverables: ['LLM features & agents', 'Source-grounded retrieval', 'Usage metering & cost controls', 'Evaluation & guardrails'],
      stack: ['TypeScript', 'Gemini', 'Cloudflare AI', 'Supabase', 'pgvector'],
      proof: [PROJECTS.lorebound, PROJECTS.signalLedger],
    },
    {
      id: 'cloud',
      icon: 'cloud',
      title: 'Cloud, DevOps & reliability',
      summary: 'Edge-first deploys, containers, CI, and observability from day one.',
      description: 'Infrastructure sized for your product: Cloudflare at the edge, containers on Docker Swarm, automated tests in CI, and monitoring so problems surface before your customers notice.',
      deliverables: ['Cloudflare Workers & Pages', 'Docker Swarm & Portainer', 'CI/CD with automated tests', 'Monitoring with Sentry'],
      stack: ['Cloudflare', 'Docker', 'GitHub Actions', 'Playwright', 'Sentry'],
      proof: [PROJECTS.inova, PROJECTS.agrohub],
    },
  ],
  process: [
    {
      title: 'Discovery & scope',
      duration: '1–2 weeks',
      description: 'We map the operation, the users, and the constraints, then turn them into a scoped plan with priorities, risks, and a clear first milestone.',
      outputs: ['Technical scope', 'Risk map', 'Milestone plan'],
    },
    {
      title: 'Architecture & design',
      duration: '1–2 weeks',
      description: 'Data model, integrations, and interface flows are designed before the build, so there are no expensive surprises halfway through.',
      outputs: ['Data model', 'UX flows', 'Decision log'],
    },
    {
      title: 'Build in sprints',
      duration: 'Weekly cadence',
      description: 'Weekly increments on a live staging environment. You review working software every week, not status slides.',
      outputs: ['Staging URL', 'Weekly demos', 'Automated tests'],
    },
    {
      title: 'Launch & evolve',
      duration: 'Ongoing',
      description: 'Production release with monitoring and documentation, then either a clean hand-off to your team or continuous evolution with us.',
      outputs: ['Production release', 'Runbooks', 'Support plan'],
    },
  ],
  standards: [
    { icon: 'code', title: 'Type-safe end to end', description: 'Strict TypeScript and validated boundaries between client, API, and database.' },
    { icon: 'gauge', title: 'Performance budgets', description: 'Static and edge-first delivery with Core Web Vitals tracked in production.' },
    { icon: 'accessibility', title: 'Accessible by default', description: 'WCAG 2.1 AA as the target: keyboard paths, contrast, and reduced-motion support.' },
    { icon: 'activity', title: 'Observable in production', description: 'Error tracking, structured logs, and real-user metrics from the first deploy.' },
    { icon: 'check', title: 'Tested pipelines', description: 'Unit and end-to-end tests run in CI before anything reaches production.' },
    { icon: 'shield', title: 'Secure by design', description: 'Least privilege, bot protection, and encryption where user trust depends on it.' },
  ],
  architecture: [
    { layer: 'Interface', items: ['Astro', 'SvelteKit', 'React', 'HTMX', 'Tailwind'] },
    { layer: 'Application', items: ['Django', 'Workers', 'REST / BFF', 'Queues'] },
    { layer: 'Data', items: ['Postgres', 'Neon', 'Supabase', 'IndexedDB'] },
    { layer: 'Infrastructure', items: ['Cloudflare', 'Docker Swarm', 'CI/CD', 'Sentry'] },
  ],
  sectors: [
    {
      title: 'Agribusiness & climate',
      description: 'Agronomy, farm finance, and climate-risk platforms that turn field and weather data into decisions.',
      proof: [PROJECTS.climagro, PROJECTS.farmFin, PROJECTS.hefesto],
    },
    {
      title: 'Innovation & education',
      description: 'Portals and ecosystems for universities, incubators, and public innovation programs.',
      proof: [PROJECTS.agrohub, PROJECTS.inova, PROJECTS.fatec],
    },
    {
      title: 'Operations & services',
      description: 'Software for individual riders and field work, plus a customer self-service prototype for service companies.',
      proof: [PROJECTS.motoTrack, PROJECTS.dbs],
    },
    {
      title: 'Digital products & AI',
      description: 'Consumer products with privacy, offline capability, and AI at the core.',
      proof: [PROJECTS.throughline, PROJECTS.lorebound, PROJECTS.signalLedger],
    },
  ],
  engagement: [
    {
      title: 'Scoped project',
      bestFor: 'New products, portals, and MVPs',
      description: 'A defined scope delivered in milestones, with discovery included and a complete hand-off at the end.',
      points: ['Discovery included', 'Milestone-based delivery', 'Source code & documentation hand-off'],
    },
    {
      title: 'Product partnership',
      bestFor: 'Products that keep evolving',
      description: 'Dedicated monthly capacity to build and evolve your product continuously, with a shared roadmap.',
      points: ['Weekly delivery cadence', 'Shared roadmap ownership', 'Priority support'],
      featured: true,
    },
    {
      title: 'Technical consulting',
      bestFor: 'Existing systems that need a plan',
      description: 'Architecture reviews, audits, and recovery of stalled projects, ending in an actionable plan.',
      points: ['Code & architecture audit', 'Performance & accessibility review', 'Prioritized remediation plan'],
    },
  ],
  faq: [
    {
      question: 'How big is the team?',
      answer: 'JPCLOW is founder-led by João Paulo Santos. When a project needs additional expertise, independent specialists can be brought in for a defined scope.',
    },
    {
      question: 'What kinds of companies do you work with?',
      answer: 'Startups validating a product, established companies modernizing internal processes, and institutions that need reliable public-facing platforms — in Brazil and abroad.',
    },
    {
      question: 'How does a project start?',
      answer: 'With a short discovery call. Then you receive a written proposal with scope, milestones, timeline, and a clearly defined first deliverable.',
    },
    {
      question: 'Can you take over an existing system?',
      answer: 'Yes. We start with a technical audit, stabilize the critical paths, and then evolve the product incrementally instead of proposing a rewrite by default.',
    },
    {
      question: 'Which technologies do you use?',
      answer: 'We choose per problem. Our defaults are TypeScript, Python and Django, SvelteKit, React, Astro, PostgreSQL, and Cloudflare.',
    },
    {
      question: 'Do you work remotely and in English?',
      answer: 'Yes. We are remote-first from Brazil (UTC−3) and work in English and Portuguese, with working-hour overlap for teams in the Americas and Europe.',
    },
    {
      question: 'How do I request a proposal?',
      answer: 'Use the contact form or email joao@jpclow.dev with a short description of the problem, your timeline, and any existing systems involved.',
    },
  ],
  about: {
    heroEyebrow: 'Company',
    heroTitle: 'An engineering studio built on shipping.',
    heroLead: 'JPCLOW designs and builds production software for companies and institutions — with the rigor of an engineering team and the focus of a small studio.',
    storyTitle: 'Where we come from',
    story: [
      'JPCLOW was founded by João Paulo Santos after years of working inside the operations it now builds software for: ERP support, industrial planning and maintenance, commodity logistics, and university innovation programs.',
      'That background shapes how we work. We start from the operation — the people, the data, and the constraints — and only then choose the technology. The result is software that fits the business instead of forcing the business to fit the software.',
    ],
    principlesTitle: 'How we work',
    principles: [
      { title: 'Production early', description: 'Working software on a real URL from the first sprint. Feedback beats speculation.' },
      { title: 'Decisions in writing', description: 'Every relevant trade-off is recorded, so your team understands why the system looks the way it does.' },
      { title: 'Boring where it matters', description: 'Proven tools for the core, innovation only where it creates a real advantage.' },
      { title: 'Quality is a feature', description: 'Performance, accessibility, and observability are part of the scope, not extras.' },
    ],
    founderEyebrow: 'Founder',
    founderRole: 'Founder & Principal Engineer',
    founderBio: 'Full-stack product engineer working across TypeScript, Python, and Cloudflare. Leads architecture and delivery on every JPCLOW project.',
    backgroundTitle: 'Operational background',
  },
  servicesPage: {
    heroEyebrow: 'Services',
    heroTitle: 'From first diagram to production traffic.',
    heroLead: 'Six capabilities, one accountable team. Engage us for a single piece or for the whole system.',
  },
  contactPage: {
    heroEyebrow: 'Contact',
    heroTitle: "Let's talk about what you need to build.",
    heroLead: 'Share the problem, the timeline, and the systems involved. We reply with a first technical read and next steps.',
    nextTitle: 'What happens next',
    next: [
      { title: 'We read and reply', description: 'You get an answer with questions, a first technical read, and availability.' },
      { title: 'Discovery call', description: 'A focused conversation about goals, users, constraints, and existing systems.' },
      { title: 'Written proposal', description: 'Scope, milestones, timeline, and the engagement model that fits.' },
    ],
    directTitle: 'Prefer direct contact?',
    formTitle: 'Project inquiry',
  },
};

const pt: StudioCopy = {
  brand: {
    name: 'JPCLOW',
    descriptor: 'Estúdio de engenharia de software',
    location: 'Rio Verde, GO · Brasil',
  },
  hero: {
    eyebrow: 'Estúdio de engenharia de software · Brasil → Mundo',
    lines: ['Construímos o', 'software que faz', 'sua operação rodar.'],
    lead: 'Plataformas web sob medida, APIs, automação de processos e produtos de dados e IA — projetados, desenvolvidos e colocados em produção de ponta a ponta, da descoberta ao deploy.',
    founderAttribution: 'Fundada por João Paulo Santos',
    primaryCta: 'Iniciar um projeto',
    secondaryCta: 'Ver cases',
    scrollHint: 'Role',
    stats: {
      live: 'Plataformas e produtos no ar',
      cases: 'Relatos de projetos',
      languages: 'Entrega bilíngue',
      timezone: 'Sobreposição com EUA e Europa',
    },
  },
  marquee: {
    label: 'Capacidades',
    words: ['Plataformas web', 'APIs', 'Automação', 'Dados', 'Geoespacial', 'IA aplicada', 'Cloud', 'DevOps'],
  },
  sections: {
    services: {
      eyebrow: 'Serviços',
      title: 'Engenharia para os sistemas que importam para o seu negócio.',
      lead: 'Um time da arquitetura ao deploy. Assumimos as partes difíceis — modelagem de dados, integrações, confiabilidade — para que seu produto seja entregue e continue funcionando.',
      cta: 'Ver serviços',
    },
    work: {
      eyebrow: 'Cases',
      title: 'Software feito para operações reais.',
      lead: 'Plataformas para agronegócio, educação, ecossistemas de inovação e operações — cada uma com problema, decisão e resultado documentados.',
      cta: 'Explorar todos os projetos',
    },
    process: {
      eyebrow: 'Processo',
      title: 'Um processo de entrega que você acompanha toda semana.',
      lead: 'Sem caixa-preta. O escopo é explícito, as decisões ficam registradas e software funcionando chega a uma URL de homologação desde o primeiro sprint.',
    },
    engineering: {
      eyebrow: 'Por dentro',
      title: 'Padrões de engenharia, não detalhes de última hora.',
      lead: 'O nível de qualidade que acompanha cada projeto — o mesmo sobre o qual este site foi construído.',
    },
    sectors: {
      eyebrow: 'Setores',
      title: 'Domínios que já conhecemos.',
      lead: 'Contexto encurta projetos. Estes são os domínios para os quais já construímos — plataformas no ar, pesquisa e protótipos, cada um com o status indicado no case.',
    },
    engagement: {
      eyebrow: 'Modelos de contratação',
      title: 'Escolha o modelo que combina com o seu momento.',
      lead: 'Toda contratação começa com uma conversa de descoberta e uma proposta por escrito.',
      cta: 'Conversar sobre este modelo',
    },
    faq: {
      eyebrow: 'Perguntas frequentes',
      title: 'O que as empresas costumam perguntar.',
    },
    cta: {
      eyebrow: 'Próximo passo',
      title: 'Tem um sistema para construir ou um processo para resolver?',
      lead: 'Conte qual é o problema. Você recebe uma primeira leitura técnica, um caminho sugerido e os próximos passos.',
      primary: 'Iniciar um projeto',
      secondary: 'Enviar email',
    },
  },
  labels: {
    deliverables: 'Entregáveis',
    stack: 'Stack',
    provenIn: 'Trabalhos relacionados',
    outputs: 'Entregas',
    bestFor: 'Ideal para',
    recommended: 'Recomendado',
    layers: 'Arquitetura de referência',
    learnMore: 'Saiba mais',
    viewCase: 'Ver estudo de caso',
    sector: 'Setor',
    step: 'Etapa',
  },
  services: [
    {
      id: 'platforms',
      icon: 'layers',
      title: 'Plataformas web sob medida',
      summary: 'Produtos SaaS, portais e ferramentas internas feitos para carga operacional real.',
      description: 'De SaaS multi-tenant a portais institucionais e back-offices: plataformas web rápidas, acessíveis e fáceis de manter, com um modelo de dados desenhado para o jeito que o seu negócio realmente funciona.',
      deliverables: ['SaaS e apps multi-tenant', 'Portais institucionais', 'Ferramentas internas e back-offices', 'PWAs com suporte offline'],
      stack: ['Django', 'SvelteKit', 'React', 'Astro', 'Tailwind CSS'],
      proof: [PROJECTS.motoTrack, PROJECTS.agrohub, PROJECTS.fatec],
    },
    {
      id: 'apis',
      icon: 'plug',
      title: 'APIs e integrações',
      summary: 'Contratos limpos entre seus sistemas, com falhas tratadas.',
      description: 'APIs REST, backends-for-frontends, webhooks e integrações com meios de pagamento e sistemas de gestão — com autenticação, limite de requisições e trilhas de auditoria desde o início.',
      deliverables: ['APIs REST e BFFs', 'Integrações com pagamentos e sistemas de gestão', 'Webhooks e pipelines de eventos', 'Autenticação, rate limiting e auditoria'],
      stack: ['TypeScript', 'Python', 'Cloudflare Workers', 'Stripe', 'Supabase'],
      proof: [PROJECTS.motoTrack, PROJECTS.fatec, PROJECTS.dbs],
    },
    {
      id: 'automation',
      icon: 'workflow',
      title: 'Automação de processos',
      summary: 'Troque planilhas e repasses manuais por pipelines que rodam sozinhos.',
      description: 'Mapeamos o processo manual e o substituímos por rotinas agendadas, importações validadas e relatórios gerados automaticamente — para sua equipe parar de copiar e colar entre sistemas.',
      deliverables: ['Automação de processos', 'Rotinas agendadas e ETL', 'Fluxos de relatórios e conciliação', 'Notificações e alertas'],
      stack: ['Python', 'Django', 'PostgreSQL', 'Celery', 'HTMX'],
      proof: [PROJECTS.fatec, PROJECTS.climagro, PROJECTS.farmFin],
    },
    {
      id: 'data',
      icon: 'database',
      title: 'Dados, geoespacial e ML',
      summary: 'Transforme dados climáticos, geográficos e operacionais em decisões.',
      description: 'Aplicações geoespaciais, modelos de risco e previsão e dashboards alinhados ao seu domínio — sobre pipelines confiáveis, não notebooks avulsos.',
      deliverables: ['Apps geoespaciais (Mapbox, deck.gl)', 'Modelos de previsão e risco', 'Dashboards e KPIs', 'Pipelines de dados em Postgres'],
      stack: ['Python', 'XGBoost', 'deck.gl', 'MapTiler', 'Neon Postgres'],
      proof: [PROJECTS.climagro, PROJECTS.inova, PROJECTS.hefesto],
    },
    {
      id: 'ai',
      icon: 'sparkles',
      title: 'IA aplicada',
      summary: 'Recursos com LLM que melhoram uma tarefa real — não um chatbot genérico.',
      description: 'Funcionalidades de IA com recuperação de fontes, memória, medição de uso e planos de contingência. Projetamos para custo, evidência e falha desde o primeiro dia.',
      deliverables: ['Recursos com LLM e agentes', 'Recuperação com fontes verificáveis', 'Medição de uso e controle de custos', 'Avaliação e guardrails'],
      stack: ['TypeScript', 'Gemini', 'Cloudflare AI', 'Supabase', 'pgvector'],
      proof: [PROJECTS.lorebound, PROJECTS.signalLedger],
    },
    {
      id: 'cloud',
      icon: 'cloud',
      title: 'Cloud, DevOps e confiabilidade',
      summary: 'Deploy na borda, containers, CI e observabilidade desde o início.',
      description: 'Infraestrutura dimensionada para o seu produto: Cloudflare na borda, containers com Docker Swarm, testes automatizados no CI e monitoramento para que problemas apareçam antes de chegar aos seus clientes.',
      deliverables: ['Cloudflare Workers e Pages', 'Docker Swarm e Portainer', 'CI/CD com testes automatizados', 'Monitoramento com Sentry'],
      stack: ['Cloudflare', 'Docker', 'GitHub Actions', 'Playwright', 'Sentry'],
      proof: [PROJECTS.inova, PROJECTS.agrohub],
    },
  ],
  process: [
    {
      title: 'Descoberta e escopo',
      duration: '1–2 semanas',
      description: 'Mapeamos a operação, os usuários e as restrições e transformamos tudo em um plano com prioridades, riscos e um primeiro marco claro.',
      outputs: ['Escopo técnico', 'Mapa de riscos', 'Plano de marcos'],
    },
    {
      title: 'Arquitetura e design',
      duration: '1–2 semanas',
      description: 'Modelo de dados, integrações e fluxos de interface são desenhados antes da construção, sem surpresas caras no meio do caminho.',
      outputs: ['Modelo de dados', 'Fluxos de UX', 'Registro de decisões'],
    },
    {
      title: 'Construção em sprints',
      duration: 'Cadência semanal',
      description: 'Incrementos semanais em um ambiente de homologação. Você avalia software funcionando toda semana, não slides de status.',
      outputs: ['URL de homologação', 'Demos semanais', 'Testes automatizados'],
    },
    {
      title: 'Lançamento e evolução',
      duration: 'Contínuo',
      description: 'Publicação em produção com monitoramento e documentação, seguida de uma passagem organizada para o seu time ou evolução contínua conosco.',
      outputs: ['Release em produção', 'Runbooks', 'Plano de suporte'],
    },
  ],
  standards: [
    { icon: 'code', title: 'Tipagem de ponta a ponta', description: 'TypeScript estrito e fronteiras validadas entre cliente, API e banco de dados.' },
    { icon: 'gauge', title: 'Orçamento de performance', description: 'Entrega estática e na borda, com Core Web Vitals medidos em produção.' },
    { icon: 'accessibility', title: 'Acessível por padrão', description: 'WCAG 2.1 AA como meta: navegação por teclado, contraste e suporte a movimento reduzido.' },
    { icon: 'activity', title: 'Observável em produção', description: 'Rastreamento de erros, logs estruturados e métricas de usuários reais desde o primeiro deploy.' },
    { icon: 'check', title: 'Pipelines testados', description: 'Testes unitários e end-to-end rodam no CI antes de qualquer coisa chegar à produção.' },
    { icon: 'shield', title: 'Seguro desde o projeto', description: 'Menor privilégio, proteção contra bots e criptografia onde a confiança do usuário depende disso.' },
  ],
  architecture: [
    { layer: 'Interface', items: ['Astro', 'SvelteKit', 'React', 'HTMX', 'Tailwind'] },
    { layer: 'Aplicação', items: ['Django', 'Workers', 'REST / BFF', 'Filas'] },
    { layer: 'Dados', items: ['Postgres', 'Neon', 'Supabase', 'IndexedDB'] },
    { layer: 'Infraestrutura', items: ['Cloudflare', 'Docker Swarm', 'CI/CD', 'Sentry'] },
  ],
  sectors: [
    {
      title: 'Agronegócio e clima',
      description: 'Plataformas de agronomia, gestão financeira rural e risco climático que transformam dados de campo e clima em decisões.',
      proof: [PROJECTS.climagro, PROJECTS.farmFin, PROJECTS.hefesto],
    },
    {
      title: 'Inovação e educação',
      description: 'Portais e ecossistemas para universidades, incubadoras e programas públicos de inovação.',
      proof: [PROJECTS.agrohub, PROJECTS.inova, PROJECTS.fatec],
    },
    {
      title: 'Operações e serviços',
      description: 'Software para motociclistas e trabalho de campo, além de um protótipo de autoatendimento para empresas de serviços.',
      proof: [PROJECTS.motoTrack, PROJECTS.dbs],
    },
    {
      title: 'Produtos digitais e IA',
      description: 'Produtos para o consumidor com privacidade, funcionamento offline e IA no centro.',
      proof: [PROJECTS.throughline, PROJECTS.lorebound, PROJECTS.signalLedger],
    },
  ],
  engagement: [
    {
      title: 'Projeto fechado',
      bestFor: 'Novos produtos, portais e MVPs',
      description: 'Escopo definido entregue em marcos, com descoberta incluída e passagem completa ao final.',
      points: ['Descoberta incluída', 'Entrega por marcos', 'Código-fonte e documentação entregues'],
    },
    {
      title: 'Parceria de produto',
      bestFor: 'Produtos em evolução contínua',
      description: 'Capacidade mensal dedicada para construir e evoluir seu produto continuamente, com roadmap compartilhado.',
      points: ['Cadência semanal de entregas', 'Roadmap compartilhado', 'Suporte prioritário'],
      featured: true,
    },
    {
      title: 'Consultoria técnica',
      bestFor: 'Sistemas existentes que precisam de um plano',
      description: 'Revisões de arquitetura, auditorias e recuperação de projetos travados, terminando em um plano de ação.',
      points: ['Auditoria de código e arquitetura', 'Revisão de performance e acessibilidade', 'Plano de correção priorizado'],
    },
  ],
  faq: [
    {
      question: 'Qual é o tamanho da equipe?',
      answer: 'A JPCLOW é liderada pelo fundador João Paulo Santos. Quando o projeto precisa de conhecimentos adicionais, especialistas independentes podem participar com escopo definido.',
    },
    {
      question: 'Com que tipo de empresa vocês trabalham?',
      answer: 'Startups validando um produto, empresas estabelecidas modernizando processos internos e instituições que precisam de plataformas públicas confiáveis — no Brasil e no exterior.',
    },
    {
      question: 'Como um projeto começa?',
      answer: 'Com uma conversa rápida de descoberta. Depois você recebe uma proposta por escrito com escopo, marcos, prazo e uma primeira entrega bem definida.',
    },
    {
      question: 'Vocês assumem um sistema que já existe?',
      answer: 'Sim. Começamos com uma auditoria técnica, estabilizamos os pontos críticos e evoluímos o produto de forma incremental, sem propor reescrita por padrão.',
    },
    {
      question: 'Quais tecnologias vocês usam?',
      answer: 'Escolhemos conforme o problema. Nosso padrão é TypeScript, Python e Django, SvelteKit, React, Astro, PostgreSQL e Cloudflare.',
    },
    {
      question: 'Vocês trabalham remotamente e em inglês?',
      answer: 'Sim. Somos remote-first a partir do Brasil (UTC−3) e trabalhamos em português e inglês, com sobreposição de horário para times nas Américas e na Europa.',
    },
    {
      question: 'Como solicito uma proposta?',
      answer: 'Use o formulário de contato ou envie um email para joao@jpclow.dev com uma breve descrição do problema, o prazo e os sistemas envolvidos.',
    },
  ],
  about: {
    heroEyebrow: 'Empresa',
    heroTitle: 'Um estúdio de engenharia feito para entregar.',
    heroLead: 'A JPCLOW projeta e constrói software de produção para empresas e instituições — com o rigor de um time de engenharia e o foco de um estúdio enxuto.',
    storyTitle: 'De onde viemos',
    story: [
      'A JPCLOW foi fundada por João Paulo Santos depois de anos trabalhando dentro das operações para as quais hoje desenvolve software: suporte a ERP, planejamento e manutenção industrial, logística de commodities e programas de inovação universitária.',
      'Essa trajetória define o nosso jeito de trabalhar. Começamos pela operação — pessoas, dados e restrições — e só então escolhemos a tecnologia. O resultado é software que se encaixa no negócio, e não o contrário.',
    ],
    principlesTitle: 'Como trabalhamos',
    principles: [
      { title: 'Produção desde cedo', description: 'Software funcionando em uma URL real desde o primeiro sprint. Feedback vale mais que especulação.' },
      { title: 'Decisões por escrito', description: 'Cada trade-off relevante fica registrado, para o seu time entender por que o sistema é como é.' },
      { title: 'Simples onde importa', description: 'Ferramentas comprovadas no núcleo, inovação só onde gera vantagem real.' },
      { title: 'Qualidade é funcionalidade', description: 'Performance, acessibilidade e observabilidade fazem parte do escopo, não são extras.' },
    ],
    founderEyebrow: 'Fundador',
    founderRole: 'Fundador e Engenheiro Principal',
    founderBio: 'Engenheiro de produto full stack que trabalha com TypeScript, Python e Cloudflare. Lidera a arquitetura e a entrega em todos os projetos da JPCLOW.',
    backgroundTitle: 'Trajetória operacional',
  },
  servicesPage: {
    heroEyebrow: 'Serviços',
    heroTitle: 'Do primeiro diagrama ao tráfego em produção.',
    heroLead: 'Seis capacidades, um time responsável. Contrate uma parte ou o sistema completo.',
  },
  contactPage: {
    heroEyebrow: 'Contato',
    heroTitle: 'Vamos conversar sobre o que você precisa construir.',
    heroLead: 'Conte o problema, o prazo e os sistemas envolvidos. Respondemos com uma primeira leitura técnica e os próximos passos.',
    nextTitle: 'O que acontece depois',
    next: [
      { title: 'Lemos e respondemos', description: 'Você recebe uma resposta com perguntas, uma primeira leitura técnica e disponibilidade.' },
      { title: 'Conversa de descoberta', description: 'Uma conversa objetiva sobre metas, usuários, restrições e sistemas existentes.' },
      { title: 'Proposta por escrito', description: 'Escopo, marcos, prazo e o modelo de contratação mais adequado.' },
    ],
    directTitle: 'Prefere contato direto?',
    formTitle: 'Solicitação de projeto',
  },
};

const STUDIO: Record<Lang, StudioCopy> = { en, pt };

export function getStudioCopy(lang: Lang): StudioCopy {
  return STUDIO[lang] ?? STUDIO.en;
}

export function projectHref(slug: string, lang: Lang): string {
  return `${lang === 'pt' ? '/pt' : ''}/projects/${slug}/`;
}

export function localePath(path: string, lang: Lang): string {
  return `${lang === 'pt' ? '/pt' : ''}${path}`;
}
