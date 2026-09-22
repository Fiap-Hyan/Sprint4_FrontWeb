import { useCallback } from 'react'

import { autenticar } from '../data/contas'
import useLocalStorage from './useLocalStorage'

/**
 * Hook customizado com a sessão do usuário: é o que separa a rota pública
 * (landing page) da rota privada (o protótipo do aplicativo).
 *
 * A sessão fica no localStorage, então continua valendo quando a aba é
 * fechada e reaberta. Como não há servidor, a verificação é feita contra a
 * lista de `data/contas.js` — ver o comentário daquele arquivo.
 */
const useAutenticacao = () => {
  const [sessao, setSessao] = useLocalStorage('studycam:sessao', null)

  /**
   * Tenta iniciar a sessão.
   * @returns {{ok:boolean, mensagem?:string}} resultado para a tela exibir
   */
  const entrar = useCallback(
    (email, senha) => {
      if (!email.trim() || !senha) {
        return { ok: false, mensagem: 'Informe o e-mail e a senha.' }
      }

      const conta = autenticar(email, senha)
      if (!conta) return { ok: false, mensagem: 'E-mail ou senha incorretos.' }

      setSessao({ ...conta, entrouEm: new Date().toISOString() })
      return { ok: true }
    },
    [setSessao],
  )

  const sair = useCallback(() => setSessao(null), [setSessao])

  return { sessao, autenticado: Boolean(sessao), entrar, sair }
}

export default useAutenticacao
