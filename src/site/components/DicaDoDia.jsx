import useLocalStorage from '../../hooks/useLocalStorage'
import dicas from '../data/tips'

// Sorteia uma dica diferente da que já está na tela
const sortearIndice = (indiceAtual) => {
  if (dicas.length <= 1) return 0

  let novoIndice = indiceAtual
  while (novoIndice === indiceAtual) {
    // Math.random gera o sorteio e Math.floor arredonda para baixo
    novoIndice = Math.floor(Math.random() * dicas.length)
  }
  return novoIndice
}

const DicaDoDia = () => {
  // A dica escolhida fica salva no localStorage e volta ao recarregar a página
  const [indiceDica, setIndiceDica] = useLocalStorage('studycam_dica_indice', 0)

  return (
    <section className="secao secao-dica" aria-label="Dica do dia">
      <div className="dica-card">
        <p className="etiqueta">Dica do dia</p>
        <p className="dica-texto">{dicas[indiceDica]}</p>
        <button
          type="button"
          className="btn btn-secundario"
          onClick={() => setIndiceDica((anterior) => sortearIndice(anterior))}
        >
          Nova dica
        </button>
      </div>
    </section>
  )
}

export default DicaDoDia
