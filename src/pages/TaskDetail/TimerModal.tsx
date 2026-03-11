import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface TimerModalProps {
  open: boolean
  durationSeconds: number
  onSave: (summary: string) => void
  onCancel: () => void
}

export default function TimerModal({ open, durationSeconds, onSave, onCancel }: TimerModalProps) {
  const [summary, setSummary] = useState('')
  const minutes = Math.ceil(durationSeconds / 60)

  useEffect(() => {
    if (!open) setSummary('')
  }, [open])

  const handleSave = () => {
    if (!summary.trim()) return
    onSave(summary)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Tempo</DialogTitle>
          <DialogDescription>
            Você trabalhou por aprox. <strong className="text-foreground">{minutes} minutos</strong>
            . Descreva o que foi feito:
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ex: Realizei o recorte das imagens principais..."
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!summary.trim()}>
            Salvar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
