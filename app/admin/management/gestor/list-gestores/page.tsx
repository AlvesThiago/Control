"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit2, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GestoresList {
  id: number
  gestor: string
  setorGestor: string
}

const setores = [
  "Granel",
  "Recebimento",
  "Volumoso",
  "Armazenagem",
  "Esteira",
  "Aéreo",
  "Retrabalho",
  "Expedição",
  "IS",
]

export default function ListGestores() {
  const [gestores, setGestores] = useState<GestoresList[]>([])
  const [editando, setEditando] = useState<number | null>(null)

  useEffect(() => {
    fetchListGestores()
  }, [])

  async function fetchListGestores() {
    try {
      const response = await fetch("/api/gestores")
      if (!response.ok) {
        throw new Error("Failed to fetch gestores")
      }
      const result = await response.json()
      setGestores(result)
    } catch (error) {
      console.error("Error fetching gestores:", error)
    }
  }

  const iniciarEdicao = (id: number) => {
    setEditando(id)
  }

  const salvarEdicao = async (id: number, novoSetor: string) => {
    try {
      const response = await fetch("/api/gestores", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, setorGestor: novoSetor }),
      })
      if (!response.ok) {
        throw new Error("Failed to update gestor")
      }
      setGestores(gestores.map((gestor) => (gestor.id === id ? { ...gestor, setorGestor: novoSetor } : gestor)))
      setEditando(null)
    } catch (error) {
      console.error("Error updating gestor:", error)
    }
  }

  const cancelarEdicao = () => {
    setEditando(null)
  }

  const excluirGestor = async (id: number) => {
    try {
      const response = await fetch("/api/gestores", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error("Failed to delete gestor")
      }
      setGestores(gestores.filter((gestor) => gestor.id !== id))
    } catch (error) {
      console.error("Error deleting gestor:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tabela de Gestores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gestores.map((gestor) => (
                <LinhaEditavel
                  key={gestor.id}
                  gestor={gestor}
                  editando={editando === gestor.id}
                  onIniciarEdicao={iniciarEdicao}
                  onSalvarEdicao={salvarEdicao}
                  onCancelarEdicao={cancelarEdicao}
                  onExcluir={excluirGestor}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface LinhaEditavelProps {
  gestor: GestoresList
  editando: boolean
  onIniciarEdicao: (id: number) => void
  onSalvarEdicao: (id: number, novoSetor: string) => void
  onCancelarEdicao: () => void
  onExcluir: (id: number) => void
}

function LinhaEditavel({
  gestor,
  editando,
  onIniciarEdicao,
  onSalvarEdicao,
  onCancelarEdicao,
  onExcluir,
}: LinhaEditavelProps) {
  const [novoSetor, setNovoSetor] = useState(gestor.setorGestor)

  if (editando) {
    return (
      <TableRow>
        <TableCell>{gestor.gestor}</TableCell>
        <TableCell>
          <Select value={novoSetor} onValueChange={setNovoSetor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um setor" />
            </SelectTrigger>
            <SelectContent>
              {setores.map((setor) => (
                <SelectItem key={setor} value={setor}>
                  {setor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="text-right">
          <Button onClick={() => onSalvarEdicao(gestor.id, novoSetor)} size="icon" className="mr-2">
            <Save className="h-4 w-4" />
          </Button>
          <Button onClick={onCancelarEdicao} variant="outline" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>{gestor.gestor}</TableCell>
      <TableCell>{gestor.setorGestor}</TableCell>
      <TableCell className="text-right">
        <Button onClick={() => onIniciarEdicao(gestor.id)} variant="ghost" size="icon" className="mr-2">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Tem certeza que deseja excluir {gestor.gestor}?</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => onExcluir(gestor.id)} variant="destructive">
                Excluir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}

