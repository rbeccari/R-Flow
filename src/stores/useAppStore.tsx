import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from 'react'
import { Task, Chat, TimeLog, TaskStatus } from '@/lib/types'
import { MOCK_TASKS } from './mockData'
import { toast } from '@/hooks/use-toast'
import { skipCloud } from '@/lib/skip-cloud/client'

interface AppStoreContextType {
  tasks: Task[]
  chats: Chat[]
  loadingChats: boolean
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'history' | 'timeLogs'>) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  addTimeLog: (taskId: string, log: Omit<TimeLog, 'id'>) => void
  markChatRead: (chatId: string) => void
}

const AppStoreContext = createContext<AppStoreContextType | null>(null)

export default function useAppStore() {
  const context = useContext(AppStoreContext)
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider')
  return context
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [chats, setChats] = useState<Chat[]>([])
  const [loadingChats, setLoadingChats] = useState(true)

  useEffect(() => {
    async function fetchChats() {
      try {
        const [skipChats, skipMessages] = await Promise.all([
          skipCloud.collection('chats').getFullList(),
          skipCloud.collection('messages').getFullList(),
        ])

        const formattedChats: Chat[] = skipChats.map((c: any) => ({
          id: c.id,
          contactName: c.contactName,
          avatar: c.avatar,
          unread: c.unread,
          messages: skipMessages
            .filter((m: any) => m.chat_id === c.id)
            .map((m: any) => ({
              id: m.id,
              text: m.content,
              sender: m.sender_id === 'agent' ? 'agent' : 'client',
              timestamp: m.timestamp,
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        }))

        setChats(formattedChats)
      } catch (err) {
        toast({ title: 'Erro', description: 'Não foi possível carregar as conversas.' })
      } finally {
        setLoadingChats(false)
      }
    }
    fetchChats()
  }, [])

  const addTask = useCallback(
    (newTask: Omit<Task, 'id' | 'createdAt' | 'history' | 'timeLogs'>) => {
      const task: Task = {
        ...newTask,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        history: ['Tarefa criada'],
        timeLogs: [],
      }
      setTasks((prev) => [task, ...prev])
      toast({ title: 'Sucesso', description: 'Tarefa criada com sucesso!' })
    },
    [],
  )

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        const isDoneNow = status === 'done' && t.status !== 'done'
        const isNoLongerDone = status !== 'done' && t.status === 'done'

        return {
          ...t,
          status,
          completedAt: isDoneNow
            ? new Date().toISOString()
            : isNoLongerDone
              ? undefined
              : t.completedAt,
          history: [...t.history, `Status alterado para ${status}`],
        }
      }),
    )
    toast({ title: 'Status Atualizado', description: `A tarefa foi movida.` })
  }, [])

  const addTimeLog = useCallback((taskId: string, log: Omit<TimeLog, 'id'>) => {
    const newLog: TimeLog = { ...log, id: Math.random().toString(36).substr(2, 9) }
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          timeLogs: [...t.timeLogs, newLog],
          history: [...t.history, `Tempo registrado: ${log.durationMinutes} min - ${log.summary}`],
        }
      }),
    )
    toast({ title: 'Tempo Registrado', description: 'Horas salvas com sucesso no projeto.' })
  }, [])

  const markChatRead = useCallback((chatId: string) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)))
  }, [])

  const contextValue = useMemo(
    () => ({
      tasks,
      chats,
      loadingChats,
      addTask,
      updateTaskStatus,
      addTimeLog,
      markChatRead,
    }),
    [tasks, chats, loadingChats, addTask, updateTaskStatus, addTimeLog, markChatRead],
  )

  return <AppStoreContext.Provider value={contextValue}>{children}</AppStoreContext.Provider>
}
