import { axiosInstance } from "@/api/axiosInstance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type Aluno, useTeach, type ITurma } from "@/contexts/teacherContext"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { useEffect, useEffectEvent, useState } from "react"
import { Tools } from "./Tools"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { set } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const GerenciarAlunos = () => {
    // Estado para armazenar os alunos
    const [data, setData] = useState<Aluno[]>([])
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [turmas, setTurmas] = useState<ITurma[]>([])
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>("")

    // Contexto do professor
    const { loading, setLoading } = useTeach()

    // Efeito para buscar as turmas e alunos do professor ao montar o componente
    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true)
            try {
                const res = await axiosInstance.get("/api/teacher/list-classes")

                const dataJson = res.data

                setTurmas(dataJson)
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

    // Efeito para atualizar a lista de alunos quando a turma selecionada mudar
    useEffect(() => {
        if (!turmaSelecionada) {
            setData([])
            setLoading(true)
            return
        }

        const turma = turmas.find(t => t.id === turmaSelecionada)
        setData(turma ? turma.alunos : [])
        setLoading(false)
    }, [turmaSelecionada, turmas])


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
                        <Tools alunoId={row.original.id} alunoNome={row.original.nome} />
                    </div>
                )
            },
        },
    ]

    // Configurando a tabela
    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
    })


    return (
        <div className="w-full px-8 py-10 md:max-w-[calc(100%-2.5rem)] md:py-10 md:px-0 md:pl-10 box-border">
            <div className="flex flex-col-reverse lg:flex-row md:justify-between xl:px-8 lg:items-center mb-5 gap-4">
                <div>
                    <Label className="mb-3 text-xl">Buscar Alunos</Label>
                    <Input
                        type="text"
                        placeholder="Buscar Alunos..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 md:my-0 border rounded md:w-[150%] max-w-sm"
                    />
                </div>

                <div className="block">
                    <Label className="mb-3 text-xl">Selecione uma turma</Label>
                    <Select
                        value={turmaSelecionada}
                        onValueChange={(value) => setTurmaSelecionada(value)}
                    >
                        <SelectTrigger className="w-full max-w-48">
                            <SelectValue placeholder="Selecione uma turma" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectGroup>
                                <SelectLabel>Suas Turmas</SelectLabel>
                                {turmas.map((turma) => (
                                    <SelectItem key={turma.id} value={turma.id}>
                                        {turma.nome}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

            </div>


            <div className="overflow-x-auto w-auto hidden md:flex">
                {loading ? (
                    <Card className="max-w-md mx-auto mt-10 w-full">
                        <CardHeader className="text-center">
                            <CardTitle>Selecione uma turma</CardTitle>
                            <CardDescription>
                                Escolha uma turma no seletor acima para visualizar os alunos.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex justify-center">
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                Turma
                            </div>
                        </CardContent>
                    </Card>
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
                    <Card className="max-w-md mx-auto mt-10 w-full">
                        <CardHeader className="text-center">
                            <CardTitle>Selecione uma turma</CardTitle>
                            <CardDescription>
                                Escolha uma turma no seletor acima para visualizar os alunos.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex justify-center">
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                Turma
                            </div>
                        </CardContent>
                    </Card>
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
                                <Tools alunoId={row.original.id} alunoNome={row.original.nome}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
