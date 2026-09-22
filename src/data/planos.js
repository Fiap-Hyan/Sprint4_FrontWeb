/* ============================================================================
 * Planos do StudyCam AI (tela Ajustes > Planos)
 * ----------------------------------------------------------------------------
 * Durante o período de testes do Challenge todo mundo usa o Premium por
 * cortesia — a cobrança não está ativa. Os limites do plano Gratuito ficam
 * aqui, e não espalhados pelas telas, para que uma mudança de modelo de
 * negócio seja feita em um lugar só.
 * ==========================================================================*/

export const PLANOS = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    destaque: false,
    itens: [
      '3 resumos por mês',
      '3 simulados por mês',
      '15 perguntas ao tutor por mês',
      'Sem narração em áudio',
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    destaque: true,
    itens: [
      'Resumos ilimitados',
      'Simulados ilimitados',
      'Tutor sem limite de perguntas',
      'Narração em áudio de todos os resumos',
    ],
  },
]

/** Plano em vigor no protótipo. */
export const PLANO_ATUAL = 'premium'

export const AVISO_COBRANCA = 'A cobrança ainda não está ativa. Nada é cobrado neste período.'

export default PLANOS
