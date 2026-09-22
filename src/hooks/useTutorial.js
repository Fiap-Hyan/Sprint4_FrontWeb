import { useCallback, useMemo, useState } from 'react'

import { TUTORIAIS } from '../data/tutorial'
import useLocalStorage from './useLocalStorage'

/**
 * Hook customizado das dicas de primeiro uso. Guarda quais telas o usuário já
 * viu e devolve o passo atual da tela aberta.
 *
 * O passo é estado da sessão (não do localStorage): fechar o app no meio do
 * tutorial de uma tela faz a tela recomeçar da primeira dica, que é o
 * comportamento do aplicativo.
 */
const useTutorial = (telaAtual) => {
  const [vistas, setVistas] = useLocalStorage('studycam:tutorial-visto', [])
  /**
   * O progresso é guardado junto da tela a que pertence: ao navegar, o passo
   * da tela anterior não vale mais e a contagem recomeça do zero. Sem isso,
   * sair de um roteiro longo para um curto apontaria para um passo que não
   * existe. `exibiu` lembra se alguma dica daquela tela chegou a aparecer.
   */
  const [progresso, setProgresso] = useState({ tela: null, passo: 0, exibiu: false })
  // Tela cujo tutorial já terminou nesta sessão, para não reabrir ao navegar.
  const [encerradaAgora, setEncerradaAgora] = useState(null)

  const roteiro = TUTORIAIS[telaAtual] || null
  const jaViu = vistas.includes(telaAtual)
  const ativo = Boolean(roteiro) && !jaViu && encerradaAgora !== telaAtual

  const daTela = progresso.tela === telaAtual
  const passo = daTela ? progresso.passo : 0
  const exibiu = daTela ? progresso.exibiu : false

  const dica = useMemo(() => {
    if (!ativo || !roteiro) return null
    return { ...roteiro[passo], passo, total: roteiro.length }
  }, [ativo, passo, roteiro])

  /**
   * Fecha o tutorial da tela.
   * @param {boolean} marcarVista quando falso, a tela não entra na lista de
   *   vistas — é o caso de um roteiro inteiro pulado porque nenhum dos alvos
   *   existia ainda (uma anotação sem análise, por exemplo), para que as dicas
   *   apareçam quando a tela estiver completa.
   */
  const encerrar = useCallback(
    (marcarVista = true) => {
      if (marcarVista) {
        setVistas((atual) => (atual.includes(telaAtual) ? atual : [...atual, telaAtual]))
      }

      setEncerradaAgora(telaAtual)
      setProgresso({ tela: null, passo: 0, exibiu: false })
    },
    [setVistas, telaAtual],
  )

  /**
   * Vai para a próxima dica.
   * @param {boolean} exibida falso quando a dica foi pulada em silêncio por o
   *   elemento dela não estar na tela
   */
  const avancar = useCallback(
    (exibida = true) => {
      if (!roteiro) return

      const jaExibiuAlguma = exibiu || exibida

      if (passo + 1 >= roteiro.length) {
        encerrar(jaExibiuAlguma)
        return
      }

      setProgresso({ tela: telaAtual, passo: passo + 1, exibiu: jaExibiuAlguma })
    },
    [encerrar, exibiu, passo, roteiro, telaAtual],
  )

  /** Ajustes > "Ver tutorial de novo": apaga o histórico de telas vistas. */
  const reiniciar = useCallback(() => {
    setVistas([])
    setEncerradaAgora(null)
    setProgresso({ tela: null, passo: 0, exibiu: false })
  }, [setVistas])

  return { dica, avancar, pular: () => encerrar(true), reiniciar }
}

export default useTutorial
