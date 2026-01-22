import { Dropdown } from "@/components/Dropdown/Dropdown"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Notes } from "./Notes"
import { Link } from "react-router-dom"

interface IAluno {
    id: string
    nome: string
    matricula: string
}

export const Tools = ({
    id,
    nome,
    matricula
}: IAluno) => {

    const [open, setOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Gerenciar</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link
                                to="/professor/notes"
                            >
                                Inserir Notas
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {open &&
                <Notes />
            }
        </>



    )
}