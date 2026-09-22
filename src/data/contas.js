/* ============================================================================
 * Contas de demonstração do protótipo
 * ----------------------------------------------------------------------------
 * O projeto não tem servidor próprio: a autenticação existe para separar as
 * rotas públicas (landing page) da rota privada (o aplicativo) e é resolvida
 * inteiramente no navegador, contra esta lista. Por isso a senha fica visível
 * no código — ela não protege dado nenhum, apenas identifica quem entrou, e as
 * credenciais de teste estão documentadas no README.
 * ==========================================================================*/

export const CONTAS = [
  { email: 'professor@fiap.com.br', senha: 'fiap2026', nome: 'Professor' },
  { email: 'ian@studycam.ai', senha: 'studycam', nome: 'Ian' },
  { email: 'joao@studycam.ai', senha: 'studycam', nome: 'João' },
  { email: 'hyan@studycam.ai', senha: 'studycam', nome: 'Hyan' },
  { email: 'elizeu@studycam.ai', senha: 'studycam', nome: 'Elizeu' },
]

/** Conta sugerida na tela de entrada, para o professor testar sem procurar. */
export const CONTA_DEMONSTRACAO = CONTAS[0]

/**
 * Procura a conta correspondente ao e-mail e à senha informados.
 * @returns {{email:string, nome:string}|null} conta sem a senha, ou null
 */
export const autenticar = (email, senha) => {
  const procurado = (email || '').trim().toLowerCase()
  const conta = CONTAS.find(
    (item) => item.email === procurado && item.senha === senha,
  )

  return conta ? { email: conta.email, nome: conta.nome } : null
}

export default CONTAS
