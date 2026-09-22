import { useEffect } from 'react'

import Contato from '../site/components/Contato'
import DicaDoDia from '../site/components/DicaDoDia'
import Equipe from '../site/components/Equipe'
import Estatisticas from '../site/components/Estatisticas'
import Footer from '../site/components/Footer'
import Galeria from '../site/components/Galeria'
import Header from '../site/components/Header'
import Hero from '../site/components/Hero'
import PublicoAlvo from '../site/components/PublicoAlvo'
import Recursos from '../site/components/Recursos'
import Solucao from '../site/components/Solucao'
import useLocalStorage from '../hooks/useLocalStorage'

/**
 * Landing page do StudyCam AI (rota inicial). Apresenta o problema, a solução,
 * a equipe e leva o visitante até o protótipo do aplicativo, na rota `/app`.
 */
const PaginaSite = () => {
  const [temaEscuro, setTemaEscuro] = useLocalStorage('studycam_tema_escuro', false)

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', temaEscuro ? 'escuro' : 'claro')
  }, [temaEscuro])

  useEffect(() => {
    // As seções só existem depois que o React monta a página, então o navegador
    // não consegue rolar sozinho até uma âncora que veio pronta na URL
    // (studycam.app/#contato, por exemplo). A rolagem é feita aqui, na mão.
    const alvo = window.location.hash.slice(1)

    if (alvo) document.getElementById(alvo)?.scrollIntoView()
  }, [])

  return (
    <>
      <Header temaEscuro={temaEscuro} alternarTema={() => setTemaEscuro((anterior) => !anterior)} />
      <main>
        <Hero />
        <Solucao />
        <PublicoAlvo />
        <Recursos />
        <Galeria />
        <Estatisticas />
        <DicaDoDia />
        <Equipe />
        <Contato />
      </main>
      <Footer />
    </>
  )
}

export default PaginaSite
