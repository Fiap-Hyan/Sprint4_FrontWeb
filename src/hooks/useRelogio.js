import { useEffect, useState } from 'react'

import { horaCurta } from '../utils/formato'

/** Relógio da barra de status do celular. Atualiza a cada 15 segundos. */
const useRelogio = () => {
  const [hora, setHora] = useState(() => horaCurta())

  useEffect(() => {
    const intervalo = window.setInterval(() => setHora(horaCurta()), 15000)
    return () => window.clearInterval(intervalo)
  }, [])

  return hora
}

export default useRelogio
