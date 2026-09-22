# Integrações externas

Os dois arquivos desta pasta concentram **todas** as chamadas de rede da
aplicação. O restante do projeto apenas consome as funções exportadas aqui.

| Arquivo | Recurso | Serviço | Variável de ambiente |
| --- | --- | --- | --- |
| `api.js` | OCR da captura, análise da anotação, quiz e sugestão de matéria | Google Gemini (`generativelanguage.googleapis.com`) | `VITE_GOOGLE_API_KEY` |
| `textToSpeech.js` | Leitura da anotação em voz alta | Google Cloud Text-to-Speech, com a síntese nativa do navegador como alternativa | `VITE_GOOGLE_TTS_KEY` |

## Chaves

As chaves ficam no arquivo `.env` da raiz do projeto. O Vite expõe ao navegador
apenas as variáveis com o prefixo `VITE_`, e elas são lidas em tempo de build —
depois de alterar o `.env` é preciso reiniciar o `npm run dev`.

Para usar chaves próprias sem mexer no `.env` versionado, copie `.env.example`
para `.env.local` (que tem prioridade e não vai para o Git).

## Contrato das funções

Todas as funções de `api.js` devolvem `{ ok: true, … }` em caso de sucesso ou
`{ ok: false, mensagem }` quando a chamada falha, para que a interface mostre um
recado ao usuário em vez de quebrar:

```js
const resposta = await gerarResumo(nota)
if (resposta.ok) console.log(resposta.titulo, resposta.resumo, resposta.pontosChave)
else console.log(resposta.mensagem)
```

`falar()` em `textToSpeech.js` segue o mesmo contrato. Se o Text-to-Speech em
nuvem não responder, a leitura continua pela `window.speechSynthesis`, de modo
que o recurso nunca fica indisponível.

## Onde aparecem na interface

- **Câmera** (`src/hooks/useCamera.js`): depois de uma captura com a câmera real,
  o texto da foto é reconhecido, a matéria da anotação é reclassificada e a
  análise (resumo e pontos-chave) é gerada em segundo plano.
- **Anotação** (`src/components/notas/TelaNota.jsx`): a análise da captura (OCR da
  foto + resumo e pontos-chave), o quiz gerado a pedido e a leitura do resumo em
  voz alta.
- **Álbum** (`src/components/notas/TelaAlbum.jsx`): item *Ouvir em voz alta* no
  menu de cada anotação.
- **Ajustes** (`src/components/paineis/TelaAjustes.jsx`): seção *Integrações*, com
  o status de cada serviço.
