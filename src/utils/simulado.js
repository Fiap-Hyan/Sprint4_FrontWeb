/* ============================================================================
 * Ações de um simulado que saem do aplicativo (agenda e compartilhamento)
 * ==========================================================================*/

/** Data no formato que o Google Agenda espera: 20260922T190000Z. */
const paraAgenda = (data) => data.toISOString().replace(/[-:]|\.\d{3}/g, '')

/** Meia hora reservada para responder, começando amanhã às 19h. */
const DURACAO_MINUTOS = 30

/**
 * Link de "Agendar no calendário": cria o evento no Google Agenda já com o
 * endereço que reabre este mesmo simulado no protótipo.
 *
 * O simulado pode ainda não existir — é o caso de agendar antes de gerar as
 * perguntas, na tela de montagem. Sem `id`, o evento aponta para a aba Estudar
 * em vez de um simulado que não seria encontrado.
 *
 * @param {{id?:string, titulo:string, perguntas:Array<object>}} simulado
 * @returns {string} endereço para abrir em outra aba
 */
export const agendaDoSimulado = (simulado) => {
  const inicio = new Date()
  inicio.setDate(inicio.getDate() + 1)
  inicio.setHours(19, 0, 0, 0)

  const fim = new Date(inicio.getTime() + DURACAO_MINUTOS * 60 * 1000)
  const endereco = simulado.id
    ? `${window.location.origin}/app?simulado=${simulado.id}`
    : `${window.location.origin}/app`

  const parametros = new URLSearchParams({
    action: 'TEMPLATE',
    text: `StudyCam AI · ${simulado.titulo}`,
    dates: `${paraAgenda(inicio)}/${paraAgenda(fim)}`,
    details:
      `Simulado com ${simulado.perguntas.length} perguntas, montado no StudyCam AI.\n\n` +
      `Abrir: ${endereco}`,
  })

  return `https://calendar.google.com/calendar/render?${parametros}`
}

/** Texto do resultado, usado ao compartilhar um simulado já entregue. */
export const resumoDoResultado = (simulado) => {
  const total = simulado.perguntas.length
  const situacao = simulado.entregueEm
    ? `Resultado: ${simulado.acertos} de ${total} (${Math.round((simulado.acertos / total) * 100)}%)`
    : `Ainda não entregue · ${total} perguntas`

  return [simulado.titulo, situacao, '', 'Montado no StudyCam AI.'].join('\n')
}

/** Cronômetro do simulado no formato mm:ss. */
export const tempoLegivel = (segundos) => {
  const minutos = Math.floor(segundos / 60)
  const resto = segundos % 60
  return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`
}

export default agendaDoSimulado
