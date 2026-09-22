import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import BarraAbas from '../components/ui/BarraAbas'
import BarraSistema from '../components/dispositivo/BarraSistema'
import BarraStatus from '../components/dispositivo/BarraStatus'
import TelaAjustes from '../components/paineis/TelaAjustes'
import TelaAlbum from '../components/notas/TelaAlbum'
import TelaAlbuns from '../components/albuns/TelaAlbuns'
import TelaBusca from '../components/paineis/TelaBusca'
import TelaCamera from '../components/camera/TelaCamera'
import TelaCentral from '../components/paineis/TelaCentral'
import TelaEscolherConteudo from '../components/estudar/TelaEscolherConteudo'
import TelaEstudar from '../components/estudar/TelaEstudar'
import TelaGaleria from '../components/paineis/TelaGaleria'
import TelaHistorico from '../components/paineis/TelaHistorico'
import TelaIdiomaVoz from '../components/paineis/TelaIdiomaVoz'
import TelaLixeira from '../components/paineis/TelaLixeira'
import TelaMontarSimulado from '../components/estudar/TelaMontarSimulado'
import TelaNota from '../components/notas/TelaNota'
import TelaPlanos from '../components/paineis/TelaPlanos'
import TelaResultadoSimulado from '../components/estudar/TelaResultadoSimulado'
import TelaSimulado from '../components/estudar/TelaSimulado'
import TelaSobre from '../components/paineis/TelaSobre'
import TelaTutor from '../components/tutor/TelaTutor'
import Aviso from '../components/ui/Aviso'
import Tutorial from '../components/ui/Tutorial'
import { AJUSTES_INICIAIS } from '../data/biblioteca-inicial'
import { agendaDoSimulado } from '../utils/simulado'
import useAutenticacao from '../hooks/useAutenticacao'
import useBiblioteca from '../hooks/useBiblioteca'
import useLocalStorage from '../hooks/useLocalStorage'
import useNavegacao from '../hooks/useNavegacao'
import useRelogio from '../hooks/useRelogio'
import useSimulados from '../hooks/useSimulados'
import useTutor from '../hooks/useTutor'
import useTutorial from '../hooks/useTutorial'
import useWebcam from '../hooks/useWebcam'

const NOMES_DE_TELA = {
  camera: 'Câmera · modo StudyCam AI',
  galeria: 'Galeria',
  albuns: 'Álbuns',
  album: 'Anotações da matéria',
  nota: 'Anotação',
  busca: 'Busca',
  central: 'Central de conteúdo',
  historico: 'Histórico e estatísticas',
  lixeira: 'Lixeira',
  ajustes: 'Ajustes',
  planos: 'Planos',
  'idioma-voz': 'Idioma e voz',
  sobre: 'Sobre',
  tutor: 'Tutor',
  estudar: 'Estudar',
  'escolher-conteudo': 'Escolher conteúdo',
  'montar-simulado': 'Montar simulado',
  simulado: 'Respondendo o simulado',
  resultado: 'Resultado do simulado',
}

/** Telas que mostram as abas da biblioteca no rodapé do aparelho. */
const TELAS_COM_ABAS = ['albuns', 'tutor', 'estudar']

/** Telas que escondem a barra do sistema (o simulado ocupa a tela inteira). */
const TELAS_SEM_BARRA_SISTEMA = ['simulado']

/**
 * O evento criado por "Agendar no calendário" leva para `/app?simulado=<id>`.
 * Quando o endereço traz esse parâmetro, o aparelho já abre no simulado, em
 * vez da câmera — é o que a dica dos três pontinhos promete.
 */
const telaDoEndereco = () => {
  const id = new URLSearchParams(window.location.search).get('simulado')
  return id ? { nome: 'simulado', parametro: id } : null
}

/**
 * Página do protótipo (rota privada `/app`): monta o "aparelho" (barra de
 * status, corpo e barra do sistema) e distribui, por props, os dados e as
 * ações que cada tela filha precisa.
 */
