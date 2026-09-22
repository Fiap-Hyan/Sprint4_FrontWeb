import { IconeSetaDireita } from '../ui/Icones'

/**
 * Linha de Ajustes: ícone, título, valor atual e a seta que leva para a tela
 * de dentro. É o mesmo desenho das linhas "Planos", "Idioma e voz" e "Sobre".
 */
const LinhaAjuste = ({ icone, titulo, descricao, aoClicar, dica }) => (
  <button
    type="button"
    onClick={aoClicar}
    data-dica={dica}
    className="flex w-full items-center gap-3 rounded-2xl bg-superficie px-4 py-3.5 text-start transition hover:bg-superficie-2"
  >
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-roxo/18 text-roxo-claro">
      {icone}
    </span>

    <span className="min-w-0 flex-1">
      <span className="block truncate text-[0.98rem] text-texto">{titulo}</span>
      {descricao && <span className="block truncate text-sm text-texto-fraco">{descricao}</span>}
    </span>

    <span className="shrink-0 text-texto-fraco">
      <IconeSetaDireita tamanho={18} />
    </span>
  </button>
)

export default LinhaAjuste
