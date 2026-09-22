/**
 * Biblioteca de ícones em SVG desenhados para reproduzir a interface do
 * StudyCam AI. Todos herdam a cor do texto (`currentColor`), o que permite
 * reaproveitar o mesmo ícone em botões claros e escuros.
 */

const Svg = ({ tamanho = 24, children, ...resto }) => (
  <svg
    viewBox="0 0 24 24"
    width={tamanho}
    height={tamanho}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...resto}
  >
    {children}
  </svg>
)

export const IconeFlashOff = (props) => (
  <Svg {...props}>
    <path d="M13 2 5.5 12.5H11l-.6 5.2" />
    <path d="m12.4 10.4 6.1-.4L15 14.6" />
    <path d="M3.5 3.5 20.5 20.5" strokeWidth="1.8" />
  </Svg>
)

export const IconeFlashOn = (props) => (
  <Svg {...props}>
    <path d="M13 2 5.5 12.5H11l-1 9.5L18.5 9.5H12z" fill="currentColor" strokeWidth="1.2" />
  </Svg>
)

export const IconeTemporizador = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.5v4" />
    <path d="M9 2.5h6" />
    <path d="M12 2.5v3.5" />
  </Svg>
)

export const IconeIA = (props) => (
  <Svg {...props}>
    <path
      d="M9 3.2 10.3 6.7 13.8 8 10.3 9.3 9 12.8 7.7 9.3 4.2 8 7.7 6.7z"
      fill="currentColor"
      strokeWidth="0.8"
    />
    <path
      d="M16.5 12.4 17.4 14.8 19.8 15.7 17.4 16.6 16.5 19 15.6 16.6 13.2 15.7 15.6 14.8z"
      fill="currentColor"
      strokeWidth="0.8"
    />
  </Svg>
)

export const IconeEngrenagem = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1z" />
  </Svg>
)

/** Ícone colorido do atalho "documento" (mantém as cores originais do app). */
export const IconeDocumento = ({ tamanho = 32 }) => (
  <svg viewBox="0 0 32 32" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <rect x="7" y="4" width="18" height="24" rx="2.5" fill="#FFFFFF" />
    <g fill="#8A8F98">
      <rect x="10.5" y="12" width="11" height="1.6" rx="0.8" />
      <rect x="10.5" y="15.5" width="11" height="1.6" rx="0.8" />
      <rect x="10.5" y="19" width="7" height="1.6" rx="0.8" />
    </g>
    <g stroke="#2F9BE8" strokeWidth="2" strokeLinecap="round" fill="none">
      <path d="M4 8.5V5.5A1.5 1.5 0 0 1 5.5 4h3" />
      <path d="M28 8.5V5.5A1.5 1.5 0 0 0 26.5 4h-3" />
      <path d="M4 23.5v3A1.5 1.5 0 0 0 5.5 28h3" />
      <path d="M28 23.5v3a1.5 1.5 0 0 1-1.5 1.5h-3" />
    </g>
  </svg>
)

