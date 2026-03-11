import { useState, useMemo } from 'react'
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, FileText } from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'

export default function Reports() {
  const { tasks } = useAppStore()
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  const clients = useMemo(() => {
    const clientSet = new Set(tasks.map((t) => t.clientName).filter(Boolean) as string[])
    return Array.from(clientSet)
  }, [tasks])

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
      return matchClient && matchDate && task.status === 'done'
    })
  }, [tasks, selectedClient, date])

  const totalMinutes = filteredTasks.reduce((acc, task) => {
    return acc + task.timeLogs.reduce((sum, log) => sum + log.durationMinutes, 0)
  }, 0)

  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMins = totalMinutes % 60
  const displayTotalTime = `${totalHours}h ${remainingMins}m`

  const handleExport = () => {
    toast({ title: 'Relatório Exportado', description: 'O PDF foi gerado com sucesso.' })
    setTimeout(() => window.print(), 500)
  }

  function formatDuration(minutes: number) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Relatórios de Desempenho</h1>
          <p className="text-muted-foreground text-sm">
            Analise e exporte o tempo investido nos projetos dos clientes.
          </p>
        </div>
        <Button onClick={handleExport}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <Card className="print:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Filtros do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
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
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })} -{' '}
                        {format(date.to, "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
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

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold mb-2">Relatório de Serviços Executados</h1>
        <p className="text-sm text-gray-600">
          Cliente:{' '}
          <span className="font-semibold">
            {selectedClient === 'all' ? 'Todos os Clientes' : selectedClient}
          </span>{' '}
          <br />
          Período de Conclusão: {date?.from ? format(date.from, 'dd/MM/yyyy') : '--'} a{' '}
          {date?.to ? format(date.to, 'dd/MM/yyyy') : '--'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-primary text-primary-foreground print:bg-white print:text-black print:border-gray-200 print:shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 print:text-gray-500 print:opacity-100">
              Tempo Total Investido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{displayTotalTime}</div>
            <p className="text-xs opacity-80 mt-1 print:text-gray-500 print:opacity-100">
              {totalMinutes} minutos no total
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 print:shadow-none print:border-none">
          <CardHeader className="pb-3 print:px-0">
            <CardTitle className="text-base">Tarefas Concluídas ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="print:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarefa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conclusão</TableHead>
                  <TableHead className="text-right">Tempo Logado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Nenhuma tarefa encontrada neste período.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const taskMinutes = task.timeLogs.reduce(
                      (acc, log) => acc + log.durationMinutes,
                      0,
                    )
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell className="capitalize">Concluído</TableCell>
                        <TableCell>
                          {task.completedAt
                            ? format(new Date(task.completedAt), 'dd/MM/yyyy')
                            : '--'}
                        </TableCell>
                        <TableCell className="text-right">{formatDuration(taskMinutes)}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
