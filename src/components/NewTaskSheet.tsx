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
import useAppStore from '@/stores/useAppStore'

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    addTask({
      title,
      description,
      assignee: assignee || 'Não Atribuído',
      clientName: clientName || 'Não Informado',
      deadline: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
      status: 'requested',
    })
    onOpenChange(false)
    setTitle('')
    setDescription('')
    setAssignee('')
    setClientName('')
    setDeadline('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nova Tarefa</SheetTitle>
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
              placeholder="Ex: Alterar logo da campanha"
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
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
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
            Criar Tarefa
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
