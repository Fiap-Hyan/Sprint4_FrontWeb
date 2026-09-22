const dores = [
  'Fotos de quadro tortas, borradas ou de difícil leitura na hora de revisar.',
  'Rolo de câmera cheio de prints e memes misturados com conteúdo de aula.',
  'Nenhum lugar único para reunir o material de cada matéria.',
  'Esquece de revisar o que fotografou antes da prova chegar.',
]

const PublicoAlvo = () => (
  <section id="publico" className="secao secao-publico" aria-label="Público-Alvo">
    <div className="publico-grid">
      <div>
        <p className="etiqueta">Público-Alvo</p>
        <h2>Estudantes Full-time</h2>
        <p>
          Eles conciliam estudos, interações sociais e ambição. Estão sempre em
          movimento, buscando progresso e estabilidade — e o smartphone é o que
          os mantém conectados, produtivos e inspirados. A câmera precisa
          acompanhar esse ritmo, virando aliada nos estudos, não só registro do
          dia a dia.
        </p>
      </div>

      <ul className="dores-lista">
        {dores.map((dor) => (
          <li key={dor}>{dor}</li>
        ))}
      </ul>
    </div>
  </section>
)

export default PublicoAlvo
