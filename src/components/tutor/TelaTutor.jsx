import { useEffect, useRef, useState } from 'react'

import MensagemTutor from './MensagemTutor'
import SeletorResumo from './SeletorResumo'
import {
  IconeChat,
  IconeEnviar,
  IconeFechar,
  IconeLixeira,
  IconeMais,
  IconeMenuVertical,
  IconeMicrofone,
  IconeVoltar,
} from '../ui/Icones'
import { compartilharTexto, copiarTexto } from '../../utils/compartilhar'
import { dataRelativa } from '../../utils/formato'
import { falar, parar } from '../../services/textToSpeech'
import useDitado from '../../hooks/useDitado'

/** Botão circular do compositor (microfone, enviar e anexar). */
const BotaoRedondo = ({ rotulo, aoClicar, destaque = false, ativo = false, dica, children }) => (
  <button
    type="button"
    onClick={aoClicar}
    aria-label={rotulo}
    title={rotulo}
    data-dica={dica}
    className={`grid size-12 shrink-0 place-items-center rounded-full transition ${
      ativo
        ? 'bg-vermelho text-white'
        : destaque
          ? 'bg-roxo text-white hover:brightness-110'
          : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
    }`}
  >
    {children}
  </button>
)

/**
 * Aba do tutor: um chat que já conhece os resumos do estudante. A conversa
 * fica salva no aparelho (hook useTutor) e o resumo anexado entra no contexto
 * mandado ao Gemini, para dar para perguntar sem reapresentar a matéria.
 */
