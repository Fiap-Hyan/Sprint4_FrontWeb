import { IconeChapeu, IconeChat, IconeMarcador } from './Icones'

/**
 * Abas da biblioteca, fixas no rodapé do aparelho. São as três áreas que o
 * botão de biblioteca da câmera abre: os álbuns por matéria, o chat do tutor e
 * os simulados.
 *
 * O `data-dica` de cada aba é o que as dicas de primeiro uso apontam quando
 * apresentam o tutor e a aba de treinar.
 */
const ABAS = [
  { id: 'albuns', rotulo: 'Biblioteca', dica: 'aba-biblioteca', Icone: IconeMarcador },
  { id: 'tutor', rotulo: 'Tutor', dica: 'aba-tutor', Icone: IconeChat },
  { id: 'estudar', rotulo: 'Estudar', dica: 'aba-estudar', Icone: IconeChapeu },
]

/** Telas que mantêm cada aba acesa quando o usuário navega para dentro dela. */
const ABA_DA_TELA = {
  albuns: 'albuns',
  album: 'albuns',
  nota: 'albuns',
  galeria: 'albuns',
  busca: 'albuns',
  central: 'albuns',
  lixeira: 'albuns',
  tutor: 'tutor',
  estudar: 'estudar',
  'escolher-conteudo': 'estudar',
  'montar-simulado': 'estudar',
  simulado: 'estudar',
  resultado: 'estudar',
}

const BarraAbas = ({ tela, aoTrocar }) => {
  const ativa = ABA_DA_TELA[tela] || null

  return (
    <nav className="flex shrink-0 items-stretch border-t border-white/8 bg-[#141020]">
      {ABAS.map(({ id, rotulo, dica, Icone }) => {
        const selecionada = ativa === id

        return (
          <button
            key={id}
            type="button"
            data-dica={dica}
            onClick={() => aoTrocar(id)}
            aria-current={selecionada ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium transition ${
              selecionada ? 'text-roxo' : 'text-texto-fraco hover:text-texto-medio'
            }`}
          >
            <Icone tamanho={23} />
            {rotulo}
          </button>
        )
      })}
    </nav>
  )
}

export default BarraAbas
