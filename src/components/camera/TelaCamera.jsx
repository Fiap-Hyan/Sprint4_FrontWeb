import { useCallback, useState } from 'react'

import BarraCaptura from './BarraCaptura'
import BarraFerramentasCamera from './BarraFerramentasCamera'
import PainelCaptura from './PainelCaptura'
import SeletorModos from './SeletorModos'
import Visor from './Visor'
import useCamera from '../../hooks/useCamera'

/**
 * Tela principal do modo StudyCam AI: reúne a barra de ferramentas, o visor,
 * o trilho de modos e a barra de captura.
 */
const TelaCamera = ({
  ajustes,
  definirAjuste,
  albuns,
  contarNotas,
  adicionarNota,
  atualizarNota,
  videoRef,
  conectarVideo,
  statusWebcam,
  aoAbrir,
  aoAvisar,
}) => {
  const [modoAtivo, setModoAtivo] = useState('studycam')
  const [atalhoAberto, setAtalhoAberto] = useState(false)
  const [captura, setCaptura] = useState(null)

  const aoCapturar = useCallback(
    (nota, sugestao) => {
      setCaptura({ nota, sugestao })
      setAtalhoAberto(false)
    },
    [],
  )

  // A análise da foto pela IA termina depois da captura: quando ela chega, o
  // painel pós-captura passa a mostrar a matéria escolhida pelo modelo.
  const aoAnalisar = useCallback((notaId, campos, album) => {
    setCaptura((atual) => {
      if (!atual || atual.nota.id !== notaId) return atual
      return { nota: { ...atual.nota, ...campos }, sugestao: album || atual.sugestao }
    })
  }, [])

  const { contagem, clarao, ocupado, capturar } = useCamera({
    ajustes,
    albuns,
    contarNotas,
    adicionarNota,
    atualizarNota,
    videoRef,
    aoCapturar,
    aoAnalisar,
  })

  // Retrato, Foto, Vídeo e Mais são modos nativos da câmera JOVI: ficam visíveis
  // no trilho, como no aparelho, mas não fazem nada neste protótipo.
  const selecionarModo = (modo) => {
    if (modo.nativo) return
    setModoAtivo(modo.id)
  }

  const trocarAlbumDaCaptura = (albumId) => {
    if (!captura) return
    const album = albuns.find((item) => item.id === albumId)
    atualizarNota(captura.nota.id, { albumId }, `movida para ${album ? album.nome : 'outra matéria'}`)
    setCaptura((atual) => ({
      nota: { ...atual.nota, albumId },
      sugestao: album,
    }))
    aoAvisar(`Anotação salva em ${album ? album.nome : 'nenhuma matéria'}`)
  }

  return (
    <section className="tela tela--camera">
      <BarraFerramentasCamera
        ajustes={ajustes}
        definirAjuste={definirAjuste}
        aoAbrirAjustes={() => aoAbrir('ajustes')}
        aoAvisar={aoAvisar}
      />

      <Visor
        ajustes={ajustes}
        definirAjuste={definirAjuste}
        conectarVideo={conectarVideo}
        statusWebcam={statusWebcam}
        contagem={contagem}
        clarao={clarao}
        aoAvisar={aoAvisar}
      />

      {atalhoAberto && (
        <button
          type="button"
          className="camada-atalho"
          onClick={() => setAtalhoAberto(false)}
          aria-label="Fechar atalho dos álbuns"
        />
      )}

      <div className="camera__controles">
        {captura && (
          <PainelCaptura
            nota={captura.nota}
            sugestao={captura.sugestao}
            albuns={albuns}
            aoTrocarAlbum={trocarAlbumDaCaptura}
            aoAbrirNota={() => {
              setCaptura(null)
              aoAbrir('nota', captura.nota.id)
            }}
            aoFechar={() => setCaptura(null)}
          />
        )}

        <SeletorModos modoAtivo={modoAtivo} aoSelecionar={selecionarModo} />

        <BarraCaptura
          atalhoAberto={atalhoAberto}
          aoSegurarGaleria={() => setAtalhoAberto(true)}
          aoAbrirGaleria={() => {
            setAtalhoAberto(false)
            aoAbrir('galeria')
          }}
          aoAbrirAlbuns={() => {
            setAtalhoAberto(false)
            aoAbrir('albuns')
          }}
          aoAbrirBiblioteca={() => aoAbrir('albuns')}
          aoCapturar={capturar}
          ocupado={ocupado}
        />
      </div>
    </section>
  )
}

export default TelaCamera
