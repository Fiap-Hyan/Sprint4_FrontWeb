import stats from '../data/stats'
import Contador from './Contador'

const Estatisticas = () => (
  <section className="secao secao-estatisticas" aria-label="Metas de impacto">
    <div className="contador-grid">
      {stats.map((item) => (
        <Contador
          key={item.id}
          valorFinal={item.valor}
          sufixo={item.sufixo}
          rotulo={item.rotulo}
          divisor={item.divisor}
        />
      ))}
    </div>

    <p className="contador-nota">
      Metas de impacto definidas pela equipe para a solução. O StudyCam AI é o
      protótipo do Challenge 2026 e ainda não tem base de usuários.
    </p>
  </section>
)

export default Estatisticas
