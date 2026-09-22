import { useEffect, useState } from 'react'

/**
 * Hook customizado que espelha um estado do React no localStorage do navegador.
 * É a base da persistência de todo o aplicativo (álbuns, anotações, histórico e
 * ajustes continuam salvos depois de fechar a aba).
 */
const useLocalStorage = (chave, valorInicial) => {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = window.localStorage.getItem(chave)
      return salvo !== null ? JSON.parse(salvo) : valorInicial
    } catch {
      return valorInicial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      // localStorage indisponível (aba anônima) ou cota excedida.
    }
  }, [chave, valor])

  return [valor, setValor]
}

export default useLocalStorage
