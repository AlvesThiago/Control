import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

    const setores = ["Granel", "Recebimento", "Volumoso", "Armazenagem", "Esteira", "Aéreo", "Retrabalho", "Expedição", "IS"];
    const turnos = ["T1", "T2", "T3"];

    const RegistrodeUsuarios = async () => {
        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, idcracha: idCracha, cpf, setor, gestor, turno }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro desconhecido");
            }

            setMessage("Usuário cadastrado com sucesso!");
            setMessageType("success");
            setNome("");
            setIdCracha("");
            setCpf("");
            setSetor("");
            setGestor("");
            setTurno("");
        } catch (error) {
            setMessage("Erro ao cadastrar usuário: " + (error instanceof Error ? error.message : "Erro desconhecido"));
            setMessageType("error");
        } finally {
            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !idCracha || !cpf || !setor || !gestor || !turno) {
            setMessage("Por favor, preencha todos os campos.");
            setMessageType("error");
            setTimeout(() => {
                setMessage(null);
                setMessageType(null);
            }, 3000);
            return;
        }
        RegistrodeUsuarios();
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
                                <Input id="name" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="Idcracha">ID Crachá</Label>
                                <Input type="number" id="Idcracha" placeholder="Ex: 123455" value={idCracha} onChange={(e) => setIdCracha(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input type="number" id="cpf" placeholder="Ex: 123.123.123.32" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="setor">Setor</Label>
                                <Select value={setor} onValueChange={setSetor}>
                                    <SelectTrigger id="setorNote">
                                        <SelectValue placeholder="Selecione um setor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {setores.map((setor) => (
                                            <SelectItem key={setor} value={setor}>{setor}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gestor">Gestor</Label>
                                <Input id="gestor" placeholder="Digite o nome do seu gestor" value={gestor} onChange={(e) => setGestor(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="turno">Turno</Label>
                                <Select value={turno} onValueChange={setTurno}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um turno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {turnos.map((turnos) => (
                                            <SelectItem key={turnos} value={turnos}>{turnos}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="w-full md:w-auto">Cadastrar Usuário</Button>
                        </div>
                    </form>
                    {message && <div className={`mt-4 text-center p-2 rounded-md ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{message}</div>}
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterUser;