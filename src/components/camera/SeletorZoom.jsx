import { ZOOMS } from '../../data/modos'

/** Pílula de zoom exibida na base do visor (0,6x / 1x / 2x). */
const SeletorZoom = ({ zoom, aoSelecionar }) => (
  <div className="seletor-zoom" role="group" aria-label="Nível de zoom">
    {ZOOMS.map((valor) => (
      <button
        key={valor}
        type="button"
        className={`seletor-zoom__item ${valor === zoom ? 'is-ativo' : ''}`}
        onClick={() => aoSelecionar(valor)}
        aria-pressed={valor === zoom}
      >
        {`${valor.toString().replace('.', ',')}x`}
      </button>
    ))}
  </div>
)

export default SeletorZoom
