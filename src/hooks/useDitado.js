import { useCallback, useEffect, useRef, useState } from 'react'

/** Implementação do reconhecimento de fala (o Chrome usa o prefixo webkit). */
const Reconhecimento =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

/** Indica se o navegador transcreve fala — o botão fica oculto quando não. */
export const ditadoDisponivel = () => Boolean(Reconhecimento)

/**
 * Hook customizado do microfone do tutor: transcreve a fala direto na caixa de
 * texto, palavra por palavra, como promete a dica da tela. O texto parcial é
 * devolvido separado do definitivo para que a caixa mostre o que está sendo
 * falado sem gravar isso duas vezes quando a frase é confirmada.
 *
 * @param {(trecho:string) => void} aoTranscrever recebe cada trecho definitivo
 */
const useDitado = (aoTranscrever) => {
  const [gravando, setGravando] = useState(false)
  const [parcial, setParcial] = useState('')
  const [erro, setErro] = useState(null)
  const motor = useRef(null)
  // Ref para o callback não obrigar a recriar o reconhecimento a cada tecla.
  const entrega = useRef(aoTranscrever)

  useEffect(() => {
    entrega.current = aoTranscrever
  }, [aoTranscrever])

  useEffect(() => {
    if (!Reconhecimento) return undefined

    const instancia = new Reconhecimento()
    instancia.lang = 'pt-BR'
    instancia.continuous = true
    instancia.interimResults = true

    instancia.onresult = (evento) => {
      let emAndamento = ''

      for (let indice = evento.resultIndex; indice < evento.results.length; indice += 1) {
        const resultado = evento.results[indice]
        const trecho = resultado[0].transcript

        if (resultado.isFinal) entrega.current(trecho)
        else emAndamento += trecho
      }

      setParcial(emAndamento)
    }

    instancia.onerror = (evento) => {
      setGravando(false)
      setParcial('')
      setErro(
        evento.error === 'not-allowed'
          ? 'Permissão de microfone negada.'
          : 'Não foi possível ouvir o microfone.',
      )
    }

    instancia.onend = () => {
      setGravando(false)
      setParcial('')
    }

    motor.current = instancia

    return () => {
      instancia.onresult = null
      instancia.onerror = null
      instancia.onend = null
      instancia.stop()
      motor.current = null
    }
  }, [])

  const alternar = useCallback(() => {
    if (!motor.current) {
      setErro('Este navegador não transcreve fala.')
      return
    }

    setErro(null)

    if (gravando) {
      motor.current.stop()
      setGravando(false)
      return
    }

    try {
      motor.current.start()
      setGravando(true)
    } catch {
      // start() lança quando já está gravando: o estado já reflete isso.
      setGravando(true)
    }
  }, [gravando])

  return { disponivel: Boolean(Reconhecimento), gravando, parcial, erro, alternar }
}

export default useDitado
