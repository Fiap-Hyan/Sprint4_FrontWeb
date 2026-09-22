import CORES, { LISTA_CORES } from '../../data/cores'

/** Paleta usada nos diálogos de criação e de alteração de cor da matéria. */
const SeletorCores = ({ selecionada, aoSelecionar }) => (
  <div className="seletor-cores" role="radiogroup" aria-label="Cor da matéria">
    {LISTA_CORES.map((chave) => (
      <button
        key={chave}
        type="button"
        role="radio"
        aria-checked={chave === selecionada}
        aria-label={CORES[chave].nome}
        title={CORES[chave].nome}
        className={`seletor-cores__opcao ${chave === selecionada ? 'is-ativa' : ''}`}
        style={{ backgroundColor: CORES[chave].hex }}
        onClick={() => aoSelecionar(chave)}
      />
    ))}
  </div>
)

export default SeletorCores
