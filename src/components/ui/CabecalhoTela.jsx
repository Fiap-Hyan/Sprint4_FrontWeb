import BotaoIcone from './BotaoIcone'
import { IconeVoltar } from './Icones'

/**
 * Cabeçalho padrão das telas internas (voltar + título + ações à direita),
 * igual ao usado nas telas de Álbuns e de cada matéria.
 */
const CabecalhoTela = ({ titulo, aoVoltar, acoes = [] }) => (
  <header className="cabecalho-tela">
    <BotaoIcone rotulo="Voltar" aoClicar={aoVoltar}>
      <IconeVoltar tamanho={26} />
    </BotaoIcone>
    <h1 className="cabecalho-tela__titulo">{titulo}</h1>
    <div className="cabecalho-tela__acoes">
      {acoes.map((acao) => (
        <BotaoIcone
          key={acao.rotulo}
          rotulo={acao.rotulo}
          aoClicar={acao.aoClicar}
          data-dica={acao.dica}
        >
          {acao.icone}
        </BotaoIcone>
      ))}
    </div>
  </header>
)

export default CabecalhoTela
