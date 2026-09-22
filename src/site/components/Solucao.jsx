const passos = [
  {
    numero: '01',
    titulo: 'Abra o Modo Estudo',
    texto: 'Direto na câmera nativa do JOVI, sem precisar instalar nada.',
  },
  {
    numero: '02',
    titulo: 'Fotografe o conteúdo',
    texto: 'Quadro, slide, página de livro ou caderno — a câmera reconhece sozinha.',
  },
  {
    numero: '03',
    titulo: 'Revise no seu tempo',
    texto: 'StudyCam organiza por matéria, resume a captura e monta um quiz para você testar o que aprendeu.',
  },
]

const Solucao = () => (
  <section id="solucao" className="secao secao-solucao" aria-label="A Solução">
    <div className="secao-cabecalho">
      <p className="etiqueta">A Solução</p>
      <h2>Da câmera automática ao assistente de estudos</h2>
      <p>
        Hoje, a maioria dos estudantes usa a câmera do smartphone apenas no modo
        automático — fotos de quadro ficam tortas, mal iluminadas e perdidas no
        meio de prints e fotos pessoais. O StudyCam AI transforma a câmera JOVI
        em um modo dedicado a quem estuda em movimento.
      </p>
    </div>

    <ol className="passos-grid">
      {passos.map((passo) => (
        <li key={passo.numero} className="passo-card">
          <span className="passo-numero">{passo.numero}</span>
          <h3>{passo.titulo}</h3>
          <p>{passo.texto}</p>
        </li>
      ))}
    </ol>
  </section>
)

export default Solucao
