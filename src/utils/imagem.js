// Redução de imagens antes de guardar no localStorage. Sem isso, uma única foto
// estoura a cota do navegador (≈5 MB por origem).

import { limitar } from './formato'

const LARGURA_MAXIMA = 640
const QUALIDADE = 0.7

/** Desenha a origem (imagem ou vídeo) em um canvas reduzido e devolve um JPEG base64. */
const reduzirParaDataURL = (origem, larguraOriginal, alturaOriginal) => {
  const escala = limitar(LARGURA_MAXIMA / Math.max(larguraOriginal, alturaOriginal), 0.05, 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(larguraOriginal * escala)
  canvas.height = Math.round(alturaOriginal * escala)
  const contexto = canvas.getContext('2d')
  contexto.drawImage(origem, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', QUALIDADE)
}

/** Converte um arquivo escolhido pelo usuário em uma miniatura base64. */
export const arquivoParaMiniatura = (arquivo) =>
  new Promise((resolve, reject) => {
    if (!arquivo || !arquivo.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem.'))
      return
    }
    const leitor = new FileReader()
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'))
    leitor.onload = () => {
      const imagem = new Image()
      imagem.onerror = () => reject(new Error('Não foi possível abrir a imagem.'))
      imagem.onload = () => {
        try {
          resolve(reduzirParaDataURL(imagem, imagem.naturalWidth, imagem.naturalHeight))
        } catch (erro) {
          reject(erro)
        }
      }
      imagem.src = leitor.result
    }
    leitor.readAsDataURL(arquivo)
  })

/** Captura o quadro atual de um elemento <video> (visor com webcam ativa). */
export const quadroDoVideo = (video) => {
  if (!video || !video.videoWidth) return null
  try {
    return reduzirParaDataURL(video, video.videoWidth, video.videoHeight)
  } catch {
    return null
  }
}
