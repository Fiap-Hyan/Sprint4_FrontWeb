import usePressaoLonga from '../../hooks/usePressaoLonga'
import { IconeGaleria, IconeMarcador } from '../ui/Icones'

/**
 * Linha inferior da câmera: atalho da galeria (tocar abre a galeria, segurar
 * revela o acesso aos álbuns), obturador e o botão que abre a biblioteca — os
 * álbuns por matéria, a aba do tutor e a de simulados.
 */
const BarraCaptura = ({
  atalhoAberto,
  aoSegurarGaleria,
  aoAbrirGaleria,
  aoAbrirAlbuns,
  aoAbrirBiblioteca,
  aoCapturar,
  ocupado,
}) => {
  const gestosDaGaleria = usePressaoLonga(aoSegurarGaleria, aoAbrirGaleria)

  return (
    <div className="barra-captura">
      <div className="barra-captura__lateral">
        {atalhoAberto && (
          <button
            type="button"
            className="botao-atalho botao-atalho--flutuante"
            onClick={aoAbrirAlbuns}
            aria-label="Abrir álbuns"
            title="Álbuns"
          >
            <IconeMarcador tamanho={26} corFita="#1B1B1D" />
          </button>
        )}
        <button
          type="button"
          data-dica="camera-galeria"
          className={`botao-atalho ${atalhoAberto ? 'is-ativo' : ''}`}
          aria-expanded={atalhoAberto}
          aria-label="Galeria (segure para abrir os álbuns)"
          title="Galeria — segure para abrir os álbuns"
          {...gestosDaGaleria}
        >
          <IconeGaleria tamanho={26} />
        </button>
      </div>

      <button
        type="button"
        data-dica="camera-captura"
        className={`obturador ${ocupado ? 'is-ocupado' : ''}`}
        onClick={aoCapturar}
        aria-label="Capturar anotação"
        title="Capturar"
      >
        <span className="obturador__miolo" />
      </button>

      <div className="barra-captura__lateral">
        <button
          type="button"
          data-dica="camera-biblioteca"
          className="botao-atalho"
          onClick={aoAbrirBiblioteca}
          aria-label="Biblioteca"
          title="Biblioteca — álbuns, tutor e simulados"
        >
          <IconeMarcador tamanho={26} corFita="#1B1B1D" />
        </button>
      </div>
    </div>
  )
}

export default BarraCaptura
