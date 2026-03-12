import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppStoreProvider } from '@/stores/useAppStore'
import { AuthProvider } from '@/hooks/use-auth'

import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Index from './pages/Index'
import Inbox from './pages/Inbox'
import Tasks from './pages/Tasks'
import TaskDetail from './pages/TaskDetail'
import Reports from './pages/Reports'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

const App = () => (
  <AuthProvider>
    <AppStoreProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppStoreProvider>
  </AuthProvider>
)

export default App
