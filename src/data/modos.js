// Modos exibidos no seletor inferior da câmera. Apenas "StudyCam AI" é o modo
// desenvolvido pela equipe; os demais representam os modos nativos da câmera JOVI.
const MODOS = [
  { id: 'retrato', rotulo: 'Retrato', nativo: true },
  { id: 'foto', rotulo: 'Foto', nativo: true },
  { id: 'studycam', rotulo: 'StudyCam AI', nativo: false },
  { id: 'video', rotulo: 'Vídeo', nativo: true },
  { id: 'mais', rotulo: 'Mais', nativo: true },
]

export const PROPORCOES = ['4:3', '1:1', '16:9']

export const ZOOMS = [0.6, 1, 2]

export const TEMPORIZADORES = [0, 3, 10]

export default MODOS
