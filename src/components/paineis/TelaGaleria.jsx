import { useRef, useState } from 'react'

import CabecalhoTela from '../ui/CabecalhoTela'
import CartaoNota from '../notas/CartaoNota'
import Dialogo from '../ui/Dialogo'
import MenuContexto from '../ui/MenuContexto'
import { arquivoParaMiniatura } from '../../utils/imagem'
import { exportarNota } from '../../utils/exportar'
import { plural, rotuloDoDia } from '../../utils/formato'
import { posicaoDoEvento } from '../../utils/posicao'
import {
  IconeBusca,
  IconeExportar,
  IconeGaleria,
  IconeLapis,
  IconeLixeira,
  IconeMarcador,
  IconeMenuVertical,
  IconeMover,
} from '../ui/Icones'

/** Agrupa as capturas por dia, preservando a ordem da mais recente para a mais antiga. */
const agruparPorDia = (notas) => {
  const grupos = []
  notas.forEach((nota) => {
    const rotulo = rotuloDoDia(nota.criadoEm)
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.rotulo === rotulo) ultimo.itens.push(nota)
    else grupos.push({ rotulo, itens: [nota] })
  })
  return grupos
}

/**
 * Galeria: todas as fotos capturadas pela câmera (ou importadas do dispositivo),
 * separadas por dia, exatamente onde o conteúdo do StudyCam AI fica guardado.
 */
const TelaGaleria = ({ biblioteca, aoVoltar, aoAbrir, aoAvisar }) => {
  const [menu, setMenu] = useState(null)
  const [dialogo, setDialogo] = useState(null)
  const [rascunho, setRascunho] = useState('')
  const entradaArquivo = useRef(null)

  const notas = [...biblioteca.notas].sort(
    (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm),
  )
  const grupos = agruparPorDia(notas)

  const importarImagem = async (evento) => {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return
    try {
      const miniatura = await arquivoParaMiniatura(arquivo)
      const primeiroAlbum = biblioteca.albuns[0]
      biblioteca.adicionarNota({
        titulo: arquivo.name.replace(/\.[^.]+$/, '').slice(0, 40) || 'Imagem importada',
        albumId: primeiroAlbum ? primeiroAlbum.id : null,
        tipo: 'slide',
        imagem: miniatura,
      })
      aoAvisar('Imagem adicionada à galeria')
    } catch (erro) {
      aoAvisar(erro.message || 'Não foi possível importar a imagem')
    }
  }

  const abrirMenuCabecalho = (evento) => {
    setMenu({
      posicao: posicaoDoEvento(evento),
      titulo: 'Galeria',
      itens: [
        {
          rotulo: 'Importar imagem',
          icone: <IconeGaleria tamanho={20} />,
          acao: () => entradaArquivo.current?.click(),
        },
        {
          rotulo: 'Álbuns',
          icone: <IconeMarcador tamanho={20} corFita="#2A2A2D" />,
          acao: () => aoAbrir('albuns'),
        },
        {
          rotulo: 'Lixeira',
          icone: <IconeLixeira tamanho={20} />,
          acao: () => aoAbrir('lixeira'),
        },
      ],
    })
  }

  const abrirMenuNota = (evento, nota) => {
    const album = biblioteca.albuns.find((item) => item.id === nota.albumId)
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
      aoAvisar('Foto renomeada')
    }
    if (dialogo.tipo === 'excluir') {
      biblioteca.excluirNota(dialogo.nota.id)
      aoAvisar('Foto movida para a lixeira')
    }
    setDialogo(null)
  }

  return (
    <section className="tela tela--conteudo">
      <CabecalhoTela
        titulo="Galeria"
        aoVoltar={aoVoltar}
        acoes={[
          { rotulo: 'Buscar', icone: <IconeBusca tamanho={24} />, aoClicar: () => aoAbrir('busca') },
          {
            rotulo: 'Mais opções',
            icone: <IconeMenuVertical tamanho={24} />,
            aoClicar: abrirMenuCabecalho,
          },
        ]}
      />

      <div className="tela__rolagem">
        {notas.length === 0 ? (
          <p className="estado-vazio">
            Nenhuma foto guardada ainda. Toque no botão branco da câmera para capturar a primeira.
          </p>
        ) : (
          <>
            <div className="galeria-topo">
              <p className="contador-resultados">{plural(notas.length, 'foto', 'fotos')}</p>
              <button
                type="button"
                className="secao-titulo__acao"
                onClick={() => entradaArquivo.current?.click()}
              >
                <IconeGaleria tamanho={18} />
                Importar
              </button>
            </div>

            {grupos.map((grupo) => (
              <section key={grupo.rotulo}>
                <div className="secao-titulo">
                  <h2>{grupo.rotulo}</h2>
                  <span className="secao-titulo__contagem">{grupo.itens.length}</span>
                </div>
                <div className="grade-notas">
                  {grupo.itens.map((nota) => (
                    <CartaoNota
                      key={nota.id}
                      nota={nota}
                      aoAbrir={() => aoAbrir('nota', nota.id)}
                      aoMenu={(evento) => abrirMenuNota(evento, nota)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
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
            { renomear: 'Renomear foto', mover: 'Mover para…', excluir: 'Excluir foto' }[
              dialogo.tipo
            ]
          }
          descricao={
            dialogo.tipo === 'excluir'
              ? `A foto fica ${biblioteca.retencaoLixeira} dias na lixeira antes de ser apagada.`
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
                      aoAvisar(`Foto movida para ${destino.nome}`)
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

export default TelaGaleria
