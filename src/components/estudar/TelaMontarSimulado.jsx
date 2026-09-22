import { useMemo, useState } from 'react'

import Interruptor from '../ui/Interruptor'
import { IconeCalendario, IconeVoltar } from '../ui/Icones'
import { gerarSimulado, limiteDePerguntas } from '../../services/api'
import { limitar } from '../../utils/formato'

const QUANTIDADES = [5, 10, 20]

const DIFICULDADES = [
  { id: 'leve', rotulo: 'Leve' },
  { id: 'media', rotulo: 'Média' },
  { id: 'dificil', rotulo: 'Difícil' },
]

/** Grupo de botões no estilo segmentado do aplicativo. */
const Segmentado = ({ opcoes, valor, aoEscolher }) => (
  <div className="flex gap-2">
    {opcoes.map((opcao) => (
      <button
        key={opcao.id}
        type="button"
        onClick={() => aoEscolher(opcao.id)}
        aria-pressed={valor === opcao.id}
        className={`min-w-16 rounded-2xl px-4 py-3 text-[0.95rem] font-medium transition ${
          valor === opcao.id
            ? 'bg-roxo text-white'
            : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
        }`}
      >
        {opcao.rotulo}
      </button>
    ))}
  </div>
)

/**
 * Passo 2 de 2: quantas perguntas, qual dificuldade e como o tempo é contado.
 * O aviso em roxo diz quantas perguntas o conteúdo escolhido comporta — pedir
 * mais do que isso faria o modelo repetir pergunta.
 */
const TelaMontarSimulado = ({
  biblioteca,
  ajustes,
  notaIds,
  aoVoltar,
  aoGerar,
  aoAgendar,
  aoAvisar,
}) => {
  const [quantidade, setQuantidade] = useState(10)
  const [personalizada, setPersonalizada] = useState(false)
  const [dificuldade, setDificuldade] = useState('media')
  const [cronometro, setCronometro] = useState(false)
  const [respostaNaHora, setRespostaNaHora] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState(null)

  const resumos = useMemo(
    () => biblioteca.notas.filter((nota) => notaIds.includes(nota.id)),
    [biblioteca.notas, notaIds],
  )

  const maximo = useMemo(() => limiteDePerguntas(resumos), [resumos])

  /** Nome do simulado: a matéria, quando é só uma; senão, o número delas. */
  const titulo = useMemo(() => {
    const materias = [...new Set(resumos.map((nota) => nota.albumId))]
      .map((id) => biblioteca.albuns.find((album) => album.id === id)?.nome)
      .filter(Boolean)

    if (materias.length === 1) return `Simulado: ${materias[0]}`
    if (materias.length > 1) return `Simulado de ${materias.length} matérias`
    return 'Simulado'
  }, [biblioteca.albuns, resumos])

  const gerar = async () => {
    setErro(null)
    setGerando(true)

    const pedido = { resumos, quantidade: Math.min(quantidade, maximo), dificuldade, ajustes }
    const resposta = await gerarSimulado(pedido)
    setGerando(false)

    if (!resposta.ok) {
      setErro(resposta.mensagem)
      return
    }

    aoGerar({
      titulo,
      perguntas: resposta.perguntas,
      dificuldade,
      cronometro,
      respostaNaHora,
      notaIds,
    })
  }

  return (
    <section className="tela">
      <header className="flex items-center gap-2 px-4 pb-1 pt-4">
        <button
          type="button"
          onClick={aoVoltar}
          aria-label="Voltar"
          className="grid size-10 place-items-center rounded-full text-texto transition hover:bg-white/8"
        >
          <IconeVoltar tamanho={24} />
        </button>
        <h1 className="text-xl font-semibold text-texto">Montar simulado</h1>
      </header>

      <p className="px-5 pb-4 text-sm text-texto-fraco">
        Passo 2 de 2 · {titulo.replace('Simulado: ', '').replace('Simulado', 'conteúdo escolhido')}
      </p>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <h2 className="mb-3 text-[1.05rem] font-medium text-texto">Quantas perguntas?</h2>
        <div className="flex gap-2">
          {QUANTIDADES.map((valor) => (
            <button
              key={valor}
              type="button"
              onClick={() => {
                setQuantidade(valor)
                setPersonalizada(false)
              }}
              aria-pressed={!personalizada && quantidade === valor}
              className={`min-w-16 rounded-2xl px-4 py-3 text-[0.95rem] font-medium transition ${
                !personalizada && quantidade === valor
                  ? 'bg-roxo text-white'
                  : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
              }`}
            >
              {valor}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPersonalizada(true)}
            aria-pressed={personalizada}
            className={`min-w-20 rounded-2xl px-4 py-3 text-[0.95rem] font-medium transition ${
              personalizada
                ? 'bg-roxo text-white'
                : 'bg-superficie-2 text-texto-medio hover:bg-superficie-3'
            }`}
          >
            Outro
          </button>
        </div>

        {personalizada && (
          <label className="mt-3 flex items-center gap-3">
            <span className="text-sm text-texto-medio">Quantidade</span>
            <input
              type="number"
              min="1"
              max={maximo}
              value={quantidade}
              onChange={(evento) =>
                setQuantidade(limitar(Number(evento.target.value) || 1, 1, maximo))
              }
              className="w-24 rounded-xl border border-white/10 bg-superficie-2 px-3 py-2 text-center text-texto outline-none focus:border-roxo"
            />
          </label>
        )}

        <p className="mt-3 text-[0.95rem] text-roxo-claro">
          Seu conteúdo dá para até {maximo} perguntas.
        </p>

        <h2 className="mb-3 mt-7 text-[1.05rem] font-medium text-texto">Dificuldade</h2>
        <Segmentado opcoes={DIFICULDADES} valor={dificuldade} aoEscolher={setDificuldade} />

        <h2 className="mb-2 mt-7 text-[1.05rem] font-medium text-texto">Tempo</h2>
        <div className="flex flex-col gap-2">
          <div className="rounded-2xl bg-superficie px-4">
            <Interruptor
              id="simulado-cronometro"
              rotulo="Cronômetro"
              descricao="Mostra o tempo, não bloqueia"
              ligado={cronometro}
              aoAlternar={setCronometro}
            />
          </div>
          <div className="rounded-2xl bg-superficie px-4">
            <Interruptor
              id="simulado-resposta"
              rotulo="Mostrar resposta na hora"
              descricao="Desligado dá a nota só no fim"
              ligado={respostaNaHora}
              aoAlternar={setRespostaNaHora}
            />
          </div>
        </div>

        {erro && (
          <p role="alert" className="mt-4 rounded-2xl bg-vermelho/15 px-4 py-3 text-sm text-vermelho">
            {erro}
          </p>
        )}
      </div>

      <footer className="flex shrink-0 flex-col gap-2 px-5 pb-4">
        <button
          type="button"
          onClick={gerar}
          disabled={gerando}
          className="w-full rounded-2xl bg-gradient-to-r from-roxo to-roxo-escuro py-3.5 text-[0.95rem] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {gerando ? 'Montando as perguntas…' : 'Gerar simulado'}
        </button>

        <button
          type="button"
          onClick={() => {
            aoAgendar({ titulo, quantidade: Math.min(quantidade, maximo) })
            aoAvisar('Evento aberto no Google Agenda')
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 py-3.5 text-[0.95rem] font-medium text-texto transition hover:bg-white/5"
        >
          <IconeCalendario tamanho={20} /> Agendar no calendário
        </button>
      </footer>
    </section>
  )
}

export default TelaMontarSimulado
