import { useState } from 'react'

import CartaoAlbum from './CartaoAlbum'
import CartaoResumo from './CartaoResumo'
import SeletorCores from './SeletorCores'
import CabecalhoTela from '../ui/CabecalhoTela'
import Dialogo from '../ui/Dialogo'
import MenuContexto from '../ui/MenuContexto'
import { posicaoDoEvento } from '../../utils/posicao'
import {
  IconeBusca,
  IconeEngrenagem,
  IconeGrafico,
  IconeLapis,
  IconeLixeira,
  IconeMais,
  IconeMaleta,
  IconeMenuVertical,
  IconeMover,
  IconePaleta,
} from '../ui/Icones'

/** Tela de Álbuns: resumo geral + grade das matérias. */
const TelaAlbuns = ({ biblioteca, aoVoltar, aoAbrir, aoAvisar }) => {
  const [menu, setMenu] = useState(null)
  const [dialogo, setDialogo] = useState(null)
  const [rascunhoNome, setRascunhoNome] = useState('')
  const [rascunhoCor, setRascunhoCor] = useState('roxo')
  const [reorganizando, setReorganizando] = useState(false)

  const fecharMenu = () => setMenu(null)
  const fecharDialogo = () => setDialogo(null)

  const abrirMenuCabecalho = (evento) => {
    setMenu({
      posicao: posicaoDoEvento(evento),
      titulo: 'Álbuns',
      itens: [
        {
          rotulo: 'Nova matéria',
          icone: <IconeMais tamanho={20} />,
          acao: () => {
            setRascunhoNome('')
            setRascunhoCor('roxo')
            setDialogo({ tipo: 'criar' })
          },
        },
        {
          rotulo: reorganizando ? 'Concluir organização' : 'Reorganizar matérias',
          icone: <IconeMover tamanho={20} />,
          acao: () => setReorganizando((atual) => !atual),
        },
        {
          rotulo: 'Central de conteúdo',
          icone: <IconeMaleta tamanho={20} />,
          acao: () => aoAbrir('central'),
        },
        {
          rotulo: 'Histórico e estatísticas',
          icone: <IconeGrafico tamanho={20} />,
          acao: () => aoAbrir('historico'),
        },
        {
          rotulo: 'Lixeira',
          icone: <IconeLixeira tamanho={20} />,
          acao: () => aoAbrir('lixeira'),
        },
        {
          rotulo: 'Ajustes',
          icone: <IconeEngrenagem tamanho={20} />,
          acao: () => aoAbrir('ajustes'),
        },
      ],
    })
  }

  const abrirMenuAlbum = (evento, album) => {
    setMenu({
      posicao: posicaoDoEvento(evento),
      titulo: album.nome,
      itens: [
        {
          rotulo: 'Renomear álbum',
          icone: <IconeLapis tamanho={20} />,
          acao: () => {
            setRascunhoNome(album.nome)
            setDialogo({ tipo: 'renomear', album })
          },
        },
        {
          rotulo: 'Alterar cor',
          icone: <IconePaleta tamanho={20} />,
          acao: () => {
            setRascunhoCor(album.cor)
            setDialogo({ tipo: 'cor', album })
          },
        },
        {
          rotulo: 'Excluir álbum',
          icone: <IconeLixeira tamanho={20} />,
          perigo: true,
          acao: () => setDialogo({ tipo: 'excluir', album }),
        },
      ],
    })
  }

  const confirmarDialogo = () => {
    if (!dialogo) return
    if (dialogo.tipo === 'criar') {
      const novo = biblioteca.criarAlbum(rascunhoNome, rascunhoCor)
      aoAvisar(`Matéria ${novo.nome} criada`)
    }
    if (dialogo.tipo === 'renomear') {
      biblioteca.renomearAlbum(dialogo.album.id, rascunhoNome)
      aoAvisar('Álbum renomeado')
    }
    if (dialogo.tipo === 'cor') {
      biblioteca.alterarCorAlbum(dialogo.album.id, rascunhoCor)
      aoAvisar('Cor atualizada')
    }
    if (dialogo.tipo === 'excluir') {
      biblioteca.excluirAlbum(dialogo.album.id)
      aoAvisar('Álbum excluído — anotações foram para a lixeira')
    }
    fecharDialogo()
  }

  return (
    <section className="tela tela--conteudo">
      <CabecalhoTela
        titulo="Álbuns"
        aoVoltar={aoVoltar}
        acoes={[
          {
            rotulo: 'Buscar',
            dica: 'albuns-busca',
            icone: <IconeBusca tamanho={24} />,
            aoClicar: () => aoAbrir('busca'),
          },
          {
            rotulo: 'Nova matéria',
            dica: 'albuns-criar',
            icone: <IconeMais tamanho={24} />,
            aoClicar: () => {
              setRascunhoNome('')
              setRascunhoCor('roxo')
              setDialogo({ tipo: 'criar' })
            },
          },
          {
            rotulo: 'Mais opções',
            dica: 'albuns-menu',
            icone: <IconeMenuVertical tamanho={24} />,
            aoClicar: abrirMenuCabecalho,
          },
        ]}
      />

      <div className="tela__rolagem">
        <CartaoResumo total={biblioteca.totalNotas} atualizadoEm={biblioteca.ultimaAtualizacao} />

        <div className="secao-titulo">
          <h2>Matérias</h2>
          {reorganizando && (
            <button type="button" className="secao-titulo__acao" onClick={() => setReorganizando(false)}>
              Concluir
            </button>
          )}
        </div>

        <div className="grade-albuns" data-dica="albuns-lista">
          {biblioteca.albuns.map((album) => (
            <CartaoAlbum
              key={album.id}
              album={album}
              quantidade={biblioteca.contarNotas(album.id)}
              reorganizando={reorganizando}
              aoAbrir={() => aoAbrir('album', album.id)}
              aoMenu={(evento) => abrirMenuAlbum(evento, album)}
              aoMover={(direcao) => biblioteca.moverAlbum(album.id, direcao)}
            />
          ))}

          <button
            type="button"
            className="cartao-album cartao-album--novo"
            onClick={() => {
              setRascunhoNome('')
              setRascunhoCor('roxo')
              setDialogo({ tipo: 'criar' })
            }}
          >
            <span className="cartao-album__icone cartao-album__icone--novo">
              <IconeMais tamanho={26} />
            </span>
            <span className="cartao-album__nome">Nova matéria</span>
            <span className="cartao-album__contagem">criar álbum</span>
          </button>
        </div>
      </div>

      {menu && (
        <MenuContexto
          titulo={menu.titulo}
          itens={menu.itens}
          posicao={menu.posicao}
          aoFechar={fecharMenu}
        />
      )}

      {dialogo && (
        <Dialogo
          titulo={
            {
              criar: 'Nova matéria',
              renomear: 'Renomear álbum',
              cor: 'Alterar cor',
              excluir: 'Excluir álbum',
            }[dialogo.tipo]
          }
          descricao={
            dialogo.tipo === 'excluir'
              ? `As anotações de ${dialogo.album.nome} vão para a lixeira e podem ser recuperadas em ${biblioteca.retencaoLixeira} dias.`
              : null
          }
          aoCancelar={fecharDialogo}
          aoConfirmar={confirmarDialogo}
          rotuloConfirmar={dialogo.tipo === 'excluir' ? 'Excluir' : 'Salvar'}
          perigo={dialogo.tipo === 'excluir'}
        >
          {(dialogo.tipo === 'criar' || dialogo.tipo === 'renomear') && (
            <input
              className="campo-texto"
              value={rascunhoNome}
              onChange={(evento) => setRascunhoNome(evento.target.value)}
              placeholder="Nome da matéria"
              maxLength={28}
              autoFocus
            />
          )}
          {(dialogo.tipo === 'criar' || dialogo.tipo === 'cor') && (
            <SeletorCores selecionada={rascunhoCor} aoSelecionar={setRascunhoCor} />
          )}
        </Dialogo>
      )}
    </section>
  )
}

export default TelaAlbuns
