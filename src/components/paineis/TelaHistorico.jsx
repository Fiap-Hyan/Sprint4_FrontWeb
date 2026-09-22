import CabecalhoTela from '../ui/CabecalhoTela'
import { corHex } from '../../data/cores'
import { dataRelativa } from '../../utils/formato'

const ROTULOS_ACAO = {
  criou: 'Adicionou',
  editou: 'Editou',
  removeu: 'Removeu',
  restaurou: 'Restaurou',
  album: 'Matéria',
}

/**
 * Histórico e estatísticas: registro do que foi adicionado, editado ou removido
 * e números de uso por matéria e por período.
 */
const TelaHistorico = ({ biblioteca, aoVoltar }) => {
  const { estatisticas, historico } = biblioteca

  return (
    <section className="tela tela--conteudo">
      <CabecalhoTela titulo="Histórico e estatísticas" aoVoltar={aoVoltar} />

      <div className="tela__rolagem">
        <div className="faixa-numeros">
          <div>
            <strong>{estatisticas.naSemana}</strong>
            <span>últimos 7 dias</span>
          </div>
          <div>
            <strong>{estatisticas.noMes}</strong>
            <span>últimos 30 dias</span>
          </div>
          <div>
            <strong>{estatisticas.mediaPorMateria}</strong>
            <span>média por matéria</span>
          </div>
        </div>

        <div className="secao-titulo">
          <h2>Uso por matéria</h2>
        </div>

        <ul className="lista-barras">
          {estatisticas.porMateria.map((materia) => (
            <li key={materia.id}>
              <div className="lista-barras__topo">
                <span>{materia.nome}</span>
                <span>
                  {materia.quantidade} · {materia.participacao}%
                </span>
              </div>
              <div className="lista-barras__trilho">
                <span
                  className="lista-barras__valor"
                  style={{
                    width: `${materia.participacao}%`,
                    backgroundColor: corHex(materia.cor),
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="secao-titulo">
          <h2>Confiança do reconhecimento</h2>
        </div>
        <p className="texto-apoio">
          Média de {estatisticas.confiancaMedia}% (mínima {estatisticas.confiancaMinima}%, máxima{' '}
          {estatisticas.confiancaMaxima}%). O valor é simulado enquanto a API de OCR não é conectada.
        </p>

        <div className="secao-titulo">
          <h2>Atividade recente</h2>
        </div>

        {historico.length === 0 ? (
          <p className="estado-vazio">Nenhuma alteração registrada nesta sessão.</p>
        ) : (
          <ul className="lista-eventos">
            {historico.map((evento) => (
              <li key={evento.id} className={`lista-eventos__item is-${evento.acao}`}>
                <span className="lista-eventos__marca" aria-hidden="true" />
                <div>
                  <p className="lista-eventos__titulo">
                    {ROTULOS_ACAO[evento.acao] || 'Alterou'} · {evento.titulo}
                  </p>
                  <p className="lista-eventos__detalhe">
                    {evento.detalhe} — {dataRelativa(evento.data)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default TelaHistorico
