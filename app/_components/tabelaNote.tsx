"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/utils/db"
import { Notebooks } from "@/utils/schema"
import { useState } from "react"
import { UpdateNotebookModal } from "./update-notebook-modal"
import { eq } from "drizzle-orm"

// Definir o tipo para os dados do banco de dados (Notebooks)
export type Notebook = {
  id: number
  serialNumber: string
  modelo: string | null
  setorNote: string | null
  statusNote: string | null
}

// Função para buscar os dados do banco de dados
async function fetchListNotes(): Promise<Notebook[]> {
  const result = await db
    .select({
      id: Notebooks.id,
      serialNumber: Notebooks.serialNumber,
      modelo: Notebooks.modelo,
      setorNote: Notebooks.setorNote,
      statusNote: Notebooks.statusNote,
    })
    .from(Notebooks)
    .execute()

  return result
}

export default function DataTableNote() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Estado para armazenar os dados da tabela
  const [data, setData] = React.useState<Notebook[]>([])
  const [loading, setLoading] = React.useState(true) // Estado de carregamento
  const [error, setError] = React.useState<string | null>(null) // Estado de erro
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)

  const columns = React.useMemo<ColumnDef<Notebook>[]>(
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
                <DropdownMenuItem onClick={() => setSelectedNotebook(notebook)}>Atualizar</DropdownMenuItem>
                <DropdownMenuItem>Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [setSelectedNotebook],
  )

  const handleUpdate = async (
    id: number,
    updatedData: { serialNumber: string; modelo: string; setorNote: string; statusNote: string },
  ) => {
    try {
      await db.update(Notebooks).set(updatedData).where(eq(Notebooks.id, id)).execute()

      // After successful update, refresh the data
      const updatedNotebooks = await fetchListNotes()
      setData(updatedNotebooks)
    } catch (error) {
      console.error("Error updating notebook:", error)
      // You might want to show an error message to the user here
    }
  }

  // Fetch os dados do banco quando o componente é montado
  React.useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true)
      try {
        const result = await fetchListNotes() // Chama a função que busca os dados
        setData(result) // Atualiza o estado com os dados recebidos
      } catch (error) {
        setError("Erro ao carregar dados.") // Caso ocorra erro
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchTableData()
  }, []) // Este efeito roda uma vez quando o componente for montado

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full overflow-auto max-h-[400px]">
      <div className="flex items-center py-4 min-w-full">
        <Input
          placeholder="Pesquisar..."
          value={(table.getColumn("serialNumber")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("serialNumber")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
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
          isOpen={!!selectedNotebook}
          onClose={() => setSelectedNotebook(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

