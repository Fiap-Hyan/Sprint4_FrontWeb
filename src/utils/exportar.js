/** Nome de arquivo seguro a partir do título da anotação. */
const nomeDoArquivo = (titulo, extensao) =>
  `${(titulo || '').replace(/[^\w\s-]/g, '').trim() || 'anotacao'}.${extensao}`

/** Dispara o download de um endereço (data URL ou blob URL) já pronto. */
const baixar = (url, nome) => {
  const link = document.createElement('a')
  link.href = url
  link.download = nome
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** Gera o download de uma anotação em JSON (ação "exportar" do escopo). */
export const exportarNota = (nota, album) => {
  const conteudo = {
    aplicativo: 'StudyCam AI',
    exportadoEm: new Date().toISOString(),
    anotacao: {
      titulo: nota.titulo,
      materia: album ? album.nome : 'sem matéria',
      tipo: nota.tipo,
      criadoEm: nota.criadoEm,
      confiancaIA: nota.confiancaIA,
      resumo: nota.resumo,
      palavrasChave: nota.palavrasChave,
      pontosChave: nota.pontosChave,
      quiz: nota.quiz,
      texto: nota.texto,
    },
  }

  const arquivo = new Blob([JSON.stringify(conteudo, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(arquivo)
  baixar(url, nomeDoArquivo(nota.titulo, 'json'))
  URL.revokeObjectURL(url)
}

/**
 * Botão de download da tela da anotação: salva a foto quando a captura tem
 * imagem e, quando não tem, exporta o conteúdo da anotação em JSON.
 * @returns {string} mensagem para o aviso da interface
 */
export const baixarNota = (nota, album) => {
  if (!nota.imagem) {
    exportarNota(nota, album)
    return 'Anotação exportada em JSON'
  }

  const extensao = /^data:image\/(\w+)/.exec(nota.imagem)?.[1] || 'png'
  baixar(nota.imagem, nomeDoArquivo(nota.titulo, extensao === 'jpeg' ? 'jpg' : extensao))
  return 'Foto salva no dispositivo'
}

/** Texto compartilhado pela ação de compartilhar da tela da anotação. */
export const textoParaCompartilhar = (nota, album) => {
  const pontos = (nota.pontosChave || []).map((ponto) => `• ${ponto}`).join('\n')

  return [
    nota.titulo,
    album ? `Matéria: ${album.nome}` : null,
    '',
    nota.resumo || 'Anotação ainda sem resumo.',
    pontos ? `\nPontos-chave:\n${pontos}` : null,
    '\nStudyCam AI',
  ]
    .filter((linha) => linha !== null)
    .join('\n')
}

export default exportarNota
