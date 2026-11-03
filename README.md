# StudyCam AI — landing page + aplicação web (Sprint 4)

Projeto único em **React** que reúne as duas entregas conjuntas da equipe para o
**Eng. Software Challenge 2026 (FIAP × JOVI)** — *Front-End Design* e
*Web Development*:

- a **landing page** do StudyCam AI, que apresenta o problema, a solução, a
  galeria, a equipe e o formulário de contato;
- a **aplicação web**, que reproduz no navegador o aplicativo **StudyCam AI** —
  o modo Estudo criado pela equipe para a câmera dos celulares **JOVI**.

A landing page é a página inicial e leva ao protótipo do aplicativo pelos botões
*"Abrir o protótipo"* (cabeçalho, hero, galeria e rodapé). O protótipo fica numa
**rota privada**: quem não tem sessão é levado para a tela de entrada. Veja
[Rotas do projeto](#rotas-do-projeto) e [Usuários e senhas](#usuários-e-senhas).

A interface segue as telas do aplicativo: câmera no modo StudyCam AI, resumo da
captura gerado por IA, biblioteca com álbuns por matéria, **tutor** (chat de
dúvidas sobre o que foi estudado) e **simulados** montados a partir dos próprios
resumos. Além dessas, a aplicação implementa as funcionalidades sugeridas no
enunciado: central de conteúdo com busca, organização livre dos álbuns, histórico
e estatísticas, privacidade e ações sobre o conteúdo (exportar e lixeira com
recuperação).

> **Integrações externas:** o OCR da captura, o resumo, o quiz, os simulados, as
> respostas do tutor e a leitura em voz alta usam as APIs do Google (Gemini e
> Text-to-Speech). Veja [Integrações de API](#integrações-de-api).

---

## Sumário

1. [Tecnologias utilizadas](#tecnologias-utilizadas)
2. [Como instalar as dependências](#como-instalar-as-dependências)
3. [Como executar o projeto](#como-executar-o-projeto)
4. [Rotas do projeto](#rotas-do-projeto)
5. [Usuários e senhas](#usuários-e-senhas)
6. [Telas e funcionalidades](#telas-e-funcionalidades)
7. [Estrutura de pastas](#estrutura-de-pastas)
8. [Requisitos da Sprint atendidos](#requisitos-da-sprint-atendidos)
9. [Integrações de API](#integrações-de-api)
10. [Onde e como a IA foi utilizada no projeto](#onde-e-como-a-ia-foi-utilizada-no-projeto)
11. [Link do repositório Git e do Deploy na Vercel](#link-do-repositório-git-e-do-deploy-na-vercel)

---

## Tecnologias utilizadas

| Tecnologia | Uso no projeto |
| --- | --- |
| **React 19** | Componentes funcionais, props (pai → filho), hooks nativos e customizados |
| **React Router 7** | Rotas públicas (`/`, `/entrar`) e rota privada (`/app`) |
| **Tailwind CSS 4** | Estilização das telas novas (tutor, simulados, ajustes, entrada), com os tokens da marca registrados em `@theme` |
| **Vite 8** | Servidor de desenvolvimento e build de produção |
| **JavaScript (ES2022)** | Regras de negócio, utilitários e serviços |
| **CSS puro** | Moldura do aparelho, animações e a landing page: variáveis de tema, Flexbox, CSS Grid e media queries (Desktop, Tablet e Mobile) |
| **localStorage** | Persistência de álbuns, anotações, simulados, conversas do tutor, histórico, ajustes, sessão e tema da landing |
| **SVG inline** | Todos os ícones e as miniaturas geradas das anotações |
| **Web Speech API** | Microfone do tutor (ditado por voz), quando o navegador oferece |
| **ESLint** | Padronização do código |

## Como instalar as dependências

Pré-requisito: **Node.js 18 ou superior** (o projeto foi desenvolvido no Node 24).

```bash
npm install
```

## Como executar o projeto

```bash
npm run dev
```

O terminal exibe o endereço local (por padrão `http://localhost:5173`). Abra esse
endereço no navegador.

Outros scripts:

```bash
npm run build     # gera a versão de produção na pasta /dist
npm run preview   # serve a build de produção localmente
npm run lint      # roda o ESLint (o projeto está sem erros e sem avisos)
```

**Back-end:** o projeto não possui servidor próprio. Toda a persistência é feita
no `localStorage` do navegador, então basta executar o comando acima.

## Rotas do projeto

As rotas usam o **React Router** com History API. O arquivo `vercel.json` já traz
a regra de reescrita que devolve o `index.html` em qualquer endereço, para que
`/app` funcione ao ser aberto direto ou recarregado.

| Rota | Página | Acesso |
| --- | --- | --- |
| `/` | **Landing page** — apresentação do StudyCam AI | pública |
| `/entrar` | **Entrada** — formulário de e-mail e senha | pública |
| `/app` | **Protótipo do aplicativo** — o aparelho navegável | **privada** |

O componente `components/rotas/RotaPrivada.jsx` é o porteiro: sem sessão, ele
redireciona para `/entrar` guardando em `state.de` a rota que a pessoa tentou
abrir — depois de entrar, ela cai exatamente onde queria. A sessão fica no
`localStorage`, então continua valendo quando a aba é fechada e reaberta.

Para voltar da aplicação para a landing: o link **"← Voltar para o site"**, no
canto superior esquerdo (a partir de 700px de largura), ou o botão *voltar* do
navegador.

O atributo `data-pagina` (`site`, `entrar` ou `app`), escrito no `<html>`, é o que
separa os conjuntos de CSS: as regras de base de cada parte são presas a ele,
então a landing (que rola a página e tem tema claro/escuro) e o aplicativo (que
ocupa a tela inteira com fundo escuro fixo) não interferem um no outro.

## Usuários e senhas

A autenticação existe para separar as rotas públicas da privada e é resolvida
inteiramente no navegador, contra a lista de `src/data/contas.js` — **não há
servidor e nenhum dado é protegido por ela**. Contas disponíveis:

| E-mail | Senha |
| --- | --- |
| `professor@fiap.com.br` | `fiap2026` |
| `ian@studycam.ai` | `studycam` |
| `joao@studycam.ai` | `studycam` |
| `hyan@studycam.ai` | `studycam` |
| `elizeu@studycam.ai` | `studycam` |

A primeira conta é a sugerida para a banca: o botão **"Preencher
automaticamente"** da tela de entrada já a preenche. Para encerrar a sessão, use
o link **sair**, ao lado do nome, na coluna de texto à esquerda do aparelho.

## Telas e funcionalidades

| Tela | O que faz |
| --- | --- |
| **Câmera (StudyCam AI)** | Flash, proporção (4:3, 1:1, 16:9), temporizador, botão de IA, ajustes, zoom 0,6x/1x/2x, detecção de documento e obturador. A captura gera uma anotação, com a matéria sugerida pela IA e a confiança do reconhecimento. O ícone da esquerda abre a galeria (segure para revelar os álbuns) e o marcador da direita abre a biblioteca |
| **Anotação (resumo)** | Foto da captura (com giro da imagem) e a análise da IA: assunto identificado, palavras-chave, resumo (com leitura em voz alta), quiz de 3 perguntas gerado a pedido, pontos-chave, **"Falar com o tutor"** (abre o chat já com o resumo anexado) e atalhos de busca na Web e no YouTube |
| **Biblioteca › Álbuns** | Total de anotações, data da última atualização e grade de matérias. Menu de cada álbum: renomear, alterar cor e excluir. Menu do topo: nova matéria, reorganizar, central de conteúdo, histórico, lixeira e ajustes |
| **Biblioteca › Álbum (matéria)** | Grade de anotações, importação de imagem do computador, ordenação e menu por anotação (renomear, mover, ouvir, privacidade, exportar, excluir) |
| **Tutor** | Chat que conhece os resumos do estudante: anexe um resumo pelo **+**, pergunte por escrito ou pelo **microfone**, e cada resposta traz copiar, compartilhar e ouvir em voz alta. As conversas ficam salvas e podem ser retomadas no menu **Conversas anteriores** |
| **Estudar (simulados)** | Números de desempenho (simulados feitos, acerto médio e dias seguidos), montagem de um simulado novo em dois passos, **revisar pendências** (assuntos errados, que saem da lista sozinhos quando são acertados) e histórico com refazer, agendar no Google Agenda, compartilhar e excluir |
| **Montar simulado** | Passo 1: escolher os álbuns e os resumos. Passo 2: quantas perguntas (com o limite que o conteúdo comporta), dificuldade (leve, média, difícil), cronômetro e resposta na hora |
| **Simulado / Resultado** | Uma pergunta por vez, com barra de progresso; no fim, a nota, o tempo e o gabarito pergunta a pergunta |
| **Galeria** | Todas as fotos guardadas, separadas por dia ("Hoje", "Ontem", data), com importação de imagens e menu por foto |
| **Central de conteúdo** | Visão única com números de uso, atalhos e as capturas mais recentes |
| **Busca** | Procura por título, matéria ou tipo de captura |
| **Histórico e estatísticas** | Registro do que foi adicionado, editado, removido ou restaurado + uso por matéria e por período |
| **Lixeira** | Anotações excluídas, com prazo restante, restauração e exclusão definitiva |
| **Ajustes** | Planos, **Idioma e voz** (7 idiomas, resumo no idioma do documento, voz feminina/masculina, velocidade e amostra), vídeo de abertura, **ver tutorial de novo**, **Sobre** (história, créditos com RM, política de privacidade, termos, licenças e contato), além das preferências da câmera, da IA e de privacidade |

**Dicas de primeiro uso:** ao abrir a câmera, o resumo, os álbuns, o tutor e a aba
Estudar pela primeira vez, o aplicativo ilumina cada controle e explica para que
ele serve. As dicas rodam uma vez por tela e voltam por *Ajustes › Ver tutorial de
novo*.

A barra inferior reproduz a navegação do Android: **recentes**, **início** (volta
para a câmera) e **voltar** (desempilha a tela atual). Dentro da biblioteca, uma
barra de abas alterna entre **Biblioteca**, **Tutor** e **Estudar**.

O visor pede a câmera real do dispositivo ao abrir o protótipo, sem passar por
Ajustes. Se o navegador negar a permissão (ou não houver câmera), a aplicação
volta sozinha para a cena simulada e tudo continua funcionando.

> **Para testar o tutor e os simulados:** as 17 anotações de exemplo vêm como
> capturas ainda **não analisadas** — é assim que elas saem da câmera. Abra uma
> anotação e toque em **Analisar com IA**; é o resumo gerado ali que vira o
> anexo do tutor e as perguntas do simulado. Sem nenhuma anotação analisada, a
> tela "Escolher conteúdo" avisa isso e mantém o botão desligado.

## Estrutura de pastas

```
src/
├── App.jsx                  rotas públicas e privada do projeto
├── main.jsx                 ponto de entrada do React (BrowserRouter)
├── index.css                Tailwind, tokens da marca e os arquivos de estilo
├── paginas/
│   ├── PaginaSite.jsx       landing page (rota /)
│   ├── PaginaEntrar.jsx     tela de entrada (rota /entrar)
│   └── PaginaAplicativo.jsx aparelho navegável (rota privada /app)
├── site/
│   ├── components/          cabeçalho, hero, solução, público-alvo, recursos,
│   │                        galeria, estatísticas, dica do dia, equipe, contato
│   │                        e rodapé da landing
│   └── data/                recursos, galeria, estatísticas, equipe e dicas
├── components/
│   ├── rotas/               RotaPrivada: o porteiro da rota /app
│   ├── dispositivo/         barra de status e barra do sistema
│   ├── camera/              barra da câmera, visor, zoom, modos e captura
│   ├── albuns/              cartão de resumo, grade e cartão de matéria, cores
│   ├── notas/               grade e itens de anotação, tela do álbum e da anotação
│   ├── tutor/               tela do chat, mensagem e seletor de resumo
│   ├── estudar/             aba Estudar, montagem, simulado e resultado
│   ├── paineis/             galeria, central, busca, histórico, lixeira, ajustes,
│   │                        planos, idioma e voz, sobre
│   └── ui/                  ícones em SVG, abas, tutorial, menu, diálogo, aviso…
├── hooks/
│   ├── useLocalStorage.js   espelha um estado do React no localStorage
│   ├── useAutenticacao.js   sessão do usuário (rotas pública ↔ privada)
│   ├── useBiblioteca.js     álbuns, anotações, lixeira, histórico, estatísticas
│   ├── useTutor.js          conversas do tutor e chamada ao Gemini
│   ├── useSimulados.js      simulados, correção, estatísticas e pendências
│   ├── useTutorial.js       dicas de primeiro uso, tela a tela
│   ├── useDitado.js         microfone do tutor (Web Speech API)
│   ├── useNavegacao.js      navegação em pilha e abas, como no Android
│   ├── useCamera.js         temporizador, clarão e montagem da captura
│   ├── usePressaoLonga.js   separa o toque rápido da pressão longa
│   ├── useWebcam.js         acesso à câmera real do dispositivo
│   └── useRelogio.js        relógio da barra de status
├── data/                    conteúdo inicial, contas, cores, modos, dicas,
│                            idiomas, planos, créditos e roteiro do tutorial
├── utils/                   formatação, aleatoriedade, imagem, exportação,
│                            compartilhamento, posição de menus, simulado, rotas,
│                            ajustes salvos e limpeza do texto devolvido pela IA
├── services/                integrações externas (Gemini e text-to-speech)
└── css/
    ├── (raiz)               estilos do aplicativo: base, dispositivo, câmera,
    │                        álbuns, notas, painéis e componentes
    └── site/                estilos da landing page (base e design system)
```

## Requisitos da Sprint atendidos

| Requisito | Onde está |
| --- | --- |
| **React com componentização** | 60+ componentes funcionais em `src/components/`, `src/site/components/` e `src/paginas/` |
| **Uso de props (pai → filho)** | `PaginaAplicativo` distribui dados e ações para cada tela; `TelaAlbuns → CartaoAlbum`, `TelaTutor → MensagemTutor`, entre outros |
| **Rotas públicas e privadas** | `src/App.jsx` (React Router) e `src/components/rotas/RotaPrivada.jsx` |
| **Hooks nativos do React** | `useState`, `useEffect`, `useCallback`, `useMemo` e `useRef` em todas as telas |
| **Hooks customizados** (lógica separada do visual) | `useBiblioteca`, `useTutor`, `useSimulados`, `useTutorial`, `useDitado`, `useNavegacao`, `useCamera`, `useWebcam`, `usePressaoLonga`, `useAutenticacao`, `useLocalStorage`, `useRelogio` |
| **Tailwind CSS** | `src/index.css` (`@import 'tailwindcss'` + `@theme` com os tokens da marca) e as telas de tutor, simulados, ajustes, planos, idioma e voz, sobre, abas, tutorial e entrada |
| **Responsividade (Desktop, Tablet e Mobile)** | Media queries em `src/css/` para o aparelho e a landing; utilitários responsivos nas telas em Tailwind |
| **Consumo de API** | Google Gemini e Google Text-to-Speech em `src/services/` |
| **localStorage** | `src/hooks/useLocalStorage.js`, base de toda a persistência |
| **Operações com `Math`** | `src/utils/formato.js` (arredondamento, piso, teto, mínimo/máximo, potência e logaritmo) e `src/utils/aleatorio.js` (sorteios e gerador com semente) |
| **Deploy** | Git + Vercel, com `vercel.json` para as rotas do History API |

## Integrações de API

Dois arquivos — e somente eles — concentram as chamadas de rede da aplicação:

| Arquivo | Recurso | Serviço |
| --- | --- | --- |
| `src/services/api.js` | OCR da captura, análise da anotação (resumo, palavras-chave e pontos-chave), quiz sob demanda, geração dos simulados, respostas do tutor e classificação da matéria | Google Gemini (`gemini-3.5-flash-lite`) |
| `src/services/textToSpeech.js` | Leitura em voz alta do resumo e das respostas do tutor, em 7 idiomas | Google Cloud Text-to-Speech, com a síntese nativa do navegador como alternativa |

As chaves ficam no arquivo `.env` da raiz, nas variáveis `VITE_GOOGLE_API_KEY` e
`VITE_GOOGLE_TTS_KEY`. O Vite só expõe ao navegador as variáveis com o prefixo
`VITE_` e as lê durante o build, então reinicie o `npm run dev` depois de
alterá-las. Na Vercel, as mesmas variáveis devem ser cadastradas em
*Settings › Environment Variables*.

Para usar chaves próprias sem mexer no `.env`, copie o modelo:

```bash
cp .env.example .env.local
```

As funções devolvem `{ ok: false, mensagem }` quando a chamada falha, e a
interface mostra o recado no lugar do resultado — a aplicação continua
funcionando mesmo sem rede. Detalhes em `src/services/INTEGRACOES.md`.

## Onde e como a IA foi utilizada no projeto

A inteligência artificial é o produto, não um acessório: o **Google Gemini** é
quem lê a foto do quadro ou do caderno (OCR), escreve o resumo com
palavras-chave e pontos-chave, escolhe em qual matéria a captura se encaixa, gera
o quiz de três perguntas de cada anotação, monta os simulados a partir dos
resumos escolhidos — respeitando a quantidade e a dificuldade pedidas — e responde
como tutor no chat, recebendo o resumo anexado como contexto para explicar o
assunto passo a passo. O **Google Cloud Text-to-Speech** narra o resumo e as
respostas do tutor no idioma e na voz escolhidos em Ajustes. Todas essas chamadas
estão isoladas em `src/services/`, e cada uma devolve um erro tratado quando a
rede ou a chave falham, para que a interface nunca quebre. A equipe também usou
assistentes de IA (Claude e ChatGPT) como apoio durante o desenvolvimento — para
revisar código, sugerir nomes e acelerar a escrita de trechos repetitivos —,
sempre com revisão e ajuste manual de tudo que entrou no projeto.

## Link do repositório Git e do Deploy na Vercel

- **Repositório Git:** https://github.com/Fiap-Hyan/Sprint4_FrontWeb
- **Deploy na Vercel:** https://sprint4-front-web.vercel.app

---

StudyCam AI · Challenge 2026 · FIAP × JOVI
