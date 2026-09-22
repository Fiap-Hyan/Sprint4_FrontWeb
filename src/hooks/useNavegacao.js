import { useCallback, useState } from 'react'

/**
 * Navegação em pilha, imitando o comportamento do Android: cada tela empilha
 * sobre a anterior e o botão "voltar" da barra do sistema desempilha.
 */
const TELA_INICIAL = { nome: 'camera', parametro: null }

/**
 * @param {{nome:string, parametro:*}|null} telaDeEntrada tela aberta por cima da
 *   câmera na primeira renderização (é o que o link do Google Agenda usa para
 *   cair direto no simulado agendado)
 */
const useNavegacao = (telaDeEntrada = null) => {
  const [pilha, setPilha] = useState(() =>
    telaDeEntrada ? [TELA_INICIAL, telaDeEntrada] : [TELA_INICIAL],
  )

  const abrir = useCallback((nome, parametro = null) => {
    setPilha((atual) => [...atual, { nome, parametro }])
  }, [])

  const voltar = useCallback(() => {
    setPilha((atual) => (atual.length > 1 ? atual.slice(0, -1) : atual))
  }, [])

  const inicio = useCallback(() => setPilha([TELA_INICIAL]), [])

  /**
   * Troca a aba da biblioteca (Biblioteca, Tutor, Estudar). A câmera continua
   * na base da pilha, então o botão voltar do sistema sai da biblioteca e
   * devolve o visor, como no aplicativo.
   */
  const trocarAba = useCallback((nome) => {
    setPilha((atual) => [atual[0], { nome, parametro: null }])
  }, [])

  const substituir = useCallback((nome, parametro = null) => {
    setPilha((atual) => [...atual.slice(0, -1), { nome, parametro }])
  }, [])

  return {
    tela: pilha[pilha.length - 1],
    profundidade: pilha.length,
    abrir,
    voltar,
    inicio,
    substituir,
    trocarAba,
  }
}

export default useNavegacao
