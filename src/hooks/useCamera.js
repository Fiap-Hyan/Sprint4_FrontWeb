import { useCallback, useEffect, useRef, useState } from 'react'

import { INTEGRACAO_ATIVA, gerarResumo, reconhecerTexto, sugerirMateria } from '../services/api'
import { inteiroAleatorio, sortear } from '../utils/aleatorio'
import { quadroDoVideo } from '../utils/imagem'

const TIPOS = ['quadro', 'slide', 'caderno', 'tela']

const ROTULOS_TIPO = {
  quadro: 'Quadro',
  slide: 'Slide',
  caderno: 'Caderno',
  tela: 'Tela',
}

/**
 * Sorteio ponderado da matéria sugerida: matérias com mais anotações têm mais
 * chance de serem sugeridas (Math.random sobre a soma dos pesos). É a sugestão
 * imediata mostrada no painel da captura e o plano B quando a classificação do
 * Gemini (src/services/api.js) não devolve uma matéria.
 */
const sugerirAlbum = (albuns, contarNotas) => {
  if (!albuns.length) return null
  const pesos = albuns.map((album) => contarNotas(album.id) + 1)
  const total = pesos.reduce((soma, peso) => soma + peso, 0)
  let sorteio = Math.random() * total
  for (let indice = 0; indice < albuns.length; indice += 1) {
    sorteio -= pesos[indice]
    if (sorteio <= 0) return albuns[indice]
  }
  return albuns[albuns.length - 1]
}

/**
 * Hook customizado com o comportamento do visor: temporizador, clarão do
 * obturador, montagem da anotação gerada por uma captura e a análise da foto
 * pela IA (OCR do conteúdo e escolha da matéria).
 */
const useCamera = ({
  ajustes,
  albuns,
  contarNotas,
  adicionarNota,
  atualizarNota,
  videoRef,
  aoCapturar,
  aoAnalisar,
}) => {
  const [contagem, setContagem] = useState(0)
  const [clarao, setClarao] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const temporizadores = useRef([])

  useEffect(
    () => () => {
      temporizadores.current.forEach((id) => window.clearTimeout(id))
    },
    [],
  )

  const agendar = useCallback((acao, atraso) => {
    const id = window.setTimeout(acao, atraso)
    temporizadores.current.push(id)
    return id
  }, [])

  /**
   * Roda em segundo plano depois da captura: lê o texto da foto, reclassifica a
   * anotação na matéria sugerida pelo modelo e gera a análise mostrada na tela
   * da anotação. Falhas são ignoradas — a anotação continua com a matéria
   * sorteada localmente.
   */
  const analisarCaptura = useCallback(
    async (nota, imagem) => {
      const ocr = await reconhecerTexto(imagem)
      if (!ocr.ok || !ocr.texto) return

      const campos = { texto: ocr.texto, confiancaIA: ocr.confianca }
      const materia = await sugerirMateria(ocr.texto, albuns)
      if (materia.ok) campos.albumId = materia.albumId

      // A anotação já nasce com a análise pronta, como no aplicativo.
      const analise = await gerarResumo({ ...nota, texto: ocr.texto, imagem }, ajustes)
      if (analise.ok) {
        campos.titulo = analise.titulo || nota.titulo
        campos.palavrasChave = analise.palavrasChave
        campos.resumo = analise.resumo
        campos.pontosChave = analise.pontosChave
      }

      atualizarNota(nota.id, campos, 'captura analisada pela IA')
      if (aoAnalisar) {
        aoAnalisar(nota.id, campos, albuns.find((album) => album.id === campos.albumId) || null)
      }
    },
    [ajustes, albuns, aoAnalisar, atualizarNota],
  )

  const registrarCaptura = useCallback(() => {
    const tipo = ajustes.molduraDocumento ? 'caderno' : sortear(TIPOS)
    const imagem = ajustes.usarWebcam ? quadroDoVideo(videoRef.current) : null
    const sugestao = ajustes.iaAtiva ? sugerirAlbum(albuns, contarNotas) : null
    const horario = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const nota = adicionarNota({
      titulo: `${ROTULOS_TIPO[tipo]} — ${horario}`,
      albumId: sugestao ? sugestao.id : null,
      tipo,
      imagem,
      // Estimativa inicial, substituída pela confiança real do OCR na análise.
      confiancaIA: ajustes.iaAtiva ? inteiroAleatorio(82, 99) : 0,
    })

    setClarao(true)
    agendar(() => setClarao(false), 220)
    setOcupado(false)
    if (aoCapturar) aoCapturar(nota, sugestao)

    if (ajustes.iaAtiva && imagem && INTEGRACAO_ATIVA && atualizarNota) {
      analisarCaptura(nota, imagem)
    }
  }, [
    agendar,
    ajustes,
    albuns,
    adicionarNota,
    analisarCaptura,
    aoCapturar,
    atualizarNota,
    contarNotas,
    videoRef,
  ])

  const capturar = useCallback(() => {
    if (ocupado) return
    setOcupado(true)

    const segundos = ajustes.temporizador || 0
    if (segundos <= 0) {
      registrarCaptura()
      return
    }

    setContagem(segundos)
    for (let restante = segundos - 1; restante >= 0; restante -= 1) {
      agendar(() => setContagem(restante), (segundos - restante) * 1000)
    }
    agendar(registrarCaptura, segundos * 1000)
  }, [agendar, ajustes.temporizador, ocupado, registrarCaptura])

  return { contagem, clarao, ocupado, capturar }
}

export default useCamera
