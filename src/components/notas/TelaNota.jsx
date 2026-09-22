import { useCallback, useEffect, useRef, useState } from 'react'

import BotaoIcone from '../ui/BotaoIcone'
import MiniaturaNota from '../ui/MiniaturaNota'
import { baixarNota, textoParaCompartilhar } from '../../utils/exportar'
import { compartilharTexto } from '../../utils/compartilhar'
import { gerarQuiz, gerarResumo, reconhecerTexto } from '../../services/api'
import { falar, parar } from '../../services/textToSpeech'
import {
  IconeAltoFalante,
  IconeAtualizar,
  IconeBaixar,
  IconeBusca,
  IconeChat,
  IconeCompartilhar,
  IconeIA,
  IconeLixeira,
  IconeParar,
  IconePlay,
  IconeSetaDireita,
  IconeVoltar,
} from '../ui/Icones'

/** Cartão da análise: rótulo em maiúsculas, ação opcional e conteúdo. */
const Cartao = ({ rotulo, comIcone = false, acao, children }) => (
  <section className="cartao-analise">
    <header className="cartao-analise__topo">
      <h2 className="cartao-analise__rotulo">
        {comIcone && <IconeIA tamanho={15} />}
        {rotulo}
      </h2>
      {acao && (
        <button
          type="button"
          data-dica={acao.dica}
          className={`cartao-analise__acao ${acao.classe || ''}`}
          onClick={acao.aoClicar}
          disabled={acao.desabilitado}
          aria-label={acao.rotulo}
        >
          {acao.icone}
        </button>
      )}
    </header>
    {children}
  </section>
)

/** Atalho de estudo mostrado em "Conteúdos relacionados". */
const Atalho = ({ icone, variante = '', titulo, descricao, aoClicar }) => (
  <button type="button" className="atalho-relacionado" onClick={aoClicar}>
    <span className={`atalho-relacionado__icone ${variante}`}>{icone}</span>
    <span className="atalho-relacionado__texto">
      <span className="atalho-relacionado__titulo">{titulo}</span>
      <span className="atalho-relacionado__descricao">{descricao}</span>
    </span>
    <IconeSetaDireita tamanho={18} />
  </button>
)

/**
 * Mensagem e cor do resultado do quiz: verde quando acerta tudo, laranja
 * quando falta uma pergunta e vermelho daí para baixo.
 */
const resultadoDoQuiz = (acertos, total) => {
  if (acertos === total) {
    return {
      classe: 'is-perfeito',
      texto: `🎉 Parabéns! Você acertou as ${total} perguntas — resultado perfeito!`,
    }
  }

  if (acertos === total - 1) {
    return {
      classe: 'is-quase',
      texto: `👏 Quase lá! Você acertou ${acertos} de ${total} perguntas.`,
    }
  }

  if (acertos === 0) {
    return {
      classe: 'is-fraco',
      texto: `Você não acertou nenhuma das ${total} perguntas. Releia o resumo e tente de novo.`,
    }
  }

  return {
    classe: 'is-fraco',
    texto: `Você acertou ${acertos} de ${total} perguntas. Releia o resumo e tente de novo.`,
  }
}

/**
 * Tela de leitura da anotação: a foto da captura e a análise gerada pela IA
 * (assunto identificado, palavras-chave, resumo, quiz, pontos-chave e os
 * atalhos de conteúdo relacionado).
 */
