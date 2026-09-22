import { Link } from 'react-router-dom'

import PhoneMockup from './PhoneMockup'

const Hero = () => (
  <section id="topo" className="hero" aria-label="Apresentação">
    <div className="hero-glow" aria-hidden="true" />

    <div className="hero-texto">
      <p className="etiqueta">JOVI Eng. Software Challenge 2026</p>
      <h1>
        A câmera que estuda <span>junto com você</span>
      </h1>
      <p className="hero-descricao">
        StudyCam AI é o Modo Estudo da câmera JOVI: fotografe quadros, slides e
        anotações e deixe que a inteligência da câmera organize por matéria,
        resuma o conteúdo e deixe tudo pronto para a revisão antes da prova.
      </p>
      <div className="hero-acoes">
        <Link to="/app" className="btn btn-primario">Abrir o protótipo</Link>
        <a href="#solucao" className="btn btn-secundario">Ver como funciona</a>
      </div>
      <p className="hero-aviso">
        O protótipo roda no navegador, com as telas reais do aplicativo.
      </p>
    </div>

    <PhoneMockup>
      <div className="mock-topo"><span>Modo Estudo</span></div>
      <div className="mock-visor">
        <span className="mock-scan" />
        <div className="mock-guia" />
      </div>
      <div className="mock-modos">
        <span>Foto</span>
        <span className="ativo">Estudo</span>
        <span>Vídeo</span>
      </div>
    </PhoneMockup>
  </section>
)

export default Hero
