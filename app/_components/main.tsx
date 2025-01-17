'use client'

import * as React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { checkNotebookStatus, updateNotebookStatus } from "@/utils/notebookStatus"
import Notification from "./Notification"

export function Main() {
  const [idcracha, setIdcracha] = React.useState<string>("")
  const [serialNumber, setSerialNumber] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)
  const [notification, setNotification] = React.useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null)

  const handleAction = async () => {
    setLoading(true)
    setNotification(null)
    try {
      const { usuario, notebook, isCheckedOut } = await checkNotebookStatus(idcracha, serialNumber)
      
      const novaAcao = isCheckedOut ? 'Devolução' : 'Retirada'
      await updateNotebookStatus(usuario.nome, notebook.serialNumber, !isCheckedOut)
      
      setNotification({
        id: Date.now(),
        message: `${novaAcao} registrada com sucesso para o usuário ${usuario.nome} e notebook ${notebook.serialNumber}!`,
        type: 'success'
      })
      
      // Limpar os campos após a ação bem-sucedida
      setIdcracha("")
      setSerialNumber("")
    } catch (error) {
      if (error instanceof Error) {
        setNotification({
          id: Date.now(),
          message: error.message,
          type: 'error'
        })
      } else {
        setNotification({
          id: Date.now(),
          message: 'Ocorreu um erro ao processar a ação.',
          type: 'error'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const clearNotification = () => setNotification(null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification()
      }, 5000) // 5 segundos

      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div className='flex items-center justify-center min-h-screen bg-[url("/Fundo.svg")] bg-cover bg-center'>
      <Card className="w-[800px] flex flex-col justify-center">
        <CardHeader className="mt-8 mb-12">
          <div className="flex justify-center items-center mb-1">
            <Image src={'/LogoIS.png'} alt='Logo' width={80} height={40} />
          </div>
          <CardTitle className="text-center text-3xl ">Controle de Notebook</CardTitle>
        </CardHeader>
        <CardContent className="mb-20">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4 ">
              <div className="flex flex-col space-y-1.5 ">
                <Label htmlFor="idcracha" className="font-bold">Crachá</Label>
                <Input
                  id="idcracha"
                  value={idcracha}
                  onChange={(e) => setIdcracha(e.target.value)} 
                  placeholder="Encoste o seu crachá"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="serialNumber" className="font-bold">Notebook</Label>
                <Input
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)} 
                  placeholder="Bipe o QRcode"
                />
              </div>
            </div>
          </form>
          {notification && (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setIdcracha("")
            setSerialNumber("")
          }}>
            Cancelar
          </Button>
          <Button
            onClick={handleAction}
            disabled={loading || !idcracha || !serialNumber}
          >
            {loading ? "Processando..." : "Verificar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

