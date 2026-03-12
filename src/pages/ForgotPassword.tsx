import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const { sendPasswordResetEmail } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: 'Erro',
        description: 'Por favor, informe seu e-mail.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    const { error } = await sendPasswordResetEmail(email)
    setIsSubmitting(false)

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o link. Tente novamente.',
        variant: 'destructive',
      })
    } else {
      setIsSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50 animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mx-auto mb-2 font-bold text-xl shadow-sm">
            AG
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Recuperar Senha</CardTitle>
          <CardDescription>
            {isSent
              ? 'Verifique sua caixa de entrada'
              : 'Digite seu e-mail para receber um link de recuperação'}
          </CardDescription>
        </CardHeader>
        {isSent ? (
          <CardContent className="space-y-4 text-center pb-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-sm text-muted-foreground">
              Enviamos um link de recuperação para o e-mail <strong>{email}</strong>.
            </p>
            <Button className="w-full mt-4" asChild>
              <Link to="/reset-password">Simular Reset de Senha</Link>
            </Button>
            <div className="mt-4">
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Voltar para o Login
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Link'
                )}
              </Button>
              <div className="text-center text-sm">
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Voltar para o Login
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
