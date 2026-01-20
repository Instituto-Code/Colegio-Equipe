import { Card } from "@/components/Coordenador/Dashboard/DashboardCards"
import { Button } from "@/components/ui/button"
import { useTeach } from "@/contexts/teacherContext"
import { useEffect } from "react"




export const DashTeacher = () => {

    const { listClasses } = useTeach()

    return(
        <div className="flex flex-col w-full h-full items-center justify-center">
            <Button
                onClick={()=>{
                    listClasses()
                }}
            >
                Clique 
            </Button>
            <h1>Alguma coisa</h1>

        </div>
    )
}