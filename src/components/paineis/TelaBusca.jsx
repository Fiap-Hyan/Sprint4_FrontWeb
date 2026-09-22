import { useState } from 'react'

import CabecalhoTela from '../ui/CabecalhoTela'
import ItemNota from '../notas/ItemNota'
import { plural } from '../../utils/formato'

/** Busca geral por título, tipo ou matéria (requisito "central de conteúdo"). */
const TelaBusca = ({ biblioteca, aoVoltar, aoAbrir }) => {
  const [termo, setTermo] = useState('')
  const resultados = biblioteca.buscar(termo)

  return (
    <section className="tela tela--conteudo">
      <CabecalhoTela titulo="Buscar" aoVoltar={aoVoltar} />

      <div className="tela__rolagem">
        <input
          className="campo-busca"
          type="search"
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          placeholder="Anotação, matéria ou tipo de captura"
          autoFocus
        />

        {termo.trim() === '' ? (
          <p className="estado-vazio">Digite para procurar entre as {biblioteca.totalNotas} anotações.</p>
        ) : (
          <>
            <p className="contador-resultados">
              {plural(resultados.length, 'resultado', 'resultados')}
            </p>
            <ul className="lista-notas">
              {resultados.map((nota) => (
                <ItemNota
                  key={nota.id}
                  nota={nota}
                  album={biblioteca.albuns.find((item) => item.id === nota.albumId)}
                  aoAbrir={() => aoAbrir('nota', nota.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

export default TelaBusca
