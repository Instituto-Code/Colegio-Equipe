"use client";

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
import { Trash } from "lucide-react";

// Interface do usuário
interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

// Colunas da tabela
const columns: ColumnDef<User>[] = [
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "email", header: "E-mail" },
  { accessorKey: "role", header: "Cargo" },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Tools nome={row.original.nome} role={row.original.role} />
        <Button variant={"outline"} className="text-red-500">
          Excluir
        </Button>
      </div>
    ),
  },
];

export const UserTable: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { token } = useAuth();

  // Buscando usuários no banco
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${api_url}/api/coordenador/list-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();

        setData(json.users);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const table = useReactTable({
    data,
    columns,
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
    <div className="flex flex-col space-y-4">

      <div className="flex justify-between my-5">
        {/* Busca */}
      <input
        type="text"
        placeholder="Buscar usuário..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="flex p-2 border rounded w-1/2 mx-5 bg-gray-200"
      />

      <button className="flex text-red-500 items-center gap-1 mr-5">
            <Trash />
            Excluir tudo
          </button>


      </div>

      

      {/* Tabela */}
      <div className="overflow-x-auto hidden p-5 md:flex">
        {loading ? (
          <div className="h-100 w-full flex flex-col justify-center items-center">
            <Spinner className="size-8 text-blue-500" />
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
                          asc: " 🔼",
                          desc: " 🔽",
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
      <div className="block sm:hidden space-y-2">
        {table.getRowModel().rows.map((row) => (
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
              <Tools nome={row.original.nome} role={row.original.role} />
              <Button variant="outline" className="text-red-500">
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
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
    </div>
  );
};
