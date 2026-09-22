import SeletorZoom from './SeletorZoom'
import { IconeDocumento } from '../ui/Icones'

/**
 * Visor da câmera. Sem permissão de webcam ele mostra a cena simulada (mesma
 * aparência escura das telas do protótipo); com a permissão concedida (pedida
 * ao entrar no protótipo), exibe a imagem real do dispositivo.
 */
const Visor = ({
  ajustes,
  definirAjuste,
  conectarVideo,
  statusWebcam,
  contagem,
  clarao,
  aoAvisar,
}) => {
  // Zoom óptico simulado: 0,6x mostra a cena inteira e 2x aproxima 1,7 vezes.
  const escala = 1 + (ajustes.zoom - 0.6) * 0.5

  const alternarMoldura = () => {
    const proxima = !ajustes.molduraDocumento
    definirAjuste('molduraDocumento', proxima)
    aoAvisar(proxima ? 'Detecção de documento ativada' : 'Detecção de documento desativada')
  }

  const alternarZoomRapido = () => {
    const proximo = ajustes.zoom === 2 ? 1 : 2
    definirAjuste('zoom', proximo)
  }

  return (
    <div
      className="visor"
      data-proporcao={ajustes.proporcao}
      onDoubleClick={alternarZoomRapido}
      role="presentation"
    >
      <div className="visor__cena" style={{ transform: `scale(${escala})` }}>
        {statusWebcam !== 'ativo' && (
          <div className="visor__simulacao" aria-hidden="true">
            <span className="visor__brilho" />
            <span className="visor__superficie" />
            <span className="visor__mao" />
          </div>
        )}
        {ajustes.usarWebcam && (
          <video
            ref={conectarVideo}
            className={`visor__video ${statusWebcam === 'ativo' ? '' : 'is-oculto'}`}
            playsInline
            muted
            autoPlay
          />
        )}
      </div>

      {ajustes.usarWebcam && statusWebcam === 'carregando' && (
        <p className="visor__estado">Abrindo a câmera…</p>
      )}
      {ajustes.usarWebcam && statusWebcam === 'erro' && (
        <p className="visor__estado">Câmera indisponível — visor simulado</p>
      )}

      {ajustes.molduraDocumento && (
        <div className="visor__moldura" aria-hidden="true">
          <span className="visor__canto visor__canto--se" />
          <span className="visor__canto visor__canto--sd" />
          <span className="visor__canto visor__canto--ie" />
          <span className="visor__canto visor__canto--id" />
          <span className="visor__rotulo-moldura">Documento detectado</span>
        </div>
      )}

      {contagem > 0 && <span className="visor__contagem">{contagem}</span>}
      {clarao && <span className="visor__clarao" aria-hidden="true" />}

      <div className="visor__rodape">
        <SeletorZoom zoom={ajustes.zoom} aoSelecionar={(valor) => definirAjuste('zoom', valor)} />
        <button
          type="button"
          data-dica="camera-documento"
          className={`visor__documento ${ajustes.molduraDocumento ? 'is-ativo' : ''}`}
          onClick={alternarMoldura}
          aria-pressed={ajustes.molduraDocumento}
          aria-label="Detecção automática de documento"
          title="Detecção automática de documento"
        >
          <IconeDocumento tamanho={34} />
        </button>
      </div>
    </div>
  )
}

export default Visor
