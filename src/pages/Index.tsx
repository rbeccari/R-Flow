import { useMemo } from 'react'
import DashboardCards from './Dashboard/DashboardCards'
import DashboardChart from './Dashboard/DashboardChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import useAppStore from '@/stores/useAppStore'
import { Badge } from '@/components/ui/badge'

export default function Index() {
  const { tasks } = useAppStore()

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [tasks])

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Visão Geral</h1>
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
