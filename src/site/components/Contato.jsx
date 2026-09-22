import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'

const valoresIniciais = { nome: '', email: '', mensagem: '' }

const Contato = () => {
  const [formulario, setFormulario] = useState(valoresIniciais)
  // As mensagens enviadas ficam salvas no localStorage do navegador
  const [mensagens, setMensagens] = useLocalStorage('studycam_mensagens', [])
  const [enviado, setEnviado] = useState(false)

  // Atualiza no estado apenas o campo que está sendo digitado
  const aoDigitar = (evento) => {
    const { name, value } = evento.target
    setFormulario((anterior) => ({ ...anterior, [name]: value }))
  }

  const aoEnviar = (evento) => {
    evento.preventDefault()

    const novaMensagem = { ...formulario, enviadaEm: new Date().toISOString() }
    setMensagens((anterior) => [...anterior, novaMensagem])
    setFormulario(valoresIniciais)
    setEnviado(true)

    // Esconde o aviso de confirmação depois de alguns segundos
    setTimeout(() => setEnviado(false), 4000)
  }

  return (
    <section id="contato" className="secao secao-contato" aria-label="Contato">
      <div className="contato-grid">
        <div>
          <p className="etiqueta">Contato</p>
          <h2>Vamos conversar sobre o StudyCam AI</h2>
          <p>Dúvidas, sugestões ou feedback sobre a solução? Fale com a equipe.</p>
          <address>
            <p>contato@studycam.ai</p>
            <p>Eng. Software Challenge 2026 · FIAP × JOVI</p>
          </address>
        </div>

        <form className="form-contato" onSubmit={aoEnviar}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Como podemos te chamar?"
            required
            value={formulario.nome}
            onChange={aoDigitar}
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="voce@email.com"
            required
            value={formulario.email}
            onChange={aoDigitar}
          />

          <label htmlFor="mensagem">Mensagem</label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows="4"
            placeholder="Conte o que achou da solução..."
            required
            value={formulario.mensagem}
            onChange={aoDigitar}
          />

          <button type="submit" className="btn btn-primario">Enviar mensagem</button>

          {enviado && (
            <p className="confirmacao" role="status">
              Mensagem salva! Em breve a equipe retorna o contato. ({mensagens.length} mensagens recebidas)
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contato
