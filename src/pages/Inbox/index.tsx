import React, { useState, useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import ChatList from './ChatList'
import ActiveChat from './ActiveChat'
import NewTaskSheet from '@/components/NewTaskSheet'
import { MessageCircle, AlertTriangle, Loader2 } from 'lucide-react'

class InboxErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center bg-card rounded-xl border shadow-subtle animate-fade-in text-destructive p-6 text-center">
          <AlertTriangle className="w-12 h-12 mb-4 opacity-80" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Ocorreu um erro inesperado</h2>
          <p className="text-muted-foreground mb-6">
            Não foi possível carregar a caixa de entrada.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function InboxContent() {
  const { chats, markChatRead, loadingChats } = useAppStore()
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false)
  const [taskDescriptionText, setTaskDescriptionText] = useState('')

  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id)
    }
  }, [chats, activeChatId])

  const activeChat = chats.find((c) => c.id === activeChatId)

  useEffect(() => {
    if (activeChatId && activeChat && activeChat.unread > 0) {
      markChatRead(activeChatId)
    }
  }, [activeChatId, activeChat, markChatRead])

  const handleCreateTaskClick = (text: string) => {
    setTaskDescriptionText(text)
    setIsTaskSheetOpen(true)
  }

  if (loadingChats) {
    return (
      <div className="h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center bg-card rounded-xl border shadow-subtle animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">Sincronizando com Skip Cloud...</p>
      </div>
    )
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

export default function Inbox() {
  return (
    <InboxErrorBoundary>
      <InboxContent />
    </InboxErrorBoundary>
  )
}
