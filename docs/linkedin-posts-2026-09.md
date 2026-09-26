# Posts agendados no LinkedIn — setembro/outubro de 2026

Sequência: um post por dia, às 09:00 no horário de Brasília (`America/Sao_Paulo`), começando em 2026-09-27.

Os 10 posts foram agendados no LinkedIn em 2026-09-26, cada um com imagem e texto alternativo. A fila da plataforma confirmou um post por dia, de 27/09 a 06/10, às 09:00 no horário de Brasília. Os textos abaixo registram o conteúdo enviado; o LinkedIn pode abreviar os links exibidos.

## Critério de seleção

Foram escolhidos projetos que têm uma entrega clara, uma decisão técnica que dá para explicar sem expor dados de cliente e uma página pública para apoiar a publicação. Projetos marcados como privados usam somente informações já documentadas no estudo de caso; qualquer imagem de produto deve vir de ambiente autorizado e sem dados reais.

Os posts recentes sobre AI Dev Controller, Moto Track e Inova Rio Verde ficaram fora desta sequência para evitar repetição. Os projetos arquivados e os protótipos de jogo ficaram fora por terem menos força para uma campanha de contratação neste momento.

## Imagens do portfólio revisadas

- `public/projects/climagro.webp` mostra uma interface real do ClimAgro, sem dados de produtor. Só aparecem contatos institucionais da UniRV e uma data de demonstração; é uma imagem segura para acompanhar o post, mas não deve ser usada como evidência de dados atuais.
- `public/projects/throughline.webp` mostra o painel do Throughline com tarefas genéricas de exemplo e uma data de demonstração. Não há nome, conta ou dado pessoal; é a melhor imagem disponível para esse post, já que não há demo pública confirmada.
- `public/projects/lorebound.webp` mostra uma prévia de produto e traz o texto “DEMO PREVIEW — NOT INTERACTIVE”. É segura como imagem conceitual, mas não deve ser apresentada como prova de produto lançado.
- `public/projects/agrohub.webp` mostra uma tela pública do AgroHub. O telefone, e-mail e CNPJ exibidos são institucionais; ainda assim, prefiro uma captura Playwright do site atual para evitar publicar uma versão antiga.
- `public/projects/hefesto-risk-grid.svg` é uma ilustração analítica, não uma tela de produto. Ela pode acompanhar o post, desde que o texto continue identificando o projeto como pesquisa.
- FATEC, DBS Telecom, Farm-Fin, Signal Ledger e o próprio portfólio não têm uma imagem de produto correspondente em `public/projects/`. Para eles, usar Playwright na página pública indicada ou um ambiente autorizado.

## 2026-09-27 — AgroHub UniRV

- Status: lançado e em produção pública.
- Estudo de caso: https://jpclow.dev/pt/projects/agrohub/
- Produto: https://agrohub.unirv.edu.br/
- Captura sugerida: usar Playwright em `https://agrohub.unirv.edu.br/` e capturar a área inicial com o banner e os atalhos para startups, calendário e serviços. Uma segunda captura pode mostrar “Nossos Diferenciais”; não incluir dados inseridos por visitantes. `public/projects/agrohub.webp` é um fallback seguro, mas pode estar desatualizado.

### Texto

Uma entrega recente que resume bem o tipo de produto que gosto de construir: o portal do AgroHub UniRV.

Fiz o projeto sozinho, do design ao deploy. O desafio era juntar startups incubadas, eventos, serviços do NIT e canais de acesso institucional em uma jornada simples para públicos diferentes.

Escolhi Django renderizado no servidor, com HTMX e Alpine.js para as interações pontuais. O resultado está no ar:

https://agrohub.unirv.edu.br/

Detalhes da entrega: https://jpclow.dev/pt/projects/agrohub/

#Django #DesenvolvimentoWeb #ProdutoDigital

## 2026-09-28 — Plataforma Digital FATEC

