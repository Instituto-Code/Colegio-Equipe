import { Dropdown } from "@/components/Dropdown/Dropdown"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Notes } from "./Notes"
import { Link, useNavigate } from "react-router-dom"
import { Annotation } from "./Annotation"

interface IAluno {
    alunoId: string
    alunoNome: string
}

export const Tools = ({
    alunoId,
    alunoNome
}: IAluno) => {

    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Gerenciar</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50" align="start">
                    <DropdownMenuGroup >
                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigate(`/professor/notes/${alunoId}`)
                                console.log(alunoId)
                            }}
                        >
                            Inserir Notas
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault()
                                setOpen(true)
                            }}
                        >
                            Anotações
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Annotation open={open} onClose={setOpen} studentId={alunoId} studentName={alunoNome} />
        </>
    )
}
