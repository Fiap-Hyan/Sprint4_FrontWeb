import { useEffect, useState } from 'react'

// Componente filho: conta de 0 até o valor final recebido por props
const Contador = ({ valorFinal, sufixo = '', rotulo, divisor = 1 }) => {
  const [valorAtual, setValorAtual] = useState(0)

  useEffect(() => {
    const totalPassos = 40
    let passo = 0

    // setInterval avança a contagem aos poucos, até completar todos os passos
    const temporizador = setInterval(() => {
      passo = passo + 1

      // Math: multiplica, divide e ARREDONDA o valor parcial da contagem
      const parcial = Math.round((valorFinal * passo) / totalPassos)
      // Math.min garante que a contagem nunca ultrapasse o valor final
      setValorAtual(Math.min(parcial, valorFinal))

      if (passo >= totalPassos) {
        clearInterval(temporizador)
      }
    }, 40)

    // Limpa o temporizador caso o componente saia da tela
    return () => clearInterval(temporizador)
  }, [valorFinal])

  // Notas como 4.8 são guardadas como 48 e divididas só na hora de exibir
  const valorExibido =
    divisor > 1 ? (valorAtual / divisor).toFixed(1) : valorAtual.toLocaleString('pt-BR')

  return (
    <div className="contador-item">
      <strong>
        {valorExibido}
        {sufixo}
      </strong>
      <span>{rotulo}</span>
    </div>
  )
}

export default Contador