- Status: lançado e em produção pública; código da operação privado.
- Estudo de caso: https://jpclow.dev/pt/projects/fatec/
- Produto: https://www.fateccacu.edu.br/
- Captura sugerida: usar Playwright em `https://www.fateccacu.edu.br/` e capturar o cabeçalho com os acessos para cursos, concursos e inscrições, além da chamada principal. Usar somente áreas públicas; não capturar área do aluno, documentos ou dados de candidatos.

### Texto

Construí a plataforma digital da FATEC Caçu para organizar em uma mesma jornada conteúdo institucional, cursos, concursos, inscrições, documentos e acesso ao boleto.

Usei Django no servidor, HTMX e Alpine.js para interações pontuais e uma integração com a API de Cobranças do Banco do Brasil. O código e os dados da operação são privados, mas o portal público está no ar:

https://www.fateccacu.edu.br/

Mais detalhes: https://jpclow.dev/pt/projects/fatec/

#Django #SistemasWeb #EngenhariaDeProduto

## 2026-09-29 — Throughline

- Status: projeto público em evolução; o repositório é público e não há demo pública confirmada no material revisado.
- Estudo de caso: https://jpclow.dev/pt/projects/throughline/
- Código: https://github.com/JPClow3/Throughline
- Captura sugerida: usar `public/projects/throughline.webp`, que já mostra a interface com tarefas genéricas e sem dados pessoais. Para uma captura atual, usar uma execução local ou preview autorizado do repositório; não há demo pública confirmada.

### Texto

Estou desenvolvendo o Throughline, um planejador que continua útil quando a conexão cai.

Metas, tarefas, notas, quadro e linha do tempo ficam disponíveis no dispositivo com IndexedDB. Quando a pessoa ativa a sincronização, os registros são criptografados antes de sair do dispositivo; o servidor recebe apenas texto cifrado.

A ideia é simples: privacidade precisa aparecer na arquitetura e no uso diário, não só na página de apresentação.

Código e decisões: https://github.com/JPClow3/Throughline

Visão do produto: https://jpclow.dev/pt/projects/throughline/

#React #PWA #Privacidade

## 2026-09-30 — ClimAgro

- Status: trabalho institucional operado em código privado; estudo de caso público.
- Estudo de caso: https://jpclow.dev/pt/projects/climagro/
- Produto: não há URL pública do produto no material revisado.
- Captura sugerida: usar `public/projects/climagro.webp`, que mostra a interface real com navegação, dados meteorológicos e contatos institucionais, sem dados de produtor. Se houver staging autorizado, uma captura Playwright pode mostrar uma estação com resumo diário, tabela acessível ou balanço hídrico usando dados não sensíveis.

### Texto

Em um projeto institucional privado, estou transformando dados meteorológicos em decisões operacionais para a agricultura.

Separei a ingestão do INMET da aplicação Django por meio de um contrato OpenAPI. A plataforma trabalha com dados diários e horários, evapotranspiração FAO-56, balanço hídrico, irrigação e risco de fogo. Gráficos vêm acompanhados de tabelas e downloads.

Quando o dado está atrasado ou incompleto, a aplicação deixa isso visível. Para mim, essa parte é tão importante quanto o cálculo: uma decisão técnica precisa mostrar o limite da evidência.

Descrição pública: https://jpclow.dev/pt/projects/climagro/

#Python #Django #Dados

## 2026-10-01 — Central do Assinante DBS Telecom

- Status: entrega documentada com repositório público; integrações de produção dependem de credenciais e dados autorizados do ambiente destino.
- Estudo de caso: https://jpclow.dev/pt/projects/dbs-telecom/
- Código e documentação: https://github.com/JPClow3/dbs-telecom
- Captura sugerida: usar Playwright em `https://jpclow.dev/pt/projects/dbs-telecom/` para a imagem pública. Para mostrar a interface real, usar a demonstração local ou um ambiente autorizado com dados ilustrativos; capturar faturas ou atendimento fictícios, sem CPF, contratos, endereço ou credenciais.

### Texto

Na Central do Assinante DBS Telecom, construí um app Expo/React Native apoiado por um BFF em TypeScript.

O servidor concentra autenticação, integração com o IXC, persistência no Neon e assistência por IA. O aplicativo não recebe credenciais dos provedores. A API também diferencia dados reais, demonstração, indisponibilidade e falta de autorização.

