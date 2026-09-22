import equipe from '../data/team'
import TeamCard from './TeamCard'

const Equipe = () => (
  <section id="equipe" className="secao secao-equipe" aria-label="Nossa Equipe">
    <div className="secao-cabecalho">
      <p className="etiqueta">Nossa Equipe</p>
      <h2>Quem constrói o StudyCam AI</h2>
    </div>

    <div className="equipe-grid">
      {equipe.map((integrante) => (
        <TeamCard key={integrante.id} integrante={integrante} />
      ))}
    </div>
  </section>
)

export default Equipe
