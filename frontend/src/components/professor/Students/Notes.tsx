import { axiosInstance } from "@/api/axiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useTeach, type IAluno, type ITurma } from "@/contexts/teacherContext"
import { Arrow } from "@radix-ui/react-select"
import axios from "axios"
import { ArrowBigDown, ArrowLeft } from "lucide-react"
import { number } from "motion/react"
import { use, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

type Nota = {
    id: string
    disciplina: string
    nota: number
}

interface Disciplina {
    cargaHoraria: string
    id: string
    nome: string
}

export const Notes = () => {
    const [aluno, setAluno] = useState<IAluno | null>(null)
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
    const [disciplinaId, setDisciplinaId] = useState("")
    const [nota, setNota] = useState<number | null>(null)
    const [tipoNota, setTipoNota] = useState("")
    const [data, setData] = useState("")
    const [observacao, setObservacao] = useState("")
    const [errors, setErrors] = useState<{
        disciplinaId?: string
        tipoNota?: string
        nota?: string
        data?: string
    }>({})

    // Navegacão
    const navigate = useNavigate()

    // Pegando o ID do aluno a partir dos parâmetros da URL
    const { studentId } = useParams<{ studentId: string }>()

    const { insertGrades } = useTeach()

    // Validação do formulário.
    const validateFields = () => {
        const nextErrors: {
            disciplinaId?: string
            tipoNota?: string
            nota?: string
            data?: string
        } = {}

        if (!disciplinaId) nextErrors.disciplinaId = "Disciplina é obrigatória."
        if (!tipoNota) nextErrors.tipoNota = "Tipo de nota é obrigatório."
        if (nota === null || nota <= 0) nextErrors.nota = "Nota é obrigatória e deve ser maior que 0."
        if (!data) nextErrors.data = "Data é obrigatória."

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    // Efeito para buscar os dados do aluno quando o componente for montado
    useEffect(() => {
        if (!studentId) return

        const fetchStudent = async (studentID: string | undefined) => {
            try {
                const res = await axiosInstance.get(`/api/coordenador/list-student/${studentID}`)

                const data = res.data
                setAluno(data.aluno)
            }
            catch (error: any) {
                console.error(error)
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
    }, [aluno])

    // Função para lidar com o envio do formulário de lançamento de nota
    const handleAddNota = async (disciplinaId: string, studentId: string, tipo: string, nota: number, date: string) => {
        if (!validateFields()) return

        try {
            await insertGrades(disciplinaId, studentId, tipo, nota, date)
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setDisciplinaId("")
            setTipoNota("")
            setNota(null)
            setData("")
        }
    }

    // Função para limpar o formulário
    const handleClear = () => {
        setDisciplinaId("")
        setTipoNota("")
        setNota(null)
        setData("")
        setErrors({})
    }

    return (
        <div className="flex w-full min-h-screen bg-background">
            <div className="flex flex-col items-center [&>*]:w-full w-full p-6 py-8 space-y-8">
                <header className="flex justify-start items-center w-full">
                    <ArrowLeft className="size-4" onClick={() => { navigate(-1) }}></ArrowLeft>
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
                            value={data}
                            onChange={(e) => {
                                setData(e.target.value)
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

                            handleAddNota(disciplinaId, studentId!, tipoNota, nota, data)
                        }}
                    >Salvar nota</Button>
                </div>

                <section className="space-y-3">
                    <div className="text-sm text-muted-foreground">Notas lançadas</div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Disciplina</TableHead>
                                <TableHead>Período</TableHead>
                                <TableHead>Nota</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Matemática</TableCell>
                                <TableCell>1º Bimestre</TableCell>
                                <TableCell>8.5</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Português</TableCell>
                                <TableCell>1º Bimestre</TableCell>
                                <TableCell>7.0</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </section>
            </div>
        </div>
    )
}
