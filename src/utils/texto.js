/* ============================================================================
 * Limpeza do texto devolvido pelo modelo
 * ----------------------------------------------------------------------------
 * Quando o assunto é matemática, física ou química, o Gemini escreve fórmulas
 * em LaTeX — "$\pi$", "\frac{1}{2}", "x^{2}". A interface do aplicativo é
 * texto puro, então essa marcação apareceria crua na pergunta do simulado.
 * Aqui ela vira o símbolo correspondente: π, (1/2), x².
 *
 * A conversão é feita na fronteira com a API (src/services/api.js), e não na
 * hora de desenhar, para que o conteúdo já seja guardado limpo.
 * ==========================================================================*/

/** Comandos LaTeX que têm um símbolo equivalente em Unicode. */
const SIMBOLOS = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  Delta: 'Δ',
  epsilon: 'ε',
  theta: 'θ',
  lambda: 'λ',
  mu: 'μ',
  pi: 'π',
  Pi: 'Π',
  rho: 'ρ',
  sigma: 'σ',
  Sigma: 'Σ',
  tau: 'τ',
  phi: 'φ',
  omega: 'ω',
  Omega: 'Ω',
  times: '×',
  cdot: '·',
  div: '÷',
  pm: '±',
  mp: '∓',
  leq: '≤',
  le: '≤',
  geq: '≥',
  ge: '≥',
  neq: '≠',
  ne: '≠',
  approx: '≈',
  equiv: '≡',
  propto: '∝',
  infty: '∞',
  sum: '∑',
  prod: '∏',
  int: '∫',
  partial: '∂',
  nabla: '∇',
  in: '∈',
  notin: '∉',
  subset: '⊂',
  cup: '∪',
  cap: '∩',
  rightarrow: '→',
  to: '→',
  leftarrow: '←',
  leftrightarrow: '↔',
  Rightarrow: '⇒',
  circ: '°',
  degree: '°',
  angle: '∠',
  perp: '⊥',
  therefore: '∴',
  ldots: '…',
  dots: '…',
}

const EXPOENTES = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  '+': '⁺',
  '-': '⁻',
  n: 'ⁿ',
}

const INDICES = {
  0: '₀',
  1: '₁',
  2: '₂',
  3: '₃',
  4: '₄',
  5: '₅',
  6: '₆',
  7: '₇',
  8: '₈',
  9: '₉',
}

/**
 * Converte "2" em "²" (ou "1" em "₁"). Só troca quando todos os caracteres do
 * trecho têm equivalente — senão devolve a forma original, que ainda se lê.
 */
const emMiniatura = (trecho, mapa, prefixo) => {
  const caracteres = [...String(trecho)]
  if (!caracteres.length || !caracteres.every((caractere) => mapa[caractere])) {
    return `${prefixo}${trecho}`
  }

  return caracteres.map((caractere) => mapa[caractere]).join('')
}

/**
 * Decide se o que está entre cifrões é fórmula. É uma checagem conservadora de
 * propósito: "custa $50 e $30" não pode ser confundido com matemática, então
 * só desembrulha o que tem marcação LaTeX ou é um símbolo curto como "x".
 */
const ehFormula = (interno) =>
  /[\\^_{}]/.test(interno) || /^[A-Za-z][A-Za-z0-9]{0,2}$/.test(interno)

/**
 * Troca a marcação LaTeX pelo símbolo correspondente.
 * @param {string} valor texto devolvido pelo modelo
 * @returns {string} texto pronto para aparecer na tela
 */
export const semLatex = (valor) => {
  const bruto = String(valor ?? '')
  // A maioria das respostas não tem fórmula nenhuma: sai cedo.
  if (!bruto.includes('\\') && !bruto.includes('$')) return bruto.trim()

  let texto = bruto
    // Delimitadores de fórmula: $$…$$, $…$, \(…\) e \[…\].
    .replace(/\$\$([\s\S]*?)\$\$/g, '$1')
    .replace(/\$([^$\n]{1,200}?)\$/g, (completo, interno) =>
      ehFormula(interno) ? interno : completo,
    )
    .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$1')

  texto = texto
    // Frações e raízes viram a forma que se escreve no caderno.
    .replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1/$2)')
    .replace(/\\sqrt\s*\[([^\]]*)\]\s*\{([^{}]*)\}/g, '$1√($2)')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)')
    // Comandos que só embrulham texto, e os de espaçamento.
    .replace(/\\(?:text|textbf|textit|mathrm|mathbf|mathit|operatorname)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\(?:left|right|displaystyle|quad|qquad|,|;|:|!)\s?/g, '')

  // O que sobrou com barra invertida vira símbolo (ou perde só a barra).
  texto = texto.replace(/\\([A-Za-z]+)/g, (completo, nome) => SIMBOLOS[nome] ?? nome)

  texto = texto
    .replace(/\^\{([^{}]+)\}|\^(\w)/g, (completo, entreChaves, solto) =>
      emMiniatura(entreChaves ?? solto, EXPOENTES, '^'),
    )
    .replace(/_\{([^{}]+)\}|_(\w)/g, (completo, entreChaves, solto) =>
      emMiniatura(entreChaves ?? solto, INDICES, '_'),
    )

  // Sobram as chaves soltas de comandos que não conhecemos.
  return texto
    .replace(/[{}]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export default semLatex
