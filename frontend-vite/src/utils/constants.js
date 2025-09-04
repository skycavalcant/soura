import { Send, Heart, FileHeart, Calendar, HeartCrack, Clock} from 'lucide-react';

export const QUESTIONS = [
  {
    id: 'user_info',
    type: 'user_info',
    icon: Send,
    title: 'Informações',
    question: 'Para onde enviar sua Soura?'
  },
  {
    id: 'life_meaning',
    type: 'text',
    icon: Heart,
    title: 'Sobre você',
    question: 'Qual parte de si você gostaria que os outros enxergassem primeiro?'
  },
  {
    id: 'emotional_state',
    type: 'multiple',
    icon: FileHeart,
    title: 'Personalidade',
    question: 'O que acha que mais faz parte da sua personalidade das opções abaixo?',
    options: [
      'Explosivo',
      'Expansivo', 
      'Paciente',
      'Resiliente',
      'Reflexivo',
      'Determinado'
    ]
  },
  {
    id: 'current_priorities',
    type: 'text',
    icon: HeartCrack,
    title: 'Sobre algo que doeu',
    question: 'Se pudesse apagar uma única frase que já ouviu, qual seria?'
  },
  {
    id: 'future_vision',
    type: 'text',
    icon: Send,
    title: 'E se...?',
    question: 'Qual é a decisão que você nunca tomou, mas ainda pensa como seria se tivesse tomado?'
  },
  {
    id: 'future_message',
    type: 'text',
    icon: Heart,
    title: 'Alguém especial',
    question: 'Qual é a pergunta que você gostaria de fazer a alguém que já se foi?'
  },
    {
    id: 'future_message_2',
    type: 'text',
    icon: Send,
    title: 'Promessas...',
    question: 'Qual foi a promessa que você gostaria que alguém tivesse cumprido com você?'
  },
    {
    id: 'future_message_3',
    type: 'text',
    icon: FileHeart,
    title: 'Sobre medo...',
    question: 'Qual é o medo que você já aprendeu a conviver, mas nunca superou?'
  },
    {
    id: 'future_message_4',
    type: 'text',
    icon: FileHeart,
    title: 'Medo...',
    question: 'Qual parte de si você tem medo que as pessoas interpretem errado?'
  },
    {
    id: 'future_message_5',
    type: 'text',
    icon: Heart,
    title: 'Sobre sonhos...',
    question: 'Qual é o sonho que você mantém em segredo porque ele parece “grande demais”?'
  },
      {
    id: 'future_message_6',
    type: 'text',
    icon: Send,
    title: 'Revisitar...',
    question: 'Se sua vida tivesse uma pausa, o que você gostaria de revisitar com calma?'
  },
      {
    id: 'future_message_7',
    type: 'text',
    icon: HeartCrack,
    title: 'Sobre momentos dificeis...',
    question: 'O que você gostaria que tivesse sido dito a você no momento em que mais precisou?'
  },
        {
    id: 'future_message_8',
    type: 'text',
    icon: Send,
    title: 'Algo para você...',
    question: 'Diga algo para que seu eu do futuro, que você acha que talvez precise ouvir, ou ler -seja gentil'
  },
  {
    id: 'delivery_date',
    type: 'date',
    icon: Clock,
    title: 'Entrega',
    question: 'Quando receber sua Soura?'
  }
];