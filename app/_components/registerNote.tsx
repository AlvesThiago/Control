import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/utils/db";
import { Notebooks } from "@/utils/schema";
import { useState } from "react";

function RegisterNote(){

    const [serialNumber, setSerialNumber] = useState("");
    const [modelo, setModelo] = useState("");
    const [setorNote, setSetorNote] = useState("");
    const [message, setMessage] = useState<string | null>(null); 
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const RegistroNotebook = async (serialNumber: string, modelo: string, setorNote: string) => {
        try{
            const result = await db.insert(Notebooks).values({
                serialNumber: serialNumber || '',
                modelo: modelo || '',
                setorNote: setorNote || ''
            });
            return result;
        }catch (error){
            console.error("Erro ao registrar o notebook:", error);
            throw new Error("Falha ao registrar notebook");
        }
    }

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();

        RegistroNotebook(serialNumber, modelo, setorNote)
        .then(() => {
            // Atualiza a mensagem de sucesso
            setMessage("Usuário cadastrado com sucesso!");
            setMessageType("success");

            setSerialNumber("");
            setModelo("");
            setSetorNote("");


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
    }

    return(
        <div className="mx-auto h-[480px] w-full max-w-3xl rounded-xl bg-muted/50">
                <div className="flex flex-col items-center justify-center p-6">
                    <Card className="w-[580px] ">
                        <CardHeader>
                            <CardTitle className="text-2xl mb-6">Cadastro</CardTitle>
                        </CardHeader>
                        <CardContent className="mb-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="numbernote">Notebook</Label>
                                        <Input 
                                        id="numbernote" 
                                        placeholder="S/N"
                                        value={serialNumber}
                                        onChange={(e) => setSerialNumber(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="modeloNote">Modelo</Label>
                                        <Input 
                                        id="modeloNote" 
                                        placeholder="Ex: I3, I5, I7 ..."
                                        value={modelo}
                                        onChange={(e) => setModelo(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="setorNote">Setor</Label>
                                        <Input 
                                        id="setorNote" 
                                        placeholder="Ex: Granel"
                                        value={setorNote}
                                        onChange={(e) => setSetorNote(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-10">
                                    <Button>Cadastrar Notebook</Button>
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
    )
}

export default RegisterNote;