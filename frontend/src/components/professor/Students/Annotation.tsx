import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useTeach, type IAluno, type IAnotacoes, type IProfessor } from "@/contexts/teacherContext"
import { axiosInstance } from "@/api/axiosInstance"
import { data } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"

interface IAnnotation {
    open: boolean
    onClose: (open: boolean) => void
    studentId: string
    studentName: string
}

export const Annotation = ({
    open,
    onClose,
    studentId,
    studentName
}: IAnnotation) => {
    const [texto, setTexto] = useState("")
    const [items, setItems] = useState<IAnotacoes[]>([])
    const [anotacao, setAnotacao] = useState(null)

    const { aluno, registerAnnotation, listStudent, loading, setLoading } = useTeach()

    const handleAdd = async () => {
        if (!texto) return

        setLoading(true)
        try {
            await registerAnnotation(studentId, texto)
            setTexto("")

            await listStudent(studentId)
        }
        catch (error: any) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // UseEffect para buscar as anotações do aluno quando o componente é montado ou quando o ID do aluno muda.
    useEffect(() => {
        if (!open || !studentId) return

        listStudent(studentId)

    }, [open, studentId])

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                console.log("Dialog mudou:", value);
                onClose(value);
            }}>
            <DialogContent className="">
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
                    <Label>Histórico</Label>
                    <ScrollArea className="h-56 rounded-md border p-3">
                        {
                            loading ? (
                                <p className="text-sm text-muted-foreground">
                                    Carregando anotações...
                                </p>
                            ) : (
                                aluno?.anotacoes.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Nenhuma anotação registrada.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {aluno?.anotacoes.map((item) => (
                                            <div key={item.id} className="rounded-md border p-3">
                                                <div className="text-xs text-muted-foreground">{new Date(item.data).toLocaleDateString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                                )}</div>
                                                <div className="mt-2 text-sm whitespace-pre-wrap">{item.anotacao}</div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )
                        }

                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => onClose(false)}>
                        Fechar
                    </Button>
                    <Button type="button" onClick={handleAdd} disabled={!texto}>
                        {loading
                            ? <span className="flex justify-center items-center gap-2">
                                <Spinner />
                            </span>
                            : "Salvar anotação"
                        }

                    </Button>


                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
