'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/utils/db";
import { Gestores } from "@/utils/schema";
import { useState } from "react";

function GestoresPage() {
    // Estados para os inputs
    const [nome, setNome] = useState<string>("");
    const [setor, setSetor] = useState<string>("");
    const [idCracha, setIdCracha] = useState<string>("");

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const setores = ["Granel", "Recebimento", "Volumoso", "Armazenagem", "Esteira", "Aéreo", "Retrabalho", "Expedição", "IS"]


    // Função para registrar o gestor
    const RegistroGestor = async (gestor: string, setorGestor: string, cracha: string) => {
        try {
            const result = await db.insert(Gestores).values({
                gestor: gestor,
                setorGestor: setorGestor,
                cracha: cracha,
            });
            return result;
        } catch (error) {
            console.error("Erro ao registrar o usuário:", error);
            throw new Error("Falha ao registrar o usuário");
        }
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verifica se todos os campos foram preenchidos
        if (!nome || !setor || !idCracha) {
            setMessage("Todos os campos são obrigatórios");
            setMessageType("error");
            return;
        }

        try {
            await RegistroGestor(nome, setor, idCracha);

            // Mensagem de sucesso
            setMessage("Gestor cadastrado com sucesso!");
            setMessageType("success");

            // Limpar campos após o cadastro
            setNome("");
            setSetor("");
            setIdCracha("");

            // Limpar a mensagem após 3 segundos
            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // Mensagem de erro
            setMessage(`Erro ao cadastrar gestor: ${error.message}`);
            setMessageType("error");

            // Limpar a mensagem após 3 segundos
            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Cadastro de Gestores</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="gestorName">Gestor</Label>
                                <Input
                                    id="gestorName"
                                    placeholder="Nome completo"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="setorName">Setor</Label>
                                <Select value={setor} onValueChange={setSetor}>
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
                            <div className="space-y-2">
                                <Label htmlFor="idCracha">ID Cracha</Label>
                                <Input
                                    type="number"
                                    id="idCracha"
                                    placeholder="Ex: 123321"
                                    value={idCracha}
                                    onChange={(e) => setIdCracha(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="w-full md:w-auto">Cadastrar Usuário</Button>
                        </div>
                    </form>

                    {message && (
                        <div
                            className={`mt-4 text-center p-2 rounded-md ${messageType === "success"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
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

export default GestoresPage;
