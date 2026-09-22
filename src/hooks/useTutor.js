import { useCallback, useMemo, useState } from 'react'

import { responderTutor } from '../services/api'
import { gerarId } from '../utils/aleatorio'
import useLocalStorage from './useLocalStorage'

/** Quantas mensagens do histórico são reenviadas ao modelo a cada pergunta. */
const JANELA_DE_CONTEXTO = 12

/** Título da conversa: as primeiras palavras da primeira pergunta. */
const tituloDaConversa = (texto) => {
  const limpo = (texto || '').trim().replace(/\s+/g, ' ')
  if (!limpo) return 'Nova conversa'
  return limpo.length > 38 ? `${limpo.slice(0, 38)}…` : limpo
}

/**
 * Hook customizado do tutor: guarda as conversas no localStorage e fala com o
 * Gemini. A parte visual (TelaTutor) só recebe a conversa pronta e as funções.
 *
 * Cada conversa pode ter um resumo anexado (`notaId`): quando existe, o
 * conteúdo daquela anotação vai junto na instrução do modelo, e é por isso que
 * dá para perguntar "explica de outro jeito" sem reapresentar a matéria.
 */
const useTutor = (biblioteca, ajustes) => {
  const [conversas, setConversas] = useLocalStorage('studycam:tutor', [])
  const [conversaId, setConversaId] = useState(null)
  const [pensando, setPensando] = useState(false)
  const [erro, setErro] = useState(null)
  // Resumo escolhido antes de a conversa existir (tela vazia do tutor).
  const [pendente, setPendente] = useState(null)

  const conversa = useMemo(
    () => conversas.find((item) => item.id === conversaId) || null,
    [conversaId, conversas],
  )

  const mensagens = conversa?.mensagens || []

  /** Anotação anexada à conversa aberta (ou null). */
  const resumoAnexado = useMemo(() => {
    if (!conversa?.notaId) return null
    return biblioteca.notas.find((nota) => nota.id === conversa.notaId) || null
  }, [biblioteca.notas, conversa])

  /** Conversas mais recentes primeiro, para a lista de "Conversas anteriores". */
  const conversasRecentes = useMemo(
    () => [...conversas].sort((a, b) => new Date(b.atualizadaEm) - new Date(a.atualizadaEm)),
    [conversas],
  )

  const novaConversa = useCallback(() => {
    setConversaId(null)
    setPendente(null)
    setErro(null)
  }, [])

  /**
   * Abre uma conversa nova ja com um resumo anexado. É o que o botão "Falar
   * com o tutor" da tela da anotação faz: leva o assunto junto, para não
   * precisar reapresentar a matéria.
   */
  const conversarSobre = useCallback((notaId) => {
    setConversaId(null)
    setPendente(notaId)
    setErro(null)
  }, [])

  const abrirConversa = useCallback((id) => {
    setConversaId(id)
    setErro(null)
  }, [])

  const excluirConversa = useCallback(
    (id) => {
      setConversas((atual) => atual.filter((item) => item.id !== id))
      setConversaId((atual) => (atual === id ? null : atual))
    },
    [setConversas],
  )

  /**
   * Anexa (ou troca) o resumo da conversa aberta. Sem conversa aberta, o
   * anexo fica guardado para a próxima — por isso o id é devolvido.
   */
  const anexarResumo = useCallback(
    (notaId) => {
      if (!conversaId) {
        setPendente(notaId)
        return
      }

      setConversas((atual) =>
        atual.map((item) => (item.id === conversaId ? { ...item, notaId } : item)),
      )
    },
    [conversaId, setConversas],
  )

  const notaPendente = useMemo(() => {
    if (!pendente) return null
    return biblioteca.notas.find((nota) => nota.id === pendente) || null
  }, [biblioteca.notas, pendente])

  const removerAnexo = useCallback(() => {
    setPendente(null)
    if (conversaId) {
      setConversas((atual) =>
        atual.map((item) => (item.id === conversaId ? { ...item, notaId: null } : item)),
      )
    }
  }, [conversaId, setConversas])

  /**
   * Manda a pergunta ao tutor e guarda a resposta na conversa. Cria a conversa
   * na primeira pergunta, já com o resumo que estava anexado na tela.
   */
  const enviar = useCallback(
    async (texto) => {
      const pergunta = (texto || '').trim()
      if (!pergunta || pensando) return

      setErro(null)
      setPensando(true)

      const agora = new Date().toISOString()
      const daPessoa = { id: gerarId('msg'), autor: 'usuario', texto: pergunta, data: agora }

      // A conversa pode ainda não existir: neste caso ela nasce agora.
      const alvo = conversa || {
        id: gerarId('conv'),
        titulo: tituloDaConversa(pergunta),
        notaId: pendente,
        criadaEm: agora,
        atualizadaEm: agora,
        mensagens: [],
      }

      const historico = [...alvo.mensagens, daPessoa]

      if (conversa) {
        setConversas((atual) =>
          atual.map((item) =>
            item.id === alvo.id ? { ...item, mensagens: historico, atualizadaEm: agora } : item,
          ),
        )
      } else {
        setConversas((atual) => [{ ...alvo, mensagens: historico }, ...atual])
        setConversaId(alvo.id)
        setPendente(null)
      }

      const anexo = alvo.notaId
        ? biblioteca.notas.find((nota) => nota.id === alvo.notaId) || null
        : null

      const resposta = await responderTutor(historico.slice(-JANELA_DE_CONTEXTO), anexo, ajustes)
      setPensando(false)

      if (!resposta.ok) {
        setErro(resposta.mensagem)
        return
      }

      const doTutor = {
        id: gerarId('msg'),
        autor: 'tutor',
        texto: resposta.texto,
        data: new Date().toISOString(),
      }

      setConversas((atual) =>
        atual.map((item) =>
          item.id === alvo.id
            ? {
                ...item,
                mensagens: [...item.mensagens, doTutor],
                atualizadaEm: doTutor.data,
              }
            : item,
        ),
      )
    },
    [ajustes, biblioteca.notas, conversa, pendente, pensando, setConversas],
  )

  return {
    conversa,
    conversas: conversasRecentes,
    mensagens,
    // Vale o anexo da conversa aberta; sem conversa, o escolhido na tela vazia.
    resumoAnexado: resumoAnexado || notaPendente,
    pensando,
    erro,
    novaConversa,
    conversarSobre,
    abrirConversa,
    excluirConversa,
    anexarResumo,
    removerAnexo,
    enviar,
  }
}

export default useTutor
