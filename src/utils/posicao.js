/**
 * Calcula a posição de um menu suspenso em relação à tela do celular, para que
 * ele apareça ancorado no botão que o abriu sem sair da moldura do aparelho.
 */
export const posicaoDoEvento = (evento) => {
  const alvo = evento.currentTarget.getBoundingClientRect()
  const palco = evento.currentTarget.closest('.tela')
  const base = palco
    ? palco.getBoundingClientRect()
    : { left: 0, top: 0, width: 400, height: 800 }

  return {
    x: alvo.left - base.left,
    y: alvo.bottom - base.top + 6,
    limiteX: base.width,
    limiteY: base.height,
  }
}

export default posicaoDoEvento
