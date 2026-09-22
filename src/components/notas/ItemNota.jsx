import MiniaturaNota from '../ui/MiniaturaNota'
import { corHex } from '../../data/cores'
import { dataRelativa } from '../../utils/formato'

/** Linha de anotação usada na busca, na central de conteúdo e na lixeira. */
const ItemNota = ({ nota, album, aoAbrir, complemento, acoes }) => (
  <li className="item-nota">
    <button type="button" className="item-nota__area" onClick={aoAbrir}>
      <span className="item-nota__miniatura">
        <MiniaturaNota nota={nota} altura={52} />
      </span>
      <span className="item-nota__texto">
        <span className="item-nota__titulo">{nota.titulo}</span>
        <span className="item-nota__legenda">
          {album && (
            <span className="item-nota__ponto" style={{ backgroundColor: corHex(album.cor) }} />
          )}
          {album ? album.nome : 'Sem matéria'} · {complemento || dataRelativa(nota.criadoEm)}
        </span>
      </span>
    </button>
    {acoes && <div className="item-nota__acoes">{acoes}</div>}
  </li>
)

export default ItemNota
