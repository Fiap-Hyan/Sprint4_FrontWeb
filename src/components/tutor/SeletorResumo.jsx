import { useState } from 'react'

import { IconeMarcador, IconeSetaDireita, IconeVoltar } from '../ui/Icones'
import { corHex } from '../../data/cores'
import { plural } from '../../utils/formato'

/**
 * Escolha do resumo que vai ser anexado à conversa, em dois passos: primeiro o
 * álbum, depois o resumo dentro dele — igual ao "+" do tutor no aplicativo.
 */
const SeletorResumo = ({ biblioteca, aoEscolher, aoFechar }) => {
  const [albumId, setAlbumId] = useState(null)

  const album = biblioteca.albuns.find((item) => item.id === albumId) || null
  const notas = album ? biblioteca.notasDoAlbum(album.id) : []

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end bg-black/55"
      onClick={aoFechar}
      role="presentation"
    >
      <section
        className="max-h-[70%] overflow-y-auto rounded-t-[26px] border-t border-white/10 bg-cartao-2 p-5"
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="mb-4 flex items-center gap-2">
          {album && (
            <button
              type="button"
              onClick={() => setAlbumId(null)}
              aria-label="Voltar para os álbuns"
              className="grid size-8 place-items-center rounded-full text-texto-medio transition hover:bg-white/8"
            >
              <IconeVoltar tamanho={20} />
            </button>
          )}
          <div>
            <h2 className="text-base font-semibold text-texto">Anexar um resumo</h2>
            <p className="text-sm text-texto-fraco">
              {album ? album.nome : 'Escolha o álbum'}
            </p>
          </div>
        </header>

        {!album && (
          <ul className="flex flex-col gap-2">
            {biblioteca.albuns.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setAlbumId(item.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-3 py-3 text-start transition hover:bg-white/5"
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-2xl text-white"
                    style={{ backgroundColor: corHex(item.cor) }}
                  >
                    <IconeMarcador tamanho={24} corFita={corHex(item.cor)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.95rem] text-texto">{item.nome}</span>
                    <span className="block text-sm text-texto-fraco">
                      {plural(biblioteca.contarNotas(item.id), 'resumo', 'resumos')}
                    </span>
                  </span>
                  <IconeSetaDireita tamanho={18} />
                </button>
              </li>
            ))}

            {!biblioteca.albuns.length && (
              <li className="py-6 text-center text-sm text-texto-fraco">
                Nenhuma matéria ainda. Fotografe um quadro para criar a primeira.
              </li>
            )}
          </ul>
        )}

        {album && (
          <ul className="flex flex-col gap-2">
            {notas.map((nota) => (
              <li key={nota.id}>
                <button
                  type="button"
                  onClick={() => aoEscolher(nota.id)}
                  className="w-full rounded-2xl border border-white/10 px-4 py-3 text-start transition hover:bg-white/5"
                >
                  <span className="block truncate text-[0.95rem] text-texto">{nota.titulo}</span>
                  <span className="block truncate text-sm text-texto-fraco">
                    {nota.resumo || 'Resumo ainda não gerado'}
                  </span>
                </button>
              </li>
            ))}

            {!notas.length && (
              <li className="py-6 text-center text-sm text-texto-fraco">
                Este álbum ainda não tem resumos.
              </li>
            )}
          </ul>
        )}
      </section>
    </div>
  )
}

export default SeletorResumo
