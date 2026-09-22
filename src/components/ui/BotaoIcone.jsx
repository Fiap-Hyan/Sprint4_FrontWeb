/** Botão circular usado nas barras de ferramentas do aplicativo. */
const BotaoIcone = ({ rotulo, aoClicar, variante = 'simples', ativo = false, children, ...resto }) => (
  <button
    type="button"
    className={`botao-icone botao-icone--${variante} ${ativo ? 'is-ativo' : ''}`}
    onClick={aoClicar}
    aria-label={rotulo}
    title={rotulo}
    {...resto}
  >
    {children}
  </button>
)

export default BotaoIcone
