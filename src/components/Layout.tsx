import { useState, useMemo } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageCircle,
  KanbanSquare,
  Search,
  Plus,
  FileText,
  LogOut,
  User as UserIcon,
  ListTodo,
  Bell,
  CheckCircle2,
  CloudCog,
} from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/use-auth'
import useAppStore from '@/stores/useAppStore'
import NewTaskSheet from './NewTaskSheet'
import BackendIntegrationSheet from './BackendIntegrationSheet'

const MENU_ITEMS = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Atendimentos', url: '/atendimentos', icon: ListTodo },
  { title: 'WhatsApp Inbox', url: '/inbox', icon: MessageCircle },
  { title: 'Quadro de Tarefas', url: '/tasks', icon: KanbanSquare },
  { title: 'Relatórios', url: '/reports', icon: FileText },
]

export default function Layout() {
  const location = useLocation()
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false)
  const [isIntegrationSheetOpen, setIsIntegrationSheetOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { notifications, markNotificationRead } = useAppStore()

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background print:overflow-visible print:h-auto">
        <Sidebar className="border-r border-border/50 print:hidden">
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/50">
            <div className="flex items-center gap-2 font-bold text-primary w-full overflow-hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0 text-base">
                GA
              </div>
              <span className="truncate text-sm">Gestão de Atendimento</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              {MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden print:overflow-visible">
          <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border/50 shrink-0 shadow-sm z-10 print:hidden">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger />
              <div className="relative max-w-md w-full hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas..."
                  className="pl-9 bg-muted/50 border-none rounded-full h-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsIntegrationSheetOpen(true)}
              >
                <CloudCog className="w-5 h-5" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notificações</h4>
                    <Badge variant="secondary">{unreadCount} novas</Badge>
                  </div>
                  <ScrollArea className="h-72">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-center text-muted-foreground">
                        Nenhuma notificação.
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 border-b text-sm flex gap-3 items-start cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                            onClick={() => markNotificationRead(n.id)}
                          >
                            <div className="mt-0.5">
                              {!n.read ? (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className={`${!n.read ? 'font-medium' : 'text-muted-foreground'}`}>
                                {n.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(n.createdAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <Button
                onClick={() => setIsTaskSheetOpen(true)}
                size="sm"
                className="rounded-full shadow-sm ml-2 hidden sm:flex"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova Tarefa
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${user?.id}`}
                    />
                    <AvatarFallback>
                      {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" /> Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6 relative print:overflow-visible print:p-0 print:m-0 print:h-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <NewTaskSheet open={isTaskSheetOpen} onOpenChange={setIsTaskSheetOpen} />
      <BackendIntegrationSheet
        open={isIntegrationSheetOpen}
        onOpenChange={setIsIntegrationSheetOpen}
      />
    </SidebarProvider>
  )
}
