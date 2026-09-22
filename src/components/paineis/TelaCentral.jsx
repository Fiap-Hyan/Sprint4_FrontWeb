import { useRef } from 'react'

import CabecalhoTela from '../ui/CabecalhoTela'
import ItemNota from '../notas/ItemNota'
import { arquivoParaMiniatura } from '../../utils/imagem'
import { plural } from '../../utils/formato'
import {
  IconeBusca,
  IconeGaleria,
  IconeGrafico,
  IconeLixeira,
  IconeMarcador,
  IconeSetaDireita,
} from '../ui/Icones'

/**
 * Central de conteúdo: visão única com tudo o que foi capturado, atalhos para as
 * demais telas e importação de imagens já existentes no dispositivo.
 */
const TelaCentral = ({ biblioteca, aoVoltar, aoAbrir, aoAvisar }) => {
  const entradaArquivo = useRef(null)
  const recentes = biblioteca.notasRecentes(8)

  const atalhos = [
    { rotulo: 'Álbuns', descricao: plural(biblioteca.albuns.length, 'matéria', 'matérias'), icone: <IconeMarcador tamanho={22} corFita="#1B1B1D" />, destino: 'albuns' },
    { rotulo: 'Buscar', descricao: 'por título, matéria ou tipo', icone: <IconeBusca tamanho={22} />, destino: 'busca' },
    { rotulo: 'Histórico e estatísticas', descricao: `${biblioteca.estatisticas.naSemana} nesta semana`, icone: <IconeGrafico tamanho={22} />, destino: 'historico' },
    { rotulo: 'Lixeira', descricao: plural(biblioteca.notasNaLixeira.length, 'item', 'itens'), icone: <IconeLixeira tamanho={22} />, destino: 'lixeira' },
  ]

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
      aoAvisar('Imagem importada')
    } catch (erro) {
      aoAvisar(erro.message || 'Não foi possível importar a imagem')
    }
  }

  return (
    <section className="tela tela--conteudo">
      <CabecalhoTela
        titulo="Central de conteúdo"
        aoVoltar={aoVoltar}
        acoes={[{ rotulo: 'Buscar', icone: <IconeBusca tamanho={24} />, aoClicar: () => aoAbrir('busca') }]}
      />

      <div className="tela__rolagem">
        <div className="faixa-numeros">
          <div>
            <strong>{biblioteca.totalNotas}</strong>
            <span>anotações</span>
          </div>
          <div>
            <strong>{biblioteca.estatisticas.naSemana}</strong>
            <span>nesta semana</span>
          </div>
        </div>

        <ul className="lista-atalhos">
          {atalhos.map((atalho) => (
            <li key={atalho.rotulo}>
              <button type="button" className="atalho" onClick={() => aoAbrir(atalho.destino)}>
                <span className="atalho__icone">{atalho.icone}</span>
                <span className="atalho__texto">
                  <span className="atalho__rotulo">{atalho.rotulo}</span>
                  <span className="atalho__descricao">{atalho.descricao}</span>
                </span>
                <IconeSetaDireita tamanho={20} />
              </button>
            </li>
          ))}
        </ul>

        <div className="secao-titulo">
          <h2>Capturas recentes</h2>
          <button
            type="button"
            className="secao-titulo__acao"
            onClick={() => entradaArquivo.current?.click()}
          >
            <IconeGaleria tamanho={18} />
            Importar
          </button>
        </div>

        {recentes.length === 0 ? (
          <p className="estado-vazio">Nenhuma captura registrada ainda.</p>
        ) : (
          <ul className="lista-notas">
            {recentes.map((nota) => (
              <ItemNota
                key={nota.id}
                nota={nota}
                album={biblioteca.albuns.find((item) => item.id === nota.albumId)}
                aoAbrir={() => aoAbrir('nota', nota.id)}
              />
            ))}
          </ul>
        )}

        <input
          ref={entradaArquivo}
          type="file"
          accept="image/*"
          className="entrada-arquivo"
          onChange={importarImagem}
        />
      </div>
    </section>
  )
}

export default TelaCentral
