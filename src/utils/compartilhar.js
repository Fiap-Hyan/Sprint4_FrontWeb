/* ============================================================================
 * Compartilhar e copiar texto
 * ----------------------------------------------------------------------------
 * O aplicativo Android abre a folha de compartilhamento do sistema. No
 * navegador isso só existe onde a Web Share API está disponível (celulares e
 * alguns navegadores em HTTPS); nos demais, o texto vai para a área de
 * transferência, que é o mais próximo disso. As duas funções devolvem a
 * mensagem pronta para o aviso da interface.
 * ==========================================================================*/

/** Copia um texto e devolve o aviso a ser mostrado. */
export const copiarTexto = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto)
    return 'Copiado para a área de transferência'
  } catch {
    return 'Não foi possível copiar nesta janela'
  }
}

/**
 * Compartilha pelo sistema; sem suporte, copia.
 * @returns {Promise<string|null>} aviso a mostrar, ou null quando o usuário
 *   cancelou a folha de compartilhamento (aí não há nada a dizer)
 */
export const compartilharTexto = async (titulo, texto) => {
  if (navigator.share) {
    try {
      await navigator.share({ title: titulo, text: texto })
      return null
    } catch {
      // o compartilhamento do sistema foi cancelado pelo usuário
      return null
    }
  }

  return copiarTexto(texto)
}

export default compartilharTexto
