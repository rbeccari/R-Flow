import { Task } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Clock } from 'lucide-react'
import { format, isBefore, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  task: Task
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

export default function KanbanCard({ task, onDragStart }: KanbanCardProps) {
  const navigate = useNavigate()
  const isOverdue = task.status !== 'done' && isBefore(parseISO(task.deadline), new Date())

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all border border-border/60 hover:border-primary/30"
    >
      <CardContent className="p-4 space-y-3">
        <h4 className="font-semibold text-sm leading-tight line-clamp-2">{task.title}</h4>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div
            className={cn(
              'flex items-center gap-1',
              isOverdue ? 'text-destructive font-medium' : '',
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            {format(parseISO(task.deadline), 'dd MMM', { locale: ptBR })}
          </div>
          {task.timeLogs.length > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {Math.round(task.timeLogs.reduce((acc, log) => acc + log.durationMinutes, 0) / 60)}h
            </div>
          )}
        </div>

        <div className="pt-2 border-t flex items-center justify-between mt-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
              {task.assignee.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  )
}
