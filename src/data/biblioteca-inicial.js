// Conteúdo inicial da biblioteca (usado apenas no primeiro acesso, antes de o
// localStorage guardar os dados do usuário). Reproduz exatamente o estado das
// telas do protótipo: 17 anotações distribuídas em 6 matérias.

const diasAtras = (dias, hora = 19) => {
  const data = new Date()
  data.setDate(data.getDate() - dias)
  data.setHours(hora, 9, 0, 0)
  return data.toISOString()
}

export const ALBUNS_INICIAIS = [
  { id: 'alb-prog', nome: 'Programação', cor: 'ambar', ordem: 0, criadoEm: diasAtras(28) },
  { id: 'alb-mat', nome: 'Matemática', cor: 'azul', ordem: 1, criadoEm: diasAtras(27) },
  { id: 'alb-hist', nome: 'História', cor: 'laranja', ordem: 2, criadoEm: diasAtras(26) },
  { id: 'alb-bio', nome: 'Biologia', cor: 'ciano', ordem: 3, criadoEm: diasAtras(25) },
  { id: 'alb-fis', nome: 'Física', cor: 'roxo', ordem: 4, criadoEm: diasAtras(24) },
  { id: 'alb-qui', nome: 'Química', cor: 'turquesa', ordem: 5, criadoEm: diasAtras(23) },
]

const nota = (id, titulo, albumId, tipo, dias, confianca) => ({
  id,
  titulo,
  albumId,
  tipo,
  criadoEm: diasAtras(dias),
  imagem: null,
  confiancaIA: confianca,
  favorita: false,
  privada: false,
  resumo: null,
  palavrasChave: [],
  pontosChave: [],
  quiz: [],
  texto: null,
  excluidaEm: null,
})

export const NOTAS_INICIAIS = [
  // Programação (3) - mesmas anotações vistas na tela do álbum
  nota('nota-01', 'Acessibilidade e inclusão', 'alb-prog', 'slide', 2, 96),
  nota('nota-02', 'Logo Python — aula 04', 'alb-prog', 'tela', 3, 88),
  nota('nota-03', 'Energia Mecânica', 'alb-prog', 'caderno', 5, 91),
  // Matemática (3)
  nota('nota-04', 'Funções do 2º grau', 'alb-mat', 'quadro', 1, 94),
  nota('nota-05', 'Matrizes e determinantes', 'alb-mat', 'caderno', 4, 89),
  nota('nota-06', 'Lista de exercícios 07', 'alb-mat', 'slide', 8, 92),
  // História (2)
  nota('nota-07', 'Era Vargas — linha do tempo', 'alb-hist', 'quadro', 6, 87),
  nota('nota-08', 'Guerra Fria — resumo', 'alb-hist', 'caderno', 9, 90),
  // Biologia (3)
  nota('nota-09', 'Ciclo de Krebs', 'alb-bio', 'quadro', 2, 93),
  nota('nota-10', 'Divisão celular', 'alb-bio', 'slide', 7, 95),
  nota('nota-11', 'Genética — 1ª lei de Mendel', 'alb-bio', 'caderno', 11, 86),
  // Física (3)
  nota('nota-12', 'Leis de Newton', 'alb-fis', 'quadro', 3, 92),
  nota('nota-13', 'MRU e MRUV', 'alb-fis', 'caderno', 10, 88),
  nota('nota-14', 'Lançamento oblíquo', 'alb-fis', 'slide', 13, 90),
  // Química (3)
  nota('nota-15', 'Tabela periódica — famílias', 'alb-qui', 'slide', 5, 97),
  nota('nota-16', 'Ligações químicas', 'alb-qui', 'quadro', 12, 85),
  nota('nota-17', 'Balanceamento de equações', 'alb-qui', 'caderno', 15, 89),
]

export const AJUSTES_INICIAIS = {
  flash: 'off',
  proporcao: '4:3',
  temporizador: 0,
  iaAtiva: true,
  molduraDocumento: false,
  zoom: 1,
  leituraEmVozAlta: true,
  resumoAutomatico: false,
  salvarLocalizacao: false,
  albunsPrivados: false,
  usarWebcam: true,

  // Ajustes > Idioma e voz: valem para a interface, para a língua em que a IA
  // escreve o resumo e para a narração.
  idioma: 'pt-BR',
  resumirNoIdiomaDoDocumento: false,
  voz: 'feminina',
  velocidadeVoz: 1,

  // Ajustes > Aplicativo: animação da marca ao abrir o protótipo.
  videoAbertura: true,
}

export default { ALBUNS_INICIAIS, NOTAS_INICIAIS, AJUSTES_INICIAIS }
