import { IconeSistemaInicio, IconeSistemaRecentes, IconeSistemaVoltar } from '../ui/Icones'

/** Barra de navegação do Android: recentes, início e voltar. */
const BarraSistema = ({ aoVoltar, aoInicio, aoRecentes }) => (
  <nav className="barra-sistema" aria-label="Navegação do sistema">
    <button type="button" onClick={aoRecentes} aria-label="Aplicativos recentes">
      <IconeSistemaRecentes />
    </button>
    <button type="button" onClick={aoInicio} aria-label="Início">
      <IconeSistemaInicio />
    </button>
    <button type="button" onClick={aoVoltar} aria-label="Voltar">
      <IconeSistemaVoltar />
    </button>
  </nav>
)

export default BarraSistema
