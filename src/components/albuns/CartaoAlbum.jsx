import { IconeMarcador, IconeMenuVertical, IconeSetaBaixo, IconeSetaCima } from '../ui/Icones'
import { corHex } from '../../data/cores'
import { plural } from '../../utils/formato'

/** Cartão de uma matéria na grade de álbuns. */
const CartaoAlbum = ({ album, quantidade, aoAbrir, aoMenu, reorganizando, aoMover }) => (
  <article className="cartao-album">
    <button type="button" className="cartao-album__area" onClick={aoAbrir}>
      <span className="cartao-album__icone" style={{ backgroundColor: corHex(album.cor) }}>
        <IconeMarcador tamanho={30} corFita={corHex(album.cor)} />
      </span>
      <span className="cartao-album__nome">{album.nome}</span>
      <span className="cartao-album__contagem">{plural(quantidade, 'nota', 'notas')}</span>
    </button>

    {reorganizando ? (
      <div className="cartao-album__ordenar">
        <button type="button" onClick={() => aoMover(-1)} aria-label={`Mover ${album.nome} para cima`}>
          <IconeSetaCima tamanho={20} />
        </button>
        <button type="button" onClick={() => aoMover(1)} aria-label={`Mover ${album.nome} para baixo`}>
          <IconeSetaBaixo tamanho={20} />
        </button>
      </div>
    ) : (
      <button
        type="button"
        className="cartao-album__menu"
        onClick={aoMenu}
        aria-label={`Opções de ${album.nome}`}
      >
        <IconeMenuVertical tamanho={22} />
      </button>
    )}
  </article>
)

export default CartaoAlbum
