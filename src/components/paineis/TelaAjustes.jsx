import { useMemo, useState } from 'react'

import CabecalhoTela from '../ui/CabecalhoTela'
import Dialogo from '../ui/Dialogo'
import Interruptor from '../ui/Interruptor'
import LinhaAjuste from './LinhaAjuste'
import DICAS from '../../data/dicas'
import { IconeAjuda, IconeEstrela, IconeGlobo, IconeInfo } from '../ui/Icones'
import { INTEGRACAO_ATIVA } from '../../services/api'
import { PLANO_ATUAL, PLANOS } from '../../data/planos'
import { PROPORCOES, TEMPORIZADORES } from '../../data/modos'
import { disponivel as vozDisponivel } from '../../services/textToSpeech'
import { idiomaPorId } from '../../data/idiomas'
import { sortear } from '../../utils/aleatorio'

/** Título de seção em caixa alta, como nas telas do aplicativo. */
const Secao = ({ titulo }) => (
  <h2 className="mb-2 mt-7 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-texto-fraco">
    {titulo}
  </h2>
)

/**
 * Ajustes do aplicativo. As três primeiras seções (Plano, Aplicativo e Ajuda)
 * são as do StudyCam AI; abaixo delas ficam os controles da câmera, da IA e da
 * privacidade, que são o que este protótipo navegável expõe.
 */
