/* ============================================================================
 * Créditos mostrados na tela "Sobre" do aplicativo
 * ----------------------------------------------------------------------------
 * São os mesmos integrantes de `src/site/data/team.js` e do INTEGRANTES.TXT,
 * mas com o papel que cada um assumiu no produto — é assim que a tela aparece
 * no aplicativo Android, e a landing page continua mostrando a função
 * acadêmica. O RM fica aqui porque a banca costuma conferir por ele.
 * ==========================================================================*/

export const VERSAO = '1.1.5'

export const CREDITOS = [
  {
    id: 'ian',
    papel: 'Engenharia de Software e Desenvolvimento Mobile',
    nome: 'Ian Felipe Tassiotto Gomes',
    rm: '570812',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    id: 'joao',
    papel: 'Product Marketing e Gestão Ágil',
    nome: 'João Gabriel Vieira Mesquita',
    rm: '573685',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    id: 'hyan',
    papel: 'UX/UI Design, Regras de Negócio e QA',
    nome: 'Hyan Hideo Silveira Teodoro Ayabe',
    rm: '571005',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    id: 'elizeu',
    papel: 'Documentação e Tech Writing',
    nome: 'Elizeu Antônio de Queiroz',
    rm: '569433',
    linkedin: 'https://www.linkedin.com/',
  },
]

export const EMAIL_SUPORTE = 'equipeprisma.oficial@gmail.com'

/** Texto de abertura da tela "Sobre". */
export const HISTORIA = [
  'O StudyCam AI é mais do que um aplicativo de estudos: é o resultado prático da paixão por ' +
    'tecnologia e educação. O projeto ganhou vida durante o Challenge da FIAP, idealizado pela ' +
    'Equipe Prisma e desenvolvido ao longo de intensas sprints de engenharia de software para ' +
    'resolver um problema real: a sobrecarga de informações na hora de estudar.',
  'Combinando desenvolvimento nativo Android, serviços de backend no Firebase e a inteligência ' +
    'generativa do Gemini, o app foi criado para ser o seu assistente de estudos de bolso, ' +
    'gerando resumos e simulados de forma inteligente e rápida.',
  'Obrigado por fazer parte dessa jornada!',
]

/**
 * Documentos legais. O protótipo não tem site jurídico nem servidor próprio,
 * então o texto mora aqui e abre na própria tela "Sobre" — é curto porque o
 * aplicativo realmente guarda quase tudo no navegador de quem usa.
 */
export const DOCUMENTOS = [
  {
    id: 'privacidade',
    rotulo: 'Política de Privacidade',
    paragrafos: [
      'O StudyCam AI não tem servidor próprio. Álbuns, anotações, simulados, conversas com o ' +
        'tutor e ajustes ficam no armazenamento local do seu navegador e não saem dele.',
      'A exceção são as análises com IA: ao pedir um resumo, um quiz, um simulado ou uma ' +
        'resposta do tutor, o conteúdo da anotação é enviado ao Google Gemini; ao pedir a ' +
        'narração, o texto vai para o Google Text-to-Speech. Os dois serviços recebem apenas o ' +
        'necessário para devolver a resposta.',
      'Nada é vendido ou compartilhado com terceiros. Para apagar tudo, use "Restaurar conteúdo ' +
        'de exemplo", em Ajustes, ou limpe os dados deste site no navegador.',
    ],
  },
  {
    id: 'termos',
    rotulo: 'Termos de Uso',
    paragrafos: [
      'Este é um protótipo acadêmico, feito para o Eng. Software Challenge 2026 da FIAP em ' +
        'parceria com a JOVI. Não é um produto comercial e não tem garantia de disponibilidade.',
      'O conteúdo gerado por IA pode conter erros: confira as informações antes de usar em prova ' +
        'ou trabalho.',
      'Você é responsável pelo material que fotografa e deve respeitar os direitos autorais de ' +
        'livros, apostilas e slides.',
    ],
  },
  {
    id: 'licencas',
    rotulo: 'Licenças de Código Aberto',
    paragrafos: [
      'React, React Router, Tailwind CSS, Vite e ESLint são distribuídos sob a licença MIT.',
      'Os ícones da interface e as miniaturas das anotações são desenhos próprios em SVG, feitos ' +
        'pela equipe.',
      'O texto completo de cada licença acompanha o pacote correspondente, na pasta node_modules ' +
        'do projeto.',
    ],
  },
]

export default CREDITOS
