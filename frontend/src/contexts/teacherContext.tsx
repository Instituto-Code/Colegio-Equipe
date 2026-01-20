import { axiosInstance } from "@/api/axiosInstance";
import React, { createContext, useContext, useState, type ReactNode } from "react";


interface ITeachContextProps {
    loading: boolean
    setLoading: (value: boolean) => void
    listClasses: () => Promise<void>
}

const TeacherContext = createContext<ITeachContextProps | undefined>(undefined)

export const TeachProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState(false)

    // Função para listar as turmas do professor
    const listClasses = async () => {
        try {
            const res = await axiosInstance.get("/api/teacher/list-classes")

            const dataJson = await res.data
            console.log(dataJson)
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
                setLoading
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