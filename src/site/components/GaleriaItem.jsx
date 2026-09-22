import PhoneMockup from './PhoneMockup'

const TelaScan = () => (
  <>
    <div className="mock-topo"><span>Modo Estudo</span></div>
    <div className="mock-visor">
      <span className="mock-scan" />
      <div className="mock-guia" />
    </div>
    <div className="mock-modos">
      <span>Foto</span>
      <span className="ativo">Estudo</span>
      <span>Vídeo</span>
    </div>
  </>
)

// Os álbuns e as contagens reproduzem o conteúdo inicial do protótipo
// (src/data/biblioteca-inicial.js), para a galeria não prometer telas diferentes
// das que o visitante encontra ao abrir o aplicativo.
const TelaCadernos = () => (
  <>
    <div className="mock-topo"><span>Álbuns</span></div>
    <ul className="mock-lista">
      <li><span className="mock-chip">Programação</span><small>3 anotações</small></li>
      <li><span className="mock-chip">Matemática</span><small>3 anotações</small></li>
      <li><span className="mock-chip">Biologia</span><small>3 anotações</small></li>
      <li><span className="mock-chip">História</span><small>2 anotações</small></li>
    </ul>
  </>
)

const TelaResumo = () => (
  <>
    <div className="mock-topo"><span>Resumo automático</span></div>
    <div className="mock-linhas">
      <span className="mock-linha longa" />
      <span className="mock-linha" />
      <span className="mock-linha curta" />
      <span className="mock-linha" />
      <span className="mock-linha curta" />
    </div>
  </>
)

const telas = {
  scan: TelaScan,
  cadernos: TelaCadernos,
  resumo: TelaResumo,
}

const GaleriaItem = ({ item }) => {
  const Tela = telas[item.tipo]

  return (
    <article className="galeria-item">
      <PhoneMockup>
        <Tela />
      </PhoneMockup>
      <h3>{item.titulo}</h3>
      <p>{item.descricao}</p>
    </article>
  )
}

export default GaleriaItem
