import { axiosInstance } from "@/api/axiosInstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Aluno, useTeach, type ITurma } from "@/contexts/teacherContext"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { useEffect, useEffectEvent, useState } from "react"
import { Tools } from "./Tools"
import { Spinner } from "@/components/ui/spinner"

export const GerenciarAlunos = () => {
    // Estado para armazenar os alunos
    const [data, setData] = useState<Aluno[]>([])
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    // Contexto do professor
    const { loading, setLoading } = useTeach()

    // Efeito para buscar as turmas e alunos do professor ao montar o componente
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get("/api/teacher/list-classes")

                const dataJson = res.data

                // Setando alunos do professor
                dataJson.map((turma: ITurma) => {
                    setData((prev) => {
                        const newAlunos = turma.alunos.filter((
                            aluno => !prev.some(a => a.id === aluno.id)
                        ))

                        return [...prev, ...newAlunos]
                    })
                })
            }
            catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchClasses()
    }, [])

    // Definindo colunas da tabela
    const columns: ColumnDef<Aluno>[] = [
        { accessorKey: "nome", header: "Nome" },
        { accessorKey: "matricula", header: "Matrícula" },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-2">
                        <Tools id={row.original.id} nome={row.original.nome} matricula={row.original.matricula} />
                    </div>
                )
            },
        },
    ]

    // Configurando a tabela
    const table = useReactTable({
        data,
        columns,
        state:{
            globalFilter,
            sorting
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    })


    return (
        <div className="m-5 p-6 md:p-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">Meus Alunos</h1>
            </div>

            <Input
                type="text"
                placeholder="Buscar Alunos..."
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
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            }
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow accessKey={row.id}>
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

            {/* Tabela para celulares */}
            <div className="block sm:hidden space-y-2">
                {loading ? (
                    <div className="h-100 w-full flex flex-col justify-center items-center">
                        <Spinner className="size-8 text-blue-500" />
                    </div>
                ) : table.getRowModel().rows.map((row) => (
                    <div key={row.id} className="border p-2 rounded">
                        <div>
                            <strong>Nome:</strong> {row.original.nome}
                        </div>
                        <div>
                            <strong>Matrícula:</strong> {row.original.matricula}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <div className="flex gap-2">
                                <Tools id={row.original.id} nome={row.original.nome} matricula={row.original.matricula} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
