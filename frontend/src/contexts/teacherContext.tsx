import { axiosInstance } from "@/api/axiosInstance";
import React, { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";


export type Aluno = {
    id: string
    matricula: string
    nome: string
}

export interface IAnotacoes {
    idProfessor: string
    anotacao: string
    id: string
    data: string
}

export interface IAluno {
  id: string
  dataNasc: string
  nome: string
  matricula: string
  pais: []
  status: string
  turma: ITurma[]
  grades: Grade[]
  anotacoes: IAnotacoes[]
}

export type Grade = {
  id?: string
  bimestre: number
  tipo: string
  nota: number
  data: string
  disciplina: Disciplina
}


export type Disciplina = {
    cargaHoraria?: string | undefined
    id: string
    nome: string
}

export interface ITurma {
    alunos: Aluno[]
    anoLetivo: string
    disciplinas: Disciplina[]
    id: string
    nome: string
    professores: []
    turno: string
}

interface ITeachContextProps {
    loading: boolean
    setLoading: (value: boolean) => void
    alunos: Aluno[]
    turmas: ITurma[]
    disciplinas: Disciplina[]
    listClasses: () => Promise<void>
    insertGrades: (disciplinaId: string, studentId: string, bimestre: number, tipo: string, nota: number, date: string) => Promise<void>
    registerAnnotation: (studentId: string, anotacao: string) => Promise<void>
    listStudent: (studentId: string) => Promise<void>
    aluno: IAluno | null
}

const TeacherContext = createContext<ITeachContextProps | undefined>(undefined)

export const TeachProvider = ({ children }: { children: ReactNode }) => {
    const [turmas, setTurmas] = useState<ITurma[]>([])
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
    const [loading, setLoading] = useState(false)
    const [aluno, setAluno] = useState<IAluno | null>(null)

    // Função para listar as turmas do professor
    const listClasses = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get("/api/teacher/list-classes")

            const dataJson = await res.data

            // Setando as turmas do professor
            setTurmas(dataJson)

            // Setando alunos do professor
            dataJson.map((turma: ITurma) => {
                setAlunos((prev) =>
                    Array.from(
                        new Map([...prev, ...turma.alunos].map((a) => [a.id, a]))
                    ).map(([, v]) => v)
                )
            })

            // Setando as Disciplinas
            dataJson.map((turma: ITurma) => {
                setDisciplinas((prev) =>
                    Array.from(
                        new Map([...prev, ...turma.disciplinas].map((a) => [a.id, a]))
                    ).map(([, v]) => v)
                )
            })
        }
        catch (error) {
            console.error(error)
        }
        finally{
            setLoading(false)
        }
    }

    // Fução para listar dados de um único aluno
    const listStudent = async (studentId: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.get(`/api/coordenador/list-student/${studentId}`)

            const data = res.data
            setAluno(data.aluno)
        }
        catch (error: any) {
            console.error(error)
        }
        finally{
            setLoading(false)
        }
    }

    // Função para inserir notas
    const insertGrades = async (disciplinaId: string, studentId: string, bimestre: number, tipo: string, nota: number, date: string) => {
        setLoading(true)
        try {
            const res = await axiosInstance.patch("/api/teacher/insert-grades", {
                disciplinaId,
                studentId,
                bimestre,
                tipo,
                nota,
                date
            })

            toast.success("Nota lançada com sucesso")

            return res.data
        }
        catch (error: any) {
            const msg =
                error.response?.data?.errors ||
                error.response?.data?.message ||
                "Erro ao lancar nota"

            toast.error(msg)
            throw error
        }
        finally{
            setLoading(false)
        }
    }

    const registerAnnotation = async (studentId: string, anotacao: string) => {
        try {
            const res = await axiosInstance.patch("/api/teacher/notes", {
                studentId,
                anotacao
            })

            toast.success("Anoação enviada com sucesso")

            return res.data
        }
        catch (error: any) {
            const msg =
                error.response?.data?.errors ||
                error.response?.data?.message ||
                "Erro ao lancar nota"

            toast.error(msg)
            throw error
        }
    }

    return (
        <TeacherContext.Provider
            value={{
                listClasses,
                loading,
                setLoading,
                alunos,
                turmas,
                disciplinas,
                insertGrades,
                registerAnnotation,
                listStudent,
                aluno
            }}
        >
            {children}
        </TeacherContext.Provider>
    )
}

export const useTeach = () => {
    const context = useContext(TeacherContext);
    if (!context) {
        throw new Error("UseAuth deve ser usado dentro do AuthProvider");
    }
    return context;
};
