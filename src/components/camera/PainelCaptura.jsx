import MiniaturaNota from '../ui/MiniaturaNota'
import { corHex } from '../../data/cores'
import { IconeFechar } from '../ui/Icones'

/**
 * Folha exibida logo após a captura: mostra a anotação criada, a matéria
 * sugerida pela IA e permite corrigir o destino antes de sair da câmera.
 */
const PainelCaptura = ({ nota, sugestao, albuns, aoTrocarAlbum, aoAbrirNota, aoFechar }) => {
  if (!nota) return null

  return (
    <section className="painel-captura" aria-label="Anotação capturada">
      <button type="button" className="painel-captura__fechar" onClick={aoFechar} aria-label="Fechar">
        <IconeFechar tamanho={20} />
      </button>

      <div className="painel-captura__topo">
        <div className="painel-captura__miniatura">
          <MiniaturaNota nota={nota} altura={72} />
        </div>
        <div>
          <p className="painel-captura__titulo">{nota.titulo}</p>
          <p className="painel-captura__legenda">
            {sugestao
              ? `IA sugeriu ${sugestao.nome} · ${nota.confiancaIA}% de confiança`
              : 'Sem matéria definida — escolha abaixo'}
          </p>
        </div>
      </div>

      <div className="painel-captura__chips">
        {albuns.map((album) => (
          <button
            key={album.id}
            type="button"
            className={`chip ${album.id === nota.albumId ? 'is-ativo' : ''}`}
            style={{ '--cor-chip': corHex(album.cor) }}
            onClick={() => aoTrocarAlbum(album.id)}
          >
            {album.nome}
          </button>
        ))}
      </div>

      <div className="painel-captura__acoes">
        <button type="button" className="botao-secundario" onClick={aoFechar}>
          Continuar capturando
        </button>
        <button type="button" className="botao-primario" onClick={aoAbrirNota}>
          Ver anotação
        </button>
      </div>
    </section>
  )
}

export default PainelCaptura
