---
title: "Planejamento local: por que o Throughline criptografa antes de sincronizar"
description: "A decisão de arquitetura por trás do planejamento offline e da sincronização privada opcional do Throughline."
pubDate: 2026-09-27T12:00:00Z
tags: ["Throughline", "local first", "privacidade", "PWA"]
draft: false
lang: pt
slug: local-first-privacy-throughline
---

## Primeiro, a cópia de trabalho

Um planejador precisa continuar útil quando a conexão cai. No [Throughline](/pt/projects/throughline/), metas, tarefas, notas, quadros e linhas do tempo usam IndexedDB como armazenamento de trabalho. O uso offline faz parte do fluxo normal, sem depender de um modo separado e limitado.

Essa escolha também define um limite claro de privacidade. Um serviço remoto não precisa ler as metas e notas de uma pessoa apenas para manter outro dispositivo atualizado.

## Sincronização opcional e criptografada

Quando a pessoa ativa a sincronização, o Throughline criptografa os registros no dispositivo com uma chave derivada de senha antes de enviá-los. O servidor armazena texto cifrado. A cópia local continua sustentando o uso diário, então ativar a sincronização não muda a forma de planejar.

Os lembretes seguem o mesmo limite: as notificações evitam títulos de tarefas e outros detalhes sensíveis. Um canal de notificação não deve desfazer a promessa de privacidade do armazenamento e da sincronização.

## A decisão de produto

Essa arquitetura exige cuidado adicional com persistência local, criptografia e estado entre dispositivos. Em troca, permite uma promessa precisa: o planejamento funciona localmente, e a sincronização opcional mantém o conteúdo privado ilegível para o servidor. O [case](/pt/projects/throughline/) explica o produto e essa escolha com mais detalhes.
