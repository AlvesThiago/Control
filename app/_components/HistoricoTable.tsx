'use client'
import { db } from "@/utils/db"
import { Historico } from "@/utils/schema"
import type React from "react"
import { useState, useEffect } from "react"

interface HistoricoItem {
  nome: string | null
  setor: string | null
  acao: string | null
  data: Date | null
}

async function fetchListHistorico() {
  const result = await db.select({
    id: Historico.id,
    usuarios: Historico.usuarios,
    notebook: Historico.notebook,
    tipo: Historico.tipo,
    createAt: Historico.createdAt
  }).from(Historico).execute()

  return result.map((item) => ({
    nome: item.usuarios || null, 
    setor: item.notebook || null, 
    acao: item.tipo || null, 
    data: item.createAt || null 
  }))
}

const HistoricoTable: React.FC = () => {
  const [historicoData, setHistoricoData] = useState<HistoricoItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchListHistorico()
      setHistoricoData(data)
    }

    loadData()
  }, [])

  const filteredData = historicoData.filter((item) =>
    item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || ""
  )

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleDateString("pt-BR") // Formatar data para o formato brasileiro
  }

  const exportToCSV = () => {
    const header = ["Nome", "Setor", "Ação", "Data"]
    const rows = filteredData.map(item => [
      item.nome ?? "N/A",
      item.setor ?? "N/A",
      item.acao ?? "N/A",
      formatDate(item.data),
    ])

    // Criando o conteúdo CSV
    const csvContent = [
      header.join(","), // Cabeçalho
      ...rows.map(row => row.join(",")), // Linhas de dados
    ].join("\n")

    // Criando um link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "historico.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Histórico</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Exportar para CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Nome</th>
              <th className="px-4 py-2 text-left text-gray-600">Setor</th>
              <th className="px-4 py-2 text-left text-gray-600">Ação</th>
              <th className="px-4 py-2 text-left text-gray-600">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2">{item.nome ?? "N/A"}</td>
                <td className="px-4 py-2">{item.setor ?? "N/A"}</td>
                <td className="px-4 py-2">{item.acao ?? "N/A"}</td>
                <td className="px-4 py-2">{formatDate(item.data)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredData.length === 0 && <p className="text-center text-gray-500 mt-4">Nenhum resultado encontrado.</p>}
    </div>
  )
}

export default HistoricoTable
