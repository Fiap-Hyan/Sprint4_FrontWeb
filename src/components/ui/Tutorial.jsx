import { useEffect, useState } from 'react'

/** Folga entre o contorno iluminado e o elemento destacado. */
const FOLGA = 6

/**
 * Dica de primeiro uso: escurece a tela inteira, deixa só o elemento em
 * destaque aceso e mostra o cartão explicativo perto dele.
 *
 * O buraco no escuro é feito com `box-shadow` gigante numa caixa transparente
 * posicionada sobre o elemento — assim a sombra pinta tudo em volta e a área
 * de dentro continua visível, sem precisar recortar máscara nenhuma.
 *
 * Nada é desenhado antes de medir o elemento: uma dica cujo alvo ainda não
 * existe na tela (o botão de ouvir de uma anotação sem análise, por exemplo)
 * é pulada em silêncio, em vez de virar um retângulo preto sem explicação.
 */
const Tutorial = ({ dica, aoAvancar, aoPular }) => {
  const [medida, setMedida] = useState(null)

  useEffect(() => {
    if (!dica) return undefined

    /**
     * Mede o elemento marcado com `data-dica` em relação à tela do aparelho.
     * Roda dentro de requestAnimationFrame para o layout já estar pronto (a
     * dica costuma abrir junto com a tela).
     */
    const medir = () => {
      const alvo = document.querySelector(`[data-dica="${dica.alvo}"]`)
      const palco = document.querySelector('.dispositivo__tela')

      if (!alvo || !palco) {
        // Alvo ausente: segue para a próxima sem contar como dica exibida.
        aoAvancar(false)
        return
      }

      const caixa = alvo.getBoundingClientRect()
      const base = palco.getBoundingClientRect()

      setMedida({
        alvo: dica.alvo,
        topo: caixa.top - base.top - FOLGA,
        esquerda: caixa.left - base.left - FOLGA,
        largura: caixa.width + FOLGA * 2,
        altura: caixa.height + FOLGA * 2,
        alturaDaTela: base.height,
      })
    }

    const quadro = requestAnimationFrame(medir)
    window.addEventListener('resize', medir)

    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('resize', medir)
    }
  }, [aoAvancar, dica])

  // Enquanto a medida não for a desta dica, não há nada para desenhar.
  if (!dica || medida?.alvo !== dica.alvo) return null

  const meio = medida.topo + medida.altura / 2
  const cartaoEmbaixo = meio < medida.alturaDaTela / 2

  return (
    <div className="absolute inset-0 z-[70]" role="dialog" aria-label={dica.titulo}>
      {/* Escuro com buraco: clicar fora avança, como no aplicativo. */}
      <button
        type="button"
        className="absolute cursor-default"
        style={{
          top: medida.topo,
          left: medida.esquerda,
          width: medida.largura,
          height: medida.altura,
          borderRadius: 18,
          border: '2px solid var(--color-roxo, #7c4dff)',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.78)',
        }}
        onClick={() => aoAvancar()}
        aria-label="Avançar a dica"
      />

      <article
        className="absolute inset-x-3 rounded-[22px] border border-roxo/45 bg-cartao-2 p-5 shadow-2xl shadow-black/60"
        style={cartaoEmbaixo ? { bottom: 16 } : { top: 16 }}
      >
        <h2 className="text-[1.05rem] font-semibold text-texto">{dica.titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-texto-medio">{dica.texto}</p>

        <footer className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            className="text-sm text-texto-fraco transition hover:text-texto"
            onClick={aoPular}
          >
            Pular
          </button>

          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: dica.total }, (_, indice) => (
              <span
                key={indice}
                className={
                  indice === dica.passo
                    ? 'h-1.5 w-5 rounded-full bg-roxo'
                    : 'size-1.5 rounded-full bg-white/25'
                }
              />
            ))}
          </div>

          <button
            type="button"
            className="rounded-full bg-roxo px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            onClick={() => aoAvancar()}
          >
            Entendi
          </button>
        </footer>
      </article>
    </div>
  )
}

export default Tutorial
