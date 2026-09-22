// Utilitários de aleatoriedade. Usados para gerar identificadores de captura,
// simular a confiança do reconhecimento da IA e desenhar as miniaturas das
// anotações de forma determinística.

/** Inteiro aleatório entre mínimo e máximo, ambos incluídos (Math.random). */
export const inteiroAleatorio = (minimo, maximo) =>
  Math.floor(Math.random() * (maximo - minimo + 1)) + minimo

/** Sorteia um item de uma lista. */
export const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)]

/** Identificador único e legível para novas capturas. */
export const gerarId = (prefixo = 'nota') =>
  `${prefixo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

/**
 * Gerador pseudoaleatório determinístico: a mesma semente sempre devolve a mesma
 * sequência. Garante que a miniatura de uma anotação não mude a cada renderização.
 */
export const geradorComSemente = (semente) => {
  let estado = 0
  const texto = String(semente)
  for (let i = 0; i < texto.length; i += 1) {
    estado += texto.charCodeAt(i) * (i + 1)
  }
  return () => {
    estado += 1
    const valor = Math.sin(estado) * 10000
    return Math.abs(valor - Math.floor(valor))
  }
}
