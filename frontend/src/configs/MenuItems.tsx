import { House, Users, NotepadText, Calendar, School, UserPen } from "lucide-react"
import type React from "react"

export type Role = "coordenador" | "professor"

interface User {
    title: string
    url: string
    icon?: React.ComponentType | undefined
}

//Items para cada usuário no sidebar
export const MenuItems: Record<Role, User[]> = {
    coordenador: [
        {title: "Dashboard", url:"/coordenador", icon: House},
        {title: "Gerenciar Usuários", url:"/coordenador/gerenciar", icon: Users},
        {title: "Matriculas", url: "/coordenador/matriculas", icon: NotepadText},
        {title: "Gerenciar turmas", url: "/coordenador/gerenciar-turmas", icon: School},
        {title: "Calendário acadêmico", url: "/coordenador/calendar", icon: Calendar}
    ],

    professor: [
        {title: "Dashboard", url: "/professor", icon: House },
        {title: "Gerenciar alunos", url: "/professor/gerenciar-alunos", icon: UserPen },
        {title: "Minhas turmas", url: "/professor/gerenciar-turmas", icon: School},
        {title: "Calendário acadêmico", url: "/professor/calendar", icon: Calendar}
    ]
    
}