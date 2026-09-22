import { limitar } from '../../utils/formato'

const LARGURA = 238

/**
 * Menu suspenso do padrão One UI: aparece ancorado no botão de três pontos,
 * escurece o restante da tela e fecha ao tocar fora.
 */
const MenuContexto = ({ titulo, itens, posicao, aoFechar }) => {
  if (!itens || !itens.length) return null

  const esquerda = limitar((posicao?.x ?? 0) - LARGURA + 44, 12, Math.max(12, (posicao?.limiteX ?? 400) - LARGURA - 12))
  const topo = limitar(posicao?.y ?? 0, 12, Math.max(12, (posicao?.limiteY ?? 600) - 210))

  return (
    <div className="camada-menu" onClick={aoFechar} role="presentation">
      <div
        className="menu-contexto"
        style={{ left: `${esquerda}px`, top: `${topo}px`, width: `${LARGURA}px` }}
        onClick={(evento) => evento.stopPropagation()}
        role="menu"
      >
        {titulo && <p className="menu-contexto__titulo">{titulo}</p>}
        <ul className="menu-contexto__lista">
          {itens.map((item) => (
            <li key={item.rotulo}>
              <button
                type="button"
                role="menuitem"
                className={`menu-contexto__item ${item.perigo ? 'is-perigo' : ''}`}
                onClick={() => {
                  aoFechar()
                  item.acao()
                }}
              >
                <span className="menu-contexto__icone">{item.icone}</span>
                {item.rotulo}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MenuContexto