const TelaNota = ({ biblioteca, notaId, ajustes, aoVoltar, aoAvisar, aoConversar }) => {
  const [respostas, setRespostas] = useState({})
  const [entregue, setEntregue] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [gerandoQuiz, setGerandoQuiz] = useState(false)
  const [lendo, setLendo] = useState(false)
  const [giro, setGiro] = useState(0)
  const [erro, setErro] = useState(null)
  const pedidoAutomatico = useRef(false)

  /* A leitura em voz alta não continua depois que a tela é fechada. */
  useEffect(() => () => parar(), [])

  const nota =
    biblioteca.notas.find((item) => item.id === notaId) ||
    biblioteca.notasNaLixeira.find((item) => item.id === notaId)

  const analisada = Boolean(nota?.resumo)

  /** Lê a foto (OCR) quando ainda não há texto e depois gera a análise. */
  const analisar = useCallback(async () => {
    if (!nota) return

    setErro(null)
    setProcessando(true)

    let base = nota
    if (nota.imagem && !nota.texto) {
      const ocr = await reconhecerTexto(nota.imagem)
      if (ocr.ok && ocr.texto) {
        base = { ...nota, texto: ocr.texto }
        biblioteca.atualizarNota(
          nota.id,
          { texto: ocr.texto, confiancaIA: ocr.confianca },
          'texto reconhecido pela IA',
        )
      }
    }

    const resposta = await gerarResumo(base, ajustes)
    setProcessando(false)

    if (!resposta.ok) {
      setErro({ onde: 'analise', mensagem: resposta.mensagem })
      return
    }

    setRespostas({})
    setEntregue(false)
    biblioteca.atualizarNota(
      nota.id,
      {
        titulo: resposta.titulo || nota.titulo,
        palavrasChave: resposta.palavrasChave,
        resumo: resposta.resumo,
        pontosChave: resposta.pontosChave,
        // O quiz é sempre gerado a pedido, sobre o conteúdo da análise atual.
        quiz: [],
      },
      'anotação analisada pela IA',
    )
    aoAvisar(analisada ? 'Análise refeita' : 'Análise concluída')
  }, [ajustes, analisada, aoAvisar, biblioteca, nota])

  /* Ajuste "Resumo automático": analisa a anotação assim que ela é aberta. */
  useEffect(() => {
    if (!ajustes?.resumoAutomatico || analisada || pedidoAutomatico.current) return
    pedidoAutomatico.current = true
    analisar()
  }, [ajustes, analisada, analisar])

  if (!nota) {
    return (
      <section className="tela tela--conteudo">
        <header className="cabecalho-analise">
          <BotaoIcone rotulo="Voltar" aoClicar={aoVoltar}>
            <IconeVoltar tamanho={26} />
          </BotaoIcone>
        </header>
        <p className="estado-vazio">Esta anotação não está mais disponível.</p>
      </section>
    )
  }

  const album = biblioteca.albuns.find((item) => item.id === nota.albumId)
  const quiz = nota.quiz || []
  const palavrasChave = nota.palavrasChave || []
  const pontosChave = nota.pontosChave || []
  const acertos = quiz.filter((pergunta, indice) => respostas[indice] === pergunta.correta).length
  const respondidas = quiz.filter((_, indice) => respostas[indice] !== undefined).length
  const completo = quiz.length > 0 && respondidas === quiz.length
  const resultado = resultadoDoQuiz(acertos, quiz.length)

  /* ---------------------------------------------------------------- ações */

  const compartilhar = async () => {
    const aviso = await compartilharTexto(nota.titulo, textoParaCompartilhar(nota, album))
    if (aviso) aoAvisar(aviso)
  }

  const baixar = () => aoAvisar(baixarNota(nota, album))

  /** O mesmo botão inicia a leitura do resumo e a interrompe. */
  const alternarLeitura = async () => {
    if (lendo) {
      parar()
      setLendo(false)
      return
    }

    setLendo(true)
    const resposta = await falar(nota.resumo, {
      idioma: ajustes.idioma,
      voz: ajustes.voz,
      velocidade: ajustes.velocidadeVoz,
      aoTerminar: () => setLendo(false),
    })
    if (!resposta.ok) setLendo(false)
    aoAvisar(resposta.mensagem)
  }

  const criarQuiz = async () => {
    setErro(null)
    setGerandoQuiz(true)
    const resposta = await gerarQuiz(nota, ajustes)
    setGerandoQuiz(false)

    if (!resposta.ok) {
      setErro({ onde: 'quiz', mensagem: resposta.mensagem })
      return
    }

    setRespostas({})
    setEntregue(false)
    biblioteca.atualizarNota(nota.id, { quiz: resposta.quiz }, 'quiz gerado pela IA')
  }

  const apagarQuiz = () => {
    setRespostas({})
    setEntregue(false)
    biblioteca.atualizarNota(nota.id, { quiz: [] }, 'quiz removido')
    aoAvisar('Quiz removido')
  }

  /** Antes de entregar, a resposta pode ser trocada quantas vezes quiser. */
  const responder = (indicePergunta, indiceOpcao) => {
    if (entregue) return
    setRespostas((atual) => ({ ...atual, [indicePergunta]: indiceOpcao }))
  }

  /** Certo e errado só aparecem depois que as respostas são entregues. */
  const estadoDaOpcao = (pergunta, indicePergunta, indiceOpcao) => {
    const escolhida = respostas[indicePergunta]
    if (!entregue) return escolhida === indiceOpcao ? 'is-escolhida' : ''
    if (indiceOpcao === pergunta.correta) return 'is-certa'
    if (indiceOpcao === escolhida) return 'is-errada'
    return ''
  }

  const pesquisar = (endereco) =>
    window.open(`${endereco}${encodeURIComponent(nota.titulo)}`, '_blank', 'noopener,noreferrer')

  /* ----------------------------------------------------------------- tela */

  return (
    <section className="tela tela--conteudo">
      <header className="cabecalho-analise">
        <BotaoIcone rotulo="Voltar" aoClicar={aoVoltar}>
          <IconeVoltar tamanho={26} />
        </BotaoIcone>
        <div className="cabecalho-analise__acoes">
          <BotaoIcone rotulo="Compartilhar" aoClicar={compartilhar} data-dica="nota-compartilhar">
            <IconeCompartilhar tamanho={23} />
          </BotaoIcone>
          <BotaoIcone rotulo="Baixar" aoClicar={baixar} data-dica="nota-baixar">
            <IconeBaixar tamanho={23} />
          </BotaoIcone>
        </div>
      </header>

      <div className="tela__rolagem tela__rolagem--analise">
        <div
          className={`foto-analise ${giro % 180 === 90 ? 'is-lado' : ''}`}
          style={{ '--giro': `${giro}deg` }}
        >
          <MiniaturaNota nota={nota} altura={420} />
          {analisada && (
            <span className="foto-analise__selo">
              <IconeIA tamanho={15} />
              Analisado por IA
            </span>
          )}
          {nota.imagem && (
            <button
              type="button"
              className="foto-analise__girar"
              onClick={() => setGiro((atual) => (atual + 90) % 360)}
              aria-label="Girar a imagem"
            >
              <IconeAtualizar tamanho={24} />
            </button>
          )}
        </div>

        {erro?.onde === 'analise' && <p className="nota-erro">{erro.mensagem}</p>}

        {!analisada && (
          <Cartao rotulo={processando ? 'ANALISANDO' : 'ANÁLISE COM IA'} comIcone>
            <p className="cartao-analise__aviso">
              {processando
                ? 'A IA está lendo a captura para preparar o resumo, o quiz e os pontos-chave.'
                : 'Esta anotação ainda não foi analisada. A IA lê a captura e gera o resumo, o quiz e os pontos-chave.'}
            </p>
            <button
              type="button"
              className="botao-analisar"
              onClick={analisar}
              disabled={processando}
            >
              <IconeIA tamanho={18} />
              {processando ? 'Analisando…' : 'Analisar com IA'}
            </button>
          </Cartao>
        )}

        {analisada && (
          <>
            <Cartao
              rotulo="IDENTIFICADO"
              comIcone
              acao={{
                rotulo: 'Analisar novamente',
                icone: <IconeAtualizar tamanho={20} />,
                classe: processando ? 'is-processando' : '',
                desabilitado: processando,
                aoClicar: analisar,
              }}
            >
              <h1 className="analise-titulo">{nota.titulo}</h1>
              <p className="analise-legenda">
                Resumo gerado por IA · {album ? album.nome : 'sem matéria'}
              </p>
            </Cartao>

            {palavrasChave.length > 0 && (
              <Cartao rotulo="PALAVRAS-CHAVE">
                <ul className="lista-palavras">
                  {palavrasChave.map((palavra) => (
                    <li key={palavra} className="palavra-chave">
                      {palavra}
                    </li>
                  ))}
                </ul>
              </Cartao>
            )}

            <Cartao
              rotulo="RESUMO"
              acao={
                // O botão de ouvir só aparece com a leitura em voz alta ligada
                // em Ajustes (e com algum recurso de síntese disponível).
                ajustes.leituraEmVozAlta
                  ? {
                      dica: 'nota-ouvir',
                      rotulo: lendo ? 'Parar a leitura' : 'Ouvir o resumo em voz alta',
                      icone: lendo ? <IconeParar tamanho={20} /> : <IconeAltoFalante tamanho={20} />,
                      classe: lendo ? 'is-lendo' : '',
                      aoClicar: alternarLeitura,
                    }
                  : null
              }
            >
              <p className="analise-resumo">{nota.resumo}</p>
            </Cartao>

            {quiz.length === 0 && (
              <section className="cartao-analise">
                <button
                  type="button"
                  data-dica="nota-quiz"
                  className="botao-quiz"
                  onClick={criarQuiz}
                  disabled={gerandoQuiz}
                >
                  <IconeIA tamanho={20} />
                  {gerandoQuiz
                    ? 'Gerando o seu quiz…'
                    : 'Quer testar seus conhecimentos? Gere um quiz!'}
                </button>
                {erro?.onde === 'quiz' && <p className="nota-erro">{erro.mensagem}</p>}
              </section>
            )}

            {quiz.length > 0 && (
              <Cartao
                rotulo="QUIZ"
                acao={{
                  rotulo: 'Remover o quiz',
                  icone: <IconeLixeira tamanho={20} />,
                  aoClicar: apagarQuiz,
                }}
              >
                <ol className="quiz">
                  {quiz.map((pergunta, indicePergunta) => (
                    <li key={pergunta.pergunta} className="quiz__item">
                      <p className="quiz__pergunta">
                        {indicePergunta + 1}. {pergunta.pergunta}
                      </p>
                      <ul className="quiz__opcoes">
                        {pergunta.opcoes.map((opcao, indiceOpcao) => (
                          <li key={opcao}>
                            <button
                              type="button"
                              className={`quiz__opcao ${estadoDaOpcao(pergunta, indicePergunta, indiceOpcao)}`}
                              onClick={() => responder(indicePergunta, indiceOpcao)}
                              disabled={entregue}
                            >
                              {opcao}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>

                {!entregue && (
                  <button
                    type="button"
                    className="botao-entregar"
                    onClick={() => setEntregue(true)}
                    disabled={!completo}
                  >
                    {completo ? 'Entregar respostas' : `Responda as ${quiz.length} perguntas`}
                  </button>
                )}

                {entregue && (
                  <>
                    <p className={`quiz__resultado ${resultado.classe}`}>{resultado.texto}</p>
                    <button
                      type="button"
                      className="botao-refazer"
                      onClick={() => {
                        setRespostas({})
                        setEntregue(false)
                      }}
                    >
                      Refazer quiz
                    </button>
                  </>
                )}
              </Cartao>
            )}

            {pontosChave.length > 0 && (
              <Cartao rotulo="PONTOS-CHAVE">
                <ol className="lista-pontos">
                  {pontosChave.map((ponto, indice) => (
                    <li key={ponto} className="ponto-chave">
                      <span className="ponto-chave__numero">{indice + 1}</span>
                      {ponto}
                    </li>
                  ))}
                </ol>
              </Cartao>
            )}

            {aoConversar && (
              <button
                type="button"
                data-dica="nota-tutor"
                className="botao-tutor"
                onClick={() => aoConversar(nota.id)}
              >
                <IconeChat tamanho={22} />
                <span>
                  <strong>Falar com o tutor</strong>
                  Tire uma dúvida sobre este resumo
                </span>
              </button>
            )}

            <Cartao rotulo="CONTEÚDOS RELACIONADOS">
              <div className="lista-atalhos" data-dica="nota-relacionados">
                <Atalho
                  icone={<IconeBusca tamanho={21} />}
                  titulo="Pesquisar na Web"
                  descricao="Abrir busca no navegador"
                  aoClicar={() => pesquisar('https://www.google.com/search?q=')}
                />
                <Atalho
                  icone={<IconePlay tamanho={21} />}
                  variante="atalho-relacionado__icone--youtube"
                  titulo="Ver Vídeos no YouTube"
                  descricao="Abrir busca no YouTube"
                  aoClicar={() => pesquisar('https://www.youtube.com/results?search_query=')}
                />
              </div>
            </Cartao>
          </>
        )}
      </div>
    </section>
  )
}

export default TelaNota
