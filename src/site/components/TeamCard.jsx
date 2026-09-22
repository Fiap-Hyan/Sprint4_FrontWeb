const TeamCard = ({ integrante }) => (
  <article className="equipe-card">
    <div className="equipe-avatar" aria-hidden="true">
      {integrante.nome.charAt(0)}
    </div>
    <h3>{integrante.nome}</h3>
    {/* A função é opcional: só aparece para quem tiver o campo preenchido */}
    {integrante.funcao && <p className="equipe-funcao">{integrante.funcao}</p>}
    <p className="equipe-rm">RM{integrante.rm}</p>
  </article>
)

export default TeamCard
