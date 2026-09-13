---
title: "Plataforma Digital FATEC"
slug: "fatec"
description: "Uma plataforma educacional em produção que reúne conteúdo institucional, inscrições, concursos, administração de candidatos e acesso direto ao boleto."
tech: ["Python", "Django", "HTMX", "Alpine.js", "Tailwind CSS", "PostgreSQL", "Banco do Brasil"]
link: "https://www.fateccacu.edu.br/"
featured: true
order: 4
lang: "pt"
caseStudy: true
status: "private-source"
role: "Engenharia de produto freelance — descoberta, design, implementação full-stack e operação"
year: "2026"
decisionLog:
  problem: "Publicação institucional, inscrições, concursos, suporte a candidatos e pagamentos estavam distribuídos entre processos manuais e páginas desconectadas."
  constraint: "O sistema trata dados pessoais e financeiros, múltiplas instituições, editais com prazo e equipes administrativas não técnicas, mantendo o código do cliente confidencial."
  decision: "Construí uma plataforma Django renderizada no servidor, com interações pontuais em HTMX e Alpine.js, administração orientada a tarefas com Unfold, mídia privada e integração à API Cobranças do Banco do Brasil."
  outcome: "Candidatos fazem a inscrição e acessam o boleto diretamente no produto, enquanto a equipe gerencia editais, documentos, estados e conciliação em um único sistema operacional."
metrics:
  - label: "Jornada do candidato"
    value: "Inscrição → boleto no produto"
  - label: "Superfícies operacionais"
    value: "Site · área do candidato · admin"
  - label: "Caminho de pagamento"
    value: "Cobranças Banco do Brasil"
highlights:
  - "Editais, cargos, inscrições, documentos e situação do candidato no mesmo fluxo"
  - "Emissão e acesso direto ao boleto sem depender da entrega por e-mail"
  - "Uploads privados, administração auditável e conciliação controlada"
  - "Cobertura responsiva e de acessibilidade nos fluxos públicos e administrativos"
---

## Visão geral

A plataforma FATEC vai além de um site institucional. Ela combina conteúdo público e informações acadêmicas com fluxos operacionais de inscrição, concursos, documentos de candidatos, administração e pagamentos.

## Decisões de produto

O Django renderizado no servidor mantém fluxos sensíveis coesos e auditáveis. HTMX e Alpine.js adicionam interação sem transformar cada tela em uma aplicação cliente separada, enquanto a administração baseada em Unfold oferece visões orientadas a tarefas, em vez de expor registros brutos do banco.

O fluxo de pagamento trata o e-mail como dado cadastral, não como dependência de entrega: após uma inscrição válida, o candidato acessa o boleto gerado diretamente na interface. Integração com Banco do Brasil, conciliação, documentos privados e transições de estado permanecem protegidos no servidor.

## O que eu construí

- Publicação institucional, cursos, notícias, unidades e jornadas de contato.
- Inscrição, envio de documentos, acompanhamento e autoatendimento protegido do candidato.
- Administração de editais, cargos, inscrições, isenções, atendimentos especiais e pagamentos.
- Emissão e conciliação de boletos pela API Cobranças do Banco do Brasil.
- Salvaguardas de deploy e operação com PostgreSQL, Redis, Nginx, Gunicorn e conciliação agendada.

## Disponibilidade do código

Este é um trabalho para cliente em produção. O repositório é privado; o estudo de caso público apresenta o escopo do produto, a arquitetura e decisões operacionais não sensíveis.
