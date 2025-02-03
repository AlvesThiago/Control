"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UpdateNotebookModalProps {
  notebook: {
    id: number;
    serialNumber: string;
    modelo: string | null;
    setorNote: string | null;
    statusNote: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: number,
    data: { serialNumber: string; modelo: string; setorNote: string; statusNote: string }
  ) => void;
}

export function UpdateNotebookModal({ notebook, isOpen, onClose, onUpdate }: UpdateNotebookModalProps) {
  const [serialNumber, setSerialNumber] = useState(notebook.serialNumber);
  const [modelo, setModelo] = useState(notebook.modelo || "");
  const [setorNote, setSetorNote] = useState(notebook.setorNote || "");
  const [statusNote, setStatusNote] = useState(notebook.statusNote || "");

  const setores = ["Granel", "Recebimento", "Volumoso", "Armazenagem", "Esteira", "Aéreo", "Retrabalho", "Expedição", "IS", "Estoque"];
  const statusOptions = ["Bom", "Validar", "Ruim"];

  useEffect(() => {
    setSerialNumber(notebook.serialNumber);
    setModelo(notebook.modelo || "");
    setSetorNote(notebook.setorNote || "");
    setStatusNote(notebook.statusNote || "");
  }, [notebook]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/notebooks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: notebook.id,
          serialNumber,
          modelo,
          setorNote,
          statusNote,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar notebook");
      }

      onUpdate(notebook.id, { serialNumber, modelo, setorNote, statusNote });
      onClose();
    } catch (error) {
      console.error("Error updating notebook:", error);
      // Adicione um tratamento de erro para o usuário (ex: toast)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Notebook</DialogTitle>
          <DialogDescription>Atualize os dados do notebook aqui. Clique em salvar quando terminar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="serialNumber" className="text-right">
                Número de Série
              </label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="modelo" className="text-right">
                Modelo
              </label>
              <Input id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="setorNote" className="text-right">
                Setor
              </label>
              <Select value={setorNote} onValueChange={setSetorNote}>
                <SelectTrigger id="setorNote" className="col-span-3">
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="statusNote" className="text-right">
                Status
              </label>
              <Select value={statusNote} onValueChange={setStatusNote}>
                <SelectTrigger id="statusNote" className="col-span-3">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar mudanças</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}