Essa distinção evita que uma fixture local ou uma integração parcial seja apresentada como uma operação financeira ou de rede funcionando.

Código e documentação: https://github.com/JPClow3/dbs-telecom

Página técnica: https://jpclow.dev/pt/projects/dbs-telecom/

#ReactNative #TypeScript #CloudflareWorkers

## 2026-10-02 — Farm-Fin

- Status: produto privado para o agronegócio; estudo de caso público.
- Estudo de caso: https://jpclow.dev/pt/projects/farm-fin/
- Produto/código: não há URL pública no material revisado.
- Captura sugerida: usar Playwright em `https://jpclow.dev/pt/projects/farm-fin/` para a captura pública. Se houver ambiente autorizado, capturar uma tela com dados fictícios de fluxo de caixa, estoque ou DRE; esconder nomes de fazendas, valores reais, documentos e qualquer identificador de cliente.

### Texto

Em um produto privado para o agronegócio, estou conectando a realidade financeira e a realidade física da fazenda.

O Farm-Fin reúne caixa, safras, talhões, insumos, estoque, barter, hedge, DRE e LCDPR em um mesmo domínio. O modelo usa estados explícitos, aprovações, conciliação, custo médio e exportações XLSX para continuar compatível com a rotina de gestores e contadores.

O trabalho mais difícil não foi criar mais uma tela de lançamento. Foi preservar a rastreabilidade entre o que acontece no campo, o que acontece no caixa e o que precisa aparecer na obrigação fiscal.

Como modelei os fluxos: https://jpclow.dev/pt/projects/farm-fin/

#NextJS #TypeScript #Agronegócio

## 2026-10-03 — Signal Ledger

- Status: produto vivo operado a partir de repositório privado; estudo de caso público.
- Estudo de caso: https://jpclow.dev/pt/projects/signal-ledger/
- Produto/código: não há URL pública no material revisado.
- Captura sugerida: usar Playwright em `https://jpclow.dev/pt/projects/signal-ledger/` para a captura pública. Se houver staging autorizado, capturar uma linha do tempo de tema com as fontes visíveis e sem conteúdo restrito, dados de assinantes ou contratos de fornecedores.

### Texto

Estou trabalhando em um produto de briefings que começa pela pergunta “o que mudou?” e não apenas por uma lista de links.

O Signal Ledger ingere fontes RSS e Atom, agrupa coberturas relacionadas e mantém snapshots e proveniência ligados a cada briefing. A interface também mostra quando um dado, áudio ou análise ainda não está disponível.

Essa última parte é deliberada. Em sistemas que resumem informação, deixar a ausência explícita é melhor do que preencher o espaço com algo que parece convincente, mas não tem fonte.

Arquitetura resumida: https://jpclow.dev/pt/projects/signal-ledger/

#NextJS #ArquiteturaDeSoftware #ProdutosDeDados

## 2026-10-04 — Lorebound

- Status: em desenvolvimento.
- Estudo de caso: https://jpclow.dev/pt/projects/lorebound/
- Produto/código: não há URL pública do produto no material revisado.
- Captura sugerida: `public/projects/lorebound.webp` é uma prévia segura para acompanhar o post, mas está marcada como não interativa. Para uma captura pública verificável, usar Playwright em `https://jpclow.dev/pt/projects/lorebound/`; se houver preview autorizado, capturar a seleção de um story pack e o contexto de uma leitura fictícia, sem chaves, contas, dados de cobrança ou conteúdo privado.

### Texto

Estou desenvolvendo o Lorebound, uma plataforma de ficção interativa com foco no leitor.

A proposta não é gerar texto infinito. Story packs curados definem mundo e tom; a IA entra em turnos controlados, enquanto escolhas e memória persistem para dar continuidade à leitura.

Também estou tratando custo e uso como parte do produto. A pessoa precisa entender o que está acontecendo, e a experiência precisa continuar parecendo uma leitura — não apenas uma conversa solta com um modelo.

O projeto ainda está em desenvolvimento, mas a página pública já mostra as decisões que estou testando:

