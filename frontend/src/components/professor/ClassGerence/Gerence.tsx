import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { Aluno, ITurma } from "@/contexts/teacherContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Definindo as props do componente Gerence
interface IGerence {
    open: boolean
    onClose: () => void
    turma: ITurma | null
}

// Componente Gerence para gerenciar alunos de uma turma
export const Gerence = ({
    open,
    onClose,
    turma,
}: IGerence
) => {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Alunos</DialogTitle>
                    <DialogHeader>Alunos da turma {turma?.nome}</DialogHeader>
                </DialogHeader>

                <ScrollArea>
                    <div className="hidden md:flex">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Matricula</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {turma?.alunos.map((aluno: Aluno) => (
                                    <TableRow key={aluno.id}>
                                        <TableCell>{aluno.nome}</TableCell>
                                        <TableCell>{aluno.matricula}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Tabela para celular */}
                    <div className="block space-y-2 md:hidden">
                        {turma?.alunos.map((aluno: Aluno)=>(
                            <div key={aluno.id} className="border p-2 outline">
                                <div>
                                    <strong>Nome:</strong> {aluno.nome}
                                </div>
                                <div>
                                    <strong>Matrícula:</strong> {aluno.matricula}
                                </div>
                            </div>
                        ))}
                    </div>

                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
