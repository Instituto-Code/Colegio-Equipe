"use client";

import React, { useState } from "react";
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

// Interface do usuário
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Exemplo de dados
const initialData: User[] = [
  {
    id: "1",
    name: "Lucas Paulo",
    email: "lucas@example.com",
    role: "Coordenador",
  },
  {
    id: "2",
    name: "Maria Silva",
    email: "maria@example.com",
    role: "Professor",
  },
  { id: "3", name: "João Souza", email: "joao@example.com", role: "Aluno" },
  { id: "3", name: "João Souza", email: "joao@example.com", role: "Aluno" },
  { id: "3", name: "João Souza", email: "joao@example.com", role: "Aluno" },
  { id: "3", name: "João Souza", email: "joao@example.com", role: "Aluno" },
  { id: "3", name: "João Souza", email: "joao@example.com", role: "Aluno" },
];

// Colunas da tabela
const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "email", header: "E-mail" },
  { accessorKey: "role", header: "Cargo" },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant={"outline"} className="text-blue-500">
          Editar
        </Button>
        <Button variant={"outline"} className="text-red-500">
          Excluir
        </Button>
      </div>
    ),
  },
];

export const UserTable: React.FC = () => {
  const [data, setData] = useState<User[]>(initialData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar usuário..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="p-2 border rounded w-full max-w-sm"
      />

      {/* Tabela */}
      <div className="overflow-x-auto hidden md:flex">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tabela para Celulares */}
      <div className="block sm:hidden space-y-2">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="border p-2 rounded">
            <div>
              <strong>Nome:</strong> {row.original.name}
            </div>
            <div>
              <strong>Email:</strong> {row.original.email}
            </div>
            <div>
              <strong>Cargo:</strong> {row.original.role}
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="text-blue-500">
                Editar
              </Button>
              <Button variant="outline" className="text-red-500">
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};
