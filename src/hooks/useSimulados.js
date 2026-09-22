import { useCallback, useMemo } from 'react'

import { gerarId } from '../utils/aleatorio'
import useLocalStorage from './useLocalStorage'

/** Dias que um simulado excluído espera na lixeira antes de sumir. */
const RETENCAO_LIXEIRA = 30

/**
 * Data no formato AAAA-MM-DD do fuso de quem está usando o aplicativo. É
 * montada campo a campo de propósito: `toISOString()` converte para UTC, e no
 * Brasil isso jogaria um simulado entregue depois das 21h para o dia seguinte,
 * quebrando a contagem de dias seguidos.
 */
const diaDe = (data) => {
  const momento = new Date(data)
  const mes = String(momento.getMonth() + 1).padStart(2, '0')
  const dia = String(momento.getDate()).padStart(2, '0')
  return `${momento.getFullYear()}-${mes}-${dia}`
}

/** Embaralha uma lista sem alterar a original (usado em "Refazer"). */
const embaralhar = (lista) => {
  const copia = [...lista]
  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const sorteado = Math.floor(Math.random() * (indice + 1))
    ;[copia[indice], copia[sorteado]] = [copia[sorteado], copia[indice]]
  }
  return copia
}

/**
 * Sequência de dias seguidos estudando, contada de trás para frente a partir
 * de hoje: se o estudante entregou algo hoje ou ontem, a sequência continua
 * viva; um dia vazio no meio encerra a contagem.
 */
