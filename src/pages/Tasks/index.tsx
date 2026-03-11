import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import KanbanColumn from './KanbanColumn'
import { TaskStatus } from '@/lib/types'

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'requested', title: 'Solicitado' },
  { status: 'todo', title: 'A Fazer' },
  { status: 'in_progress', title: 'Em Progresso' },
  { status: 'review', title: 'Aprovação' },
  { status: 'done', title: 'Concluído' },
]

export default function Tasks() {
  const { tasks, updateTaskStatus } = useAppStore()
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
    // Hack to make standard HTML5 DnD visual better
    if (e.dataTransfer.setDragImage) {
      setTimeout(() => {
        const target = e.target as HTMLElement
        target.classList.add('opacity-50')
      }, 0)
    }
  }

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, status)
      setDraggedTaskId(null)
    }
    document.querySelectorAll('.opacity-50').forEach((el) => el.classList.remove('opacity-50'))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Quadro de Tarefas</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie o fluxo de trabalho arrastando os cards.
        </p>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 h-full snap-x">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.status)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  )
}
