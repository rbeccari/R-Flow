export type TaskStatus = 'requested' | 'todo' | 'in_progress' | 'review' | 'done'

export interface TimeLog {
  id: string
  taskId: string
  startTime: string
  endTime: string
  durationMinutes: number
  summary: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee: string
  deadline: string
  createdAt: string
  history: string[]
  timeLogs: TimeLog[]
}

export interface Message {
  id: string
  text: string
  sender: 'client' | 'agent'
  timestamp: string
}

export interface Chat {
  id: string
  contactName: string
  avatar: string
  messages: Message[]
  unread: number
}
