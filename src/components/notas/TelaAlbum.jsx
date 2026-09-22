import { useRef, useState } from 'react'

import CartaoNota from './CartaoNota'
import CabecalhoTela from '../ui/CabecalhoTela'
import Dialogo from '../ui/Dialogo'
import MenuContexto from '../ui/MenuContexto'
import { posicaoDoEvento } from '../../utils/posicao'
import { arquivoParaMiniatura } from '../../utils/imagem'
import { exportarNota } from '../../utils/exportar'
import { falar } from '../../services/textToSpeech'
import {
  IconeAltoFalante,
  IconeBusca,
  IconeEscudo,
  IconeExportar,
  IconeGaleria,
  IconeLapis,
  IconeLixeira,
  IconeMenuVertical,
  IconeMover,
} from '../ui/Icones'

const ORDENS = {
  recentes: { rotulo: 'Mais recentes', comparar: (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm) },
  antigas: { rotulo: 'Mais antigas', comparar: (a, b) => new Date(a.criadoEm) - new Date(b.criadoEm) },
  titulo: { rotulo: 'Título (A-Z)', comparar: (a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR') },
}

/** Grade de anotações de uma matéria (tela aberta ao tocar em um álbum). */
const TelaAlbum = ({ biblioteca, albumId, aoVoltar, aoAbrir, aoAvisar }) => {
  const [menu, setMenu] = useState(null)
  const [dialogo, setDialogo] = useState(null)
  const [rascunho, setRascunho] = useState('')
  const [ordem, setOrdem] = useState('recentes')
  const entradaArquivo = useRef(null)

  const album = biblioteca.albuns.find((item) => item.id === albumId)
  const notas = [...biblioteca.notasDoAlbum(albumId)].sort(ORDENS[ordem].comparar)

  if (!album) {
    return (
      <section className="tela tela--conteudo">
        <CabecalhoTela titulo="Álbum" aoVoltar={aoVoltar} />
        <p className="estado-vazio">Este álbum não existe mais.</p>
      </section>
    )
  }

  const importarImagem = async (evento) => {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return
    try {
      const miniatura = await arquivoParaMiniatura(arquivo)
      biblioteca.adicionarNota({
        titulo: arquivo.name.replace(/\.[^.]+$/, '').slice(0, 40) || 'Imagem importada',
        albumId,
        tipo: 'slide',
        imagem: miniatura,
        confiancaIA: 0,
      })
      aoAvisar('Imagem importada para o álbum')
    } catch (erro) {
      aoAvisar(erro.message || 'Não foi possível importar a imagem')
    }
  }

  const abrirMenuCabecalho = (evento) => {
    setMenu({
      posicao: posicaoDoEvento(evento),
      titulo: album.nome,
      itens: [
        {
          rotulo: 'Importar imagem',
          icone: <IconeGaleria tamanho={20} />,
          acao: () => entradaArquivo.current?.click(),
        },
        ...Object.entries(ORDENS).map(([chave, valor]) => ({
          rotulo: valor.rotulo,
          icone: <IconeMover tamanho={20} />,
          acao: () => setOrdem(chave),
        })),
      ],
    })
  }

  const abrirMenuNota = (evento, nota) => {
    setMenu({
      posicao: posicaoDoEvento(evento),
      titulo: nota.titulo,
      itens: [
        {
          rotulo: 'Renomear',
          icone: <IconeLapis tamanho={20} />,
          acao: () => {
            setRascunho(nota.titulo)
            setDialogo({ tipo: 'renomear', nota })
          },
        },
        {
          rotulo: 'Mover para…',
          icone: <IconeMover tamanho={20} />,
          acao: () => setDialogo({ tipo: 'mover', nota }),
        },
        {
          rotulo: 'Ouvir em voz alta',
          icone: <IconeAltoFalante tamanho={20} />,
          acao: async () => {
            const resposta = await falar(nota.texto || nota.resumo || nota.titulo)
            aoAvisar(resposta.mensagem)
          },
        },
        {
          rotulo: nota.privada ? 'Tornar visível' : 'Marcar como privada',
          icone: <IconeEscudo tamanho={20} />,
          acao: () => {
            biblioteca.atualizarNota(
              nota.id,
              { privada: !nota.privada },
              nota.privada ? 'privacidade removida' : 'marcada como privada',
            )
            aoAvisar(nota.privada ? 'Anotação visível' : 'Anotação marcada como privada')
          },
        },
        {
          rotulo: 'Exportar',
          icone: <IconeExportar tamanho={20} />,
          acao: () => {
            exportarNota(nota, album)
            aoAvisar('Anotação exportada em JSON')
          },
        },
        {
          rotulo: 'Excluir',
          icone: <IconeLixeira tamanho={20} />,
          perigo: true,
          acao: () => setDialogo({ tipo: 'excluir', nota }),
        },
      ],
    })
  }

  const confirmarDialogo = () => {
    if (!dialogo) return
    if (dialogo.tipo === 'renomear') {
      biblioteca.atualizarNota(dialogo.nota.id, { titulo: rascunho.trim() || dialogo.nota.titulo })
      aoAvisar('Anotação renomeada')
    }
    if (dialogo.tipo === 'excluir') {
      biblioteca.excluirNota(dialogo.nota.id)
      aoAvisar('Anotação movida para a lixeira')
    }
    setDialogo(null)
  }

  return (
    <section className="tela tela--conteudo">
      <CabecalhoTela
        titulo={album.nome}
        aoVoltar={aoVoltar}
        acoes={[
          {
            rotulo: 'Buscar',
            dica: 'album-busca',
            icone: <IconeBusca tamanho={24} />,
            aoClicar: () => aoAbrir('busca'),
          },
          {
            rotulo: 'Mais opções',
            dica: 'album-menu',
            icone: <IconeMenuVertical tamanho={24} />,
            aoClicar: abrirMenuCabecalho,
          },
        ]}
      />

      <div className="tela__rolagem">
        {notas.length === 0 ? (
          <p className="estado-vazio">
            Nenhuma anotação nesta matéria ainda. Volte para a câmera e capture um quadro.
          </p>
        ) : (
          <div className="grade-notas" data-dica="album-lista">
            {notas.map((nota) => (
              <CartaoNota
                key={nota.id}
                nota={nota}
                aoAbrir={() => aoAbrir('nota', nota.id)}
                aoMenu={(evento) => abrirMenuNota(evento, nota)}
              />
            ))}
          </div>
        )}
      </div>

      <input
        ref={entradaArquivo}
        type="file"
        accept="image/*"
        className="entrada-arquivo"
        onChange={importarImagem}
      />

      {menu && (
        <MenuContexto
          titulo={menu.titulo}
          itens={menu.itens}
          posicao={menu.posicao}
          aoFechar={() => setMenu(null)}
        />
      )}

      {dialogo && (
        <Dialogo
          titulo={
            { renomear: 'Renomear anotação', mover: 'Mover para…', excluir: 'Excluir anotação' }[
              dialogo.tipo
            ]
          }
          descricao={
            dialogo.tipo === 'excluir'
              ? `A anotação fica ${biblioteca.retencaoLixeira} dias na lixeira antes de ser apagada.`
              : null
          }
          aoCancelar={() => setDialogo(null)}
          aoConfirmar={dialogo.tipo === 'mover' ? null : confirmarDialogo}
          rotuloConfirmar={dialogo.tipo === 'excluir' ? 'Excluir' : 'Salvar'}
          perigo={dialogo.tipo === 'excluir'}
        >
          {dialogo.tipo === 'renomear' && (
            <input
              className="campo-texto"
              value={rascunho}
              onChange={(evento) => setRascunho(evento.target.value)}
              maxLength={40}
              autoFocus
            />
          )}
          {dialogo.tipo === 'mover' && (
            <ul className="lista-simples">
              {biblioteca.albuns.map((destino) => (
                <li key={destino.id}>
                  <button
                    type="button"
                    className="lista-simples__item"
                    onClick={() => {
                      biblioteca.atualizarNota(
                        dialogo.nota.id,
                        { albumId: destino.id },
                        `movida para ${destino.nome}`,
                      )
                      setDialogo(null)
                      aoAvisar(`Anotação movida para ${destino.nome}`)
                    }}
                  >
                    {destino.nome}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Dialogo>
      )}
    </section>
  )
}

export default TelaAlbum
