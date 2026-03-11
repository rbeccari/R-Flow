import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { skipCloud } from '@/lib/skip-cloud/client'

interface AuthContextType {
  user: any | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (skipCloud.authStore.isValid) {
      setUser(skipCloud.authStore.model)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Mocked sign in process
      const authData = await Promise.resolve({ record: { id: 'user_1', email } })
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

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
