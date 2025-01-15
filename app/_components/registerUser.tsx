import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
                // Atualiza a mensagem de sucesso
                setMessage("Usuário cadastrado com sucesso!");
                setMessageType("success");

                // Limpa os campos do formulário
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
                // Atualiza a mensagem de erro
                setMessage("Erro ao cadastrar usuário: " + error.message);
                setMessageType("error");

                setTimeout(() => {
                    setMessage(null);
                    setMessageType(null);
                }, 3000);
            });
    };

    return (
        <div className="mx-auto h-[700px] w-full max-w-3xl rounded-xl bg-muted/50">
            <div className="flex flex-col items-center justify-center p-6">
                <Card className="w-[580px]">
                    <CardHeader>
                        <CardTitle className="text-2xl mb-6">Cadastro</CardTitle>
                    </CardHeader>
                    <CardContent className="mb-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Colaborador</Label>
                                    <Input
                                        id="name"
                                        placeholder="Nome completo"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="Idcracha">ID Crachá</Label>
                                    <Input
                                        type="number"
                                        id="Idcracha"
                                        placeholder="Ex: 123455"
                                        value={idCracha}
                                        onChange={(e) => setIdCracha(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="cpf">CPF</Label>
                                    <Input
                                        type="number"
                                        id="cpf"
                                        placeholder="Ex: 123.123.123.32"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="setor">Setor</Label>
                                    <Input
                                        id="setor"
                                        placeholder="Digite o nome do setor"
                                        value={setor}
                                        onChange={(e) => setSetor(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="gestor">Gestor</Label>
                                    <Input
                                        id="gestor"
                                        placeholder="Digite o nome do seu gestor"
                                        value={gestor}
                                        onChange={(e) => setGestor(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="turno">Turno</Label>
                                    <Input
                                        id="turno"
                                        placeholder="Digite o seu turno"
                                        value={turno}
                                        onChange={(e) => setTurno(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-10">
                                <Button type="submit">Cadastrar Usuário</Button>
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
        </div>
    );
}

export default RegisterUser;
