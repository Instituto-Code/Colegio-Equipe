import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type IAluno } from "@/contexts/teacherContext";
import { axiosInstance } from "@/api/axiosInstance";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface IViewNotesProps {
  open: boolean;
  onClose: (open: boolean) => void;
  studentId: string;
  studentName: string;
}

export const ViewNotes = ({ open, onClose, studentId, studentName }: IViewNotesProps) => {
  const [loading, setLoading] = useState(false);
  const [aluno, setAluno] = useState<IAluno | null>(null);
  const [bimestreSelecionado, setBimestreSelecionado] = useState<string>("todos");

  // Carrega os dados do aluno quando o modal abre.
  useEffect(() => {
    if (!open || !studentId) return;

    const fetchStudent = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/coordenador/list-student/${studentId}`);
        setAluno(res.data.aluno);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [open, studentId]);

  const grades = useMemo(() => aluno?.grades ?? [], [aluno?.grades]);

  const filteredGrades = useMemo(() => {
    if (bimestreSelecionado === "todos") return grades;
    return grades.filter((g) => String(g.bimestre) === bimestreSelecionado);
  }, [grades, bimestreSelecionado]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Notas do aluno(a) {studentName}</DialogTitle>
          <DialogDescription>
            Visualize as notas lançadas para este aluno.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Filtrar por bimestre</Label>
          <Select value={bimestreSelecionado} onValueChange={setBimestreSelecionado}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Selecione o bimestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="1">1° Bimestre</SelectItem>
              <SelectItem value="2">2° Bimestre</SelectItem>
              <SelectItem value="3">3° Bimestre</SelectItem>
              <SelectItem value="4">4° Bimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <>
            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-3">
                  <Skeleton className="h-5 w-36" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block w-full">
              <div className="text-sm text-muted-foreground mb-2">
                Notas lançadas
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Bimestre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : grades.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Nenhuma nota registrada para este aluno.
          </div>
        ) : filteredGrades.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Não há notas para o {bimestreSelecionado}° bimestre.
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="space-y-4 md:hidden">
              {filteredGrades.map((g) => (
                <div
                  key={g.id}
                  className="rounded-lg border bg-background p-4 shadow-sm"
                >
                  <h3 className="font-semibold text-base">
                    {g.disciplina?.nome ?? "Disciplina"}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bimestre</span>
                      <span>{g.bimestre}°</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo</span>
                      <span>{g.tipo}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nota</span>
                      <span className="font-medium">{g.nota}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data</span>
                      <span>{new Date(g.data).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block max-h-[420px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Bimestre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredGrades.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>{g.disciplina?.nome ?? "Disciplina"}</TableCell>
                      <TableCell>{g.bimestre}°</TableCell>
                      <TableCell>{g.tipo}</TableCell>
                      <TableCell>{g.nota}</TableCell>
                      <TableCell>
                        {new Date(g.data).toLocaleDateString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onClose(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
