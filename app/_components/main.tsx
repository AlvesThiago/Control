'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { db } from "@/utils/db"
import { Historico, Usuarios, Notebooks, AtribuirNote } from "@/utils/schema"
import { eq } from 'drizzle-orm'; // Drizzle ORM eq importado de maneira correta

export function Main() {
  // Definindo os estados para os inputs
  const [idcracha, setIdcracha] = React.useState<string>("")
  const [serialNumber, setSerialNumber] = React.useState<string>("")

  // Função para validar a atribuição e registrar no histórico
  const validaRetirada = async (idcracha: string, serialNumber: string) => {
    try {
      // 1. Verifique se o usuário existe
      const usuario = await db.select().from(Usuarios).where(eq(Usuarios.idcracha, idcracha)).limit(1)

      if (usuario.length === 0) {
        alert('Usuário não encontrado!')
        return
      }

      // 2. Verifique se o notebook existe
      const notebook = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, serialNumber)).limit(1)

      if (notebook.length === 0) {
        alert('Notebook não encontrado!')
        return
      }

      // 3. Verifique se o notebook está atribuído ao usuário pelo nome
      const atribuicao = await db.select().from(AtribuirNote)
        .where(eq(AtribuirNote.notebook, serialNumber))
        .limit(1)

      if (atribuicao.length === 0) {
        alert('Este notebook não está atribuído a este usuário!')
        return
      }

      // Verificar se o nome do usuário atribuído corresponde ao idcracha
      const nomeAtribuido = atribuicao[0]?.nomet1 || ""; // Supondo que o nome esteja na coluna nomet1
      const usuarioCorrespondente = await db.select().from(Usuarios).where(eq(Usuarios.nome, nomeAtribuido)).limit(1)

      if (usuarioCorrespondente.length === 0) {
        alert('Nome do usuário atribuído não corresponde ao crachá!')
        return
      }

      // 4. Se tudo estiver correto, insira no histórico
      await db.insert(Historico).values({
        usuarios: usuario[0].nome, // Pega o nome do primeiro usuário encontrado
        notebook: notebook[0].serialNumber, // Pega o modelo do primeiro notebook encontrado
        tipo: 'Retirada', // Tipo de ação
        createdAt: new Date(), // Data de retirada
      })

      alert('Retirada registrada com sucesso!')

    } catch (error) {
      console.error("Erro ao validar a retirada:", error)
      alert('Ocorreu um erro ao validar a retirada.')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-[url("/Fundo.svg")] bg-cover bg-center'>
      <Card className="w-[800px] flex flex-col justify-center">
        <CardHeader className="mt-10">
          <CardTitle className="text-center text-3xl mb-2">Controle de Notebook</CardTitle>
          <CardDescription className="text-center">Rápido e fácil.</CardDescription>
        </CardHeader>
        <CardContent className="mb-20">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4 ">
              <div className="flex flex-col space-y-1.5 ">
                <Label htmlFor="idcracha" className="font-bold">Crácha</Label>
                <Input
                  id="idcracha"
                  value={idcracha}
                  onChange={(e) => setIdcracha(e.target.value)} // Atualiza o estado do crachá
                  placeholder="Encoste o seu crácha"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="serialNumber" className="font-bold">Notebook</Label>
                <Input
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)} // Atualiza o estado do serialNumber
                  placeholder="Bipe o QRcode"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancelar</Button>
          <Button
            onClick={() => validaRetirada(idcracha, serialNumber)} // Passa os estados diretamente para a função
          >
            Verificar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
