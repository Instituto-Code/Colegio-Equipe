import { House, Users, NotepadText } from "lucide-react"
import type React from "react"

export type Role = "coordenador" | "professor"

interface User {
    title: string
    url: string
    icon?: React.ComponentType | undefined
}

export const MenuItems: Record<Role, User[]> = {
    coordenador: [
        {title: "Dashboard", url:"/coordenador", icon: House},
        {title: "Gerenciar Usuários", url:"/coordenador/gerenciar", icon: Users},
        {title: "Matriculas", url: "/coordenador/matriculas", icon: NotepadText}
    ],

    professor: [
        {title: "Dashboard", url: "/professor", },
        {title: "Gerenciar alunos", url: "/professor/gerenciar-alunos", },
        {title: "Gerenciar turmas", url: "/professor/gerenciar-turmas", }
    ]
    
}