import MODOS from '../../data/modos'

/** Trilho de modos da câmera. "StudyCam AI" é o modo criado pela equipe. */
const SeletorModos = ({ modoAtivo, aoSelecionar }) => (
  <div
    className="seletor-modos"
    data-dica="camera-modos"
    role="tablist"
    aria-label="Modos da câmera"
  >
    {MODOS.map((modo) => (
      <button
        key={modo.id}
        type="button"
        role="tab"
        aria-selected={modo.id === modoAtivo}
        className={`seletor-modos__item ${modo.id === modoAtivo ? 'is-ativo' : ''}`}
        onClick={() => aoSelecionar(modo)}
      >
        {modo.rotulo}
      </button>
    ))}
  </div>
)

export default SeletorModos
