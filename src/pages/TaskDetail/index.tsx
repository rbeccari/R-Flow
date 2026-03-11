import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Square, Clock } from 'lucide-react'
import TimerModal from './TimerModal'
import { format, parseISO } from 'date-fns'

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, addTimeLog } = useAppStore()
  const task = tasks.find((t) => t.id === id)

  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  if (!task)
    return <div className="p-8 text-center text-muted-foreground">Tarefa não encontrada.</div>

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0')
    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const handleStopTimer = () => {
    setIsTimerRunning(false)
    setIsModalOpen(true)
  }

  const handleSaveLog = (summary: string) => {
    addTimeLog(task.id, {
      taskId: task.id,
      startTime: new Date(Date.now() - timerSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.ceil(timerSeconds / 60)),
      summary,
    })
    setTimerSeconds(0)
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')} className="mb-2 -ml-3">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Quadro
      </Button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge>{task.status.replace('_', ' ').toUpperCase()}</Badge>
              <span className="text-sm text-muted-foreground">
                Prazo: {format(parseISO(task.deadline), 'dd/MM/yyyy')}
              </span>
            </div>
            <h1 className="text-3xl font-bold">{task.title}</h1>
            <p className="text-muted-foreground mt-1">Responsável: {task.assignee}</p>
          </div>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm">{task.description}</CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
                {task.history.map((h, i) => (
                  <li key={i} className="pl-8 relative">
                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-secondary border rounded-full flex items-center justify-center -translate-x-1/2" />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-80 shrink-0 space-y-6 sticky top-0">
          <Card
            className={`shadow-subtle overflow-hidden border-2 transition-colors ${isTimerRunning ? 'border-primary shadow-primary/20' : ''}`}
          >
            <div
              className={`p-6 flex flex-col items-center justify-center text-center ${isTimerRunning ? 'bg-primary/5' : 'bg-card'}`}
            >
              <div className="text-4xl font-mono tabular-nums font-bold tracking-tight mb-4 text-primary">
                {formatTime(timerSeconds)}
              </div>
              {!isTimerRunning ? (
                <Button
                  size="lg"
                  className="w-full rounded-full gap-2"
                  onClick={() => setIsTimerRunning(true)}
                >
                  <Play className="w-5 h-5 fill-current" /> Iniciar Trabalho
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full rounded-full gap-2 animate-pulse"
                  onClick={handleStopTimer}
                >
                  <Square className="w-5 h-5 fill-current" /> Parar & Registrar
                </Button>
              )}
            </div>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Tempos Registrados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {task.timeLogs.length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhum registro.</p>
              )}
              {task.timeLogs.map((log) => (
                <div key={log.id} className="text-xs border-b pb-2 last:border-0 last:pb-0">
                  <div className="font-semibold text-foreground">{log.durationMinutes} min</div>
                  <div className="text-muted-foreground mt-0.5 line-clamp-2">{log.summary}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <TimerModal
        open={isModalOpen}
        durationSeconds={timerSeconds}
        onSave={handleSaveLog}
        onCancel={() => {
          setIsModalOpen(false)
          setTimerSeconds(0)
          setIsTimerRunning(false)
        }}
      />
    </div>
  )
}
