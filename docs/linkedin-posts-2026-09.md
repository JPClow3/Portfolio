# Publicações agendadas no LinkedIn — setembro/outubro de 2026

Oito posts estão agendados, um por dia, de 27/09 a 04/10/2026, às 09:00 no horário de Brasília (`America/Sao_Paulo`). A fila do LinkedIn foi conferida após as correções de 26/09. Os posts de DBS Telecom e do portfólio foram retirados da fila a pedido do autor.

Os posts sobre AgroHub, ClimAgro e Farm-Fin foram reescritos para apresentar o contexto institucional ou acadêmico e limitar a atribuição individual à contribuição técnica. O post da FATEC também foi suavizado para não sugerir entrega individual de toda a plataforma. O LinkedIn pode abreviar os links exibidos.

| Data | Projeto | Imagem usada |
| --- | --- | --- |
| 27/09 | AgroHub UniRV | `docs/linkedin-assets/agrohub.png` |
| 28/09 | FATEC Caçu | `docs/linkedin-assets/fatec-concursos.png` |
| 29/09 | Throughline | `public/projects/throughline.webp` |
| 30/09 | ClimAgro UniRV | `public/projects/climagro.webp` |
| 01/10 | Farm-Fin | `docs/linkedin-assets/farm-fin-case.png` |
| 02/10 | Signal Ledger | `docs/linkedin-assets/signal-ledger-case.png` |
| 03/10 | Lorebound | `docs/linkedin-assets/lorebound-case.png` |
| 04/10 | Hefesto | `docs/linkedin-assets/hefesto-case.png` |

## 27/09 — AgroHub UniRV

O AgroHub UniRV é uma iniciativa da Universidade de Rio Verde para aproximar pesquisa, startups e o agronegócio da região.

O portal reúne startups incubadas, eventos, serviços e canais institucionais. Participei do desenvolvimento da aplicação web que organiza essas informações, usando Django, HTMX e Alpine.js.

É um trabalho da UniRV e da equipe do AgroHub. Bom ver a plataforma disponível para quem quer conhecer o ecossistema e participar das atividades.

Portal: https://agrohub.unirv.edu.br/

Detalhes técnicos: https://jpclow.dev/pt/projects/agrohub/

#AgroHub #UniRV #DesenvolvimentoWeb

## 28/09 — FATEC Caçu

Um portal de ensino precisa atender públicos bem diferentes: estudantes, candidatos e equipe administrativa.

Trabalhei no desenvolvimento da plataforma digital da FATEC Caçu, que reúne conteúdo institucional, cursos, concursos, inscrições e acesso a boletos. Na parte técnica, o projeto usa Django, HTMX e Alpine.js; os fluxos de cobrança também se integram à API do Banco do Brasil.

O portal público está no ar: https://www.fateccacu.edu.br/

Mais sobre o trabalho: https://jpclow.dev/pt/projects/fatec/

#Django #SistemasWeb #Educação

## 29/09 — Throughline

Estou desenvolvendo o Throughline, um planejador que continua útil quando a conexão cai.

Metas, tarefas, notas, quadro e linha do tempo ficam disponíveis no dispositivo com IndexedDB. Quando a pessoa ativa a sincronização, os registros são criptografados antes de sair do dispositivo; o servidor recebe apenas texto cifrado.

A ideia é simples: privacidade precisa aparecer na arquitetura e no uso diário, não só na página de apresentação.

Código e decisões: https://github.com/JPClow3/Throughline

Visão do produto: https://jpclow.dev/pt/projects/throughline/

#React #PWA #Privacidade

## 30/09 — ClimAgro UniRV

O ClimAgro UniRV existe para levar dados meteorológicos e análises climáticas a quem planeja e trabalha no campo em Rio Verde. É uma iniciativa da Universidade de Rio Verde coordenada pelo Prof. Dr. Gilmar Oliveira Santos.

O portal reúne informações atuais, histórico e ferramentas para apoiar decisões no agro, além de servir a pesquisadores e estudantes. Minha participação está no desenvolvimento da plataforma web e dos fluxos que levam esses dados até as páginas e cálculos agronômicos.

Uma preocupação importante no trabalho é mostrar quando uma medição está atrasada ou incompleta. Isso ajuda a interpretar os resultados com o cuidado que eles exigem.

Mais sobre o projeto e minha contribuição técnica: https://jpclow.dev/pt/projects/climagro/

#ClimAgro #UniRV #Agrometeorologia

## 01/10 — Farm-Fin

O Farm-Fin nasceu na disciplina Prática de Engenharia de Software, na UniRV. O tema é gestão financeira e operacional no agro: como relacionar caixa, safra, talhões, insumos e estoque sem perder a rastreabilidade dos lançamentos.

No projeto acadêmico, tenho trabalhado na modelagem desses fluxos e na implementação da aplicação com Next.js e TypeScript. A parte interessante é sair de uma lista de funcionalidades e pensar em estados, aprovações e relações entre os dados.

É um trabalho de faculdade em desenvolvimento, não um sistema em operação em fazendas. Registrei as decisões técnicas aqui: https://jpclow.dev/pt/projects/farm-fin/

#EngenhariaDeSoftware #UniRV #Agronegócio

## 02/10 — Signal Ledger

Estou trabalhando em um produto de briefings que começa pela pergunta “o que mudou?” e não apenas por uma lista de links.

O Signal Ledger ingere fontes RSS e Atom, agrupa coberturas relacionadas e mantém snapshots e proveniência ligados a cada briefing. A interface também mostra quando um dado, áudio ou análise ainda não está disponível.

Essa última parte é deliberada. Em sistemas que resumem informação, deixar a ausência explícita é melhor do que preencher o espaço com algo que parece convincente, mas não tem fonte.

Arquitetura resumida: https://jpclow.dev/pt/projects/signal-ledger/

#NextJS #ArquiteturaDeSoftware #ProdutosDeDados

## 03/10 — Lorebound

Estou desenvolvendo o Lorebound, uma plataforma de ficção interativa com foco no leitor.

A proposta não é gerar texto infinito. Story packs curados definem mundo e tom; a IA entra em turnos controlados, enquanto escolhas e memória persistem para dar continuidade à leitura.

Também estou tratando custo e uso como parte do produto. A pessoa precisa entender o que está acontecendo, e a experiência precisa continuar parecendo uma leitura — não apenas uma conversa solta com um modelo.

O projeto ainda está em desenvolvimento, mas a página pública já mostra as decisões que estou testando:

https://jpclow.dev/pt/projects/lorebound/

#TypeScript #React #IA

## 04/10 — Hefesto

Nem todo projeto precisa ser apresentado como produto pronto.

O Hefesto é uma pesquisa sobre modelagem de risco de ignição de incêndios em Goiás. As linhas antigas usavam dados históricos em lote; por isso, foram aposentadas como serviço e preservadas como pesquisa reproduzível.

O benchmark histórico do v5_0 teve PR-AUC de 0,4565. Esse número não é desempenho ao vivo e não prova que a rearquitetura real-time-first terminou.

Hoje o trabalho está em contratos de dados, manifestos, validações, diagnóstico de latência e documentação. Às vezes, a entrega mais responsável é deixar claro o que ainda falta antes de publicar uma previsão.

Descrição da pesquisa: https://jpclow.dev/pt/projects/hefesto/

#Python #MachineLearning #DadosGeoespaciais
