import { Chat } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ChatListProps {
  chats: Chat[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
}

export default function ChatList({ chats, activeChatId, onSelectChat }: ChatListProps) {
  return (
    <div className="w-full md:w-80 border-r bg-card flex flex-col h-full shrink-0">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Conversas</h2>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-accent',
              activeChatId === chat.id ? 'bg-accent' : '',
            )}
          >
            <Avatar className="w-10 h-10 shrink-0">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback>{chat.contactName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-medium text-sm truncate">{chat.contactName}</span>
                {chat.unread > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {chat.messages[chat.messages.length - 1]?.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
