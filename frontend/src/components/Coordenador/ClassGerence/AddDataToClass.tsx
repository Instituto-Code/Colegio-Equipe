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
import { api_url } from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";

interface AddDataToClassProps {
  turma: ITurma;
  open: boolean;
  onClose: () => void;
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
}: AddDataToClassProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);


  const { token } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
        try{
            const res = await fetch(`${api_url}/api/coordenador/list-students`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            if(!open){
                setSelectedStudent(null);
            }

            const dataJson = await res.json();

            setStudents(dataJson.alunos);
        }
        catch(error){
            console.log(error);
        }
    };

    fetchStudents();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle>Gerenciar Turma: {turma.nome}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="alunos" className="w-100">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="professores">
              Professores / Disciplinas
            </TabsTrigger>
          </TabsList>

          {/* --- ABA ALUNOS --- */}
          <TabsContent value="alunos" className="space-y-4 w-full">
            <div className="flex gap-2">
              <Select onValueChange={(value) => setSelectedStudent(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="max-h-48">
                    {students.map((student) => (
                       <SelectItem key={student.id} value={student.id} >
                            <div className="text-sm p-1.5">{student.nome}</div>
                            
                        </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <Button
                disabled={!selectedStudent}
                className={`${!selectedStudent ? "bg-neutral-400 cursor-not-allowed" : "bg-blue-400 cursor-pointer hover:bg-blue-500"}`}
              >
                Adicionar
              </Button>
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>João Silva</TableCell>
                    <TableCell>2023101</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm">
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          {/* --- ABA PROFESSORES / DISCIPLINAS --- */}
          <TabsContent value="professores" className="space-y-4 w-full">
            <div className="flex flex-col">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="portugues">Português</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carlos">Carlos Silva</SelectItem>
                  <SelectItem value="ana">Ana Martins</SelectItem>
                </SelectContent>
              </Select>

              <Button>Vincular</Button>
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Professor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Matemática</TableCell>
                    <TableCell>Carlos Silva</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm">
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
