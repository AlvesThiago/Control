'use client'
import { useState, useEffect } from 'react'
import { PlusCircle, Laptop, User, Trash2, Edit2 } from 'lucide-react'
import { db } from '@/utils/db';
import { AtribuirNote, Notebooks, Usuarios } from '@/utils/schema';
import { eq } from 'drizzle-orm';

type Assignment = {
    id: number;
    notebook: string;
    users: string[];
}

function Atribuir() {
    const [notebook, setNotebook] = useState('')
    const [users, setUsers] = useState(['', '', ''])
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)

    // Buscar as atribuições ao carregar a página
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const result = await db.select().from(AtribuirNote).execute();
                const fetchedAssignments: Assignment[] = result.map((assignment: any) => ({
                    id: assignment.id,
                    notebook: assignment.notebook,
                    users: [assignment.nomet1, assignment.nomet2, assignment.nomet3].filter(Boolean), // Filtra valores não nulos
                }));
                setAssignments(fetchedAssignments);
            } catch (error) {
                console.error('Erro ao carregar as atribuições', error);
            }
        };
        fetchAssignments();
    }, []);

    // Função para atribuir notebook a múltiplos usuários de uma vez
    const atribuicao = async (
        nomes: string[],
        serialNumber: string
    ) => {
        try {
            // Verificar se o notebook já existe
            const notebookExistente = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, serialNumber)).execute();
            if (notebookExistente.length === 0) {
                alert('Notebook não encontrado!');
                return;
            }

            // Verificar se algum usuário já está atribuído ao notebook
            for (let nome of nomes) {
                const usuarioExistente = await db.select().from(Usuarios).where(eq(Usuarios.nome, nome)).execute();
                if (usuarioExistente.length === 0) {
                    alert(`Usuário ${nome} não encontrado!`);
                    return;
                }

                const usuarioComNotebook = await db.select().from(AtribuirNote).where(eq(AtribuirNote.nomet1, nome)).execute();
                if (usuarioComNotebook.length > 0) {
                    alert(`O usuário ${nome} já está atribuído a outro notebook!`);
                    return;
                }
            }

            // Preparando os valores para as colunas nomet1, nomet2, nomet3
            const [nomet1, nomet2, nomet3] = nomes;

            // Inserir uma atribuição única para todos os usuários
            const atribuirResult = await db.insert(AtribuirNote).values({
                notebook: serialNumber,
                nomet1: nomet1 || null,  // Se não houver nome, atribui null
                nomet2: nomet2 || null,  // Se não houver nome, atribui null
                nomet3: nomet3 || null,  // Se não houver nome, atribui null
            }).returning({ id: AtribuirNote.id }).execute();

            if (atribuirResult && atribuirResult.length > 0) {
                alert('Atribuição realizada com sucesso!');
                // Atualizar o estado com a nova atribuição
                setAssignments(prevAssignments => [
                    ...prevAssignments,
                    {
                        id: atribuirResult[0].id,
                        notebook: serialNumber,
                        users: nomes,
                    },
                ]);
            } else {
                throw new Error('Falha ao inserir atribuição');
            }
        } catch (error) {
            console.error('Erro ao realizar atribuição:', error);
            alert('Ocorreu um erro ao realizar a atribuição.');
        }
    }

    // Função para capturar dados do formulário e realizar a atribuição
    const handleAtribuicaoClick = async () => {
        const nome = users.filter(user => user !== '');  // Filtrando os nomes vazios
        const serialNumber = notebook;  // Pegando o serial number do notebook

        // Verificar se pelo menos um nome foi preenchido
        if (nome.length === 0) {
            alert('Por favor, preencha pelo menos o nome de um usuário.');
            return;
        }

        // Realizando a atribuição com os nomes fornecidos
        await atribuicao(nome, serialNumber);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Formulário de Atribuição */}
                    <div className="md:w-1/2 p-8">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Sistema de Atribuição</div>
                        <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Notebook e Usuários</h1>
                        <p className="mt-2 text-gray-500">Atribua até 3 usuários a um notebook.</p>

                        <div className="mt-6">
                            <div className="flex items-center border-b border-indigo-500 py-2">
                                <Laptop className="text-gray-400 mr-2" />
                                <input
                                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                    type="text"
                                    placeholder="Modelo do Notebook"
                                    value={notebook}
                                    onChange={(e) => setNotebook(e.target.value)}
                                />
                            </div>
                        </div>

                        {users.map((user, index) => (
                            <div key={index} className="mt-4">
                                <div className="flex items-center border-b border-indigo-500 py-2">
                                    <User className="text-gray-400 mr-2" />
                                    <input
                                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                        type="text"
                                        placeholder={`Nome do Usuário ${index + 1}`}
                                        value={user}
                                        onChange={(e) => {
                                            const newUsers = [...users];
                                            newUsers[index] = e.target.value;
                                            setUsers(newUsers);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            className="mt-8 flex items-center justify-center w-full bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                            onClick={handleAtribuicaoClick}
                        >
                            <PlusCircle className="mr-2" />
                            Atribuir
                        </button>
                    </div>

                    {/* Lista de Atribuições */}
                    <div className="md:w-1/2 p-8 bg-gray-50 h-screen flex flex-col">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Atribuições</h2>
                        <div className="overflow-y-auto flex-grow">
                            {assignments.length === 0 ? (
                                <p className="text-gray-500 italic">Nenhuma atribuição feita ainda.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {assignments.map((assignment) => (
                                        <li key={assignment.id} className="bg-white p-4 rounded-lg shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{assignment.notebook}</h3>
                                                    <ul className="mt-1">
                                                        {assignment.users.map((user, index) => (
                                                            <li key={index} className="text-gray-600">{user}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            // Lógica de edição (opcional)
                                                        }}
                                                        className="p-1 text-blue-500 hover:text-blue-600"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            // Lógica de exclusão (opcional)
                                                        }}
                                                        className="p-1 text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Atribuir;
