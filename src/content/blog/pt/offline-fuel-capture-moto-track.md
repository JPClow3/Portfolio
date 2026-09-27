---
title: "Offline é uma Promessa Específica: a Fila de Abastecimento do Moto Track"
description: "Como o Moto Track guarda um abastecimento localmente, reenvia o registro pelo service worker e delimita esse fluxo offline."
pubDate: 2026-09-27T12:00:00Z
tags: ["Moto Track", "offline", "SvelteKit", "engenharia de produto"]
draft: false
lang: pt
slug: offline-fuel-capture-moto-track
---

## O registro que precisa sobreviver à falta de conexão

Um motociclista pode abastecer em um lugar com sinal ruim. Perder data, hodômetro, litros e preço depois de preencher o formulário é frustrante; prometer que a conta inteira funciona offline seria algo muito maior. No [Moto Track](/pt/projects/moto-track/), o caminho offline é limitado à criação de um registro de abastecimento.

Com conexão, o formulário segue o envio normal. Quando o navegador informa que está offline, a requisição é cancelada e os campos obrigatórios são validados antes que seus valores de texto sejam guardados em uma fila no IndexedDB. Uma mensagem visível informa que o registro foi salvo localmente. Comprovantes e fotos ficam fora desse caminho: o formulário pede que o arquivo seja enviado quando houver conexão.

## Um registro na fila ainda não está no servidor

Cada item da fila recebe um identificador local e uma data de criação. Um service worker lê a fila e envia os itens para a mesma ação de criação de abastecimento usada no fluxo online. O item só é removido depois de uma resposta bem-sucedida do servidor. O cliente solicita uma nova tentativa quando começa outro envio online de abastecimento; também registra sincronização em segundo plano quando o navegador oferece essa API.

Essa distinção importa. Um item salvo no dispositivo pode continuar à espera de autenticação, conexão ou resposta bem-sucedida. O suporte à sincronização em segundo plano varia entre navegadores. Por isso, o produto deve chamar o item de *pendente na fila*, e não de sincronizado.

## Por que o escopo é pequeno

O service worker guarda em cache uma página offline e o manifesto web; ele não transforma todas as telas autenticadas nem todas as operações do Moto Track em funções offline. O abastecimento foi escolhido por ser um registro curto e estruturado que pode ser validado e reenviado. Os anexos ficam online porque armazenar e repetir uploads binários cria outro caminho de falha.

A lição é nomear a tarefa exata que funciona sem rede e tornar o estado restante visível. No Moto Track, isso significa capturar abastecimentos em uma fila local e esperar a confirmação do servidor após o reenvio. O [produto ativo](https://moto-track.net/) e o [case](/pt/projects/moto-track/) mostram o restante da operação da moto ao redor desse fluxo.
