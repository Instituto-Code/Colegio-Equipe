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
import { Trash2 } from "lucide-react";
import { MultiSelectContent } from "@/components/Checkbox/Checkbox";
import { materias } from "./RegisterItemToCheckbox";
import type { Professor } from "@/contexts/coordenadorContext";

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


interface Disciplina {
  id: string;
  nome: string;
}

interface ProfessorDisciplina {
  professor: Professor;
  disciplina: Disciplina;
}

export const AddDataToClass = ({
  turma,
  open,
  onClose,
  onUpdateTurma,
}: AddDataToClassProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [localTurmas, setLocalTurmas] = useState<ITurma>(turma);
  const [disciplinesToLink, setDisciplinesToLink] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );

  const { token } = useAuth();
  const { addStudentToClass, loading, Professores } = useCoordenador();

  //Função para receber as seleções do MultiSelectContent
  const handleDisciplinesChange = (selectedIds: string[]) => {
    setDisciplinesToLink(selectedIds);
  };

  // 1. Sincroniza o estado local com a prop
  useEffect(() => {
    setLocalTurmas(turma);
  }, [turma]);

  // 2. Busca lista de alunos disponíveis
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

  // 3. Adicionar aluno à turma
  const handleAddStudent = async (
    studentId: string | null,
    classId: string
  ) => {
    // ... (lógica de validação e chamada da API permanece a mesma)
    try {
      if (studentId === null) {
        return toast.error("Selecione um aluno.");
      }

      const updatedTurma: ITurma = await addStudentToClass(studentId, classId);

      // Encontra o aluno completo na lista de alunos disponíveis para atualização
      const newStudent = students.find((s) => s.id === studentId);

      // Atualização Otimista (se o backend retorna apenas a turma base)
      if (newStudent) {
        setLocalTurmas((prev) => ({
          ...prev,
          alunos: [...(prev.alunos || []), newStudent],
        }));
      }

      // Atualização do estado global
      onUpdateTurma(updatedTurma);

      toast.success(`Aluno(a) adicionado(a) com sucesso.`);
      setSelectedStudent(null);
    } catch (error) {
      console.error(error);
      // Exemplo de como capturar a mensagem de erro da API
      const errorMessage =
        (error as any)?.errors?.[0] || "Erro ao adicionar aluno.";
      toast.error(errorMessage);
    }
  };

  // 4. Implementação do Remover Aluno (Função placeholder)
  const handleRemoveStudent = (alunoId: string) => {
    toast.info(`Remover aluno ${alunoId} (Lógica a ser implementada).`);
    // Aqui viria a chamada à API de remoção e a atualização do estado
  };

  return (
    // 💡 AJUSTE DE RESPONSIVIDADE: Permite que o modal ocupe mais espaço no mobile
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-lg md:max-w-3xl flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle>Gerenciar Turma: {turma.nome}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="alunos" className="w-full">
          <TabsList className="mb-4 grid grid-cols-2 w-full">
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="professores">
              Professores / Disciplinas
            </TabsTrigger>
          </TabsList>

          {/* --- ABA ALUNOS --- */}
          <TabsContent value="alunos" className="space-y-4 w-full">
            <div className="flex gap-2">
              {/* Seletor de Alunos */}
              <Select
                onValueChange={(value) => setSelectedStudent(value)}
                value={selectedStudent || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-48">
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="text-sm p-1.5">{student.nome}</div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {/* Botão Adicionar */}
              <Button
                disabled={!selectedStudent || loading}
                className={`flex-shrink-0 ${
                  !selectedStudent || loading
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-blue-400 cursor-pointer hover:bg-blue-500"
                }`}
                onClick={() => handleAddStudent(selectedStudent, turma.id)}
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

            {/* 5. Tabela de Alunos (Desktop/Tablet) */}
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
                  {(localTurmas.alunos || []).map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell title={aluno.nome}>{aluno.nome}</TableCell>
                      <TableCell>{aluno.matricula}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveStudent(aluno.id)}
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Mensagem de Vazio */}
                  {(!localTurmas.alunos || localTurmas.alunos.length === 0) && (
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

            {/* 6. Lista de Alunos (Mobile) */}
            <div className="md:hidden space-y-2 h-[300px] overflow-y-auto">
              {!localTurmas.alunos || localTurmas.alunos.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border rounded-md">
                  Nenhum aluno vinculado a essa turma.
                </div>
              ) : (
                (localTurmas.alunos || []).map((aluno) => (
                  <div
                    key={aluno.id}
                    className="border rounded-md p-3 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <strong className="text-sm block">{aluno.nome}</strong>
                        <span className="text-xs text-gray-500">
                          Matrícula: {aluno.matricula}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2 h-7 px-2"
                        onClick={() => handleRemoveStudent(aluno.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* --- ABA PROFESSORES / DISCIPLINAS --- */}
          <TabsContent value="professores" className="space-y-4 w-full">
            <div className="flex flex-col gap-4">
              {/* 1. SELECIONAR PROFESSOR (Permanece Select) */}
              <Select
                onValueChange={setSelectedProfessor}
                value={selectedProfessor || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                
                  {materias.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 2. SELEÇÃO DE MÚLTIPLAS DISCIPLINAS (Usando o novo componente) */}
              <div className="space-y-2 border rounded-md">
                <p className="text-sm font-medium leading-none p-3 border-b">
                  Disciplinas a vincular:
                </p>

                <MultiSelectContent
                  items={materias}
                  onSelectionChange={handleDisciplinesChange}
                />
              </div>

              {/* 3. BOTÃO VINCULAR */}
              <Button
                className="bg-blue-400 hover:bg-blue-500 cursor-pointer w-full"
                disabled={!selectedProfessor || disciplinesToLink.length === 0}
                onClick={() =>
                  console.log(
                    `Professor: ${selectedProfessor}, Disciplinas: ${disciplinesToLink}`
                  )
                }
              >
                Vincular ({disciplinesToLink.length} disciplina
                {disciplinesToLink.length !== 1 ? "s" : ""})
              </Button>
            </div>
            {/* ... restante da aba (tabela de vínculos) ... */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
