import { useState } from 'react'

import CabecalhoTela from '../ui/CabecalhoTela'
import Interruptor from '../ui/Interruptor'
import { AMOSTRAS, IDIOMAS, VELOCIDADES } from '../../data/idiomas'
import { IconeAltoFalante, IconeParar } from '../ui/Icones'
import { TIPOS_DE_VOZ, disponivel, falar, parar } from '../../services/textToSpeech'

/**
 * Ajustes > Idioma e voz. A escolha vale para três coisas ao mesmo tempo: os
 * textos que a IA escreve, a língua do resumo e a voz que narra — por isso a
 * tela junta tudo num lugar só, como no aplicativo.
 */
const TelaIdiomaVoz = ({ ajustes, definirAjuste, aoVoltar, aoAvisar }) => {
  const [ouvindo, setOuvindo] = useState(false)

  const ouvirAmostra = async () => {
    if (ouvindo) {
      parar()
      setOuvindo(false)
      return
    }

    setOuvindo(true)
    const resposta = await falar(AMOSTRAS[ajustes.idioma] || AMOSTRAS['pt-BR'], {
      idioma: ajustes.idioma,
      voz: ajustes.voz,
      velocidade: ajustes.velocidadeVoz,
      aoTerminar: () => setOuvindo(false),
    })

    if (!resposta.ok) {
      setOuvindo(false)
      aoAvisar(resposta.mensagem)
    }
  }

  return (
    <section className="tela">
      <CabecalhoTela titulo="Idioma e voz" aoVoltar={aoVoltar} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <p className="pb-3 text-sm leading-relaxed text-texto-medio">
          A escolha vale para a língua em que a IA escreve o resumo, as perguntas do simulado e as
          respostas do tutor — e para a voz que narra.
        </p>

        <ul className="flex flex-col gap-2">
          {IDIOMAS.map((idioma) => {
            const escolhido = ajustes.idioma === idioma.id

            return (
              <li key={idioma.id}>
                <button
                  type="button"
                  onClick={() => definirAjuste('idioma', idioma.id)}
                  aria-pressed={escolhido}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start transition ${
                    escolhido ? 'bg-superficie-2 ring-1 ring-roxo/50' : 'bg-superficie hover:bg-superficie-2'
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">
                    {idioma.bandeira}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.98rem] text-texto">{idioma.rotulo}</span>
                    {escolhido && (
                      <span className="block text-sm text-texto-fraco">
                        resumo, simulados, tutor e narração
                      </span>
                    )}
                  </span>
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                      escolhido ? 'border-roxo' : 'border-white/25'
                    }`}
                    aria-hidden="true"
                  >
                    {escolhido && <span className="size-2.5 rounded-full bg-roxo" />}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <h2 className="mb-2 mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-texto-fraco">
          Ajustes finos
        </h2>
        <div className="rounded-2xl bg-superficie px-4">
          <Interruptor
            id="ajuste-idioma-documento"
            rotulo="Resumir no idioma do documento"
            descricao="Útil para estudar outra língua"
            ligado={ajustes.resumirNoIdiomaDoDocumento}
            aoAlternar={(valor) => definirAjuste('resumirNoIdiomaDoDocumento', valor)}
          />
        </div>

        <h2 className="mb-2 mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-texto-fraco">
          Voz da narração
        </h2>

        <div className="rounded-2xl bg-superficie p-4">
          <p className="mb-2 text-sm text-texto-medio">Voz</p>
          <div className="flex gap-2">
            {TIPOS_DE_VOZ.map((tipo) => (
              <button
                key={tipo.id}
                type="button"
                onClick={() => definirAjuste('voz', tipo.id)}
                aria-pressed={ajustes.voz === tipo.id}
                className={`rounded-2xl px-5 py-2.5 text-[0.95rem] font-medium transition ${
                  ajustes.voz === tipo.id
                    ? 'bg-roxo text-white'
                    : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
                }`}
              >
                {tipo.rotulo}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-4 text-sm text-texto-medio">Velocidade</p>
          <div className="flex flex-wrap gap-2">
            {VELOCIDADES.map((valor) => (
              <button
                key={valor}
                type="button"
                onClick={() => definirAjuste('velocidadeVoz', valor)}
                aria-pressed={ajustes.velocidadeVoz === valor}
                className={`rounded-2xl px-4 py-2.5 text-[0.95rem] font-medium transition ${
                  ajustes.velocidadeVoz === valor
                    ? 'bg-roxo text-white'
                    : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
                }`}
              >
                {valor.toString().replace('.', ',')}x
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={ouvirAmostra}
          disabled={!disponivel()}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-superficie py-3.5 text-[0.95rem] font-medium text-roxo-claro transition hover:bg-superficie-2 disabled:opacity-40"
        >
          {ouvindo ? <IconeParar tamanho={18} /> : <IconeAltoFalante tamanho={20} />}
          {ouvindo ? 'Parar a amostra' : 'Ouvir uma amostra'}
        </button>
      </div>
    </section>
  )
}

export default TelaIdiomaVoz
