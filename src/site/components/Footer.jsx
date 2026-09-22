import { Link } from 'react-router-dom'

const Footer = () => {
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="rodape">
      <div className="rodape-grid">
        <div>
          <p className="logo">
            StudyCam <span>AI</span>
          </p>
          <p>Próxima geração da experiência de câmera JOVI para estudantes full-time.</p>
        </div>

        <nav aria-label="Links do rodapé">
          <h3>Navegação</h3>
          <ul>
            <li><a href="#solucao">A Solução</a></li>
            <li><a href="#publico">Público-Alvo</a></li>
            <li><a href="#galeria">Galeria</a></li>
            <li><a href="#equipe">Nossa Equipe</a></li>
            <li><a href="#contato">Contato</a></li>
            <li><Link to="/app">Protótipo do app</Link></li>
          </ul>
        </nav>

        <address>
          <h3>Contato</h3>
          <p>contato@studycam.ai</p>
          <p>Eng. Software Challenge 2026 · FIAP × JOVI</p>
        </address>
      </div>

      <p className="rodape-copy">
        © {anoAtual} StudyCam AI — Projeto acadêmico desenvolvido para o JOVI Eng. Software Challenge (FIAP).
      </p>
    </footer>
  )
}

export default Footer
