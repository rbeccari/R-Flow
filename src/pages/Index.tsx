import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import DashboardCards from './Dashboard/DashboardCards'
import DashboardChart from './Dashboard/DashboardChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useAppStore from '@/stores/useAppStore'
import { useAuth } from '@/hooks/use-auth'
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react'

export default function Index() {
  const { tasks } = useAppStore()
  const { user } = useAuth()

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [tasks])

  const myTasks = useMemo(() => {
    const assigned = tasks.filter((t) =>
      t.assignee.toLowerCase().includes(user?.name?.toLowerCase() || ''),
    )
    if (assigned.length === 0) {
      return tasks.filter((t) => t.status !== 'done').slice(0, 3)
    }
    return assigned
  }, [tasks, user])

  const pendingTasks = myTasks.filter((t) => t.status !== 'done')
  const completedTasks = myTasks.filter((t) => t.status === 'done')

  if (user?.role === 'collaborator') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            Olá, {user?.name || 'Colaborador'}!
          </h1>
          <p className="text-muted-foreground text-sm">
            Aqui está o resumo das suas demandas e tarefas atuais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="shadow-subtle border-none glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Minhas Pendências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingTasks.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-subtle border-none glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Concluídas (Suas Demandas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{completedTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Suas Tarefas Ativas</h2>
          {pendingTasks.length === 0 ? (
            <Card className="border-dashed shadow-none bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
                <p className="text-sm font-medium text-muted-foreground">
                  Nenhuma tarefa pendente no momento.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Você está em dia com suas demandas!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingTasks.map((task) => (
                <Card key={task.id} className="shadow-subtle">
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{task.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        <Clock className="w-3 h-3" />
                        Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="w-full sm:w-auto shrink-0"
                    >
                      <Link to={`/tasks/${task.id}`}>
                        Acessar Tarefa
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Visão Geral - Administrador</h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe o desempenho e as demandas da agência hoje.
        </p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        <Card className="shadow-subtle border-none glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade recente.
              </p>
            )}
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col space-y-1 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm truncate pr-2">{task.title}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {task.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground truncate">{task.assignee}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
