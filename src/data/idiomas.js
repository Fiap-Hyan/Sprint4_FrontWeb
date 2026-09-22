/* ============================================================================
 * Idiomas e vozes (tela Ajustes > Idioma e voz)
 * ----------------------------------------------------------------------------
 * A escolha vale para tudo que a IA escreve (resumo, quiz, simulados e as
 * respostas do tutor) e para a voz que narra. Por isso cada idioma carrega o
 * código BCP-47 usado pelo Text-to-Speech e o nome da língua que vai na
 * instrução mandada ao Gemini.
 *
 * A interface em si continua em português: traduzir os textos das telas seria
 * internacionalização, que está fora do escopo deste protótipo.
 * ==========================================================================*/

export const IDIOMAS = [
  { id: 'pt-BR', bandeira: '🇧🇷', rotulo: 'Português (Brasil)', lingua: 'português do Brasil' },
  { id: 'en-US', bandeira: '🇺🇸', rotulo: 'English', lingua: 'inglês' },
  { id: 'es-ES', bandeira: '🇪🇸', rotulo: 'Español', lingua: 'espanhol' },
  { id: 'fr-FR', bandeira: '🇫🇷', rotulo: 'Français', lingua: 'francês' },
  { id: 'de-DE', bandeira: '🇩🇪', rotulo: 'Deutsch', lingua: 'alemão' },
  { id: 'ja-JP', bandeira: '🇯🇵', rotulo: '日本語', lingua: 'japonês' },
  { id: 'zh-CN', bandeira: '🇨🇳', rotulo: '简体中文', lingua: 'chinês simplificado' },
]

/** Velocidades oferecidas para a narração. */
export const VELOCIDADES = [0.75, 1, 1.25, 1.5]

/** Trecho lido pelo botão "Ouvir uma amostra", em cada idioma. */
export const AMOSTRAS = {
  'pt-BR': 'Esta é a voz que vai narrar os seus resumos no StudyCam AI.',
  'en-US': 'This is the voice that will read your StudyCam AI summaries.',
  'es-ES': 'Esta es la voz que va a narrar tus resúmenes en StudyCam AI.',
  'fr-FR': 'Voici la voix qui lira vos résumés dans StudyCam AI.',
  'de-DE': 'Das ist die Stimme, die deine StudyCam-AI-Zusammenfassungen vorliest.',
  'ja-JP': 'これは StudyCam AI の要約を読み上げる音声です。',
  'zh-CN': '这是朗读你的 StudyCam AI 摘要的声音。',
}

export const idiomaPorId = (id) => IDIOMAS.find((item) => item.id === id) || IDIOMAS[0]

export default IDIOMAS
