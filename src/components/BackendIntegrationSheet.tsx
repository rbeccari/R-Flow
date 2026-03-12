import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Cloud, Lock, ExternalLink, Loader2 } from 'lucide-react'

interface BackendIntegrationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BackendIntegrationSheet({
  open,
  onOpenChange,
}: BackendIntegrationSheetProps) {
  const [url, setUrl] = useState(import.meta.env.VITE_SKIP_CLOUD_URL || 'https://mock.skip.cloud')
  const [waKey, setWaKey] = useState(import.meta.env.VITE_WHATSAPP_API_KEY || '')
  const [webhookSecret, setWebhookSecret] = useState(
    import.meta.env.VITE_WHATSAPP_WEBHOOK_SECRET || '',
  )
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: 'Configurações Salvas',
        description: 'As configurações de integração com Skip Cloud foram atualizadas.',
      })
      onOpenChange(false)
    }, 800)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <SheetTitle>Integração de Backend</SheetTitle>
          </div>
          <SheetDescription>
            Configure a conexão com o Skip Cloud e gerencie as chaves de API da sua aplicação.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSave} className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Cloud className="w-4 h-4 text-muted-foreground" />
              Configurações do Skip Cloud
            </h3>
            <div className="space-y-2">
              <Label htmlFor="skip-url">URL do Skip Cloud</Label>
              <Input
                id="skip-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://seu-projeto.skip.cloud"
                required
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Segredos (Secrets)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Armazene credenciais sensíveis usadas pelos fluxos e workers do seu backend.
            </p>

            <div className="space-y-2">
              <Label htmlFor="wa-key">Chave da API do WhatsApp</Label>
              <Input
                id="wa-key"
                type="password"
                value={waKey}
                onChange={(e) => setWaKey(e.target.value)}
                placeholder="••••••••••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Secret do Webhook</Label>
              <Input
                id="webhook-secret"
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="••••••••••••••••"
              />
            </div>
          </div>

          <SheetFooter className="flex flex-col sm:flex-col gap-3 sm:space-x-0 mt-8 pt-4 border-t border-border/50">
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Configurações'
              )}
            </Button>
            <Button variant="ghost" className="w-full text-xs text-muted-foreground" asChild>
              <a href="https://skip.cloud/docs" target="_blank" rel="noopener noreferrer">
                Documentação do Skip Cloud
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
