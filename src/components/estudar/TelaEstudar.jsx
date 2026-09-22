import { useState } from 'react'

import MenuContexto from '../ui/MenuContexto'
import {
  IconeAtualizar,
  IconeCalendario,
  IconeCompartilhar,
  IconeLixeira,
  IconeMarcador,
  IconeMenuVertical,
} from '../ui/Icones'
import { agendaDoSimulado, resumoDoResultado } from '../../utils/simulado'
import { compartilharTexto } from '../../utils/compartilhar'
import { dataCurta, plural } from '../../utils/formato'
import { posicaoDoEvento } from '../../utils/posicao'

/** Um dos três números do topo da aba. */
const Numero = ({ valor, rotulo }) => (
  <div className="flex-1 rounded-[18px] bg-superficie px-2 py-3 text-center">
    <p className="text-2xl font-semibold text-texto">{valor}</p>
    <p className="mt-0.5 text-[0.72rem] text-texto-fraco">{rotulo}</p>
  </div>
)

/**
 * Aba Estudar: acompanha o desempenho, abre a montagem de um simulado novo,
 * lista os assuntos que ficaram pendentes e o histórico das provas feitas.
 */
const TelaEstudar = ({ simulados, aoAbrir, aoAvisar }) => {
  const [menu, setMenu] = useState(null)

  const { estatisticas, pendencias } = simulados

  const abrirMenu = (evento, simulado) =>
    setMenu({ simulado, posicao: posicaoDoEvento(evento) })

  const itensDoMenu = (simulado) => [
    {
      rotulo: 'Refazer',
      icone: <IconeAtualizar tamanho={19} />,
      acao: () => {
        const novo = simulados.refazer(simulado.id)
        if (novo) aoAbrir('simulado', novo.id)
      },
    },
    {
      rotulo: 'Agendar no calendário',
      icone: <IconeCalendario tamanho={19} />,
      acao: () => {
        window.open(agendaDoSimulado(simulado), '_blank', 'noopener')
        aoAvisar('Evento aberto no Google Agenda')
      },
    },
    {
      rotulo: 'Compartilhar',
      icone: <IconeCompartilhar tamanho={19} />,
      acao: async () => {
        const aviso = await compartilharTexto(simulado.titulo, resumoDoResultado(simulado))
        if (aviso) aoAvisar(aviso)
      },
    },
    {
      rotulo: 'Excluir',
      icone: <IconeLixeira tamanho={19} />,
      perigo: true,
      acao: () => {
        simulados.excluir(simulado.id)
        aoAvisar('Simulado movido para a lixeira')
      },
    },
  ]

  return (
    <section className="tela">
      <header className="px-5 pb-2 pt-4">
        <h1 className="text-[1.7rem] font-semibold text-texto">Estudar</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div data-dica="estudar-numeros" className="flex gap-2">
          <Numero valor={estatisticas.simulados} rotulo="simulados" />
          <Numero valor={`${estatisticas.acertos}%`} rotulo="acertos" />
          <Numero valor={estatisticas.diasSeguidos} rotulo="dias seguidos" />
        </div>

        <article
          data-dica="estudar-novo"
          className="mt-3 rounded-[22px] bg-gradient-to-br from-[#2a1f56] to-[#1b1636] p-5"
        >
          <p className="text-sm text-texto-medio">Montar do zero</p>
          <h2 className="mt-0.5 text-xl font-semibold text-texto">Novo simulado</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-texto-medio">
            Junte várias matérias e escolha quantas perguntas quer responder.
          </p>
          <button
            type="button"
            onClick={() => aoAbrir('escolher-conteudo')}
            className="mt-4 w-full rounded-2xl bg-white py-3.5 text-[0.95rem] font-semibold text-[#2a1f56] transition hover:bg-white/90"
          >
            Escolher conteúdo
          </button>
        </article>

        {pendencias.length > 0 && (
          <section data-dica="estudar-pendencias" className="mt-6">
            <header className="mb-2 flex items-baseline justify-between">
              <h2 className="text-[0.95rem] text-texto-medio">Revisar pendências</h2>
              <span className="text-sm text-texto-fraco">
                {plural(pendencias.length, 'assunto', 'assuntos')}
              </span>
            </header>

            <ul className="flex flex-col gap-2">
              {pendencias.map((item) => (
                <li
                  key={item.assunto}
                  className="flex items-center gap-3 rounded-2xl bg-superficie px-3 py-3"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ambar/15 text-ambar">
                    <IconeMarcador tamanho={22} corFita="transparent" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.95rem] text-texto">{item.assunto}</span>
                    <span className="block text-sm text-texto-fraco">
                      {plural(item.erros, 'erro', 'erros')}
                    </span>
                  </span>
                  <button
                    type="button"
                    disabled={!item.notaId}
                    onClick={() => aoAbrir('nota', item.notaId)}
                    className="shrink-0 rounded-full bg-superficie-3 px-4 py-2 text-sm font-medium text-texto transition hover:bg-superficie-4 disabled:opacity-40"
                  >
                    Rever
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-[0.95rem] text-texto-medio">Histórico</h2>
          <p className="mb-2 text-sm text-texto-fraco">
            Toque para ver o resultado · nos três pontinhos, refazer e mais
          </p>

          <ul className="flex flex-col gap-2">
            {simulados.simulados.map((simulado) => (
              <li key={simulado.id} className="flex items-center gap-1 rounded-2xl bg-superficie">
                <button
                  type="button"
                  onClick={() =>
                    aoAbrir(simulado.entregueEm ? 'resultado' : 'simulado', simulado.id)
                  }
                  className="min-w-0 flex-1 px-4 py-3.5 text-start"
                >
                  <span className="block truncate text-[0.95rem] text-texto">
                    {simulado.titulo}
                  </span>
                  <span className="block text-sm text-texto-fraco">
                    {dataCurta(simulado.criadoEm)} ·{' '}
                    {simulado.entregueEm
                      ? `${simulado.acertos}/${simulado.perguntas.length}`
                      : 'não entregue'}
                  </span>
                </button>

                <button
                  type="button"
                  data-dica="estudar-acoes"
                  onClick={(evento) => abrirMenu(evento, simulado)}
                  aria-label={`Opções de ${simulado.titulo}`}
                  className="me-2 grid size-10 shrink-0 place-items-center rounded-full text-texto-medio transition hover:bg-white/8"
                >
                  <IconeMenuVertical tamanho={20} />
                </button>
              </li>
            ))}

            {!simulados.simulados.length && (
              <li className="rounded-2xl bg-superficie px-4 py-8 text-center text-sm text-texto-fraco">
                Nenhum simulado ainda. Monte o primeiro a partir dos seus resumos.
              </li>
            )}
          </ul>
        </section>
      </div>

      {menu && (
        <MenuContexto
          titulo={menu.simulado.titulo}
          itens={itensDoMenu(menu.simulado)}
          posicao={menu.posicao}
          aoFechar={() => setMenu(null)}
        />
      )}
    </section>
  )
}

export default TelaEstudar
