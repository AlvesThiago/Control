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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

// Função para buscar os dados do banco de dados
async function fetchListUsuarios(): Promise<Employee[]> {
  const response = await fetch("/api/usuarios")
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  return response.json()
}

// Função para excluir um usuário
async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`/api/usuarios/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete user")
  }
}

export type Employee = {
  id: number
  name: string
  cpf: string
  sector: string
  gestor: string
}

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [data, setData] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null)

  const fetchTableData = async () => {
    setLoading(true)
    try {
      const result = await fetchListUsuarios()
      setData(result)
    } catch (error) {
      setError("Erro ao carregar dados.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTableData()
  }, [])

  const columns: ColumnDef<Employee>[] = [
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
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "cpf",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            CPF
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("cpf")}</div>,
    },
    {
      accessorKey: "sector",
      header: () => <div className="text-right">Setor</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("sector")}</div>
      },
    },
    {
      accessorKey: "gestor",
      header: "Gestor",
      cell: ({ row }) => <div className="capitalize">{row.getValue("gestor")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.id.toString())}>
                Copiar ID do Usuário
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>Atualizar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(employee.id)}>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

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

  const handleUpdate = async (id: number, updatedData: Partial<Employee>) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) throw new Error("Erro ao atualizar usuário")

      await fetchTableData()
      setEditingEmployee(null)

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o usuário.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUser(id)
        await fetchTableData()
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso.",
        })
      } catch (error) {
        console.error("Error deleting user:", error)
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o usuário.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="w-full">
      {loading ? (
        <div>Carregando...</div> // Exibe a mensagem de carregamento enquanto a tabela está carregando
      ) : (
        <>
          {error && <div className="text-red-500">{error}</div>} {/* Exibe erro, se houver */}
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por nome..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Colunas <ChevronDown className="ml-2 h-4 w-4" />
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
                      Sem resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} linha(s)
              selecionada(s).
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
      {editingEmployee && (
        <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdate(editingEmployee.id, {
                  name: editingEmployee.name,
                  cpf: editingEmployee.cpf,
                  sector: editingEmployee.sector, // Certifique-se de enviar o setor
                  gestor: editingEmployee.gestor,
                })
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cpf" className="text-right">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    value={editingEmployee.cpf}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, cpf: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sector" className="text-right">
                    Setor
                  </Label>
                  <select
                    id="sector"
                    value={editingEmployee.sector}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, sector: e.target.value })}
                    className="col-span-3 p-2 border rounded-md"
                  >
                    <option value="Granel">Granel</option>
                    <option value="Recebimento">Recebimento</option>
                    <option value="Volumoso">Volumoso</option>
                    <option value="Armazenagem">Armazenagem</option>
                    <option value="Esteira">Esteira</option>
                    <option value="Aéreo">Aéreo</option>
                    <option value="Retrabalho">Retrabalho</option>
                    <option value="Expedição">Expedição</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gestor" className="text-right">
                    Gestor
                  </Label>
                  <Input
                    id="gestor"
                    value={editingEmployee.gestor}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, gestor: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar alterações</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
