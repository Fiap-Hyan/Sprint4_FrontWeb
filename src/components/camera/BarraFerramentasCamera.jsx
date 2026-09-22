import BotaoIcone from '../ui/BotaoIcone'
import { IconeEngrenagem, IconeFlashOff, IconeFlashOn, IconeIA, IconeTemporizador } from '../ui/Icones'
import { PROPORCOES, TEMPORIZADORES } from '../../data/modos'

/** Barra superior da câmera: flash, proporção, temporizador, IA e ajustes. */
const BarraFerramentasCamera = ({ ajustes, definirAjuste, aoAbrirAjustes, aoAvisar }) => {
  const alternarFlash = () => {
    const proximo = ajustes.flash === 'off' ? 'on' : 'off'
    definirAjuste('flash', proximo)
    aoAvisar(proximo === 'on' ? 'Flash ativado' : 'Flash desativado')
  }

  const alternarProporcao = () => {
    const indice = PROPORCOES.indexOf(ajustes.proporcao)
    const proxima = PROPORCOES[(indice + 1) % PROPORCOES.length]
    definirAjuste('proporcao', proxima)
    aoAvisar(`Proporção ${proxima}`)
  }

  const alternarTemporizador = () => {
    const indice = TEMPORIZADORES.indexOf(ajustes.temporizador)
    const proximo = TEMPORIZADORES[(indice + 1) % TEMPORIZADORES.length]
    definirAjuste('temporizador', proximo)
    aoAvisar(proximo === 0 ? 'Temporizador desligado' : `Temporizador de ${proximo}s`)
  }

  const alternarIA = () => {
    definirAjuste('iaAtiva', !ajustes.iaAtiva)
    aoAvisar(ajustes.iaAtiva ? 'Assistente de IA desligado' : 'Assistente de IA ligado')
  }

  return (
    <header className="barra-camera" data-dica="camera-barra">
      <div className="barra-camera__grupo">
        <BotaoIcone rotulo="Flash" aoClicar={alternarFlash}>
          {ajustes.flash === 'on' ? <IconeFlashOn tamanho={22} /> : <IconeFlashOff tamanho={22} />}
        </BotaoIcone>
        <button type="button" className="barra-camera__proporcao" onClick={alternarProporcao}>
          {ajustes.proporcao}
        </button>
      </div>

      <div className="barra-camera__grupo">
        <BotaoIcone rotulo="Temporizador" aoClicar={alternarTemporizador} ativo={ajustes.temporizador > 0}>
          <IconeTemporizador tamanho={22} />
          {ajustes.temporizador > 0 && <span className="barra-camera__selo">{ajustes.temporizador}</span>}
        </BotaoIcone>
        <button
          type="button"
          className={`pilula-ia ${ajustes.iaAtiva ? 'is-ativa' : ''}`}
          onClick={alternarIA}
          aria-pressed={ajustes.iaAtiva}
        >
          <IconeIA tamanho={18} />
          IA
        </button>
        <BotaoIcone rotulo="Ajustes da câmera" aoClicar={aoAbrirAjustes}>
          <IconeEngrenagem tamanho={22} />
        </BotaoIcone>
      </div>
    </header>
  )
}

export default BarraFerramentasCamera
