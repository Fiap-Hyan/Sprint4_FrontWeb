/* ============================================================================
 * Leitura em voz alta das anotações (acessibilidade do StudyCam AI)
 * ----------------------------------------------------------------------------
 * A síntese usa o Google Cloud Text-to-Speech com a chave `VITE_GOOGLE_TTS_KEY`
 * (arquivo `.env` da raiz). Se a requisição não puder ser concluída, a leitura
 * continua pela síntese nativa do navegador (`window.speechSynthesis`), de forma
 * que o recurso nunca fica indisponível para o usuário.
 *
 * O idioma e o tipo de voz vêm de Ajustes > Idioma e voz: a tela guarda apenas
 * "feminina" ou "masculina", e é aqui que essa escolha vira o nome da voz que o
 * serviço entende, para cada idioma.
 * ==========================================================================*/

/** Chave lida do `.env` (o Vite expõe apenas variáveis com prefixo VITE_). */
export const CHAVE_TTS = import.meta.env.VITE_GOOGLE_TTS_KEY ?? ''

/** Indica se a síntese em nuvem pode ser usada. */
export const TTS_ATIVO = CHAVE_TTS.length > 0

const ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize'

/** Limite de caracteres por requisição aceito pelo serviço. */
const LIMITE = 4800

/** As duas opções oferecidas na tela de Ajustes. */
export const TIPOS_DE_VOZ = [
  { id: 'feminina', rotulo: 'Feminina' },
  { id: 'masculina', rotulo: 'Masculina' },
]

/**
 * Vozes neurais do Google para cada idioma da tela de Ajustes. Idioma sem
 * entrada aqui cai no padrão do serviço para aquele código de língua.
 */
const VOZES_POR_IDIOMA = {
  'pt-BR': { feminina: 'pt-BR-Neural2-A', masculina: 'pt-BR-Neural2-B' },
  'en-US': { feminina: 'en-US-Neural2-F', masculina: 'en-US-Neural2-D' },
  'es-ES': { feminina: 'es-ES-Neural2-A', masculina: 'es-ES-Neural2-B' },
  'fr-FR': { feminina: 'fr-FR-Neural2-A', masculina: 'fr-FR-Neural2-B' },
  'de-DE': { feminina: 'de-DE-Neural2-A', masculina: 'de-DE-Neural2-B' },
  'ja-JP': { feminina: 'ja-JP-Neural2-B', masculina: 'ja-JP-Neural2-C' },
  'zh-CN': { feminina: 'cmn-CN-Wavenet-A', masculina: 'cmn-CN-Wavenet-B' },
}

/** Nome da voz do serviço a partir do idioma e do tipo escolhidos. */
export const nomeDaVoz = (idioma, tipo) => VOZES_POR_IDIOMA[idioma]?.[tipo] || null

/** Áudio em reprodução, guardado para que `parar()` possa interrompê-lo. */
let audioAtual = null

/** Caminho alternativo: síntese nativa do navegador, sem chave. */
const falarNoNavegador = (texto, { idioma, velocidade, aoTerminar }) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { ok: false, mensagem: 'Este navegador não tem suporte a síntese de voz.' }
  }

  window.speechSynthesis.cancel()
  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = idioma
  fala.rate = velocidade
  fala.onend = aoTerminar
  fala.onerror = aoTerminar
  window.speechSynthesis.speak(fala)

  return { ok: true, mensagem: 'Lendo com a voz do navegador' }
}

/**
 * Lê um texto em voz alta.
 * @param {string} texto conteúdo a narrar
 * @param {{idioma?:string, voz?:string, velocidade?:number, aoTerminar?:function}} opcoes
 *   `voz` é 'feminina' ou 'masculina'; `aoTerminar` é chamado quando a leitura
 *   acaba (ou é interrompida), para a tela voltar ao botão de ouvir
 * @returns {Promise<{ok:boolean, mensagem:string}>}
 */
export const falar = async (
  texto,
  { idioma = 'pt-BR', voz = 'feminina', velocidade = 1, aoTerminar = () => {} } = {},
) => {
  const conteudo = (texto || '').trim().slice(0, LIMITE)
  if (!conteudo) return { ok: false, mensagem: 'Não há texto para ler.' }

  parar()

  const alternativa = { idioma, velocidade, aoTerminar }
  if (!TTS_ATIVO) return falarNoNavegador(conteudo, alternativa)

  const nome = nomeDaVoz(idioma, voz)

  try {
    const resposta = await fetch(`${ENDPOINT}?key=${encodeURIComponent(CHAVE_TTS)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: conteudo },
        voice: {
          languageCode: idioma,
          ...(nome
            ? { name: nome }
            : { ssmlGender: voz === 'masculina' ? 'MALE' : 'FEMALE' }),
        },
        audioConfig: { audioEncoding: 'MP3', speakingRate: velocidade },
      }),
    })

    if (!resposta.ok) throw new Error(`O serviço de voz respondeu ${resposta.status}.`)

    const { audioContent } = await resposta.json()
    if (!audioContent) throw new Error('O serviço de voz não devolveu áudio.')

    audioAtual = new Audio(`data:audio/mp3;base64,${audioContent}`)
    audioAtual.onended = () => {
      audioAtual = null
      aoTerminar()
    }
    audioAtual.onerror = aoTerminar
    await audioAtual.play()

    return { ok: true, mensagem: 'Lendo em voz alta' }
  } catch {
    // A chave pode não ter o Text-to-Speech habilitado: cai para a voz nativa.
    return falarNoNavegador(conteudo, alternativa)
  }
}

/** Interrompe a leitura em andamento (em nuvem ou nativa). */
export const parar = () => {
  let interrompeu = false

  if (audioAtual) {
    audioAtual.pause()
    audioAtual.currentTime = 0
    audioAtual = null
    interrompeu = true
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (window.speechSynthesis.speaking) interrompeu = true
    window.speechSynthesis.cancel()
  }

  return interrompeu
}

/** Indica se o recurso pode ser oferecido ao usuário. */
export const disponivel = () =>
  TTS_ATIVO || (typeof window !== 'undefined' && 'speechSynthesis' in window)

export default { TTS_ATIVO, falar, parar, disponivel, TIPOS_DE_VOZ, nomeDaVoz }
