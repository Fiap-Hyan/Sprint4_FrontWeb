/* ============================================================================
 * Dicas de primeiro uso (as "coach marks" que aparecem ao abrir cada tela)
 * ----------------------------------------------------------------------------
 * Cada passo aponta para um elemento marcado com `data-dica="<alvo>"` na tela.
 * O componente ui/Tutorial acha o elemento por esse atributo, ilumina a área
 * dele e posiciona o cartão explicativo por perto — por isso os alvos aqui
 * precisam existir no JSX, e não são seletores de classe (que mudam com o
 * visual).
 *
 * As dicas rodam uma vez por tela e ficam marcadas no localStorage; Ajustes >
 * "Ver tutorial de novo" apaga essa marca.
 * ==========================================================================*/

export const TUTORIAIS = {
  camera: [
    {
      alvo: 'camera-captura',
      titulo: 'Aponte para a folha e toque',
      texto:
        'O botão grande tira a foto. No modo StudyCam AI o app lê a folha e devolve um resumo ' +
        'pronto; nos outros modos ele só tira a foto e salva na galeria do celular.',
    },
    {
      alvo: 'camera-modos',
      titulo: 'Os modos da câmera',
      texto:
        'Arraste esta faixa para escolher. StudyCam AI resume o que você fotografa. Foto, ' +
        'Retrato e Vídeo são os modos nativos da câmera JOVI.',
    },
    {
      alvo: 'camera-documento',
      titulo: 'Endireite a folha',
      texto:
        'Este botão recorta a página e corrige a perspectiva antes de resumir — serve quando a ' +
        'foto sai torta ou pega a mesa junto.',
    },
    {
      alvo: 'camera-barra',
      titulo: 'Flash, temporizador e ajustes',
      texto:
        'Em cima ficam o flash, a proporção da foto, o temporizador (para apoiar o celular e ' +
        'não tremer), o interruptor da IA e os ajustes do app.',
    },
    {
      alvo: 'camera-biblioteca',
      titulo: 'Seus resumos ficam aqui',
      texto:
        'Este botão abre a biblioteca, com os álbuns por matéria, a aba do tutor e a de ' +
        'simulados.',
    },
    {
      alvo: 'camera-galeria',
      titulo: 'Já tem a foto no celular?',
      texto:
        'A galeria guarda tudo que você já capturou. Segure uma foto para ver as ações dela.',
    },
  ],

  nota: [
    {
      alvo: 'nota-ouvir',
      titulo: 'Ouça o resumo',
      texto: 'A narração usa a voz escolhida em Ajustes > Idioma e voz.',
    },
    {
      alvo: 'nota-quiz',
      titulo: 'Teste o que entendeu',
      texto: 'Gera três perguntas a partir deste resumo, sem configurar nada.',
    },
    {
      alvo: 'nota-tutor',
      titulo: 'Falar com o tutor',
      texto:
        'Abre o chat já com este resumo anexado: dá para perguntar direto, sem explicar o ' +
        'assunto de novo.',
    },
    {
      alvo: 'nota-baixar',
      titulo: 'Baixe o resumo',
      texto:
        'Salva a foto da captura no aparelho. Sem foto, exporta a anotação inteira em JSON — ' +
        'com título, resumo, tópicos e palavras-chave.',
    },
    {
      alvo: 'nota-compartilhar',
      titulo: 'Mande para alguém',
      texto:
        'Compartilha o resumo em texto por WhatsApp, e-mail ou o que estiver no aparelho. Sem ' +
        'suporte do navegador, o texto vai para a área de transferência.',
    },
    {
      alvo: 'nota-relacionados',
      titulo: 'Vá mais fundo',
      texto:
        'Estes dois botões buscam o assunto deste resumo no YouTube e na web, sem você digitar ' +
        'nada.',
    },
  ],

  albuns: [
    {
      alvo: 'albuns-lista',
      titulo: 'Um álbum por matéria',
      texto:
        'Os álbuns aparecem sozinhos conforme você fotografa. Toque para abrir e use as setas ' +
        'dos três pontinhos para reordenar. Cada um nasce com uma cor, que você troca ali também.',
    },
    {
      alvo: 'albuns-busca',
      titulo: 'Ache um álbum rápido',
      texto: 'A lupa filtra os álbuns pelo nome enquanto você digita.',
    },
    {
      alvo: 'albuns-criar',
      titulo: 'Crie um álbum',
      texto:
        'O + cria um álbum novo: você só dá o nome. Eles também nascem sozinhos conforme você ' +
        'fotografa.',
    },
    {
      alvo: 'albuns-menu',
      titulo: 'Selecionar, lixeira e ajustes',
      texto:
        'Selecione vários álbuns de uma vez, recupere o que excluiu (fica 30 dias na lixeira) e ' +
        'mude o idioma, a voz e a abertura do app.',
    },
    {
      alvo: 'aba-tutor',
      titulo: 'Tire dúvidas com o tutor',
      texto:
        'Um chat que já conhece os seus resumos: anexe um e pergunte o que não entendeu, por ' +
        'escrito ou falando.',
    },
    {
      alvo: 'aba-estudar',
      titulo: 'A aba de treinar',
      texto: 'Monte simulados juntando várias matérias e acompanhe seu desempenho.',
    },
  ],

  album: [
    {
      alvo: 'album-lista',
      titulo: 'Os resumos desta matéria',
      texto:
        'Toque num resumo para abrir. Segure para entrar na seleção e mover vários de álbum ou ' +
        'excluir de uma vez.',
    },
    {
      alvo: 'album-busca',
      titulo: 'Procure dentro do álbum',
      texto: 'A lupa filtra os resumos pelo título, desde a primeira letra.',
    },
    {
      alvo: 'album-menu',
      titulo: 'Selecionar e excluir',
      texto: 'Aqui você marca vários resumos para mover de álbum ou excluir de uma vez.',
    },
  ],

  tutor: [
    {
      alvo: 'tutor-caixa',
      titulo: 'Pergunte o que quiser',
      texto:
        'Escreva aqui a sua dúvida. O tutor explica passo a passo, em vez de só dar a resposta.',
    },
    {
      alvo: 'tutor-anexo',
      titulo: 'Anexe um resumo',
      texto:
        'O + abre os seus álbuns; toque num álbum e escolha o resumo. A conversa passa a ser ' +
        'sobre ele, e o resumo anexado aparece ao lado do +.',
    },
    {
      alvo: 'tutor-microfone',
      titulo: 'Fale em vez de digitar',
      texto:
        'O microfone escreve o que você fala, palavra por palavra, dentro da caixa. Toque de ' +
        'novo para parar e revise antes de enviar.',
    },
    {
      alvo: 'tutor-enviar',
      titulo: 'Enviar',
      texto:
        'A resposta chega logo abaixo, com três botõezinhos embaixo dela: copiar o texto, ' +
        'compartilhar com alguém, e o alto-falante, que lê em voz alta. A conversa fica salva ' +
        'no aparelho mesmo se você fechar o app.',
    },
    {
      alvo: 'tutor-menu',
      titulo: 'Suas conversas',
      texto:
        'Aqui você começa uma conversa nova ou volta a uma anterior. Na lista, use a lixeira ' +
        'para excluir uma conversa.',
    },
  ],

  estudar: [
    {
      alvo: 'estudar-novo',
      titulo: 'Monte um simulado',
      texto:
        'Escolha os álbuns e os resumos que entram, quantas perguntas, a dificuldade, e se quer ' +
        'cronômetro ou resposta na hora.',
    },
    {
      alvo: 'estudar-numeros',
      titulo: 'Como você está indo',
      texto:
        'Simulados feitos, acerto médio e dias seguidos estudando. Atualiza sozinho a cada ' +
        'simulado entregue.',
    },
    {
      alvo: 'estudar-pendencias',
      titulo: 'Volte ao que você errou',
      texto:
        'Cada assunto errado vira uma pendência. Toque em Rever para abrir o resumo de onde a ' +
        'pergunta saiu. Quando você acertar o assunto num simulado novo, ele sai daqui sozinho.',
    },
    {
      alvo: 'estudar-acoes',
      titulo: 'Os três pontinhos do simulado',
      texto:
        'Refazer usa as perguntas já geradas, em outra ordem, sem gastar nova consulta à IA. ' +
        'Agendar cria um evento no Google Agenda com um link que abre este mesmo simulado. ' +
        'Compartilhar manda o resultado. Excluir joga na lixeira, e ele volta em até 30 dias.',
    },
  ],
}

export default TUTORIAIS
