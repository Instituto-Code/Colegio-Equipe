import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ITurma } from "./ClassGerence";
import { useEffect, useState } from "react";
import { api_url, useCoordenador } from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Trash } from "lucide-react";

interface AddDataToClassProps {
  turma: ITurma;
  open: boolean;
  onClose: () => void;
  onUpdateTurma: (updatedTurma: ITurma) => void;
}

type Parents = {
  id: string;
  nome: string;
  email: string;
};

interface Student {
  id: string;
  nome: string;
  matricula: string;
  dataNasc: Date;
  turma: ITurma | null
  pais: Parents[];
}

export const AddDataToClass = ({
  turma,
  open,
  onClose,
  onUpdateTurma,
}: AddDataToClassProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [localTurmas, setLocalTurmas] = useState<ITurma>({
    ...turma,
    alunos: turma.alunos || [],
  });
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );

  const { token } = useAuth();
  const { addStudentToClass, loading, professores, Professores, addTeacherToClass } =
    useCoordenador();

  // Recarrega os professores ao abrir o modal
  useEffect(() => {
    if (open) Professores();
  }, [open]);

  // Sincroniza a turma local sempre que houver atualização real na prop
  useEffect(() => {
    if (open) {
      setLocalTurmas({ ...turma, alunos: turma.alunos || [] });
    }
  }, [open]);

  // Busca lista de alunos disponíveis
  useEffect(() => {
    if (!open) {
      setSelectedStudent(null);
      return;
    }

    const fetchStudents = async () => {
      try {
        const res = await fetch(`${api_url}/api/coordenador/list-students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dataJson = await res.json();
        setStudents(dataJson.alunos);
      } catch (error) {
        console.log(error);
        toast.error("Falha ao carregar lista de alunos disponíveis.");
      }
    };

    fetchStudents();
  }, [open, token]);

  // Adicionar aluno
  const handleAddStudent = async (
    studentId: string | null,
    classId: string
  ) => {
    if (!studentId) {
      toast.error("Selecione um aluno.");
      return;
    }

    const student = students.find((s) => s.id === studentId);

    if (!student) {
      toast.error("Aluno não encontrado.");
      return;
    }

    if (student.turma) {
      toast.error("Este aluno já está vinculado a outra turma.");
      setSelectedStudent(null);
      return;
    }

    try {
      const updatedTurma: ITurma = await addStudentToClass(studentId, classId);

      setLocalTurmas((prev) => ({
        ...prev,
        alunos: [...(prev.alunos || []), student],
      }));

      onUpdateTurma(updatedTurma);

      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      setSelectedStudent(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Erro ao adicionar aluno."
      );
    }
  };


  const handleRemoveStudent = (alunoId: string) => {
    toast.info(`Remover aluno ${alunoId} (Lógica a ser implementada).`);
  };

  // Vincular professor à turma
  const handleLinkProfessor = async (classId: string) => {
    if (!selectedProfessor) {
      toast.error("Selecione um professor para vincular.");
      return;
    }

    await addTeacherToClass(classId, selectedProfessor);
    console.log("Professor vinculado:", selectedProfessor);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg md:max-w-3xl
             max-h-[90vh] overflow-hidden
             flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerenciar Turma: {turma.nome}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="alunos" className="flex-1 flex flex-col">
          <TabsList className="mb-4 grid grid-cols-2 w-full">
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="professores">Professores</TabsTrigger>
          </TabsList>

          {/* --- ABA ALUNOS --- */}
          <TabsContent value="alunos" className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex gap-2">
              <Select
                onValueChange={setSelectedStudent}
                value={selectedStudent || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="md:max-h-48 md:h-80 h-[300px]">
                    {students
                      .filter(
                        (s) =>
                          !s.turma &&
                          !localTurmas.alunos?.some((a) => a.id === s.id)
                      )
                      .map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.nome}
                        </SelectItem>
                      ))}


                  </ScrollArea>
                </SelectContent>
              </Select>

              <Button
                disabled={!selectedStudent || loading}
                className={`flex-shrink-0 ${!selectedStudent || loading
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-blue-400 cursor-pointer hover:bg-blue-500"
                  }`}
                onClick={() => handleAddStudent(selectedStudent, localTurmas.id)}
              >
                {loading ? (
                  <span className="flex flex-row items-center gap-1.5">
                    <Spinner className="size-4" /> Adicionando...
                  </span>
                ) : (
                  <span>Adicionar</span>
                )}
              </Button>
            </div>

            {/* Tabela Alunos */}
            <ScrollArea className="w-full rounded-md border p-2 overflow-x-auto">

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Nome</TableHead>
                    <TableHead className="w-[35%] hidden md:flex">Matrícula</TableHead>
                    <TableHead className="w-[20%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-10">
                  {Array.isArray(localTurmas.alunos) &&
                    localTurmas.alunos.length > 0 ? (
                    localTurmas.alunos.map((aluno) => (
                      <TableRow key={aluno.id} >
                        <TableCell>{aluno.nome}</TableCell>
                        <TableCell className="hidden md:flex">{aluno.matricula}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveStudent(aluno.id)}
                          >
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center h-16 text-muted-foreground"
                      >
                        Nenhum aluno vinculado a essa turma.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          {/* --- ABA PROFESSORES --- */}
          <TabsContent value="professores" className="space-y-4 w-full">
            <div className="flex flex-col gap-4">
              {/* Seletor de Professor */}
              <Select
                onValueChange={setSelectedProfessor}
                value={selectedProfessor || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  {
                    professores &&
                    professores.filter(
                      (p) => !localTurmas?.professores.some(t => t.id === p.id)
                    )
                      .map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.nome}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>

              {/* Botão Vincular */}
              <Button
                className="bg-blue-400 hover:bg-blue-500 cursor-pointer w-full"
                disabled={!selectedProfessor || loading}
                onClick={() => handleLinkProfessor(localTurmas.id)}
              >
                {
                  loading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Spinner />
                      Vinculando...
                    </span>
                  ) : (
                    <span> Vincular Professor à Turma</span>
                  )
                }
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
