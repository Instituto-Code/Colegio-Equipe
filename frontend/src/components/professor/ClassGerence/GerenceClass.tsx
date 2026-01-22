import { useEffect, useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { axiosInstance } from "@/api/axiosInstance"
import { Button } from "@/components/ui/button"
import { Gerence } from "./Gerence"
import { useTeach, type ITurma } from "@/contexts/teacherContext"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"

export const GerenciarTurmas = () => {
    const [data, setData] = useState<ITurma[]>([])
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedTurma, setSelectedTurma] = useState<ITurma | null>(null)
    const [openData, setOpenData] = useState(false)

    const { loading, setLoading } = useTeach()

    // Carega as turmas do professor
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get("/api/teacher/list-classes")

                const dataJson = await res.data

                setData(dataJson)
            }
            catch (error) {
                console.error(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchClasses()
    }, [])


    // Colunas da tabela
    const columns: ColumnDef<ITurma>[] = [
        { accessorKey: "nome", header: "Nome" },
        { accessorKey: "turno", header: "Turno" },
        { accessorKey: "anoLetivo", header: "Ano Letivo" },
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            variant={"outline"}
                            className="cursor-pointer"
                            onClick={() => {
                                setOpenData(true)
                                setSelectedTurma(row.original)
                            }}
                        >Visualizar</Button>
                    </div>
                )
            },
        },
    ]

    // Mapeando a tabela
    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    })


    return (
        <div className="m-5 p-6 md:p-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">Minhas turmas</h1>
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
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow accessKey={headerGroup.id}>
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
                            <strong>Turno:</strong> {row.original.turno}
                        </div>
                        <div>
                            <strong>Ano Letivo:</strong>{" "}
                            {row.original.anoLetivo}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button
                                variant={"outline"}
                                onClick={() => {
                                    setOpenData(true)
                                    setSelectedTurma(row.original)
                                }}
                                className="cursor-pointer"
                            >Visualizar</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Gerence
                open={openData}
                onClose={() => { setOpenData(false) }}
                turma={selectedTurma}
            />




        </div>
    )
}
