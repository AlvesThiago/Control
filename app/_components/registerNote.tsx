"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function RegisterNote() {
  const [serialNumber, setSerialNumber] = useState("");
  const [modelo, setModelo] = useState("");
  const [setorNote, setSetorNote] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const setores = ["Granel", "Recebimento", "Volumoso", "Armazenagem", "Esteira", "Aéreo", "Retrabalho", "Expedição", "IS", "Estoque"];
  const statusOptions = ["Bom", "Validar", "Ruim"];
  const modeloEquipamento = ["I3", "I5", "I7", "Impressora"];

  const RegistroNotebook = async (serialNumber: string, modelo: string, setorNote: string, statusNote: string) => {
    try {
      const response = await fetch("/api/notebooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serialNumber, modelo, setorNote, statusNote }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar notebook.");
      }

      return data;
    } catch (error) {
      console.error("Erro ao registrar o notebook:", error);
      if (error instanceof Error) {
        throw new Error(error.message || "Erro ao cadastrar notebook.");
      } else {
        throw new Error("Erro ao cadastrar notebook.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serialNumber || !modelo || !setorNote || !statusNote) {
      setMessage("Por favor, preencha todos os campos.");
      setMessageType("error");
      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 3000);
      return;
    }

    RegistroNotebook(serialNumber, modelo, setorNote, statusNote)
      .then(() => {
        setMessage("Notebook cadastrado com sucesso!");
        setMessageType("success");

        setSerialNumber("");
        setModelo("");
        setSetorNote("");
        setStatusNote("");

        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 3000);
      })
      .catch((error) => {
        setMessage("Erro ao cadastrar notebook: " + error.message);
        setMessageType("error");

        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 3000);
      });
  };

  // Verifica se o formulário está completo
  const isFormValid = serialNumber && modelo && setorNote && statusNote;

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl mb-6">Cadastro de Equipamentos</CardTitle>
        </CardHeader>
        <CardContent className="mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="numbernote">Serial Number</Label>
                <Input
                  id="numbernote"
                  placeholder="S/N"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="modeloNote">Modelo do Equipamento</Label>
                <Select value={modelo} onValueChange={setModelo}>
                  <SelectTrigger id="modeloNote">
                    <SelectValue placeholder="Selecione o equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {modeloEquipamento.map((modeloEquipamento) => (
                      <SelectItem key={modeloEquipamento} value={modeloEquipamento}>
                        {modeloEquipamento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="setorNote">Setor</Label>
                <Select value={setorNote} onValueChange={setSetorNote}>
                  <SelectTrigger id="setorNote">
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="statusNote">Status</Label>
                <Select value={statusNote} onValueChange={setStatusNote}>
                  <SelectTrigger id="statusNote">
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
            <div className="flex justify-end mt-8">
              <Button type="submit" disabled={!isFormValid}>Cadastrar Notebook</Button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-4 text-center p-2 rounded-md ${
                messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterNote;
