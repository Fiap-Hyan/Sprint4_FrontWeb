/** Caixa de diálogo modal (renomear matéria, confirmar exclusão, etc.). */
const Dialogo = ({ titulo, descricao, children, aoCancelar, aoConfirmar, rotuloConfirmar = 'OK', perigo = false }) => (
  <div className="camada-menu camada-menu--centro" onClick={aoCancelar} role="presentation">
    <div
      className="dialogo"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={(evento) => evento.stopPropagation()}
    >
      <h2 className="dialogo__titulo">{titulo}</h2>
      {descricao && <p className="dialogo__descricao">{descricao}</p>}
      {children}
      <div className="dialogo__acoes">
        <button type="button" className="dialogo__botao" onClick={aoCancelar}>
          Cancelar
        </button>
        {aoConfirmar && (
          <button
            type="button"
            className={`dialogo__botao is-principal ${perigo ? 'is-perigo' : ''}`}
            onClick={aoConfirmar}
          >
            {rotuloConfirmar}
          </button>
        )}
      </div>
    </div>
  </div>
)

export default Dialogo
