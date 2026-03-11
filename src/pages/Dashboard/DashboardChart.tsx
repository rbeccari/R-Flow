import { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import useAppStore from '@/stores/useAppStore'

export default function DashboardChart() {
  const { tasks } = useAppStore()

  const data = useMemo(() => {
    const counts = { requested: 0, todo: 0, in_progress: 0, review: 0, done: 0 }
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) counts[t.status]++
    })
    return [
      { name: 'Solicitado', value: counts.requested },
      { name: 'A Fazer', value: counts.todo },
      { name: 'Em Progresso', value: counts.in_progress },
      { name: 'Em Revisão', value: counts.review },
      { name: 'Concluído', value: counts.done },
    ]
  }, [tasks])

  const config = {
    value: { label: 'Tarefas', color: 'hsl(var(--primary))' },
  }

  return (
    <Card className="shadow-subtle border-none glass-panel">
      <CardHeader>
        <CardTitle>Volume de Trabalho</CardTitle>
        <CardDescription>Quantidade de tarefas por status atual</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
              />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
