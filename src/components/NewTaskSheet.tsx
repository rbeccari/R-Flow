import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useAppStore from '@/stores/useAppStore'
import { TaskPriority } from '@/lib/types'

interface NewTaskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDescription?: string
}

export default function NewTaskSheet({
  open,
  onOpenChange,
  initialDescription = '',
}: NewTaskSheetProps) {
  const { addTask } = useAppStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState(initialDescription)
  const [assignee, setAssignee] = useState('')
  const [clientName, setClientName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    addTask({
      title,
      description,
      assignee: assignee || 'Não Atribuído',
      clientName: clientName || 'Não Informado',
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
      status: 'requested',
    })
    onOpenChange(false)
    setTitle('')
    setDescription('')
    setAssignee('')
    setClientName('')
    setDeadline('')
    setPriority('medium')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nova Tarefa / Serviço</SheetTitle>
          <SheetDescription>Crie uma nova demanda para a equipe.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Alterar logo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientName">Cliente</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: Alpha S/A"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Responsável</Label>
            <Input
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Ex: Maria"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo Final</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Criar Solicitação
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
