/**
 * Conjunto de estilos de cada rota. O atributo `data-pagina` no <html> é o que
 * separa os três visuais do projeto: a landing rola a página e tem tema
 * claro/escuro, o aplicativo ocupa a tela inteira com fundo escuro fixo, e a
 * tela de entrada é escura mas continua rolando.
 *
 * Fica fora do App.jsx porque o main.jsx precisa marcar o <html> antes da
 * primeira renderização, para o CSS certo já valer na primeira pintura (evita
 * o "pisca" de estilo trocado).
 *
 * @param {string} caminho rota atual (`location.pathname`)
 * @returns {'site'|'entrar'|'app'}
 */
export const paginaDaRota = (caminho = window.location.pathname) => {
  if (caminho.startsWith('/app')) return 'app'
  if (caminho.startsWith('/entrar')) return 'entrar'
  return 'site'
}

export default paginaDaRota
