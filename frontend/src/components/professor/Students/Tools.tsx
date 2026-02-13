import { Dropdown } from "@/components/Dropdown/Dropdown"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Notes } from "./InsertNotes"
import { Link, useNavigate } from "react-router-dom"
import { Annotation } from "./Annotation"
import { ViewNotes } from "./ViewNotes"

interface IAluno {
    alunoId: string
    alunoNome: string
}

export const Tools = ({
    alunoId,
    alunoNome
}: IAluno) => {

    const [openAnnt, setOpenAnnot] = useState(false)
    const [openViewNotes, setOpenViewNotes] = useState(false)

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
                                e.preventDefault();
                                setOpenViewNotes(true);
                                console.log("chamou")
                            }}
                        >
                            Ver Notas
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault()
                                setOpenAnnot(true)
                            }}
                        >
                            Anotações
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Página para inserir as notas  */}
            <Annotation
                open={openAnnt}
                onClose={setOpenAnnot}
                studentId={alunoId}
                studentName={alunoNome}
            />

            {/* Janela modal para visualizar as notas */}
            <ViewNotes
                open={openViewNotes}
                onClose={setOpenViewNotes}
                studentId={alunoId}
                studentName={alunoNome}
            />
        </>
    )
}
