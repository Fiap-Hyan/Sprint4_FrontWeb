import { Navigate, useLocation } from 'react-router-dom'

import useAutenticacao from '../../hooks/useAutenticacao'

/**
 * Porteiro das rotas privadas: deixa passar quem tem sessão e manda os demais
 * para a tela de entrada, guardando em `state.de` a rota que a pessoa tentou
 * abrir — assim, depois de entrar, ela cai exatamente onde queria.
 *
 * `replace` evita que a rota bloqueada fique no histórico do navegador (senão
 * o botão "voltar" traria o visitante de volta para a porta fechada).
 */
const RotaPrivada = ({ children }) => {
  const { autenticado } = useAutenticacao()
  const localizacao = useLocation()

  if (!autenticado) {
    return <Navigate to="/entrar" state={{ de: localizacao.pathname }} replace />
  }

  return children
}

export default RotaPrivada
