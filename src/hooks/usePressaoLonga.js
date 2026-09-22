import { useCallback, useEffect, useRef } from 'react'

const DURACAO_PADRAO = 450

/**
 * Hook customizado que separa o toque rápido da pressão longa em um mesmo botão
 * (como no atalho da galeria: tocar abre a galeria, segurar revela os álbuns).
 * Devolve os manipuladores prontos para serem espalhados no elemento.
 */
const usePressaoLonga = (aoSegurar, aoTocar, duracao = DURACAO_PADRAO) => {
  const temporizador = useRef(null)
  const jaDisparou = useRef(false)

  const limpar = useCallback(() => {
    if (temporizador.current) {
      window.clearTimeout(temporizador.current)
      temporizador.current = null
    }
  }, [])

  useEffect(() => limpar, [limpar])

  const iniciar = useCallback(() => {
    jaDisparou.current = false
    limpar()
    temporizador.current = window.setTimeout(() => {
      jaDisparou.current = true
      aoSegurar()
    }, duracao)
  }, [aoSegurar, duracao, limpar])

  const finalizar = useCallback(() => {
    limpar()
    if (!jaDisparou.current) aoTocar()
    jaDisparou.current = false
  }, [aoTocar, limpar])

  const cancelar = useCallback(() => {
    limpar()
    jaDisparou.current = false
  }, [limpar])

  /** Teclado: Enter/Espaço tocam; Enter/Espaço com Shift equivalem a segurar. */
  const aoTeclar = useCallback(
    (evento) => {
      if (evento.key !== 'Enter' && evento.key !== ' ') return
      evento.preventDefault()
      if (evento.shiftKey) aoSegurar()
      else aoTocar()
    },
    [aoSegurar, aoTocar],
  )

  return {
    onPointerDown: iniciar,
    onPointerUp: finalizar,
    onPointerLeave: cancelar,
    onPointerCancel: cancelar,
    onKeyDown: aoTeclar,
    onContextMenu: (evento) => evento.preventDefault(),
  }
}

export default usePressaoLonga
