import { Task, Chat } from '@/lib/types'

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Ajuste de Copy - Campanha Verão',
    description:
      'O cliente pediu para alterar a copy do post 3 para focar mais em "exclusividade".',
    status: 'done',
    assignee: 'Mariana Silva',
    clientName: 'Alpha S/A',
    deadline: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    history: ['Tarefa criada a partir do WhatsApp', 'Status alterado para done'],
    timeLogs: [
      {
        id: 'l1',
        taskId: 't1',
        startTime: new Date(Date.now() - 86400000 * 2).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
        durationMinutes: 60,
        summary: 'Ajustes de copy',
      },
      {
        id: 'l2',
        taskId: 't1',
        startTime: new Date(Date.now() - 86400000 * 1).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 1 + 1800000).toISOString(),
        durationMinutes: 30,
        summary: 'Revisão final',
      },
    ],
  },
  {
    id: 't2',
    title: 'Aprovação Key Visual Anual',
    description: 'Precisamos enviar o KV final para o cliente aprovar antes de desdobrar as peças.',
    status: 'done',
    assignee: 'Carlos Design',
    clientName: 'Boutique Beta',
    deadline: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    history: ['Design movido para revisão', 'Status alterado para done'],
    timeLogs: [
      {
        id: 'l3',
        taskId: 't2',
        startTime: new Date(Date.now() - 86400000 * 3).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 3 + 7200000).toISOString(),
        durationMinutes: 120,
        summary: 'Design do KV',
      },
    ],
  },
  {
    id: 't3',
    title: 'Novo Post IG - Lançamento',
    description: 'Criar arte para o lançamento do novo produto xXP.',
    status: 'todo',
    assignee: 'João Social',
    clientName: 'Alpha S/A',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    history: ['Tarefa criada'],
    timeLogs: [],
  },
  {
    id: 't4',
    title: 'Revisão de Textos - Blog',
    description: 'Revisar os 3 artigos para o blog de Abril.',
    status: 'done',
    assignee: 'Mariana Silva',
    clientName: 'Alpha S/A',
    deadline: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    history: ['Tarefa criada', 'Status alterado para done'],
    timeLogs: [
      {
        id: 'l4',
        taskId: 't4',
        startTime: new Date(Date.now() - 86400000 * 6).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 6 + 5400000).toISOString(),
        durationMinutes: 90,
        summary: 'Revisão ortográfica e SEO',
      },
    ],
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
