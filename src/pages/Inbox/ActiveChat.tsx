import { Chat } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { KanbanSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActiveChatProps {
  chat: Chat
  onCreateTask: (text: string) => void
}

export default function ActiveChat({ chat, onCreateTask }: ActiveChatProps) {
  const handleCreateTask = () => {
    const textToTask = chat.messages
      .map((m) => `${m.sender === 'client' ? 'Cliente' : 'Agência'}: ${m.text}`)
      .join('\n\n')
    onCreateTask(textToTask)
  }

  return (
    <div className="flex-1 flex flex-col bg-background/50 h-full">
      <div className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.contactName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{chat.contactName}</span>
        </div>
        <Button size="sm" onClick={handleCreateTask} className="shadow-sm">
          <KanbanSquare className="w-4 h-4 mr-2" />
          Transformar em Tarefa
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex w-full', msg.sender === 'agent' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-2xl p-3 text-sm shadow-sm',
                msg.sender === 'agent'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-card text-card-foreground border rounded-tl-sm',
              )}
            >
              {msg.text}
              <div
                className={cn(
                  'text-[10px] mt-1 text-right',
                  msg.sender === 'agent' ? 'text-primary-foreground/70' : 'text-muted-foreground',
                )}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-card border-t shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            className="flex-1 h-10 rounded-full border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            disabled
          />
          <Button className="rounded-full shrink-0" disabled>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}
