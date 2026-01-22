import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

type Nota = {
  id: string
  disciplina: string
  nota: number
}

export const Notes = () => {

    const [disciplina, setDisciplina] = useState("")
    const [nota, setNota] = useState("")
    const [notas, setNotas] = useState<Nota[]>([])

    const handleAddNota = () => {
        if (!disciplina || !nota) return

        setNotas(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                disciplina,
                nota: Number(nota)
            }
        ])

        setDisciplina("")
        setNota("")
    }
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Adicionar notas do aluno</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Formulario */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label>Disciplina</Label>
                            <Input
                                value={disciplina}
                                onChange={(e) => setDisciplina(e.target.value)}
                                placeholder="Ex: Matemática"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Nota</Label>
                            <Input
                                type="number"
                                value={nota}
                                onChange={(e) => setNota(e.target.value)}
                                placeholder="0 a 10"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button className="w-full" onClick={handleAddNota}>
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    {/* Tabela */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Disciplina</TableHead>
                                <TableHead>Nota</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {notas.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                                        Nenhuma nota cadastrada
                                    </TableCell>
                                </TableRow>
                            )}

                            {notas.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.disciplina}</TableCell>
                                    <TableCell>{item.nota}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}