https://jpclow.dev/pt/projects/lorebound/

#TypeScript #React #IA

## 2026-10-05 — Hefesto

- Status: pesquisa e rearquitetura; não é um serviço ativo de previsão.
- Estudo de caso: https://jpclow.dev/pt/projects/hefesto/
- Produto/código: não há URL pública de serviço no material revisado.
- Captura sugerida: usar Playwright em `https://jpclow.dev/pt/projects/hefesto/` e capturar a imagem da grade de risco junto do selo “Pesquisa” e do bloco que identifica o benchmark como histórico. `public/projects/hefesto-risk-grid.svg` é uma ilustração, não uma captura de interface. Não recortar a imagem de modo que pareça uma previsão ao vivo.

### Texto

Nem todo projeto precisa ser apresentado como produto pronto.

O Hefesto é uma pesquisa sobre modelagem de risco de ignição de incêndios em Goiás. As linhas antigas usavam dados históricos em lote; por isso, foram aposentadas como serviço e preservadas como pesquisa reproduzível.

O benchmark histórico do v5_0 teve PR-AUC de 0,4565. Esse número não é desempenho ao vivo e não prova que a rearquitetura real-time-first terminou.

Hoje o trabalho está em contratos de dados, manifestos, validações, diagnóstico de latência e documentação. Às vezes, a entrega mais responsável é deixar claro o que ainda falta antes de publicar uma previsão.

Descrição da pesquisa: https://jpclow.dev/pt/projects/hefesto/

#Python #MachineLearning #DadosGeoespaciais

## 2026-10-06 — Portfólio de Desenvolvimento

- Status: site lançado e público.
- Site: https://jpclow.dev/
- Versão em português: https://jpclow.dev/pt/
- Código: https://github.com/JPClow3/Portfolio
- Captura sugerida: usar Playwright em `https://jpclow.dev/pt/` e capturar o hero junto da seção de projetos. Uma segunda imagem pode mostrar a página em modo escuro ou em viewport mobile; manter o foco na navegação e nos projetos, sem incluir dados do formulário de contato.

### Texto

Meu próprio portfólio virou um pequeno estudo de arquitetura.

Construí o site com Astro, Svelte, TypeScript e Tailwind CSS, priorizando páginas estáticas, acessibilidade e pouco JavaScript no cliente. O conteúdo é bilíngue, os estudos de caso têm dados estruturados, o site gera Open Graph, sitemap e RSS, e a cena em Three.js fica isolada em uma ilha Svelte.

Gosto desse tipo de trabalho porque cada escolha aparece no resultado: a página carrega rápido, continua legível sem efeitos e ainda tem espaço para uma camada visual mais expressiva.

Site: https://jpclow.dev/

Código: https://github.com/JPClow3/Portfolio

#Astro #Svelte #WebPerformance

## Notas de evidência e incerteza

- Os URLs de estudo de caso usados acima retornaram HTTP 200 em 2026-09-26. Os produtos públicos AgroHub e FATEC e os repositórios públicos Throughline, DBS Telecom e Portfolio também retornaram HTTP 200 na mesma verificação.
- Não foi encontrada uma URL pública de produto para ClimAgro, Farm-Fin, Signal Ledger, Lorebound ou Hefesto. Os textos desses posts foram limitados ao conteúdo público dos estudos de caso e às descrições locais do portfólio.
- A página pública de Lorebound atualmente pode exibir uma descrição de stack antiga em relação ao arquivo local do portfólio. O post evita listar a infraestrutura para não transformar essa divergência em uma afirmação pública.
- O README público de DBS Telecom informa que a demonstração pode usar dados ilustrativos e que as integrações dependem de credenciais autorizadas. Por isso o texto descreve a arquitetura e os limites de segurança, sem afirmar que as integrações estão operando em produção pública.
- Throughline tem repositório público, mas nenhuma URL de demo foi confirmada. A captura da interface deve ser feita em execução local ou preview autorizado.
- Nenhum número foi inventado. Os números usados no texto de Hefesto são o benchmark histórico documentado no estudo de caso; o texto explicita que ele não é uma métrica de operação atual.