export const IconeGaleria = ({ tamanho = 26 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <path
      d="M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18V6A1.5 1.5 0 0 1 4 4.5m3.6 3.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8M3.9 17.6h16.2l-5.2-6.1-3.6 4.2-2.3-2.5z"
      fill="currentColor"
    />
  </svg>
)

/** Botão direito da barra inferior: acesso rápido à central de conteúdo. */
export const IconeMaleta = ({ tamanho = 26 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <path
      d="M9.5 4.5h5a1.5 1.5 0 0 1 1.5 1.5v1.2h3.4A1.6 1.6 0 0 1 21 8.8v9.4a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 18.2V8.8a1.6 1.6 0 0 1 1.6-1.6H8V6a1.5 1.5 0 0 1 1.5-1.5m.4 2.7h4.2V6.4H9.9z"
      fill="currentColor"
    />
  </svg>
)

/** Marcador das matérias: página branca com a fita recortada na cor do álbum. */
export const IconeMarcador = ({ tamanho = 26, corFita = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <rect x="4.5" y="2.5" width="15" height="19" rx="2.4" fill="#FFFFFF" />
    <path d="M7.6 2.5h4.6v7.2l-2.3-1.8-2.3 1.8z" fill={corFita} />
  </svg>
)

export const IconeVoltar = (props) => (
  <Svg strokeWidth="1.8" {...props}>
    <path d="M20 12H4.5" />
    <path d="m10.5 5.5-6 6.5 6 6.5" />
  </Svg>
)

export const IconeBusca = (props) => (
  <Svg strokeWidth="1.8" {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Svg>
)

export const IconeMenuVertical = ({ tamanho = 24 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <g fill="currentColor">
      <circle cx="12" cy="5" r="1.9" />
      <circle cx="12" cy="12" r="1.9" />
      <circle cx="12" cy="19" r="1.9" />
    </g>
  </svg>
)

export const IconeCalendario = (props) => (
  <Svg {...props}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3.5V6M16 3.5V6" />
  </Svg>
)

export const IconeLapis = (props) => (
  <Svg {...props}>
    <path d="M16.6 3.9a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8L8.9 18.6l-4.4 1.1 1.1-4.4z" />
  </Svg>
)

export const IconePaleta = (props) => (
  <Svg {...props}>
    <path d="M12 3.2a8.8 8.8 0 0 0 0 17.6c1.3 0 2-.9 2-1.8s-.6-1.4-.6-2.1.6-1.3 1.4-1.3h1.6A4.4 4.4 0 0 0 20.8 11c0-4.3-3.9-7.8-8.8-7.8" />
    <circle cx="7.6" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="9.8" cy="8" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="14.4" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="17.4" cy="10.6" r="1.1" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconeLixeira = (props) => (
  <Svg {...props}>
    <path d="M4.5 6.5h15" />
    <path d="M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
    <path d="M6.5 6.5 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.9-12.5" />
    <path d="M10.3 10.2v6.4M13.7 10.2v6.4" />
  </Svg>
)

export const IconeMais = (props) => (
  <Svg strokeWidth="1.8" {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const IconeCheck = (props) => (
  <Svg strokeWidth="2" {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
)

export const IconeFechar = (props) => (
  <Svg strokeWidth="1.8" {...props}>
    <path d="M6 6 18 18M18 6 6 18" />
  </Svg>
)

export const IconeRestaurar = (props) => (
  <Svg {...props}>
    <path d="M4 11.5a8 8 0 1 1 2.4 5.7" />
    <path d="M3.5 5.5v5h5" />
  </Svg>
)

export const IconeRelogio = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.3l3.3 2" />
  </Svg>
)

export const IconeGrafico = (props) => (
  <Svg {...props}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Svg>
)

export const IconeEscudo = (props) => (
  <Svg {...props}>
    <path d="M12 3.2 19.5 6v6.2c0 4.2-3 7.4-7.5 8.6-4.5-1.2-7.5-4.4-7.5-8.6V6z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </Svg>
)

export const IconeAltoFalante = (props) => (
  <Svg {...props}>
    <path d="M4.5 9.5h3l4.5-3.8v12.6l-4.5-3.8h-3z" />
    <path d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.6a7.6 7.6 0 0 1 0 10.8" />
  </Svg>
)

export const IconeExportar = (props) => (
  <Svg {...props}>
    <path d="M12 15.5V4" />
    <path d="m8 7.5 4-4 4 4" />
    <path d="M5 14v4.8a1.7 1.7 0 0 0 1.7 1.7h10.6a1.7 1.7 0 0 0 1.7-1.7V14" />
  </Svg>
)

export const IconeMover = (props) => (
  <Svg {...props}>
    <path d="M3.5 7.2A1.7 1.7 0 0 1 5.2 5.5h3.4l1.9 2.2h8.3a1.7 1.7 0 0 1 1.7 1.7v7.9a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7z" />
  </Svg>
)

export const IconeSetaCima = (props) => (
  <Svg strokeWidth="1.8" {...props}>
    <path d="m6 14 6-6 6 6" />
  </Svg>
)

export const IconeSetaBaixo = (props) => (
  <Svg strokeWidth="1.8" {...props}>
    <path d="m6 10 6 6 6-6" />
  </Svg>
)

export const IconeSetaDireita = (props) => (
  <Svg strokeWidth="1.8" {...props}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
)

export const IconeCompartilhar = (props) => (
  <Svg {...props}>
    <circle cx="17.5" cy="5.8" r="2.6" />
    <circle cx="6.5" cy="12" r="2.6" />
    <circle cx="17.5" cy="18.2" r="2.6" />
    <path d="m8.9 10.7 6.2-3.5M8.9 13.3l6.2 3.5" />
  </Svg>
)

export const IconeBaixar = (props) => (
  <Svg {...props}>
    <path d="M12 3.5v11.3" />
    <path d="m7.6 10.4 4.4 4.4 4.4-4.4" />
    <path d="M4.6 19.5h14.8" />
  </Svg>
)

export const IconeAtualizar = (props) => (
  <Svg {...props}>
    <path d="M4.2 12a7.8 7.8 0 1 1 2.5 5.7" />
    <path d="M3.6 4.4v4.4H8" />
  </Svg>
)

export const IconePlay = ({ tamanho = 22 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <path d="M8.4 5.4 18.2 12l-9.8 6.6z" fill="currentColor" />
  </svg>
)

export const IconeParar = ({ tamanho = 20 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <rect x="6.5" y="6.5" width="11" height="11" rx="2.6" fill="currentColor" />
  </svg>
)

/* ---------------------------------------------------- barra de status/sistema */

export const IconeMudo = ({ tamanho = 18 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <path d="M4 9.5h3.2L11.5 6v12L7.2 14.5H4z" fill="currentColor" />
    <path
      d="M15 9.5 20 15M20 9.5 15 15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

export const IconeWifi = ({ tamanho = 18 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <path d="M12 19.5 2.5 8.8a13.6 13.6 0 0 1 19 0z" fill="currentColor" />
  </svg>
)

export const IconeSinal = ({ tamanho = 18 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <g fill="currentColor">
      <rect x="2" y="15" width="3.4" height="5" rx="1" />
      <rect x="7.2" y="11.5" width="3.4" height="8.5" rx="1" />
      <rect x="12.4" y="8" width="3.4" height="12" rx="1" />
      <rect x="17.6" y="4.5" width="3.4" height="15.5" rx="1" />
    </g>
  </svg>
)

export const IconeBateria = ({ nivel = 83, tamanho = 30 }) => (
  <svg viewBox="0 0 34 20" width={tamanho} height={tamanho * 0.6} aria-hidden="true" focusable="false">
    <rect x="0.5" y="0.5" width="33" height="19" rx="9.5" fill="currentColor" />
    <text
      x="17"
      y="14.4"
      textAnchor="middle"
      fontSize="11"
      fontWeight="600"
      fill="#000000"
      fontFamily="inherit"
    >
      {nivel}
    </text>
  </svg>
)

export const IconeNotificacaoChat = ({ tamanho = 16 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <path
      d="M4 5.5h16v10.2H9.5L5.5 19v-3.3H4z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
)

export const IconeNotificacaoImagem = ({ tamanho = 16 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <rect
      x="3.5"
      y="4.5"
      width="17"
      height="15"
      rx="2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="M7 15.5 10 12l2.4 2.6L15 12l2.5 3.5z" fill="currentColor" />
  </svg>
)

export const IconeSistemaRecentes = ({ tamanho = 22 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <g fill="currentColor">
      <rect x="4" y="4" width="2.2" height="16" rx="1.1" />
      <rect x="10.9" y="4" width="2.2" height="16" rx="1.1" />
      <rect x="17.8" y="4" width="2.2" height="16" rx="1.1" />
    </g>
  </svg>
)

export const IconeSistemaInicio = ({ tamanho = 22 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <rect
      x="4.5"
      y="4.5"
      width="15"
      height="15"
      rx="7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)

export const IconeSistemaVoltar = ({ tamanho = 22 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <path
      d="m15 4.5-8 7.5 8 7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* ------------------------------------------- tutor, simulados e ajustes */

export const IconeChat = (props) => (
  <Svg {...props}>
    <path d="M4 5.5h16v10.5H9.5L5.5 19.5V16H4z" />
    <circle cx="9" cy="10.7" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="10.7" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10.7" r="1" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconeChapeu = (props) => (
  <Svg {...props}>
    <path d="M12 4 2.5 8.5 12 13l9.5-4.5z" />
    <path d="M6.5 10.8v5.1c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-5.1" />
    <path d="M21.5 8.5v5" />
  </Svg>
)

export const IconeMicrofone = (props) => (
  <Svg {...props}>
    <rect x="9" y="2.8" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
    <path d="M12 18v3.2M8.8 21.2h6.4" />
  </Svg>
)

export const IconeEnviar = (props) => (
  <svg
    viewBox="0 0 24 24"
    width={props.tamanho || 24}
    height={props.tamanho || 24}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 11.3 20.5 4 13.2 21.5l-2.3-7.9z" fill="currentColor" />
  </svg>
)

export const IconeCopiar = (props) => (
  <Svg {...props}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
    <path d="M15.5 5.5H6.8c-.7 0-1.3.6-1.3 1.3v8.7" />
  </Svg>
)

export const IconeYoutube = ({ tamanho = 22 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <rect x="2" y="5" width="20" height="14" rx="4.4" fill="currentColor" />
    <path d="M10 8.9 15.6 12 10 15.1z" fill="#0f0f13" />
  </svg>
)

export const IconeGlobo = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M3.4 12h17.2" />
    <path d="M12 3.2c2.3 2.4 3.5 5.5 3.5 8.8s-1.2 6.4-3.5 8.8c-2.3-2.4-3.5-5.5-3.5-8.8S9.7 5.6 12 3.2z" />
  </Svg>
)

export const IconeEstrela = (props) => (
  <Svg {...props}>
    <path
      d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z"
      fill="currentColor"
      strokeWidth="1.2"
    />
  </Svg>
)

export const IconeInfo = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 11v5.5" />
    <circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconeAjuda = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.4" />
    <circle cx="12" cy="16.6" r="1" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconeSelecao = ({ tamanho = 24, marcado = false }) => (
  <Svg tamanho={tamanho}>
    <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.4" />
    {marcado && <path d="m7.8 12.2 2.9 2.9 5.5-6.1" strokeWidth="2" />}
  </Svg>
)

export const IconeSelecionarLista = (props) => (
  <Svg {...props}>
    <path d="m3 7.2 1.8 1.8L8 5.8" strokeWidth="1.8" />
    <path d="m3 16.2 1.8 1.8L8 14.8" strokeWidth="1.8" />
    <path d="M11.5 7.5h9.5M11.5 16.5h9.5" />
  </Svg>
)

export const IconeLinkedIn = ({ tamanho = 22 }) => (
  <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} aria-hidden="true" focusable="false">
    <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="currentColor" />
    <path
      d="M7.4 10h1.9v7.2H7.4zm.95-3.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM11.2 10h1.8v1c.4-.7 1.2-1.2 2.2-1.2 1.8 0 2.6 1.1 2.6 3v4.4h-1.9v-3.9c0-1-.3-1.6-1.2-1.6-.8 0-1.3.6-1.3 1.6v3.9h-1.9z"
      fill="#0f0f13"
    />
  </svg>
)

export default Svg
