import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/authContext";
import { api_url, useCoordenador } from "@/contexts/coordenadorContext";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AddClass } from "./AddClass";
import { Input } from "@/components/ui/input";
import { AddDataToClass } from "./AddDataToClass";
import { axiosInstance } from "@/api/axiosInstance";

export type Professor = {
  id: string
  nome: string
  matricula: string
  email?: string
};

type Aluno = {
  id: string;
  nome: string;
  matricula: string;
};

export interface ITurma {
  id: string;
  nome: string;
  turno: string;
  anoLetivo: string;
  totalProfessores: number;
  totalAlunos: number;
  professores: Professor[];
  alunos: Aluno[];
}

export const ClassGerence = () => {
  const [data, setData] = useState<ITurma[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedClass, setSelectedClass] = useState<ITurma | null>(null);
  const [openDataToClass, setOpenDataToClass] = useState(false);

  const [reloadClasses, setReloadClasses] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Atualizar o componente filho, que tem os dados das turmas
  const handleUpdateTurma = (updatedTurma: ITurma) => {
    if (!updatedTurma) return;
    setData(prevData =>
      prevData.map(t =>
        t.id === updatedTurma.id ? updatedTurma : t
      )
    );

    setSelectedClass(updatedTurma);
  }

  // Colunas da tabela
  const columns: ColumnDef<ITurma>[] = [
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "turno", header: "Turno" },
    { accessorKey: "totalProfessores", header: "Total de professores" },
    { accessorKey: "totalAlunos", header: "Total de alunos" },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedClass(row.original);
              setOpenDataToClass(true)
            }}
            className="bg-blue-400 hover:bg-blue-500 cursor-pointer"
          >
            Gerenciar
          </Button>
          <Button variant={"outline"} className="text-red-500">
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  const { classes, Turmas, loading} = useCoordenador();

  // Mapeando tabela
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

  // Requisitando os dados
  useEffect(() => {
    Turmas()
  }, [reloadClasses]);

  useEffect(() => {
    const fetch = async () => {
      if (!classes) return;
      setData(classes)
      setLoaded(true)
    }

    fetch();
  }, [classes]);


  return (
    <div className="mt-5 p-10">
      <div className="flex flex-col md:flex-row justify-between">
        <h1 className="text-3xl font-bold mb-3">Gerenciar turmas</h1>
        <AddClass onSucess={() => setReloadClasses(prev => prev + 1)} />
      </div>

      <Input
        type="text"
        placeholder="Buscar Turmas..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="p-2 my-3.5 md:my-0 border rounded w-full max-w-sm"
      />

      <div className="overflow-x-auto hidden p-5 md:flex">
        {!loaded || loading ? (
          <div className="h-100 w-full flex flex-col justify-center items-center">
            <Spinner className="size-8 text-blue-500" />
          </div>
        ) : data.length > 0 ? (
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
        ) : (
          <div>
            <h1>Nenhuma turma encontrada</h1>
          </div>
        )}
      </div>

      {/* Tabela para Celulares */}
      <div className="block sm:hidden space-y-2">
        {!loaded || !loading ? (
          <div className="h-100 w-full flex flex-col justify-center items-center">
            <Spinner className="size-8 text-blue-500" />
          </div>
        ) : data.length > 0 ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="border p-2 rounded">
              <div>
                <strong>Nome:</strong> {row.original.nome}
              </div>
              <div>
                <strong>Turno:</strong> {row.original.turno}
              </div>
              <div>
                <strong>Total de professores:</strong>{" "}
                {row.original.totalProfessores}
              </div>
              <div>
                <strong>Total de Alunos:</strong> {row.original.totalAlunos}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => {
                    setSelectedClass(row.original);
                    setOpenDataToClass(true)
                  }}
                  className="bg-blue-400 hover:bg-blue-500 cursor-pointer"
                >Gerenciar turma</Button>
                <Button variant="outline" className="text-red-500">
                  Excluir
                </Button>
              </div>
            </div>))
        ) : (
          <div>
            <h1>Nenhuma turma encontrada</h1>
          </div>
        )}
      </div>

      {selectedClass && (
        <AddDataToClass
          turma={selectedClass}
          open={openDataToClass}
          onClose={() => setOpenDataToClass(false)}
          onUpdateTurma={handleUpdateTurma}
        />
      )}
    </div>
  );
};
