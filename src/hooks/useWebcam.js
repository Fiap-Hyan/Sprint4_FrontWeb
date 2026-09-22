import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Liga a câmera real do dispositivo no visor. A permissão é pedida ao entrar no
 * protótipo (src/paginas/PaginaAplicativo.jsx) e pode ser ligada/desligada
 * depois em Ajustes. Quando o navegador nega a permissão ou não tem câmera, o
 * visor volta para a simulação e o aplicativo continua funcionando normalmente.
 */
const useWebcam = (ativo) => {
  const elementoVideo = useRef(null)
  const transmissao = useRef(null)
  const [estado, setEstado] = useState({ status: 'inativo', erro: null })

  /**
   * Ref de callback: liga a transmissão assim que o elemento <video> entra na
   * árvore (o visor só existe na tela da câmera).
   */
  const conectarVideo = useCallback((elemento) => {
    elementoVideo.current = elemento
    if (elemento && transmissao.current) {
      elemento.srcObject = transmissao.current
      elemento.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!ativo) return undefined

    let cancelado = false

    const iniciar = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setEstado({
          status: 'erro',
          erro: 'Este navegador não expõe a câmera (é preciso HTTPS ou localhost).',
        })
        return
      }

      setEstado({ status: 'carregando', erro: null })

      try {
        const fluxo = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })

        if (cancelado) {
          fluxo.getTracks().forEach((faixa) => faixa.stop())
          return
        }

        transmissao.current = fluxo
        if (elementoVideo.current) {
          elementoVideo.current.srcObject = fluxo
          await elementoVideo.current.play().catch(() => {})
        }
        setEstado({ status: 'ativo', erro: null })
      } catch {
        if (cancelado) return
        setEstado({
          status: 'erro',
          erro: 'Permissão de câmera negada. O visor continua no modo simulado.',
        })
      }
    }

    iniciar()

    return () => {
      cancelado = true
      if (transmissao.current) {
        transmissao.current.getTracks().forEach((faixa) => faixa.stop())
        transmissao.current = null
      }
    }
  }, [ativo])

  return {
    videoRef: elementoVideo,
    conectarVideo,
    status: ativo ? estado.status : 'inativo',
    erro: ativo ? estado.erro : null,
  }
}

export default useWebcam
