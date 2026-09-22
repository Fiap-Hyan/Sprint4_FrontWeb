import { IconeAtualizar, IconeCompartilhar, IconeVoltar } from '../ui/Icones'
import { compartilharTexto } from '../../utils/compartilhar'
import { percentual, plural } from '../../utils/formato'
import { resumoDoResultado, tempoLegivel } from '../../utils/simulado'

/** Comentário do desempenho, na mesma linguagem do quiz da anotação. */
const comentario = (acertos, total) => {
  if (acertos === total) return '🎉 Resultado perfeito! Você acertou todas.'
  if (acertos >= total * 0.7) return '👏 Bom resultado. Revise o que ficou para trás.'
  if (acertos === 0) return 'Nenhum acerto desta vez. Releia os resumos e refaça o simulado.'
  return 'Dá para melhorar: os assuntos errados viraram pendências na aba Estudar.'
}

/**
 * Resultado do simulado entregue: nota, tempo e o gabarito pergunta a
 * pergunta, com a alternativa escolhida e a correta lado a lado.
 */
const TelaResultadoSimulado = ({ simulado, simulados, aoVoltar, aoAbrir, aoAvisar }) => {
  if (!simulado) {
    return (
      <section className="tela items-center justify-center px-6 text-center">
        <p className="text-sm text-texto-fraco">Este simulado não está mais disponível.</p>
      </section>
    )
  }

  const total = simulado.perguntas.length
  const nota = percentual(simulado.acertos, total)

  return (
    <section className="tela">
      <header className="flex items-center gap-2 px-4 pb-1 pt-4">
        <button
          type="button"
          onClick={aoVoltar}
          aria-label="Voltar"
          className="grid size-10 place-items-center rounded-full text-texto transition hover:bg-white/8"
        >
          <IconeVoltar tamanho={24} />
        </button>
        <h1 className="min-w-0 truncate text-xl font-semibold text-texto">{simulado.titulo}</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-3">
        <article className="rounded-[22px] bg-gradient-to-br from-[#2a1f56] to-[#1b1636] p-6 text-center">
          <p className="text-4xl font-semibold text-texto">
            {simulado.acertos}
            <span className="text-2xl text-texto-fraco">/{total}</span>
          </p>
          <p className="mt-1 text-[0.95rem] text-roxo-claro">{nota}% de acerto</p>
          {simulado.duracao > 0 && (
            <p className="mt-1 text-sm text-texto-fraco">
              Tempo: {tempoLegivel(simulado.duracao)}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-texto-medio">
            {comentario(simulado.acertos, total)}
          </p>
        </article>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              const novo = simulados.refazer(simulado.id)
              if (novo) aoAbrir('simulado', novo.id)
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-superficie-2 py-3 text-sm font-medium text-texto transition hover:bg-superficie-3"
          >
            <IconeAtualizar tamanho={19} /> Refazer
          </button>
          <button
            type="button"
            onClick={async () => {
              const aviso = await compartilharTexto(simulado.titulo, resumoDoResultado(simulado))
              if (aviso) aoAvisar(aviso)
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-superficie-2 py-3 text-sm font-medium text-texto transition hover:bg-superficie-3"
          >
            <IconeCompartilhar tamanho={19} /> Compartilhar
          </button>
        </div>

        <h2 className="mb-2 mt-6 text-[0.95rem] text-texto-medio">
          Gabarito · {plural(total, 'pergunta', 'perguntas')}
        </h2>

        <ol className="flex flex-col gap-2">
          {simulado.perguntas.map((pergunta, indice) => {
            // Chave por posição: enunciados podem se repetir e a ordem é fixa.
            const escolhida = simulado.respostas[indice]
            const acertou = escolhida === pergunta.correta

            return (
              <li
                key={indice}
                className={`rounded-2xl border px-4 py-3 ${
                  acertou ? 'border-verde/40 bg-verde/8' : 'border-vermelho/40 bg-vermelho/8'
                }`}
              >
                <p className="text-sm text-texto">
                  {indice + 1}. {pergunta.pergunta}
                </p>
                <p className="mt-1.5 text-sm text-texto-medio">
                  Sua resposta:{' '}
                  {escolhida === undefined ? 'em branco' : pergunta.opcoes[escolhida]}
                </p>
                {!acertou && (
                  <p className="text-sm text-verde">Correta: {pergunta.opcoes[pergunta.correta]}</p>
                )}
                <p className="mt-1 text-[0.78rem] text-texto-fraco">{pergunta.assunto}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default TelaResultadoSimulado
