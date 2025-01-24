import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/utils/db";
import { Usuarios } from "@/utils/schema";
import { useState } from "react";

function RegisterUser() {
    const [nome, setNome] = useState("");
    const [idCracha, setIdCracha] = useState("");
    const [cpf, setCpf] = useState("");
    const [setor, setSetor] = useState("");
    const [gestor, setGestor] = useState("");
    const [turno, setTurno] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const setores = ["Granel", "Recebimento", "Volumoso", "Armazenagem", "Esteira", "Aéreo", "Retrabalho", "Expedição", "IS"]


    const RegistrodeUsuarios = async (nome: string, idcracha: string, cpf: string, setor: string, gestor: string, turno: string) => {
        try {
            const result = await db.insert(Usuarios).values({
                nome: nome || '',
                idcracha: idcracha || '',
                cpf: cpf || '',
                setor: setor || '',
                gestor: gestor || '',
                turno: turno || '',
            });
            return result;
        } catch (error) {
            console.error("Erro ao registrar o usuário:", error);
            throw new Error("Falha ao registrar usuário");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        RegistrodeUsuarios(nome, idCracha, cpf, setor, gestor, turno)
            .then(() => {
                setMessage("Usuário cadastrado com sucesso!");
                setMessageType("success");
                setNome("");
                setIdCracha("");
                setCpf("");
                setSetor("");
                setGestor("");
                setTurno("");
                setTimeout(() => {
                    setMessage(null);
                    setMessageType(null);
                }, 3000);
            })
            .catch((error) => {
                setMessage("Erro ao cadastrar usuário: " + error.message);
                setMessageType("error");
                setTimeout(() => {
                    setMessage(null);
                    setMessageType(null);
                }, 3000);
            });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Cadastro de Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Colaborador</Label>
                                <Input
                                    id="name"
                                    placeholder="Nome completo"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="Idcracha">ID Crachá</Label>
                                <Input
                                    type="number"
                                    id="Idcracha"
                                    placeholder="Ex: 123455"
                                    value={idCracha}
                                    onChange={(e) => setIdCracha(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input
                                    type="number"
                                    id="cpf"
                                    placeholder="Ex: 123.123.123.32"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="setor">Setor</Label>
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
                                <Label htmlFor="gestor">Gestor</Label>
                                <Input
                                    id="gestor"
                                    placeholder="Digite o nome do seu gestor"
                                    value={gestor}
                                    onChange={(e) => setGestor(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="turno">Turno</Label>
                                <Input
                                    id="turno"
                                    placeholder="Digite o seu turno"
                                    value={turno}
                                    onChange={(e) => setTurno(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="w-full md:w-auto">Cadastrar Usuário</Button>
                        </div>
                    </form>

                    {message && (
                        <div
                            className={`mt-4 text-center p-2 rounded-md ${
                                messageType === "success"
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

export default RegisterUser;

