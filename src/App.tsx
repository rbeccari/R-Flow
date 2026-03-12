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
import Services from './pages/Services'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'

const App = () => (
  <AuthProvider>
    <AppStoreProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/atendimentos" element={<Services />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
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
