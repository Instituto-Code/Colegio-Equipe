import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useCoordenador } from "@/contexts/coordenadorContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IProfessor {
  matricula: string
  formacao: string
}

interface User {
  nome?: string;
  email?: string;
  role?: string;
  id: string;
}

export function Tools({ nome, role, id }: User) {
  // Hook para mudar a role para "professor"
  const [openDialogProf, setDialogProf] = useState(false)

  // Roles a serem Exibidas
  const roles: string[] = [
    "coordenador",
    "professor",
    "responsavel",
    "pendente",
  ];

  //React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfessor>({})

  const { registerParent, registerTeacher, loading } = useCoordenador()

  // Handler para mudar a role do usuário de acordo com o que ele selecionar.
  const handleRoleChange = (newRole: string) => {
    if (!id) return
    if (!roles.includes(newRole)) return

    if (newRole == "responsavel") {
      onSubmitResponsavel(id)
    }

    if (newRole == "professor") {
      setDialogProf(true)
    }
  }
  
  // Função para registrar um "responsavel".
  const onSubmitResponsavel = async(id: string) => {
    try{
      const res = await registerParent(id)

      toast.success(res.data.msg)
    }
    catch(error: any){
      console.error(error)
    }
  }

  // Função para registrar um "professor".
  const onSubmitProfessor = async (data: IProfessor) => {
    try {
      const res = await registerTeacher(id, data.matricula, data.formacao)

      toast.success(res.msg)
      setDialogProf(false)
    } catch (error: any) {
      toast.error(error.message)
      console.error(error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Editar</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-50" align="start">
          <DropdownMenuLabel className="font-bold">
            {nome} - {role}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Editar role</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {roles
                    .filter((r) => r !== role)
                    .map((r, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => {
                          console.log("clicou" + id)
                          handleRoleChange(r)
                        }}
                      >{r}</DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal para inserir os dados do Professor */}
      <Dialog open={openDialogProf} onOpenChange={setDialogProf}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl mb-3">Informações do professor</DialogTitle>
            <form onSubmit={handleSubmit(onSubmitProfessor)}>

              {/* Campo Matrícula */}
              <div className="flex flex-col ">
                <Label className="mb-2">Matricula do Professor</Label>
                <Input
                  placeholder="Ex: PF202501"
                  className={cn(
                    errors.matricula
                      ? "border-red-500 focus-visible:ring-red-500 "
                      : "border-gray-300 "
                  )}
                  {...register("matricula", {
                    required: "A matrícula é obrigatoria",
                    // Validação de matrícula
                    validate: (value) =>
                      /^PF\d{4}(0[1-9]|1[0-2])$/.test(value) ||
                      "Formato invalido. Use PF + ano + mes, exemplo: PF202501",
                  })} />
                {errors.matricula && (
                  <span className="text-sm text-red-500">
                    {errors.matricula.message}
                  </span>
                )}
              </div>

              {/* Campo Formação Acadêmica */}
              <div className="flex flex-col mt-2">
                <Label className="mb-2">Formação Acadêmica</Label>
                <Input
                  placeholder="Ex: Bacharel em Pedagogia"
                  className={cn(
                    errors.formacao
                      ? "border-red-500 focus-visible:ring-red-500 "
                      : "border-gray-300 "
                  )}
                  {...register('formacao', {
                    required: "A formação é obrigatória"
                  })}
                />
                {errors.formacao && (
                  <span className="text-sm text-red-500">
                    {errors.formacao?.message}
                  </span>
                )}
              </div>

              {/* Botão de envio do formulário */}
              <Button
                disabled={loading}
                type="submit"
                className="flex mt-5 w-full bg-blue-400 text-white hover:text-white hover:bg-blue-500 cursor-pointer"
              >
                {loading ? (
                  <span className="flex gap-1.5 items-center">
                    <Spinner /> Enviando dados ...
                  </span>
                ) : (
                  "Enviar"
                )}
              </Button>
            </form>

          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
