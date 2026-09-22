import { useState } from 'react'

import { IconeMarcador, IconeSelecao, IconeVoltar } from '../ui/Icones'
import { corHex } from '../../data/cores'
import { plural } from '../../utils/formato'

/**
 * Passo 1 de 2 da montagem do simulado: escolher de onde vêm as perguntas.
 * Marcar o álbum inteiro seleciona todos os resumos dele; tocar no nome abre
 * a lista para escolher um a um.
 *
 * Só entram resumos já analisados pela IA — sem resumo não há conteúdo para o
 * modelo transformar em pergunta.
 */
const TelaEscolherConteudo = ({ biblioteca, aoVoltar, aoContinuar }) => {
  const [escolhidas, setEscolhidas] = useState([])
  const [abertoId, setAbertoId] = useState(null)

  /** Resumos de um álbum que servem para gerar perguntas. */
  const resumosDe = (albumId) =>
    biblioteca.notasDoAlbum(albumId).filter((nota) => nota.resumo || nota.texto)

  const alternarNota = (id) =>
    setEscolhidas((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id],
    )

  const alternarAlbum = (albumId) => {
    const ids = resumosDe(albumId).map((nota) => nota.id)
    const todosMarcados = ids.length > 0 && ids.every((id) => escolhidas.includes(id))

    setEscolhidas((atual) =>
      todosMarcados
        ? atual.filter((id) => !ids.includes(id))
        : [...new Set([...atual, ...ids])],
    )
  }

  const aberto = biblioteca.albuns.find((album) => album.id === abertoId) || null

  /** Nenhuma anotação analisada em lugar nenhum: a tela explica o porquê. */
  const semConteudo = !biblioteca.albuns.some((album) => resumosDe(album.id).length)

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
        <h1 className="text-xl font-semibold text-texto">Escolher conteúdo</h1>
      </header>

      <p className="px-5 pb-3 text-sm text-texto-fraco">
        Passo 1 de 2 · toque num álbum para escolher os resumos
      </p>

      <ul className="flex-1 overflow-y-auto px-4 pb-4">
        {biblioteca.albuns.map((album) => {
          const resumos = resumosDe(album.id)
          const marcados = resumos.filter((nota) => escolhidas.includes(nota.id)).length
          const todos = resumos.length > 0 && marcados === resumos.length
          const estaAberto = aberto?.id === album.id

          return (
            <li key={album.id} className="mb-2">
              <div className="flex items-center gap-2 rounded-2xl bg-superficie px-3 py-3">
                <button
                  type="button"
                  onClick={() => alternarAlbum(album.id)}
                  disabled={!resumos.length}
                  aria-label={`Selecionar todos os resumos de ${album.nome}`}
                  aria-pressed={todos}
                  className={`shrink-0 transition disabled:opacity-30 ${
                    todos ? 'text-roxo' : 'text-texto-fraco hover:text-texto'
                  }`}
                >
                  <IconeSelecao tamanho={24} marcado={todos} />
                </button>

                <button
                  type="button"
                  onClick={() => setAbertoId(estaAberto ? null : album.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-start"
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-2xl text-white"
                    style={{ backgroundColor: corHex(album.cor) }}
                  >
                    <IconeMarcador tamanho={24} corFita={corHex(album.cor)} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.95rem] text-texto">{album.nome}</span>
                    <span className="block text-sm text-texto-fraco">
                      {plural(resumos.length, 'anotação', 'anotações')}
                      {marcados > 0 && ` · ${marcados} escolhida(s)`}
                    </span>
                  </span>
                </button>
              </div>

              {estaAberto && (
                <ul className="ms-8 mt-1.5 flex flex-col gap-1.5">
                  {resumos.map((nota) => {
                    const marcada = escolhidas.includes(nota.id)

                    return (
                      <li key={nota.id}>
                        <button
                          type="button"
                          onClick={() => alternarNota(nota.id)}
                          aria-pressed={marcada}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-start transition ${
                            marcada
                              ? 'border-roxo/60 bg-roxo/10'
                              : 'border-white/10 hover:bg-white/5'
                          }`}
                        >
                          <span className={marcada ? 'text-roxo' : 'text-texto-fraco'}>
                            <IconeSelecao tamanho={21} marcado={marcada} />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm text-texto">
                            {nota.titulo}
                          </span>
                        </button>
                      </li>
                    )
                  })}

                  {!resumos.length && (
                    <li className="py-3 text-sm text-texto-fraco">
                      Nenhum resumo analisado neste álbum ainda.
                    </li>
                  )}
                </ul>
              )}
            </li>
          )
        })}

        {!biblioteca.albuns.length && (
          <li className="py-10 text-center text-sm text-texto-fraco">
            Fotografe um quadro para criar a primeira matéria.
          </li>
        )}

        {Boolean(biblioteca.albuns.length) && semConteudo && (
          <li className="mt-2 rounded-2xl bg-superficie px-4 py-5 text-sm leading-relaxed text-texto-medio">
            Nenhuma anotação foi analisada ainda. Abra uma anotação e toque em{' '}
            <strong className="text-texto">Analisar com IA</strong> — é o resumo dela que vira as
            perguntas do simulado.
          </li>
        )}
      </ul>

      <footer className="shrink-0 px-4 pb-4">
        <p className="pb-2 text-center text-sm text-texto-fraco">
          {escolhidas.length
            ? plural(escolhidas.length, 'anotação selecionada', 'anotações selecionadas')
            : 'Nenhuma anotação selecionada'}
        </p>
        <button
          type="button"
          disabled={!escolhidas.length}
          onClick={() => aoContinuar(escolhidas)}
          className="w-full rounded-2xl bg-roxo py-3.5 text-[0.95rem] font-semibold text-white transition hover:brightness-110 disabled:bg-superficie-2 disabled:text-texto-fraco"
        >
          Continuar
        </button>
      </footer>
    </section>
  )
}

export default TelaEscolherConteudo
