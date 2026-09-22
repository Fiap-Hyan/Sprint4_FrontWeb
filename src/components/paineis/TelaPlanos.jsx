import CabecalhoTela from '../ui/CabecalhoTela'
import { AVISO_COBRANCA, PLANOS, PLANO_ATUAL } from '../../data/planos'

/**
 * Tela de planos. Durante o Challenge todo mundo usa o Premium por cortesia,
 * então a tela apresenta os dois planos e deixa claro que nada é cobrado.
 */
const TelaPlanos = ({ aoVoltar }) => (
  <section className="tela">
    <CabecalhoTela titulo="Planos" aoVoltar={aoVoltar} />

    <div className="flex-1 overflow-y-auto px-5 pb-6">
      <p className="pb-4 text-sm leading-relaxed text-texto-medio">
        Você está com acesso completo, por cortesia durante o período de testes.
      </p>

      <ul className="flex flex-col gap-3">
        {PLANOS.map((plano) => {
          const atual = plano.id === PLANO_ATUAL

          return (
            <li
              key={plano.id}
              className={`rounded-[22px] p-5 ${
                plano.destaque
                  ? 'bg-gradient-to-br from-roxo to-[#8b5cf6] text-white'
                  : 'bg-superficie text-texto'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-xl font-semibold">{plano.nome}</h2>
                {atual && (
                  <span
                    className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide ${
                      plano.destaque ? 'bg-white/25' : 'bg-roxo/20 text-roxo-claro'
                    }`}
                  >
                    Em uso
                  </span>
                )}
              </div>

              <ul className="mt-3 flex flex-col gap-1.5">
                {plano.itens.map((item) => (
                  <li
                    key={item}
                    className={`text-[0.95rem] ${
                      plano.destaque ? 'text-white/95' : 'text-texto-medio'
                    }`}
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>

      <p className="pt-4 text-sm text-texto-fraco">{AVISO_COBRANCA}</p>
    </div>
  </section>
)

export default TelaPlanos
