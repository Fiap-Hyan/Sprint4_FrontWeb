/** Chave liga/desliga no padrão do sistema, usada na tela de Ajustes. */
const Interruptor = ({ id, ligado, aoAlternar, rotulo, descricao, desabilitado = false }) => (
  <label className={`interruptor ${desabilitado ? 'is-desabilitado' : ''}`} htmlFor={id}>
    <span className="interruptor__texto">
      <span className="interruptor__rotulo">{rotulo}</span>
      {descricao && <span className="interruptor__descricao">{descricao}</span>}
    </span>
    <input
      id={id}
      type="checkbox"
      checked={ligado}
      onChange={(evento) => aoAlternar(evento.target.checked)}
      disabled={desabilitado}
    />
    <span className="interruptor__trilho" aria-hidden="true">
      <span className="interruptor__bolinha" />
    </span>
  </label>
)

export default Interruptor
