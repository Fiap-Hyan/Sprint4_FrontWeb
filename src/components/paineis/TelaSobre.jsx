import CabecalhoTela from '../ui/CabecalhoTela'
import { CREDITOS, DOCUMENTOS, EMAIL_SUPORTE, HISTORIA, VERSAO } from '../../data/creditos'
import { IconeLinkedIn } from '../ui/Icones'

/**
 * Ajustes > Sobre: a história do projeto, os créditos da equipe (com o RM de
 * cada integrante, que a banca costuma conferir) e o contato do suporte.
 */
const TelaSobre = ({ aoVoltar }) => (
  <section className="tela">
    <CabecalhoTela titulo="Sobre" aoVoltar={aoVoltar} />

    <div className="flex-1 overflow-y-auto px-5 pb-6">
      <header className="pb-6 text-center">
        <span className="mx-auto mb-3 grid size-20 place-items-center rounded-[26px] bg-gradient-to-br from-roxo to-roxo-escuro text-4xl">
          🎓
        </span>
        <h1 className="text-2xl font-semibold text-texto">StudyCam AI</h1>
        <p className="text-sm text-texto-fraco">Versão {VERSAO}</p>
      </header>

      <h2 className="mb-2 text-lg font-medium text-texto">Nossa História</h2>
      {HISTORIA.map((paragrafo) => (
        <p key={paragrafo.slice(0, 24)} className="mb-3 text-[0.95rem] leading-relaxed text-texto-medio">
          {paragrafo}
        </p>
      ))}

      <h2 className="mb-3 mt-7 text-lg font-medium text-texto">Créditos do Projeto</h2>
      <ul className="flex flex-col gap-4">
        {CREDITOS.map((pessoa) => (
          <li key={pessoa.id} className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-texto-fraco">{pessoa.papel}</p>
              <p className="text-[1.02rem] text-texto">{pessoa.nome}</p>
              <p className="text-sm text-texto-fraco">RM{pessoa.rm}</p>
            </div>
            <a
              href={pessoa.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`LinkedIn de ${pessoa.nome}`}
              className="shrink-0 text-roxo transition hover:text-roxo-claro"
            >
              <IconeLinkedIn tamanho={30} />
            </a>
          </li>
        ))}
      </ul>

      <hr className="my-6 border-white/10" />

      {/* Abrem no lugar: o protótipo não tem páginas jurídicas separadas. */}
      <ul className="flex flex-col gap-2">
        {DOCUMENTOS.map((documento) => (
          <li key={documento.id}>
            <details className="rounded-2xl bg-superficie px-4 py-3">
              <summary className="cursor-pointer text-[1.02rem] text-roxo-claro">
                {documento.rotulo}
              </summary>
              {documento.paragrafos.map((paragrafo) => (
                <p
                  key={paragrafo.slice(0, 24)}
                  className="mt-3 text-sm leading-relaxed text-texto-medio"
                >
                  {paragrafo}
                </p>
              ))}
            </details>
          </li>
        ))}
      </ul>

      <a
        href={`mailto:${EMAIL_SUPORTE}?subject=StudyCam%20AI`}
        className="mt-6 block rounded-2xl bg-gradient-to-r from-roxo to-[#8b5cf6] py-3.5 text-center text-[0.98rem] font-semibold text-white transition hover:brightness-110"
      >
        Falar com o suporte
      </a>
      <p className="mt-2 text-center text-sm text-texto-fraco">{EMAIL_SUPORTE}</p>
    </div>
  </section>
)

export default TelaSobre
