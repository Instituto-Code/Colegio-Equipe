import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Aluno, ITurma } from "./GerenceClass"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


interface IGerence {
    open: boolean
    onClose: () => void
    turma: ITurma | null
}

export const Gerence = ({
    open,
    onClose,
    turma,
}: IGerence
) => {

    console.log(turma)

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
                                {turma?.alunos.map((aluno) => (
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
                        {turma?.alunos.map((aluno)=>(
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

                {/* <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}
