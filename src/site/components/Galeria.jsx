import { Link } from 'react-router-dom'

import galeria from '../data/gallery'
import GaleriaItem from './GaleriaItem'

const Galeria = () => (
  <section id="galeria" className="secao secao-galeria" aria-label="Galeria">
    <div className="secao-cabecalho">
      <p className="etiqueta">Galeria</p>
      <h2>A solução na prática</h2>
    </div>

    <div className="galeria-grid">
      {galeria.map((item) => (
        <GaleriaItem key={item.id} item={item} />
      ))}
    </div>

    {/* Convite para sair das telas ilustrativas e usar o protótipo de verdade */}
    <div className="galeria-cta">
      <p>Quer testar você mesmo? O protótipo navegável está aqui do lado.</p>
      <Link to="/app" className="btn btn-primario">Abrir o protótipo</Link>
    </div>
  </section>
)

export default Galeria
