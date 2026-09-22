import { useEffect } from 'react'

/** Mensagem temporária exibida na base da tela (padrão Toast do Android). */
const Aviso = ({ mensagem, aoFechar, duracao = 2600 }) => {
  useEffect(() => {
    if (!mensagem) return undefined
    const tempo = window.setTimeout(aoFechar, duracao)
    return () => window.clearTimeout(tempo)
  }, [mensagem, aoFechar, duracao])

  if (!mensagem) return null

  return (
    <div className="aviso" role="status" aria-live="polite">
      {mensagem}
    </div>
  )
}

export default Aviso
