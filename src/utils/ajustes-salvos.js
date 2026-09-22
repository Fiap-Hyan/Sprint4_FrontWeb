import { AJUSTES_INICIAIS } from '../data/biblioteca-inicial'

const CHAVE_AJUSTES = 'studycam:ajustes'
const CHAVE_CAMERA_PEDIDA = 'studycam:camera-pedida'

/** Lê os ajustes salvos; devolve null quando não há nada (ou está corrompido). */
const lerSalvos = () => {
  try {
    const salvo = window.localStorage.getItem(CHAVE_AJUSTES)
    return salvo ? JSON.parse(salvo) : null
  } catch {
    return null
  }
}

/**
 * Acerta os ajustes guardados no navegador antes da primeira renderização
 * (chamada em src/main.jsx). Faz duas coisas:
 *
 * 1. Completa as chaves que não existiam quando o usuário salvou os ajustes —
 *    sem isso, quem já usou o protótipo ficaria com `idioma` e `voz`
 *    indefinidos quando essas opções foram criadas.
 * 2. Liga a câmera real uma única vez por navegador: ela passou a ser pedida
 *    ao entrar no protótipo, e `AJUSTES_INICIAIS.usarWebcam` já vem ligado
 *    para quem chega agora. Depois dessa vez, vale a escolha feita em Ajustes.
 *
 * A permissão em si só é solicitada quando a tela da câmera aparece
 * (src/hooks/useWebcam.js).
 */
export const prepararAjustesSalvos = () => {
  try {
    const salvos = lerSalvos()
    // Sem ajustes salvos é o primeiro acesso: AJUSTES_INICIAIS já resolve.
    if (!salvos) {
      window.localStorage.setItem(CHAVE_CAMERA_PEDIDA, 'true')
      return
    }

    const primeiraVez = !window.localStorage.getItem(CHAVE_CAMERA_PEDIDA)
    if (primeiraVez) window.localStorage.setItem(CHAVE_CAMERA_PEDIDA, 'true')

    window.localStorage.setItem(
      CHAVE_AJUSTES,
      JSON.stringify({
        ...AJUSTES_INICIAIS,
        ...salvos,
        ...(primeiraVez ? { usarWebcam: true } : {}),
      }),
    )
  } catch {
    // localStorage indisponível (aba anônima) ou ajustes corrompidos: nada a
    // fazer, o protótipo segue com os ajustes iniciais.
  }
}

export default prepararAjustesSalvos
