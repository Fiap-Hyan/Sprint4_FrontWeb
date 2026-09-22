import {
  IconeBateria,
  IconeMudo,
  IconeNotificacaoChat,
  IconeNotificacaoImagem,
  IconeSinal,
  IconeWifi,
} from '../ui/Icones'

/** Barra de status do celular (relógio à esquerda, indicadores à direita). */
const BarraStatus = ({ hora, bateria = 83 }) => (
  <div className="barra-status">
    <div className="barra-status__esquerda">
      <span className="barra-status__hora">{hora}</span>
      <IconeNotificacaoImagem />
      <IconeNotificacaoChat />
      <span className="barra-status__ponto" aria-hidden="true" />
    </div>
    <div className="barra-status__direita">
      <IconeMudo />
      <span className="barra-status__wifi">
        <IconeWifi />
        <sup>5</sup>
      </span>
      <IconeSinal />
      <IconeBateria nivel={bateria} />
    </div>
  </div>
)

export default BarraStatus
