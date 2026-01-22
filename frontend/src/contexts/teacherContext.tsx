import { axiosInstance } from "@/api/axiosInstance";
import React, { createContext, useContext, useState, type ReactNode } from "react";


export type Aluno = {
    id: string
    matricula: string
    nome: string
}

export type Disciplina = {
    cargaHoraria: string
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
    listClasses: () => Promise<void>
}

const TeacherContext = createContext<ITeachContextProps | undefined>(undefined)

export const TeachProvider = ({ children }: { children: ReactNode }) => {
    const [turmas, setTurmas] = useState<ITurma[]>([])
    const [alunos, setAlunos] = useState<Aluno[]>([])
    const [loading, setLoading] = useState(false)

    // Função para listar as turmas do professor
    const listClasses = async () => {
        try {
            const res = await axiosInstance.get("/api/teacher/list-classes")

            const dataJson = await res.data
            
            // Setando as turmas do professor
            setTurmas(dataJson)

            // Setando alunos do professor
            dataJson.map((turma: ITurma) => {
                setAlunos((prev) => [...prev, ...turma.alunos])
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <TeacherContext.Provider
            value={{
                listClasses,
                loading,
                setLoading,
                alunos
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