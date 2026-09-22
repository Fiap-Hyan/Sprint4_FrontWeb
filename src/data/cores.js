// Paleta usada nos ícones dos álbuns (matérias), reproduzindo as cores das telas
// do aplicativo StudyCam AI apresentadas no protótipo.
const CORES = {
  ambar: { nome: 'Âmbar', hex: '#D9A213' },
  azul: { nome: 'Azul', hex: '#1B6CE8' },
  laranja: { nome: 'Laranja', hex: '#F2591E' },
  ciano: { nome: 'Ciano', hex: '#128FA8' },
  roxo: { nome: 'Roxo', hex: '#7C4DFF' },
  turquesa: { nome: 'Turquesa', hex: '#12A5A5' },
  rosa: { nome: 'Rosa', hex: '#E0447A' },
  verde: { nome: 'Verde', hex: '#2E9E5B' },
}

export const LISTA_CORES = Object.keys(CORES)

export const corHex = (chave) => (CORES[chave] || CORES.roxo).hex

export const corNome = (chave) => (CORES[chave] || CORES.roxo).nome

export default CORES
