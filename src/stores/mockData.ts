import { Task, Chat } from '@/lib/types'

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Ajuste de Copy - Campanha Verão',
    description:
      'O cliente pediu para alterar a copy do post 3 para focar mais em "exclusividade".',
    status: 'in_progress',
    assignee: 'Mariana Silva',
    deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    createdAt: new Date().toISOString(),
    history: ['Tarefa criada a partir do WhatsApp'],
    timeLogs: [],
  },
  {
    id: 't2',
    title: 'Aprovação Key Visual Anual',
    description: 'Precisamos enviar o KV final para o cliente aprovar antes de desdobrar as peças.',
    status: 'review',
    assignee: 'Carlos Design',
    deadline: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    createdAt: new Date().toISOString(),
    history: ['Design movido para revisão'],
    timeLogs: [],
  },
  {
    id: 't3',
    title: 'Novo Post IG - Lançamento',
    description: 'Criar arte para o lançamento do novo produto xXP.',
    status: 'todo',
    assignee: 'João Social',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    history: ['Tarefa criada'],
    timeLogs: [],
  },
]

export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    contactName: 'Cliente Alpha S/A',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    unread: 2,
    messages: [
      {
        id: 'm1',
        text: 'Oi pessoal, tudo bem?',
        sender: 'client',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'm2',
        text: 'Tudo ótimo! Como podemos ajudar?',
        sender: 'agent',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'm3',
        text: 'Preciso que vocês alterem a arte do post de amanhã. A logo nova não está lá.',
        sender: 'client',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
      },
    ],
  },
  {
    id: 'c2',
    contactName: 'Boutique Beta',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
    unread: 0,
    messages: [
      {
        id: 'm4',
        text: 'Aprovo o orçamento enviado!',
        sender: 'client',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'm5',
        text: 'Perfeito, vamos iniciar a produção.',
        sender: 'agent',
        timestamp: new Date(Date.now() - 86000000).toISOString(),
      },
    ],
  },
]
