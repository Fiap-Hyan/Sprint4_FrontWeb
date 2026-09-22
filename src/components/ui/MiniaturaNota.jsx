import { geradorComSemente } from '../../utils/aleatorio'

/**
 * Miniatura da anotação. Quando existe foto (captura da webcam ou imagem
 * importada da galeria) ela é exibida; caso contrário desenhamos uma prévia
 * sintética coerente com o tipo da captura, gerada por um sorteio determinístico
 * (a mesma anotação sempre produz o mesmo desenho).
 */

const ESTILOS = {
  quadro: { fundo: '#1F3B30', linha: '#DCF3E4', titulo: '#8FE3B0' },
  slide: { fundo: '#FFFFFF', linha: '#B9C0CC', titulo: '#1B4F9C' },
  caderno: { fundo: '#FAF7EF', linha: '#3C4657', titulo: '#22304A' },
  tela: { fundo: '#10131A', linha: '#7E8AA2', titulo: '#4FC3F7' },
}

const CORES_CODIGO = ['#4FC3F7', '#FFB74D', '#81C784', '#B39DDB']

const MiniaturaNota = ({ nota, altura = 121 }) => {
  if (nota.imagem) {
    return <img className="miniatura__imagem" src={nota.imagem} alt={nota.titulo} loading="lazy" />
  }

  const estilo = ESTILOS[nota.tipo] || ESTILOS.slide
  const proximo = geradorComSemente(nota.id)
  const linhas = 7
  const eCodigo = nota.tipo === 'tela'

  return (
    <svg
      className="miniatura__desenho"
      viewBox="0 0 110 121"
      width="100%"
      height={altura}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Prévia da anotação ${nota.titulo}`}
    >
      <rect width="110" height="121" fill={estilo.fundo} />

      {nota.tipo === 'caderno' && (
        <g stroke="#C9D7EA" strokeWidth="0.6">
          {Array.from({ length: 9 }).map((_, indice) => (
            <line key={indice} x1="8" x2="102" y1={26 + indice * 10} y2={26 + indice * 10} />
          ))}
        </g>
      )}

      <rect
        x="10"
        y="12"
        width={Math.round(40 + proximo() * 45)}
        height="6"
        rx="1.5"
        fill={estilo.titulo}
      />

      {Array.from({ length: linhas }).map((_, indice) => {
        const largura = Math.round(30 + proximo() * 62)
        const recuo = eCodigo ? Math.round(proximo() * 3) * 6 : 0
        return (
          <rect
            key={indice}
            x={10 + recuo}
            y={28 + indice * 11}
            width={largura}
            height="3.4"
            rx="1.4"
            fill={eCodigo ? CORES_CODIGO[indice % CORES_CODIGO.length] : estilo.linha}
            opacity={eCodigo ? 0.85 : 0.7}
          />
        )
      })}

      {nota.tipo === 'quadro' && (
        <g stroke={estilo.linha} strokeWidth="1" opacity="0.8" fill="none">
          <circle cx="86" cy="96" r="9" />
          <path d="M77 108h18" />
        </g>
      )}
    </svg>
  )
}

export default MiniaturaNota
