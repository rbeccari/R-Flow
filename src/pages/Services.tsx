import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import NewServiceSheet from '@/components/NewServiceSheet'
import { TaskStatus, TaskPriority } from '@/lib/types'

const STATUS_LABELS: Record<TaskStatus, string> = {
  requested: 'Aberto',
  todo: 'A Fazer',
  in_progress: 'Em Andamento',
  review: 'Revisão',
  done: 'Concluído',
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200',
  medium: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200',
  high: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export default function Services() {
  const { user } = useAuth()
  const { tasks, updateTaskStatus } = useAppStore()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false)

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    if (user?.role !== 'admin') {
      filtered = filtered.filter(
        (t) =>
          t.assignee.toLowerCase().includes(user?.name?.toLowerCase() || '') ||
          t.assignee === 'Não Atribuído',
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status === filterStatus)
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filterPriority)
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [tasks, filterStatus, filterPriority, user])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Gerenciamento de Atendimentos</h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe e gerencie as solicitações de serviço da agência.
          </p>
        </div>
        <Button onClick={() => setIsNewServiceOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Atendimento
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium">Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium">Prioridade</label>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Data Criação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum atendimento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.clientName || '--'}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={PRIORITY_COLORS[task.priority || 'medium']}>
                      {PRIORITY_LABELS[task.priority || 'medium']}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onValueChange={(val) => updateTaskStatus(task.id, val as TaskStatus)}
                    >
                      <SelectTrigger className="h-8 w-[140px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <SelectItem key={val} value={val} className="text-xs">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <NewServiceSheet open={isNewServiceOpen} onOpenChange={setIsNewServiceOpen} />
    </div>
  )
}
