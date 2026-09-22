import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { CONTA_DEMONSTRACAO } from '../data/contas'
import useAutenticacao from '../hooks/useAutenticacao'

/**
 * Tela de entrada (rota pública `/entrar`). É a porta da rota privada `/app`:
 * quem chega sem sessão é mandado para cá pelo RotaPrivada, entra, e volta
 * exatamente para a tela que tentou abrir (guardada em `state.de`).
 *
 * Esta tela é estilizada só com Tailwind — não depende de nenhum arquivo de
 * css/, porque não faz parte nem da landing page nem da moldura do aparelho.
 */
const PaginaEntrar = () => {
  const { autenticado, entrar } = useAutenticacao()
  const navegar = useNavigate()
  const localizacao = useLocation()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  /** Rota que o visitante tentou abrir antes de ser barrado. */
  const destino = localizacao.state?.de || '/app'

  // Quem já entrou não vê a tela de novo (inclusive ao apertar "voltar").
  if (autenticado) return <Navigate to={destino} replace />

  const enviar = (evento) => {
    evento.preventDefault()
    const resultado = entrar(email, senha)

    if (!resultado.ok) {
      setErro(resultado.mensagem)
      return
    }

    navegar(destino, { replace: true })
  }

  /** Preenche a conta de teste, para o professor não precisar digitar. */
  const usarDemonstracao = () => {
    setEmail(CONTA_DEMONSTRACAO.email)
    setSenha(CONTA_DEMONSTRACAO.senha)
    setErro('')
  }

  const campo =
    'w-full rounded-2xl border border-white/10 bg-superficie-2 px-4 py-3 text-base text-texto ' +
    'outline-none transition placeholder:text-texto-fraco focus:border-roxo ' +
    'focus:ring-2 focus:ring-roxo/40'

  return (
    <div className="grid min-h-dvh place-items-center bg-preto px-4 py-10">
      {/* Brilho roxo do fundo, igual ao da abertura do aplicativo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(124,77,255,0.35),transparent)]"
      />

      <main className="relative w-full max-w-sm">
        <header className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-16 place-items-center rounded-[22px] bg-gradient-to-br from-roxo to-roxo-escuro text-3xl shadow-lg shadow-roxo/30">
            🎓
          </span>
          <h1 className="text-2xl font-semibold text-texto">StudyCam AI</h1>
          <p className="mt-1 text-sm text-texto-medio">
            Entre para abrir o protótipo da câmera JOVI.
          </p>
        </header>

        <form onSubmit={enviar} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-texto-medio">E-mail</span>
            <input
              type="email"
              className={campo}
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="voce@exemplo.com"
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-texto-medio">Senha</span>
            <input
              type="password"
              className={campo}
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {erro && (
            <p role="alert" className="rounded-2xl bg-vermelho/15 px-4 py-3 text-sm text-vermelho">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-2xl bg-gradient-to-r from-roxo to-roxo-escuro px-4 py-3.5 text-base font-semibold text-white transition hover:brightness-110 active:scale-[0.99]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 rounded-[22px] border border-white/10 bg-superficie px-4 py-4">
          <p className="text-sm font-medium text-texto">Conta de demonstração</p>
          <p className="mt-1 text-sm text-texto-fraco">
            {CONTA_DEMONSTRACAO.email} · {CONTA_DEMONSTRACAO.senha}
          </p>
          <button
            type="button"
            onClick={usarDemonstracao}
            className="mt-3 w-full rounded-xl border border-roxo/60 px-4 py-2.5 text-sm font-medium text-roxo-claro transition hover:bg-roxo/10"
          >
            Preencher automaticamente
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-texto-fraco">
          <Link to="/" className="underline-offset-4 transition hover:text-texto hover:underline">
            &larr; Voltar para o site
          </Link>
        </p>
      </main>
    </div>
  )
}

export default PaginaEntrar
