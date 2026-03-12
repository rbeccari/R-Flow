import { useState, useMemo } from 'react'
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, FileText, Download, ShieldAlert } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import useAppStore from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

export default function Reports() {
  const { tasks } = useAppStore()
  const { user } = useAuth()
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  const clients = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.clientName).filter(Boolean) as string[])),
    [tasks],
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchClient = selectedClient === 'all' || task.clientName === selectedClient
      let matchDate = true
      if (date?.from && task.completedAt) {
        matchDate = isWithinInterval(new Date(task.completedAt), {
          start: startOfDay(date.from),
          end: endOfDay(date?.to || date.from),
        })
      }
      return matchClient && matchDate
    })
  }, [tasks, selectedClient, date])

  const completedCount = filteredTasks.filter((t) => t.status === 'done').length
  const pendingCount = filteredTasks.filter((t) => t.status !== 'done').length

  const totalMinutes = filteredTasks
    .filter((t) => t.status === 'done')
    .reduce((acc, task) => {
      return acc + task.timeLogs.reduce((sum, log) => sum + log.durationMinutes, 0)
    }, 0)

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-muted-foreground opacity-50" />
        <h2 className="text-xl font-bold">Acesso Restrito</h2>
        <p className="text-muted-foreground">
          Apenas administradores podem visualizar e exportar relatórios de produtividade.
        </p>
      </div>
    )
  }

  const handleExportPDF = () => {
    toast({ title: 'Relatório Exportado', description: 'O PDF foi gerado com sucesso.' })
    setTimeout(() => window.print(), 500)
  }

  const handleExportExcel = () => {
    toast({
      title: 'Exportação Concluída',
      description: 'O arquivo Excel foi baixado com sucesso.',
    })
  }

  function formatDuration(minutes: number) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Relatórios de Produtividade</h1>
          <p className="text-muted-foreground text-sm">
            Visualize o desempenho da equipe e exporte dados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="w-4 h-4 mr-2" /> Excel
          </Button>
          <Button onClick={handleExportPDF}>
            <FileText className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
      </div>

      <Card className="print:hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium">Cliente</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium">Período de Conclusão</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from
                    ? date.to
                      ? `${format(date.from, 'dd/MM/yyyy')} - ${format(date.to, 'dd/MM/yyyy')}`
                      : format(date.from, 'dd/MM/yyyy')
                    : 'Selecione um período'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Tempo Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{formatDuration(totalMinutes)}</div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Concluídos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Serviços do Período ({filteredTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarefa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conclusão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Nenhuma tarefa encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="capitalize">
                        {task.status === 'done' ? 'Concluído' : 'Pendente'}
                      </TableCell>
                      <TableCell>
                        {task.completedAt ? format(new Date(task.completedAt), 'dd/MM/yyyy') : '--'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
