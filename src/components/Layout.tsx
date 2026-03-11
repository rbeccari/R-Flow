import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageCircle, KanbanSquare, Search, Plus } from 'lucide-react'
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
import NewTaskSheet from './NewTaskSheet'

const MENU_ITEMS = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'WhatsApp Inbox', url: '/inbox', icon: MessageCircle },
  { title: 'Quadro de Tarefas', url: '/tasks', icon: KanbanSquare },
]

export default function Layout() {
  const location = useLocation()
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/50">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                AG
              </div>
              AgencyFlow
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

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border/50 shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger />
              <div className="relative max-w-md w-full hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas, contatos..."
                  className="pl-9 bg-muted/50 border-none rounded-full h-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsTaskSheetOpen(true)}
                size="sm"
                className="rounded-full shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova Tarefa
              </Button>
              <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=10" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6 relative">
            <Outlet />
          </div>
        </main>
      </div>
      <NewTaskSheet open={isTaskSheetOpen} onOpenChange={setIsTaskSheetOpen} />
    </SidebarProvider>
  )
}