const TelaAjustes = ({
  ajustes,
  definirAjuste,
  biblioteca,
  aoAbrir,
  aoVoltar,
  aoAvisar,
  aoReiniciarTutorial,
}) => {
  const [confirmando, setConfirmando] = useState(false)
  const dica = useMemo(() => sortear(DICAS), [])

  const planoAtual = PLANOS.find((plano) => plano.id === PLANO_ATUAL)

  return (
    <section className="tela">
      <CabecalhoTela titulo="Ajustes" aoVoltar={aoVoltar} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <p className="rounded-2xl bg-roxo/12 px-4 py-3 text-sm leading-relaxed text-roxo-claro">
          {dica}
        </p>

        <Secao titulo="Plano" />
        <LinhaAjuste
          icone={<IconeEstrela tamanho={20} />}
          titulo="Planos"
          descricao={planoAtual?.destaque ? 'Acesso completo' : planoAtual?.nome}
          aoClicar={() => aoAbrir('planos')}
        />

        <Secao titulo="Aplicativo" />
        <div className="flex flex-col gap-2">
          <LinhaAjuste
            icone={<IconeGlobo tamanho={20} />}
            titulo="Idioma e voz"
            descricao={idiomaPorId(ajustes.idioma).rotulo}
            aoClicar={() => aoAbrir('idioma-voz')}
          />

          <div className="rounded-2xl bg-superficie px-4">
            <Interruptor
              id="ajuste-abertura"
              rotulo="Vídeo de abertura"
              descricao="Toca a animação da marca ao abrir o app."
              ligado={ajustes.videoAbertura}
              aoAlternar={(valor) => definirAjuste('videoAbertura', valor)}
            />
          </div>
        </div>

        <Secao titulo="Ajuda" />
        <div className="flex flex-col gap-2">
          <LinhaAjuste
            icone={<IconeAjuda tamanho={20} />}
            titulo="Ver tutorial de novo"
            descricao="Mostra as dicas de primeiro uso outra vez"
            aoClicar={() => {
              aoReiniciarTutorial()
              aoAvisar('As dicas voltam na próxima tela')
            }}
          />
          <LinhaAjuste
            icone={<IconeInfo tamanho={20} />}
            titulo="Sobre"
            descricao="Projeto, equipe e contato"
            aoClicar={() => aoAbrir('sobre')}
          />
        </div>

        <Secao titulo="Câmera" />
        <div className="flex flex-col gap-2">
          <div className="rounded-2xl bg-superficie p-4">
            <p className="mb-2 text-sm text-texto-medio">Proporção da foto</p>
            <div className="flex gap-2">
              {PROPORCOES.map((proporcao) => (
                <button
                  key={proporcao}
                  type="button"
                  onClick={() => definirAjuste('proporcao', proporcao)}
                  aria-pressed={ajustes.proporcao === proporcao}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    ajustes.proporcao === proporcao
                      ? 'bg-roxo text-white'
                      : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
                  }`}
                >
                  {proporcao}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-sm text-texto-medio">Temporizador</p>
            <div className="flex gap-2">
              {TEMPORIZADORES.map((segundos) => (
                <button
                  key={segundos}
                  type="button"
                  onClick={() => definirAjuste('temporizador', segundos)}
                  aria-pressed={ajustes.temporizador === segundos}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    ajustes.temporizador === segundos
                      ? 'bg-roxo text-white'
                      : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
                  }`}
                >
                  {segundos === 0 ? 'Desl.' : `${segundos}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-superficie px-4">
            <Interruptor
              id="ajuste-flash"
              rotulo="Flash"
              descricao="Ilumina quadros e slides com pouca luz"
              ligado={ajustes.flash === 'on'}
              aoAlternar={(valor) => definirAjuste('flash', valor ? 'on' : 'off')}
            />
            <Interruptor
              id="ajuste-moldura"
              rotulo="Detecção de documento"
              descricao="Mostra a moldura automática no visor"
              ligado={ajustes.molduraDocumento}
              aoAlternar={(valor) => definirAjuste('molduraDocumento', valor)}
            />
            <Interruptor
              id="ajuste-webcam"
              rotulo="Usar a câmera do dispositivo"
              descricao="Substitui o visor simulado pela imagem real (a permissão é pedida ao abrir o protótipo)"
              ligado={ajustes.usarWebcam}
              aoAlternar={(valor) => {
                definirAjuste('usarWebcam', valor)
                aoAvisar(valor ? 'Solicitando acesso à câmera…' : 'Visor simulado restaurado')
              }}
            />
          </div>
        </div>

        <Secao titulo="Inteligência artificial" />
        <div className="rounded-2xl bg-superficie px-4">
          <Interruptor
            id="ajuste-ia"
            rotulo="Assistente StudyCam AI"
            descricao="Sugere a matéria da captura e calcula a confiança do reconhecimento"
            ligado={ajustes.iaAtiva}
            aoAlternar={(valor) => definirAjuste('iaAtiva', valor)}
          />
          <Interruptor
            id="ajuste-resumo"
            rotulo="Resumo automático"
            descricao="Resume a anotação com o Gemini assim que ela é aberta"
            ligado={ajustes.resumoAutomatico}
            aoAlternar={(valor) => definirAjuste('resumoAutomatico', valor)}
          />
          <Interruptor
            id="ajuste-tts"
            rotulo="Leitura em voz alta"
            descricao="Mostra o botão de ouvir no resumo e nas respostas do tutor"
            ligado={ajustes.leituraEmVozAlta}
            desabilitado={!vozDisponivel()}
            aoAlternar={(valor) => definirAjuste('leituraEmVozAlta', valor)}
          />
        </div>

        <Secao titulo="Privacidade" />
        <div className="rounded-2xl bg-superficie px-4">
          <Interruptor
            id="ajuste-local"
            rotulo="Salvar localização da captura"
            descricao="Guarda onde a anotação foi feita"
            ligado={ajustes.salvarLocalizacao}
            aoAlternar={(valor) => definirAjuste('salvarLocalizacao', valor)}
          />
          <Interruptor
            id="ajuste-privado"
            rotulo="Ocultar álbuns privados"
            descricao="Álbuns marcados como privados não aparecem na busca"
            ligado={ajustes.albunsPrivados}
            aoAlternar={(valor) => definirAjuste('albunsPrivados', valor)}
          />
        </div>

        <Secao titulo="Integrações" />
        <p className="text-sm leading-relaxed text-texto-medio">
          OCR da captura, resumo, quiz, simulados e tutor: Google Gemini
          {INTEGRACAO_ATIVA ? ' (conectado)' : ' (indisponível)'}.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-texto-medio">
          Leitura em voz alta: Google Cloud Text-to-Speech
          {vozDisponivel() ? ' (conectado)' : ' (indisponível)'}.
        </p>

        <Secao titulo="Dados do aplicativo" />
        <p className="text-sm leading-relaxed text-texto-medio">
          {biblioteca.totalNotas} anotações e {biblioteca.albuns.length} matérias salvas no
          localStorage deste navegador.
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-2xl border border-white/12 py-3.5 text-[0.95rem] font-medium text-texto transition hover:bg-white/5"
          onClick={() => setConfirmando(true)}
        >
          Restaurar conteúdo de exemplo
        </button>

        <p className="mt-6 text-center text-sm text-texto-fraco">
          StudyCam AI · Challenge 2026 FIAP × JOVI
        </p>
      </div>

      {confirmando && (
        <Dialogo
          titulo="Restaurar conteúdo de exemplo"
          descricao="Suas alterações locais (álbuns, anotações e histórico) serão substituídas pelo conteúdo inicial."
          aoCancelar={() => setConfirmando(false)}
          aoConfirmar={() => {
            biblioteca.restaurarPadrao()
            setConfirmando(false)
            aoAvisar('Conteúdo de exemplo restaurado')
          }}
          rotuloConfirmar="Restaurar"
          perigo
        />
      )}
    </section>
  )
}

export default TelaAjustes
