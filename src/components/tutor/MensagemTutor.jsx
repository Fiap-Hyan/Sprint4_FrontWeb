import { IconeAltoFalante, IconeCompartilhar, IconeCopiar, IconeParar } from '../ui/Icones'

/** Botãozinho de ação que aparece embaixo da resposta do tutor. */
const Acao = ({ rotulo, aoClicar, children }) => (
  <button
    type="button"
    onClick={aoClicar}
    aria-label={rotulo}
    title={rotulo}
    className="grid size-8 place-items-center rounded-full text-texto-fraco transition hover:bg-white/8 hover:text-texto"
  >
    {children}
  </button>
)

/**
 * Uma mensagem do chat. A pergunta do estudante fica à direita, em roxo; a
 * resposta do tutor fica à esquerda, com os três botões de copiar,
 * compartilhar e ouvir em voz alta.
 */
const MensagemTutor = ({ mensagem, lendo, podeOuvir, aoCopiar, aoCompartilhar, aoLer }) => {
  const daPessoa = mensagem.autor === 'usuario'

  if (daPessoa) {
    return (
      <li className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-[20px] rounded-br-md bg-roxo px-4 py-3 text-sm leading-relaxed text-white">
          {mensagem.texto}
        </p>
      </li>
    )
  }

  return (
    <li className="flex flex-col items-start gap-1">
      <p className="max-w-[92%] whitespace-pre-wrap rounded-[20px] rounded-bl-md bg-cartao px-4 py-3 text-sm leading-relaxed text-texto">
        {mensagem.texto}
      </p>

      <div className="flex items-center gap-0.5 ps-1">
        <Acao rotulo="Copiar a resposta" aoClicar={aoCopiar}>
          <IconeCopiar tamanho={17} />
        </Acao>
        <Acao rotulo="Compartilhar a resposta" aoClicar={aoCompartilhar}>
          <IconeCompartilhar tamanho={17} />
        </Acao>
        {podeOuvir && (
          <Acao rotulo={lendo ? 'Parar a leitura' : 'Ouvir a resposta'} aoClicar={aoLer}>
            {lendo ? <IconeParar tamanho={15} /> : <IconeAltoFalante tamanho={17} />}
          </Acao>
        )}
      </div>
    </li>
  )
}

export default MensagemTutor
