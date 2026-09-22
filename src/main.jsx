import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { prepararAjustesSalvos } from './utils/ajustes-salvos'
import { paginaDaRota } from './utils/rotas'
import './index.css'

// Marca a página antes da primeira renderização para que o CSS correto já
// esteja valendo na primeira pintura (evita o "pisca" de estilo trocado).
document.documentElement.setAttribute('data-pagina', paginaDaRota())

// Completa os ajustes salvos com as opções criadas depois e liga a câmera
// real de quem já usou o protótipo antes de ela virar padrão.
prepararAjustesSalvos()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
