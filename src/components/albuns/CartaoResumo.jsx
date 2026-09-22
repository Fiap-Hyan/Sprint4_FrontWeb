import { IconeCalendario, IconeMarcador } from '../ui/Icones'
import { dataRelativa } from '../../utils/formato'

/** Cartão de resumo do topo da tela de Álbuns. */
const CartaoResumo = ({ total, atualizadoEm }) => (
  <section className="cartao-resumo">
    <div>
      <p className="cartao-resumo__rotulo">Total de Anotações</p>
      <p className="cartao-resumo__valor">{total}</p>
      <p className="cartao-resumo__data">
        <IconeCalendario tamanho={18} />
        {`Atualizado ${dataRelativa(atualizadoEm)}`}
      </p>
    </div>
    <span className="cartao-resumo__selo" aria-hidden="true">
      <IconeMarcador tamanho={30} corFita="#2C2C2E" />
    </span>
  </section>
)

export default CartaoResumo
