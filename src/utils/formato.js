// Funções puras de formatação. Concentram o uso dos métodos de Math exigidos na
// Sprint (arredondamento, piso, teto, mínimo/máximo e potências).

const UM_DIA = 1000 * 60 * 60 * 24

/** Diferença em dias inteiros entre uma data ISO e agora (Math.floor). */
export const diasDesde = (iso) => {
  const diferenca = Date.now() - new Date(iso).getTime()
  return Math.floor(diferenca / UM_DIA)
}

/** Texto relativo curto usado nos cartões ("Atualizado hoje", "há 3 dias"...). */
export const dataRelativa = (iso) => {
  if (!iso) return 'sem data'
  const dias = diasDesde(iso)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  if (dias < 7) return `há ${dias} dias`
  if (dias < 30) return `há ${Math.ceil(dias / 7)} semanas`
  return `há ${Math.floor(dias / 30)} meses`
}

/** Data completa em pt-BR: 26/08/2026 às 19:09. */
export const dataCompleta = (iso) => {
  if (!iso) return '—'
  const data = new Date(iso)
  const dia = data.toLocaleDateString('pt-BR')
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dia} às ${hora}`
}

/** Relógio da barra de status (HH:MM). */
export const horaCurta = (data = new Date()) =>
  data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

/** Data curta do histórico de simulados: 22 de set. */
export const dataCurta = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

/** Percentual inteiro protegido contra divisão por zero (Math.round). */
export const percentual = (parte, total) => {
  if (!total) return 0
  return Math.round((parte / total) * 100)
}

/** Mantém um número dentro de um intervalo (Math.min + Math.max). */
export const limitar = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor))

/** Tamanho de arquivo legível a partir de bytes (Math.pow + Math.floor). */
export const tamanhoLegivel = (bytes) => {
  if (!bytes) return '0 KB'
  const unidades = ['B', 'KB', 'MB', 'GB']
  const indice = Math.min(unidades.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const valor = bytes / Math.pow(1024, indice)
  return `${valor.toFixed(indice === 0 ? 0 : 1)} ${unidades[indice]}`
}

/** Plural simples usado em "3 notas" / "1 nota". */
export const plural = (quantidade, singular, formaPlural) =>
  `${quantidade} ${quantidade === 1 ? singular : formaPlural}`

/** Dias restantes até a exclusão definitiva na lixeira (Math.max + Math.ceil). */
export const diasRestantesLixeira = (iso, retencao = 30) =>
  Math.max(0, Math.ceil(retencao - diasDesde(iso)))

/** Título das seções da galeria: "Hoje", "Ontem" ou a data por extenso. */
export const rotuloDoDia = (iso) => {
  const dias = diasDesde(iso)
  if (dias <= 0) return 'Hoje'
  if (dias === 1) return 'Ontem'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}
