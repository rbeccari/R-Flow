/**
 * Mocked Skip Cloud SDK (PocketBase compatible API)
 */
export class SkipCloudClient {
  private baseUrl: string

  public authStore = {
    model: null as any,
    isValid: false,
    onChange: (callback: () => void) => {
      // Mock observer
    },
  }

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  collection(name: string) {
    return {
      getFullList: async () => {
        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 800))

        if (name === 'chats') {
          return [
            {
              id: 'c1',
              user_id: 'user_1',
              last_message:
                'Preciso que vocês alterem a arte do post de amanhã. A logo nova não está lá.',
              updated_at: new Date(Date.now() - 3000000).toISOString(),
              contactName: 'Cliente Alpha S/A',
              avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
              unread: 2,
            },
            {
              id: 'c2',
              user_id: 'user_1',
              last_message: 'Perfeito, vamos iniciar a produção.',
              updated_at: new Date(Date.now() - 86000000).toISOString(),
              contactName: 'Boutique Beta',
              avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
              unread: 0,
            },
          ]
        }

        if (name === 'messages') {
          return [
            {
              id: 'm1',
              chat_id: 'c1',
              sender_id: 'client',
              content: 'Oi pessoal, tudo bem?',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: 'm2',
              chat_id: 'c1',
              sender_id: 'agent',
              content: 'Tudo ótimo! Como podemos ajudar?',
              timestamp: new Date(Date.now() - 3500000).toISOString(),
            },
            {
              id: 'm3',
              chat_id: 'c1',
              sender_id: 'client',
              content:
                'Preciso que vocês alterem a arte do post de amanhã. A logo nova não está lá.',
              timestamp: new Date(Date.now() - 3000000).toISOString(),
            },
            {
              id: 'm4',
              chat_id: 'c2',
              sender_id: 'client',
              content: 'Aprovo o orçamento enviado!',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: 'm5',
              chat_id: 'c2',
              sender_id: 'agent',
              content: 'Perfeito, vamos iniciar a produção.',
              timestamp: new Date(Date.now() - 86000000).toISOString(),
            },
          ]
        }

        return []
      },
    }
  }
}

export const skipCloud = new SkipCloudClient(
  import.meta.env.VITE_SKIP_CLOUD_URL || 'https://mock.skip.cloud',
)
