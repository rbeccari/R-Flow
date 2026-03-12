import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { skipCloud } from '@/lib/skip-cloud/client'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'collaborator'
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (name: string, email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  updateProfile: (name: string) => Promise<{ error: any }>
  sendPasswordResetEmail: (email: string) => Promise<{ error: any }>
  resetPassword: (password: string) => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (skipCloud.authStore.isValid && skipCloud.authStore.model) {
      const model = skipCloud.authStore.model
      setUser({
        id: model.id || 'user_1',
        email: model.email || 'user@example.com',
        name: model.name || model.email?.split('@')[0] || 'User',
        role: model.role || (model.email?.includes('admin') ? 'admin' : 'collaborator'),
      })
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const role = email.includes('admin') ? 'admin' : 'collaborator'
      const name = email.split('@')[0]
      const authData = await Promise.resolve({
        record: {
          id: 'user_' + Math.random().toString(36).substr(2, 5),
          email,
          name,
          role,
        },
      })
      skipCloud.authStore.model = authData.record
      skipCloud.authStore.isValid = true
      setUser(authData.record)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const role = email.includes('admin') ? 'admin' : 'collaborator'
      const authData = await Promise.resolve({
        record: {
          id: 'user_' + Math.random().toString(36).substr(2, 5),
          email,
          name,
          role,
        },
      })
      skipCloud.authStore.model = authData.record
      skipCloud.authStore.isValid = true
      setUser(authData.record)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    skipCloud.authStore.model = null
    skipCloud.authStore.isValid = false
    setUser(null)
    return { error: null }
  }

  const updateProfile = async (name: string) => {
    if (user) {
      const updatedUser = { ...user, name }
      skipCloud.authStore.model = updatedUser
      setUser(updatedUser)
      return { error: null }
    }
    return { error: 'No user' }
  }

  const sendPasswordResetEmail = async (email: string) => {
    await new Promise((r) => setTimeout(r, 1000))
    return { error: null }
  }

  const resetPassword = async (password: string) => {
    await new Promise((r) => setTimeout(r, 1000))
    return { error: null }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        sendPasswordResetEmail,
        resetPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
