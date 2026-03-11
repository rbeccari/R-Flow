import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, AlertCircle, MessageCircle } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'
import { isBefore, parseISO } from 'date-fns'

export default function DashboardCards() {
  const { tasks, chats } = useAppStore()

  const activeTasks = tasks.filter((t) => t.status !== 'done').length
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && isBefore(parseISO(t.deadline), new Date()),
  ).length
  const pendingChats = chats.reduce((acc, chat) => acc + chat.unread, 0)

  const totalMinutes = tasks.reduce((acc, task) => {
    return acc + task.timeLogs.reduce((logAcc, log) => logAcc + log.durationMinutes, 0)
  }, 0)
  const hoursLogged = (totalMinutes / 60).toFixed(1)

  const cards = [
    { title: 'Tarefas Ativas', value: activeTasks, icon: Activity, color: 'text-blue-500' },
    { title: 'Prazos Vencidos', value: overdueTasks, icon: AlertCircle, color: 'text-red-500' },
    {
      title: 'WhatsApps Pendentes',
      value: pendingChats,
      icon: MessageCircle,
      color: 'text-amber-500',
    },
    { title: 'Horas (Hoje)', value: `${hoursLogged}h`, icon: Clock, color: 'text-green-500' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="shadow-subtle border-none glass-panel animate-fade-in-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
