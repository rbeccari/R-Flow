import { Task, TaskStatus } from '@/lib/types'
import KanbanCard from './KanbanCard'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDrop: (status: TaskStatus) => void
}

export default function KanbanColumn({
  status,
  title,
  tasks,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop(status)
  }

  return (
    <div
      className="flex-shrink-0 w-80 bg-secondary/30 rounded-xl flex flex-col border border-border/40"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-3 border-b flex items-center justify-between shrink-0 bg-secondary/50 rounded-t-xl">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="bg-background text-muted-foreground text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  )
}
