"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo, useCallback } from "react"
import { UpdateNotebookModal } from "./update-notebook-modal"

export type Notebook = {
  id: number
  serialNumber: string
  modelo: string | null
  setorNote: string | null
  statusNote: string | null
}

async function fetchListNotes(): Promise<Notebook[]> {
  try {
    const response = await fetch("/api/notebooks")
    if (!response.ok) throw new Error("Erro ao buscar dados")
    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export default function DataTableNote() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [data, setData] = useState<Notebook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const fetchTableData = useCallback(async () => {
    setLoading(true)
    try {
      const notebooks = await fetchListNotes()
      setData(notebooks)
      setError(null)
    } catch (error) {
      setError("Erro ao carregar dados.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDelete = useCallback(
    async (id: number) => {
      if (window.confirm("Tem certeza que deseja excluir este notebook?")) {
        try {
          const response = await fetch(`/api/notebooks?id=${id}`, {
            method: "DELETE",
          })
          if (!response.ok) throw new Error("Erro ao excluir notebook")
          await fetchTableData()
        } catch (error) {
          console.error("Error deleting notebook:", error)
          setError("Erro ao excluir o notebook.")
        }
      }
    },
    [fetchTableData],
  )

  const columns = useMemo<ColumnDef<Notebook>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "serialNumber",
        header: "Número de Série",
        cell: ({ row }) => <div className="capitalize">{row.getValue("serialNumber")}</div>,
      },
      {
        accessorKey: "modelo",
        header: "Modelo",
        cell: ({ row }) => <div className="capitalize">{row.getValue("modelo")}</div>,
      },
      {
        accessorKey: "setorNote",
        header: "Setor",
        cell: ({ row }) => <div className="capitalize">{row.getValue("setorNote")}</div>,
      },
      {
        accessorKey: "statusNote",
        header: "Status",
        cell: ({ row }) => <div className="capitalize">{row.getValue("statusNote")}</div>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const notebook = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(notebook.id.toString())}>
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedNotebook(notebook)
                    setIsUpdateModalOpen(true)
                  }}
                >
                  Atualizar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(notebook.id)}>Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [handleDelete],
  )

  const handleUpdate = async (
    id: number,
    updatedData: { serialNumber: string; modelo: string; setorNote: string; statusNote: string },
  ) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/notebooks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updatedData }),
      })
      if (!response.ok) throw new Error("Erro ao atualizar notebook")
      await fetchTableData()
      setIsUpdateModalOpen(false)
      setSelectedNotebook(null)
    } catch (error) {
      console.error("Error updating notebook:", error)
      setError("Erro ao atualizar o notebook.")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchTerm = filterValue.toLowerCase()
      const serialNumber = row.getValue("serialNumber") as string
      const setorNote = row.getValue("setorNote") as string | null

      return serialNumber.toLowerCase().includes(searchTerm) || (setorNote?.toLowerCase() || "").includes(searchTerm)
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
  })

  const uniqueSectors = useMemo(() => Array.from(new Set(data.map((notebook) => notebook.setorNote))), [data])
  const uniqueStatuses = useMemo(() => Array.from(new Set(data.map((notebook) => notebook.statusNote))), [data])

  const filteredRowsCount = table.getFilteredRowModel().rows.length

  const exportToCSV = () => {
    const filteredData = table.getFilteredRowModel().rows.map((row) => row.original)
    const headers = columns
      .filter((column) => column.id !== "select" && column.id !== "actions")
      .map((column) => column.header as string)
    const csvContent = [
      headers.join(","),
      ...filteredData.map((item) =>
        headers.map((header) => JSON.stringify(item[header.toLowerCase() as keyof Notebook] || "")).join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "notebooks_filtrados.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="w-full overflow-auto max-h-[600px]">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md">Atualizando...</div>
        </div>
      )}
      <div className="flex items-center justify-between space-x-4">
        <div>
          <h2 className="font-bold">Listar Equipamento</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold">Total: {filteredRowsCount}</div>
          <Button onClick={exportToCSV} variant="outline" className="bg-blue-400 text-white">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex gap-4 items-center py-4 min-w-full">
          <Input
            placeholder="Pesquisar por Setor ou Número de Série..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Setor <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => table.getColumn("setorNote")?.setFilterValue(null)}>
                Todos os Setores
              </DropdownMenuItem>
              {uniqueSectors.map((sector) => (
                <DropdownMenuItem key={sector} onClick={() => table.getColumn("setorNote")?.setFilterValue(sector)}>
                  {sector}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => table.getColumn("statusNote")?.setFilterValue(null)}>
                Todos os Status
              </DropdownMenuItem>
              {uniqueStatuses.map((status) => (
                <DropdownMenuItem key={status} onClick={() => table.getColumn("statusNote")?.setFilterValue(status)}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedNotebook && (
        <UpdateNotebookModal
          notebook={selectedNotebook}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false)
            setSelectedNotebook(null)
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

