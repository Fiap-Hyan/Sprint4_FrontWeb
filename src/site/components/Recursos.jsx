import recursos from '../data/features'

const Recursos = () => (
  <section className="secao secao-recursos" aria-label="Diferenciais">
    <div className="secao-cabecalho">
      <p className="etiqueta">Diferenciais</p>
      <h2>Uma câmera que pensa como estudante</h2>
    </div>

    <div className="recursos-grid">
      {recursos.map((recurso) => (
        <article key={recurso.id} className="recurso-card">
          <span className="recurso-icone" aria-hidden="true">{recurso.icone}</span>
          <h3>{recurso.titulo}</h3>
          <p>{recurso.descricao}</p>
        </article>
      ))}
    </div>
  </section>
)

export default Recursos
