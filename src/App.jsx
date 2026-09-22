import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import PaginaAplicativo from './paginas/PaginaAplicativo'
import PaginaEntrar from './paginas/PaginaEntrar'
import PaginaSite from './paginas/PaginaSite'
import RotaPrivada from './components/rotas/RotaPrivada'
import { paginaDaRota } from './utils/rotas'

/** Título da aba de cada conjunto de estilos (ver utils/rotas.js). */
const PAGINAS = {
  site: { titulo: 'StudyCam AI · JOVI Eng. Software Challenge' },
  entrar: { titulo: 'Entrar | StudyCam AI' },
  app: { titulo: 'StudyCam AI | Câmera JOVI' },
}

/**
 * Raiz do projeto. As rotas públicas (`/` e `/entrar`) ficam abertas a
 * qualquer visitante; a rota do protótipo (`/app`) é privada e passa pelo
 * RotaPrivada, que exige sessão iniciada.
 */
const App = () => {
  const { pathname } = useLocation()
  const pagina = paginaDaRota(pathname)

  useEffect(() => {
    document.documentElement.setAttribute('data-pagina', pagina)
    document.title = PAGINAS[pagina].titulo

    if (pagina !== 'site') window.scrollTo(0, 0)
  }, [pagina])

  return (
    <Routes>
      <Route path="/" element={<PaginaSite />} />
      <Route path="/entrar" element={<PaginaEntrar />} />
      <Route
        path="/app"
        element={
          <RotaPrivada>
            <PaginaAplicativo />
          </RotaPrivada>
        }
      />
      {/* Qualquer endereço desconhecido volta para a landing page. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
