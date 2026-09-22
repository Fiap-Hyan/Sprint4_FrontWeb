import { useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { href: '#solucao', label: 'A Solução' },
  { href: '#publico', label: 'Público-Alvo' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#equipe', label: 'Nossa Equipe' },
  { href: '#contato', label: 'Contato' },
]

const Header = ({ temaEscuro, alternarTema }) => {
  const [menuAberto, setMenuAberto] = useState(false)

  const fecharMenu = () => setMenuAberto(false)

  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <a href="#topo" className="logo" onClick={fecharMenu}>
          StudyCam <span>AI</span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((anterior) => !anterior)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navegacao ${menuAberto ? 'aberta' : ''}`} aria-label="Navegação principal">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={fecharMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Leva para o protótipo navegável do aplicativo (rota /app) */}
          <Link to="/app" className="btn btn-primario btn-app" onClick={fecharMenu}>
            Abrir protótipo
          </Link>
          <button type="button" className="btn-tema" onClick={alternarTema}>
            {temaEscuro ? '☀️ Modo claro' : '🌙 Modo escuro'}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
