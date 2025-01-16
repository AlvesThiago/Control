'use client'
import { useState, useEffect } from 'react'
import { PlusCircle, Laptop, User, Trash2, Edit2 } from 'lucide-react'
import { db } from '@/utils/db';
import { AtribuirNote, Notebooks, Usuarios } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Notification from '../_components/Notification';
import { Button } from '@/components/ui/button';

type Assignment = {
    id: number;
    notebook: string;
    users: string[];
    setor: string;
}

function Atribuir() {
    const [notebook, setNotebook] = useState('')
    const [users, setUsers] = useState(['', '', ''])  // Inicializando com três campos vazios
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Buscar as atribuições ao carregar a página
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const result = await db.select().from(AtribuirNote).execute();
                const fetchedAssignments: Assignment[] = await Promise.all(result.map(async (assignment: any) => {
                    const notebookSetorResult = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, assignment.notebook)).execute();
                    const notebookSetor = notebookSetorResult[0]?.setorNote || 'Desconhecido'; // Valor padrão caso o setor não seja encontrado
                    return {
                        id: assignment.id,
                        notebook: assignment.notebook,
                        users: [assignment.nomet1, assignment.nomet2, assignment.nomet3].filter(Boolean), // Filtra valores não nulos
                        setor: notebookSetor,
                    };
                }));
                setAssignments(fetchedAssignments);
            } catch (error) {
                console.error('Erro ao carregar as atribuições', error);
                setNotification({ message: 'Erro ao carregar as atribuições', type: 'error' });
            }
        };
        fetchAssignments();
    }, []);

    // Função para atribuir notebook a múltiplos usuários de uma vez
    const atribuicao = async (nomes: string[], serialNumber: string) => {
        try {
            const notebookExistente = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, serialNumber)).execute();
            if (notebookExistente.length === 0) {
                setNotification({ message: 'Notebook não encontrado!', type: 'error' });
                return;
            }
            const notebookSetor = notebookExistente[0].setorNote?.trim().toLowerCase();  

            if (!notebookSetor) {
                setNotification({ message: 'O notebook não tem setor definido!', type: 'error' });
                return;
            }

            for (let nome of nomes) {
                const usuarioExistente = await db.select().from(Usuarios).where(eq(Usuarios.nome, nome)).execute();
                if (usuarioExistente.length === 0) {
                    setNotification({ message: `Usuário ${nome} não encontrado!`, type: 'error' });
                    return;
                }

                const usuarioSetor = usuarioExistente[0].setor?.trim().toLowerCase();  
                if (!usuarioSetor) {
                    setNotification({ message: `O usuário ${nome} não tem setor definido!`, type: 'error' });
                    return;
                }

                if (usuarioSetor !== notebookSetor) {
                    setNotification({ message: `O usuário ${nome} não pertence ao setor do notebook!`, type: 'error' });
                    return;
                }

                const usuarioComNotebook = await db.select().from(AtribuirNote).where(eq(AtribuirNote.nomet1, nome)).execute();
                if (usuarioComNotebook.length > 0) {
                    setNotification({ message: `O usuário ${nome} já está atribuído a outro notebook!`, type: 'error' });
                    return;
                }
            }

            const [nomet1, nomet2, nomet3] = nomes;

            const atribuirResult = await db.insert(AtribuirNote).values({
                notebook: serialNumber,
                nomet1: nomet1 || null,
                nomet2: nomet2 || null,
                nomet3: nomet3 || null,
            }).returning({ id: AtribuirNote.id }).execute();

            if (atribuirResult && atribuirResult.length > 0) {
                setNotification({ message: 'Atribuição realizada com sucesso!', type: 'success' });
                setAssignments(prevAssignments => [
                    ...prevAssignments,
                    {
                        id: atribuirResult[0].id,
                        notebook: serialNumber,
                        users: nomes,
                        setor: notebookSetor || 'Desconhecido',
                    },
                ]);
            } else {
                throw new Error('Falha ao inserir atribuição');
            }
        } catch (error) {
            console.error('Erro ao realizar atribuição:', error);
            setNotification({ message: 'Ocorreu um erro ao realizar a atribuição.', type: 'error' });
        }
    }

    // Função para atualizar a atribuição
    const updateAssignment = async () => {
        if (!editingAssignment) return;

        try {
            const [nomet1, nomet2, nomet3] = users;
            
            // Fetch notebook details
            const notebookExistente = await db.select().from(Notebooks).where(eq(Notebooks.serialNumber, editingAssignment.notebook)).execute();
            if (notebookExistente.length === 0) {
                setNotification({ message: 'Notebook não encontrado!', type: 'error' });
                return;
            }
            const notebookSetor = notebookExistente[0].setorNote?.trim().toLowerCase();

            // Validate each user
            for (let nome of [nomet1, nomet2, nomet3].filter(Boolean)) {
                const usuarioExistente = await db.select().from(Usuarios).where(eq(Usuarios.nome, nome)).execute();
                if (usuarioExistente.length === 0) {
                    setNotification({ message: `Usuário ${nome} não encontrado!`, type: 'error' });
                    return;
                }

                const usuarioSetor = usuarioExistente[0].setor?.trim().toLowerCase();
                if (!usuarioSetor) {
                    setNotification({ message: `O usuário ${nome} não tem setor definido!`, type: 'error' });
                    return;
                }

                if (usuarioSetor !== notebookSetor) {
                    setNotification({ message: `O usuário ${nome} não pertence ao setor do notebook!`, type: 'error' });
                    return;
                }
            }

            const updatedAssignment = await db.update(AtribuirNote)
                .set({
                    nomet1: nomet1 || null,
                    nomet2: nomet2 || null,
                    nomet3: nomet3 || null,
                })
                .where(eq(AtribuirNote.id, editingAssignment.id))
                .execute();

            if (updatedAssignment) {
                setNotification({ message: 'Atribuição atualizada com sucesso!', type: 'success' });
                setAssignments(assignments.map(assignment =>
                    assignment.id === editingAssignment.id
                        ? { ...assignment, users: [nomet1, nomet2, nomet3].filter(Boolean) }
                        : assignment
                ));
                setEditingAssignment(null);
            } else {
                setNotification({ message: 'Ocorreu um erro ao atualizar a atribuição.', type: 'error' });
            }
        } catch (error) {
            console.error('Erro ao atualizar atribuição', error);
            setNotification({ message: 'Ocorreu um erro ao atualizar a atribuição.', type: 'error' });
        }
    };

    // Função para excluir a atribuição
    const deleteAssignment = async (id: number) => {
        try {
            console.log("Excluindo atribuição com id:", id);  // Log para verificar o id
            
            // Executa a exclusão
            const result = await db.delete(AtribuirNote) // Especificando explicitamente a tabela
                .where(eq(AtribuirNote.id, id))
                .execute();  // Executando a query de exclusão
        
            console.log("Resultado da exclusão:", result);  // Log para verificar o que foi retornado
            
            // Considera a exclusão bem-sucedida se não houver erro
            setNotification({ message: 'Atribuição excluída com sucesso!', type: 'success' });
            
            // Atualiza o estado removendo a atribuição excluída
            setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment.id !== id));
    
        } catch (error) {
            console.error('Erro ao excluir atribuição', error);
            setNotification({ message: 'Ocorreu um erro ao excluir a atribuição.', type: 'error' });
        }
    }
    

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Formulário de Atribuição */}
                    <div className="md:w-1/2 p-8 border-b border-l border-t rounded-b-xl rounded-t-xl">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Sistema de Atribuição</div>
                        <h1 className="block mt-1 text-2xl leading-tight font-medium text-black">Notebook e Usuários</h1>
                        <p className="mt-2 text-gray-500 text-sm">Atribua até 3 usuários a um notebook.</p>

                        <div className="my-6">
                            <div className="flex items-center border-b border-b-gray-300 py-1">
                                <Laptop className="text-black mr-2" />
                                <input
                                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                    type="text"
                                    placeholder="Serial do Notebook"
                                    value={notebook}
                                    onChange={(e) => setNotebook(e.target.value)}
                                />
                            </div>
                        </div>

                        {editingAssignment ? (
                            <>
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="mt-5">
                                        <div className="flex items-center border-b border-b-gray-300 py-1">
                                            <User className="text-black mr-2" />
                                            <input
                                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                                type="text"
                                                placeholder={`Nome do Usuário T${index + 1}`}
                                                value={users[index] || ''}
                                                onChange={(e) => {
                                                    const newUsers = [...users];
                                                    newUsers[index] = e.target.value;
                                                    setUsers(newUsers);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-8 flex space-x-4">
                                    <button
                                        className="flex-1 bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                                        onClick={updateAssignment}
                                    >
                                        Atualizar
                                    </button>
                                    <button
                                        className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                                        onClick={() => setEditingAssignment(null)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {users.map((user, index) => (
                                    <div key={index} className="mt-5">
                                        <div className="flex items-center border-b border-b-gray-300 py-1">
                                            <User className="text-black mr-2" />
                                            <input
                                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                                type="text"
                                                placeholder={`Nome do Usuário T${index + 1}`}
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
                                <Button
                                    className="mt-8 flex items-center justify-center w-full font-bold"
                                    onClick={() => atribuicao(users.filter(user => user !== ''), notebook)}
                                >
                                    <PlusCircle className="mr-2" />
                                    Atribuir
                                </Button>
                            </>
                        )}
                        {notification && (
                            <Notification message={notification.message} type={notification.type} />
                        )}
                    </div>

                    {/* Lista de Atribuições */}
                    <div className="md:w-1/2 p-8 bg-gray-50 h-screen flex flex-col  border-b border-r border-t rounded-b-xl rounded-t-xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Atribuições</h2>
                        <div className="overflow-y-auto flex-grow">
                            {assignments.length === 0 ? (
                                <p className="text-gray-400 italic text-sm">Nenhuma atribuição feita ainda.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {assignments.map((assignment) => (
                                        <li key={assignment.id} className="bg-white p-4 rounded-lg shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{assignment.notebook} - {assignment.setor}</h3>
                                                    <ul className="mt-1">
                                                        {assignment.users.map((user, index) => (
                                                            <li key={index} className="text-gray-600">{user}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingAssignment(assignment);
                                                            setUsers([...assignment.users, '', '', ''].slice(0, 3)); // Ensure three fields, filled or empty
                                                        }}
                                                        className="p-1 text-blue-500 hover:text-blue-600"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteAssignment(assignment.id)}
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

