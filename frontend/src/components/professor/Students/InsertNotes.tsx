import { axiosInstance } from "@/api/axiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { type Grade, useTeach, type IAluno, type ITurma, type Disciplina } from "@/contexts/teacherContext"
import { Arrow } from "@radix-ui/react-select"
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import axios from "axios"
import { ArrowBigDown, ArrowLeft, BookOpenText } from "lucide-react"
import { number } from "motion/react"
import { use, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

type Nota = {
    id: string
    disciplina: string
    nota: number
}

export const Notes = () => {
    const [aluno, setAluno] = useState<IAluno | null>(null)
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
    const [disciplinaId, setDisciplinaId] = useState("")
    const [nota, setNota] = useState<number | null>(null)
    const [notasAluno, setNotasAluno] = useState<Grade[]>([])
    const [tipoNota, setTipoNota] = useState("")
    const [date, setDate] = useState("")
    const [bimestre, setBimestre] = useState("")
    const [observacao, setObservacao] = useState("")
    const [errors, setErrors] = useState<{
        disciplinaId?: string
        tipoNota?: string
        nota?: string
        data?: string
        bimestre?: string
    }>({})


    const [data, setData] = useState<Grade[]>([])
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    // Navegacão
    const navigate = useNavigate()

    // Pegando o ID do aluno a partir dos parâmetros da URL
    const { studentId } = useParams<{ studentId: string }>()

    const { insertGrades, loading, setLoading } = useTeach()

    // Validação do formulário.
    const validateFields = () => {
        const nextErrors: {
            disciplinaId?: string
            tipoNota?: string
            nota?: string
            data?: string
            bimestre?: string
        } = {}

        if (!disciplinaId) nextErrors.disciplinaId = "Disciplina é obrigatória."
        if (!tipoNota) nextErrors.tipoNota = "Tipo de nota é obrigatório."
        if (nota === null || nota <= 0) nextErrors.nota = "Nota é obrigatória e deve ser maior que 0."
        if (!date) nextErrors.data = "Data é obrigatória."
        const bimestreNumero = Number(bimestre)
        if (bimestre === null || bimestreNumero < 1 || bimestreNumero > 4) nextErrors.bimestre = "O bimestre é obrigatório"

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    // Efeito para buscar os dados do aluno quando o componente for montado
    useEffect(() => {
        if (!studentId) return

        const fetchStudent = async (studentID: string | undefined) => {
            try {
                setLoading(true)
                const res = await axiosInstance.get(`/api/coordenador/list-student/${studentID}`)

                const data = res.data

                setAluno(data.aluno)
            }
            catch (error: any) {
                console.error(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchStudent(studentId)
    }, [])

    // Efeito para extrair as disciplinas do aluno e evitar duplicatas
    useEffect(() => {
        if (!aluno) return

        aluno.turma.map((t) => {
            t.disciplinas.map((d) => {
                setDisciplinas((prev) =>
                    Array.from(new Map([...prev, d].map((x) => [x.id, x])).values())
                );
            })
        })

        setNotasAluno(aluno.grades)
        setData(aluno.grades)
    }, [aluno, insertGrades])

    console.log(data)

    // Função para lidar com o envio do formulário de lançamento de nota
    const handleAddNota = async (disciplinaId: string, studentId: string, bimestre: number, tipo: string, nota: number, date: string) => {
        if (!validateFields()) return

        try {
            await insertGrades(disciplinaId, studentId, bimestre, tipo, nota, date)

            const disciplinaNome = disciplinas.find((d) => d.id === disciplinaId)?.nome || "Disciplina"
            const novoGrade: Grade = {
                bimestre,
                tipo,
                nota,
                data: date,
                disciplina: {
                    id: disciplinaId,
                    nome: disciplinaNome,
                },
            }

            setNotasAluno((prev) => [novoGrade, ...prev])
            setData((prev) => [novoGrade, ...prev])
            setAluno((prev) => (prev ? { ...prev, grades: [novoGrade, ...prev.grades] } : prev))
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setDisciplinaId("")
            setTipoNota("")
            setNota(null)
            setBimestre("")
            setDate("")
        }
    }

    console.log()

    // Função para limpar o formulário
    const handleClear = () => {
        setDisciplinaId("")
        setTipoNota("")
        setNota(null)
        setDate("")
        setBimestre("")
        setErrors({})
    }

    // Função para convertar a data para dd/mm/aaaa.
    const formatDate = (value?: string) => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "-";
        return d.toLocaleDateString("pt-BR");
    };

    // Colunas da tabela
    const columns: ColumnDef<Grade>[] = [
        { accessorKey: "disciplina.nome", header: "Disciplina" },
        { accessorKey: "bimestre", header: "Bimestre" },
        { accessorKey: "tipo", header: "Tipo" },
        { accessorKey: "nota", header: "Nota" },
        {
            accessorKey: "data",
            header: "Data",
            cell: ({ row }) => formatDate(row.original.data)
        }
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
        <div className="flex w-full min-h-screen bg-background">
            <div className="flex flex-col items-center [&>*]:w-full w-full p-6 py-8 space-y-8">
                <header className="flex justify-start items-center w-full">
                    <ArrowLeft className="size-6 cursor-pointer" onClick={() => { navigate(-1) }} />
                </header>

                <div className="flex flex-col justify-start space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Lançamento de Notas</h1>
                    <p className="text-sm text-muted-foreground">
                        Registre as notas do aluno e acompanhe o histórico da turma.
                    </p>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Aluno</Label>
                        <Input value={aluno?.nome || ""} readOnly />

                    </div>

                    <div className="space-y-2">
                        <Label>Turma</Label>
                        <Input value={aluno?.turma[0]?.nome || ""} readOnly />
                    </div>

                    <div className="space-y-2">
                        <Label>Perí­odo</Label>
                        <Input value={aluno?.turma[0]?.turno || ""} readOnly />
                    </div>
                </section>

                <section className="flex flex-col gap-6 md:flex-row md:justify-between lg:px-3 ">
                    <div className="space-y-2">
                        <Label>Tipo de nota</Label>
                        <Select
                            value={tipoNota}
                            onValueChange={(value) => {
                                setTipoNota(value)
                                if (errors.tipoNota) setErrors((prev) => ({ ...prev, tipoNota: undefined }))
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="prova">Prova</SelectItem>
                                <SelectItem value="trabalho">Trabalho</SelectItem>
                                <SelectItem value="recuperacao">Recuperação</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tipoNota && <p className="text-xs text-red-500">{errors.tipoNota}</p>}
                    </div>

                    <div className="space-y-2 ">
                        <Label>Disciplina</Label>
                        <Select
                            value={disciplinaId}
                            onValueChange={(value) => {
                                setDisciplinaId(value)
                                if (errors.disciplinaId) setErrors((prev) => ({ ...prev, disciplinaId: undefined }))
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a disciplina" />
                            </SelectTrigger>
                            <SelectContent>
                                {disciplinas.map((d) => (
                                    <SelectItem key={d.id} value={d.id}>
                                        {d.nome}
                                    </SelectItem>
                                ))}

                            </SelectContent>
                        </Select>
                        {errors.disciplinaId && <p className="text-xs text-red-500">{errors.disciplinaId}</p>}
                    </div>

                    <div className="space-y-2 ">
                        <Label>Bimestre</Label>
                        <Select
                            value={bimestre}
                            onValueChange={(value) => {
                                setBimestre(value)
                                if (errors.bimestre) setErrors((prev) => ({ ...prev, bimestre: undefined }))
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o Bimestre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1° Bimestre</SelectItem>
                                <SelectItem value="2">2° Bimestre</SelectItem>
                                <SelectItem value="3">3° Bimestre</SelectItem>
                                <SelectItem value="4">4° Bimestre</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.disciplinaId && <p className="text-xs text-red-500">{errors.disciplinaId}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Nota</Label>
                        <Input
                            type="number"
                            placeholder="0 a 10"
                            value={nota ?? ""}
                            onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : null
                                setNota(value)
                                if (errors.nota) setErrors((prev) => ({ ...prev, nota: undefined }))
                            }}
                        />
                        {errors.nota && <p className="text-xs text-red-500">{errors.nota}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Data</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value)
                                if (errors.data) setErrors((prev) => ({ ...prev, data: undefined }))
                            }}
                        />
                        {errors.data && <p className="text-xs text-red-500">{errors.data}</p>}
                    </div>
                </section>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={handleClear}>Limpar</Button>
                    <Button
                        type="button"
                        onClick={() => {
                            if (!validateFields() || !studentId || nota === null) {
                                return
                            }

                            handleAddNota(disciplinaId, studentId!, Number(bimestre), tipoNota, nota, date)
                        }}
                    >Salvar nota</Button>
                </div>

                <section className="space-y-3">
                    {loading ? (
                        <div className="w-full">
                            <div className="text-sm text-muted-foreground mb-2">Notas lançadas</div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Disciplina</TableHead>
                                        <TableHead>Bimestre</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Nota</TableHead>
                                        <TableHead>Data</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="min-w-[100px] sm:min-w-[120px]">
                                                <Skeleton className="h-4 w-28" />
                                            </TableCell>
                                            <TableCell className="min-w-[100px] sm:min-w-[120px]">
                                                <Skeleton className="h-4 w-16" />
                                            </TableCell>
                                            <TableCell className="min-w-[100px] sm:min-w-[120px]">
                                                <Skeleton className="h-4 w-20" />
                                            </TableCell>
                                            <TableCell className="min-w-[100px] sm:min-w-[120px]">
                                                <Skeleton className="h-4 w-12" />
                                            </TableCell>
                                            <TableCell className="min-w-[100px] sm:min-w-[120px]">
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : notasAluno.length >= 1 ? (
                        <div>
                            <div className="text-sm text-muted-foreground">Notas lançadas</div>
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
                        </div>
                    ) : (
                        <Card className="w-full border-dashed">
                            <CardHeader className="items-center text-center">
                                <div className="mb-2 rounded-full bg-muted p-3">
                                    <BookOpenText className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <CardTitle className="text-base">Nenhuma nota registrada</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-sm text-muted-foreground">
                                Este aluno ainda não possui notas lançadas.
                            </CardContent>
                        </Card>
                    )}

                </section>
            </div>
        </div>
    )
}