const contarDiasSeguidos = (entregues) => {
  if (!entregues.length) return 0

  const dias = new Set(entregues.map((item) => diaDe(item.entregueEm)))
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  // Sem entrega hoje, a régua começa ontem (o dia de hoje ainda não acabou).
  let cursor = new Date(hoje)
  if (!dias.has(diaDe(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!dias.has(diaDe(cursor))) return 0
  }

  let total = 0
  while (dias.has(diaDe(cursor))) {
    total += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return total
}

/**
 * Hook customizado dos simulados: criação, respostas, correção, estatísticas
 * e a lista de "pendências" (assuntos que o estudante errou e ainda não
 * recuperou). Tudo mora no localStorage, como o resto do protótipo.
 */
const useSimulados = () => {
  const [simulados, setSimulados] = useLocalStorage('studycam:simulados', [])

  const ativos = useMemo(
    () =>
      simulados
        .filter((item) => !item.excluidoEm)
        .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)),
    [simulados],
  )

  const naLixeira = useMemo(
    () =>
      simulados
        .filter((item) => item.excluidoEm)
        .sort((a, b) => new Date(b.excluidoEm) - new Date(a.excluidoEm)),
    [simulados],
  )

  const entregues = useMemo(() => ativos.filter((item) => item.entregueEm), [ativos])

  /** Os três números do topo da aba Estudar. */
  const estatisticas = useMemo(() => {
    const totalPerguntas = entregues.reduce((soma, item) => soma + item.perguntas.length, 0)
    const totalAcertos = entregues.reduce((soma, item) => soma + (item.acertos || 0), 0)

    return {
      simulados: entregues.length,
      acertos: totalPerguntas ? Math.round((totalAcertos / totalPerguntas) * 100) : 0,
      diasSeguidos: contarDiasSeguidos(entregues),
    }
  }, [entregues])

  /**
   * Assuntos errados que ainda não foram recuperados. Um assunto sai da lista
   * sozinho quando o estudante acerta todas as perguntas dele no simulado mais
   * recente em que ele apareceu — é o que a dica da tela promete.
   */
  const pendencias = useMemo(() => {
    const mapa = new Map()

    // Do mais antigo para o mais novo: o resultado recente sobrescreve o velho.
    const ordem = [...entregues].sort((a, b) => new Date(a.entregueEm) - new Date(b.entregueEm))

    ordem.forEach((simulado) => {
      // Primeiro os erros de cada assunto dentro deste simulado. A contagem é
      // fechada antes de ir para o mapa geral porque um acerto numa pergunta
      // não apaga o erro de outra pergunta do mesmo assunto na mesma prova.
      const noSimulado = new Map()

      simulado.perguntas.forEach((pergunta, indice) => {
        const assunto = pergunta.assunto || simulado.titulo
        const errou = simulado.respostas[indice] !== pergunta.correta
        const atual = noSimulado.get(assunto) || { assunto, notaId: pergunta.notaId, erros: 0 }

        noSimulado.set(assunto, {
          ...atual,
          notaId: pergunta.notaId || atual.notaId,
          erros: atual.erros + (errou ? 1 : 0),
        })
      })

      // Só o resultado do simulado mais recente vale para o assunto: gabaritar
      // o assunto numa prova nova zera a pendência dele.
      noSimulado.forEach((valor, assunto) => mapa.set(assunto, valor))
    })

    return [...mapa.values()]
      .filter((item) => item.erros > 0)
      .sort((a, b) => b.erros - a.erros)
  }, [entregues])

  /**
   * Cria o simulado já pronto para responder.
   * @param {{titulo:string, perguntas:Array<object>, dificuldade:string,
   *   cronometro:boolean, respostaNaHora:boolean, notaIds:string[]}} dados
   */
  const criarSimulado = useCallback(
    (dados) => {
      const novo = {
        id: gerarId('sim'),
        titulo: dados.titulo || 'Simulado',
        criadoEm: new Date().toISOString(),
        dificuldade: dados.dificuldade || 'media',
        cronometro: Boolean(dados.cronometro),
        respostaNaHora: Boolean(dados.respostaNaHora),
        notaIds: dados.notaIds || [],
        perguntas: dados.perguntas || [],
        respostas: {},
        entregueEm: null,
        acertos: 0,
        duracao: 0,
        excluidoEm: null,
      }

      setSimulados((atual) => [novo, ...atual])
      return novo
    },
    [setSimulados],
  )

  const responder = useCallback(
    (id, indice, opcao) => {
      setSimulados((atual) =>
        atual.map((item) =>
          item.id === id ? { ...item, respostas: { ...item.respostas, [indice]: opcao } } : item,
        ),
      )
    },
    [setSimulados],
  )

  /**
   * Corrige o simulado e marca a entrega. Não devolve o resultado de
   * propósito: a tela de resultado lê o simulado já corrigido do estado, e
   * devolver um valor calculado dentro do setState traria o número errado (o
   * React só executa aquela função na renderização seguinte).
   */
  const entregar = useCallback(
    (id, duracao = 0) => {
      setSimulados((atual) =>
        atual.map((item) => {
          if (item.id !== id) return item

          const acertos = item.perguntas.reduce(
            (soma, pergunta, indice) => soma + (item.respostas[indice] === pergunta.correta ? 1 : 0),
            0,
          )

          return { ...item, acertos, duracao, entregueEm: new Date().toISOString() }
        }),
      )
    },
    [setSimulados],
  )

  /**
   * Refaz um simulado reaproveitando as perguntas já geradas, em outra ordem.
   * Não gasta uma nova consulta à IA — é o que a dica dos três pontinhos diz.
   */
  const refazer = useCallback(
    (id) => {
      const original = simulados.find((item) => item.id === id)
      if (!original) return null

      const novo = {
        ...original,
        id: gerarId('sim'),
        criadoEm: new Date().toISOString(),
        perguntas: embaralhar(original.perguntas),
        respostas: {},
        entregueEm: null,
        acertos: 0,
        duracao: 0,
        excluidoEm: null,
      }

      setSimulados((atual) => [novo, ...atual])
      return novo
    },
    [simulados, setSimulados],
  )

  const excluir = useCallback(
    (id) => {
      setSimulados((atual) =>
        atual.map((item) =>
          item.id === id ? { ...item, excluidoEm: new Date().toISOString() } : item,
        ),
      )
    },
    [setSimulados],
  )

  const restaurar = useCallback(
    (id) => {
      setSimulados((atual) =>
        atual.map((item) => (item.id === id ? { ...item, excluidoEm: null } : item)),
      )
    },
    [setSimulados],
  )

  const porId = useCallback((id) => simulados.find((item) => item.id === id) || null, [simulados])

  return {
    simulados: ativos,
    naLixeira,
    estatisticas,
    pendencias,
    retencaoLixeira: RETENCAO_LIXEIRA,
    porId,
    criarSimulado,
    responder,
    entregar,
    refazer,
    excluir,
    restaurar,
  }
}

export default useSimulados
