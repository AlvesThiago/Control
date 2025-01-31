'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { SquarePen, Trash2 } from 'lucide-react';

interface Assignment {
  id: number;
  notebook: string;
  users: string[];
  setor?: string;
}

export default function Atribuir() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notebook, setNotebook] = useState('');
  const [users, setUsers] = useState<string[]>(['', '', '', '', '', '']);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/atribuir');
        const data = await response.json();
        setAssignments(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Erro ao carregar as atribuições');
      }
    };
    fetchAssignments();
  }, []);

  const handleAssign = async () => {
    try {
      const response = await fetch('/api/atribuir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notebook, users: users.filter(Boolean) }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Atribuição realizada com sucesso!');
        setAssignments([...assignments, { id: data.id, notebook, users: users.filter(Boolean) }]);
      } else {
        toast.error(data.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erro ao realizar atribuição');
    }
  };

  const handleUpdate = async () => {
    if (!editingAssignment) return;

    try {
      const response = await fetch('/api/atribuir', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingAssignment.id, notebook, users: users.filter(Boolean) }),
      });

      if (response.ok) {
        toast.success('Atribuição atualizada com sucesso!');
        setAssignments(assignments.map(a => a.id === editingAssignment.id ? { ...a, notebook, users } : a));
        setEditingAssignment(null);
        setNotebook('');
        setUsers(['', '', '', '', '', '']);
      } else {
        const data = await response.json();
        toast.error(data.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erro ao atualizar atribuição');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/atribuir', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success('Atribuição excluída com sucesso!');
        setAssignments(prev => prev.filter(a => a.id !== id));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erro ao excluir atribuição');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex flex-col md:flex-row gap-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/2">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Controle de Atribuição de Notebooks</h1>
        <div className="space-y-3">
          <Input className="border border-gray-300 p-3 rounded-lg" value={notebook} onChange={(e) => setNotebook(e.target.value)} placeholder="Número de Série do Notebook" />
          {users.map((user, index) => (
            <Input key={index} className="border border-gray-300 p-3 rounded-lg" value={user} onChange={(e) => {
              const newUsers = [...users];
              newUsers[index] = e.target.value;
              setUsers(newUsers);
            }} placeholder={`Usuário ${index + 1}`} />
          ))}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition" onClick={editingAssignment ? handleUpdate : handleAssign}>{editingAssignment ? 'Atualizar' : 'Atribuir'}</Button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/2">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Atribuições Atuais</h2>
        <Input className="border border-gray-300 p-3 rounded-lg mb-4" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por setor" />
        <div className="max-h-[700px] overflow-y-auto">
          <ul className="space-y-4">
            {assignments.filter(a => !search || a.setor?.toLowerCase().includes(search.toLowerCase())).map((a) => (
              <li key={a.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center font-medium text-gray-700 mb-2">
                  <span>{a.notebook}</span>
                  {a.setor && <span className="text-gray-500">({a.setor})</span>}
                </div>
                <ul className="pl-4 list-none">
                  {a.users.map((user, index) => (
                    <li key={index} className="text-gray-700">{user}</li>
                  ))}
                </ul>
                <div className="flex justify-end gap-2 mt-2">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition" onClick={() => {
                    setEditingAssignment(a);
                    setNotebook(a.notebook);
                    setUsers([...a.users, '', '', '', '', '', ''].slice(0, 6));
                  }}><SquarePen /> </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition" onClick={() => handleDelete(a.id)}><Trash2 /></Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}