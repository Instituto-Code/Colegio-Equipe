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
import type { ITurma, Professor } from "./ClassGerence";
import { useEffect, useState } from "react";
import { api_url, useCoordenador } from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ConfirmationBox } from "@/components/Box/ConfirmationBox";
import { tr } from "date-fns/locale";

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
    professores: turma.professores || [],
  });
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );
  const [openDelete, setOpenDelete] = useState(false)

  const { token } = useAuth();
  const { addStudentToClass, loading, professores, Professores, addTeacherToClass, removeStudentClass } =
    useCoordenador();

  // Recarrega os professores ao abrir o modal
  useEffect(() => {
    if (open) Professores()

  }, [open]);

  // Sincroniza a turma local sempre que houver atualização real na prop
  useEffect(() => {
    if (open) {
      setLocalTurmas((prev)=>({
        ...prev,
        alunos: turma.alunos || prev.alunos,
        professores: turma.professores?.length 
          ? turma.professores
          : prev.professores 
      }));
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
    try {
      if (!studentId) return toast.error("Selecione um aluno.");

      console.log(classId);

      const updatedTurma: ITurma = await addStudentToClass(studentId, classId);
      const newStudent = students.find((s) => s.id === studentId);
      if (!newStudent) {
        toast.error("Aluno não encontrado na lista.");
        return;
      }

      // Atualização otimista
      setLocalTurmas((prev) => ({
        ...prev,
        alunos: [...(prev.alunos || []), newStudent],
      }));

      onUpdateTurma(updatedTurma);

      //Retirando aluno da lista ao colocar na turma
      setStudents((prev) => prev.filter((s) => s.id !== studentId));

      setSelectedStudent(null);
      console.log(studentId, classId)

    } catch (error: any) {
      toast.error(error?.message || "Erro ao adicionar aluno.");
    }
  };

  const handleRemoveStudent = async (alunoId: string) => {
    try {
      if (!alunoId) {
        toast.error("Selecione um aluno para retirar")
      }

      await removeStudentClass(alunoId, turma.nome)

      setLocalTurmas((prev) => ({
        ...prev,
        alunos: prev.alunos.filter((a) => a.id !== alunoId)
      }))
    }
    catch (error) {
      console.error(error)
      toast.error("Não foi possível excluir")
    }
  }

  // Vincular professor à turma
  const handleLinkProfessor = async (
    teacherId: string,
    classId: string
  ) => {
    try {
      if (!teacherId) {
        toast.error("Selecione um professor para vincular.");
        return;
      }

      const updatedTurma: ITurma = await addTeacherToClass(classId, teacherId);

      const newProfessor = professores?.find((p) => p.id === teacherId)
      console.log(newProfessor)

      if (!newProfessor) {
        toast.error("Professor não encontrado na lista.");
        return;
      }

      // Atualização otimista
      setLocalTurmas((prev) => ({
        ...prev,
        professores: [...(prev.professores || []), newProfessor],
      }));

      onUpdateTurma(updatedTurma);

      setSelectedProfessor(null)
      console.log("Professor vinculado:", selectedProfessor);
    }
    catch(error: any){
      console.error(error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg md:max-w-3xl flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle>Gerenciar Turma: {turma.nome}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="alunos" className="w-full">
          <TabsList className="mb-4 grid grid-cols-2 w-full">
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="professores">Professores</TabsTrigger>
          </TabsList>

          {/* --- ABA ALUNOS --- */}
          <TabsContent value="alunos" className="space-y-4 w-full">
            <div className="flex gap-2">
              <Select
                onValueChange={setSelectedStudent}
                value={selectedStudent || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-48">
                    {students
                      .filter(
                        (s) => !localTurmas.alunos?.some((a) => a.id === s.id)
                      )
                      .map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="text-sm p-1.5">{student.nome}</div>
                        </SelectItem>
                      ))
                    }

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
            <ScrollArea className="h-[300px] rounded-md border p-2 hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Nome</TableHead>
                    <TableHead className="w-[35%]">Matrícula</TableHead>
                    <TableHead className="w-[20%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(localTurmas.alunos) &&
                    localTurmas.alunos.length > 0 ? (
                    localTurmas.alunos.map((aluno) => (
                      <TableRow key={aluno.id}>
                        <TableCell>{aluno.nome}</TableCell>
                        <TableCell>{aluno.matricula}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setOpenDelete(true)
                              setSelectedStudent(aluno.id)
                            }}
                          >
                            Remover
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
                onClick={() => handleLinkProfessor(selectedProfessor!, localTurmas.id)}
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

            {/* Tabela Professores */}
            <ScrollArea className="h-[300px] rounded-md border p-2 hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Nome</TableHead>
                    <TableHead className="w-[35%]">Matrícula</TableHead>
                    <TableHead className="w-[20%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(localTurmas.professores) &&
                    localTurmas.professores.length > 0 ? (
                    localTurmas.professores.map((prof) => (
                      <TableRow key={prof.id}>
                        <TableCell>{prof.nome}</TableCell>
                        <TableCell>{prof.matricula}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              
                            }}
                          >
                            Remover
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
        </Tabs>
      </DialogContent>

      {/* Box para confirmar exclusão */}
      <ConfirmationBox
        openDialog={openDelete}
        onOpenDialogChange={setOpenDelete}
        registerToDelete={selectedStudent}
        setRegisterToDelete={setSelectedStudent}
        deleteRegister={handleRemoveStudent}
      />

    </Dialog>
  );
};