const TelaTutor = ({ tutor, biblioteca, ajustes, aoAvisar }) => {
  const [rascunho, setRascunho] = useState('')
  const [anexando, setAnexando] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [listando, setListando] = useState(false)
  const [lendoId, setLendoId] = useState(null)
  const rolagem = useRef(null)

  const ditado = useDitado((trecho) =>
    setRascunho((atual) => `${atual}${atual && !atual.endsWith(' ') ? ' ' : ''}${trecho}`.trimStart()),
  )

  /* A leitura em voz alta não continua depois que a aba é fechada. */
  useEffect(() => () => parar(), [])

  /* Cada mensagem nova rola o chat até o fim, como em qualquer conversa. */
  useEffect(() => {
    const area = rolagem.current
    if (area) area.scrollTop = area.scrollHeight
  }, [tutor.mensagens, tutor.pensando])

  const enviar = (evento) => {
    evento.preventDefault()
    const texto = rascunho.trim()
    if (!texto) return

    setRascunho('')
    tutor.enviar(texto)
  }

  const ler = async (mensagem) => {
    if (lendoId === mensagem.id) {
      parar()
      setLendoId(null)
      return
    }

    setLendoId(mensagem.id)
    const resposta = await falar(mensagem.texto, {
      idioma: ajustes.idioma,
      voz: ajustes.voz,
      velocidade: ajustes.velocidadeVoz,
      aoTerminar: () => setLendoId(null),
    })

    if (!resposta.ok) {
      setLendoId(null)
      aoAvisar(resposta.mensagem)
    }
  }

  const anexar = (notaId) => {
    tutor.anexarResumo(notaId)
    setAnexando(false)
    aoAvisar('Resumo anexado à conversa')
  }

  // ------------------------------------------------------- conversas salvas
  if (listando) {
    return (
      <section className="tela">
        <header className="flex items-center gap-2 px-4 pb-2 pt-4">
          <button
            type="button"
            onClick={() => setListando(false)}
            aria-label="Voltar para a conversa"
            className="grid size-10 place-items-center rounded-full text-texto transition hover:bg-white/8"
          >
            <IconeVoltar tamanho={24} />
          </button>
          <h1 className="text-xl font-semibold text-texto">Conversas anteriores</h1>
        </header>

        <ul className="flex-1 overflow-y-auto px-4 pb-4">
          {tutor.conversas.map((conversa) => (
            <li key={conversa.id} className="mb-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  tutor.abrirConversa(conversa.id)
                  setListando(false)
                }}
                className="min-w-0 flex-1 rounded-2xl border border-white/10 px-4 py-3 text-start transition hover:bg-white/5"
              >
                <span className="block truncate text-[0.95rem] text-texto">{conversa.titulo}</span>
                <span className="block text-sm text-texto-fraco">
                  {conversa.mensagens.length} mensagens · {dataRelativa(conversa.atualizadaEm)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => tutor.excluirConversa(conversa.id)}
                aria-label={`Excluir a conversa ${conversa.titulo}`}
                className="grid size-10 shrink-0 place-items-center rounded-full text-texto-fraco transition hover:bg-vermelho/15 hover:text-vermelho"
              >
                <IconeLixeira tamanho={20} />
              </button>
            </li>
          ))}

          {!tutor.conversas.length && (
            <li className="py-10 text-center text-sm text-texto-fraco">
              Nenhuma conversa salva ainda.
            </li>
          )}
        </ul>
      </section>
    )
  }

  // ------------------------------------------------------------------- chat
  return (
    <section className="tela">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-[1.7rem] font-semibold text-texto">Tutor</h1>
        <button
          type="button"
          data-dica="tutor-menu"
          onClick={() => setMenuAberto((atual) => !atual)}
          aria-label="Opções do tutor"
          className="grid size-10 place-items-center rounded-full text-texto transition hover:bg-white/8"
        >
          <IconeMenuVertical tamanho={22} />
        </button>
      </header>

      {menuAberto && (
        <>
          <button
            type="button"
            className="absolute inset-0 z-30 cursor-default"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar o menu"
          />
          <div className="absolute end-4 top-14 z-40 w-56 overflow-hidden rounded-[18px] border border-white/10 bg-cartao-2 py-1.5">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-start text-[0.95rem] text-texto transition hover:bg-white/8"
              onClick={() => {
                tutor.novaConversa()
                setMenuAberto(false)
              }}
            >
              <IconeMais tamanho={20} /> Nova conversa
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-start text-[0.95rem] text-texto transition hover:bg-white/8"
              onClick={() => {
                setListando(true)
                setMenuAberto(false)
              }}
            >
              <IconeChat tamanho={20} /> Conversas anteriores
            </button>
          </div>
        </>
      )}

      <div ref={rolagem} className="flex-1 overflow-y-auto px-4">
        {!tutor.mensagens.length ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <span className="mb-4 text-roxo">
              <IconeChat tamanho={54} />
            </span>
            <h2 className="text-lg font-semibold text-texto">Pergunte sobre o que você estudou</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-texto-medio">
              Ele conhece os seus resumos. Peça para explicar de outro jeito, dar um exemplo ou
              tirar uma dúvida da matéria.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4 py-3">
            {tutor.mensagens.map((mensagem) => (
              <MensagemTutor
                key={mensagem.id}
                mensagem={mensagem}
                lendo={lendoId === mensagem.id}
                podeOuvir={ajustes.leituraEmVozAlta}
                aoCopiar={async () => aoAvisar(await copiarTexto(mensagem.texto))}
                aoCompartilhar={async () => {
                  const aviso = await compartilharTexto('Resposta do tutor', mensagem.texto)
                  if (aviso) aoAvisar(aviso)
                }}
                aoLer={() => ler(mensagem)}
              />
            ))}

            {tutor.pensando && (
              <li className="flex items-center gap-2 ps-1 text-sm text-texto-fraco">
                <span className="size-2 animate-bounce rounded-full bg-roxo [animation-delay:-0.2s]" />
                <span className="size-2 animate-bounce rounded-full bg-roxo [animation-delay:-0.1s]" />
                <span className="size-2 animate-bounce rounded-full bg-roxo" />
                <span className="ms-1">O tutor está pensando…</span>
              </li>
            )}
          </ul>
        )}
      </div>

      {tutor.erro && (
        <p role="alert" className="mx-4 mb-2 rounded-2xl bg-vermelho/15 px-4 py-3 text-sm text-vermelho">
          {tutor.erro}
        </p>
      )}

      <form onSubmit={enviar} className="flex flex-col gap-3 px-4 pb-4 pt-2">
        <div className="flex items-center gap-2">
          <BotaoRedondo rotulo="Anexar um resumo" dica="tutor-anexo" aoClicar={() => setAnexando(true)}>
            <IconeMais tamanho={24} />
          </BotaoRedondo>

          {tutor.resumoAnexado && (
            <span className="flex min-w-0 items-center gap-2 rounded-full border border-roxo/50 bg-roxo/12 py-1.5 pe-1.5 ps-3.5 text-sm text-roxo-claro">
              <span className="truncate">{tutor.resumoAnexado.titulo}</span>
              <button
                type="button"
                onClick={tutor.removerAnexo}
                aria-label="Remover o resumo anexado"
                className="grid size-6 shrink-0 place-items-center rounded-full transition hover:bg-roxo/25"
              >
                <IconeFechar tamanho={14} />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {ditado.disponivel && (
            <BotaoRedondo
              rotulo={ditado.gravando ? 'Parar o microfone' : 'Falar em vez de digitar'}
              dica="tutor-microfone"
              ativo={ditado.gravando}
              aoClicar={ditado.alternar}
            >
              <IconeMicrofone tamanho={22} />
            </BotaoRedondo>
          )}

          <input
            data-dica="tutor-caixa"
            value={ditado.gravando && ditado.parcial ? `${rascunho} ${ditado.parcial}`.trim() : rascunho}
            onChange={(evento) => setRascunho(evento.target.value)}
            placeholder={ditado.gravando ? 'Ouvindo…' : 'Escreva ou toque no microfone'}
            aria-label="Pergunta para o tutor"
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-superficie-2 px-5 py-3.5 text-[0.95rem] text-texto outline-none transition placeholder:text-texto-fraco focus:border-roxo"
          />

          <button
            type="submit"
            data-dica="tutor-enviar"
            aria-label="Enviar a pergunta"
            disabled={tutor.pensando || !rascunho.trim()}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-roxo text-white transition hover:brightness-110 disabled:opacity-40"
          >
            <IconeEnviar tamanho={22} />
          </button>
        </div>

        {ditado.erro && <p className="text-sm text-vermelho">{ditado.erro}</p>}
      </form>

      {anexando && (
        <SeletorResumo
          biblioteca={biblioteca}
          aoEscolher={anexar}
          aoFechar={() => setAnexando(false)}
        />
      )}
    </section>
  )
}

export default TelaTutor
