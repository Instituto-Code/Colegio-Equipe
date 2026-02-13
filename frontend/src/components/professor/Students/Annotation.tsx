import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useTeach, type IAluno } from "@/contexts/teacherContext"
import { axiosInstance } from "@/api/axiosInstance"
import { data } from "react-router-dom"

interface IAnnotation {
    open: boolean
    onClose: (open: boolean) => void
    studentId: string
    studentName: string
}

type AnnotationItems = {
    idProfessor: string
    anotacao: string
    id: string
    data: string
}

export const Annotation = ({
    open,
    onClose,
    studentId,
    studentName
}: IAnnotation) => {
    const [texto, setTexto] = useState("")
    const [items, setItems] = useState<AnnotationItems[]>([])
    const [anotacao, setAnotacao] = useState(null)

    const { registerAnnotation, listStudent, aluno } = useTeach()

    const handleAdd = async () => {
        if (!texto) return

        try {
            await registerAnnotation(studentId, texto)
        }
        catch (error: any) {
            console.error(error)
        }

    }

    useEffect(() => {
        if (!open || !studentId) return

        const fetchStudent = async () => {
            try {
                const res = await axiosInstance.get(`/api/coordenador/list-student/${studentId}`)

                const dataJson = res.data

            } catch (error: any) {
                console.error(error)
            }
        }

        fetchStudent()
        console.log("chamou")
    }, [open])


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Anotações do aluno(a) {studentName}</DialogTitle>
                    <DialogDescription>
                        Registre e visualize as anotações. Todos os campos são obrigatórios.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <Label htmlFor="annotation-text">Nova anotação</Label>
                    <Textarea
                        id="annotation-text"
                        placeholder="Escreva a anotação sobre o aluno..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        className="min-h-[120px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Historico</Label>
                    <ScrollArea className="h-56 rounded-md border p-3">
                        {items.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma anotacao registrada.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="rounded-md border p-3">
                                        <div className="text-xs text-muted-foreground">{item.data}</div>
                                        <div className="mt-2 text-sm whitespace-pre-wrap">{item.anotacao}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => onClose(false)}>
                        Fechar
                    </Button>
                    <Button type="button" onClick={handleAdd} disabled={!texto}>
                        Salvar anotacao
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
