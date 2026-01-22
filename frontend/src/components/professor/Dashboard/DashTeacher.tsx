import { Card } from "@/components/Coordenador/Dashboard/DashboardCards"
import { Button } from "@/components/ui/button"
import { useTeach } from "@/contexts/teacherContext"
import { useEffect } from "react"

// Componente DashTeacher
export const DashTeacher = () => {

    // Hook personalizado para obter funções e dados relacionados ao professor
    const { listClasses, alunos } = useTeach()

    return(
        <div className="flex flex-col w-full h-full items-center justify-center">
            <Button
                onClick={()=>{
                    listClasses()
                }}
            >
                Clique 
            </Button>
            <Button
                onClick={()=>{
                    console.log(alunos)
                }}
            >
                Clique para ver alunos 
            </Button>
            <h1>Alguma coisa</h1>

        </div>
    )
}