const PaginaAplicativo = () => {
  const biblioteca = useBiblioteca()
  const navegacao = useNavegacao(telaDoEndereco())
  const simulados = useSimulados()
  const hora = useRelogio()
  const { sessao, sair } = useAutenticacao()
  const [ajustes, setAjustes] = useLocalStorage('studycam:ajustes', AJUSTES_INICIAIS)
  const [aviso, setAviso] = useState('')
  const { videoRef, conectarVideo, status: statusWebcam } = useWebcam(ajustes.usarWebcam)

  const { tela } = navegacao
  const tutor = useTutor(biblioteca, ajustes)

  // As dicas da anotação explicam botões que só existem depois da análise da
  // IA (ouvir, gerar quiz, falar com o tutor). Numa anotação ainda sem resumo
  // o roteiro fica desligado, para aparecer inteiro quando a tela estiver
  // completa — e não pela metade.
  const analisada =
    tela.nome !== 'nota' ||
    Boolean(biblioteca.notas.find((nota) => nota.id === tela.parametro)?.resumo)
  const tutorial = useTutorial(analisada ? tela.nome : null)

  const definirAjuste = useCallback(
    (chave, valor) => setAjustes((atual) => ({ ...atual, [chave]: valor })),
    [setAjustes],
  )

  const avisar = useCallback((mensagem) => setAviso(mensagem), [])
  const fecharAviso = useCallback(() => setAviso(''), [])

  /** "Falar com o tutor": abre o chat já com o resumo da anotação anexado. */
  const conversarSobreNota = useCallback(
    (notaId) => {
      tutor.conversarSobre(notaId)
      navegacao.abrir('tutor')
    },
    [navegacao, tutor],
  )

  const renderizarTela = () => {
    switch (tela.nome) {
      case 'galeria':
        return (
          <TelaGaleria
            biblioteca={biblioteca}
            aoVoltar={navegacao.voltar}
            aoAbrir={navegacao.abrir}
            aoAvisar={avisar}
          />
        )
      case 'albuns':
        return (
          <TelaAlbuns
            biblioteca={biblioteca}
            aoVoltar={navegacao.voltar}
            aoAbrir={navegacao.abrir}
            aoAvisar={avisar}
          />
        )
      case 'album':
        return (
          <TelaAlbum
            biblioteca={biblioteca}
            albumId={tela.parametro}
            aoVoltar={navegacao.voltar}
            aoAbrir={navegacao.abrir}
            aoAvisar={avisar}
          />
        )
      case 'nota':
        return (
          <TelaNota
            key={tela.parametro}
            biblioteca={biblioteca}
            notaId={tela.parametro}
            ajustes={ajustes}
            aoVoltar={navegacao.voltar}
            aoAvisar={avisar}
            aoConversar={conversarSobreNota}
          />
        )
      case 'busca':
        return <TelaBusca biblioteca={biblioteca} aoVoltar={navegacao.voltar} aoAbrir={navegacao.abrir} />
      case 'central':
        return (
          <TelaCentral
            biblioteca={biblioteca}
            aoVoltar={navegacao.voltar}
            aoAbrir={navegacao.abrir}
            aoAvisar={avisar}
          />
        )
      case 'historico':
        return <TelaHistorico biblioteca={biblioteca} aoVoltar={navegacao.voltar} />
      case 'lixeira':
        return (
          <TelaLixeira
            biblioteca={biblioteca}
            aoVoltar={navegacao.voltar}
            aoAbrir={navegacao.abrir}
            aoAvisar={avisar}
          />
        )
      case 'ajustes':
        return (
          <TelaAjustes
            ajustes={ajustes}
            definirAjuste={definirAjuste}
            biblioteca={biblioteca}
            aoAbrir={navegacao.abrir}
            aoVoltar={navegacao.voltar}
            aoAvisar={avisar}
            aoReiniciarTutorial={tutorial.reiniciar}
          />
        )
      case 'planos':
        return <TelaPlanos aoVoltar={navegacao.voltar} />
      case 'idioma-voz':
        return (
          <TelaIdiomaVoz
            ajustes={ajustes}
            definirAjuste={definirAjuste}
            aoVoltar={navegacao.voltar}
            aoAvisar={avisar}
          />
        )
      case 'sobre':
        return <TelaSobre aoVoltar={navegacao.voltar} />
      case 'tutor':
        return (
          <TelaTutor tutor={tutor} biblioteca={biblioteca} ajustes={ajustes} aoAvisar={avisar} />
        )
      case 'estudar':
        return <TelaEstudar simulados={simulados} aoAbrir={navegacao.abrir} aoAvisar={avisar} />
      case 'escolher-conteudo':
        return (
          <TelaEscolherConteudo
            biblioteca={biblioteca}
            aoVoltar={navegacao.voltar}
            aoContinuar={(notaIds) => navegacao.abrir('montar-simulado', notaIds)}
          />
        )
      case 'montar-simulado':
        return (
          <TelaMontarSimulado
            biblioteca={biblioteca}
            ajustes={ajustes}
            notaIds={tela.parametro || []}
            aoVoltar={navegacao.voltar}
            aoAvisar={avisar}
            aoGerar={(dados) => {
              const novo = simulados.criarSimulado(dados)
              navegacao.substituir('simulado', novo.id)
            }}
            aoAgendar={({ titulo, quantidade }) =>
              window.open(
                // Sem id: as perguntas ainda não foram geradas, então o
                // evento leva para a aba Estudar.
                agendaDoSimulado({ titulo, perguntas: Array.from({ length: quantidade }) }),
                '_blank',
                'noopener',
              )
            }
          />
        )
      case 'simulado':
        return (
          <TelaSimulado
            simulado={simulados.porId(tela.parametro)}
            simulados={simulados}
            aoSair={navegacao.voltar}
            aoTerminar={(id) => navegacao.substituir('resultado', id)}
          />
        )
      case 'resultado':
        return (
          <TelaResultadoSimulado
            simulado={simulados.porId(tela.parametro)}
            simulados={simulados}
            aoVoltar={navegacao.voltar}
            aoAbrir={navegacao.substituir}
            aoAvisar={avisar}
          />
        )
      default:
        return (
          <TelaCamera
            ajustes={ajustes}
            definirAjuste={definirAjuste}
            albuns={biblioteca.albuns}
            contarNotas={biblioteca.contarNotas}
            adicionarNota={biblioteca.adicionarNota}
            atualizarNota={biblioteca.atualizarNota}
            videoRef={videoRef}
            conectarVideo={conectarVideo}
            statusWebcam={statusWebcam}
            aoAbrir={navegacao.abrir}
            aoAvisar={avisar}
          />
        )
    }
  }

  return (
    <div className="palco">
      <Link className="palco__voltar" to="/">
        <span aria-hidden="true">&larr;</span> Voltar para o site
      </Link>

      <aside className="palco__contexto">
        <p className="palco__marca">StudyCam AI</p>
        <h1 className="palco__titulo">O modo Estudo da câmera JOVI</h1>
        <p className="palco__texto">
          Protótipo navegável da solução criada para o Challenge 2026 (FIAP × JOVI): a câmera
          reconhece quadros, slides e cadernos, a IA resume a captura, um tutor responde dúvidas
          sobre o que você estudou e os simulados treinam a matéria.
        </p>
        <dl className="palco__dados">
          <div>
            <dt>Tela atual</dt>
            <dd>{NOMES_DE_TELA[tela.nome] || 'Câmera'}</dd>
          </div>
          <div>
            <dt>Anotações salvas</dt>
            <dd>{biblioteca.totalNotas}</dd>
          </div>
          <div>
            <dt>Matérias</dt>
            <dd>{biblioteca.albuns.length}</dd>
          </div>
          <div>
            <dt>Simulados</dt>
            <dd>{simulados.simulados.length}</dd>
          </div>
        </dl>
        <p className="palco__nota">
          Use o aparelho ao lado como no celular: o botão branco captura, o ícone da esquerda abre
          as fotos guardadas e o marcador da direita abre a biblioteca, com os álbuns, o tutor e os
          simulados. O visor pede a câmera do seu dispositivo ao abrir esta página; se você negar,
          ele continua na cena simulada.
        </p>

        {sessao && (
          <p className="palco__sessao">
            {sessao.nome} · <button type="button" onClick={sair}>sair</button>
          </p>
        )}
      </aside>

      <div className="dispositivo">
        <div className="dispositivo__tela">
          <BarraStatus hora={hora} />

          <main className="dispositivo__corpo">{renderizarTela()}</main>

          {TELAS_COM_ABAS.includes(tela.nome) && (
            <BarraAbas tela={tela.nome} aoTrocar={navegacao.trocarAba} />
          )}

          {!TELAS_SEM_BARRA_SISTEMA.includes(tela.nome) && (
            <BarraSistema
              aoVoltar={navegacao.voltar}
              aoInicio={navegacao.inicio}
              aoRecentes={() => avisar('Aplicativos recentes: função do sistema Android')}
            />
          )}

          <Aviso mensagem={aviso} aoFechar={fecharAviso} />

          <Tutorial dica={tutorial.dica} aoAvancar={tutorial.avancar} aoPular={tutorial.pular} />
        </div>
      </div>
    </div>
  )
}

export default PaginaAplicativo
