import { useEffect, useRef, useState } from 'react'

import { IconeFechar } from '../ui/Icones'
import { tempoLegivel } from '../../utils/simulado'

/**
 * Responder o simulado, uma pergunta por vez. Com "Mostrar resposta na hora"
 * ligado, a alternativa fica verde ou vermelha assim que é tocada; desligado,
 * a correção só aparece no resultado final.
 */
const TelaSimulado = ({ simulado, simulados, aoSair, aoTerminar }) => {
  const [indice, setIndice] = useState(0)
  const [segundos, setSegundos] = useState(0)
  const inicio = useRef(0)

  /* Cronômetro: conta o tempo mesmo quando não é exibido, para o resultado. */
  useEffect(() => {
    inicio.current = Date.now()

    const relogio = window.setInterval(
      () => setSegundos(Math.floor((Date.now() - inicio.current) / 1000)),
      1000,
    )

    return () => window.clearInterval(relogio)
  }, [])

  if (!simulado || !simulado.perguntas.length) {
    return (
      <section className="tela items-center justify-center px-6 text-center">
        <p className="text-sm text-texto-fraco">Este simulado não está mais disponível.</p>
      </section>
    )
  }

  const pergunta = simulado.perguntas[indice]
  const escolhida = simulado.respostas[indice]
  const respondida = escolhida !== undefined
  const ultima = indice + 1 >= simulado.perguntas.length

  const responder = (opcao) => {
    if (simulado.respostaNaHora && respondida) return
    simulados.responder(simulado.id, indice, opcao)
  }

  const avancar = () => {
    if (!ultima) {
      setIndice((atual) => atual + 1)
      return
    }

    simulados.entregar(simulado.id, segundos)
    aoTerminar(simulado.id)
  }

  /** Cor da alternativa quando a correção aparece na hora. */
  const estiloDaOpcao = (opcao) => {
    const base = 'w-full rounded-2xl border px-4 py-4 text-start text-[0.95rem] transition'

    if (!simulado.respostaNaHora || !respondida) {
      return `${base} ${
        escolhida === opcao
          ? 'border-roxo bg-roxo/15 text-texto'
          : 'border-white/10 bg-superficie text-texto-medio hover:bg-superficie-2'
      }`
    }

    if (opcao === pergunta.correta) return `${base} border-verde bg-verde/15 text-texto`
    if (opcao === escolhida) return `${base} border-vermelho bg-vermelho/15 text-texto`
    return `${base} border-white/10 bg-superficie text-texto-fraco`
  }

  return (
    <section className="tela">
      <header className="flex items-center justify-between px-4 pb-3 pt-4">
        <button
          type="button"
          onClick={aoSair}
          aria-label="Sair do simulado"
          className="grid size-10 place-items-center rounded-full text-texto transition hover:bg-white/8"
        >
          <IconeFechar tamanho={22} />
        </button>

        <p className="text-[0.95rem] text-texto">
          {indice + 1} de {simulado.perguntas.length}
        </p>

        <span className="w-10 text-end text-sm tabular-nums text-texto-fraco">
          {simulado.cronometro ? tempoLegivel(segundos) : ''}
        </span>
      </header>

      {/* Uma barrinha por pergunta, acesa conforme o estudante avança. */}
      <div className="flex gap-1 px-4" aria-hidden="true">
        {/* A chave é a posição: o modelo pode repetir um enunciado, e a lista
            de perguntas nunca é reordenada depois de gerada. */}
        {simulado.perguntas.map((item, posicao) => (
          <span
            key={posicao}
            className={`h-1 flex-1 rounded-full ${
              posicao <= indice ? 'bg-roxo' : 'bg-white/12'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6">
        <h1 className="text-xl font-semibold leading-snug text-texto">{pergunta.pergunta}</h1>

        <ul className="mt-6 flex flex-col gap-3">
          {pergunta.opcoes.map((opcao, posicao) => (
            <li key={posicao}>
              <button
                type="button"
                onClick={() => responder(posicao)}
                aria-pressed={escolhida === posicao}
                className={estiloDaOpcao(posicao)}
              >
                {opcao}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <footer className="shrink-0 px-5 pb-4 pt-2">
        <button
          type="button"
          onClick={avancar}
          disabled={!respondida}
          className="w-full rounded-2xl bg-gradient-to-r from-roxo to-roxo-escuro py-4 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
        >
          {ultima ? 'Entregar' : 'Próxima'}
        </button>
      </footer>
    </section>
  )
}

export default TelaSimulado
