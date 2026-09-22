import CabecalhoTela from '../ui/CabecalhoTela'
import ItemNota from '../notas/ItemNota'
import { diasRestantesLixeira, plural } from '../../utils/formato'
import { IconeLixeira, IconeRestaurar } from '../ui/Icones'

/** Lixeira: recuperação de anotações excluídas dentro do prazo de retenção. */
const TelaLixeira = ({ biblioteca, aoVoltar, aoAbrir, aoAvisar }) => {
  const itens = biblioteca.notasNaLixeira

  return (
    <section className="tela tela--conteudo">
      <CabecalhoTela
        titulo="Lixeira"
        aoVoltar={aoVoltar}
        acoes={
          itens.length
            ? [
                {
                  rotulo: 'Esvaziar lixeira',
                  icone: <IconeLixeira tamanho={24} />,
                  aoClicar: () => {
                    biblioteca.esvaziarLixeira()
                    aoAvisar('Lixeira esvaziada')
                  },
                },
              ]
            : []
        }
      />

      <div className="tela__rolagem">
        <p className="texto-apoio">
          As anotações ficam aqui por {biblioteca.retencaoLixeira} dias antes de serem apagadas
          definitivamente.
        </p>

        {itens.length === 0 ? (
          <p className="estado-vazio">A lixeira está vazia.</p>
        ) : (
          <>
            <p className="contador-resultados">{plural(itens.length, 'item', 'itens')}</p>
            <ul className="lista-notas">
              {itens.map((nota) => (
                <ItemNota
                  key={nota.id}
                  nota={nota}
                  album={biblioteca.albuns.find((item) => item.id === nota.albumId)}
                  complemento={`restam ${diasRestantesLixeira(nota.excluidaEm, biblioteca.retencaoLixeira)} dias`}
                  aoAbrir={() => aoAbrir('nota', nota.id)}
                  acoes={
                    <>
                      <button
                        type="button"
                        className="botao-linha"
                        onClick={() => {
                          biblioteca.restaurarNota(nota.id)
                          aoAvisar('Anotação restaurada')
                        }}
                        aria-label={`Restaurar ${nota.titulo}`}
                      >
                        <IconeRestaurar tamanho={20} />
                      </button>
                      <button
                        type="button"
                        className="botao-linha is-perigo"
                        onClick={() => {
                          biblioteca.excluirDefinitivo(nota.id)
                          aoAvisar('Anotação apagada definitivamente')
                        }}
                        aria-label={`Apagar ${nota.titulo}`}
                      >
                        <IconeLixeira tamanho={20} />
                      </button>
                    </>
                  }
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

export default TelaLixeira
