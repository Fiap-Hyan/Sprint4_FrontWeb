import MiniaturaNota from '../ui/MiniaturaNota'
import { IconeMenuVertical } from '../ui/Icones'

/** Item da grade de anotações dentro de um álbum. */
const CartaoNota = ({ nota, aoAbrir, aoMenu }) => (
  <article className="cartao-nota">
    <button type="button" className="cartao-nota__area" onClick={aoAbrir} title={nota.titulo}>
      <MiniaturaNota nota={nota} />
      <span className="cartao-nota__legenda">{nota.titulo}</span>
    </button>
    <button
      type="button"
      className="cartao-nota__menu"
      onClick={aoMenu}
      aria-label={`Opções de ${nota.titulo}`}
    >
      <IconeMenuVertical tamanho={22} />
    </button>
  </article>
)

export default CartaoNota
