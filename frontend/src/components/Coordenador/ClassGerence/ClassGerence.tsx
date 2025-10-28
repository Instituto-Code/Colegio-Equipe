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

type Professor = {
  id: string;
  nome: string;
  matricula: string;
};

type Aluno = {
  id: string;
  nome: string;
  cargaHoraria: number;
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
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ITurma | null>(null);
  const [openDataToClass, setOpenDataToClass] = useState(false);

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

  const { token } = useAuth();
  const { registerClasses } = useCoordenador();

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
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${api_url}/api/coordenador/list-turmas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataJson = await res.json();

        setData(dataJson);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [registerClasses]);

  return (
    <div className="mt-5 p-10">
      <div className="flex flex-col md:flex-row justify-between">
        <h1 className="text-3xl font-bold">Gerenciar turmas</h1>
        <AddClass />
      </div>

      <Input
        type="text"
        placeholder="Buscar Turmas..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="p-2 my-3.5 md:my-0 border rounded w-full max-w-sm"
      />

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
              <Button variant="outline" className="text-red-500">
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
        
        {selectedClass && (
          <AddDataToClass
            turma={selectedClass}
            open={openDataToClass}
            onClose={() => setOpenDataToClass(false)}
          />
        )}
    </div>
  );
};
