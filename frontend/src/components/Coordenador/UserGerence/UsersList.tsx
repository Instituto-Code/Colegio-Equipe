import React, { useEffect, useState } from "react";
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
} from "@tanstack/react-table";

import { flexRender } from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api_url } from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";
import { Tools } from "./Tools";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmationBox } from "@/components/Box/ConfirmationBox";

// Interface do usuário
interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

export const UserTable: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  //  O estado de erro deve ser inicializado como null ou string vazia
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [openDelete, setOpenDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const { token } = useAuth();

  // Buscando usuários no banco
  useEffect(() => {
    const fetchUsers = async () => {
      // Limpa qualquer erro anterior e inicia o loading
      setError(null);
      setLoading(true);

      try {
        const res = await fetch(`${api_url}/api/coordenador/list-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Falha ao buscar usuários. Status: ${res.status}`);
        }

        const json = await res.json();

        setData(json.users || []);

      } catch (e: unknown) {
        // Captura e armazena a mensagem de erro para exibição
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Ocorreu um erro desconhecido ao carregar os dados.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Colunas da tabela
  const columns = (
    onDelete: (id: string) => void
  ): ColumnDef<User>[] => [
      { accessorKey: "nome", header: "Nome" },
      { accessorKey: "email", header: "E-mail" },
      { accessorKey: "role", header: "Cargo" },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tools nome={row.original.nome} role={row.original.role} id={row.original.id} />
            <Button
              variant={"outline"}
              className="text-red-500"
              onClick={() => {
                setOpenDelete(true)
                setUserToDelete(row.original.id)
              }}
            >
              Excluir
            </Button>
          </div>
        ),
      },
    ];

  //Deletar um usuário por id
  const deleteUser = async (userId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${api_url}/api/coordenador/delete/${userId}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error("Não foi possível excluir o usuário")
        throw new Error(data[0].errors)
      }

      toast.success("Usuário deletado com sucesso!")
      setData((prev) => prev.filter((user) => user.id !== userId))
    }
    catch (error) {
      console.error(error)
      setError("Não foi possível excluir o usuário")
    }
    finally {
      setLoading(false)
      setError(null)
    }
  }

  const table = useReactTable({
    data,
    columns: columns(deleteUser),
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col space-y-4 mt-10 p-5">

      <div className="flex justify-between items-center px-5 gap-4">
        <div className="flex flex-col w-full">
          <div className="flex flex-col md:flex-row justify-between">
            <h1 className="text-3xl font-bold mb-3">Gerenciar Usuários</h1>
          </div>
          {/* Input de Busca */}
          <Input
            type="text"
            placeholder="Buscar usuário..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2 bg-gray-200"
          />
        </div>
      </div>

      {/* Exibir mensagem de erro */}
      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded mx-5 border border-red-300">
          {error}
        </div>
      )}

      {/* Tabela */}
      <div>
        {/* Tabela para Desktop (hidden p-5 md:flex) */}
        <div className="overflow-x-auto hidden p-5 md:flex">
          {loading ? (
            <div className="h-40 w-full flex flex-col justify-center items-center">
              <Spinner className="size-8 text-blue-500" />
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="w-full text-center py-10 text-gray-500 border rounded">
              Nenhum usuário encontrado.
            </div>
          ) : (
            <Table className="min-w-[600px] sm:min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        <button
                          className="flex items-center gap-1"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          {{
                            asc: "🔼",
                            desc: "🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </button>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="min-w-[100px] sm:min-w-[120px]"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Tabela para Celulares */}
        <div className="block md:hidden space-y-2 px-5">
          {loading ? (
            <div className="h-20 w-full flex flex-col justify-center items-center">
              <Spinner className="size-6 text-blue-500" />
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="w-full text-center py-5 text-gray-500 border rounded">
              Nenhum usuário encontrado.
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} className="border p-2 rounded">
                <div>
                  <strong>Nome:</strong> {row.original.nome}
                </div>
                <div>
                  <strong>Email:</strong> {row.original.email}
                </div>
                <div>
                  <strong>Cargo:</strong> {row.original.role}
                </div>
                <div className="flex gap-2 mt-2">
                  <Tools nome={row.original.nome} role={row.original.role} id={row.original.id} />
                  <Button
                    variant={"outline"}
                    className="text-red-500"
                    onClick={() => {
                      setOpenDelete(true)
                      setUserToDelete(row.original.id)
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginação */}
        {table.getRowModel().rows.length > 0 && !loading && (
          <div className="flex items-center mb-4 justify-between mt-2 px-5">

            {/* Botões de próximo e anterior */}
            <div className="flex flex-col md:flex-row gap-1.5">
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
                variant={"outline"}
              >
                Anterior
              </Button>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
                variant={"outline"}
              >

                Próximo
              </Button>
            </div>

            {/* Em qual página está */}
            <span>
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>

            {/* Selecionar a quantidade de usuário por página */}
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border p-1 rounded"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} por página
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Box para confirmar exclusão */}
        <ConfirmationBox
          openDialog={openDelete}
          onOpenDialogChange={setOpenDelete}
          registerToDelete={userToDelete}
          deleteRegister={deleteUser}
          setRegisterToDelete={setUserToDelete}
        />

      </div>
    </div>
  );
};