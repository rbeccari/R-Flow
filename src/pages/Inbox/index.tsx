import { useState, useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import ChatList from './ChatList'
import ActiveChat from './ActiveChat'
import NewTaskSheet from '@/components/NewTaskSheet'
import { MessageCircle } from 'lucide-react'

export default function Inbox() {
  const { chats, markChatRead } = useAppStore()
  const [activeChatId, setActiveChatId] = useState<string | null>(
    chats.length > 0 ? chats[0].id : null,
  )
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false)
  const [taskDescriptionText, setTaskDescriptionText] = useState('')

  const activeChat = chats.find((c) => c.id === activeChatId)

  useEffect(() => {
    if (activeChatId) markChatRead(activeChatId)
  }, [activeChatId, markChatRead])

  const handleCreateTaskClick = (text: string) => {
    setTaskDescriptionText(text)
    setIsTaskSheetOpen(true)
  }

  return (
    <div className="h-[calc(100vh-8rem)] w-full flex bg-card rounded-xl overflow-hidden border shadow-subtle animate-fade-in">
      <ChatList chats={chats} activeChatId={activeChatId} onSelectChat={setActiveChatId} />
      {activeChat ? (
        <ActiveChat chat={activeChat} onCreateTask={handleCreateTaskClick} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background/50">
          <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
          <p>Selecione uma conversa para visualizar</p>
        </div>
      )}
      <NewTaskSheet
        open={isTaskSheetOpen}
        onOpenChange={setIsTaskSheetOpen}
        initialDescription={taskDescriptionText}
      />
    </div>
  )
}
